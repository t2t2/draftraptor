var irc = require('irc');

var channel = '#auction';

var teams = {};
var players = {};

var activeAuction = null;

var client = new irc.Client('localhost', 'auctionraptor', {
	channels: [channel],
	debug: true,
	userName: 'auctionraptor',
	realName: 'The small brother of moderaptor',
});
client.addListener('error', function (message) {
	console.error('[ERROR]', message)
});

function handleLeave (nick) {
	delete players[nick];
	for (team in teams) {
		var index = teams[team].players.indexOf(nick);
		if(index > -1) {
			teams[team].players.splice(index, 1);
		}
	};
}
client.addListener('part'+channel, function (nick, reason, message) {
	handleLeave(nick);
});
client.addListener('quit', function (nick, reason, channels, message) {
	handleLeave(nick);
});
client.addListener('kick'+channel, function (nick, by, reason, message) {
	handleLeave(nick);
});
client.addListener('+mode', function (mchannel, by, mode, argument, message) {
	if(mchannel == channel && mode == 'o' && argument == client.nick) {
		client.say(channel, 'Auctionraptor activated');
		client.send('topic', channel, topicGen());
	}
});
client.addListener('message'+channel, function (nick, text, message) {
	var adminModes = {'~': true, '~+': true, '@': true, '@+': true, '+': false};
	if(client.chans[channel].users[nick] in adminModes && text.indexOf('!') == 0) {
		console.log('[COMMAND]', nick, text);
		var parts = text.split(' ');
		var admin = adminModes[client.chans[channel].users[nick]];
		var newTopic = false;
		if(parts[0] == '!addteam' && admin) {
			teams[parts[1]] = {
				name: parts[1],
				money: parseInt(parts[2]) || 100,
				players: [],
			};
			newTopic = true;
			client.say(channel, 'Team '+parts[1]+' (re)created. ('+nick+')');
		}
		if(parts[0] == '!addplayer' && admin) {
			if(!teams[parts[1]]) {
				client.say(channel, nick+': Team doesn\'t exist.');
				return;
			}
			players[parts[2]] = {
				name: parts[2],
				team: teams[parts[1]],
			};
			teams[parts[1]].players.push(parts[2]);
			newTopic = true;
			client.say(channel, 'Player '+parts[2]+' added to team '+parts[1]+'. ('+nick+')');
			client.send('mode', channel, '+v', parts[2]);
		}
		if(parts[0] == '!setmoney' && admin) {
			if(!teams[parts[1]]) {
				client.say(channel, nick+': Team doesn\'t exist.');
				return;
			}

			teams[parts[1]].money = parseInt(parts[2]);

			client.say(channel, 'Team '+parts[1]+' money changed to '+teams[parts[1]].money+'. ('+nick+')');
		}
		if(parts[0] == '!start' && admin) {
			activeAuction = {
				text: parts[1],
				open: true,
				timed: false,
				countdown: null,
				bids: {},
				bestBid: 0,
				bestBidTeam: null,
			}
			var length = parseInt(parts[2]);
			if(length) {
				var timeExtension = parseInt(parts[3]);
				activeAuction.timed = true;
				activeAuction.timeLeft = length;
				activeAuction.timeExtension = timeExtension;
				resetCountdown();
			}

			newTopic = true;
			client.say(channel, irc.colors.wrap('dark_red', 'Auction Started: '+activeAuction.text+' ('+nick+')'));
		}
		if(parts[0] == '!close' && admin) {
			if(!activeAuction) return;
			if(activeAuction.countdown) {
				clearTimeout(activeAuction.countdown);
			}
			activeAuction.bestBidTeam.money -= activeAuction.bestBid;
			activeAuction = null;

			newTopic = true;
			client.say(channel, irc.colors.wrap('dark_blue', 'Auction Closed & Money Updated ('+nick+')'));
		}
		if(parts[0] == '!cancel' && admin) {
			if(!activeAuction) return;
			if(activeAuction.countdown) {
				clearTimeout(activeAuction.countdown);
			}
			activeAuction = null;

			newTopic = true;
			client.say(channel, irc.colors.wrap('dark_blue', 'Auction Canceled ('+nick+')'));
		}
		if(parts[0] == '!stats') {
			client.say(channel, irc.colors.wrap('dark_blue', 'Current stats:'));
			for(team in teams) {
				client.say(channel, 'Team: '+teams[team].name+' ('+teams[team].players.join(', ')+') - '+teams[team].money);
			}
		}
		if(parts[0] == '!bid') {
			if(!players[nick]) {
				return;
			}
			var team = players[nick].team;
			var bid = parseInt(parts[1]);
			if(!activeAuction || !activeAuction.open) {
				client.say(channel, irc.colors.wrap('dark_red', nick+': No active auction.'));
				return;
			}
			if(!team) {
				client.say(channel, irc.colors.wrap('dark_red', nick+': You\'re not on a team.'));
				return;
			}
			if(!bid) {
				client.say(channel, irc.colors.wrap('dark_red', nick+': Not a valid bid.'));
				return;
			}
			if(bid > team.money) {
				client.say(channel, irc.colors.wrap('dark_red', nick+': Not enough money. ('+team.money+')'));
				return;
			}
			if(bid <= activeAuction.bestBid) {
				client.say(channel, irc.colors.wrap('dark_red', nick+': Lower than current highest bid. ('+activeAuction.bestBid+')'));
				return;
			}

			activeAuction.bids[team.name] = bid;
			activeAuction.bestBid = bid;
			activeAuction.bestBidTeam = team;

			client.say(channel, irc.colors.wrap('dark_green', 'New leader: '+team.name+' - '+bid+' ('+nick+')'));
			resetCountdown();
		}

		if(newTopic) {
			client.send('topic', channel, topicGen());
		}
	}
});


