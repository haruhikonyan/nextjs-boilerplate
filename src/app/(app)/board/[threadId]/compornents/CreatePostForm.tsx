"use client";

import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createPost } from "../actions";
import { createPostSchema } from "../schema";

export function CreatePostForm({ threadId }: { threadId: string }) {
  const [lastResult, action, isPending] = useActionState(createPost, null);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: createPostSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  return (
    <form
      id={form.id}
      onSubmit={form.onSubmit}
      action={action}
      className="space-y-3"
      aria-label="投稿作成"
      noValidate
    >
      <input type="hidden" name={fields.threadId.name} value={threadId} />
      <div>
        <Label htmlFor={fields.author.id}>名前</Label>
        <Input
          key={fields.author.key}
          id={fields.author.id}
          name={fields.author.name}
          placeholder="名前を入力"
          aria-invalid={!fields.author.valid || undefined}
          aria-describedby={
            !fields.author.valid ? `${fields.author.id}-error` : undefined
          }
        />
        {fields.author.errors && (
          <p
            id={`${fields.author.id}-error`}
            className="mt-1 text-sm text-destructive"
            role="alert"
          >
            {fields.author.errors[0]}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor={fields.content.id}>内容</Label>
        <Textarea
          key={fields.content.key}
          id={fields.content.id}
          name={fields.content.name}
          placeholder="投稿内容を入力"
          rows={3}
          aria-invalid={!fields.content.valid || undefined}
          aria-describedby={
            !fields.content.valid ? `${fields.content.id}-error` : undefined
          }
        />
        {fields.content.errors && (
          <p
            id={`${fields.content.id}-error`}
            className="mt-1 text-sm text-destructive"
            role="alert"
          >
            {fields.content.errors[0]}
          </p>
        )}
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? "投稿中..." : "投稿する"}
      </Button>
    </form>
  );
}
