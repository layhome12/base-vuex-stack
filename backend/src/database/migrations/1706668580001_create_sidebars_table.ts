import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("sidebars", (table) => {
    table.string("key", 30).primary();
    table.string("parent_key", 30).nullable();
    table.integer("seq", 5);
    table.string("name", 60);
    table.string("icon", 60);
    table.string("route", 250);
    table.dateTime("created_at").nullable();
    table.dateTime("updated_at").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("groups");
}
