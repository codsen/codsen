import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { convertOne } from "../dist/string-dashes.esm.js";
import { pad } from "../../../ops/helpers/common.js";
import { mixer } from "./_util.js";
import { findAllIdx, rawNDash } from "codsen-utils";

// for debug purposes only
// -----------------------------------------------------------------------------

/*test(`01 - WIP`, () => {
  let input = `m-m`;
  equal(
    convertOne(input, {
      from: 1,
      convertDashes: true,
    }),
    null,
    `01.01`
  );
});*/

// -----------------------------------------------------------------------------

// example from Butterick's practical typography
// http://practicaltypography.com/hyphens-and-dashes.html

test("01 - digit-dash-digit × 2", () => {
  let input = "1880-1912, pages 330-39";
  // the first dash at 4
  mixer({
    from: 4,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      convertOne(input, opt),
      null,
      `02.01.${pad(n)} ${JSON.stringify(opt, null, 0)}`,
    );
  });
  mixer({
    from: 4,
    convertDashes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      convertOne(input, opt),
      [[4, 5, "&ndash;"]],
      `02.02.${pad(n)} ${JSON.stringify(opt, null, 0)}`,
    );
  });
  mixer({
    from: 4,
    convertDashes: true,
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      convertOne(input, opt),
      [[4, 5, rawNDash]],
      `02.03.${pad(n)} ${JSON.stringify(opt, null, 0)}`,
    );
  });

  //
  // the second dash at 20
  mixer({
    from: 20,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      convertOne(input, opt),
      null,
      `02.04.${pad(n)} ${JSON.stringify(opt, null, 0)}`,
    );
  });
  mixer({
    from: 20,
    convertDashes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      convertOne(input, opt),
      [[20, 21, "&ndash;"]],
      `02.05.${pad(n)} ${JSON.stringify(opt, null, 0)}`,
    );
  });
  mixer({
    from: 20,
    convertDashes: true,
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      convertOne(input, opt),
      [[20, 21, rawNDash]],
      `02.06.${pad(n)} ${JSON.stringify(opt, null, 0)}`,
    );
  });

  //
  // nothing to convert at index 5
  mixer({
    from: 5, // all bool variations should yield nothing
  }).forEach((opt, n) => {
    equal(
      convertOne(input, opt),
      null,
      `02.07.${pad(n)} ${JSON.stringify(opt, null, 0)}`,
    );
  });
});

// example from Oxford A-Z Grammar and Punctuation
// -----------------------------------------------------------------------------

test("02 - n-dash minimal", () => {
  let input = "An A-Z guide";
  mixer({
    from: 4,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      convertOne(input, opt),
      null,
      `03.01.${pad(n)} ${JSON.stringify(opt, null, 0)}`,
    );
  });
  mixer({
    from: 4,
    convertDashes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      convertOne(input, opt),
      [[4, 5, "&ndash;"]],
      `03.02.${pad(n)} ${JSON.stringify(opt, null, 0)}`,
    );
  });
  mixer({
    from: 4,
    convertDashes: true,
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      convertOne(input, opt),
      [[4, 5, rawNDash]],
      `03.03.${pad(n)} ${JSON.stringify(opt, null, 0)}`,
    );
  });

  // nothing to find
  mixer({
    from: 0,
  }).forEach((opt, n) => {
    equal(
      convertOne(input, opt),
      null,
      `03.04.${pad(n)} ${JSON.stringify(opt, null, 0)}`,
    );
  });
  mixer({
    from: input.length - 1,
  }).forEach((opt, n) => {
    equal(
      convertOne(input, opt),
      null,
      `03.05.${pad(n)} ${JSON.stringify(opt, null, 0)}`,
    );
  });
});

[
  "STOKE-ON-TRENT",
  "OLDBURY-ON-SEVERN",
  "WOTTON-UNDER-EDGE",
  "WELLS-NEXT-THE-SEA",
  "SUTTON-CUM-LOUND",
  "SOUTHEND-ON-SEA",
  "NEWBIGGIN-BY-THE-SEA",
  "NEWPORT-ON-TAY",
].forEach((input, _i, inputsArr) => {
  if (!inputsArr.length) {
    // insurance #1
    throw new Error("no inputs!");
  }
  findAllIdx(input, "-").forEach((from, _y, allFrom) => {
    if (!allFrom.length) {
      // insurance #2
      throw new Error("no inputs!");
    }
    mixer({
      from,
    }).forEach((opt, n) => {
      test("03 - A-Z false positive", () => {
        equal(
          convertOne(input, opt),
          null,
          `03.01.${pad(n)} ${JSON.stringify(opt, null, 0)}`,
        );
      });
    });
  });
});

test.run();
