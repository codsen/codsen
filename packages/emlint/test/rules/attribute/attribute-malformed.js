const t = require("tap");
const { Linter } = require("../../../dist/emlint.cjs");
const { applyFixes } = require("../../../t-util/util");

// 00. false positives
// -----------------------------------------------------------------------------

t.test(
  `00.01 - ${`\u001b[${36}m${`no config`}\u001b[${39}m`} - value-less attributes`,
  (t) => {
    const str = `<td nowrap >`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-malformed": 0,
      },
    });
    t.equal(applyFixes(str, messages), str, "00.01.01");
    t.same(messages, [], "00.01.02");
    t.end();
  }
);

t.test(
  `00.02 - ${`\u001b[${36}m${`no config`}\u001b[${39}m`} - value-less attributes`,
  (t) => {
    const str = `<td nowrap>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-malformed": 0,
      },
    });
    t.equal(applyFixes(str, messages), str, "00.02.01");
    t.same(messages, [], "00.02.02");
    t.end();
  }
);

t.test(
  `00.03 - ${`\u001b[${36}m${`no config`}\u001b[${39}m`} - value-less attributes`,
  (t) => {
    const str = `<td nowrap/>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-malformed": 0,
      },
    });
    t.equal(applyFixes(str, messages), str, "00.03.01");
    t.same(messages, [], "00.03.02");
    t.end();
  }
);

t.test(
  `00.04 - ${`\u001b[${36}m${`no config`}\u001b[${39}m`} - value-less attributes`,
  (t) => {
    const str = `<br nowrap />`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-malformed": 0,
      },
    });
    t.equal(applyFixes(str, messages), str, "00.04.01");
    t.same(messages, [], "00.04.02");
    t.end();
  }
);

t.test(
  `00.05 - ${`\u001b[${36}m${`no config`}\u001b[${39}m`} - value-less attributes`,
  (t) => {
    const str = `</td nowrap nowrap>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-malformed": 0,
      },
    });
    t.equal(applyFixes(str, messages), str, "00.05.01");
    t.same(messages, [], "00.05.02");
    t.end();
  }
);

// 01. no config
// -----------------------------------------------------------------------------

t.test(`01.01 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - off`, (t) => {
  const str = `<a b"c" d'e'>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-malformed": 0,
    },
  });
  t.equal(applyFixes(str, messages), str, "01.01.01");
  t.same(messages, [], "01.01.02");
  t.end();
});

t.test(`01.02 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - warn`, (t) => {
  const str = `<a class"b" id'c'>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-malformed": 1,
    },
  });
  t.equal(applyFixes(str, messages), `<a class="b" id='c'>`, "01.02.01");
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
    "01.02.02"
  );
  t.end();
});

t.test(`01.03 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - warn`, (t) => {
  const str = `<a class"b" id'c'>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-malformed": 2,
    },
  });
  t.equal(applyFixes(str, messages), `<a class="b" id='c'>`, "01.03.01");
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
    "01.03.02"
  );
  t.end();
});

// 02. mis-typed
// -----------------------------------------------------------------------------

t.test(`02.01 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - err`, (t) => {
  const str = `<td clas="w100p">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-malformed": 2,
    },
  });
  t.equal(applyFixes(str, messages), `<td class="w100p">`, "02.01.01");
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
    "02.01.02"
  );
  t.end();
});

t.test(`02.02 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - err`, (t) => {
  const str = `<td zzzz="w100p">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-malformed": 1,
    },
  });
  // can't fix:
  t.equal(applyFixes(str, messages), str, "02.02.01");
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
    "02.02.02"
  );
  t.end();
});

// 03. repeated opening quotes
// -----------------------------------------------------------------------------

t.test(
  `03.01 - ${`\u001b[${32}m${`repeated opening`}\u001b[${39}m`} - double`,
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
    t.equal(applyFixes(str, messages), fixed, "03.01.01");
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
      "03.01.02"
    );
    t.end();
  }
);

t.test(
  `03.02 - ${`\u001b[${32}m${`repeated opening`}\u001b[${39}m`} - single`,
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
    t.equal(applyFixes(str, messages), fixed, "03.02.01");
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
      "03.02.02"
    );
    t.end();
  }
);

