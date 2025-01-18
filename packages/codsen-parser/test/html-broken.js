import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { compare } from "../../../ops/helpers/shallow-compare.js";
import { cparser } from "../dist/codsen-parser.esm.js";

// 01. void tags
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${36}m${"void tags"}\u001b[${39}m`} - one slash in front`, () => {
  let gatheredErr = [];
  let ast = cparser("</br>", {
    errCb: (incoming) => gatheredErr.push(incoming),
  });
  compare(
    ok,
    ast,
    [
      {
        type: "tag",
        start: 0,
        end: 5,
        value: "</br>",
        tagNameStartsAt: 2,
        tagNameEndsAt: 4,
        tagName: "br",
        recognised: true,
        closing: true,
        void: true,
        pureHTML: true,
        kind: "inline",
        attribs: [],
        children: [],
      },
    ],
    "01.01",
  );
  is(ast.length, 1, "01.01");

  compare(
    ok,
    gatheredErr,
    [
      {
        ruleId: "tag-void-frontal-slash",
        idxFrom: 0,
        idxTo: 5,
        fix: { ranges: [[1, 2]] },
      },
    ],
    "01.03",
  );
  is(gatheredErr.length, 1, "01.02");
});

test.run();
