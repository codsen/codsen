import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { removeWidows } from "../dist/string-remove-widows.esm.js";
import {
  // rawnbsp,
  encodedNbspHtml,
  encodedNbspCss,
  // encodedNbspJs,
  // rawNdash,
  // rawMdash,
} from "./util.js";

// const languages = ["html`, `css`, `js"];
// const encodedNbsps = [encodedNbspHtml, encodedNbspCss, encodedNbspJs];
// const eolTypes = ["LF`, `CR`, `CRLF"];

// -----------------------------------------------------------------------------
// opts.minWordCount
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${32}m${"opts.minWordCount"}\u001b[${39}m`} - opts.minWordCount = zero`, () => {
  equal(
    removeWidows("aaa bbb", {
      minWordCount: 0,
      minCharCount: 5,
    }).res,
    `aaa${encodedNbspHtml}bbb`,
    "01.01"
  );
});

test(`02 - ${`\u001b[${32}m${"opts.minWordCount"}\u001b[${39}m`} - opts.minWordCount = falsey`, () => {
  equal(
    removeWidows("aaa bbb", {
      targetLanguage: "css",
      minWordCount: null,
      minCharCount: 5,
    }).res,
    `aaa${encodedNbspCss}bbb`,
    "02.01"
  );
});

test(`03 - ${`\u001b[${32}m${"opts.minWordCount"}\u001b[${39}m`} - opts.minWordCount = falsey`, () => {
  equal(
    removeWidows("aaa bbb", {
      targetLanguage: "css",
      minWordCount: false,
      minCharCount: 5,
    }).res,
    `aaa${encodedNbspCss}bbb`,
    "03.01"
  );
});

test(`04 - ${`\u001b[${32}m${"opts.minWordCount"}\u001b[${39}m`} - setting is less than words in the input`, () => {
  equal(
    removeWidows("aaa bbb ccc ddd", {
      minWordCount: 2,
      minCharCount: 5,
    }).res,
    `aaa bbb ccc${encodedNbspHtml}ddd`,
    "04.01"
  );
});

test(`05 - ${`\u001b[${32}m${"opts.minWordCount"}\u001b[${39}m`} - setting is equal to words count in the input`, () => {
  equal(
    removeWidows("aaa bbb ccc ddd", {
      minWordCount: 4,
      minCharCount: 5,
    }).res,
    `aaa bbb ccc${encodedNbspHtml}ddd`,
    "05.01"
  );
});

test(`06 - ${`\u001b[${32}m${"opts.minWordCount"}\u001b[${39}m`} - setting is more than words in the input`, () => {
  equal(
    removeWidows("aaa bbb ccc ddd", {
      minWordCount: 999,
      minCharCount: 5,
    }).res,
    "aaa bbb ccc ddd",
    "06.01"
  );
});

test.run();
