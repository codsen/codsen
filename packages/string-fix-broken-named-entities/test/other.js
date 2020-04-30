import tap from "tap";
import fix from "../dist/string-fix-broken-named-entities.esm";

// -----------------------------------------------------------------------------
// helper functions
// -----------------------------------------------------------------------------

function cb(obj) {
  return obj.rangeValEncoded
    ? [obj.rangeFrom, obj.rangeTo, obj.rangeValEncoded]
    : [obj.rangeFrom, obj.rangeTo];
}

// -----------------------------------------------------------------------------
// 10. not broken HTML entities: unrecognised or recognised and correct
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`unrecognised`}\u001b[${39}m - one`,
  (t) => {
    const inp1 = "abc &x  y z; def";
    t.same(
      fix(inp1, {
        cb: (obj) => obj,
      }),
      [
        {
          ruleName: `bad-named-html-entity-unrecognised`,
          entityName: null,
          rangeFrom: 4,
          rangeTo: 12,
          rangeValEncoded: null,
          rangeValDecoded: null,
        },
      ],
      "01"
    );
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - recognised broken entity`,
  (t) => {
    const inp1 = "abc &poumd; def";
    const outp1 = [[4, 11, "&pound;"]];
    t.same(fix(inp1), outp1, "02.01");
    t.same(fix(inp1, { cb }), outp1, "02.02");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - recognised broken entity, cb() separately`,
  (t) => {
    const inp1 = "abc &p oumd; def";
    // const outp1 = [[4, 12, "&pound;"]];
    t.same(
      fix(inp1, {
        cb: (obj) => obj,
      }),
      [
        {
          ruleName: `bad-named-html-entity-malformed-pound`,
          entityName: "pound",
          rangeFrom: 4,
          rangeTo: 12,
          rangeValEncoded: "&pound;",
          rangeValDecoded: "\xA3", // <= pound symbol
        },
      ],
      "03"
    );
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - legit entity but with capital letter`,
  (t) => {
    const inp1 = "x &Pound; y";
    const outp1 = [[2, 9, "&pound;"]];
    t.same(fix(inp1), outp1, "05.01");
    t.same(fix(inp1, { cb }), outp1, "05.02");
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - legit healthy entity should not raise any issues`,
  (t) => {
    const inp1 = "abc &pound; def";
    t.same(fix(inp1), [], "06.01");
    t.same(
      fix(inp1, {
        cb: (obj) => obj,
      }),
      [],
      "06"
    );
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - combo of a sneaky legit semicolon and missing semicolon on entity`,
  (t) => {
    const inp1 = "a&poUnd;b";
    const outp1 = [[1, 8, "&pound;"]];
    t.same(fix(inp1), outp1, "08");
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - only first two characters match legit entity`,
  (t) => {
    const inp1 = "abc &pozzz; def";
    t.same(
      fix(inp1, {
        cb: (obj) => obj,
      }),
      [
        {
          ruleName: `bad-named-html-entity-unrecognised`,
          entityName: null,
          rangeFrom: 4,
          rangeTo: 11,
          rangeValEncoded: null,
          rangeValDecoded: null,
        },
      ],
      "09"
    );
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - case issues`,
  (t) => {
    const inp1 = "&Poun;";
    t.same(
      fix(inp1, {
        cb: (obj) => obj,
      }),
      [
        {
          ruleName: `bad-named-html-entity-malformed-pound`,
          entityName: "pound",
          rangeFrom: 0,
          rangeTo: 6,
          rangeValEncoded: "&pound;",
          rangeValDecoded: "\xA3", // <= pound symbol
        },
      ],
      "10"
    );
    t.end();
  }
);

tap.test(
  `11 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - space before semicolon`,
  (t) => {
    const oneOfBrokenEntities = "a&pound ;b";
    t.same(
      fix(oneOfBrokenEntities, {
        cb: (obj) => obj,
      }),
      [
        {
          ruleName: `bad-named-html-entity-malformed-pound`,
          entityName: "pound",
          rangeFrom: 1,
          rangeTo: 9,
          rangeValEncoded: "&pound;",
          rangeValDecoded: "\xA3", // <= pound symbol
        },
      ],
      "11"
    );
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - twoheadrightarrow wrong case only`,
  (t) => {
    const inp1 = "a&twoheadRightarrow;b";
    t.same(
      fix(inp1, {
        cb: (obj) => obj,
      }),
      [
        {
          ruleName: `bad-named-html-entity-malformed-twoheadrightarrow`,
          entityName: "twoheadrightarrow",
          rangeFrom: 1,
          rangeTo: 20,
          rangeValEncoded: "&twoheadrightarrow;",
          rangeValDecoded: "\u21A0",
        },
      ],
      "12"
    );
    t.end();
  }
);

tap.test(
  `13 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - legit entities with capital letter and known existing alternative with all lowercase`,
  (t) => {
    const inp1 = "x&A lpha;y";
    t.same(
      fix(inp1, {
        cb: (obj) => obj,
      }),
      [
        {
          ruleName: `bad-named-html-entity-malformed-Alpha`,
          entityName: "Alpha",
          rangeFrom: 1,
          rangeTo: 9,
          rangeValEncoded: "&Alpha;",
          rangeValDecoded: "\u0391",
        },
      ],
      "13"
    );
    t.end();
  }
);

tap.test(
  `14 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - ad hoc - &ac d;`,
  (t) => {
    const inp1 = "&ac d;";
    t.same(
      fix(inp1, {
        cb: (obj) => obj,
      }),
      [
        {
          ruleName: `bad-named-html-entity-malformed-acd`,
          entityName: "acd",
          rangeFrom: 0,
          rangeTo: 6,
          rangeValEncoded: "&acd;",
          rangeValDecoded: "\u223F",
        },
      ],
      "14"
    );
    t.end();
  }
);

tap.test(
  `15 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - ad hoc - &Acd;`,
  (t) => {
    const inp1 = "&Acd;";
    t.same(
      fix(inp1, {
        cb: (obj) => obj,
      }),
      [
        {
          ruleName: `bad-named-html-entity-malformed-acd`,
          entityName: "acd",
          rangeFrom: 0,
          rangeTo: inp1.length,
          rangeValEncoded: "&acd;",
          rangeValDecoded: "\u223F",
        },
      ],
      "15"
    );
    t.end();
  }
);

tap.test(
  `16 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - ad hoc - &Aelig; - ambiguous case`,
  (t) => {
    const inp1 = "&Aelig;";
    t.same(
      fix(inp1, {
        cb: (obj) => obj,
      }),
      [
        {
          ruleName: `bad-named-html-entity-unrecognised`,
          entityName: null,
          rangeFrom: 0,
          rangeTo: inp1.length,
          rangeValEncoded: null,
          rangeValDecoded: null,
        },
      ],
      "16"
    );
    t.end();
  }
);

tap.test(
  `17 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - ad hoc - &zwjn; - known broken entities come before regular checks where semicol might be missing`,
  (t) => {
    const inp1 = "&zwjn;";
    t.same(
      fix(inp1, {
        cb: (obj) => obj,
      }),
      [
        {
          ruleName: `bad-named-html-entity-malformed-zwnj`,
          entityName: "zwnj",
          rangeFrom: 0,
          rangeTo: inp1.length,
          rangeValEncoded: "&zwnj;",
          rangeValDecoded: "\u200C",
        },
      ],
      "17"
    );
    t.end();
  }
);

tap.test(
  `18 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - ad hoc - &xcap; - named entity starts with x`,
  (t) => {
    const inp1 = "&xcap;";
    t.same(
      fix(inp1, {
        cb: (obj) => obj,
      }),
      [],
      "18.01"
    );
    t.same(
      fix(inp1, {
        cb: (obj) => obj,
        decode: true,
      }),
      [
        {
          ruleName: `encoded-html-entity-xcap`,
          entityName: "xcap",
          rangeFrom: 0,
          rangeTo: inp1.length,
          rangeValEncoded: "&xcap;",
          rangeValDecoded: "\u22C2",
        },
      ],
      "18.02"
    );
    t.end();
  }
);

tap.test(
  `19 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - ad hoc 1`,
  (t) => {
    const inp1 = "&nbsp;&nbsp;";
    t.same(
      fix(inp1, {
        cb: (obj) => obj,
      }),
      []
    );
    t.end();
  }
);

tap.test(
  `20 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - ad hoc 2`,
  (t) => {
    const inputs = [
      "&nbsp;&nbsp;&nbsp; a &nbsp;&nbsp;&nbsp;",
      "&nbsp; &nbsp; &nbsp; a &nbsp; &nbsp; &nbsp;",
      " &nbsp; &nbsp; &nbsp; a &nbsp; &nbsp; &nbsp; ",
      "&nbsp;a&nbsp;a&nbsp; a &nbsp;a&nbsp;a&nbsp;",
      "&nbsp;\n&nbsp;\n&nbsp;\n\na\n&nbsp;\n&nbsp;\n&nbsp;",
      "&nbsp;\r\n&nbsp;\r\n&nbsp;\r\n\r\na\r\n&nbsp;\r\n&nbsp;\r\n&nbsp;",
      "&nbsp;\r&nbsp;\r&nbsp;\r\ra\r&nbsp;\r&nbsp;\r&nbsp;",
      "&nbsp;\t&nbsp;\t&nbsp;\t\ta\t&nbsp;\t&nbsp;\t&nbsp;",
      "&nbsp;&nbsp;&nbsp; a &nbsp;&nbsp;&nbsp;",
    ];
    inputs.forEach((input, i) => t.same(fix(input), [], `"${input}" - ${i}`));
    t.end();
  }
);

tap.test(
  `21 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - ad hoc 3`,
  (t) => {
    const inp1 = "&NBSP;&NBSP;";
    t.same(fix(inp1), [
      [0, 6, "&nbsp;"],
      [6, 12, "&nbsp;"],
    ]);
    t.end();
  }
);

tap.test(
  `22 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - ad hoc 4`,
  (t) => {
    const inp1 = "&NBSP;&NBSP;&NBSP; a &NBSP;&NBSP;&NBSP;";
    t.same(fix(inp1), [
      [0, 6, "&nbsp;"],
      [6, 12, "&nbsp;"],
      [12, 18, "&nbsp;"],
      [21, 27, "&nbsp;"],
      [27, 33, "&nbsp;"],
      [33, 39, "&nbsp;"],
    ]);
    t.end();
  }
);

tap.test(
  `23 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - ad hoc 5`,
  (t) => {
    const inp1 = "&nbsp;&nbsp;&bsp; a &nbsp;&nnbsp;&nbsp;";
    t.same(fix(inp1), [
      [12, 17, "&nbsp;"],
      [26, 33, "&nbsp;"],
    ]);
    t.end();
  }
);

tap.test(
  `24 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - ad hoc 6`,
  (t) => {
    const inp1 = "&nbsp;&bsp;&nnbsp; a &nbsp;&nnbsp;&nnbsp;";
    t.same(fix(inp1), [
      [6, 11, "&nbsp;"],
      [11, 18, "&nbsp;"],
      [27, 34, "&nbsp;"],
      [34, 41, "&nbsp;"],
    ]);
    t.end();
  }
);

tap.test(
  `25 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - overlap`,
  (t) => {
    t.same(
      fix("&ang&;ang;"),
      [
        [0, 4, "&ang;"],
        [4, 10, "&ang;"],
      ],
      "25"
    );
    t.end();
  }
);

tap.test(
  `26 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - overlap`,
  (t) => {
    t.same(fix("the &;ang;100"), [[4, 10, "&ang;"]], "26");
    t.end();
  }
);
