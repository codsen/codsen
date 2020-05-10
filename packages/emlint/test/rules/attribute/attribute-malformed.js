import tap from "tap";
import { Linter } from "../../../dist/emlint.esm";
import { applyFixes } from "../../../t-util/util";

// 00. false positives
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${36}m${`no config`}\u001b[${39}m`} - value-less attributes`,
  (t) => {
    const str = `<td nowrap >`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-malformed": 0,
      },
    });
    t.equal(applyFixes(str, messages), str, "01.01");
    t.same(messages, [], "01.02");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${36}m${`no config`}\u001b[${39}m`} - value-less attributes`,
  (t) => {
    const str = `<td nowrap>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-malformed": 0,
      },
    });
    t.equal(applyFixes(str, messages), str, "02.01");
    t.same(messages, [], "02.02");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${36}m${`no config`}\u001b[${39}m`} - value-less attributes`,
  (t) => {
    const str = `<td nowrap/>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-malformed": 0,
      },
    });
    t.equal(applyFixes(str, messages), str, "03.01");
    t.same(messages, [], "03.02");
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${36}m${`no config`}\u001b[${39}m`} - value-less attributes`,
  (t) => {
    const str = `<br nowrap />`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-malformed": 0,
      },
    });
    t.equal(applyFixes(str, messages), str, "04.01");
    t.same(messages, [], "04.02");
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${36}m${`no config`}\u001b[${39}m`} - value-less attributes`,
  (t) => {
    const str = `</td nowrap nowrap>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-malformed": 0,
      },
    });
    t.equal(applyFixes(str, messages), str, "05.01");
    t.same(messages, [], "05.02");
    t.end();
  }
);

// 01. no config
// -----------------------------------------------------------------------------

tap.test(`06 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - off`, (t) => {
  const str = `<a b"c" d'e'>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-malformed": 0,
    },
  });
  t.equal(applyFixes(str, messages), str, "06.01");
  t.same(messages, [], "06.02");
  t.end();
});

tap.test(`07 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - warn`, (t) => {
  const str = `<a class"b" id'c'>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-malformed": 1,
    },
  });
  t.equal(applyFixes(str, messages), `<a class="b" id='c'>`, "07.01");
  t.match(
    messages,
    [
      {
        ruleId: "attribute-malformed",
        severity: 1,
        idxFrom: 3,
        idxTo: 11,
        message: `Equal is missing.`,
        fix: {
          ranges: [[8, 8, "="]],
        },
      },
      {
        ruleId: "attribute-malformed",
        severity: 1,
        idxFrom: 12,
        idxTo: 17,
        message: `Equal is missing.`,
        fix: {
          ranges: [[14, 14, "="]],
        },
      },
    ],
    "07.02"
  );
  t.end();
});

tap.test(`08 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - warn`, (t) => {
  const str = `<a class"b" id'c'>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-malformed": 2,
    },
  });
  t.equal(applyFixes(str, messages), `<a class="b" id='c'>`, "08.01");
  t.match(
    messages,
    [
      {
        ruleId: "attribute-malformed",
        severity: 2,
        idxFrom: 3,
        idxTo: 11,
        message: `Equal is missing.`,
        fix: {
          ranges: [[8, 8, "="]],
        },
      },
      {
        ruleId: "attribute-malformed",
        severity: 2,
        idxFrom: 12,
        idxTo: 17,
        message: `Equal is missing.`,
        fix: {
          ranges: [[14, 14, "="]],
        },
      },
    ],
    "08.02"
  );
  t.end();
});

// 02. mis-typed
// -----------------------------------------------------------------------------

tap.test(`09 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - err`, (t) => {
  const str = `<td clas="w100p">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-malformed": 2,
    },
  });
  t.equal(applyFixes(str, messages), `<td class="w100p">`, "09.01");
  t.match(
    messages,
    [
      {
        ruleId: "attribute-malformed",
        idxFrom: 4,
        idxTo: 8,
        message: `Probably meant "class".`,
        fix: {
          ranges: [[4, 8, "class"]],
        },
      },
    ],
    "09.02"
  );
  t.end();
});

tap.test(`10 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - err`, (t) => {
  const str = `<td zzzz="w100p">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-malformed": 1,
    },
  });
  // can't fix:
  t.equal(applyFixes(str, messages), str, "10.01");
  t.match(
    messages,
    [
      {
        ruleId: "attribute-malformed",
        idxFrom: 4,
        idxTo: 8,
        message: `Unrecognised attribute "zzzz".`,
        fix: null,
      },
    ],
    "10.02"
  );
  t.end();
});

