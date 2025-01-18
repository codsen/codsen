import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { compare } from "../../../ops/helpers/shallow-compare.js";
import { m } from "./util/util.js";

// grouped tests
test(`01 - ${`\u001b[${33}m${"html comments"}\u001b[${39}m`} - does nothing`, () => {
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
