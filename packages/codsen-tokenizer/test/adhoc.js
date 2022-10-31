import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { tokenizer as ct } from "../dist/codsen-tokenizer.esm.js";

test(`01 - perf investigation`, () => {
  let gathered = [];
  ct(`<div>Script says hello world and sky and sea</div>`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  equal(
    gathered,
    [
      {
        type: "tag",
        start: 0,
        end: 5,
        value: "<div>",
        tagNameStartsAt: 1,
        tagNameEndsAt: 4,
        tagName: "div",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [],
      },
      {
        type: "text",
        start: 5,
        end: 44,
        value: "Script says hello world and sky and sea",
      },
      {
        type: "tag",
        start: 44,
        end: 50,
        value: "</div>",
        tagNameStartsAt: 46,
        tagNameEndsAt: 49,
        tagName: "div",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [],
      },
    ],
    "01.01"
  );
});

test.run();
