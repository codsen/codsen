// Quick Take

import { strict as assert } from "assert";

import { cparser } from "../dist/codsen-parser.esm.js";

assert.deepEqual(cparser("<br>z</a>"), [
  {
    type: "tag",
    kind: "inline",
    tagName: "br",
    tagNameStartsAt: 1,
    tagNameEndsAt: 3,
    closing: false,
    void: true,
    pureHTML: true,
    recognised: true,
    start: 0,
    end: 4,
    value: "<br>",
    attribs: [],
    children: [],
  },
  {
    type: "text",
    start: 4,
    end: 5,
    value: "z",
  },
  {
    type: "tag",
    kind: "inline",
    tagName: "a",
    tagNameStartsAt: 7,
    tagNameEndsAt: 8,
    closing: true,
    void: false,
    pureHTML: true,
    recognised: true,
    start: 5,
    end: 9,
    value: "</a>",
    attribs: [],
    children: [],
  },
]);
