import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { postFactory } from "@/test/factories/post";
import { threadFactory } from "@/test/factories/thread";
import { getTestPrisma } from "@/test/helpers";

vi.mock("@/lib/prisma");
vi.mock("next/link");
vi.mock("next/navigation");
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("ThreadPage", () => {
  it("存在しないスレッドにアクセスした時、notFound が呼ばれる", async () => {
    // Arrange - なし

    // Act & Assert
    const { default: ThreadPage } = await import(
      "@/app/(app)/board/[threadId]/page"
    );
    await expect(
      ThreadPage({ params: Promise.resolve({ threadId: "nonexistent" }) }),
    ).rejects.toThrow("NEXT_NOT_FOUND");
  });

  it("投稿がないスレッドを表示した時、タイトルと空メッセージが表示される", async () => {
    // Arrange
    const thread = await threadFactory.create({ title: "テストスレッド" });

    // Act
    const { default: ThreadPage } = await import(
      "@/app/(app)/board/[threadId]/page"
    );
    const jsx = await ThreadPage({
      params: Promise.resolve({ threadId: thread.id }),
    });
    render(jsx);

    // Assert
    expect(
      screen.getByRole("heading", { level: 1, name: "テストスレッド" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("まだ投稿がありません。最初の投稿をしましょう。"),
    ).toBeInTheDocument();
  });

  it("投稿があるスレッドを表示した時、投稿一覧が表示される", async () => {
    // Arrange
    const thread = await threadFactory.create({ title: "投稿テスト" });
    await postFactory.create({
      threadId: thread.id,
      author: "太郎",
      content: "こんにちは",
    });
    await postFactory.create({
      threadId: thread.id,
      author: "花子",
      content: "こんばんは",
    });

    // Act
    const { default: ThreadPage } = await import(
      "@/app/(app)/board/[threadId]/page"
    );
    const jsx = await ThreadPage({
      params: Promise.resolve({ threadId: thread.id }),
    });
    render(jsx);

    // Assert
    expect(screen.getByText("太郎")).toBeInTheDocument();
    expect(screen.getByText("こんにちは")).toBeInTheDocument();
    expect(screen.getByText("花子")).toBeInTheDocument();
    expect(screen.getByText("こんばんは")).toBeInTheDocument();
  });

  it("スレッドを表示した時、投稿フォームが表示される", async () => {
    // Arrange
    const thread = await threadFactory.create({ title: "フォームテスト" });

    // Act
    const { default: ThreadPage } = await import(
      "@/app/(app)/board/[threadId]/page"
    );
    const jsx = await ThreadPage({
      params: Promise.resolve({ threadId: thread.id }),
    });
    render(jsx);

    // Assert
    const form = screen.getByRole("form", { name: "投稿作成" });
    expect(form).toBeInTheDocument();
    expect(
      within(form).getByRole("textbox", { name: "名前" }),
    ).toBeInTheDocument();
    expect(
      within(form).getByRole("textbox", { name: "内容" }),
    ).toBeInTheDocument();
    expect(
      within(form).getByRole("button", { name: "投稿する" }),
    ).toBeInTheDocument();
  });

  it("スレッドを表示した時、スレッド一覧に戻るリンクが表示される", async () => {
    // Arrange
    const thread = await threadFactory.create({ title: "リンクテスト" });

    // Act
    const { default: ThreadPage } = await import(
      "@/app/(app)/board/[threadId]/page"
    );
    const jsx = await ThreadPage({
      params: Promise.resolve({ threadId: thread.id }),
    });
    render(jsx);

    // Assert
    const backLink = screen.getByRole("link", {
      name: /スレッド一覧に戻る/,
    });
    expect(backLink).toHaveAttribute("href", "/board");
  });

  it("名前と内容を入力して送信した時、投稿が作成される", async () => {
    // Arrange
    const user = userEvent.setup();
    const thread = await threadFactory.create({ title: "投稿テスト" });
    const { default: ThreadPage } = await import(
      "@/app/(app)/board/[threadId]/page"
    );
    const jsx = await ThreadPage({
      params: Promise.resolve({ threadId: thread.id }),
    });
    render(jsx);

    // Act
    const form = screen.getByRole("form", { name: "投稿作成" });
    await user.type(
      within(form).getByRole("textbox", { name: "名前" }),
      "太郎",
    );
    await user.type(
      within(form).getByRole("textbox", { name: "内容" }),
      "こんにちは",
    );
    await user.click(within(form).getByRole("button", { name: "投稿する" }));

    // Assert
    const prisma = getTestPrisma();
    await waitFor(async () => {
      const posts = await prisma.post.findMany({
        where: { threadId: thread.id },
      });
      expect(posts).toHaveLength(1);
      expect(posts[0].author).toBe("太郎");
      expect(posts[0].content).toBe("こんにちは");
    });
  });

  it("名前が空のまま送信した時、投稿が作成されない", async () => {
    // Arrange
    const user = userEvent.setup();
    const thread = await threadFactory.create({
      title: "バリデーションテスト",
    });
    const { default: ThreadPage } = await import(
      "@/app/(app)/board/[threadId]/page"
    );
    const jsx = await ThreadPage({
      params: Promise.resolve({ threadId: thread.id }),
    });
    render(jsx);

    // Act
    const form = screen.getByRole("form", { name: "投稿作成" });
    await user.type(
      within(form).getByRole("textbox", { name: "内容" }),
      "こんにちは",
    );
    await user.click(within(form).getByRole("button", { name: "投稿する" }));

    // Assert
    const prisma = getTestPrisma();
    const posts = await prisma.post.findMany({
      where: { threadId: thread.id },
    });
    expect(posts).toHaveLength(0);
  });

  it("内容が空のまま送信した時、投稿が作成されない", async () => {
    // Arrange
    const user = userEvent.setup();
    const thread = await threadFactory.create({
      title: "バリデーションテスト",
    });
    const { default: ThreadPage } = await import(
      "@/app/(app)/board/[threadId]/page"
    );
    const jsx = await ThreadPage({
      params: Promise.resolve({ threadId: thread.id }),
    });
    render(jsx);

    // Act
    const form = screen.getByRole("form", { name: "投稿作成" });
    await user.type(
      within(form).getByRole("textbox", { name: "名前" }),
      "太郎",
    );
    await user.click(within(form).getByRole("button", { name: "投稿する" }));

    // Assert
    const prisma = getTestPrisma();
    const posts = await prisma.post.findMany({
      where: { threadId: thread.id },
    });
    expect(posts).toHaveLength(0);
  });
});
