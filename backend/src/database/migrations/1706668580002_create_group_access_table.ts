import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("group_access", (table) => {
    table.integer("group_id").unsigned().notNullable();
    table.string("sidebar_key", 30).notNullable();

    table.boolean("read").defaultTo(false);
    table.boolean("create").defaultTo(false);
    table.boolean("update").defaultTo(false);
    table.boolean("delete").defaultTo(false);
    table.dateTime("created_at").nullable();
    table.dateTime("updated_at").nullable();

    // UNIQUE
    table.unique(["group_id", "sidebar_key"]);

    // FK -> groups.group_id
    table
      .foreign("group_id")
      .references("id")
      .inTable("groups")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");

    // FK -> sidebars.key
    table
      .foreign("sidebar_key")
      .references("key")
      .inTable("sidebars")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("groups");
}
