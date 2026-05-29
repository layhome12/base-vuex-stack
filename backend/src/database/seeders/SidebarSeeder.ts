import { Knex } from "knex";
import { SeederInterface } from "./MainSeeder";
import Dates from "../../common/helpers/date.helper";

export default class SidebarSeeder implements SeederInterface {
  public async run(knex: Knex): Promise<void> {
    let rows = [
      {
        key: "dashboard",
        parent_key: null as string,
        name: "Dashboard",
        icon: "house-heart",
        route: "/admin/dashboard",
        seq: 1,
      },
      {
        key: "system",
        parent_key: null as string,
        name: "System",
        icon: "square-terminal",
        route: "#",
        seq: 99,
      },
      {
        key: "users",
        parent_key: "system",
        name: "Users",
        icon: "user-round-cog",
        route: "/admin/system/users",
        seq: 1,
      },
      {
        key: "groups",
        parent_key: "system",
        name: "Groups",
        icon: "user-round-key",
        route: "/admin/system/groups",
        seq: 2,
      },
      {
        key: "sidebars",
        parent_key: "system",
        name: "Sidebar",
        icon: "columns-3-cog",
        route: "/admin/system/sidebars",
        seq: 3,
      },
    ];

    rows.map((item) => ({
      ...item,
      created_at: Dates.now(),
    }));

    await knex("sidebars").insert(rows);
  }
}
