Warning: The code is shitty. It's a 4h hackathon. Deal with it.

Manual:

To activate: Set auctionraptor to channel operator status.

Commands:

Anyone +v or +o:

* !stats - Outputs current teams and their money
* !bid {amount} - Enters a bid for <amount>.

(Fun fact "!bid 1 dollar, bob" works, as long as the number is first argument and clearly separated by space. Really anything can be 2+ arguments as long as first is a number)

Anyone +o:

* !addteam {team} (money) - Creates a team with name <team>. Optionally can be added how much money team will have in the beginning
* !addplayer {team} {username} - Adds a player to a team, +v-ing them in process. Be careful with entry order.
* !setmoney {team} {money} - Set's teams money.
* !start {name} (countdown) (snipetime) - Starts an auction "name". If countdown is not set or 0 runs normal (once, twice, sold) auction, otherwise stops after countdown seconds. If snipetime is set, the time limit is extended by snipetime if time is lower than snipetime when a bid happens. Warning: name can't include spaces
* !close - Closes auction and winning bid's bid is removed from their money.
* !cancel - Closes auction without taking money.
