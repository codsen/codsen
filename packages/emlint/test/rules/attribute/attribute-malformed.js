import tap from "tap";
import { applyFixes, verify } from "../../../t-util/util";

// false positives
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${36}m${`no config`}\u001b[${39}m`} - value-less attributes`,
  (t) => {
    const str = `<td nowrap >`;
    const messages = verify(t, str, {
      rules: {
        "attribute-malformed": 0,
      },
    });
    t.equal(applyFixes(str, messages), str, "01.01");
    t.strictSame(messages, [], "01.02");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${36}m${`no config`}\u001b[${39}m`} - value-less attributes`,
  (t) => {
    const str = `<td nowrap>`;
    const messages = verify(t, str, {
      rules: {
        "attribute-malformed": 0,
      },
    });
    t.equal(applyFixes(str, messages), str, "02.01");
    t.strictSame(messages, [], "02.02");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${36}m${`no config`}\u001b[${39}m`} - value-less attributes`,
  (t) => {
    const str = `<td nowrap/>`;
    const messages = verify(t, str, {
      rules: {
        "attribute-malformed": 0,
      },
    });
    t.equal(applyFixes(str, messages), str, "03.01");
    t.strictSame(messages, [], "03.02");
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${36}m${`no config`}\u001b[${39}m`} - value-less attributes`,
  (t) => {
    const str = `<br nowrap />`;
    const messages = verify(t, str, {
      rules: {
        "attribute-malformed": 0,
      },
    });
    t.equal(applyFixes(str, messages), str, "04.01");
    t.strictSame(messages, [], "04.02");
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${36}m${`no config`}\u001b[${39}m`} - value-less attributes`,
  (t) => {
    const str = `</td nowrap nowrap>`;
    const messages = verify(t, str, {
      rules: {
        "attribute-malformed": 0,
      },
    });
    t.equal(applyFixes(str, messages), str, "05.01");
    t.strictSame(messages, [], "05.02");
    t.end();
  }
);

// no config
// -----------------------------------------------------------------------------

tap.test(`06 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - off`, (t) => {
  const str = `<a b"c" d'e'>`;
  const messages = verify(t, str, {
    rules: {
      "attribute-malformed": 0,
    },
  });
  t.equal(applyFixes(str, messages), str, "06.01");
  t.strictSame(messages, [], "06.02");
  t.end();
});

tap.test(`07 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - warn`, (t) => {
  const str = `<a class"b" id'c'>`;
  const messages = verify(t, str, {
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
  const messages = verify(t, str, {
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

// mis-typed
// -----------------------------------------------------------------------------

tap.test(`09 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - err`, (t) => {
  const str = `<td clas="w100p">`;
  const messages = verify(t, str, {
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
  const messages = verify(t, str, {
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

// repeated opening quotes
// -----------------------------------------------------------------------------

tap.test(
  `11 - ${`\u001b[${32}m${`repeated opening`}\u001b[${39}m`} - double`,
  (t) => {
    const str = `<table width=""100">\n  zzz\n</table>`;
    const fixed = `<table width="100">\n  zzz\n</table>`;
    const messages = verify(t, str, {
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
            ranges: [[14, 15]],
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
    const messages = verify(t, str, {
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
            ranges: [[14, 15]],
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
    const messages = verify(t, str, {
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
    const messages = verify(t, str, {
      rules: {
        "attribute-malformed": 2,
      },
    });
    // will fix:
    t.equal(applyFixes(str, messages), fixed, "14");
    t.end();
  }
);

tap.test(
  `15 - ${`\u001b[${32}m${`repeated closing`}\u001b[${39}m`} - double`,
  (t) => {
    const str = `<table width="100"">\n  zzz\n</table>`;
    const fixed = `<table width="100">\n  zzz\n</table>`;
    const messages = verify(t, str, {
      rules: {
        "attribute-malformed": 1,
      },
    });
    // will fix:
    t.equal(applyFixes(str, messages), fixed, "15.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-malformed",
          idxFrom: 7,
          idxTo: 19,
          message: `Delete repeated closing quotes.`,
          fix: {
            ranges: [[17, 18]],
          },
        },
      ],
      "15.02"
    );
    t.end();
  }
);

// rogue quotes
// -----------------------------------------------------------------------------

tap.test(
  `16 - ${`\u001b[${32}m${`repeated opening`}\u001b[${39}m`} - rogue single`,
  (t) => {
    const str = `<table width='"100">zzz</table>`;
    const fixed = `<table width="100">zzz</table>`;
    const messages = verify(t, str, {
      rules: {
        "attribute-malformed": 2,
      },
    });
    // will fix:
    t.equal(applyFixes(str, messages), fixed, "16");
    t.end();
  }
);

tap.test(
  `17 - ${`\u001b[${32}m${`repeated opening`}\u001b[${39}m`} - rogue double`,
  (t) => {
    const str = `<table width="'100'>zzz</table>`;
    const fixed = `<table width='100'>zzz</table>`;
    const messages = verify(t, str, {
      rules: {
        "attribute-malformed": 2,
      },
    });
    // will fix:
    t.equal(applyFixes(str, messages), fixed, "17");
    t.end();
  }
);

// rogue characters
// -----------------------------------------------------------------------------

tap.test(
  `18 - ${`\u001b[${32}m${`repeated opening`}\u001b[${39}m`} - rogue characters around equal`,
  (t) => {
    const str = `<span width...=....."100"></span>`;
    const fixed = `<span width="100"></span>`;
    const messages = verify(t, str, {
      rules: {
        "attribute-malformed": 2,
      },
    });
    // will fix:
    t.equal(applyFixes(str, messages), fixed, "18");
    t.end();
  }
);

// equal missing
// -----------------------------------------------------------------------------

tap.test(
  `19 - ${`\u001b[${32}m${`equal missing`}\u001b[${39}m`} - equal is missing, tight`,
  (t) => {
    const str = `<a class"c" id'e'>`;
    const fixed = `<a class="c" id='e'>`;
    const messages = verify(t, str, {
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
  `20 - ${`\u001b[${32}m${`equal missing`}\u001b[${39}m`} - space instead of equal, recognised attr names followed by quoted value`,
  (t) => {
    const str = `<a class "c" id 'e' href "www">`;
    const fixed = `<a class="c" id='e' href="www">`;
    const messages = verify(t, str, {
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
  `21 - ${`\u001b[${32}m${`equal missing`}\u001b[${39}m`} - mismatching quotes - A,B; A,B`,
  (t) => {
    const str = `<a class"c' id"e'>`;
    const fixed = `<a class="c" id="e">`;
    const messages = verify(t, str, {
      rules: {
        "attribute-malformed": 2,
      },
    });
    // will fix:
    t.equal(applyFixes(str, messages), fixed, "21");
    t.end();
  }
);

tap.test(
  `22 - ${`\u001b[${32}m${`equal missing`}\u001b[${39}m`} - mismatching quotes - A,B; B,A - no prettier`,
  (t) => {
    // a default setting sets the closing quote to be
    // like the opening
    const str = `<a class"c' id'e">`;
    const fixed = `<a class="c" id='e'>`;
    const messages = verify(t, str, {
      rules: {
        "attribute-malformed": 2,
      },
    });
    // will fix:
    t.equal(applyFixes(str, messages), fixed, "22");
    t.end();
  }
);

tap.test(
  `23 - ${`\u001b[${32}m${`equal missing`}\u001b[${39}m`} - mismatching quotes - A,B; B,A`,
  (t) => {
    // with format-prettier enabled, doubles are enforced
    const str = `<a class"c' id'e">`;
    const fixed = `<a class="c" id="e">`;
    const messages = verify(t, str, {
      rules: {
        "attribute-malformed": 2,
        "format-prettier": 2,
      },
    });
    // will fix:
    t.equal(applyFixes(str, messages), fixed, "23");
    t.end();
  }
);

tap.todo(`24 - ${`\u001b[${32}m${`equal missing`}\u001b[${39}m`}`, (t) => {
  const str = `<img alt""/>`;
  const fixed = `<img alt=""/>`;
  const messages = verify(t, str, {
    rules: {
      "attribute-malformed": 2,
    },
  });
  // will fix:
  t.equal(applyFixes(str, messages), fixed, "24");
  t.end();
});

// mismatching quotes
// -----------------------------------------------------------------------------

tap.test(
  `25 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - no quotes in the value, A-B`,
  (t) => {
    const str = `<div class="c'>.</div>`;
    const fixed = `<div class="c">.</div>`;
    const messages = verify(t, str, {
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
          idxTo: 14,
          message: `Wrong closing quote.`,
          fix: {
            ranges: [[13, 14, `"`]],
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
  `26 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - no quotes in the value, B-A`,
  (t) => {
    const str = `<div class='c">.</div>`;
    const fixed = `<div class="c">.</div>`;
    const messages = verify(t, str, {
      rules: {
        "attribute-malformed": 2,
        "format-prettier": 2,
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
          idxTo: 14,
          message: `Wrong opening quote.`,
          fix: {
            ranges: [[11, 12, `"`]],
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
  `27 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - double quotes in the value, A-B`,
  (t) => {
    const str = `<img alt='so-called "artists"!"/>`;
    const fixed = `<img alt='so-called "artists"!'/>`;
    const messages = verify(t, str, {
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
          idxTo: 31,
          message: `Wrong closing quote.`,
          fix: {
            ranges: [[30, 31, `'`]],
          },
        },
      ],
      "27.02"
    );
    t.equal(messages.length, 1, "27.03");
    t.end();
  }
);

tap.test(
  `28 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - double quotes in the value, B-A`,
  (t) => {
    const str = `<img alt="so-called "artists"!'/>`;
    const fixed = `<img alt='so-called "artists"!'/>`;
    const messages = verify(t, str, {
      rules: {
        "attribute-malformed": 2,
      },
    });
    // will fix:
    t.equal(applyFixes(str, messages), fixed, "28.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-malformed",
          severity: 2,
          idxFrom: 5,
          idxTo: 31,
          message: `Wrong opening quote.`,
          fix: {
            ranges: [[9, 10, `'`]],
          },
        },
      ],
      "28.02"
    );
    t.equal(messages.length, 1, "28.03");
    t.end();
  }
);

tap.test(
  `29 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - single quotes in the value, A-B`,
  (t) => {
    const str = `<img alt="Deal is your's!'/>`;
    const fixed = `<img alt="Deal is your's!"/>`;
    const messages = verify(t, str, {
      rules: {
        "attribute-malformed": 2,
      },
    });
    // will fix:
    t.equal(applyFixes(str, messages), fixed, "29.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-malformed",
          severity: 2,
          idxFrom: 5,
          idxTo: 26,
          message: `Wrong closing quote.`,
          fix: {
            ranges: [[25, 26, `"`]],
          },
        },
      ],
      "29.02"
    );
    t.equal(messages.length, 1, "29.03");
    t.end();
  }
);

tap.test(
  `30 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - single quotes in the value, B-A`,
  (t) => {
    const str = `<img alt='Deal is your's!"/>`;
    const fixed = `<img alt="Deal is your's!"/>`;
    const messages = verify(t, str, {
      rules: {
        "attribute-malformed": 2,
      },
    });
    // will fix:
    t.equal(applyFixes(str, messages), fixed, "30.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-malformed",
          severity: 2,
          idxFrom: 5,
          idxTo: 26,
          message: `Wrong opening quote.`,
          fix: {
            ranges: [[9, 10, `"`]],
          },
        },
      ],
      "30.02"
    );
    t.equal(messages.length, 1, "30.03");
    t.end();
  }
);

// wrong letter case, legit attributes
// -----------------------------------------------------------------------------

tap.test(`31 - all caps attr name`, (t) => {
  const str = `<img SRC="spacer.gif" Alt=""/>`;
  const fixed = `<img src="spacer.gif" alt=""/>`;
  const messages = verify(t, str, {
    rules: {
      "attribute-malformed": 2,
    },
  });
  // will fix:
  t.equal(applyFixes(str, messages), fixed, "31.01");
  t.match(
    messages,
    [
      {
        ruleId: "attribute-malformed",
        severity: 2,
        idxFrom: 5,
        idxTo: 8,
        message: `Should be lowercase.`,
        fix: {
          ranges: [[5, 8, `src`]],
        },
      },
      {
        ruleId: "attribute-malformed",
        severity: 2,
        idxFrom: 22,
        idxTo: 25,
        message: `Should be lowercase.`,
        fix: {
          ranges: [[22, 25, `alt`]],
        },
      },
    ],
    "31.02"
  );
  t.equal(messages.length, 2, "31.03");
  t.end();
});

// unescaped matching quotes within a value
// -----------------------------------------------------------------------------

tap.test(
  `32 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - single quotes in the value, A-A-A-A, no prettier`,
  (t) => {
    const str = `<img alt="so-called "artists"!"/>`;
    const fixed = `<img alt='so-called "artists"!'/>`;
    const messages = verify(t, str, {
      rules: {
        "attribute-malformed": 2,
      },
    });
    // will fix:
    t.equal(applyFixes(str, messages), fixed, "32.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-malformed",
          severity: 2,
          idxFrom: 5,
          idxTo: 31,
          message: `Wrong opening quote.`,
          fix: {
            ranges: [[9, 10, `'`]],
          },
        },
        {
          ruleId: "attribute-malformed",
          severity: 2,
          idxFrom: 5,
          idxTo: 31,
          message: `Wrong closing quote.`,
          fix: {
            ranges: [[30, 31, `'`]],
          },
        },
      ],
      "32.02"
    );
    t.equal(messages.length, 2, "32.03");
    t.end();
  }
);

tap.test(
  `33 - ${`\u001b[${32}m${`mismatching quotes`}\u001b[${39}m`} - single quotes in the value, A-A-A-A, prettier`,
  (t) => {
    const str = `<img alt="so-called "artists"!"/>`;
    const fixed = `<img alt="so-called &quot;artists&quot;!"/>`;
    const messages = verify(t, str, {
      rules: {
        "attribute-malformed": 2,
        "format-prettier": 2,
      },
    });
    // will fix:
    t.equal(applyFixes(str, messages), fixed, "33.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-malformed",
          severity: 2,
          idxFrom: 5,
          idxTo: 31,
          message: `Encode the double quotes.`,
          fix: {
            ranges: [[10, 30, `so-called &quot;artists&quot;!`]],
          },
        },
      ],
      "33.02"
    );
    t.equal(messages.length, 1, "33.03");
    t.end();
  }
);

// various
// -----------------------------------------------------------------------------

tap.test(`34`, (t) => {
  const str = `<img alt="/>`;
  const fixed = `<img alt=""/>`;
  const messages = verify(t, str, {
    rules: {
      "attribute-malformed": 2,
    },
  });
  // will fix:
  t.equal(applyFixes(str, messages), fixed, "34.01");
  t.equal(messages.length, 1, "34.02");
  t.end();
});

tap.test(`35`, (t) => {
  const str = `<img alt='/>`;
  const fixed = `<img alt=''/>`;
  const messages = verify(t, str, {
    rules: {
      "attribute-malformed": 2,
    },
  });
  // will fix:
  t.equal(applyFixes(str, messages), fixed, "35.01");
  t.equal(messages.length, 1, "35.02");
  t.end();
});

tap.test(`36`, (t) => {
  const str = `<img alt=">`;
  const fixed = `<img alt=""/>`;
  const messages = verify(t, str, {
    rules: {
      "attribute-malformed": 2,
      "tag-void-slash": 2,
    },
  });
  // will fix:
  t.equal(applyFixes(str, messages), fixed, "36");
  t.end();
});

tap.test(`37`, (t) => {
  const str = `<img alt='>`;
  const fixed = `<img alt=''/>`;
  const messages = verify(t, str, {
    rules: {
      "attribute-malformed": 2,
      "tag-void-slash": 2,
    },
  });
  // will fix:
  t.equal(applyFixes(str, messages), fixed, "37");
  t.end();
});

tap.test(`38`, (t) => {
  const str = `<img alt=">`;
  const fixed = `<img alt="" />`;
  const messages = verify(t, str, {
    rules: {
      "attribute-malformed": 2,
      "tag-void-slash": 2,
      "tag-space-before-closing-slash": [2, "always"],
    },
  });
  // will fix:
  t.equal(applyFixes(str, messages), fixed, "38");
  t.end();
});

tap.test(`39`, (t) => {
  const str = `<img alt='>`;
  const fixed = `<img alt="" />`;
  const messages = verify(t, str, {
    rules: {
      "attribute-malformed": 2,
      "tag-void-slash": 2,
      "format-prettier": 2,
      "tag-space-before-closing-slash": [2, "always"],
    },
  });
  // will fix:
  t.equal(applyFixes(str, messages), fixed, "39");
  t.end();
});

// -----------------------------------------------------------------------------

tap.test(`40`, (t) => {
  const str = `<div class=“foo”>z</div>`;
  const fixed = `<div class="foo">z</div>`;
  const messages = verify(t, str, {
    rules: {
      "attribute-malformed": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "40");
  t.end();
});
