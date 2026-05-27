import { db } from "../../config/database.config";

export class GroupService {
  static async findAll() {
    return await db("groups").whereNot("id", 1).select(["id", "name"]);
  }
}
