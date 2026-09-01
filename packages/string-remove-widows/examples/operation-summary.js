// Inspect which transformations were applied

import { strict as assert } from "node:assert";

import { removeWidows } from "../dist/string-remove-widows.esm.js";

const { res, ranges, whatWasDone } = removeWidows("aaa bbb\\0000A0ccc ddd", {
  convertEntities: true,
  targetLanguage: "html",
  minCharCount: 5,
});

assert.deepEqual(
  { res, ranges, whatWasDone },
  {
    res: "aaa bbb&nbsp;ccc&nbsp;ddd",
    ranges: [
      [7, 14, "&nbsp;"],
      [17, 18, "&nbsp;"],
    ],
    whatWasDone: {
      removeWidows: true,
      convertEntities: true,
    },
  },
);
