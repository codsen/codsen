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

t.only(t => {
  t.is(
    fixRowNums(`
zzz
zzz
zzz
console.log('044 something')
console.log('045 something')
`),
    `
zzz
zzz
zzz
console.log('005 something')
console.log('006 something')
`,
    "02.01 - single straight quotes - no whitespace"
  );
  t.end();
});

t.test(t => {
  t.is(
    fixRowNums(`
zzz
zzz
zzz
console.log ( ' 064 456 something 123 ')
console.log('----\n\n\n099 something')
`),
    `
zzz
zzz
zzz
console.log ( ' 005 456 something 123 ')
console.log('----\n\n\n009 something')
`,
    "02.02 - single straight quotes - with whitespace"
  );
  t.end();
});

t.test(t => {
  t.is(
    fixRowNums(`
zzz
zzz
zzz
console.log('085 something')console.log('085 something')
`),
    `
zzz
zzz
zzz
console.log('005 something')console.log('005 something')
`,
    "02.03 - single straight quotes - tight, no semicolon"
  );
  t.end();
});

t.test(t => {
  t.is(
    fixRowNums(`
zzz
zzz
zzz
console.log("104 123 something 456")console.log("----104 something")console.log("---- something")
`),
    `
zzz
zzz
zzz
console.log("005 123 something 456")console.log("----005 something")console.log("---- something")
`,
    "02.04 - double quotes - tight"
  );
  t.end();
});

t.test(t => {
  t.is(
    fixRowNums(`
zzz
zzz
zzz
console.log("123 123 something 456")console.log("----\n\n\n123 something")
`),
    `
zzz
zzz
zzz
console.log("005 123 something 456")console.log("----\n\n\n008 something")
`,
    "02.05 - double quotes - newlines"
  );
  t.end();
});

t.test(t => {
  t.is(
    fixRowNums(`
zzz
zzz
zzz
console.log ( " 142 123 something 456 " )
console.log("----\n\n\n 143 something")
`),
    `
zzz
zzz
zzz
console.log ( " 005 123 something 456 " )
console.log("----\n\n\n 009 something")
`,
    "02.06 - double quotes - with whitespace"
  );
  t.end();
});

