import tap from "tap";
import fix from "../dist/string-fix-broken-named-entities.esm";

// -----------------------------------------------------------------------------
// 03. nothing to fix
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${33}m${`nothing to fix`}\u001b[${39}m`} - false positives`,
  (t) => {
    t.same(fix("insp;"), [], "01.01");
    t.same(fix("an insp;"), [], "01.02");
    t.same(fix("an inspp;"), [], "01.03");

    // decode on:
    t.same(fix("insp;", { decode: true }), [], "01.04");
    t.same(fix("an insp;", { decode: true }), [], "01.05");
    t.same(fix("an inspp;", { decode: true }), [], "01.06");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${33}m${`nothing to fix`}\u001b[${39}m`} - no decode requested`,
  (t) => {
    t.same(fix("&nbsp;"), [], "02.01 - one, surrounded by EOL");
    t.same(fix("&nbsp; &nbsp;"), [], "02.02 - two, surrounded by EOL");
    t.same(fix("a&nbsp;b"), [], "02.03 - surrounded by letters");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${33}m${`nothing to fix`}\u001b[${39}m`} - default callback, decode`,
  (t) => {
    // controls:
    t.same(fix("&nbsp;"), [], "03.01");
    t.same(fix("&nbsp;", { decode: false }), [], "03.02");
    t.same(
      fix("&nbsp;", {
        decode: false,
        cb: (obj) => obj,
      }),
      [],
      "03.03"
    );

    // the main check:
    t.same(fix("&nbsp;", { decode: true }), [[0, 6, "\xA0"]], "03.04");
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${33}m${`nothing to fix`}\u001b[${39}m`} - full callback, decode`,
  (t) => {
    // same as 03.003 except has a callback to ensure correct rule name is reported
    t.same(
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
    t.same(
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
    t.same(fix("a&nbsp;b", { decode: true }), [[1, 7, "\xA0"]], "06");
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${33}m${`nothing to fix`}\u001b[${39}m`} - various - decode off`,
  (t) => {
    t.same(fix("z&hairsp;y"), [], "07.01");
    t.same(fix("y&VeryThinSpace;z"), [], "07.02");
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${33}m${`nothing to fix`}\u001b[${39}m`} - hairsp - decode on`,
  (t) => {
    t.same(fix("z&hairsp;y", { decode: true }), [[1, 9, "\u200A"]], "08");
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${33}m${`nothing to fix`}\u001b[${39}m`} - VeryThinSpace - decode on`,
  (t) => {
    t.same(
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
    t.same(fix(inp1), [], "10.01");
    t.same(fix(inp1, { decode: true }), [[0, 7, "\xA3"]], "10.02");
    t.end();
  }
);
