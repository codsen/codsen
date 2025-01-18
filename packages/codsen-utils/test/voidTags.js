import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { voidTags } from "../dist/codsen-utils.esm.js";

test("01", () => {
  equal(voidTags[0], "area", "01.01");
});

test.run();
