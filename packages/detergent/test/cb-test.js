// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { det as det1 } from "../dist/detergent.esm.js";
import { det, mixer } from "../t-util/util.js";

// ==============================
// 01. main functionality
// ==============================

test("001 - change letter case - opts.cb changes the case - baseline", () => {
  equal(
    det(ok, not, 0, "aAa\n\nbBb\n\ncCc").res,
    "aAa<br/>\n<br/>\nbBb<br/>\n<br/>\ncCc",
    "001.01",
  );
});

test("002 - change letter case - opts.cb changes the case - turns into an uppercase", () => {
  equal(
    det(ok, not, 0, "aAa\n\nbBb\n\ncCc", {
      cb: (str) => str.toUpperCase(),
    }).res,
    "AAA<br/>\n<br/>\nBBB<br/>\n<br/>\nCCC",
    "002.01",
  );
});

test("003 - change letter case - opts.cb changes the case - baseline", () => {
  equal(
    det1("<b>aAa\n\nbBb\n\ncCc</b>", {
      cb: (str) => str.toUpperCase(),
    }).res,
    "<b>AAA<br/>\n<br/>\nBBB<br/>\n<br/>\nCCC</b>",
    "003.01",
  );
});

test("004 - change letter case - with strip HTML option", () => {
  mixer().forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        "<b>aBc</b>",
        Object.assign(opt, {
          cb: (str) => str.toUpperCase(),
        }),
      ).res,
      "<b>ABC</b>",
      "004.01",
    );
  });
});

test("005 - change letter case - with strip HTML option", () => {
  // warmup:
  equal(
    det1("AbC<z>dEf", {
      stripHtml: true,
      cb: (str) => str.toUpperCase(),
    }).res,
    "ABC DEF",
    "005.01",
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
        "AbC<z>dEf",
        Object.assign(opt, {
          cb: (str) => str.toUpperCase(),
        }),
      ).res,
      "ABC DEF",
      "005.02",
    );
  });
});

test("006 - change letter case - with strip HTML option", () => {
  equal(
    det1(
      `
<div>
  abc
</div>
<div>
  xyz
</div>
`.trim(),
      {
        replaceLineBreaks: false,
        stripHtml: false,
        // every substring between tags is fed to the callback,
        // including that line break between div pairs, so
        // we implement a check, is it non-whitespace,
        // before wrapping it:
        cb: (str) => (str?.trim() ? `{${str.trim()}}` : str),
      },
    ).res,
    `
<div>{abc}</div>\n<div>{xyz}</div>
`.trim(),
    "006.01",
  );
});

test.run();
