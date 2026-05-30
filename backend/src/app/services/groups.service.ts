import Safety from "../../common/helpers/safety.helper";
import { db } from "../../config/database.config";

export class GroupService {
  static async findAll() {
    return await db("groups").whereNot("id", 1).select(["id", "name"]);
  }

  static async groupExist(id: number) {
    return await db("groups").whereNot("id", 1).where("id", id).first();
  }

  static async permission(groupId: number, key: string) {
    groupId = Safety.number(groupId);

    return await db("group_access")
      .where({
        group_id: groupId,
        sidebar_key: key,
      })
      .select(["read", "create", "update", "delete"])
      .first();
  }

  static async save(data: AccessGroup[], id: number) {
    return await db.transaction(async (trx) => {
      await trx("group_access").where("group_id", id).delete();

      return await trx("group_access").insert(data);
    });
  }

  static async sidebarAccess(groupId: number): Promise<SidebarItem[]> {
    const rows = await db("sidebars")
      .modify((query) => {
        // -- except developer
        if (groupId == 1) {
          return;
        }

        query
          .whereIn("key", function () {
            this.select("sidebar_key")
              .from("group_access")
              .where("group_id", groupId)
              .where("read", true);
          })
          .orWhereIn("key", function () {
            this.select("parent_key")
              .from("sidebars")
              .whereIn("key", function () {
                this.select("sidebar_key")
                  .from("group_access")
                  .where("group_id", groupId)
                  .where("read", true);
              })
              .whereNotNull("parent_key");
          });
      })
      .select("key", "parent_key", "name", "icon", "route", "seq")
      .orderBy("seq", "asc");

    const parentMap = new Map<string, SidebarItem>();
    const result: SidebarItem[] = [];

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
}
