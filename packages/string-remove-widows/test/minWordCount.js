import tap from "tap";
import { removeWidows } from "../dist/string-remove-widows.esm";
import {
  // rawnbsp,
  encodedNbspHtml,
  encodedNbspCss,
  // encodedNbspJs,
  // rawNdash,
  // rawMdash,
} from "./util";

// const languages = ["html`, `css`, `js"];
// const encodedNbsps = [encodedNbspHtml, encodedNbspCss, encodedNbspJs];
// const eolTypes = ["LF`, `CR`, `CRLF"];

// -----------------------------------------------------------------------------
// opts.minWordCount
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${32}m${`opts.minWordCount`}\u001b[${39}m`} - opts.minWordCount = zero`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb`, {
        minWordCount: 0,
        minCharCount: 5,
      }).res,
      `aaa${encodedNbspHtml}bbb`,
      "01"
    );
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${32}m${`opts.minWordCount`}\u001b[${39}m`} - opts.minWordCount = falsey`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb`, {
        targetLanguage: `css`,
        minWordCount: null,
        minCharCount: 5,
      }).res,
      `aaa${encodedNbspCss}bbb`,
      "02"
    );
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${32}m${`opts.minWordCount`}\u001b[${39}m`} - opts.minWordCount = falsey`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb`, {
        targetLanguage: `css`,
        minWordCount: false,
        minCharCount: 5,
      }).res,
      `aaa${encodedNbspCss}bbb`,
      "03"
    );
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${32}m${`opts.minWordCount`}\u001b[${39}m`} - setting is less than words in the input`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb ccc ddd`, {
        minWordCount: 2,
        minCharCount: 5,
      }).res,
      `aaa bbb ccc${encodedNbspHtml}ddd`,
      "04"
    );
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${32}m${`opts.minWordCount`}\u001b[${39}m`} - setting is equal to words count in the input`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb ccc ddd`, {
        minWordCount: 4,
        minCharCount: 5,
      }).res,
      `aaa bbb ccc${encodedNbspHtml}ddd`,
      "05"
    );
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${32}m${`opts.minWordCount`}\u001b[${39}m`} - setting is more than words in the input`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb ccc ddd`, {
        minWordCount: 999,
        minCharCount: 5,
      }).res,
      `aaa bbb ccc ddd`,
      "06"
    );
    t.end();
  }
);
