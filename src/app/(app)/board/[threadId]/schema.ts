import { z } from "zod";

export const createPostSchema = z.object({
  threadId: z.string(),
  author: z.string().min(1, "名前を入力してください"),
  content: z.string().min(1, "内容を入力してください"),
});
