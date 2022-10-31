import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import {
  removeWidows,
  // version
} from "../dist/string-remove-widows.esm.js";
import {
  rawnbsp,
  encodedNbspHtml,
  encodedNbspCss,
  encodedNbspJs,
  // rawNdash,
  // rawMdash,
} from "./util.js";

// const languages = ["html`, `css`, `js"];
// const encodedNbsps = [encodedNbspHtml, encodedNbspCss, encodedNbspJs];
// const eolTypes = ["LF`, `CR`, `CRLF"];

// opts.convertEntities
// -----------------------------------------------------------------------------

test(`01 - four chunks of text - entities, one line string no full stop`, () => {
  // log key contents are indeterminable
  let { res, ranges, whatWasDone } = removeWidows(`aaa bbb ccc ddd`, {
    minCharCount: 5,
  });
  equal(
    { res, ranges, whatWasDone },
    {
      res: `aaa bbb ccc${encodedNbspHtml}ddd`,
      ranges: [[11, 12, encodedNbspHtml]],
      whatWasDone: {
        removeWidows: true,
        convertEntities: false,
      },
    },
    "01.01"
  );
});

test(`02 - four chunks of text - entities, one line string with full stop`, () => {
  equal(
    removeWidows(`aaa bbb ccc ddd.`, {
      minCharCount: 5,
    }).res,
    `aaa bbb ccc${encodedNbspHtml}ddd.`,
    "02.01"
  );
});

test(`03 - four chunks of text - no entities, one line string no full stop`, () => {
  equal(
    removeWidows(`aaa bbb ccc ddd`, {
      convertEntities: false,
      minCharCount: 5,
    }).res,
    `aaa bbb ccc${rawnbsp}ddd`,
    "03.01"
  );
});

test(`04 - four chunks of text - no entities, one line string with full stop`, () => {
  equal(
    removeWidows(`aaa bbb ccc ddd.`, {
      convertEntities: false,
      minCharCount: 5,
    }).res,
    `aaa bbb ccc${rawnbsp}ddd.`,
    "04.01"
  );
});

test(`05 - single line break - widow fix needed`, () => {
  equal(
    removeWidows(`aaa bbb ccc ddd\neee fff ggg hhh.`, {
      convertEntities: true,
      minCharCount: 5,
    }).res,
    `aaa bbb ccc${encodedNbspHtml}ddd\neee fff ggg${encodedNbspHtml}hhh.`,
    "05.01"
  );
});

test(`06 - single line break -  - one line break, with full stop - widow fix needed`, () => {
  equal(
    removeWidows(`aaa bbb ccc ddd.\neee fff ggg hhh.`, {
      convertEntities: true,
      minCharCount: 5,
    }).res,
    `aaa bbb ccc${encodedNbspHtml}ddd.\neee fff ggg${encodedNbspHtml}hhh.`,
    "06.01"
  );
});

test(`07 - trailing space`, () => {
  equal(
    removeWidows(`aaa bbb ccc ddd.  \n\neee fff ggg hhh`, {
      convertEntities: true,
      minCharCount: 5,
    }).res,
    `aaa bbb ccc${encodedNbspHtml}ddd.  \n\neee fff ggg${encodedNbspHtml}hhh`,
    "07.01"
  );
});

test(`08 - trailing tabs`, () => {
  equal(
    removeWidows(`aaa bbb ccc ddd.\t\t\n\neee fff ggg hhh\t\t`, {
      convertEntities: true,
      minCharCount: 5,
    }).res,
    `aaa bbb ccc${encodedNbspHtml}ddd.\t\t\n\neee fff ggg${encodedNbspHtml}hhh\t\t`,
    "08.01"
  );
});

test(`09 - nbsp's not added within hidden HTML tags`, () => {
  let sources = [
    `aaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
    `aaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
    `aaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
    `aaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
  ];
  sources.forEach((str, idx) => {
    equal(removeWidows(str).res, str, `02.09.0${1 + idx}`);
  });
});

test(`10 - numeric HTML entity #160`, () => {
  equal(
    removeWidows(`aaa bbb ccc&#160;ddd`, {
      convertEntities: true,
      minCharCount: 5,
    }).res,
    `aaa bbb ccc${encodedNbspHtml}ddd`,
    "10.01"
  );
});

test(`11 - numeric HTML entity #160`, () => {
  equal(
    removeWidows(`aaa bbb ccc&#160;ddd`, {
      convertEntities: false,
      minCharCount: 5,
    }).res,
    `aaa bbb ccc${rawnbsp}ddd`,
    "11.01"
  );
});

test(`12 - doesn't touch other nbsp's`, () => {
  equal(
    removeWidows(`aaa bbb${encodedNbspHtml}ccc&#160;ddd`, {
      convertEntities: true,
      minCharCount: 5,
    }).res,
    `aaa bbb${encodedNbspHtml}ccc${encodedNbspHtml}ddd`,
    "12.01"
  );
});

test(`13 - doesn't touch other nbsp's`, () => {
  equal(
    removeWidows(`aaa bbb${encodedNbspHtml}ccc&#160;ddd`, {
      convertEntities: false,
      minCharCount: 5,
    }).res,
    `aaa bbb${rawnbsp}ccc${rawnbsp}ddd`,
    "13.01"
  );
});

test(`14 - two spaces`, () => {
  equal(
    removeWidows(`aaa bbb ccc  ddd`, {
      convertEntities: true,
      minCharCount: 5,
    }).res,
    `aaa bbb ccc${encodedNbspHtml}ddd`,
    "14.01"
  );
});

test(`15 - two spaces`, () => {
  equal(
    removeWidows(`aaa bbb ccc  ddd`, {
      convertEntities: false,
      minCharCount: 5,
    }).res,
    `aaa bbb ccc${rawnbsp}ddd`,
    "15.01"
  );
});

