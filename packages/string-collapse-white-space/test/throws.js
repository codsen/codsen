import tap from "tap";
import collapse from "../dist/string-collapse-white-space.esm";

// various throws
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${31}m${`throws`}\u001b[${39}m`} - wrong/missing input = throw`,
  (t) => {
    t.throws(
      () => {
        collapse();
      },
      /THROW_ID_01/,
      "01.01"
    );
    t.throws(
      () => {
        collapse(1);
      },
      /THROW_ID_01/,
      "01.02"
    );
    t.throws(
      () => {
        collapse(null);
      },
      /THROW_ID_01/,
      "01.03"
    );
    t.throws(
      () => {
        collapse(undefined);
      },
      /THROW_ID_01/,
      "01.04"
    );
    t.throws(
      () => {
        collapse(true);
      },
      /THROW_ID_01/,
      "01.05"
    );
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${31}m${`throws`}\u001b[${39}m`} - wrong opts = throw`,
  (t) => {
    t.throws(
      () => {
        collapse("aaaa", true); // not object but bool
      },
      /THROW_ID_02/,
      "02.01"
    );
    t.throws(
      () => {
        collapse("aaaa", 1); // not object but number
      },
      /THROW_ID_02/,
      "02.02"
    );
    t.doesNotThrow(
      () => {
        collapse("aaaa", undefined); // hardcoded "nothing" is ok!
      },
      /THROW_ID_02/,
      "02.03"
    );
    t.doesNotThrow(
      () => {
        collapse("aaaa", null); // null fine too - that's hardcoded "nothing"
      },
      /THROW_ID_02/,
      "02.04"
    );
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${31}m${`throws`}\u001b[${39}m`} - empty string`,
  (t) => {
    t.strictSame(collapse(""), { result: "", ranges: null }, "03");
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${31}m${`throws`}\u001b[${39}m`} - only letter characters, no white space`,
  (t) => {
    t.strictSame(collapse("aaa"), { result: "aaa", ranges: null }, "04");
    t.end();
  }
);
