import Link from "next/link";

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <header className="border-b bg-background">
        <div className="mx-auto flex h-14 max-w-3xl items-center px-4">
          <Link href="/board" className="text-lg font-bold">
            掲示板
          </Link>
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">
        {children}
      </main>
    </>
  );
}
