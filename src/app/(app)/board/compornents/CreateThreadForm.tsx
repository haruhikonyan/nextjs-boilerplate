"use client";

import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createThread } from "../actions";
import { createThreadSchema } from "../schema";

export function CreateThreadForm() {
  const [lastResult, action, isPending] = useActionState(createThread, null);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: createThreadSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  return (
    <form
      id={form.id}
      onSubmit={form.onSubmit}
      action={action}
      className="flex gap-2"
      aria-label="スレッド作成"
      noValidate
    >
      <div className="flex-1">
        <Input
          key={fields.title.key}
          id={fields.title.id}
          name={fields.title.name}
          placeholder="新しいスレッドのタイトル"
          aria-label="スレッドタイトル"
          aria-invalid={!fields.title.valid || undefined}
          aria-describedby={
            !fields.title.valid ? `${fields.title.id}-error` : undefined
          }
        />
        {fields.title.errors && (
          <p
            id={`${fields.title.id}-error`}
            className="mt-1 text-sm text-destructive"
            role="alert"
          >
            {fields.title.errors[0]}
          </p>
        )}
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? "作成中..." : "作成"}
      </Button>
    </form>
  );
}
