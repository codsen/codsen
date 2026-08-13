import { test } from "uvu";
import { equal } from "uvu/assert";

import { topDependencies } from "../topDependencies.js";

test("01 - ranks the complete matching set before taking the limit", () => {
  const dependencies = {
    "low-j": 1,
    "low-i": 1,
    "low-h": 1,
    "low-g": 1,
    "low-f": 1,
    "low-e": 1,
    "low-d": 1,
    "low-c": 1,
    "low-b": 1,
    "low-a": 1,
    "popular-z": 5,
    "popular-a": 5,
  };

  equal(
    topDependencies(dependencies, () => true),
    [
      { "popular-a": 5 },
      { "popular-z": 5 },
      { "low-a": 1 },
      { "low-b": 1 },
      { "low-c": 1 },
      { "low-d": 1 },
      { "low-e": 1 },
      { "low-f": 1 },
      { "low-g": 1 },
      { "low-h": 1 },
    ],
    "01.01",
  );
});

test("02 - filters categories and resolves equal counts by dependency name", () => {
  const dependencies = {
    "own-z": 4,
    external: 9,
    "own-b": 4,
    "own-a": 4,
  };

  equal(
    topDependencies(dependencies, (name) => name.startsWith("own-")),
    [{ "own-a": 4 }, { "own-b": 4 }, { "own-z": 4 }],
    "02.01",
  );
});

test.run();
