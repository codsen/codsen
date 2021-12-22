import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { det as det1 } from "../dist/detergent.esm.js";
import { det, mixer } from "../t-util/util.js";

// ==============================
// 01. main functionality
// ==============================

test(`01 - ${`\u001b[${33}m${`change letter case`}\u001b[${39}m`} - opts.cb changes the case - baseline`, () => {
  equal(
    det(ok, not, 0, `aAa\n\nbBb\n\ncCc`).res,
    "aAa<br/>\n<br/>\nbBb<br/>\n<br/>\ncCc",
    "01"
  );
});

test(`02 - ${`\u001b[${33}m${`change letter case`}\u001b[${39}m`} - opts.cb changes the case - turns into an uppercase`, () => {
  equal(
    det(ok, not, 0, `aAa\n\nbBb\n\ncCc`, {
      cb: (str) => str.toUpperCase(),
    }).res,
    "AAA<br/>\n<br/>\nBBB<br/>\n<br/>\nCCC",
    "02"
  );
});

test(`03 - ${`\u001b[${33}m${`change letter case`}\u001b[${39}m`} - opts.cb changes the case - baseline`, () => {
  equal(
    det1(`<b>aAa\n\nbBb\n\ncCc</b>`, {
      cb: (str) => str.toUpperCase(),
    }).res,
    "<b>AAA<br/>\n<br/>\nBBB<br/>\n<br/>\nCCC</b>",
    "03"
  );
});

test(`04 - ${`\u001b[${33}m${`change letter case`}\u001b[${39}m`} - with strip HTML option`, () => {
  mixer().forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        `<b>aBc</b>`,
        Object.assign(opt, {
          cb: (str) => str.toUpperCase(),
        })
      ).res,
      "<b>ABC</b>",
      `01.04`
    );
  });
});

test(`05 - ${`\u001b[${33}m${`change letter case`}\u001b[${39}m`} - with strip HTML option`, () => {
  // warmup:
  equal(
    det1(`AbC<z>dEf`, {
      stripHtml: true,
      cb: (str) => str.toUpperCase(),
    }).res,
    "ABC DEF",
    "05"
  );
  // now mixer:
  mixer({
    stripHtml: true,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        `AbC<z>dEf`,
        Object.assign(opt, {
          cb: (str) => str.toUpperCase(),
        })
      ).res,
      "ABC DEF",
      `01.04`
    );
  });
});

test.run();
