import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { remSep as r } from "../dist/string-remove-thousand-separators.esm.js";

test("01", () => {
  equal(r("0.075"), "0.075", "01.01");
});

test.run();
