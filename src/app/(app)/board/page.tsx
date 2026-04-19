import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getThreads } from "@/features/threads/actions";
import { CreateThreadForm } from "./compornents/CreateThreadForm";

export default async function BoardPage() {
  const threads = await getThreads();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">スレッド一覧</h1>
      <CreateThreadForm />
      {threads.length === 0 ? (
        <p className="text-muted-foreground">
          まだスレッドがありません。最初のスレッドを作成しましょう。
        </p>
      ) : (
        <div className="space-y-3">
          {threads.map((thread) => (
            <Link key={thread.id} href={`/board/${thread.id}`}>
              <Card className="transition-colors hover:bg-muted/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{thread.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {thread._count.posts} 件の投稿 ・{" "}
                    {thread.createdAt.toLocaleDateString("ja-JP")}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