function topicGen() {
	var string = 'Active Auction: ';
	if(activeAuction) {
		string += activeAuction.text;
	} else {
		string += '-';
	}
	string += ' | Active teams: '+Object.keys(teams).length;
	string += ' | Active players: '+Object.keys(players).length;
	var opercount = 0;
	for(nick in client.chans[channel].users) {
		if(nick != client.nick && client.chans[channel].users[nick] == '@') {
			opercount += 1;
		}
	}
	string += ' | Active moderators: '+opercount;
	return string;
}
function resetCountdown () {
	if(!activeAuction) return;

	if(activeAuction.timed) {
		if(activeAuction.countdown) {
			if(activeAuction.timeExtension && activeAuction.timeLeft < activeAuction.timeExtension) {
				activeAuction.timeLeft += activeAuction.timeExtension;
				client.say(channel, irc.colors.wrap('dark_blue', 'Last second sniper!')+' '+activeAuction.timeExtension+'s added!');
			}
			return;
		}

		function timedown () {
			activeAuction.timeLeft -= 1;

			if(activeAuction.timeLeft > 0) {
				if(activeAuction.timeLeft % 5 == 0 || activeAuction.timeLeft < 5) {
					var string = activeAuction.timeLeft+' seconds left! | Highest Bid: ';
					if(activeAuction.bestBidTeam) {
						string += activeAuction.bestBidTeam.name+' for '+activeAuction.bestBid;
					} else {
						string += 'No bids';
					}
					client.say(channel, irc.colors.wrap('dark_blue', string));
				}
				activeAuction.countdown = setTimeout(timedown, 1000);
			} else {
				if(activeAuction.bestBidTeam) {
					client.say(channel, irc.colors.wrap('dark_red', 'Sold to '+activeAuction.bestBidTeam.name+' for '+activeAuction.bestBid));
				} else {
					client.say(channel, irc.colors.wrap('dark_red', 'Recieved no bids :('));
				}
				activeAuction.open = false;
			}
		};

		activeAuction.countdown = setTimeout(timedown, 1000);

		return;
	}


	clearTimeout(activeAuction.countdown);
	activeAuction.countdown = setTimeout(function () {
		// Welcome to callback hell
		client.say(channel, irc.colors.wrap('dark_red', 'Going once... ('+activeAuction.bestBidTeam.name+' for '+activeAuction.bestBid+')'));

		activeAuction.countdown = setTimeout(function () {
			// Welcome to callback hell
			client.say(channel, irc.colors.wrap('dark_red', 'Going twice... ('+activeAuction.bestBidTeam.name+' for '+activeAuction.bestBid+')'));

			activeAuction.countdown = setTimeout(function () {
				// Welcome to callback hell
				client.say(channel, irc.colors.wrap('dark_red', 'Sold to '+activeAuction.bestBidTeam.name+' for '+activeAuction.bestBid));
				activeAuction.open = false;
			}, 5000);
		}, 5000);

	}, 6000)
}


process.on('uncaughtException', function (exception) {
	// YOLO (you only have one chance)
	console.error(exception);
});