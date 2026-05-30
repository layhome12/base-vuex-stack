import { z } from "zod";

export const GroupRequest = z
  .array(
    z.object({
      sidebar_key: z.string().min(1, "Sidebar key is required"),
      read: z.boolean(),
      create: z.boolean(),
      update: z.boolean(),
      delete: z.boolean(),
    }),
  )
  .min(1, "Access data is required");

export type GroupRequestType = z.infer<typeof GroupRequest>;
