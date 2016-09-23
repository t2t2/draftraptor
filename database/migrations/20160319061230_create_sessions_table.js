export async function up(knex) {
	await knex.schema.createTable('sessions', table => {
		table.increments('id')
		table.string('username')
		table.integer('team_id').nullable().references('id').inTable('teams').onUpdate('CASCADE').onDelete('SET NULL')
		table.boolean('admin')
		table.timestamps()
	})
}

export async function down(knex) {
	await knex.schema.dropTable('sessions')
}
