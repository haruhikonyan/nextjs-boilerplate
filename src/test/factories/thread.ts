import { faker } from "@faker-js/faker";
import type { Thread } from "@prisma/client";
import { Factory } from "fishery";
import { getTestPrisma } from "@/test/helpers";

export const threadFactory = Factory.define<Thread>(({ onCreate }) => {
  onCreate(async (thread) => {
    const prisma = getTestPrisma();
    return prisma.thread.create({
      data: {
        title: thread.title,
      },
    });
  });

  return {
    id: faker.string.nanoid(),
    title: faker.lorem.sentence(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
  };
});