// 03. repeated opening quotes
// -----------------------------------------------------------------------------

tap.test(
  `11 - ${`\u001b[${32}m${`repeated opening`}\u001b[${39}m`} - double`,
  (t) => {
    const str = `<table width=""100">\n  zzz\n</table>`;
    const fixed = `<table width="100">\n  zzz\n</table>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-malformed": 1,
      },
    });
    // will fix:
    t.equal(applyFixes(str, messages), fixed, "11.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-malformed",
          idxFrom: 7,
          idxTo: 19,
          message: `Delete repeated opening quotes.`,
          fix: {
            ranges: [[13, 14]],
          },
        },
      ],
      "11.02"
    );
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${32}m${`repeated opening`}\u001b[${39}m`} - single`,
  (t) => {
    const str = `<table width=''100'>\n  zzz\n</table>`;
    const fixed = `<table width='100'>\n  zzz\n</table>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-malformed": 1,
      },
    });
    // will fix:
    t.equal(applyFixes(str, messages), fixed, "12.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-malformed",
          idxFrom: 7,
          idxTo: 19,
          message: `Delete repeated opening quotes.`,
          fix: {
            ranges: [[13, 14]],
          },
        },
      ],
      "12.02"
    );
    t.end();
  }
);

tap.test(
  `13 - ${`\u001b[${32}m${`repeated opening`}\u001b[${39}m`} - single quotes instead of equal`,
  (t) => {
    const str = `<table width''100'>\n  zzz\n</table>`;
    const fixed = `<table width='100'>\n  zzz\n</table>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-malformed": 2,
      },
    });
    // will fix:
    t.equal(applyFixes(str, messages), fixed, "13");
    t.end();
  }
);

tap.test(
  `14 - ${`\u001b[${32}m${`repeated opening`}\u001b[${39}m`} - double quotes instead of equal`,
  (t) => {
    const str = `<table width""100">\n  zzz\n</table>`;
    const fixed = `<table width="100">\n  zzz\n</table>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-malformed": 2,
      },
    });
    // will fix:
    t.equal(applyFixes(str, messages), fixed, "14");
    t.end();
  }
);

// 04. rogue quotes
// -----------------------------------------------------------------------------

tap.test(
  `15 - ${`\u001b[${32}m${`repeated opening`}\u001b[${39}m`} - rogue single`,
  (t) => {
    const str = `<table width='"100">zzz</table>`;
    const fixed = `<table width="100">zzz</table>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-malformed": 2,
      },
    });
    // will fix:
    t.equal(applyFixes(str, messages), fixed, "15");
    t.end();
  }
);

tap.test(
  `16 - ${`\u001b[${32}m${`repeated opening`}\u001b[${39}m`} - rogue double`,
  (t) => {
    const str = `<table width="'100'>zzz</table>`;
    const fixed = `<table width='100'>zzz</table>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-malformed": 2,
      },
    });
    // will fix:
    t.equal(applyFixes(str, messages), fixed, "16");
    t.end();
  }
);

// 05. rogue characters
// -----------------------------------------------------------------------------

tap.test(
  `17 - ${`\u001b[${32}m${`repeated opening`}\u001b[${39}m`} - rogue characters around equal`,
  (t) => {
    const str = `<span width...=....."100"></span>`;
    const fixed = `<span width="100"></span>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-malformed": 2,
      },
    });
    // will fix:
    t.equal(applyFixes(str, messages), fixed, "17");
    t.end();
  }
);

// 06. equal missing
// -----------------------------------------------------------------------------

tap.test(
  `18 - ${`\u001b[${32}m${`equal missing`}\u001b[${39}m`} - equal is missing, tight`,
  (t) => {
    const str = `<a class"c" id'e'>`;
    const fixed = `<a class="c" id='e'>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-malformed": 2,
      },
    });
    // will fix:
    t.equal(applyFixes(str, messages), fixed, "18");
    t.end();
  }
);

tap.test(
  `19 - ${`\u001b[${32}m${`equal missing`}\u001b[${39}m`} - space instead of equal, recognised attr names followed by quoted value`,
  (t) => {
    const str = `<a class "c" id 'e' href "www">`;
    const fixed = `<a class="c" id='e' href="www">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-malformed": 2,
      },
    });
    // will fix:
    t.equal(applyFixes(str, messages), fixed, "19");
    t.end();
  }
);

