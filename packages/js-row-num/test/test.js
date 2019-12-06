const t = require("tap");
const fixRowNums = require("../dist/js-row-num.cjs");
const BACKSLASH = `\u005C`;

// -----------------------------------------------------------------------------
// group 01. no throws
// -----------------------------------------------------------------------------

t.test(t => {
  t.doesNotThrow(() => {
    fixRowNums();
  });
  t.doesNotThrow(() => {
    fixRowNums(1);
  });
  t.doesNotThrow(() => {
    fixRowNums("");
  });
  t.doesNotThrow(() => {
    fixRowNums(null);
  });
  t.doesNotThrow(() => {
    fixRowNums(undefined);
  });
  t.doesNotThrow(() => {
    fixRowNums(true);
  });
  t.doesNotThrow(() => {
    fixRowNums({});
  });
  t.end();
});

// -----------------------------------------------------------------------------
// 02. normal use
// -----------------------------------------------------------------------------

t.test(t => {
  const src = `
zzz
zzz
zzz
console.log('043 something')
console.log('044 something')
`;
  const res = `
zzz
zzz
zzz
console.log('050 something')
console.log('051 something')
`;
  t.equal(
    fixRowNums(src),
    res,
    "02.01.01 - single straight quotes - no whitespace"
  );
  t.equal(fixRowNums(src, { triggerKeywords: undefined }), res, "02.01.02");
  t.equal(fixRowNums(src, { triggerKeywords: [] }), res, "02.01.03");
  t.end();
});

t.test(t => {
  t.equal(
    fixRowNums(`
zzz
zzz
zzz
console.log ( ' 069 456 something 123 ')
console.log('----\n\n\n070 something')
`),
    `
zzz
zzz
zzz
console.log ( ' 076 456 something 123 ')
console.log('----\n\n\n077 something')
`,
    "02.02 - single straight quotes - with whitespace"
  );
  t.end();
});

t.test(t => {
  t.equal(
    fixRowNums(`
zzz
zzz
zzz
console.log('090 something')console.log('090 something')
`),
    `
zzz
zzz
zzz
console.log('096 something')console.log('096 something')
`,
    "02.03 - single straight quotes - tight, no semicolon"
  );
  t.end();
});

t.test(t => {
  t.equal(
    fixRowNums(`
zzz
zzz
zzz
console.log("109 123 something 456")console.log("----109 something")console.log("---- something")
`),
    `
zzz
zzz
zzz
console.log("115 123 something 456")console.log("----115 something")console.log("---- something")
`,
    "02.04 - double quotes - tight"
  );
  t.end();
});

t.test(t => {
  t.equal(
    fixRowNums(`
zzz
zzz
zzz
console.log("128 123 something 456")console.log("----\n\n\n128 something")
`),
    `
zzz
zzz
zzz
console.log("134 123 something 456")console.log("----\n\n\n134 something")
`,
    "02.05 - double quotes - newlines"
  );
  t.end();
});

t.test(t => {
  t.equal(
    fixRowNums(`
zzz
zzz
zzz
console.log ( " 147 123 something 456 " )
console.log("----\n\n\n 148 something")
`),
    `
zzz
zzz
zzz
console.log ( " 154 123 something 456 " )
console.log("----\n\n\n 155 something")
`,
    "02.06 - double quotes - with whitespace"
  );
  t.end();
});

t.test(t => {
  t.equal(
    fixRowNums(`
zzz
zzz
zzz
console.log(\`099 123 something 456\`)console.log(\`----0 something\`)console.log(\`---- something\`)
`),
    `
zzz
zzz
zzz
console.log(\`005 123 something 456\`)console.log(\`----005 something\`)console.log(\`---- something\`)
`,
    "02.07 - backticks - tight"
  );
  t.end();
});

t.test(t => {
  t.equal(
    fixRowNums("console.log(`\\u001b[${33}m${`183 z`}\\u001b[${39}m`)"),
    "console.log(`\\u001b[${33}m${`184 z`}\\u001b[${39}m`)",
    "02.08 - console log with ANSI escapes - one ANSI escape chunk in front"
  );
  t.end();
});

