// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { compare } from "../../../ops/helpers/shallow-compare.js";
import { m } from "./util/util.js";

// grouped tests
test(`01 - html comments - does nothing`, () => {
  [
    "abc def",
    "!--",
    "-->",
    "abd <!-- def",
    "<!--<span>-->",
    "<!--a-->",
    "<!-->",
    "<!--<!---->",
    "<!--a b-->",
    "<!-- tralala -->",
  ].forEach((source) => {
    compare(
      ok,
      m(equal, source, {
        removeHTMLComments: false,
      }),
      {
        result: source,
      },
      "01.01",
    );
  });
});

test.run();