t.test(
  `03.03 - ${`\u001b[${32}m${`repeated opening`}\u001b[${39}m`} - single quotes instead of equal`,
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
    t.equal(applyFixes(str, messages), fixed, "03.03");
    t.end();
  }
);

t.test(
  `03.04 - ${`\u001b[${32}m${`repeated opening`}\u001b[${39}m`} - double quotes instead of equal`,
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
    t.equal(applyFixes(str, messages), fixed, "03.04");
    t.end();
  }
);

// 04. rogue quotes
// -----------------------------------------------------------------------------

t.test(
  `04.01 - ${`\u001b[${32}m${`repeated opening`}\u001b[${39}m`} - rogue single`,
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
    t.equal(applyFixes(str, messages), fixed, "04.01");
    t.end();
  }
);

t.test(
  `04.02 - ${`\u001b[${32}m${`repeated opening`}\u001b[${39}m`} - rogue double`,
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
    t.equal(applyFixes(str, messages), fixed, "04.02");
    t.end();
  }
);

// 05. rogue characters
// -----------------------------------------------------------------------------

t.test(
  `05.01 - ${`\u001b[${32}m${`repeated opening`}\u001b[${39}m`} - rogue characters around equal`,
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
    t.equal(applyFixes(str, messages), fixed, "05.01");
    t.end();
  }
);

// 06. equal missing
// -----------------------------------------------------------------------------

t.only(
  `06.01 - ${`\u001b[${32}m${`equal missing`}\u001b[${39}m`} - equal is missing, tight`,
  (t) => {
    const str = `<a bbb"c" ddd'e'>`;
    const fixed = `<a bbb="c" ddd='e'>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-malformed": 2,
      },
    });
    // will fix:
    t.equal(applyFixes(str, messages), fixed, "06.01");
    t.end();
  }
);

t.test(
  `06.02 - ${`\u001b[${32}m${`equal missing`}\u001b[${39}m`} - space instead of equal, recognised attr names followed by quoted value`,
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
    t.equal(applyFixes(str, messages), fixed, "06.02");
    t.end();
  }
);

t.test(
  `06.03 - ${`\u001b[${32}m${`equal missing`}\u001b[${39}m`} - mismatching quotes - A,B; A,B`,
  (t) => {
    const str = `<a bbb"c' ddd"e'>`;
    const fixed = `<a bbb="c" ddd="e">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-malformed": 2,
      },
    });
    // will fix:
    t.equal(applyFixes(str, messages), fixed, "06.03");
    t.end();
  }
);

t.test(
  `06.04 - ${`\u001b[${32}m${`equal missing`}\u001b[${39}m`} - mismatching quotes - A,B; B,A`,
  (t) => {
    const str = `<a bbb"c' ddd'e">`;
    const fixed = `<a bbb="c" ddd="e">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-malformed": 2,
      },
    });
    // will fix:
    t.equal(applyFixes(str, messages), fixed, "06.04");
    t.end();
  }
);

// 07. mismatching quotes
// -----------------------------------------------------------------------------

t.test(
  `07.01 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - no quotes in the value, A-B`,
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
    t.equal(applyFixes(str, messages), fixed, "07.01");
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
      "07.01.02"
    );
    t.equal(messages.length, 1, "07.01.03");
    t.end();
  }
);

t.test(
  `07.02 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - no quotes in the value, B-A`,
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
    t.equal(applyFixes(str, messages), fixed, "07.02.01");
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
      "07.02.02"
    );
    t.equal(messages.length, 1, "07.02.03");
    t.end();
  }
);

t.test(
  `07.03 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - double quotes in the value, A-B`,
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
    t.equal(applyFixes(str, messages), fixed, "07.03.01");
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
      "07.03.02"
    );
    t.equal(messages.length, 1, "07.03.03");
    t.end();
  }
);

t.test(
  `07.04 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - double quotes in the value, B-A`,
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
    t.equal(applyFixes(str, messages), fixed, "07.04.01");
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
      "07.04.02"
    );
    t.equal(messages.length, 1, "07.04.03");
    t.end();
  }
);

t.test(
  `07.05 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - single quotes in the value, A-B`,
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
    t.equal(applyFixes(str, messages), fixed, "07.05.01");
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
      "07.05.02"
    );
    t.equal(messages.length, 1, "07.05.03");
    t.end();
  }
);

t.test(
  `07.06 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - single quotes in the value, B-A`,
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
    t.equal(applyFixes(str, messages), fixed, "07.06.01");
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
      "07.06.02"
    );
    t.equal(messages.length, 1, "07.06.03");
    t.end();
  }
);
