import { rejects } from "node:assert/strict";
import { test } from "uvu";
import { equal } from "uvu/assert";
import { discoverFiles } from "../discover-files.js";

test("01 - discovery preserves duplicates within a batch and removes later repeats", async () => {
  const result = await discoverFiles(["one", "two"], {
    findFiles: async ([pattern]) =>
      pattern === "one"
        ? ["a/changelog.md", "a/changelog.md", "notes.md"]
        : ["a/changelog.md", "b/CHANGELOG.md"],
  });
  equal(
    result,
    ["a/changelog.md", "a/changelog.md", "b/CHANGELOG.md"],
    "01.01",
  );
});

test("02 - the next discovery starts only after the current one resolves", async () => {
  let release;
  const first = new Promise((resolve) => {
    release = resolve;
  });
  const calls = [];
  const result = discoverFiles(["one", "two"], {
    findFiles: async ([pattern]) => {
      calls.push(pattern);
      return pattern === "one" ? first : ["b/changelog.md"];
    },
  });
  await Promise.resolve();
  equal(calls, ["one"], "02.01");
  release(["a/changelog.md"]);
  equal(await result, ["a/changelog.md", "b/changelog.md"], "02.02");
  equal(calls, ["one", "two"], "02.03");
});

test("03 - discovery rejects without starting later patterns", async () => {
  const failure = new Error("discovery failed");
  const calls = [];
  await rejects(
    discoverFiles(["one", "bad", "later"], {
      findFiles: async ([pattern]) => {
        calls.push(pattern);
        if (pattern === "bad") {
          throw failure;
        }
        return ["a/changelog.md"];
      },
    }),
    (error) => error === failure,
    "03.01",
  );
  equal(calls, ["one", "bad"], "03.02");
});

test.run();
