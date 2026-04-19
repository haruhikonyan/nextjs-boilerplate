import { faker } from "@faker-js/faker";
import type { Post } from "@prisma/client";
import { Factory } from "fishery";
import { getTestPrisma } from "@/test/helpers";

export const postFactory = Factory.define<Post>(({ onCreate }) => {
  onCreate(async (post) => {
    const prisma = getTestPrisma();
    return prisma.post.create({
      data: {
        author: post.author,
        content: post.content,
        threadId: post.threadId,
      },
    });
  });

  return {
    id: faker.string.nanoid(),
    author: faker.person.fullName(),
    content: faker.lorem.paragraph(),
    createdAt: faker.date.recent(),
    threadId: "",
  };
});
