import tap from "tap";
import { removeWidows } from "../dist/string-remove-widows.esm";
import {
  // rawnbsp,
  encodedNbspHtml,
  // encodedNbspCss,
  // encodedNbspJs,
  // rawNdash,
  // rawMdash,
} from "./util";

// const languages = ["html`, `css`, `js"];
// const encodedNbsps = [encodedNbspHtml, encodedNbspCss, encodedNbspJs];
// const eolTypes = ["LF`, `CR`, `CRLF"];

// -----------------------------------------------------------------------------
// opts.minCharCount
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${33}m${`opts.minCharCount`}\u001b[${39}m`} - opts.minCharCount = zero`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb`, {
        minCharCount: 0,
      }).res,
      `aaa bbb`,
      `01.01 - default word count 4 kicks in and makes program skip this`
    );
    t.equal(
      removeWidows(`aaa bbb`, {
        minCharCount: 0,
        minWordCount: 0,
      }).res,
      `aaa${encodedNbspHtml}bbb`,
      `01.02`
    );
    t.equal(
      removeWidows(`aaa bbb`, {
        minCharCount: 5,
        minWordCount: 0,
      }).res,
      `aaa${encodedNbspHtml}bbb`,
      `01.03`
    );
    t.equal(
      removeWidows(`aaa bbb`, {
        minCharCount: 6,
        minWordCount: 0,
      }).res,
      `aaa${encodedNbspHtml}bbb`,
      `01.04`
    );
    t.equal(
      removeWidows(`aaa bbb`, {
        minCharCount: 7,
        minWordCount: 0,
      }).res,
      `aaa bbb`,
      `01.05`
    );
    t.equal(
      removeWidows(`aaa bbb`, {
        minCharCount: 99,
        minWordCount: 0,
      }).res,
      `aaa bbb`,
      `01.06`
    );
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${33}m${`opts.minCharCount`}\u001b[${39}m`} - opts.minCharCount = falsey`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb`, {
        minCharCount: false,
      }).res,
      `aaa bbb`,
      `02.01`
    );
    t.equal(
      removeWidows(`aaa bbb`, {
        minCharCount: false,
        minWordCount: 0,
      }).res,
      `aaa${encodedNbspHtml}bbb`,
      `02.02`
    );
    t.equal(
      removeWidows(`aaa bbb`, {
        minCharCount: false,
        minWordCount: false,
      }).res,
      `aaa${encodedNbspHtml}bbb`,
      `02.03`
    );
    t.equal(
      removeWidows(`aaa bbb`, {
        minCharCount: null,
        minWordCount: null,
      }).res,
      `aaa${encodedNbspHtml}bbb`,
      `02.04`
    );
    t.equal(
      removeWidows(`aaa bbb`, {
        minCharCount: 0,
        minWordCount: 0,
      }).res,
      `aaa${encodedNbspHtml}bbb`,
      `02.05`
    );
    t.end();
  }
);
