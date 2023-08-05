import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid()).notNullable()
    table.text('title').index().notNullable()
    table.text('description')
    table.dateTime('time').notNullable()
    table.boolean('is_on_the_diet').defaultTo(false).notNullable()

    table.uuid('user_id').notNullable()
    table.foreign('user_id').references('id').inTable('users')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals')
}
