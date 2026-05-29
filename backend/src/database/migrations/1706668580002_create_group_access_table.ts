import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("group_access", (table) => {
    table.string("group_id", 30).primary();
    table.string("sidebar_key", 30).primary();
    table.boolean('read').defaultTo(false);
    table.boolean('create').defaultTo(false);
    table.boolean('update').defaultTo(false);
    table.boolean('delete').defaultTo(false);
    table.dateTime("created_at").nullable();
    table.dateTime("updated_at").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("groups");
}