tap.test(
  `20 - ${`\u001b[${32}m${`equal missing`}\u001b[${39}m`} - mismatching quotes - A,B; A,B`,
  (t) => {
    const str = `<a class"c' id"e'>`;
    const fixed = `<a class="c" id="e">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-malformed": 2,
      },
    });
    // will fix:
    t.equal(applyFixes(str, messages), fixed, "20");
    t.end();
  }
);

tap.test(
  `21 - ${`\u001b[${32}m${`equal missing`}\u001b[${39}m`} - mismatching quotes - A,B; B,A`,
  (t) => {
    const str = `<a class"c' id'e">`;
    const fixed = `<a class="c" id="e">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-malformed": 2,
      },
    });
    // will fix:
    t.equal(applyFixes(str, messages), fixed, "21");
    t.end();
  }
);

// 07. mismatching quotes
// -----------------------------------------------------------------------------

tap.test(
  `22 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - no quotes in the value, A-B`,
  (t) => {
    const str = `<div class="c'>.</div>`;
    const fixed = `<div class="c">.</div>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-malformed": 2,
      },
    });
    // will fix:
    t.equal(applyFixes(str, messages), fixed, "22.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-malformed",
          severity: 2,
          idxFrom: 5,
          idxTo: 14,
          message: `Closing quote should be double.`,
          fix: {
            ranges: [[13, 14, `"`]],
          },
        },
      ],
      "22.02"
    );
    t.equal(messages.length, 1, "22.03");
    t.end();
  }
);

tap.test(
  `23 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - no quotes in the value, B-A`,
  (t) => {
    const str = `<div class='c">.</div>`;
    const fixed = `<div class="c">.</div>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-malformed": 2,
      },
    });
    // will fix:
    t.equal(applyFixes(str, messages), fixed, "23.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-malformed",
          severity: 2,
          idxFrom: 5,
          idxTo: 14,
          message: `Opening quote should be double.`,
          fix: {
            ranges: [[11, 12, `"`]],
          },
        },
      ],
      "23.02"
    );
    t.equal(messages.length, 1, "23.03");
    t.end();
  }
);

tap.test(
  `24 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - double quotes in the value, A-B`,
  (t) => {
    const str = `<img alt='so-called "artists"!"/>`;
    const fixed = `<img alt='so-called "artists"!'/>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-malformed": 2,
      },
    });
    // will fix:
    t.equal(applyFixes(str, messages), fixed, "24.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-malformed",
          severity: 2,
          idxFrom: 5,
          idxTo: 31,
          message: `Closing quote should be single.`,
          fix: {
            ranges: [[30, 31, `'`]],
          },
        },
      ],
      "24.02"
    );
    t.equal(messages.length, 1, "24.03");
    t.end();
  }
);

tap.test(
  `25 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - double quotes in the value, B-A`,
  (t) => {
    const str = `<img alt="so-called "artists"!'/>`;
    const fixed = `<img alt='so-called "artists"!'/>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-malformed": 2,
      },
    });
    // will fix:
    t.equal(applyFixes(str, messages), fixed, "25.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-malformed",
          severity: 2,
          idxFrom: 5,
          idxTo: 31,
          message: `Opening quote should be single.`,
          fix: {
            ranges: [[9, 10, `'`]],
          },
        },
      ],
      "25.02"
    );
    t.equal(messages.length, 1, "25.03");
    t.end();
  }
);

tap.test(
  `26 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - single quotes in the value, A-B`,
  (t) => {
    const str = `<img alt="Deal is your's!'/>`;
    const fixed = `<img alt="Deal is your's!"/>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-malformed": 2,
      },
    });
    // will fix:
    t.equal(applyFixes(str, messages), fixed, "26.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-malformed",
          severity: 2,
          idxFrom: 5,
          idxTo: 26,
          message: `Closing quote should be double.`,
          fix: {
            ranges: [[25, 26, `"`]],
          },
        },
      ],
      "26.02"
    );
    t.equal(messages.length, 1, "26.03");
    t.end();
  }
);

tap.test(
  `27 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - single quotes in the value, B-A`,
  (t) => {
    const str = `<img alt='Deal is your's!"/>`;
    const fixed = `<img alt="Deal is your's!"/>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-malformed": 2,
      },
    });
    // will fix:
    t.equal(applyFixes(str, messages), fixed, "27.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-malformed",
          severity: 2,
          idxFrom: 5,
          idxTo: 26,
          message: `Opening quote should be double.`,
          fix: {
            ranges: [[9, 10, `"`]],
          },
        },
      ],
      "27.02"
    );
    t.equal(messages.length, 1, "27.03");
    t.end();
  }
);
