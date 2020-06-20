import tap from "tap";
import { crush as m, defaults, version } from "../dist/html-crush.esm";

// THROWS
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${34}m${`throws`}\u001b[${39}m`} - when first arg is wrong`,
  (t) => {
    const err1 = t.throws(() => {
      m();
    });
    t.match(err1.message, /THROW_ID_01/g, "01.01");
    t.match(err1.message, /completely missing/g, "01.02");

    const err2 = t.throws(() => {
      m(true);
    });
    t.match(err2.message, /THROW_ID_02/g, "01.03");
    t.match(err2.message, /boolean/g, "01.04");

    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${34}m${`throws`}\u001b[${39}m`} - when second arg is wrong`,
  (t) => {
    const err1 = t.throws(() => {
      m("zzz", true);
    });
    t.match(err1.message, /THROW_ID_03/g, "02.01");
    t.match(err1.message, /boolean/g, "02.02");

    const err2 = t.throws(() => {
      m("zzz", "{}");
    });
    t.match(err2.message, /THROW_ID_03/g, "02.03");
    t.match(err2.message, /string/g, "02.04");

    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${34}m${`throws`}\u001b[${39}m`} - when opts.breakToTheLeftOf contains non-string elements`,
  (t) => {
    const err1 = t.throws(() => {
      m("zzz", {
        breakToTheLeftOf: ["<a", true],
      });
    });
    t.match(err1.message, /THROW_ID_05/gi, "03.01");
    t.match(err1.message, /opts\.breakToTheLeftOf/gi, "03.02");
    t.match(err1.message, /boolean/gi, "03.03");

    // but does not throw when array is false, null or empty:
    t.doesNotThrow(() => {
      m("zzz", {
        breakToTheLeftOf: false,
      });
    }, "03.04");
    t.doesNotThrow(() => {
      m("zzz", {
        breakToTheLeftOf: null,
      });
    }, "03.05");
    t.doesNotThrow(() => {
      m("zzz", {
        breakToTheLeftOf: [],
      });
    }, "03.06");

    t.end();
  }
);

// API
// -----------------------------------------------------------------------------

tap.test(
  `04 - ${`\u001b[${32}m${`API`}\u001b[${39}m`} - plain object is exported and contains correct keys`,
  (t) => {
    t.same(
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
