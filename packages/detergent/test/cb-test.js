// avanotonly

import test from "ava";
import { det, mixer, allCombinations } from "../t-util/util";
import { det as det1 } from "../dist/detergent.esm";

// ==============================
// 01. main functionality
// ==============================

test(`01.01 - ${`\u001b[${33}m${`change letter case`}\u001b[${39}m`} - opts.cb changes the case - baseline`, t => {
  t.is(
    det(t, 0, `aAa\n\nbBb\n\ncCc`).res,
    "aAa<br/>\n<br/>\nbBb<br/>\n<br/>\ncCc",
    "01.01"
  );
});

test(`01.02 - ${`\u001b[${33}m${`change letter case`}\u001b[${39}m`} - opts.cb changes the case - turns into an uppercase`, t => {
  t.is(
    det(t, 0, `aAa\n\nbBb\n\ncCc`, {
      cb: str => str.toUpperCase()
    }).res,
    "AAA<br/>\n<br/>\nBBB<br/>\n<br/>\nCCC",
    "01.02"
  );
});

test(`01.03 - ${`\u001b[${33}m${`change letter case`}\u001b[${39}m`} - opts.cb changes the case - baseline`, t => {
  t.is(
    det1(`<b>aAa\n\nbBb\n\ncCc</b>`, {
      cb: str => str.toUpperCase()
    }).res,
    "<b>AAA<br/>\n<br/>\nBBB<br/>\n<br/>\nCCC</b>",
    "01.03"
  );
});

test(`01.04 - ${`\u001b[${33}m${`change letter case`}\u001b[${39}m`} - with strip HTML option`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(
        t,
        n,
        `<b>aBc</b>`,
        Object.assign(opt, {
          cb: str => str.toUpperCase()
        })
      ).res,
      "<b>ABC</b>",
      `01.04`
    );
  });
});

test(`01.05 - ${`\u001b[${33}m${`change letter case`}\u001b[${39}m`} - with strip HTML option`, t => {
  // warmup:
  t.is(
    det1(
      `AbC<z>dEf`,
      Object.assign(
        {
          stripHtml: true
        },
        {
          cb: str => str.toUpperCase()
        }
      )
    ).res,
    "ABC DEF"
  );
  // now mixer:
  mixer({
    stripHtml: true
  }).forEach((opt, n) => {
    t.is(
      det(
        t,
        n,
        `AbC<z>dEf`,
        Object.assign(opt, {
          cb: str => str.toUpperCase()
        })
      ).res,
      "ABC DEF",
      `01.04`
    );
  });
});
