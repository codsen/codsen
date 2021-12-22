import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { allHtmlAttribs } from "../dist/html-all-known-attributes.esm.js";

test(`01 - there are 702 attrib names`, () => {
  ok(allHtmlAttribs.has("href"), "01.01");
  ok(allHtmlAttribs.size > 700, "01.02");
});

// remember to update the readme too

test.run();
