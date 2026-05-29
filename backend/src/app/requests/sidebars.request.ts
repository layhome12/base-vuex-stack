import { z } from "zod";
import { db } from "../../config/database.config";

export const SidebarRequest = z
  .object({
    key: z.string().min(1, "Key is required").max(30, "Key max 30 characters"),
    parent_key: z
      .string()
      .max(30, "Parent key max 30 characters")
      .nullable()
      .optional(),
    seq: z
      .number()
      .int("Sequence must be integer")
      .min(1, "Sequence minimum 1"),
    name: z
      .string()
      .min(1, "Name is required")
      .max(60, "Name max 60 characters"),
    icon: z.string().max(60, "Icon max 60 characters").optional().default(""),
    route: z
      .string()
      .min(1, "Route is required")
      .max(250, "Route max 250 characters"),
  })
  .superRefine(async (data, ctx) => {
    const existingKey = await db("sidebars").where("key", data.key).first();

    if (existingKey) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["key"],
        message: "Key already exists",
      });
    }

    // cek parent_key exists
    if (data.parent_key) {
      const parentExists = await db("sidebars")
        .where("key", data.parent_key)
        .where("parent_key", null)
        .first();

      if (!parentExists) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["parent_key"],
          message: "Parent key not found",
        });
      }
    }
  });

export type SidebarRequestType = z.infer<typeof SidebarRequest>;
