import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { redirect } from "next/navigation";
import { describe, expect, it, vi } from "vitest";
import { threadFactory } from "@/test/factories/thread";
import { getTestPrisma } from "@/test/helpers";

vi.mock("@/lib/prisma");
vi.mock("next/link");
vi.mock("next/navigation");

describe("BoardPage", () => {
  it("スレッドがない時、空メッセージが表示される", async () => {
    // Arrange - なし

    // Act
    const { default: BoardPage } = await import("@/app/(app)/board/page");
    const jsx = await BoardPage();
    render(jsx);

    // Assert
    expect(
      screen.getByRole("heading", { name: "スレッド一覧" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "まだスレッドがありません。最初のスレッドを作成しましょう。",
      ),
    ).toBeInTheDocument();
  });

  it("スレッドがある時、スレッド一覧が表示される", async () => {
    // Arrange
    const thread1 = await threadFactory.create({ title: "テストスレッド1" });
    await threadFactory.create({ title: "テストスレッド2" });
    const prisma = getTestPrisma();
    await prisma.post.createMany({
      data: [
        { threadId: thread1.id, author: "user1", content: "post1" },
        { threadId: thread1.id, author: "user2", content: "post2" },
      ],
    });

    // Act
    const { default: BoardPage } = await import("@/app/(app)/board/page");
    const jsx = await BoardPage();
    render(jsx);

    // Assert
    expect(
      screen.getByRole("link", { name: /テストスレッド1/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /テストスレッド2/ }),
    ).toBeInTheDocument();
    expect(screen.getByText(/2 件の投稿/)).toBeInTheDocument();
  });

  it("ページを表示した時、スレッド作成フォームが表示される", async () => {
    // Arrange - なし

    // Act
    const { default: BoardPage } = await import("@/app/(app)/board/page");
    const jsx = await BoardPage();
    render(jsx);

    // Assert
    const form = screen.getByRole("form", { name: "スレッド作成" });
    expect(form).toBeInTheDocument();
    expect(
      within(form).getByRole("textbox", { name: "スレッドタイトル" }),
    ).toBeInTheDocument();
    expect(
      within(form).getByRole("button", { name: "作成" }),
    ).toBeInTheDocument();
  });

  it("タイトルを入力して送信した時、スレッドが作成されリダイレクトされる", async () => {
    // Arrange
    const user = userEvent.setup();
    const { default: BoardPage } = await import("@/app/(app)/board/page");
    const jsx = await BoardPage();
    render(jsx);
    vi.mocked(redirect).mockClear();

    // Act
    await user.type(
      screen.getByRole("textbox", { name: "スレッドタイトル" }),
      "新しいスレッド",
    );
    await user.click(screen.getByRole("button", { name: "作成" }));

    // Assert
    const prisma = getTestPrisma();
    await waitFor(async () => {
      const threads = await prisma.thread.findMany();
      expect(threads).toHaveLength(1);
      expect(threads[0].title).toBe("新しいスレッド");
      expect(redirect).toHaveBeenCalledWith(`/board/${threads[0].id}`);
    });
  });

  it("タイトルが空のまま送信した時、スレッドが作成されない", async () => {
    // Arrange
    const user = userEvent.setup();
    const { default: BoardPage } = await import("@/app/(app)/board/page");
    const jsx = await BoardPage();
    render(jsx);

    // Act
    await user.click(screen.getByRole("button", { name: "作成" }));

    // Assert
    const prisma = getTestPrisma();
    const threads = await prisma.thread.findMany();
    expect(threads).toHaveLength(0);
  });
});