t.test(t => {
  t.equal(
    fixRowNums(
      "console.log(`\\u001b[${012399999999}m${`193 z`}\\u001b[${39}m`)"
    ),
    "console.log(`\\u001b[${012399999999}m${`195 z`}\\u001b[${39}m`)",
    "02.09 - synthetic test where colour is put in deeper curlies for easier visual grepping"
  );
  t.end();
});

t.test(t => {
  t.equal(
    fixRowNums("console.log(`\\u001b[012399999999m${`203 z`}\\u001b[${39}m`)"),
    "console.log(`\\u001b[012399999999m${`204 z`}\\u001b[${39}m`)",
    "02.10 - synthetic test where colour code is put raw"
  );
  t.end();
});

t.test(t => {
  t.equal(
    fixRowNums(
      "console.log(`\\u001b[${012399999999}m${` \t 888 z`}\\u001b[${39}m`)"
    ),
    "console.log(`\\u001b[${012399999999}m${` \t 001 z`}\\u001b[${39}m`)",
    "02.11 - colour is put in deeper curlies for easier visual grepping"
  );
  t.end();
});

t.test(t => {
  t.equal(
    fixRowNums(
      "console.log(`\\u001b[012399999999m${` \t 888 z`}\\u001b[${39}m`)"
    ),
    "console.log(`\\u001b[012399999999m${` \t 001 z`}\\u001b[${39}m`)",
    "02.12 - colour code is put raw"
  );
  t.end();
});

t.test(t => {
  t.equal(
    fixRowNums(`
// console.log(
//   \`111 something
// \`)
`),
    `
// console.log(
//   \`003 something
// \`)
`,
    "02.13 - updates console.logs within comment blocks"
  );
  t.end();
});

t.test(t => {
  t.equal(
    fixRowNums(`
console.log(
  \`${BACKSLASH}n111 something\`
)
`),
    `
console.log(
  \`${BACKSLASH}n003 something\`
)
`,
    "02.14 - \\n in front"
  );
  t.end();
});

t.test(t => {
  t.equal(
    fixRowNums(`
${"12345\n".repeat(10000)}
console.log(
  \`${BACKSLASH}n111 something\`
)
`),
    `
${"12345\n".repeat(10000)}
console.log(
  \`${BACKSLASH}n10004 something\`
)
`,
    "02.15 - automatic 4 digit padding on >45K chars"
  );
  t.end();
});

t.test(t => {
  t.equal(
    fixRowNums("console.log('287 zzz');\nconsole.log('287 zzz');", {
      padStart: 3,
      overrideRowNum: null,
      returnRangesOnly: false,
      extractedLogContentsWereGiven: false
    }),
    "console.log('293 zzz');\nconsole.log('293 zzz');",
    "02.16"
  );
  t.end();
});

// -----------------------------------------------------------------------------
// group 03. sneaky false positives
// -----------------------------------------------------------------------------

