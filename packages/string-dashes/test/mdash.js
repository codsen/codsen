import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";
import { rawMDash, rawNDash } from "codsen-utils";

import { convertOne } from "../dist/string-dashes.esm.js";
import { pad } from "../../../ops/helpers/common.js";
import { mixer } from "./_util.js";

// -----------------------------------------------------------------------------

test(`01 - m-dash minimal`, () => {
  let input = `Dashes come in two sizes - the en dash and the em dash.`;
  mixer({
    from: 25,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(convertOne(input, opt), null, `01.01.${pad(n)}`);
  });
  mixer({
    from: 25,
    convertDashes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(convertOne(input, opt), [[25, 26, "&mdash;"]], `01.02.${pad(n)}`);
  });
  mixer({
    from: 25,
    convertDashes: true,
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(convertOne(input, opt), [[25, 26, rawMDash]], `01.03.${pad(n)}`);
  });

  // nothing to find
  mixer({
    from: 0,
  }).forEach((opt, n) => {
    equal(
      convertOne(input, opt),
      null,
      `01.04.${pad(n)} ${JSON.stringify(opt, null, 0)}`
    );
  });
  mixer({
    from: input.length - 1,
  }).forEach((opt, n) => {
    equal(
      convertOne(input, opt),
      null,
      `01.05.${pad(n)} ${JSON.stringify(opt, null, 0)}`
    );
  });
});

test(`02 - n-dash instead of m-dash`, () => {
  let input = `Dashes come in two sizes ${rawNDash} the en dash and the em dash.`;
  mixer({
    from: 25,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(convertOne(input, opt), null, `01.01.${pad(n)}`);
  });
  mixer({
    from: 25,
    convertDashes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(convertOne(input, opt), [[25, 26, "&mdash;"]], `01.02.${pad(n)}`);
  });
  mixer({
    from: 25,
    convertDashes: true,
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(convertOne(input, opt), [[25, 26, rawMDash]], `01.03.${pad(n)}`);
  });

  // nothing to find
  mixer({
    from: 0,
  }).forEach((opt, n) => {
    equal(
      convertOne(input, opt),
      null,
      `01.04.${pad(n)} ${JSON.stringify(opt, null, 0)}`
    );
  });
  mixer({
    from: input.length - 1,
  }).forEach((opt, n) => {
    equal(
      convertOne(input, opt),
      null,
      `01.05.${pad(n)} ${JSON.stringify(opt, null, 0)}`
    );
  });
});

test(`03 - already m-dash, spaced`, () => {
  let input = `Dashes come in two sizes ${rawMDash} the en dash and the em dash.`;
  mixer({
    from: 25,
  }).forEach((opt, n) => {
    equal(convertOne(input, opt), null, `01.01.${pad(n)}`);
  });

  // nothing to find
  mixer({
    from: 0,
  }).forEach((opt, n) => {
    equal(
      convertOne(input, opt),
      null,
      `01.04.${pad(n)} ${JSON.stringify(opt, null, 0)}`
    );
  });
  mixer({
    from: input.length - 1,
  }).forEach((opt, n) => {
    equal(
      convertOne(input, opt),
      null,
      `01.05.${pad(n)} ${JSON.stringify(opt, null, 0)}`
    );
  });
});

test(`04 - already m-dash, tight`, () => {
  let input = `Dashes come in two sizes${rawMDash}the en dash and the em dash.`;
  mixer({
    from: 24,
  }).forEach((opt, n) => {
    equal(convertOne(input, opt), null, `01.01.${pad(n)}`);
  });

  // nothing to find
  mixer({
    from: 0,
  }).forEach((opt, n) => {
    equal(
      convertOne(input, opt),
      null,
      `01.04.${pad(n)} ${JSON.stringify(opt, null, 0)}`
    );
  });
  mixer({
    from: input.length - 1,
  }).forEach((opt, n) => {
    equal(
      convertOne(input, opt),
      null,
      `01.05.${pad(n)} ${JSON.stringify(opt, null, 0)}`
    );
  });
});

test.run();
