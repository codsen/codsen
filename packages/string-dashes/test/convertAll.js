import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";
import { rawMDash, rawNDash } from "codsen-utils";

import { convertAll } from "../dist/string-dashes.esm.js";
import { pad } from "../../../ops/helpers/common.js";
import { mixer } from "./_util.js";

// -----------------------------------------------------------------------------

test(`01 - combo`, () => {
  // collect everything that will be pinged to our callback function offsetBy:

  let input = `Two sizes - that's all we have. See pages 10-12.`;
  mixer({
    convertDashes: false,
    offsetBy: () => {
      throw new Error("offsetBy should not have been called");
    },
  }).forEach((opt, n) => {
    equal(
      convertAll(input, opt),
      {
        result: input,
        ranges: [],
      },
      `01.01.${pad(n)}`
    );
  });
  mixer({
    convertDashes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      convertAll(input, opt),
      {
        result: "Two sizes &mdash; that's all we have. See pages 10&ndash;12.",
        ranges: [
          [10, 11, "&mdash;"],
          [44, 45, "&ndash;"],
        ],
      },
      `01.03.${pad(n)}`
    );
    // nothing to offset, we're processing only one character, so callback is not called,
    // we're not pinging zero to callback:
  });
  mixer({
    convertDashes: true,
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      convertAll(input, opt),
      {
        result: `Two sizes ${rawMDash} that's all we have. See pages 10${rawNDash}12.`,
        ranges: [
          [10, 11, rawMDash],
          [44, 45, rawNDash],
        ],
      },
      `01.05.${pad(n)}`
    );
    // nothing to offset, we're processing only one character, so callback is not called,
    // we're not pinging zero to callback:
  });
});

test.run();
