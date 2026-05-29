import { Request, Response as ExResponse, NextFunction } from "express";
import Response from "../../common/helpers/response.helper";
import { GroupService } from "../services/groups.service";

const AccessGuard = (key: string) => {
  return async (req: Request, res: ExResponse, next: NextFunction) => {
    try {
      const auth = req["user"] as JwtPayload;

      if (auth.gid == 1) {
        next();
        return;
      }

      // mapping method -> permission column
      let permissionColumn: string;

      switch (req.method) {
        case "GET":
          permissionColumn = "read";
          break;
        case "POST":
          permissionColumn = "create";
          break;
        case "PUT":
          permissionColumn = "update";
          break;
        case "DELETE":
          permissionColumn = "delete";
          break;
      }

      if (!permissionColumn) {
        return Response.http(res, 403, "Route method is not allowed");
      }

      const access = await GroupService.permission(auth.gid, key);
      if (!access || !access[permissionColumn]) {
        return Response.http(res, 403, "Permission is not allowed");
      }

      next();
    } catch (error: any) {
      return Response.http(res, 403, "Forbidden");
    }
  };
};

export default AccessGuard;
