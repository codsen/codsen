import test from "ava";
import fixRowNums from "../dist/js-row-num.esm";
const BACKSLASH = `\u005C`;

// -----------------------------------------------------------------------------
// group 01. no throws
// -----------------------------------------------------------------------------

test("01.01 - wrong input is just being returned", t => {
  t.notThrows(() => {
    fixRowNums();
  });
  t.notThrows(() => {
    fixRowNums(1);
  });
  t.notThrows(() => {
    fixRowNums("");
  });
  t.notThrows(() => {
    fixRowNums(null);
  });
  t.notThrows(() => {
    fixRowNums(undefined);
  });
  t.notThrows(() => {
    fixRowNums(true);
  });
  t.notThrows(() => {
    fixRowNums({});
  });
});

// -----------------------------------------------------------------------------
// 02. normal use
// -----------------------------------------------------------------------------

test("02.01 - single straight quotes - no whitespace", t => {
  t.is(
    fixRowNums(`
zzz
zzz
zzz
console.log('099 something')
console.log('1 something')
`),
    `
zzz
zzz
zzz
console.log('005 something')
console.log('006 something')
`
  );
});

test("02.02 - single straight quotes - with whitespace", t => {
  t.is(
    fixRowNums(`
zzz
zzz
zzz
console.log ( ' 099 456 something 123 ')
console.log('----\n\n\n1 something')
`),
    `
zzz
zzz
zzz
console.log ( ' 005 456 something 123 ')
console.log('----\n\n\n009 something')
`
  );
});

test("02.03 - single straight quotes - tight, no semicolon", t => {
  t.is(
    fixRowNums(`
zzz
zzz
zzz
console.log('099 something')console.log('1 something')
`),
    `
zzz
zzz
zzz
console.log('005 something')console.log('005 something')
`
  );
});

test("02.04 - double quotes - tight", t => {
  t.is(
    fixRowNums(`
zzz
zzz
zzz
console.log("099 123 something 456")console.log("----0 something")console.log("---- something")
`),
    `
zzz
zzz
zzz
console.log("005 123 something 456")console.log("----005 something")console.log("---- something")
`
  );
});

test("02.05 - double quotes - newlines", t => {
  t.is(
    fixRowNums(`
zzz
zzz
zzz
console.log("099 123 something 456")console.log("----\n\n\n0 something")
`),
    `
zzz
zzz
zzz
console.log("005 123 something 456")console.log("----\n\n\n008 something")
`
  );
});

test("02.06 - double quotes - with whitespace", t => {
  t.is(
    fixRowNums(`
zzz
zzz
zzz
console.log ( " 099 123 something 456 " )
console.log("----\n\n\n 0 something")
`),
    `
zzz
zzz
zzz
console.log ( " 005 123 something 456 " )
console.log("----\n\n\n 009 something")
`
  );
});

