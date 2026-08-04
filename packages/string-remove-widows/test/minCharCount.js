// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { removeWidows } from "../dist/string-remove-widows.esm.js";
import {
  // rawnbsp,
  encodedNbspHtml,
  // encodedNbspCss,
  // encodedNbspJs,
  // rawNdash,
  // rawMdash,
} from "./util.js";

// const languages = ["html`, `css`, `js"];
// const encodedNbsps = [encodedNbspHtml, encodedNbspCss, encodedNbspJs];
// const eolTypes = ["LF`, `CR`, `CRLF"];

// -----------------------------------------------------------------------------
// opts.minCharCount
// -----------------------------------------------------------------------------

test(`01 - opts.minCharCount - opts.minCharCount = zero`, () => {
  equal(
    removeWidows("aaa bbb", {
      minCharCount: 0,
    }).res,
    "aaa bbb",
    "01.01",
  );
  equal(
    removeWidows("aaa bbb", {
      minCharCount: 0,
      minWordCount: 0,
    }).res,
    `aaa${encodedNbspHtml}bbb`,
    "01.02",
  );
  equal(
    removeWidows("aaa bbb", {
      minCharCount: 5,
      minWordCount: 0,
    }).res,
    `aaa${encodedNbspHtml}bbb`,
    "01.03",
  );
  equal(
    removeWidows("aaa bbb", {
      minCharCount: 6,
      minWordCount: 0,
    }).res,
    `aaa${encodedNbspHtml}bbb`,
    "01.04",
  );
  equal(
    removeWidows("aaa bbb", {
      minCharCount: 7,
      minWordCount: 0,
    }).res,
    "aaa bbb",
    "01.05",
  );
  equal(
    removeWidows("aaa bbb", {
      minCharCount: 99,
      minWordCount: 0,
    }).res,
    "aaa bbb",
    "01.06",
  );
});

test(`02 - opts.minCharCount - opts.minCharCount = falsy`, () => {
  equal(
    removeWidows("aaa bbb", {
      minCharCount: false,
    }).res,
    "aaa bbb",
    "02.01",
  );
  equal(
    removeWidows("aaa bbb", {
      minCharCount: false,
      minWordCount: 0,
    }).res,
    `aaa${encodedNbspHtml}bbb`,
    "02.02",
  );
  equal(
    removeWidows("aaa bbb", {
      minCharCount: false,
      minWordCount: false,
    }).res,
    `aaa${encodedNbspHtml}bbb`,
    "02.03",
  );
  equal(
    removeWidows("aaa bbb", {
      minCharCount: null,
      minWordCount: null,
    }).res,
    `aaa${encodedNbspHtml}bbb`,
    "02.04",
  );
  equal(
    removeWidows("aaa bbb", {
      minCharCount: 0,
      minWordCount: 0,
    }).res,
    `aaa${encodedNbspHtml}bbb`,
    "02.05",
  );
});

test.run();
