export async function up(knex) {
	await knex.schema.table('bids', table => {
		table.string('username')
		table.integer('share')
	})
}

export async function down(knex) {
	await knex.schema.table('bids', table => {
		table.dropColumns('username', 'share')
	})
}
