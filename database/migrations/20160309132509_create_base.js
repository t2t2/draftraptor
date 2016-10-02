// These all are from v1 of draftrapor#web

export async function up(knex) {
	await knex.schema.createTable('settings', table => {
		table.increments('id')
		table.integer('money')
		table.integer('timer')
		table.integer('start_timer')
		table.timestamps()
	})

	await knex.schema.createTable('teams', table => {
		table.increments('id')
		table.string('name')
		table.string('auth_key', 128).unique()
		table.string('color').defaultTo('white')
		table.integer('money')
		table.timestamps()
	})

	await knex.schema.createTable('items', table => {
		table.increments('id')
		table.string('name')
		table.integer('team_id').nullable().unsigned().references('id').inTable('teams').onUpdate('CASCADE').onDelete('SET NULL')
		table.integer('sold')
		table.dateTime('start_time')
		table.dateTime('min_end_time')
		table.timestamps()
	})

	await knex.schema.createTable('bids', table => {
		table.increments('id')
		table.integer('item_id').unsigned().references('id').inTable('items').onUpdate('CASCADE').onDelete('CASCADE')
		table.integer('team_id').unsigned().references('id').inTable('teams').onUpdate('CASCADE').onDelete('CASCADE')
		table.integer('amount')
		table.dateTime('bid_time')
		table.timestamps()
	})

	await knex.schema.table('settings', table => {
		table.integer('item_id').unsigned().nullable().references('id').inTable('items').onUpdate('CASCADE').onDelete('SET NULL')
	})

	await knex('settings').insert({
		id: 1,
		money: 100,
		timer: 15,
		start_timer: 5, // eslint-disable-line camelcase
		created_at: knex.fn.now(), // eslint-disable-line camelcase
		updated_at: knex.fn.now() // eslint-disable-line camelcase
	})
}

export async function down(knex) {
	try {
		await knex.schema.table('settings', table => {
			table.dropForeign('item_id')
		})
	} catch (err) {
		// knex + sqlite bug?
		if (err.message !== 'Method implemented in the dialect driver') {
			throw err
		}
	}

	await knex.schema.dropTable('bids')
	await knex.schema.dropTable('items')
	await knex.schema.dropTable('teams')
	await knex.schema.dropTable('settings')
}
