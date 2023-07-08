import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import fix from "./util/util.js";

// -----------------------------------------------------------------------------
// 03. nothing to fix
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${33}m${"nothing to fix"}\u001b[${39}m`} - false positives`, () => {
  equal(fix(ok, "insp;"), [], "01.01");
  equal(fix(ok, "an insp;"), [], "01.02");
  equal(fix(ok, "an inspp;"), [], "01.03");

  // decode on:
  equal(fix(ok, "insp;", { decode: true }), [], "01.04");
  equal(fix(ok, "an insp;", { decode: true }), [], "01.05");
  equal(fix(ok, "an inspp;", { decode: true }), [], "01.06");

  let gathered = [];

  equal(
    fix(ok, "insp;", {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [],
    "01.07",
  );
  equal(
    fix(ok, "an insp;", {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [],
    "01.08",
  );
  equal(
    fix(ok, "an inspp;", {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [],
    "01.09",
  );

  // decode on:
  equal(
    fix(ok, "insp;", {
      decode: true,
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [],
    "01.10",
  );
  equal(
    fix(ok, "an insp;", {
      decode: true,
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [],
    "01.11",
  );
  equal(
    fix(ok, "an inspp;", {
      decode: true,
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [],
    "01.12",
  );

  // yet...
  equal(gathered, [], "01.13");
});

test(`02 - ${`\u001b[${33}m${"nothing to fix"}\u001b[${39}m`} - no decode requested`, () => {
  equal(fix(ok, "&nbsp;"), [], "02.01");

  let gathered = [];
  equal(
    fix(ok, "&nbsp;", {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [],
    "02.02",
  );
  equal(gathered, [], "02.03");
});

test(`03 - ${`\u001b[${33}m${"nothing to fix"}\u001b[${39}m`} - no decode requested`, () => {
  equal(fix(ok, "&nbsp; &nbsp;"), [], "03.01");

  let gathered = [];
  equal(
    fix(ok, "&nbsp; &nbsp;", {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [],
    "03.02",
  );
  equal(gathered, [], "03.03");
});

test(`04 - ${`\u001b[${33}m${"nothing to fix"}\u001b[${39}m`} - no decode requested`, () => {
  equal(fix(ok, "a&nbsp;b"), [], "04.01");

  let gathered = [];
  equal(
    fix(ok, "a&nbsp;b", {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [],
    "04.02",
  );
  equal(gathered, [], "04.03");
});

test(`05 - ${`\u001b[${33}m${"nothing to fix"}\u001b[${39}m`} - default callback, decode`, () => {
  // controls:
  equal(fix(ok, "&nbsp;"), [], "05.01");
  equal(fix(ok, "&nbsp;", { decode: false }), [], "05.02");
  equal(
    fix(ok, "&nbsp;", {
      decode: false,
      cb: (obj) => obj,
    }),
    [],
    "05.03",
  );

  // the main check:
  let gathered = [];
  equal(
    fix(ok, "&nbsp;", {
      decode: true,
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [[0, 6, "\xA0"]],
    "05.04",
  );
  equal(gathered, [], "05.05");
});

test(`06 - ${`\u001b[${33}m${"nothing to fix"}\u001b[${39}m`} - full callback, decode`, () => {
  // same as 03.003 except has a callback to ensure correct rule name is reported
  equal(
    fix(ok, "&nbsp;", {
      decode: true,
      cb: (obj) => obj,
    }),
    [
      {
        ruleName: "bad-html-entity-encoded-nbsp",
        entityName: "nbsp",
        rangeFrom: 0,
        rangeTo: 6,
        rangeValEncoded: "&nbsp;",
        rangeValDecoded: "\xA0",
      },
    ],
    "06.01",
  );
});

test(`07 - ${`\u001b[${33}m${"nothing to fix"}\u001b[${39}m`} - two, surrounded by EOL`, () => {
  equal(
    fix(ok, "&nbsp; &nbsp;", { decode: true }),
    [
      [0, 6, "\xA0"],
      [7, 13, "\xA0"],
    ],
    "07.01",
  );
});

test(`08 - ${`\u001b[${33}m${"nothing to fix"}\u001b[${39}m`} - surrounded by letters`, () => {
  equal(fix(ok, "a&nbsp;b", { decode: true }), [[1, 7, "\xA0"]], "08.01");

  let gathered = [];
  equal(
    fix(ok, "a&nbsp;b", {
      decode: true,
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [[1, 7, "\xA0"]],
    "08.02",
  );
  equal(gathered, [], "08.03");
});

test(`09 - ${`\u001b[${33}m${"nothing to fix"}\u001b[${39}m`} - various - decode off`, () => {
  equal(fix(ok, "z&hairsp;y"), [], "09.01");

  let gathered = [];
  equal(
    fix(ok, "z&hairsp;y", {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [],
    "09.02",
  );
  equal(gathered, [], "09.03");
});

test(`10 - ${`\u001b[${33}m${"nothing to fix"}\u001b[${39}m`} - various - decode off`, () => {
  equal(fix(ok, "y&VeryThinSpace;z"), [], "10.01");

  let gathered = [];
  equal(
    fix(ok, "y&VeryThinSpace;z", {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [],
    "10.02",
  );
  equal(gathered, [], "10.03");
});

test(`11 - ${`\u001b[${33}m${"nothing to fix"}\u001b[${39}m`} - hairsp - decode on`, () => {
  equal(fix(ok, "z&hairsp;y", { decode: true }), [[1, 9, "\u200A"]], "11.01");

  let gathered = [];
  equal(
    fix(ok, "z&hairsp;y", {
      decode: true,
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [[1, 9, "\u200A"]],
    "11.02",
  );
  equal(gathered, [], "11.03");
});

test(`12 - ${`\u001b[${33}m${"nothing to fix"}\u001b[${39}m`} - VeryThinSpace - decode on`, () => {
  equal(
    fix(ok, "y&VeryThinSpace;z", { decode: true }),
    [[1, 16, "\u200A"]],
    "12.01",
  );

  let gathered = [];
  equal(
    fix(ok, "y&VeryThinSpace;z", {
      decode: true,
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [[1, 16, "\u200A"]],
    "12.02",
  );
  equal(gathered, [], "12.03");
});

test(`13 - ${`\u001b[${33}m${"nothing to fix"}\u001b[${39}m`} - healthy &pound;`, () => {
  let inp1 = "&pound;";
  equal(fix(ok, inp1), [], "13.01");

  let gathered = [];
  equal(
    fix(ok, inp1, {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [],
    "13.02",
  );
  equal(gathered, [], "13.03");
});

test(`14 - ${`\u001b[${33}m${"nothing to fix"}\u001b[${39}m`} - healthy &pound;`, () => {
  let inp1 = "&pound;";
  equal(fix(ok, inp1, { decode: true }), [[0, 7, "\xA3"]], "14.01");

  let gathered = [];
  equal(
    fix(ok, inp1, {
      decode: true,
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [[0, 7, "\xA3"]],
    "14.02",
  );
  equal(gathered, [], "14.03");
});

test.run();
