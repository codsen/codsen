// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { crush, defaults, version } from "../dist/html-crush.esm.js";

// THROWS
// -----------------------------------------------------------------------------

test(`01 - throws - when first arg is wrong`, () => {
  throws(
    () => {
      crush();
    },
    /THROW_ID_01/,
    "01.01",
  );

  throws(
    () => {
      crush(true);
    },
    /THROW_ID_02/,
    "01.02",
  );
});

test(`02 - throws - when second arg is wrong`, () => {
  throws(
    () => {
      crush("zzz", true);
    },
    /THROW_ID_03/,
    "02.01",
  );

  throws(
    () => {
      crush("zzz", "{}");
    },
    /THROW_ID_03/,
    "02.02",
  );
});

test(`03 - throws - when opts.breakToTheLeftOf contains non-string elements`, () => {
  throws(
    () => {
      crush("zzz", {
        breakToTheLeftOf: ["<a", true],
      });
    },
    /THROW_ID_04/,
    "03.01",
  );

  // but does not throw when array is false, null or empty:
  not.throws(() => {
    crush("zzz", {
      breakToTheLeftOf: false,
    });
  }, "03.02");
  not.throws(() => {
    crush("zzz", {
      breakToTheLeftOf: null,
    });
  }, "03.03");
  not.throws(() => {
    crush("zzz", {
      breakToTheLeftOf: [],
    });
  }, "03.04");
});

// API
// -----------------------------------------------------------------------------

test(`04 - API - plain object is exported and contains correct keys`, () => {
  equal(
    Object.keys(defaults).sort(),
    [
      "mindTheInlineTags",
      "lineLengthLimit",
      "removeIndentations",
      "removeLineBreaks",
      "removeHTMLComments",
      "removeCSSComments",
      "reportProgressFunc",
      "reportProgressFuncFrom",
      "reportProgressFuncTo",
      "breakToTheLeftOf",
    ].sort(),
    "04.01",
  );
});

test(`05 - API - plain object is exported`, () => {
  match(version, /\d+\.\d+\.\d+/, "05.01");
});

test.run();