test("02.07 - backticks - tight", t => {
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
`
  );
});

test("02.08 - console log with ANSI escapes - one ANSI escape chunk in front", t => {
  t.is(
    fixRowNums("console.log(`\\u001b[${33}m${`999 z`}\\u001b[${39}m`)"),
    "console.log(`\\u001b[${33}m${`001 z`}\\u001b[${39}m`)"
  );
});

test("02.09 - synthetic test where colour is put in deeper curlies for easier visual grepping", t => {
  t.is(
    fixRowNums(
      "console.log(`\\u001b[${012399999999}m${`888 z`}\\u001b[${39}m`)"
    ),
    "console.log(`\\u001b[${012399999999}m${`001 z`}\\u001b[${39}m`)"
  );
});

test("02.10 - synthetic test where colour code is put raw", t => {
  t.is(
    fixRowNums("console.log(`\\u001b[012399999999m${`888 z`}\\u001b[${39}m`)"),
    "console.log(`\\u001b[012399999999m${`001 z`}\\u001b[${39}m`)"
  );
});

test("02.11 - bunch of whitespace 1", t => {
  t.is(
    fixRowNums(
      "console.log(`\\u001b[${012399999999}m${` \t 888 z`}\\u001b[${39}m`)"
    ),
    "console.log(`\\u001b[${012399999999}m${` \t 001 z`}\\u001b[${39}m`)",
    "02.04.04 - synthetic test where colour is put in deeper curlies for easier visual grepping"
  );
});

test("02.12 - bunch of whitespace 2", t => {
  t.is(
    fixRowNums(
      "console.log(`\\u001b[012399999999m${` \t 888 z`}\\u001b[${39}m`)"
    ),
    "console.log(`\\u001b[012399999999m${` \t 001 z`}\\u001b[${39}m`)",
    "02.04.05 - synthetic test where colour code is put raw"
  );
});

test("02.13 - updates console.logs within comment blocks", t => {
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
`
  );
});

test("02.14 - \\n in front", t => {
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
`
  );
});

test("02.15 - automatic 4 digit padding on >45K chars", t => {
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
`
  );
});

// -----------------------------------------------------------------------------
// group 03. sneaky false positives
// -----------------------------------------------------------------------------

test(`03.01 - ${`\u001b[${36}m${`false positives`}\u001b[${39}m`} - text that mentions console.log`, t => {
  const str = 'I added a console.log (and then added so-called "quotes").';
  t.is(fixRowNums(str), str, "03.01");
});

test(`03.02 - ${`\u001b[${36}m${`false positives`}\u001b[${39}m`} - no digits at all`, t => {
  const str = 'console.log("zzz")';
  t.is(fixRowNums(str), str, "03.02");
});

test(`03.03 - ${`\u001b[${36}m${`false positives`}\u001b[${39}m`} - no opening bracket after console.log`, t => {
  const str = 'console.log "123"';
  t.is(fixRowNums(str), str, "03.03");
});

test(`03.04 - ${`\u001b[${36}m${`false positives`}\u001b[${39}m`} - all ASCII symbols`, t => {
  let allAscii = new Array(127);
  allAscii = allAscii.map((val, i) => String.fromCharCode(i)).join("");
  t.is(fixRowNums(allAscii), allAscii, "03.04");
});

// -----------------------------------------------------------------------------
// group 04. opts
// -----------------------------------------------------------------------------

test(`04.01 - ${`\u001b[${33}m${`opts.padStart`}\u001b[${39}m`} - padding is set to numbers`, t => {
  const str = "zzz\nconsole.log('1 something')";
  t.is(
    fixRowNums(str),
    "zzz\nconsole.log('002 something')",
    "04.01.01 - control - default is three"
  );
  t.is(
    fixRowNums(str, { padStart: 0 }),
    "zzz\nconsole.log('2 something')",
    "04.01.02"
  );
  t.is(
    fixRowNums(str, { padStart: 1 }),
    "zzz\nconsole.log('2 something')",
    "04.01.03"
  );
  t.is(
    fixRowNums(str, { padStart: 2 }),
    "zzz\nconsole.log('02 something')",
    "04.01.04"
  );
  t.is(
    fixRowNums(str, { padStart: 3 }),
    "zzz\nconsole.log('002 something')",
    "04.01.05"
  );
  t.is(
    fixRowNums(str, { padStart: 4 }),
    "zzz\nconsole.log('0002 something')",
    "04.01.05"
  );
  t.is(
    fixRowNums(str, { padStart: 9 }),
    "zzz\nconsole.log('000000002 something')",
    "04.01.06"
  );
  t.is(
    fixRowNums(str, { padStart: 1 }),
    "zzz\nconsole.log('2 something')",
    "04.01.07 - negative numbers are ignored, default (3) is used"
  );
});

test(`04.02 - ${`\u001b[${33}m${`opts.padStart`}\u001b[${39}m`} - padding is set to be falsey`, t => {
  const str = "zzz\nconsole.log('1 something')";
  t.is(
    fixRowNums(str, { padStart: false }),
    "zzz\nconsole.log('2 something')",
    "04.02.01"
  );
  t.is(
    fixRowNums(str, { padStart: null }),
    "zzz\nconsole.log('2 something')",
    "04.02.02"
  );
  t.is(
    fixRowNums(str, { padStart: undefined }),
    "zzz\nconsole.log('2 something')",
    "04.02.03"
  );
});

// -----------------------------------------------------------------------------
// group 05. ad-hoc
// -----------------------------------------------------------------------------

test(`05.01 - ${`\u001b[${35}m${`ad-hoc`}\u001b[${39}m`} - text that uses \\r only as EOL characters`, t => {
  t.is(
    fixRowNums("zzzz\ryyyy\rconsole.log('1 some text')"),
    "zzzz\ryyyy\rconsole.log('003 some text')",
    "05.01.01"
  );
  t.is(
    fixRowNums("zzzz\nyyyy\nconsole.log('1 some text')"),
    "zzzz\nyyyy\nconsole.log('003 some text')",
    "05.01.02"
  );
  t.is(
    fixRowNums("zzzz\r\nyyyy\r\nconsole.log('1 some text')"),
    "zzzz\r\nyyyy\r\nconsole.log('003 some text')",
    "05.01.03"
  );
});

test(`05.02 - ${`\u001b[${35}m${`ad-hoc`}\u001b[${39}m`} - broken ANSI - will not update`, t => {
  t.is(
    fixRowNums(
      "console.log(`\\u001b[012399999999${` \t 888 z`}\\u001b[${39}m`)"
    ),
    "console.log(`\\u001b[012399999999${` \t 888 z`}\\u001b[${39}m`)",
    "05.02 - ANSI opening sequence's m is missing"
  );
});

// -----------------------------------------------------------------------------
// 06. custom functions via opts.triggerKeywords
// -----------------------------------------------------------------------------

test(`06.01 - ${`\u001b[${34}m${`opts.triggerKeywords`}\u001b[${39}m`} - baseline`, t => {
  t.is(
    fixRowNums(`a\nb\nc\nlog(\`1 something\`)`),
    `a\nb\nc\nlog(\`1 something\`)`
  );
});

test(`06.02 - ${`\u001b[${34}m${`opts.triggerKeywords`}\u001b[${39}m`} - works on custom function`, t => {
  t.is(
    fixRowNums(`a\nb\nc\nlog(\`1 something\`)`, { triggerKeywords: ["log"] }),
    `a\nb\nc\nlog(\`004 something\`)`
  );
});

test(`06.03 - ${`\u001b[${34}m${`opts.triggerKeywords`}\u001b[${39}m`} - non-existing log function`, t => {
  const sources = [
    `a\nb\nc\nconsole.log(\`1 something\`)`,
    `a\nb\nc\nlog(\`1 something\`)`
  ];
  sources.forEach(source => {
    t.is(fixRowNums(source, { triggerKeywords: ["zzz"] }), source);
    t.is(fixRowNums(source, { triggerKeywords: null }), source);
  });
});
