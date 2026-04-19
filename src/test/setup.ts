import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeEach } from "vitest";
import { cleanDatabase, disconnectDatabase } from "./helpers";

afterEach(() => {
  cleanup();
});

beforeEach(async () => {
  await cleanDatabase();
});

afterAll(async () => {
  await cleanDatabase();
  await disconnectDatabase();
});