t.test(t => {
  t.is(
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
  t.is(
    fixRowNums("console.log(`\\u001b[${33}m${`178 z`}\\u001b[${39}m`)"),
    "console.log(`\\u001b[${33}m${`001 z`}\\u001b[${39}m`)",
    "02.08 - console log with ANSI escapes - one ANSI escape chunk in front"
  );
  t.end();
});

t.test(t => {
  t.is(
    fixRowNums(
      "console.log(`\\u001b[${012399999999}m${`188 z`}\\u001b[${39}m`)"
    ),
    "console.log(`\\u001b[${012399999999}m${`001 z`}\\u001b[${39}m`)",
    "02.09 - synthetic test where colour is put in deeper curlies for easier visual grepping"
  );
  t.end();
});

t.test(t => {
  t.is(
    fixRowNums("console.log(`\\u001b[012399999999m${`198 z`}\\u001b[${39}m`)"),
    "console.log(`\\u001b[012399999999m${`001 z`}\\u001b[${39}m`)",
    "02.10 - synthetic test where colour code is put raw"
  );
  t.end();
});

t.test(t => {
  t.is(
    fixRowNums(
      "console.log(`\\u001b[${012399999999}m${` \t 888 z`}\\u001b[${39}m`)"
    ),
    "console.log(`\\u001b[${012399999999}m${` \t 001 z`}\\u001b[${39}m`)",
    "02.11 - colour is put in deeper curlies for easier visual grepping"
  );
  t.end();
});

t.test(t => {
  t.is(
    fixRowNums(
      "console.log(`\\u001b[012399999999m${` \t 888 z`}\\u001b[${39}m`)"
    ),
    "console.log(`\\u001b[012399999999m${` \t 001 z`}\\u001b[${39}m`)",
    "02.12 - colour code is put raw"
  );
  t.end();
});

t.test(t => {
  t.is(
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
  t.is(
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
  t.is(
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

// -----------------------------------------------------------------------------
// group 03. sneaky false positives
// -----------------------------------------------------------------------------

t.test(t => {
  const str = 'I added a console.log (and then added so-called "quotes").';
  t.is(
    fixRowNums(str),
    str,
    `03.01 - ${`\u001b[${36}m${`false positives`}\u001b[${39}m`} - text that mentions console.log`
  );
  t.end();
});

t.test(t => {
  const str = 'console.log("zzz")';
  t.is(
    fixRowNums(str),
    str,
    `03.02 - ${`\u001b[${36}m${`false positives`}\u001b[${39}m`} - no digits at all`
  );
  t.end();
});

t.test(t => {
  const str = 'console.log "123"';
  t.is(
    fixRowNums(str),
    str,
    `03.03 - ${`\u001b[${36}m${`false positives`}\u001b[${39}m`} - no opening bracket after console.log`
  );
  t.end();
});

t.test(t => {
  let allAscii = new Array(127);
  allAscii = allAscii.map((val, i) => String.fromCharCode(i)).join("");
  t.is(
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
  t.is(
    fixRowNums("zzz\nconsole.log('331 something')"),
    "zzz\nconsole.log('002 something')",
    "04.01 - control - default is three"
  );
  t.end();
});

t.test(t => {
  t.is(
    fixRowNums("zzz\nconsole.log('340 something')", { padStart: 0 }),
    "zzz\nconsole.log('2 something')",
    "04.02"
  );
  t.end();
});

t.test(t => {
  t.is(
    fixRowNums("zzz\nconsole.log('349 something')", { padStart: 1 }),
    "zzz\nconsole.log('2 something')",
    "04.03"
  );
  t.end();
});

t.test(t => {
  t.is(
    fixRowNums("zzz\nconsole.log('358 something')", { padStart: 2 }),
    "zzz\nconsole.log('02 something')",
    "04.04"
  );
  t.end();
});

t.test(t => {
  t.is(
    fixRowNums("zzz\nconsole.log('367 something')", { padStart: 3 }),
    "zzz\nconsole.log('002 something')",
    "04.05"
  );
  t.end();
});

t.test(t => {
  t.is(
    fixRowNums("zzz\nconsole.log('376 something')", { padStart: 4 }),
    "zzz\nconsole.log('0002 something')",
    "04.05"
  );
  t.end();
});

t.test(t => {
  t.is(
    fixRowNums("zzz\nconsole.log('385 something')", { padStart: 9 }),
    "zzz\nconsole.log('000000002 something')",
    "04.06"
  );
  t.end();
});

t.test(t => {
  t.is(
    fixRowNums("zzz\nconsole.log('394 something')", { padStart: 1 }),
    "zzz\nconsole.log('2 something')",
    "04.07 - negative numbers are ignored, default (3) is used"
  );
  t.end();
});

// falsey padding value

t.test(t => {
  t.is(
    fixRowNums("zzz\nconsole.log('405 something')", { padStart: false }),
    "zzz\nconsole.log('2 something')",
    "04.08 - padding is set to be falsey"
  );
  t.end();
});

t.test(t => {
  t.is(
    fixRowNums("zzz\nconsole.log('414 something')", { padStart: null }),
    "zzz\nconsole.log('2 something')",
    "04.09"
  );
  t.end();
});

t.test(t => {
  t.is(
    fixRowNums("zzz\nconsole.log('423 something')", { padStart: undefined }),
    "zzz\nconsole.log('2 something')",
    "04.10"
  );
  t.end();
});

// -----------------------------------------------------------------------------
// group 05. ad-hoc
// -----------------------------------------------------------------------------

t.test(t => {
  t.is(
    fixRowNums("zzzz\ryyyy\rconsole.log('436 some text')"),
    "zzzz\ryyyy\rconsole.log('003 some text')",
    `05.01 - ${`\u001b[${35}m${`ad-hoc`}\u001b[${39}m`} - text that uses \\r only as EOL characters`
  );
  t.end();
});

t.test(t => {
  t.is(
    fixRowNums("zzzz\nyyyy\nconsole.log('445 some text')"),
    "zzzz\nyyyy\nconsole.log('003 some text')",
    "05.02"
  );
  t.end();
});

t.test(t => {
  t.is(
    fixRowNums("zzzz\r\nyyyy\r\nconsole.log('454 some text')"),
    "zzzz\r\nyyyy\r\nconsole.log('003 some text')",
    "05.03"
  );
  t.end();
});

// broken ANSI - will not update

t.test(t => {
  t.is(
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
  t.is(
    fixRowNums(`a\nb\nc\nlog(\`1 something\`)`),
    `a\nb\nc\nlog(\`1 something\`)`,
    `06.01 - ${`\u001b[${34}m${`opts.triggerKeywords`}\u001b[${39}m`} - baseline`
  );
  t.end();
});

t.test(t => {
  t.is(
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
    t.is(
      fixRowNums(source, { triggerKeywords: ["zzz"] }),
      source,
      `06.03.0${idx + 1}`
    );
    t.is(
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
  t.is(
    fixRowNums(`
console.log('9 something')
`),
    `
console.log('002 something')
`,
    "07.01 - opts.overrideRowNum - control"
  );
  t.end();
});

t.test(t => {
  t.is(
    fixRowNums(
      `
console.log('9 something')
`,
      {
        overrideRowNum: 5
      }
    ),
    `
console.log('005 something')
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
      console.log('002 something')
      console.log('003 something')
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
console.log('578 something')
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
    "09.02 - opts.extractedLogContentsWereGiven - single quotes"
  );
  t.same(
    fixRowNums(`'099 something 1'`, {
      overrideRowNum: 5,
      returnRangesOnly: false,
      extractedLogContentsWereGiven: true
    }),
    `'005 something 1'`,
    "09.02 - opts.extractedLogContentsWereGiven - single quotes"
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
