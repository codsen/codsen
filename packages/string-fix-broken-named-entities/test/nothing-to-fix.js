import tap from "tap";
import fix from "../dist/string-fix-broken-named-entities.esm";

// -----------------------------------------------------------------------------
// 03. nothing to fix
// -----------------------------------------------------------------------------

tap.test(
  `03.001 - ${`\u001b[${33}m${`nothing to fix`}\u001b[${39}m`} - false positives`,
  (t) => {
    t.same(fix("insp;"), [], "03.001.01");
    t.same(fix("an insp;"), [], "03.001.02");
    t.same(fix("an inspp;"), [], "03.001.03");

    // decode on:
    t.same(fix("insp;", { decode: true }), [], "03.001.04");
    t.same(fix("an insp;", { decode: true }), [], "03.001.05");
    t.same(fix("an inspp;", { decode: true }), [], "03.001.06");
    t.end();
  }
);

tap.test(
  `03.002 - ${`\u001b[${33}m${`nothing to fix`}\u001b[${39}m`} - no decode requested`,
  (t) => {
    t.same(fix("&nbsp;"), [], "03.002.01 - one, surrounded by EOL");
    t.same(fix("&nbsp; &nbsp;"), [], "03.002.02 - two, surrounded by EOL");
    t.same(fix("a&nbsp;b"), [], "03.002.03 - surrounded by letters");
    t.end();
  }
);

tap.test(
  `03.003 - ${`\u001b[${33}m${`nothing to fix`}\u001b[${39}m`} - default callback, decode`,
  (t) => {
    // controls:
    t.same(fix("&nbsp;"), [], "03.003.01");
    t.same(fix("&nbsp;", { decode: false }), [], "03.003.02");
    t.same(
      fix("&nbsp;", {
        decode: false,
        cb: (obj) => obj,
      }),
      [],
      "03.003.03"
    );

    // the main check:
    t.same(fix("&nbsp;", { decode: true }), [[0, 6, "\xA0"]], "03.003.04");
    t.end();
  }
);

tap.test(
  `03.004 - ${`\u001b[${33}m${`nothing to fix`}\u001b[${39}m`} - full callback, decode`,
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
      "03.004"
    );
    t.end();
  }
);

tap.test(
  `03.005 - ${`\u001b[${33}m${`nothing to fix`}\u001b[${39}m`} - two, surrounded by EOL`,
  (t) => {
    t.same(
      fix("&nbsp; &nbsp;", { decode: true }),
      [
        [0, 6, "\xA0"],
        [7, 13, "\xA0"],
      ],
      "03.005"
    );
    t.end();
  }
);

tap.test(
  `03.006 - ${`\u001b[${33}m${`nothing to fix`}\u001b[${39}m`} - surrounded by letters`,
  (t) => {
    t.same(fix("a&nbsp;b", { decode: true }), [[1, 7, "\xA0"]], "03.006");
    t.end();
  }
);

tap.test(
  `03.007 - ${`\u001b[${33}m${`nothing to fix`}\u001b[${39}m`} - various - decode off`,
  (t) => {
    t.same(fix("z&hairsp;y"), [], "03.007.01");
    t.same(fix("y&VeryThinSpace;z"), [], "03.007.02");
    t.end();
  }
);

tap.test(
  `03.008 - ${`\u001b[${33}m${`nothing to fix`}\u001b[${39}m`} - hairsp - decode on`,
  (t) => {
    t.same(fix("z&hairsp;y", { decode: true }), [[1, 9, "\u200A"]], "03.008");
    t.end();
  }
);

tap.test(
  `03.009 - ${`\u001b[${33}m${`nothing to fix`}\u001b[${39}m`} - VeryThinSpace - decode on`,
  (t) => {
    t.same(
      fix("y&VeryThinSpace;z", { decode: true }),
      [[1, 16, "\u200A"]],
      "03.009"
    );
    t.end();
  }
);

tap.test(
  `03.010 - ${`\u001b[${33}m${`nothing to fix`}\u001b[${39}m`} - healthy &pound;`,
  (t) => {
    const inp1 = "&pound;";
    t.same(fix(inp1), [], "03.010.01");
    t.same(fix(inp1, { decode: true }), [[0, 7, "\xA3"]], "03.010.02");
    t.end();
  }
);
