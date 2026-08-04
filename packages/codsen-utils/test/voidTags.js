// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { voidTags } from "../dist/codsen-utils.esm.js";

test("01", () => {
  equal(voidTags[0], "area", "01.01");
});

test.run();
