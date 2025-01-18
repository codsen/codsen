import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";
import { compare } from "ast-compare";

import { tokenizer as ct } from "../dist/codsen-tokenizer.esm.js";

// false positives
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${31}m${"false positives"}\u001b[${39}m`} - double percentage`, () => {
  let gathered = [];
  ct('<table width="100%%">', {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  ok(
    compare(gathered, [
      {
        type: "tag",
        tagName: "table",
        start: 0,
        end: 21,
        attribs: [
          {
            attribName: "width",
            attribNameStartsAt: 7,
            attribNameEndsAt: 12,
            attribOpeningQuoteAt: 13,
            attribClosingQuoteAt: 19,
            attribValueRaw: "100%%",
            attribValue: [
              {
                type: "text",
                start: 14,
                end: 19,
                value: "100%%",
              },
            ],
            attribValueStartsAt: 14,
            attribValueEndsAt: 19,
            attribStarts: 7,
            attribEnds: 20,
          },
        ],
      },
    ]),
    "01.01",
  );
});

test.run();
