import tap from "tap";
import { fixEnt as fix } from "../dist/string-fix-broken-named-entities.esm";

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
    const gathered = [];
    const inp1 = "abc &x  y z; def";
    t.strictSame(
      fix(inp1, {
        cb: (obj) => obj,
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [
        {
          ruleName: `bad-html-entity-unrecognised`,
          entityName: null,
          rangeFrom: 4,
          rangeTo: 12,
          rangeValEncoded: null,
          rangeValDecoded: null,
        },
      ],
      "01.01"
    );
    t.strictSame(gathered, [], "01.02");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - recognised broken entity`,
  (t) => {
    const gathered = [];
    const inp1 = "abc &poumd; def";
    const outp1 = [[4, 11, "&pound;"]];
    t.strictSame(fix(inp1), outp1, "02.01");
    t.strictSame(fix(inp1, { cb }), outp1, "02.02");
    t.strictSame(
      fix(inp1, {
        cb,
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      outp1,
      "02.03"
    );

    t.strictSame(gathered, [], "02.04");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - recognised broken entity, cb() separately`,
  (t) => {
    const gathered = [];
    const inp1 = "abc &p oumd; def";
    // const outp1 = [[4, 12, "&pound;"]];
    t.strictSame(
      fix(inp1, {
        cb: (obj) => obj,
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [
        {
          ruleName: `bad-html-entity-malformed-pound`,
          entityName: "pound",
          rangeFrom: 4,
          rangeTo: 12,
          rangeValEncoded: "&pound;",
          rangeValDecoded: "\xA3", // <= pound symbol
        },
      ],
      "03.01"
    );
    t.strictSame(gathered, [], "03.02");
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - legit entity but with capital letter`,
  (t) => {
    const gathered = [];
    const inp1 = "x &Pound; y";
    const outp1 = [[2, 9, "&pound;"]];
    t.strictSame(fix(inp1), outp1, "04.01");
    t.strictSame(fix(inp1, { cb }), outp1, "04.02");
    t.strictSame(
      fix(inp1, {
        cb,
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      outp1,
      "04.03"
    );
    t.strictSame(gathered, [], "04.04");
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - legit healthy entity should not raise any issues`,
  (t) => {
    const gathered = [];
    const inp1 = "abc &pound; def";
    t.strictSame(fix(inp1), [], "05.01");
    t.strictSame(
      fix(inp1, {
        cb: (obj) => obj,
      }),
      [],
      "05.02"
    );
    t.strictSame(
      fix(inp1, {
        cb: (obj) => obj,
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [],
      "05.03"
    );
    t.strictSame(gathered, [], "05.04");
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - combo of a sneaky legit semicolon and missing semicolon on entity`,
  (t) => {
    const gathered = [];
    const inp1 = "a&poUnd;b";
    const outp1 = [[1, 8, "&pound;"]];
    t.strictSame(fix(inp1), outp1, "06.01");
    t.strictSame(
      fix(inp1, {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      outp1,
      "06.02"
    );
    t.strictSame(gathered, [], "06.03");
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - only first two characters match legit entity`,
  (t) => {
    const gathered = [];
    const inp1 = "abc &pozzz; def";
    t.strictSame(
      fix(inp1, {
        cb: (obj) => obj,
      }),
      [
        {
          ruleName: `bad-html-entity-unrecognised`,
          entityName: null,
          rangeFrom: 4,
          rangeTo: 11,
          rangeValEncoded: null,
          rangeValDecoded: null,
        },
      ],
      "07.01"
    );

    t.strictSame(
      fix(inp1, {
        cb: (obj) => obj,
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [
        {
          ruleName: `bad-html-entity-unrecognised`,
          entityName: null,
          rangeFrom: 4,
          rangeTo: 11,
          rangeValEncoded: null,
          rangeValDecoded: null,
        },
      ],
      "07.02"
    );
    t.strictSame(gathered, [], "07.03");
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - case issues`,
  (t) => {
    const inp1 = "&Poun;";
    const gatheredHealthy = [];
    t.strictSame(
      fix(inp1, {
        cb: (obj) => obj,
        entityCatcherCb: (from, to) => gatheredHealthy.push([from, to]),
      }),
      [
        {
          ruleName: `bad-html-entity-malformed-pound`,
          entityName: "pound",
          rangeFrom: 0,
          rangeTo: 6,
          rangeValEncoded: "&pound;",
          rangeValDecoded: "\xA3", // <= pound symbol
        },
      ],
      "08.01"
    );
    t.strictSame(gatheredHealthy, [], "08.02");
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - case issues`,
  (t) => {
    const gathered = [];
    const inp1 = "&Poun;";
    const gatheredHealthy = [];
    t.strictSame(
      fix(inp1, {
        cb: (obj) => obj,
        entityCatcherCb: (from, to) => gatheredHealthy.push([from, to]),
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [
        {
          ruleName: `bad-html-entity-malformed-pound`,
          entityName: "pound",
          rangeFrom: 0,
          rangeTo: 6,
          rangeValEncoded: "&pound;",
          rangeValDecoded: "\xA3", // <= pound symbol
        },
      ],
      "09.01"
    );
    t.strictSame(gatheredHealthy, [], "09.02");
    t.strictSame(gathered, [], "09.03");
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - space before semicolon`,
  (t) => {
    const oneOfBrokenEntities = "a&pound ;b";
    t.strictSame(
      fix(oneOfBrokenEntities, {
        cb: (obj) => obj,
      }),
      [
        {
          ruleName: `bad-html-entity-malformed-pound`,
          entityName: "pound",
          rangeFrom: 1,
          rangeTo: 9,
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
    const gathered = [];
    const oneOfBrokenEntities = "a&pound ;b";
    t.strictSame(
      fix(oneOfBrokenEntities, {
        cb: (obj) => obj,
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [
        {
          ruleName: `bad-html-entity-malformed-pound`,
          entityName: "pound",
          rangeFrom: 1,
          rangeTo: 9,
          rangeValEncoded: "&pound;",
          rangeValDecoded: "\xA3", // <= pound symbol
        },
      ],
      "11.01"
    );
    t.strictSame(gathered, [], "11.02");
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - twoheadrightarrow wrong case only`,
  (t) => {
    const inp1 = "a&twoheadRightarrow;b";
    t.strictSame(
      fix(inp1, {
        cb: (obj) => obj,
      }),
      [
        {
          ruleName: `bad-html-entity-malformed-twoheadrightarrow`,
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
  `13 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - twoheadrightarrow wrong case only`,
  (t) => {
    const gathered = [];
    const inp1 = "a&twoheadRightarrow;b";
    t.strictSame(
      fix(inp1, {
        cb: (obj) => obj,
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [
        {
          ruleName: `bad-html-entity-malformed-twoheadrightarrow`,
          entityName: "twoheadrightarrow",
          rangeFrom: 1,
          rangeTo: 20,
          rangeValEncoded: "&twoheadrightarrow;",
          rangeValDecoded: "\u21A0",
        },
      ],
      "13.01"
    );
    t.strictSame(gathered, [], "13.02");
    t.end();
  }
);

tap.test(
  `14 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - legit entities with capital letter and known existing alternative with all lowercase`,
  (t) => {
    const inp1 = "x&A lpha;y";
    t.strictSame(
      fix(inp1, {
        cb: (obj) => obj,
      }),
      [
        {
          ruleName: `bad-html-entity-malformed-Alpha`,
          entityName: "Alpha",
          rangeFrom: 1,
          rangeTo: 9,
          rangeValEncoded: "&Alpha;",
          rangeValDecoded: "\u0391",
        },
      ],
      "14"
    );
    t.end();
  }
);

tap.test(
  `15 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - legit entities with capital letter and known existing alternative with all lowercase`,
  (t) => {
    const gathered = [];
    const inp1 = "x&A lpha;y";
    t.strictSame(
      fix(inp1, {
        cb: (obj) => obj,
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [
        {
          ruleName: `bad-html-entity-malformed-Alpha`,
          entityName: "Alpha",
          rangeFrom: 1,
          rangeTo: 9,
          rangeValEncoded: "&Alpha;",
          rangeValDecoded: "\u0391",
        },
      ],
      "15.01"
    );
    t.strictSame(gathered, [], "15.02");
    t.end();
  }
);

tap.test(
  `16 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - ad hoc - &ac d;`,
  (t) => {
    const inp1 = "&ac d;";
    t.strictSame(
      fix(inp1, {
        cb: (obj) => obj,
      }),
      [
        {
          ruleName: `bad-html-entity-malformed-acd`,
          entityName: "acd",
          rangeFrom: 0,
          rangeTo: 6,
          rangeValEncoded: "&acd;",
          rangeValDecoded: "\u223F",
        },
      ],
      "16"
    );
    t.end();
  }
);

tap.test(
  `17 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - ad hoc - &ac d;`,
  (t) => {
    const gathered = [];
    const inp1 = "&ac d;";
    t.strictSame(
      fix(inp1, {
        cb: (obj) => obj,
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [
        {
          ruleName: `bad-html-entity-malformed-acd`,
          entityName: "acd",
          rangeFrom: 0,
          rangeTo: 6,
          rangeValEncoded: "&acd;",
          rangeValDecoded: "\u223F",
        },
      ],
      "17.01"
    );
    t.strictSame(gathered, [], "17.02");
    t.end();
  }
);

tap.test(
  `18 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - ad hoc - &Acd;`,
  (t) => {
    const inp1 = "&Acd;";
    t.strictSame(
      fix(inp1, {
        cb: (obj) => obj,
      }),
      [
        {
          ruleName: `bad-html-entity-malformed-acd`,
          entityName: "acd",
          rangeFrom: 0,
          rangeTo: inp1.length,
          rangeValEncoded: "&acd;",
          rangeValDecoded: "\u223F",
        },
      ],
      "18"
    );
    t.end();
  }
);

tap.test(
  `19 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - ad hoc - &Acd;`,
  (t) => {
    const gathered = [];
    const inp1 = "&Acd;";
    t.strictSame(
      fix(inp1, {
        cb: (obj) => obj,
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [
        {
          ruleName: `bad-html-entity-malformed-acd`,
          entityName: "acd",
          rangeFrom: 0,
          rangeTo: inp1.length,
          rangeValEncoded: "&acd;",
          rangeValDecoded: "\u223F",
        },
      ],
      "19.01"
    );
    t.strictSame(gathered, [], "19.02");
    t.end();
  }
);

tap.test(
  `20 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - ad hoc - &Aelig; - ambiguous case`,
  (t) => {
    const inp1 = "&Aelig;";
    t.strictSame(
      fix(inp1, {
        cb: (obj) => obj,
      }),
      [
        {
          ruleName: `bad-html-entity-unrecognised`,
          entityName: null,
          rangeFrom: 0,
          rangeTo: inp1.length,
          rangeValEncoded: null,
          rangeValDecoded: null,
        },
      ],
      "20"
    );
    t.end();
  }
);

tap.test(
  `21 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - ad hoc - &Aelig; - ambiguous case`,
  (t) => {
    const gathered = [];
    const inp1 = "&Aelig;";
    t.strictSame(
      fix(inp1, {
        cb: (obj) => obj,
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [
        {
          ruleName: `bad-html-entity-unrecognised`,
          entityName: null,
          rangeFrom: 0,
          rangeTo: inp1.length,
          rangeValEncoded: null,
          rangeValDecoded: null,
        },
      ],
      "21.01"
    );
    t.strictSame(gathered, [], "21.02");
    t.end();
  }
);

tap.test(
  `22 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - ad hoc - &zwjn; - known broken entities come before regular checks where semicol might be missing`,
  (t) => {
    const inp1 = "&zwjn;";
    t.strictSame(
      fix(inp1, {
        cb: (obj) => obj,
      }),
      [
        {
          ruleName: `bad-html-entity-malformed-zwnj`,
          entityName: "zwnj",
          rangeFrom: 0,
          rangeTo: inp1.length,
          rangeValEncoded: "&zwnj;",
          rangeValDecoded: "\u200C",
        },
      ],
      "22"
    );
    t.end();
  }
);

tap.test(
  `23 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - ad hoc - &zwjn; - known broken entities come before regular checks where semicol might be missing`,
  (t) => {
    const gathered = [];
    const inp1 = "&zwjn;";
    t.strictSame(
      fix(inp1, {
        cb: (obj) => obj,
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [
        {
          ruleName: `bad-html-entity-malformed-zwnj`,
          entityName: "zwnj",
          rangeFrom: 0,
          rangeTo: inp1.length,
          rangeValEncoded: "&zwnj;",
          rangeValDecoded: "\u200C",
        },
      ],
      "23.01"
    );
    t.strictSame(gathered, [], "23.02");
    t.end();
  }
);

tap.test(
  `24 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - ad hoc - &xcap; - named entity starts with x`,
  (t) => {
    const inp1 = "&xcap;";
    t.strictSame(
      fix(inp1, {
        cb: (obj) => obj,
      }),
      [],
      "24.01"
    );
    t.strictSame(
      fix(inp1, {
        cb: (obj) => obj,
        decode: true,
      }),
      [
        {
          ruleName: `bad-html-entity-encoded-xcap`,
          entityName: "xcap",
          rangeFrom: 0,
          rangeTo: inp1.length,
          rangeValEncoded: "&xcap;",
          rangeValDecoded: "\u22C2",
        },
      ],
      "24.02"
    );
    t.end();
  }
);

tap.test(
  `25 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - ad hoc - &xcap; - named entity starts with x`,
  (t) => {
    const gathered = [];
    const inp1 = "&xcap;";
    t.strictSame(
      fix(inp1, {
        cb: (obj) => obj,
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [],
      "25.01"
    );
    t.strictSame(gathered, [], "25.02");
    t.end();
  }
);

tap.test(
  `26 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - ad hoc - &xcap; - named entity starts with x`,
  (t) => {
    const gathered = [];
    const inp1 = "&xcap;";
    t.strictSame(
      fix(inp1, {
        cb: (obj) => obj,
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
        decode: true,
      }),
      [
        {
          ruleName: `bad-html-entity-encoded-xcap`,
          entityName: "xcap",
          rangeFrom: 0,
          rangeTo: inp1.length,
          rangeValEncoded: "&xcap;",
          rangeValDecoded: "\u22C2",
        },
      ],
      "26.01"
    );
    t.strictSame(gathered, [], "26.02");
    t.end();
  }
);

tap.test(
  `27 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - ad hoc 1`,
  (t) => {
    const inp1 = "&nbsp;&nbsp;";
    t.strictSame(
      fix(inp1, {
        cb: (obj) => obj,
      }),
      [],
      "27"
    );
    t.end();
  }
);

tap.test(
  `28 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - ad hoc 1`,
  (t) => {
    const gathered = [];
    const inp1 = "&nbsp;&nbsp;";
    t.strictSame(
      fix(inp1, {
        cb: (obj) => obj,
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [],
      "28.01"
    );
    t.strictSame(gathered, [], "28.02");
    t.end();
  }
);

tap.test(
  `29 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - ad hoc 2`,
  (t) => {
    const gathered = [];
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
    inputs.forEach((input, i) =>
      t.strictSame(fix(input), [], `"${input}" - ${i}`)
    );
    inputs.forEach((input, i) =>
      t.strictSame(
        fix(input, {
          textAmpersandCatcherCb: (idx) => {
            gathered.push(idx);
          },
        }),
        [],
        `"${input}" - ${i}`
      )
    );
    t.strictSame(gathered, [], "29");
    t.end();
  }
);

tap.test(
  `30 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - ad hoc 3`,
  (t) => {
    const inp1 = "&NBSP;&NBSP;";
    t.strictSame(
      fix(inp1),
      [
        [0, 6, "&nbsp;"],
        [6, 12, "&nbsp;"],
      ],
      "30"
    );
    t.end();
  }
);

tap.test(
  `31 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - ad hoc 3`,
  (t) => {
    const gathered = [];
    const inp1 = "&NBSP;&NBSP;";
    t.strictSame(
      fix(inp1, {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [
        [0, 6, "&nbsp;"],
        [6, 12, "&nbsp;"],
      ],
      "31.01"
    );
    t.strictSame(gathered, [], "31.02");
    t.end();
  }
);

tap.test(
  `32 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - ad hoc 4`,
  (t) => {
    const inp1 = "&NBSP;&NBSP;&NBSP; a &NBSP;&NBSP;&NBSP;";
    t.strictSame(
      fix(inp1),
      [
        [0, 6, "&nbsp;"],
        [6, 12, "&nbsp;"],
        [12, 18, "&nbsp;"],
        [21, 27, "&nbsp;"],
        [27, 33, "&nbsp;"],
        [33, 39, "&nbsp;"],
      ],
      "32"
    );
    t.end();
  }
);

tap.test(
  `33 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - ad hoc 4`,
  (t) => {
    const gathered = [];
    const inp1 = "&NBSP;&NBSP;&NBSP; a &NBSP;&NBSP;&NBSP;";
    t.strictSame(
      fix(inp1, {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [
        [0, 6, "&nbsp;"],
        [6, 12, "&nbsp;"],
        [12, 18, "&nbsp;"],
        [21, 27, "&nbsp;"],
        [27, 33, "&nbsp;"],
        [33, 39, "&nbsp;"],
      ],
      "33.01"
    );
    t.strictSame(gathered, [], "33.02");
    t.end();
  }
);

tap.test(
  `34 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - ad hoc 5`,
  (t) => {
    const inp1 = "&nbsp;&nbsp;&bsp; a &nbsp;&nnbsp;&nbsp;";
    t.strictSame(
      fix(inp1),
      [
        [12, 17, "&nbsp;"],
        [26, 33, "&nbsp;"],
      ],
      "34"
    );
    t.end();
  }
);

tap.test(
  `35 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - ad hoc 5`,
  (t) => {
    const gathered = [];
    const inp1 = "&nbsp;&nbsp;&bsp; a &nbsp;&nnbsp;&nbsp;";
    t.strictSame(
      fix(inp1, {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [
        [12, 17, "&nbsp;"],
        [26, 33, "&nbsp;"],
      ],
      "35.01"
    );
    t.strictSame(gathered, [], "35.02");
    t.end();
  }
);

tap.test(
  `36 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - ad hoc 6`,
  (t) => {
    const inp1 = "&nbsp;&bsp;&nnbsp; a &nbsp;&nnbsp;&nnbsp;";
    t.strictSame(
      fix(inp1),
      [
        [6, 11, "&nbsp;"],
        [11, 18, "&nbsp;"],
        [27, 34, "&nbsp;"],
        [34, 41, "&nbsp;"],
      ],
      "36"
    );
    t.end();
  }
);

tap.test(
  `37 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - ad hoc 6`,
  (t) => {
    const gathered = [];
    const inp1 = "&nbsp;&bsp;&nnbsp; a &nbsp;&nnbsp;&nnbsp;";
    t.strictSame(
      fix(inp1, {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [
        [6, 11, "&nbsp;"],
        [11, 18, "&nbsp;"],
        [27, 34, "&nbsp;"],
        [34, 41, "&nbsp;"],
      ],
      "37.01"
    );
    t.strictSame(gathered, [], "37.02");
    t.end();
  }
);

tap.test(
  `38 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - overlap`,
  (t) => {
    t.strictSame(
      fix("&ang&;ang;"),
      [
        [0, 4, "&ang;"],
        [4, 10, "&ang;"],
      ],
      "38"
    );
    t.end();
  }
);

tap.test(
  `39 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - overlap`,
  (t) => {
    const gathered = [];
    t.strictSame(
      fix("&ang&;ang;", {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [
        [0, 4, "&ang;"],
        [4, 10, "&ang;"],
      ],
      "39.01"
    );
    t.strictSame(gathered, [], "39.02");
    t.end();
  }
);

tap.test(
  `40 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - overlap`,
  (t) => {
    t.strictSame(fix("the &;ang;100"), [[4, 10, "&ang;"]], "40");
    t.end();
  }
);

tap.test(
  `41 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - overlap`,
  (t) => {
    const gathered = [];
    t.strictSame(
      fix("the &;ang;100", {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [[4, 10, "&ang;"]],
      "41.01"
    );
    t.strictSame(gathered, [], "41.02");
    t.end();
  }
);

tap.test(
  `42 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - dubious Levenshtein`,
  (t) => {
    t.strictSame(fix("&Ifz;"), [[0, 5, "&Ifr;"]], "42");
    t.end();
  }
);

tap.test(
  `43 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - dubious Levenshtein`,
  (t) => {
    const gathered = [];
    t.strictSame(
      fix("&Ifz;", {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [[0, 5, "&Ifr;"]],
      "43.01"
    );
    t.strictSame(gathered, [], "43.02");
    t.end();
  }
);

tap.test(
  `44 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - dubious Levenshtein`,
  (t) => {
    t.strictSame(fix("&ifz;"), [[0, 5]], "44");
    t.end();
  }
);

tap.test(
  `45 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - dubious Levenshtein`,
  (t) => {
    const gathered = [];
    t.strictSame(
      fix("&ifz;", {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [[0, 5]],
      "45.01"
    );
    t.strictSame(gathered, [], "45.02");
    t.end();
  }
);

tap.test(
  `46 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - dubious Levenshtein`,
  (t) => {
    t.strictSame(fix("&ifz;&"), [[0, 5]], "46");
    t.end();
  }
);

tap.test(
  `47 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - dubious Levenshtein`,
  (t) => {
    const gathered = [];
    t.strictSame(
      fix("&ifz;&", {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [[0, 5]],
      "47.01"
    );
    t.strictSame(gathered, [], "47.02");
    t.end();
  }
);

tap.test(
  `48 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - definitely not an entity`,
  (t) => {
    t.strictSame(
      fix("&lhdfgdfgdllkjghlfjjhdkfghkjdfhkghfkhgjkfjhlkfjglhjfgkljhlfjhl;"),
      [],
      "48"
    );
    t.end();
  }
);

tap.test(
  `49 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - definitely not an entity`,
  (t) => {
    const gathered = [];
    t.strictSame(
      fix("&lhdfgdfgdllkjghlfjjhdkfghkjdfhkghfkhgjkfjhlkfjglhjfgkljhlfjhl;", {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [],
      "49.01"
    );
    t.strictSame(gathered, [], "49.02");
    t.end();
  }
);

tap.test(
  `50 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - lorem ipsum paragraph`,
  (t) => {
    t.strictSame(
      fix(
        "&Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum;"
      ),
      [],
      "50"
    );
    t.end();
  }
);

tap.test(
  `51 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - lorem ipsum paragraph`,
  (t) => {
    const gathered = [];
    t.strictSame(
      fix(
        "&Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum;",
        {
          textAmpersandCatcherCb: (idx) => {
            gathered.push(idx);
          },
        }
      ),
      [],
      "51.01"
    );
    t.strictSame(gathered, [0], "51.02");
    t.end();
  }
);

tap.test(
  `52 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - lorem ipsum paragraph`,
  (t) => {
    t.strictSame(
      fix(
        "&nbsp ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum;"
      ),
      [[0, 5, "&nbsp;"]],
      "52"
    );
    t.end();
  }
);

tap.test(
  `53 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - lorem ipsum paragraph`,
  (t) => {
    const gathered = [];
    t.strictSame(
      fix(
        "&nbsp ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum;",
        {
          textAmpersandCatcherCb: (idx) => {
            gathered.push(idx);
          },
        }
      ),
      [[0, 5, "&nbsp;"]],
      "53.01"
    );
    t.strictSame(gathered, [], "53.02");
    t.end();
  }
);

tap.test(`54`, (t) => {
  t.strictSame(fix("&; &; &;"), [], "54");
  t.end();
});

tap.test(`55`, (t) => {
  const gathered = [];
  t.strictSame(
    fix("&; &; &;", {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [],
    "55.01"
  );
  t.strictSame(gathered, [0, 3, 6], "55.02");
  t.end();
});
