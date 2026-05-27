import { Request, Response as ExResponse } from "express";
import Response from "../../common/helpers/response.helper";
import { GroupService } from "../services/groups.service";

export class GroupsController {
  static async index(_: Request, res: ExResponse): Promise<Response> {
    const data = await GroupService.findAll();
    return Response.http(res, 200, "Fetch successful", data);
  }
}
