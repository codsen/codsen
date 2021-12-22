// Retain href and link label

import { strict as assert } from "assert";

import { stripHtml } from "../dist/string-strip-html.esm.js";

const someHtml = `<a href="https://twitter.com/loretparisi">twitter:loretparisi&nbsp;&oslash;</a>`;

assert.equal(
  stripHtml(someHtml, {
    skipHtmlDecoding: true,
  }).result,
  `twitter:loretparisi&nbsp;&oslash;`
);

assert.equal(
  stripHtml(someHtml, {
    skipHtmlDecoding: true,
    cb: ({ tag, deleteFrom, deleteTo, insert, rangesArr, proposedReturn }) => {
      let temp;
      if (
        tag.name === "a" &&
        tag.attributes &&
        tag.attributes.some((attr) => {
          if (attr.name === "href") {
            temp = attr.value;
            return true;
          }
        })
      ) {
        rangesArr.push([deleteFrom, deleteTo, `${temp} ${insert}`]);
      } else {
        rangesArr.push(proposedReturn);
      }
    },
  }).result,
  `https://twitter.com/loretparisi twitter:loretparisi&nbsp;&oslash;`
);
