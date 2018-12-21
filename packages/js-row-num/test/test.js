import test from "ava";
import fixRowNums from "../dist/js-row-num.esm";
import { padStart } from "../dist/util.esm";

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

test("02.01 - single straight quotes", t => {
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
`,
    "02.01.01 - no whitespace"
  );
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
`,
    "02.01.02 - with whitespace"
  );
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
`,
    "02.01.03 - tight, no semicolon"
  );
});

test("02.02 - double quotes", t => {
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
`,
    "02.02.01 - tight"
  );
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
`,
    "02.02.02 - tight"
  );
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
`,
    "02.02.03 - with whitespace"
  );
});

test("02.03 - backticks", t => {
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
    "02.03.01 - tight"
  );
});

test("02.04 - console log with ANSI escapes", t => {
  t.is(
    fixRowNums("console.log(`\\u001b[${33}m${`999 z`}\\u001b[${39}m`)"),
    "console.log(`\\u001b[${33}m${`001 z`}\\u001b[${39}m`)",
    "02.04.01 - one ANSI escape chunk in front"
  );
  t.is(
    fixRowNums(
      "console.log(`\\u001b[${012399999999}m${`888 z`}\\u001b[${39}m`)"
    ),
    "console.log(`\\u001b[${012399999999}m${`001 z`}\\u001b[${39}m`)",
    "02.04.02 - synthetic test where colour is put in deeper curlies for easier visual grepping"
  );
  t.is(
    fixRowNums("console.log(`\\u001b[012399999999m${`888 z`}\\u001b[${39}m`)"),
    "console.log(`\\u001b[012399999999m${`001 z`}\\u001b[${39}m`)",
    "02.04.03 - synthetic test where colour code is put raw"
  );

  // bunch of whitespace
  t.is(
    fixRowNums(
      "console.log(`\\u001b[${012399999999}m${` \t 888 z`}\\u001b[${39}m`)"
    ),
    "console.log(`\\u001b[${012399999999}m${` \t 001 z`}\\u001b[${39}m`)",
    "02.04.04 - synthetic test where colour is put in deeper curlies for easier visual grepping"
  );
  t.is(
    fixRowNums(
      "console.log(`\\u001b[012399999999m${` \t 888 z`}\\u001b[${39}m`)"
    ),
    "console.log(`\\u001b[012399999999m${` \t 001 z`}\\u001b[${39}m`)",
    "02.04.05 - synthetic test where colour code is put raw"
  );
});

test("02.05 - updates console.logs within comment blocks", t => {
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
    "02.05"
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
// group 99. util / padStart
// -----------------------------------------------------------------------------

test(`99.01 - ${`\u001b[${35}m${`util / padStart()`}\u001b[${39}m`} - pads with numbers`, t => {
  t.is(padStart("1", -1, "0"), "1", "99.01.01");
  t.is(padStart("1", 0, "0"), "1", "99.01.02");
  t.is(padStart("1", 1, "0"), "1", "99.01.03");
  t.is(padStart("1", 2, "0"), "01", "99.01.04");
  t.is(padStart("1", 3, "0"), "001", "99.01.05");
  t.is(padStart("1", 4, "0"), "0001", "99.01.06");
  t.is(padStart("1", 5.1, "0"), "00001", "99.01.07");
  t.is(padStart("100", 0, "0"), "100", "99.01.08");
  t.is(padStart("100", 1, "0"), "100", "99.01.09");
  t.is(padStart("100", 2, "0"), "100", "99.01.10");
  t.is(padStart("100", 3, "0"), "100", "99.01.11");
  t.is(padStart("100", 4, "0"), "0100", "99.01.12");

  // input can be numeric as well:
  t.is(padStart(1, -1, "0"), "1", "99.01.13");
  t.is(padStart(1, 0, "0"), "1", "99.01.14");
  t.is(padStart(1, 1, "0"), "1", "99.01.15");
  t.is(padStart(1, 2, "0"), "01", "99.01.16");
  t.is(padStart(1, 3, "0"), "001", "99.01.17");
  t.is(padStart(1, 4, "0"), "0001", "99.01.18");
  t.is(padStart(1, 5.1, "0"), "00001", "99.01.19");
  t.is(padStart(100, 0, "0"), "100", "99.01.20");
  t.is(padStart(100, 1, "0"), "100", "99.01.21");
  t.is(padStart(100, 2, "0"), "100", "99.01.22");
  t.is(padStart(100, 3, "0"), "100", "99.01.23");
  t.is(padStart(100, 4, "0"), "0100", "99.01.24");
});

test(`99.02 - ${`\u001b[${35}m${`util / padStart()`}\u001b[${39}m`} - edge cases`, t => {
  // third arg falsey
  t.is(padStart("1", 3), "  1", "99.02.01");
  t.is(padStart("1", 3, null), "  1", "99.02.02");
  t.is(padStart("1", 3, undefined), "  1", "99.02.03");

  // first arg missing
  t.is(padStart(null, 3, undefined), null, "99.02.04");
  t.is(padStart("", 3, undefined), "   ", "99.02.05");
  t.is(padStart(null, 3, "0"), null, "99.02.06");
  t.is(padStart("", 3, "0"), "000", "99.02.07");
  t.is(padStart(undefined, 3, "0"), undefined, "99.02.08");
  t.is(padStart(true, 3, "0"), true, "99.02.08");
});
