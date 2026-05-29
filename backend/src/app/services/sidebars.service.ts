import Dates from "../../common/helpers/date.helper";
import { db } from "../../config/database.config";

export class SidebarService {
  static async findAll(): Promise<SidebarItem[]> {
    const rows = await db("sidebars")
      .select("key", "parent_key", "name", "icon", "route", "seq")
      .orderBy([
        { column: "seq", order: "asc" },
        { column: "created_at", order: "asc" },
      ]);

    const parentMap = new Map<string, SidebarItem>();
    const result: SidebarItem[] = [];

    // First pass -> parent
    for (const row of rows) {
      if (!row.parent_key) {
        const parent: SidebarItem = {
          key: row.key,
          parent_key: row.parent_key,
          name: row.name,
          icon: row.icon,
          route: row.route,
          seq: row.seq,
          childs: [],
        };

        parentMap.set(row.key, parent);
        result.push(parent);
      }
    }

    // Second pass -> childs
    for (const row of rows) {
      if (row.parent_key) {
        const parent = parentMap.get(row.parent_key);

        if (parent) {
          parent.childs.push({
            key: row.key,
            parent_key: row.parent_key,
            name: row.name,
            icon: row.icon,
            route: row.route,
            seq: row.seq,
          });
        }
      }
    }

    return result;
  }

  static async create(body: SidebarChild) {
    await db("sidebars").insert({
      ...body,
      created_at: Dates.now(),
    });
  }
}
