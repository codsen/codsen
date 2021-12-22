// Just deletes inline tags

import { strict as assert } from "assert";

import { stripHtml } from "../dist/string-strip-html.esm.js";

const someHtml = `This has an <b>un</b>bold word.`;

// default behaviour:
assert.equal(stripHtml(someHtml).result, `This has an un bold word.`);

// let's tackle inline tags:
assert.equal(
  stripHtml(someHtml, {
    cb: ({ tag, deleteFrom, deleteTo, insert, rangesArr }) => {
      if (["b", "strong"].includes(tag.name)) {
        rangesArr.push(tag.lastOpeningBracketAt, tag.lastClosingBracketAt + 1);
      } else {
        rangesArr.push(deleteFrom, deleteTo, insert);
      }
    },
  }).result,
  `This has an unbold word.`
);
