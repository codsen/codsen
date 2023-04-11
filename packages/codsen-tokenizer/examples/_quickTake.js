// Quick Take

import { strict as assert } from "assert";

import { tokenizer } from "../dist/codsen-tokenizer.esm.js";

const gathered = [];

// it operates from a callback, like Array.prototype.forEach()
tokenizer("<td nowrap>", {
  tagCb: (obj) => {
    gathered.push(obj);
  },
});

assert.deepEqual(gathered, [
  {
    type: "tag",
    start: 0,
    end: 11,
    value: "<td nowrap>",
    tagNameStartsAt: 1,
    tagNameEndsAt: 3,
    tagName: "td",
    recognised: true,
    closing: false,
    void: false,
    pureHTML: true,
    kind: null,
    attribs: [
      {
        attribName: "nowrap",
        attribNameRecognised: true,
        attribNameStartsAt: 4,
        attribNameEndsAt: 10,
        attribOpeningQuoteAt: null,
        attribClosingQuoteAt: null,
        attribValueRaw: null,
        attribValue: [],
        attribValueStartsAt: null,
        attribValueEndsAt: null,
        attribStarts: 4,
        attribEnds: 10,
        attribLeft: 2,
      },
    ],
  },
]);