test(`16 - tabs`, () => {
  equal(
    removeWidows(`aaa bbb ccc\tddd`, {
      convertEntities: true,
      minCharCount: 5,
    }).res,
    `aaa bbb ccc${encodedNbspHtml}ddd`,
    "16.01"
  );
});

test(`17 - tabs`, () => {
  equal(
    removeWidows(`aaa bbb ccc\tddd`, {
      convertEntities: false,
      minCharCount: 5,
    }).res,
    `aaa bbb ccc${rawnbsp}ddd`,
    "17.01"
  );
});

// existing, neighbour nbsp's get converted
test(`18 - converts non-widow non-breaking spaces`, () => {
  equal(
    removeWidows(`aaa bbb${encodedNbspHtml}ccc ddd`, {
      convertEntities: true,
      minCharCount: 5,
    }).res,
    `aaa bbb${encodedNbspHtml}ccc${encodedNbspHtml}ddd`,
    "18.01"
  );
});

test(`19 - converts non-widow non-breaking spaces`, () => {
  equal(
    removeWidows(`aaa bbb${encodedNbspHtml}ccc ddd`, {
      convertEntities: false,
      minCharCount: 5,
    }).res,
    `aaa bbb${rawnbsp}ccc${rawnbsp}ddd`,
    "19.01"
  );
});

test(`20 - converts non-widow non-breaking spaces`, () => {
  equal(
    removeWidows(`aaa bbb${encodedNbspHtml}ccc ddd`, {
      targetLanguage: `css`,
      convertEntities: true,
      minCharCount: 5,
    }).res,
    `aaa bbb${encodedNbspCss}ccc${encodedNbspCss}ddd`,
    "20.01"
  );
});

test(`21 - converts non-widow non-breaking spaces`, () => {
  equal(
    removeWidows(`aaa bbb${encodedNbspHtml}ccc ddd`, {
      targetLanguage: `js`,
      convertEntities: true,
      minCharCount: 5,
    }).res,
    `aaa bbb${encodedNbspJs}ccc${encodedNbspJs}ddd`,
    "21.01"
  );
});

test(`22 - removeWidowPreventionMeasures - converts non-widow non-breaking spaces`, () => {
  equal(
    removeWidows(`aaa bbb${encodedNbspHtml}ccc ddd`, {
      removeWidowPreventionMeasures: true,
      convertEntities: false,
      minCharCount: 5,
    }).res,
    `aaa bbb${rawnbsp}ccc ddd`,
    "22.01"
  );
});

test(`23 - removeWidowPreventionMeasures - converts non-widow non-breaking spaces`, () => {
  equal(
    removeWidows(`aaa bbb${encodedNbspHtml}ccc ddd`, {
      removeWidowPreventionMeasures: true,
      convertEntities: true,
      minCharCount: 5,
    }).res,
    `aaa bbb${encodedNbspHtml}ccc ddd`,
    "23.01"
  );
});

test(`24 - removeWidowPreventionMeasures - converts non-widow non-breaking spaces`, () => {
  equal(
    removeWidows(`aaa bbb${encodedNbspHtml}ccc ddd`, {
      removeWidowPreventionMeasures: true,
      convertEntities: true,
      targetLanguage: `css`,
      minCharCount: 5,
    }).res,
    `aaa bbb${encodedNbspCss}ccc ddd`,
    "24.01"
  );
});

// 3 words, min count 4

test(`25`, () => {
  equal(
    removeWidows(`Abc;${rawnbsp}de fg.`, {
      convertEntities: true,
      minWordCount: 4,
    }).res,
    `Abc;&nbsp;de fg.`,
    "25.01"
  );
});

test(`26`, () => {
  equal(
    removeWidows(`Abc;${rawnbsp}de fg.`, {
      convertEntities: false,
      minWordCount: 4,
    }).res,
    `Abc;${rawnbsp}de fg.`,
    "26.01"
  );
});

test(`27`, () => {
  equal(
    removeWidows(`Abc;&nbsp;de fg.`, {
      convertEntities: true,
      minWordCount: 4,
    }).res,
    `Abc;&nbsp;de fg.`,
    "27.01"
  );
});

test(`28`, () => {
  equal(
    removeWidows(`Abc;&nbsp;de fg.`, {
      convertEntities: false,
      minWordCount: 4,
    }).res,
    `Abc;${rawnbsp}de fg.`,
    "28.01"
  );
});

// 4 words, min count 4

test(`29`, () => {
  equal(
    removeWidows(`Abc;${rawnbsp}de fg hijklm.`, {
      convertEntities: true,
      minWordCount: 4,
    }).res,
    `Abc;&nbsp;de fg&nbsp;hijklm.`,
    "29.01"
  );
});

test(`30`, () => {
  equal(
    removeWidows(`Abc;${rawnbsp}de fg hijklm.`, {
      convertEntities: false,
      minWordCount: 4,
    }).res,
    `Abc;${rawnbsp}de fg${rawnbsp}hijklm.`,
    "30.01"
  );
});

test(`31`, () => {
  equal(
    removeWidows(`Abc;&nbsp;de fg hijklm.`, {
      convertEntities: true,
      minWordCount: 4,
    }).res,
    `Abc;&nbsp;de fg&nbsp;hijklm.`,
    "31.01"
  );
});

test(`32`, () => {
  equal(
    removeWidows(`Abc;&nbsp;de fg hijklm.`, {
      convertEntities: false,
      minWordCount: 4,
    }).res,
    `Abc;${rawnbsp}de fg${rawnbsp}hijklm.`,
    "32.01"
  );
});

test.run();
