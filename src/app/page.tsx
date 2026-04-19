import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">掲示板アプリ</h1>
      <p className="text-muted-foreground">
        誰でも自由にスレッドを作成し、投稿できる掲示板です。
      </p>
      <Link href="/board" className={buttonVariants()}>
        掲示板へ
      </Link>
    </div>
  );
}