t.test(t => {
  const str = 'I added a console.log (and then added so-called "quotes").';
  t.equal(
    fixRowNums(str),
    str,
    `03.01 - ${`\u001b[${36}m${`false positives`}\u001b[${39}m`} - text that mentions console.log`
  );
  t.end();
});

t.test(t => {
  const str = 'console.log("zzz")';
  t.equal(
    fixRowNums(str),
    str,
    `03.02 - ${`\u001b[${36}m${`false positives`}\u001b[${39}m`} - no digits at all`
  );
  t.end();
});

t.test(t => {
  const str = 'console.log "123"';
  t.equal(
    fixRowNums(str),
    str,
    `03.03 - ${`\u001b[${36}m${`false positives`}\u001b[${39}m`} - no opening bracket after console.log`
  );
  t.end();
});

t.test(t => {
  let allAscii = new Array(127);
  allAscii = allAscii.map((val, i) => String.fromCharCode(i)).join("");
  t.equal(
    fixRowNums(allAscii),
    allAscii,
    `03.04 - ${`\u001b[${36}m${`false positives`}\u001b[${39}m`} - all ASCII symbols`
  );
  t.end();
});

// -----------------------------------------------------------------------------
// group 04. opts
// -----------------------------------------------------------------------------

t.test(t => {
  t.equal(
    fixRowNums("zzz\nconsole.log('350 something')"),
    "zzz\nconsole.log('351 something')",
    "04.01 - control - default is three"
  );
  t.end();
});

t.test(t => {
  t.equal(
    fixRowNums("zzz\nconsole.log('359 something')", { padStart: 0 }),
    "zzz\nconsole.log('360 something')",
    "04.02"
  );
  t.end();
});

t.test(t => {
  t.equal(
    fixRowNums("zzz\nconsole.log('368 something')", { padStart: 1 }),
    "zzz\nconsole.log('369 something')",
    "04.03"
  );
  t.end();
});

t.test(t => {
  t.equal(
    fixRowNums("zzz\nconsole.log('377 something')", { padStart: 2 }),
    "zzz\nconsole.log('378 something')",
    "04.04"
  );
  t.end();
});

t.test(t => {
  t.equal(
    fixRowNums("zzz\nconsole.log('386 something')", { padStart: 3 }),
    "zzz\nconsole.log('387 something')",
    "04.05"
  );
  t.end();
});

t.test(t => {
  t.equal(
    fixRowNums("zzz\nconsole.log('395 something')", { padStart: 4 }),
    "zzz\nconsole.log('396 something')",
    "04.05"
  );
  t.end();
});

t.test(t => {
  t.equal(
    fixRowNums("zzz\nconsole.log('404 something')", { padStart: 9 }),
    "zzz\nconsole.log('405 something')",
    "04.06"
  );
  t.end();
});

t.test(t => {
  t.equal(
    fixRowNums("zzz\nconsole.log('413 something')", { padStart: 1 }),
    "zzz\nconsole.log('414 something')",
    "04.07 - negative numbers are ignored, default (3) is used"
  );
  t.end();
});

// falsey padding value

t.test(t => {
  t.equal(
    fixRowNums("zzz\nconsole.log('424 something')", { padStart: false }),
    "zzz\nconsole.log('425 something')",
    "04.08 - padding is set to be falsey"
  );
  t.end();
});

t.test(t => {
  t.equal(
    fixRowNums("zzz\nconsole.log('433 something')", { padStart: null }),
    "zzz\nconsole.log('434 something')",
    "04.09"
  );
  t.end();
});

t.test(t => {
  t.equal(
    fixRowNums("zzz\nconsole.log('442 something')", { padStart: undefined }),
    "zzz\nconsole.log('443 something')",
    "04.10"
  );
  t.end();
});

// -----------------------------------------------------------------------------
// group 05. ad-hoc
// -----------------------------------------------------------------------------

t.test(t => {
  t.equal(
    fixRowNums("zzzz\ryyyy\rconsole.log('455 some text')"),
    "zzzz\ryyyy\rconsole.log('456 some text')",
    `05.01 - ${`\u001b[${35}m${`ad-hoc`}\u001b[${39}m`} - text that uses \\r only as EOL characters`
  );
  t.end();
});

t.test(t => {
  t.equal(
    fixRowNums("zzzz\nyyyy\nconsole.log('464 some text')"),
    "zzzz\nyyyy\nconsole.log('465 some text')",
    "05.02"
  );
  t.end();
});

t.test(t => {
  t.equal(
    fixRowNums("zzzz\r\nyyyy\r\nconsole.log('473 some text')"),
    "zzzz\r\nyyyy\r\nconsole.log('474 some text')",
    "05.03"
  );
  t.end();
});

// broken ANSI - will not update

t.test(t => {
  t.equal(
    fixRowNums(
      "console.log(`\\u001b[012399999999${` \t 888 z`}\\u001b[${39}m`)"
    ),
    "console.log(`\\u001b[012399999999${` \t 888 z`}\\u001b[${39}m`)",
    "05.04 - ANSI opening sequence's m is missing"
  );
  t.end();
});

// -----------------------------------------------------------------------------
// 06. custom functions via opts.triggerKeywords
// -----------------------------------------------------------------------------

t.test(t => {
  t.equal(
    fixRowNums(`a\nb\nc\nlog(\`1 something\`)`),
    `a\nb\nc\nlog(\`1 something\`)`,
    `06.01 - ${`\u001b[${34}m${`opts.triggerKeywords`}\u001b[${39}m`} - baseline`
  );
  t.end();
});

t.test(t => {
  t.equal(
    fixRowNums(`a\nb\nc\nlog(\`1 something\`)`, { triggerKeywords: ["log"] }),
    `a\nb\nc\nlog(\`004 something\`)`,
    `06.02 - ${`\u001b[${34}m${`opts.triggerKeywords`}\u001b[${39}m`} - works on custom function`
  );
  t.end();
});

// non-existing log function
t.test(t => {
  const sources = [
    `a\nb\nc\nconsole.log(\`1 something\`)`,
    `a\nb\nc\nlog(\`1 something\`)`
  ];
  sources.forEach((source, idx) => {
    t.equal(
      fixRowNums(source, { triggerKeywords: ["zzz"] }),
      source,
      `06.03.0${idx + 1}`
    );
    t.equal(
      fixRowNums(source, { triggerKeywords: null }),
      source,
      `06.03.0${idx + 2}`
    );
  });
  t.end();
});

// -----------------------------------------------------------------------------
// 07. opts.overrideRowNum
// -----------------------------------------------------------------------------

t.test(t => {
  t.equal(
    fixRowNums(`
console.log('543 something')
`),
    `
console.log('546 something')
`,
    "07.01 - opts.overrideRowNum - control"
  );
  t.end();
});

t.test(t => {
  t.equal(
    fixRowNums(
      `
console.log('557 something')
`,
      {
        overrideRowNum: 5
      }
    ),
    `
console.log('564 something')
`,
    "07.02 - opts.overrideRowNum - control"
  );
  t.end();
});

// -----------------------------------------------------------------------------
// 08. opts.returnRangesOnly
// -----------------------------------------------------------------------------

t.test(t => {
  t.same(
    fixRowNums(
      `
      zzz
      zzz
      zzz
      console.log('582 something')
      console.log('583 something')
      `,
      { returnRangesOnly: true }
    ),
    [
      [50, 53, "005"],
      [85, 88, "006"]
    ],
    "08.01 - opts.returnRangesOnly - normal ops"
  );
  t.end();
});

t.test(t => {
  t.same(
    fixRowNums(
      `
console.log('600 something')
`,
      {
        overrideRowNum: 5,
        returnRangesOnly: true
      }
    ),
    [[14, 17, "005"]],
    "08.02 - opts.returnRangesOnly - overrides"
  );
  t.end();
});

// -----------------------------------------------------------------------------
// 09. opts.extractedLogContentsWereGiven
// -----------------------------------------------------------------------------

// LEADING QUOTE:

t.test(t => {
  t.same(
    fixRowNums(`"099 something 1"`, {
      overrideRowNum: 5,
      returnRangesOnly: true,
      extractedLogContentsWereGiven: true
    }),
    [[1, 4, "005"]],
    "09.01.01 - opts.extractedLogContentsWereGiven - double quotes"
  );
  t.same(
    fixRowNums(`"099 something 1"`, {
      overrideRowNum: 5,
      returnRangesOnly: false,
      extractedLogContentsWereGiven: true
    }),
    `"005 something 1"`,
    "09.01.02 - opts.extractedLogContentsWereGiven - double quotes"
  );
  t.end();
});

t.test(t => {
  t.same(
    fixRowNums(`'099 something 1'`, {
      overrideRowNum: 5,
      returnRangesOnly: true,
      extractedLogContentsWereGiven: true
    }),
    [[1, 4, "005"]],
    "09.02.01 - opts.extractedLogContentsWereGiven - single quotes"
  );
  t.same(
    fixRowNums(`'099 something 1'`, {
      overrideRowNum: 5,
      returnRangesOnly: false,
      extractedLogContentsWereGiven: true
    }),
    `'005 something 1'`,
    "09.02.02 - opts.extractedLogContentsWereGiven - single quotes"
  );
  t.end();
});

t.test(t => {
  t.same(
    fixRowNums("`099 something 1`", {
      overrideRowNum: 5,
      returnRangesOnly: true,
      extractedLogContentsWereGiven: true
    }),
    [[1, 4, "005"]],
    "09.03.01 - opts.extractedLogContentsWereGiven - backticks"
  );
  t.same(
    fixRowNums("`099 something 1`", {
      overrideRowNum: 5,
      returnRangesOnly: false,
      extractedLogContentsWereGiven: true
    }),
    "`005 something 1`",
    "09.03.02 - opts.extractedLogContentsWereGiven - backticks"
  );
  t.end();
});

t.test(t => {
  t.same(
    fixRowNums(`"9 this should be 1"`, {
      overrideRowNum: 3,
      returnRangesOnly: true,
      extractedLogContentsWereGiven: true
    }),
    [[1, 2, "003"]],
    "09.04.01"
  );
  t.same(
    fixRowNums("`099 something 1`", {
      overrideRowNum: 3,
      returnRangesOnly: false,
      extractedLogContentsWereGiven: true
    }),
    "`003 something 1`",
    "09.04.02"
  );
  t.end();
});

// NO LEADING QUOTE:
// =================

t.test(t => {
  t.same(
    fixRowNums(`012 something 1`, {
      overrideRowNum: 5,
      returnRangesOnly: true,
      extractedLogContentsWereGiven: true
    }),
    [[0, 3, "005"]],
    "09.05.01 - no leading quote + override - ranges"
  );
  t.same(
    fixRowNums(`099 something 1`, {
      overrideRowNum: 5,
      returnRangesOnly: false,
      extractedLogContentsWereGiven: true
    }),
    `005 something 1`,
    "09.05.02 - no leading quote + override - string"
  );
  t.end();
});

t.test(t => {
  t.same(
    fixRowNums(`012 something 1`, {
      returnRangesOnly: true,
      extractedLogContentsWereGiven: true
    }),
    [[0, 3, "001"]],
    "09.06.01 - no leading quote - no override - ranges"
  );
  t.same(
    fixRowNums(`099 something 1`, {
      returnRangesOnly: false,
      extractedLogContentsWereGiven: true
    }),
    `001 something 1`,
    "09.06.02 - no leading quote - no override - string"
  );
  t.end();
});

t.test(t => {
  t.same(
    fixRowNums(` 012 something 1`, {
      overrideRowNum: 5,
      returnRangesOnly: true,
      extractedLogContentsWereGiven: true
    }),
    [[1, 4, "005"]],
    "09.07.01 - opts.extractedLogContentsWereGiven - double quotes"
  );
  t.same(
    fixRowNums(` 123 something 1`, {
      overrideRowNum: 5,
      returnRangesOnly: false,
      extractedLogContentsWereGiven: true
    }),
    ` 005 something 1`,
    "09.07.02 - opts.extractedLogContentsWereGiven - double quotes"
  );
  t.end();
});

t.test(t => {
  t.equal(
    fixRowNums(`
console.log(
  '778 something'
)
`),
    `
console.log(
  '783 something'
)
`,
    "09.08"
  );
  t.end();
});

// line breaks before string itself

t.test(t => {
  t.equal(
    fixRowNums(
      `
console.log(
  '798 something'
)
`,
      {
        overrideRowNum: 99
      }
    ),
    `
console.log(
  '807 something'
)
`,
    "09.09 - overrideRowNum"
  );
  t.end();
});

t.test(t => {
  t.equal(
    fixRowNums(
      `
console.log(
  '820 something'
)
`,
      {
        overrideRowNum: 99
      }
    ),
    `
console.log(
  '829 something'
)
`,
    "09.10 - overrideRowNum"
  );
  t.end();
});

t.only(t => {
  t.same(
    fixRowNums(
      `

  '044 something'

`,
      {
        overrideRowNum: 99,
        extractedLogContentsWereGiven: true,
        returnRangesOnly: true
      }
    ),
    [[5, 8, "099"]],
    "09.11 - overrideRowNum + extractedLogContentsWereGiven"
  );
  t.end();
});
