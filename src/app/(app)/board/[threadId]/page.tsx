import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getThread } from "@/features/threads/actions";
import { CreatePostForm } from "./compornents/CreatePostForm";

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ threadId: string }>;
}) {
  const { threadId } = await params;
  const thread = await getThread(threadId);

  if (!thread) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/board"
          className="text-sm text-muted-foreground hover:underline"
        >
          &larr; スレッド一覧に戻る
        </Link>
        <h1 className="mt-2 text-2xl font-bold">{thread.title}</h1>
      </div>

      {thread.posts.length === 0 ? (
        <p className="text-muted-foreground">
          まだ投稿がありません。最初の投稿をしましょう。
        </p>
      ) : (
        <div className="space-y-3">
          {thread.posts.map((post) => (
            <Card key={post.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  {post.author}
                  <span className="ml-2 font-normal text-muted-foreground">
                    {post.createdAt.toLocaleDateString("ja-JP")}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{post.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="rounded-lg border p-4">
        <h2 className="mb-3 text-lg font-semibold">投稿する</h2>
        <CreatePostForm threadId={threadId} />
      </div>
    </div>
  );
}
