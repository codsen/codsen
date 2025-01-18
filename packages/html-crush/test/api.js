import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { crush, defaults, version } from "../dist/html-crush.esm.js";

// THROWS
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${34}m${"throws"}\u001b[${39}m`} - when first arg is wrong`, () => {
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

test(`02 - ${`\u001b[${34}m${"throws"}\u001b[${39}m`} - when second arg is wrong`, () => {
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

test(`03 - ${`\u001b[${34}m${"throws"}\u001b[${39}m`} - when opts.breakToTheLeftOf contains non-string elements`, () => {
  throws(
    () => {
      crush("zzz", {
        breakToTheLeftOf: ["<a", true],
      });
    },
    /THROW_ID_05/,
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

test(`04 - ${`\u001b[${32}m${"API"}\u001b[${39}m`} - plain object is exported and contains correct keys`, () => {
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

test(`05 - ${`\u001b[${32}m${"API"}\u001b[${39}m`} - plain object is exported`, () => {
  match(version, /\d+\.\d+\.\d+/, "05.01");
});

test.run();
