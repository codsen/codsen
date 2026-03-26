// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { allHtmlAttribs } from "../dist/html-all-known-attributes.esm.js";

test("01 - there are 702 attrib names", () => {
  ok(allHtmlAttribs.has("href"), "01.01");
  ok(allHtmlAttribs.size > 700, "01.02");
});

// remember to update the readme too

test.run();
