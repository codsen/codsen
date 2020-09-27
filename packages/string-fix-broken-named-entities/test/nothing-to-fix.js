import tap from "tap";
import fix from "../dist/string-fix-broken-named-entities.esm";

// -----------------------------------------------------------------------------
// 03. nothing to fix
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${33}m${`nothing to fix`}\u001b[${39}m`} - false positives`,
  (t) => {
    t.strictSame(fix("insp;"), [], "01.01");
    t.strictSame(fix("an insp;"), [], "01.02");
    t.strictSame(fix("an inspp;"), [], "01.03");

    // decode on:
    t.strictSame(fix("insp;", { decode: true }), [], "01.04");
    t.strictSame(fix("an insp;", { decode: true }), [], "01.05");
    t.strictSame(fix("an inspp;", { decode: true }), [], "01.06");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${33}m${`nothing to fix`}\u001b[${39}m`} - no decode requested`,
  (t) => {
    t.strictSame(fix("&nbsp;"), [], "02.01 - one, surrounded by EOL");
    t.strictSame(fix("&nbsp; &nbsp;"), [], "02.02 - two, surrounded by EOL");
    t.strictSame(fix("a&nbsp;b"), [], "02.03 - surrounded by letters");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${33}m${`nothing to fix`}\u001b[${39}m`} - default callback, decode`,
  (t) => {
    // controls:
    t.strictSame(fix("&nbsp;"), [], "03.01");
    t.strictSame(fix("&nbsp;", { decode: false }), [], "03.02");
    t.strictSame(
      fix("&nbsp;", {
        decode: false,
        cb: (obj) => obj,
      }),
      [],
      "03.03"
    );

    // the main check:
    t.strictSame(fix("&nbsp;", { decode: true }), [[0, 6, "\xA0"]], "03.04");
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${33}m${`nothing to fix`}\u001b[${39}m`} - full callback, decode`,
  (t) => {
    // same as 03.003 except has a callback to ensure correct rule name is reported
    t.strictSame(
      fix("&nbsp;", {
        decode: true,
        cb: (obj) => obj,
      }),
      [
        {
          ruleName: `encoded-html-entity-nbsp`,
          entityName: "nbsp",
          rangeFrom: 0,
          rangeTo: 6,
          rangeValEncoded: "&nbsp;",
          rangeValDecoded: "\xA0",
        },
      ],
      "04"
    );
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${33}m${`nothing to fix`}\u001b[${39}m`} - two, surrounded by EOL`,
  (t) => {
    t.strictSame(
      fix("&nbsp; &nbsp;", { decode: true }),
      [
        [0, 6, "\xA0"],
        [7, 13, "\xA0"],
      ],
      "05"
    );
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${33}m${`nothing to fix`}\u001b[${39}m`} - surrounded by letters`,
  (t) => {
    t.strictSame(fix("a&nbsp;b", { decode: true }), [[1, 7, "\xA0"]], "06");
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${33}m${`nothing to fix`}\u001b[${39}m`} - various - decode off`,
  (t) => {
    t.strictSame(fix("z&hairsp;y"), [], "07.01");
    t.strictSame(fix("y&VeryThinSpace;z"), [], "07.02");
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${33}m${`nothing to fix`}\u001b[${39}m`} - hairsp - decode on`,
  (t) => {
    t.strictSame(fix("z&hairsp;y", { decode: true }), [[1, 9, "\u200A"]], "08");
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${33}m${`nothing to fix`}\u001b[${39}m`} - VeryThinSpace - decode on`,
  (t) => {
    t.strictSame(
      fix("y&VeryThinSpace;z", { decode: true }),
      [[1, 16, "\u200A"]],
      "09"
    );
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${33}m${`nothing to fix`}\u001b[${39}m`} - healthy &pound;`,
  (t) => {
    const inp1 = "&pound;";
    t.strictSame(fix(inp1), [], "10.01");
    t.strictSame(fix(inp1, { decode: true }), [[0, 7, "\xA3"]], "10.02");
    t.end();
  }
);
