import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import fix from "./util/util.js";
import {
  fixEnt,
  // allRules,
} from "../dist/string-fix-broken-named-entities.esm.js";

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

test(`01 - ${`\u001b[${34}m${"other cases"}\u001b[${39}m`} - \u001b[${32}m${"unrecognised"}\u001b[${39}m - one`, () => {
  let gathered = [];
  let inp1 = "abc &x  y z; def";
  equal(
    fix(ok, inp1, {
      cb: (obj) => obj,
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [
      {
        ruleName: "bad-html-entity-unrecognised",
        entityName: null,
        rangeFrom: 4,
        rangeTo: 12,
        rangeValEncoded: null,
        rangeValDecoded: null,
      },
    ],
    "01.01",
  );
  equal(gathered, [], "01.02");
});

test(`02 - ${`\u001b[${34}m${"other cases"}\u001b[${39}m`} - \u001b[${32}m${"recognised"}\u001b[${39}m - recognised broken entity`, () => {
  let gathered = [];
  let inp1 = "abc &poumd; def";
  let outp1 = [[4, 11, "&pound;"]];
  equal(fix(ok, inp1), outp1, "02.01");
  equal(fix(ok, inp1, { cb }), outp1, "02.02");
  equal(
    fix(ok, inp1, {
      cb,
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    outp1,
    "02.03",
  );

  equal(gathered, [], "02.04");
});

test(`03 - ${`\u001b[${34}m${"other cases"}\u001b[${39}m`} - \u001b[${32}m${"recognised"}\u001b[${39}m - recognised broken entity, cb() separately`, () => {
  let gathered = [];
  let inp1 = "abc &p oumd; def";
  // const outp1 = [[4, 12, "&pound;"]];
  equal(
    fix(ok, inp1, {
      cb: (obj) => obj,
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [
      {
        ruleName: "bad-html-entity-malformed-pound",
        entityName: "pound",
        rangeFrom: 4,
        rangeTo: 12,
        rangeValEncoded: "&pound;",
        rangeValDecoded: "\xA3", // <= pound symbol
      },
    ],
    "03.01",
  );
  equal(gathered, [], "03.02");
});

test(`04 - ${`\u001b[${34}m${"other cases"}\u001b[${39}m`} - \u001b[${32}m${"recognised"}\u001b[${39}m - legit entity but with capital letter`, () => {
  let gathered = [];
  let inp1 = "x &Pound; y";
  let outp1 = [[2, 9, "&pound;"]];
  equal(fix(ok, inp1), outp1, "04.01");
  equal(fix(ok, inp1, { cb }), outp1, "04.02");
  equal(
    fix(ok, inp1, {
      cb,
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    outp1,
    "04.03",
  );
  equal(gathered, [], "04.04");
});

test(`05 - ${`\u001b[${34}m${"other cases"}\u001b[${39}m`} - \u001b[${32}m${"recognised"}\u001b[${39}m - legit healthy entity should not raise any issues`, () => {
  let inp1 = "abc &pound; def";
  equal(fix(ok, inp1), [], "05.01");
  equal(
    fix(ok, inp1, {
      cb: (obj) => obj,
    }),
    [],
    "05.02",
  );
});

test(`06 - ${`\u001b[${34}m${"other cases"}\u001b[${39}m`} - \u001b[${32}m${"recognised"}\u001b[${39}m - legit healthy entity should not raise any issues`, () => {
  let gathered = [];
  let inp1 = "abc &pound; def";
  equal(
    fix(ok, inp1, {
      cb: (obj) => obj,
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [],
    "06.01",
  );
  equal(gathered, [], "06.02");
});

test(`07 - ${`\u001b[${34}m${"other cases"}\u001b[${39}m`} - \u001b[${32}m${"recognised"}\u001b[${39}m - combo of a sneaky legit semicolon and missing semicolon on entity`, () => {
  let gathered = [];
  let inp1 = "a&poUnd;b";
  let outp1 = [[1, 8, "&pound;"]];
  equal(fix(ok, inp1), outp1, "07.01");
  equal(
    fix(ok, inp1, {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    outp1,
    "07.02",
  );
  equal(gathered, [], "07.03");
});

test(`08 - ${`\u001b[${34}m${"other cases"}\u001b[${39}m`} - \u001b[${32}m${"recognised"}\u001b[${39}m - only first two characters match legit entity`, () => {
  let gathered = [];
  let inp1 = "abc &pozzz; def";
  equal(
    fix(ok, inp1, {
      cb: (obj) => obj,
    }),
    [
      {
        ruleName: "bad-html-entity-unrecognised",
        entityName: null,
        rangeFrom: 4,
        rangeTo: 11,
        rangeValEncoded: null,
        rangeValDecoded: null,
      },
    ],
    "08.01",
  );

  equal(
    fix(ok, inp1, {
      cb: (obj) => obj,
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [
      {
        ruleName: "bad-html-entity-unrecognised",
        entityName: null,
        rangeFrom: 4,
        rangeTo: 11,
        rangeValEncoded: null,
        rangeValDecoded: null,
      },
    ],
    "08.02",
  );
  equal(gathered, [], "08.03");
});

test(`09 - ${`\u001b[${34}m${"other cases"}\u001b[${39}m`} - \u001b[${32}m${"recognised"}\u001b[${39}m - case issues`, () => {
  let inp1 = "&Poun;";
  let gatheredHealthy = [];
  equal(
    fix(ok, inp1, {
      cb: (obj) => obj,
      entityCatcherCb: (from, to) => gatheredHealthy.push([from, to]),
    }),
    [
      {
        ruleName: "bad-html-entity-malformed-pound",
        entityName: "pound",
        rangeFrom: 0,
        rangeTo: 6,
        rangeValEncoded: "&pound;",
        rangeValDecoded: "\xA3", // <= pound symbol
      },
    ],
    "09.01",
  );
  equal(gatheredHealthy, [], "09.02");
});

test(`10 - ${`\u001b[${34}m${"other cases"}\u001b[${39}m`} - \u001b[${32}m${"recognised"}\u001b[${39}m - case issues`, () => {
  let gathered = [];
  let inp1 = "&Poun;";
  let gatheredHealthy = [];
  equal(
    fix(ok, inp1, {
      cb: (obj) => obj,
      entityCatcherCb: (from, to) => gatheredHealthy.push([from, to]),
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [
      {
        ruleName: "bad-html-entity-malformed-pound",
        entityName: "pound",
        rangeFrom: 0,
        rangeTo: 6,
        rangeValEncoded: "&pound;",
        rangeValDecoded: "\xA3", // <= pound symbol
      },
    ],
    "10.01",
  );
  equal(gatheredHealthy, [], "10.02");
  equal(gathered, [], "10.03");
});

test(`11 - ${`\u001b[${34}m${"other cases"}\u001b[${39}m`} - \u001b[${32}m${"recognised"}\u001b[${39}m - space before semicolon`, () => {
  let oneOfBrokenEntities = "a&pound ;b";
  equal(
    fix(ok, oneOfBrokenEntities, {
      cb: (obj) => obj,
    }),
    [
      {
        ruleName: "bad-html-entity-malformed-pound",
        entityName: "pound",
        rangeFrom: 1,
        rangeTo: 9,
        rangeValEncoded: "&pound;",
        rangeValDecoded: "\xA3", // <= pound symbol
      },
    ],
    "11.01",
  );
});

test(`12 - ${`\u001b[${34}m${"other cases"}\u001b[${39}m`} - \u001b[${32}m${"recognised"}\u001b[${39}m - space before semicolon`, () => {
  let gathered = [];
  let oneOfBrokenEntities = "a&pound ;b";
  equal(
    fix(ok, oneOfBrokenEntities, {
      cb: (obj) => obj,
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [
      {
        ruleName: "bad-html-entity-malformed-pound",
        entityName: "pound",
        rangeFrom: 1,
        rangeTo: 9,
        rangeValEncoded: "&pound;",
        rangeValDecoded: "\xA3", // <= pound symbol
      },
    ],
    "12.01",
  );
  equal(gathered, [], "12.02");
});

test(`13 - ${`\u001b[${34}m${"other cases"}\u001b[${39}m`} - \u001b[${32}m${"recognised"}\u001b[${39}m - twoheadrightarrow wrong case only`, () => {
  let inp1 = "a&twoheadRightarrow;b";
  equal(
    fix(ok, inp1, {
      cb: (obj) => obj,
    }),
    [
      {
        ruleName: "bad-html-entity-malformed-twoheadrightarrow",
        entityName: "twoheadrightarrow",
        rangeFrom: 1,
        rangeTo: 20,
        rangeValEncoded: "&twoheadrightarrow;",
        rangeValDecoded: "\u21A0",
      },
    ],
    "13.01",
  );
});

test(`14 - ${`\u001b[${34}m${"other cases"}\u001b[${39}m`} - \u001b[${32}m${"recognised"}\u001b[${39}m - twoheadrightarrow wrong case only`, () => {
  let gathered = [];
  let inp1 = "a&twoheadRightarrow;b";
  equal(
    fix(ok, inp1, {
      cb: (obj) => obj,
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [
      {
        ruleName: "bad-html-entity-malformed-twoheadrightarrow",
        entityName: "twoheadrightarrow",
        rangeFrom: 1,
        rangeTo: 20,
        rangeValEncoded: "&twoheadrightarrow;",
        rangeValDecoded: "\u21A0",
      },
    ],
    "14.01",
  );
  equal(gathered, [], "14.02");
});

test(`15 - ${`\u001b[${34}m${"other cases"}\u001b[${39}m`} - \u001b[${32}m${"recognised"}\u001b[${39}m - legit entities with capital letter and known existing alternative with all lowercase`, () => {
  let inp1 = "x&A lpha;y";
  equal(
    fix(ok, inp1, {
      cb: (obj) => obj,
    }),
    [
      {
        ruleName: "bad-html-entity-malformed-Alpha",
        entityName: "Alpha",
        rangeFrom: 1,
        rangeTo: 9,
        rangeValEncoded: "&Alpha;",
        rangeValDecoded: "\u0391",
      },
    ],
    "15.01",
  );
});

test(`16 - ${`\u001b[${34}m${"other cases"}\u001b[${39}m`} - \u001b[${32}m${"recognised"}\u001b[${39}m - legit entities with capital letter and known existing alternative with all lowercase`, () => {
  let gathered = [];
  let inp1 = "x&A lpha;y";
  equal(
    fix(ok, inp1, {
      cb: (obj) => obj,
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [
      {
        ruleName: "bad-html-entity-malformed-Alpha",
        entityName: "Alpha",
        rangeFrom: 1,
        rangeTo: 9,
        rangeValEncoded: "&Alpha;",
        rangeValDecoded: "\u0391",
      },
    ],
    "16.01",
  );
  equal(gathered, [], "16.02");
});

test(`17 - ${`\u001b[${34}m${"other cases"}\u001b[${39}m`} - \u001b[${32}m${"recognised"}\u001b[${39}m - ad hoc - &ac d;`, () => {
  let inp1 = "&ac d;";
  equal(
    fix(ok, inp1, {
      cb: (obj) => obj,
    }),
    [
      {
        ruleName: "bad-html-entity-malformed-acd",
        entityName: "acd",
        rangeFrom: 0,
        rangeTo: 6,
        rangeValEncoded: "&acd;",
        rangeValDecoded: "\u223F",
      },
    ],
    "17.01",
  );
});

test(`18 - ${`\u001b[${34}m${"other cases"}\u001b[${39}m`} - \u001b[${32}m${"recognised"}\u001b[${39}m - ad hoc - &ac d;`, () => {
  let gathered = [];
  let inp1 = "&ac d;";
  equal(
    fix(ok, inp1, {
      cb: (obj) => obj,
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [
      {
        ruleName: "bad-html-entity-malformed-acd",
        entityName: "acd",
        rangeFrom: 0,
        rangeTo: 6,
        rangeValEncoded: "&acd;",
        rangeValDecoded: "\u223F",
      },
    ],
    "18.01",
  );
  equal(gathered, [], "18.02");
});

test(`19 - ${`\u001b[${34}m${"other cases"}\u001b[${39}m`} - \u001b[${32}m${"recognised"}\u001b[${39}m - ad hoc - &Acd;`, () => {
  let inp1 = "&Acd;";
  equal(
    fix(ok, inp1, {
      cb: (obj) => obj,
    }),
    [
      {
        ruleName: "bad-html-entity-malformed-acd",
        entityName: "acd",
        rangeFrom: 0,
        rangeTo: inp1.length,
        rangeValEncoded: "&acd;",
        rangeValDecoded: "\u223F",
      },
    ],
    "19.01",
  );
});

test(`20 - ${`\u001b[${34}m${"other cases"}\u001b[${39}m`} - \u001b[${32}m${"recognised"}\u001b[${39}m - ad hoc - &Acd;`, () => {
  let gathered = [];
  let inp1 = "&Acd;";
  equal(
    fix(ok, inp1, {
      cb: (obj) => obj,
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [
      {
        ruleName: "bad-html-entity-malformed-acd",
        entityName: "acd",
        rangeFrom: 0,
        rangeTo: inp1.length,
        rangeValEncoded: "&acd;",
        rangeValDecoded: "\u223F",
      },
    ],
    "20.01",
  );
  equal(gathered, [], "20.02");
});

test(`21 - ${`\u001b[${34}m${"other cases"}\u001b[${39}m`} - \u001b[${32}m${"recognised"}\u001b[${39}m - ad hoc - &Aelig; - ambiguous case`, () => {
  let inp1 = "&Aelig;";
  equal(
    fix(ok, inp1, {
      cb: (obj) => obj,
    }),
    [
      {
        ruleName: "bad-html-entity-unrecognised",
        entityName: null,
        rangeFrom: 0,
        rangeTo: inp1.length,
        rangeValEncoded: null,
        rangeValDecoded: null,
      },
    ],
    "21.01",
  );
});

test(`22 - ${`\u001b[${34}m${"other cases"}\u001b[${39}m`} - \u001b[${32}m${"recognised"}\u001b[${39}m - ad hoc - &Aelig; - ambiguous case`, () => {
  let gathered = [];
  let inp1 = "&Aelig;";
  equal(
    fix(ok, inp1, {
      cb: (obj) => obj,
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [
      {
        ruleName: "bad-html-entity-unrecognised",
        entityName: null,
        rangeFrom: 0,
        rangeTo: inp1.length,
        rangeValEncoded: null,
        rangeValDecoded: null,
      },
    ],
    "22.01",
  );
  equal(gathered, [], "22.02");
});

test(`23 - ${`\u001b[${34}m${"other cases"}\u001b[${39}m`} - \u001b[${32}m${"recognised"}\u001b[${39}m - ad hoc - &zwjn; - known broken entities come before regular checks where semicol might be missing`, () => {
  let inp1 = "&zwjn;";
  equal(
    fix(ok, inp1, {
      cb: (obj) => obj,
    }),
    [
      {
        ruleName: "bad-html-entity-malformed-zwnj",
        entityName: "zwnj",
        rangeFrom: 0,
        rangeTo: inp1.length,
        rangeValEncoded: "&zwnj;",
        rangeValDecoded: "\u200C",
      },
    ],
    "23.01",
  );
});

test(`24 - ${`\u001b[${34}m${"other cases"}\u001b[${39}m`} - \u001b[${32}m${"recognised"}\u001b[${39}m - ad hoc - &zwjn; - known broken entities come before regular checks where semicol might be missing`, () => {
  let gathered = [];
  let inp1 = "&zwjn;";
  equal(
    fix(ok, inp1, {
      cb: (obj) => obj,
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [
      {
        ruleName: "bad-html-entity-malformed-zwnj",
        entityName: "zwnj",
        rangeFrom: 0,
        rangeTo: inp1.length,
        rangeValEncoded: "&zwnj;",
        rangeValDecoded: "\u200C",
      },
    ],
    "24.01",
  );
  equal(gathered, [], "24.02");
});

test(`25 - ${`\u001b[${34}m${"other cases"}\u001b[${39}m`} - \u001b[${32}m${"recognised"}\u001b[${39}m - ad hoc - &xcap; - named entity starts with x`, () => {
  let inp1 = "&xcap;";
  equal(
    fix(ok, inp1, {
      cb: (obj) => obj,
    }),
    [],
    "25.01",
  );
  equal(
    fix(ok, inp1, {
      cb: (obj) => obj,
      decode: true,
    }),
    [
      {
        ruleName: "bad-html-entity-encoded-xcap",
        entityName: "xcap",
        rangeFrom: 0,
        rangeTo: inp1.length,
        rangeValEncoded: "&xcap;",
        rangeValDecoded: "\u22C2",
      },
    ],
    "25.02",
  );
});

test(`26 - ${`\u001b[${34}m${"other cases"}\u001b[${39}m`} - \u001b[${32}m${"recognised"}\u001b[${39}m - ad hoc - &xcap; - named entity starts with x`, () => {
  let gathered = [];
  let inp1 = "&xcap;";
  equal(
    fix(ok, inp1, {
      cb: (obj) => obj,
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [],
    "26.01",
  );
  equal(gathered, [], "26.02");
});

test(`27 - ${`\u001b[${34}m${"other cases"}\u001b[${39}m`} - \u001b[${32}m${"recognised"}\u001b[${39}m - ad hoc - &xcap; - named entity starts with x`, () => {
  let gathered = [];
  let inp1 = "&xcap;";
  equal(
    fix(ok, inp1, {
      cb: (obj) => obj,
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
      decode: true,
    }),
    [
      {
        ruleName: "bad-html-entity-encoded-xcap",
        entityName: "xcap",
        rangeFrom: 0,
        rangeTo: inp1.length,
        rangeValEncoded: "&xcap;",
        rangeValDecoded: "\u22C2",
      },
    ],
    "27.01",
  );
  equal(gathered, [], "27.02");
});

test(`28 - ${`\u001b[${34}m${"other cases"}\u001b[${39}m`} - \u001b[${32}m${"recognised"}\u001b[${39}m - ad hoc 1`, () => {
  let inp1 = "&nbsp;&nbsp;";
  equal(
    fix(ok, inp1, {
      cb: (obj) => obj,
    }),
    [],
    "28.01",
  );
});

test(`29 - ${`\u001b[${34}m${"other cases"}\u001b[${39}m`} - \u001b[${32}m${"recognised"}\u001b[${39}m - ad hoc 1`, () => {
  let gathered = [];
  let inp1 = "&nbsp;&nbsp;";
  equal(
    fix(ok, inp1, {
      cb: (obj) => obj,
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [],
    "29.01",
  );
  equal(gathered, [], "29.02");
});

test(`30 - ${`\u001b[${34}m${"other cases"}\u001b[${39}m`} - \u001b[${32}m${"recognised"}\u001b[${39}m - ad hoc 2`, () => {
  let gathered = [];
  let inputs = [
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
  inputs.forEach((input, i) => {
    equal(fix(ok, input), [], `"${input}" - ${i}`);
  });
  inputs.forEach((input, i) => {
    equal(
      fix(ok, input, {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [],
      `"${input}" - ${i}`,
    );
  });
  equal(gathered, [], "30.01");
});

test(`31 - ${`\u001b[${34}m${"other cases"}\u001b[${39}m`} - \u001b[${32}m${"recognised"}\u001b[${39}m - ad hoc 3`, () => {
  let inp1 = "&NBSP;&NBSP;";
  equal(
    fix(ok, inp1),
    [
      [0, 6, "&nbsp;"],
      [6, 12, "&nbsp;"],
    ],
    "31.01",
  );
});

test(`32 - ${`\u001b[${34}m${"other cases"}\u001b[${39}m`} - \u001b[${32}m${"recognised"}\u001b[${39}m - ad hoc 3`, () => {
  let gathered = [];
  let inp1 = "&NBSP;&NBSP;";
  equal(
    fix(ok, inp1, {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [
      [0, 6, "&nbsp;"],
      [6, 12, "&nbsp;"],
    ],
    "32.01",
  );
  equal(gathered, [], "32.02");
});

test(`33 - ${`\u001b[${34}m${"other cases"}\u001b[${39}m`} - \u001b[${32}m${"recognised"}\u001b[${39}m - ad hoc 4`, () => {
  let inp1 = "&NBSP;&NBSP;&NBSP; a &NBSP;&NBSP;&NBSP;";
  equal(
    fix(ok, inp1),
    [
      [0, 6, "&nbsp;"],
      [6, 12, "&nbsp;"],
      [12, 18, "&nbsp;"],
      [21, 27, "&nbsp;"],
      [27, 33, "&nbsp;"],
      [33, 39, "&nbsp;"],
    ],
    "33.01",
  );
});

test(`34 - ${`\u001b[${34}m${"other cases"}\u001b[${39}m`} - \u001b[${32}m${"recognised"}\u001b[${39}m - ad hoc 4`, () => {
  let gathered = [];
  let inp1 = "&NBSP;&NBSP;&NBSP; a &NBSP;&NBSP;&NBSP;";
  equal(
    fix(ok, inp1, {
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
    "34.01",
  );
  equal(gathered, [], "34.02");
});

test(`35 - ${`\u001b[${34}m${"other cases"}\u001b[${39}m`} - \u001b[${32}m${"recognised"}\u001b[${39}m - ad hoc 5`, () => {
  let inp1 = "&nbsp;&nbsp;&bsp; a &nbsp;&nnbsp;&nbsp;";
  equal(
    fix(ok, inp1),
    [
      [12, 17, "&nbsp;"],
      [26, 33, "&nbsp;"],
    ],
    "35.01",
  );
});

test(`36 - ${`\u001b[${34}m${"other cases"}\u001b[${39}m`} - \u001b[${32}m${"recognised"}\u001b[${39}m - ad hoc 5`, () => {
  let gathered = [];
  let inp1 = "&nbsp;&nbsp;&bsp; a &nbsp;&nnbsp;&nbsp;";
  equal(
    fix(ok, inp1, {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [
      [12, 17, "&nbsp;"],
      [26, 33, "&nbsp;"],
    ],
    "36.01",
  );
  equal(gathered, [], "36.02");
});

test(`37 - ${`\u001b[${34}m${"other cases"}\u001b[${39}m`} - \u001b[${32}m${"recognised"}\u001b[${39}m - ad hoc 6`, () => {
  let inp1 = "&nbsp;&bsp;&nnbsp; a &nbsp;&nnbsp;&nnbsp;";
  equal(
    fix(ok, inp1),
    [
      [6, 11, "&nbsp;"],
      [11, 18, "&nbsp;"],
      [27, 34, "&nbsp;"],
      [34, 41, "&nbsp;"],
    ],
    "37.01",
  );
});

test(`38 - ${`\u001b[${34}m${"other cases"}\u001b[${39}m`} - \u001b[${32}m${"recognised"}\u001b[${39}m - ad hoc 6`, () => {
  let gathered = [];
  let inp1 = "&nbsp;&bsp;&nnbsp; a &nbsp;&nnbsp;&nnbsp;";
  equal(
    fix(ok, inp1, {
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
    "38.01",
  );
  equal(gathered, [], "38.02");
});

test(`39 - ${`\u001b[${34}m${"other cases"}\u001b[${39}m`} - \u001b[${32}m${"recognised"}\u001b[${39}m - overlap`, () => {
  equal(
    fix(ok, "&ang&;ang;"),
    [
      [0, 4, "&ang;"],
      [4, 10, "&ang;"],
    ],
    "39.01",
  );
});

test(`40 - ${`\u001b[${34}m${"other cases"}\u001b[${39}m`} - \u001b[${32}m${"recognised"}\u001b[${39}m - overlap`, () => {
  let gathered = [];
  equal(
    fix(ok, "&ang&;ang;", {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [
      [0, 4, "&ang;"],
      [4, 10, "&ang;"],
    ],
    "40.01",
  );
  equal(gathered, [], "40.02");
});

test(`41 - ${`\u001b[${34}m${"other cases"}\u001b[${39}m`} - \u001b[${32}m${"recognised"}\u001b[${39}m - overlap`, () => {
  equal(fix(ok, "the &;ang;100"), [[4, 10, "&ang;"]], "41.01");
});

test(`42 - ${`\u001b[${34}m${"other cases"}\u001b[${39}m`} - \u001b[${32}m${"recognised"}\u001b[${39}m - overlap`, () => {
  let gathered = [];
  equal(
    fix(ok, "the &;ang;100", {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [[4, 10, "&ang;"]],
    "42.01",
  );
  equal(gathered, [], "42.02");
});

test(`43 - ${`\u001b[${34}m${"other cases"}\u001b[${39}m`} - dubious Levenshtein`, () => {
  equal(fix(ok, "&Ifz;"), [[0, 5, "&Ifr;"]], "43.01");
});

test(`44 - ${`\u001b[${34}m${"other cases"}\u001b[${39}m`} - dubious Levenshtein`, () => {
  let gathered = [];
  equal(
    fix(ok, "&Ifz;", {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [[0, 5, "&Ifr;"]],
    "44.01",
  );
  equal(gathered, [], "44.02");
});

test(`45 - ${`\u001b[${34}m${"other cases"}\u001b[${39}m`} - dubious Levenshtein`, () => {
  equal(fix(ok, "&ifz;"), [[0, 5]], "45.01");
});

test(`46 - ${`\u001b[${34}m${"other cases"}\u001b[${39}m`} - dubious Levenshtein`, () => {
  let gathered = [];
  equal(
    fix(ok, "&ifz;", {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [[0, 5]],
    "46.01",
  );
  equal(gathered, [], "46.02");
});

test(`47 - ${`\u001b[${34}m${"other cases"}\u001b[${39}m`} - dubious Levenshtein`, () => {
  equal(fix(ok, "&ifz;&"), [[0, 5]], "47.01");
});

test(`48 - ${`\u001b[${34}m${"other cases"}\u001b[${39}m`} - dubious Levenshtein`, () => {
  let gathered = [];
  let input = "&ifz;&";
  let result = [[0, 5]];
  equal(
    fixEnt(input, {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    result,
    "48.01",
  );
  equal(
    fix(ok, input, {
      textAmpersandCatcherCb: () => {},
    }),
    result,
    "48.02",
  );
  equal(gathered, [5], "48.03");
});

test(`49 - ${`\u001b[${34}m${"other cases"}\u001b[${39}m`} - definitely not an entity`, () => {
  equal(
    fix(ok, "&lhdfgdfgdllkjghlfjjhdkfghkjdfhkghfkhgjkfjhlkfjglhjfgkljhlfjhl;"),
    [],
    "49.01",
  );
});

test(`50 - ${`\u001b[${34}m${"other cases"}\u001b[${39}m`} - definitely not an entity`, () => {
  let gathered = [];
  let input = "&lhdfgdfgdllkjghlfjjhdkfghkjdfhkghfkhgjkfjhlkfjglhjfgkljhlfjhl;";
  let result = [];
  equal(
    fixEnt(input, {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    result,
    "50.01",
  );
  equal(
    fix(ok, input, {
      textAmpersandCatcherCb: () => {},
    }),
    result,
    "50.02",
  );
  equal(gathered, [0], "50.03");
});

test(`51 - ${`\u001b[${34}m${"other cases"}\u001b[${39}m`} - lorem ipsum paragraph`, () => {
  equal(
    fix(
      ok,
      "&Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum;",
    ),
    [],
    "51.01",
  );
});

test(`52 - ${`\u001b[${34}m${"other cases"}\u001b[${39}m`} - lorem ipsum paragraph`, () => {
  let gathered = [];
  let input =
    "&Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum;";
  let result = [];
  equal(
    fixEnt(input, {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    result,
    "52.01",
  );
  equal(
    fix(ok, input, {
      textAmpersandCatcherCb: () => {},
    }),
    result,
    "52.02",
  );
  equal(gathered, [0], "52.03");
});

test(`53 - ${`\u001b[${34}m${"other cases"}\u001b[${39}m`} - lorem ipsum paragraph`, () => {
  equal(
    fix(
      ok,
      "&nbsp ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum;",
    ),
    [[0, 5, "&nbsp;"]],
    "53.01",
  );
});

test(`54 - ${`\u001b[${34}m${"other cases"}\u001b[${39}m`} - lorem ipsum paragraph`, () => {
  let gathered = [];
  equal(
    fix(
      ok,
      "&nbsp ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum;",
      {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      },
    ),
    [[0, 5, "&nbsp;"]],
    "54.01",
  );
  equal(gathered, [], "54.02");
});

test("55", () => {
  equal(fix(ok, "&; &; &;"), [], "55.01");
});

test("56", () => {
  let gathered = [];
  let input = "&; &; &;";
  let result = [];
  equal(
    fixEnt(input, {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    result,
    "56.01",
  );
  equal(
    fix(ok, input, {
      textAmpersandCatcherCb: () => {},
    }),
    result,
    "56.02",
  );
  equal(gathered, [0, 3, 6], "56.03");
});

test("57 - rsquo, decoding requested", () => {
  let gathered = [];
  let inp1 = "&rsquo;";
  equal(
    fix(ok, inp1, {
      cb: (obj) => obj,
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
      decode: true,
    }),
    [
      {
        ruleName: "bad-html-entity-encoded-rsquo",
        entityName: "rsquo",
        rangeFrom: 0,
        rangeTo: inp1.length,
        rangeValEncoded: "&rsquo;",
        rangeValDecoded: "\u2019",
      },
    ],
    "57.01",
  );
  equal(gathered, [], "57.02");
});

test("58 - rsqo, no decoding", () => {
  let gathered = [];
  let inp1 = "&rsqo;";
  equal(
    fix(ok, inp1, {
      cb: (obj) => obj,
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [
      {
        ruleName: "bad-html-entity-malformed-rsquo",
        entityName: "rsquo",
        rangeFrom: 0,
        rangeTo: inp1.length,
        rangeValEncoded: "&rsquo;",
        rangeValDecoded: "\u2019",
      },
    ],
    "58.01",
  );
  equal(gathered, [], "58.02");
});

test("59 - rsqo + decoding, no cb", () => {
  let inp1 = "&rsqo;";
  equal(fix(ok, inp1, {}), [[0, 6, "&rsquo;"]], "59.01");
});

test("60 - rsqo + decoding, whole cb", () => {
  let gathered = [];
  let inp1 = "&rsqo;";
  equal(
    fix(ok, inp1, {
      cb: (obj) => obj,
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [
      {
        ruleName: "bad-html-entity-malformed-rsquo",
        entityName: "rsquo",
        rangeFrom: 0,
        rangeTo: inp1.length,
        rangeValEncoded: "&rsquo;",
        rangeValDecoded: "\u2019",
      },
    ],
    "60.01",
  );
  equal(gathered, [], "60.02");
});

test("61 - pound in first capital", () => {
  let inp1 = "&Pound;";
  equal(fix(ok, inp1, {}), [[0, 7, "&pound;"]], "61.01");
});

test.run();
