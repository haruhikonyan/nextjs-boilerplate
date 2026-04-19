import { z } from "zod";

export const createThreadSchema = z.object({
  title: z.string().min(1, "タイトルを入力してください"),
});
