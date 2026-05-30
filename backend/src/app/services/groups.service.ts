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
}
