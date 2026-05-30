import { Request, Response as ExResponse } from "express";
import Response from "../../common/helpers/response.helper";
import { GroupService } from "../services/groups.service";
import Safety from "../../common/helpers/safety.helper";

export class GroupsController {
  static async index(_: Request, res: ExResponse): Promise<Response> {
    const data = await GroupService.findAll();
    return Response.http(res, 200, "Fetch successful", data);
  }

  static async access(req: Request, res: ExResponse): Promise<Response> {
    try {
      const gId = Safety.number(req.params.id as string);

      // -- check
      const exist = await GroupService.groupExist(gId);
      if (!exist) {
        return Response.http(res, 404, "Group not found");
      }

      const data = req.body;
      const access: AccessGroup[] = data.map((e: any) => ({
        group_id: gId,
        sidebar_key: e.sidebar_key,
        read: e.read,
        create: e.create,
        update: e.update,
        delete: e.delete,
      }));

      await GroupService.save(access, gId);
      return Response.http(res, 200, "Save successful");
    } catch (error) {
      console.log(error);
      return Response.http(res, 500, "Something wrong when save data");
    }
  }
}
