import { Request, Response as ExResponse } from "express";
import Response from "../../common/helpers/response.helper";
import { SidebarService } from "../services/sidebars.service";

export class SidebarController {
  static async index(_: Request, res: ExResponse): Promise<Response> {
    const data = await SidebarService.findAll();
    return Response.http(res, 200, "Fetch successful", data);
  }

  static async create(req: Request, res: ExResponse): Promise<Response> {
    try {
      const body = req.body;

      // -- save
      await SidebarService.create({
        key: body.key,
        parent_key: body.parent_key ?? null,
        seq: body.seq,
        name: body.name,
        icon: body.icon,
        route: body.route,
      });

      return Response.http(res, 200, "Save successful");
    } catch (err) {
      return Response.http(res, 500, "Something wrong when save data");
    }
  }
}
