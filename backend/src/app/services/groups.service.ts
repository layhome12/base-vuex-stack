import Safety from "../../common/helpers/safety.helper";
import { db } from "../../config/database.config";

export class GroupService {
  static async findAll() {
    return await db("groups").whereNot("id", 1).select(["id", "name"]);
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
}
