import tap from "tap";
import { crush, defaults, version } from "../dist/html-crush.esm";

// THROWS
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${34}m${`throws`}\u001b[${39}m`} - when first arg is wrong`,
  (t) => {
    t.throws(() => {
      crush();
    }, /THROW_ID_01/);

    t.throws(() => {
      crush(true);
    }, /THROW_ID_02/);

    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${34}m${`throws`}\u001b[${39}m`} - when second arg is wrong`,
  (t) => {
    t.throws(() => {
      crush("zzz", true);
    }, /THROW_ID_03/);

    t.throws(() => {
      crush("zzz", "{}");
    }, /THROW_ID_03/);

    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${34}m${`throws`}\u001b[${39}m`} - when opts.breakToTheLeftOf contains non-string elements`,
  (t) => {
    t.throws(() => {
      crush("zzz", {
        breakToTheLeftOf: ["<a", true],
      });
    }, /THROW_ID_05/);

    // but does not throw when array is false, null or empty:
    t.doesNotThrow(() => {
      crush("zzz", {
        breakToTheLeftOf: false,
      });
    }, "03.02");
    t.doesNotThrow(() => {
      crush("zzz", {
        breakToTheLeftOf: null,
      });
    }, "03.03");
    t.doesNotThrow(() => {
      crush("zzz", {
        breakToTheLeftOf: [],
      });
    }, "03.04");

    t.end();
  }
);

// API
// -----------------------------------------------------------------------------

tap.test(
  `04 - ${`\u001b[${32}m${`API`}\u001b[${39}m`} - plain object is exported and contains correct keys`,
  (t) => {
    t.strictSame(
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
      "04"
    );
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${32}m${`API`}\u001b[${39}m`} - plain object is exported`,
  (t) => {
    t.match(version, /\d+\.\d+\.\d+/, "05");
    t.end();
  }
);
