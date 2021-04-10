import tap from "tap";
import fix from "./util/util";

// -----------------------------------------------------------------------------
// 03. nothing to fix
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${33}m${`nothing to fix`}\u001b[${39}m`} - false positives`,
  (t) => {
    t.strictSame(fix(t, "insp;"), [], "01.01");
    t.strictSame(fix(t, "an insp;"), [], "01.02");
    t.strictSame(fix(t, "an inspp;"), [], "01.03");

    // decode on:
    t.strictSame(fix(t, "insp;", { decode: true }), [], "01.04");
    t.strictSame(fix(t, "an insp;", { decode: true }), [], "01.05");
    t.strictSame(fix(t, "an inspp;", { decode: true }), [], "01.06");

    const gathered = [];

    t.strictSame(
      fix(t, "insp;", {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [],
      "01.07"
    );
    t.strictSame(
      fix(t, "an insp;", {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [],
      "01.08"
    );
    t.strictSame(
      fix(t, "an inspp;", {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [],
      "01.09"
    );

    // decode on:
    t.strictSame(
      fix(t, "insp;", {
        decode: true,
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [],
      "01.10"
    );
    t.strictSame(
      fix(t, "an insp;", {
        decode: true,
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [],
      "01.11"
    );
    t.strictSame(
      fix(t, "an inspp;", {
        decode: true,
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [],
      "01.12"
    );

    // yet...
    t.strictSame(gathered, [], "01.13");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${33}m${`nothing to fix`}\u001b[${39}m`} - no decode requested`,
  (t) => {
    t.strictSame(fix(t, "&nbsp;"), [], "02.01 - one, surrounded by EOL");

    const gathered = [];
    t.strictSame(
      fix(t, "&nbsp;", {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [],
      "02.02 - one, surrounded by EOL"
    );
    t.strictSame(gathered, [], "02.03");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${33}m${`nothing to fix`}\u001b[${39}m`} - no decode requested`,
  (t) => {
    t.strictSame(fix(t, "&nbsp; &nbsp;"), [], "03.01 - two, surrounded by EOL");

    const gathered = [];
    t.strictSame(
      fix(t, "&nbsp; &nbsp;", {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [],
      "03.02 - two, surrounded by EOL"
    );
    t.strictSame(gathered, [], "03.03");

    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${33}m${`nothing to fix`}\u001b[${39}m`} - no decode requested`,
  (t) => {
    t.strictSame(fix(t, "a&nbsp;b"), [], "04.01 - surrounded by letters");

    const gathered = [];
    t.strictSame(
      fix(t, "a&nbsp;b", {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [],
      "04.02 - surrounded by letters"
    );
    t.strictSame(gathered, [], "04.03");
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${33}m${`nothing to fix`}\u001b[${39}m`} - default callback, decode`,
  (t) => {
    // controls:
    t.strictSame(fix(t, "&nbsp;"), [], "05.01");
    t.strictSame(fix(t, "&nbsp;", { decode: false }), [], "05.02");
    t.strictSame(
      fix(t, "&nbsp;", {
        decode: false,
        cb: (obj) => obj,
      }),
      [],
      "05.03"
    );

    // the main check:
    const gathered = [];
    t.strictSame(
      fix(t, "&nbsp;", {
        decode: true,
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [[0, 6, "\xA0"]],
      "05.04"
    );
    t.strictSame(gathered, [], "05.05");
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${33}m${`nothing to fix`}\u001b[${39}m`} - full callback, decode`,
  (t) => {
    // same as 03.003 except has a callback to ensure correct rule name is reported
    t.strictSame(
      fix(t, "&nbsp;", {
        decode: true,
        cb: (obj) => obj,
      }),
      [
        {
          ruleName: `bad-html-entity-encoded-nbsp`,
          entityName: "nbsp",
          rangeFrom: 0,
          rangeTo: 6,
          rangeValEncoded: "&nbsp;",
          rangeValDecoded: "\xA0",
        },
      ],
      "06"
    );
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${33}m${`nothing to fix`}\u001b[${39}m`} - two, surrounded by EOL`,
  (t) => {
    t.strictSame(
      fix(t, "&nbsp; &nbsp;", { decode: true }),
      [
        [0, 6, "\xA0"],
        [7, 13, "\xA0"],
      ],
      "07"
    );
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${33}m${`nothing to fix`}\u001b[${39}m`} - surrounded by letters`,
  (t) => {
    t.strictSame(
      fix(t, "a&nbsp;b", { decode: true }),
      [[1, 7, "\xA0"]],
      "08.01"
    );

    const gathered = [];
    t.strictSame(
      fix(t, "a&nbsp;b", {
        decode: true,
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [[1, 7, "\xA0"]],
      "08.02"
    );
    t.strictSame(gathered, [], "08.03");
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${33}m${`nothing to fix`}\u001b[${39}m`} - various - decode off`,
  (t) => {
    t.strictSame(fix(t, "z&hairsp;y"), [], "09.01");

    const gathered = [];
    t.strictSame(
      fix(t, "z&hairsp;y", {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [],
      "09.02"
    );
    t.strictSame(gathered, [], "09.03");
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${33}m${`nothing to fix`}\u001b[${39}m`} - various - decode off`,
  (t) => {
    t.strictSame(fix(t, "y&VeryThinSpace;z"), [], "10.01");

    const gathered = [];
    t.strictSame(
      fix(t, "y&VeryThinSpace;z", {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [],
      "10.02"
    );
    t.strictSame(gathered, [], "10.03");
    t.end();
  }
);

tap.test(
  `11 - ${`\u001b[${33}m${`nothing to fix`}\u001b[${39}m`} - hairsp - decode on`,
  (t) => {
    t.strictSame(
      fix(t, "z&hairsp;y", { decode: true }),
      [[1, 9, "\u200A"]],
      "11.01"
    );

    const gathered = [];
    t.strictSame(
      fix(t, "z&hairsp;y", {
        decode: true,
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [[1, 9, "\u200A"]],
      "11.02"
    );
    t.strictSame(gathered, [], "11.03");
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${33}m${`nothing to fix`}\u001b[${39}m`} - VeryThinSpace - decode on`,
  (t) => {
    t.strictSame(
      fix(t, "y&VeryThinSpace;z", { decode: true }),
      [[1, 16, "\u200A"]],
      "12.01"
    );

    const gathered = [];
    t.strictSame(
      fix(t, "y&VeryThinSpace;z", {
        decode: true,
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [[1, 16, "\u200A"]],
      "12.02"
    );
    t.strictSame(gathered, [], "12.03");
    t.end();
  }
);

tap.test(
  `13 - ${`\u001b[${33}m${`nothing to fix`}\u001b[${39}m`} - healthy &pound;`,
  (t) => {
    const inp1 = "&pound;";
    t.strictSame(fix(t, inp1), [], "13.01");

    const gathered = [];
    t.strictSame(
      fix(t, inp1, {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [],
      "13.02"
    );
    t.strictSame(gathered, [], "13.03");
    t.end();
  }
);

tap.test(
  `14 - ${`\u001b[${33}m${`nothing to fix`}\u001b[${39}m`} - healthy &pound;`,
  (t) => {
    const inp1 = "&pound;";
    t.strictSame(fix(t, inp1, { decode: true }), [[0, 7, "\xA3"]], "14.01");

    const gathered = [];
    t.strictSame(
      fix(t, inp1, {
        decode: true,
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [[0, 7, "\xA3"]],
      "14.02"
    );
    t.strictSame(gathered, [], "14.03");
    t.end();
  }
);
