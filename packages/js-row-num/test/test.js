/* eslint-disable no-template-curly-in-string */
import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { fixRowNums } from "../dist/js-row-num.esm.js";

const BACKSLASH = `\u005C`;
// we need to escape to prevent accidental "fixing" of this file through
// build scripts
const letterC = "\x63";

// -----------------------------------------------------------------------------
// group 01. no throws
// -----------------------------------------------------------------------------

test(`01 - wrong input is just being returned`, () => {
  not.throws(() => {
    fixRowNums();
  }, "01.01");
  not.throws(() => {
    fixRowNums(1);
  }, "01.02");
  not.throws(() => {
    fixRowNums(``);
  }, "01.03");
  not.throws(() => {
    fixRowNums(null);
  }, "01.04");
  not.throws(() => {
    fixRowNums(undefined);
  }, "01.05");
  not.throws(() => {
    fixRowNums(true);
  }, "01.06");
  not.throws(() => {
    fixRowNums({});
  }, "01.07");
});

// -----------------------------------------------------------------------------
// 02. normal use
// -----------------------------------------------------------------------------

test(`02 - single straight quotes - no whitespace`, () => {
  is(
    fixRowNums(`
zzz
zzz
zzz
${letterC}onsole.log('099 something')
${letterC}onsole.log('1 something')
`),
    `
zzz
zzz
zzz
${letterC}onsole.log('005 something')
${letterC}onsole.log('006 something')
`,
    "02"
  );
});

test(`03 - single straight quotes - with whitespace`, () => {
  is(
    fixRowNums(`
zzz
zzz
zzz
${letterC}onsole.log ( ' 099 456 something 123 ')
${letterC}onsole.log('----\n\n\n1 something')
`),
    `
zzz
zzz
zzz
${letterC}onsole.log ( ' 005 456 something 123 ')
${letterC}onsole.log('----\n\n\n009 something')
`,
    "03"
  );
});

test(`04 - single straight quotes - tight, no semicolon`, () => {
  is(
    fixRowNums(`
zzz
zzz
zzz
${letterC}onsole.log('099 something')${letterC}onsole.log('1 something')
`),
    `
zzz
zzz
zzz
${letterC}onsole.log('005 something')${letterC}onsole.log('005 something')
`,
    "04"
  );
});

test(`05 - double quotes - tight`, () => {
  is(
    fixRowNums(`
zzz
zzz
zzz
${letterC}onsole.log("099 123 something 456")${letterC}onsole.log("----0 something")${letterC}onsole.log("---- something")
`),
    `
zzz
zzz
zzz
${letterC}onsole.log("005 123 something 456")${letterC}onsole.log("----005 something")${letterC}onsole.log("---- something")
`,
    "05"
  );
});

test(`06 - double quotes - newlines`, () => {
  is(
    fixRowNums(`
zzz
zzz
zzz
${letterC}onsole.log("099 123 something 456")${letterC}onsole.log("----\n\n\n0 something")
`),
    `
zzz
zzz
zzz
${letterC}onsole.log("005 123 something 456")${letterC}onsole.log("----\n\n\n008 something")
`,
    "06"
  );
});

test(`07 - double quotes - with whitespace`, () => {
  is(
    fixRowNums(`
zzz
zzz
zzz
${letterC}onsole.log ( " 099 123 something 456 " )
${letterC}onsole.log("----\n\n\n 0 something")
`),
    `
zzz
zzz
zzz
${letterC}onsole.log ( " 005 123 something 456 " )
${letterC}onsole.log("----\n\n\n 009 something")
`,
    "07"
  );
});

test(`08 - backticks - tight`, () => {
  is(
    fixRowNums(`
zzz
zzz
zzz
${letterC}onsole.log(\`099 123 something 456\`)${letterC}onsole.log(\`----0 something\`)${letterC}onsole.log(\`---- something\`)
`),
    `
zzz
zzz
zzz
${letterC}onsole.log(\`005 123 something 456\`)${letterC}onsole.log(\`----005 something\`)${letterC}onsole.log(\`---- something\`)
`,
    "08"
  );
});

test(`09 - console log with ANSI escapes - one ANSI escape chunk in front`, () => {
  is(
    fixRowNums("\x63onsole.log(`\\u001b[${33}m${`999 z`}\\u001b[${39}m`)"),
    "\x63onsole.log(`\\u001b[${33}m${`001 z`}\\u001b[${39}m`)",
    "09"
  );
});

test(`10 - synthetic test where colour is put in deeper curlies for easier visual grepping`, () => {
  is(
    fixRowNums(
      "\x63onsole.log(`\\u001b[${012399999999}m${`888 z`}\\u001b[${39}m`)"
    ),
    "\x63onsole.log(`\\u001b[${012399999999}m${`001 z`}\\u001b[${39}m`)",
    "10"
  );
});

test(`11 - synthetic test where colour code is put raw`, () => {
  is(
    fixRowNums(
      "\x63onsole.log(`\\u001b[012399999999m${`888 z`}\\u001b[${39}m`)"
    ),
    "\x63onsole.log(`\\u001b[012399999999m${`001 z`}\\u001b[${39}m`)",
    "11"
  );
});

test(`12 - bunch of whitespace 1`, () => {
  is(
    fixRowNums(
      `${letterC}onsole.log(\`\\u001b[$\{012399999999}m$\{\` \t 888 z\`}\\u001b[${39}m\`)`
    ),
    `${letterC}onsole.log(\`\\u001b[$\{012399999999}m$\{\` \t 001 z\`}\\u001b[${39}m\`)`,
    `12 - synthetic test where colour is put in deeper curlies for easier visual grepping`
  );
});

test(`13 - bunch of whitespace 2`, () => {
  is(
    fixRowNums(
      `${letterC}onsole.log(\`\\u001b[012399999999m$\{\` \t 888 z\`}\\u001b[${39}m\`)`
    ),
    `${letterC}onsole.log(\`\\u001b[012399999999m$\{\` \t 001 z\`}\\u001b[${39}m\`)`,
    `13 - synthetic test where colour code is put raw`
  );
});

test(`14 - updates ${letterC}onsole.logs within comment blocks`, () => {
  is(
    fixRowNums(`
// ${letterC}onsole.log(
//   \`111 something
// \`)
`),
    `
// ${letterC}onsole.log(
//   \`003 something
// \`)
`,
    "14"
  );
});

test(`15 - \\n in front`, () => {
  is(
    fixRowNums(`
${letterC}onsole.log(
  \`${BACKSLASH}n111 something\`
)
`),
    `
${letterC}onsole.log(
  \`${BACKSLASH}n003 something\`
)
`,
    "15"
  );
});

test(`16 - automatic 4 digit padding on >45K chars`, () => {
  is(
    fixRowNums(`
${`12345\n`.repeat(10000)}
${letterC}onsole.log(
  \`${BACKSLASH}n111 something\`
)
`),
    `
${`12345\n`.repeat(10000)}
${letterC}onsole.log(
  \`${BACKSLASH}n10004 something\`
)
`,
    "16"
  );
});

test(`17 - num - dot - num`, () => {
  is(
    fixRowNums(`
zzz
zzz
zzz
${letterC}onsole.log('051.1 something')
${letterC}onsole.log('052.2 something')
`),
    `
zzz
zzz
zzz
${letterC}onsole.log('005.1 something')
${letterC}onsole.log('006.2 something')
`,
    "17"
  );
});

test(`18 - num - colon - space - num`, () => {
  is(
    fixRowNums(`
zzz
zzz
zzz
${letterC}onsole.log('051: 1 something')
${letterC}onsole.log('052: 2 something')
`),
    `
zzz
zzz
zzz
${letterC}onsole.log('005: 1 something')
${letterC}onsole.log('006: 2 something')
`,
    "18"
  );
});

// -----------------------------------------------------------------------------
// group 03. sneaky false positives
// -----------------------------------------------------------------------------

test(`19 - ${`\u001b[${36}m${`false positives`}\u001b[${39}m`} - text that mentions ${letterC}onsole.log`, () => {
  let str =
    "I added a ${letterC}onsole.log (and then added 3 so-called `quotes`).";
  is(fixRowNums(str), str, `19`);
});

test(`20 - ${`\u001b[${36}m${`false positives`}\u001b[${39}m`} - no digits at all`, () => {
  let str = "${letterC}onsole.log(`zzz`)";
  is(fixRowNums(str), str, `20`);
});

test(`21 - ${`\u001b[${36}m${`false positives`}\u001b[${39}m`} - no opening bracket after ${letterC}onsole.log`, () => {
  let str = "${letterC}onsole.log `123`";
  is(fixRowNums(str), str, `21`);
});

test(`22 - ${`\u001b[${36}m${`false positives`}\u001b[${39}m`} - all ASCII symbols`, () => {
  let allAscii = new Array(127);
  allAscii = allAscii.map((val, i) => String.fromCharCode(i)).join(``);
  is(fixRowNums(allAscii), allAscii, `22`);
});

test(`23 - ${`\u001b[${36}m${`false positives`}\u001b[${39}m`} - letter, then digit`, () => {
  let str = `\nconsole.log("a 1")`;
  is(fixRowNums(str), str, `23`);
});

test(`24 - ${`\u001b[${36}m${`false positives`}\u001b[${39}m`} - freak out clauses kick in`, () => {
  let str = `console.log(z)`;
  is(fixRowNums(str), str, `24`);
});

test(`25 - ${`\u001b[${36}m${`false positives`}\u001b[${39}m`} - console.log without brackets`, () => {
  let str = `console.log[]`;
  is(fixRowNums(str), str, `25`);
});

test(`26 - ${`\u001b[${36}m${`false positives`}\u001b[${39}m`} - console.log without brackets`, () => {
  let str = `I used console.log 3 times`;
  is(fixRowNums(str), str, `26`);
});

test(`27 - ${`\u001b[${36}m${`false positives`}\u001b[${39}m`} - console.log without brackets`, () => {
  let str = `I used console.log 3 times`;
  is(
    fixRowNums(str, {
      overrideRowNum: 100,
    }),
    str,
    `27`
  );
});

// -----------------------------------------------------------------------------
// group 04. opts
// -----------------------------------------------------------------------------

test(`28 - ${`\u001b[${33}m${`opts`}\u001b[${39}m`} - padding is set to numbers`, () => {
  let str = `zzz\n${letterC}onsole.log('1 something')`;
  is(
    fixRowNums(str),
    `zzz\n${letterC}onsole.log('002 something')`,
    `28.01 - control - default is three`
  );
  is(
    fixRowNums(str, { padStart: 0 }),
    `zzz\n${letterC}onsole.log('2 something')`,
    `28.02`
  );
  is(
    fixRowNums(str, { padStart: 1 }),
    `zzz\n${letterC}onsole.log('2 something')`,
    `28.03`
  );
  is(
    fixRowNums(str, { padStart: 2 }),
    `zzz\n${letterC}onsole.log('02 something')`,
    `28.04`
  );
  is(
    fixRowNums(str, { padStart: 3 }),
    `zzz\n${letterC}onsole.log('002 something')`,
    `28.05`
  );
  is(
    fixRowNums(str, { padStart: 4 }),
    `zzz\n${letterC}onsole.log('0002 something')`,
    `28.06`
  );
  is(
    fixRowNums(str, { padStart: 9 }),
    `zzz\n${letterC}onsole.log('000000002 something')`,
    `28.07`
  );
  is(
    fixRowNums(str, { padStart: 1 }),
    `zzz\n${letterC}onsole.log('2 something')`,
    `28.08 - negative numbers are ignored, default (3) is used`
  );

  // opts.overrideRowNum
  is(
    fixRowNums(str, { padStart: 9, overrideRowNum: 1 }),
    `zzz\n${letterC}onsole.log('000000001 something')`,
    `28.09`
  );
  is(
    fixRowNums(str, { overrideRowNum: null }),
    `zzz\n${letterC}onsole.log('002 something')`,
    `28.10`
  );
});

test(`29 - ${`\u001b[${33}m${`opts`}\u001b[${39}m`} - padding is set to be falsey`, () => {
  let str = `zzz\n${letterC}onsole.log('1 something')`;
  is(
    fixRowNums(str, { padStart: false }),
    `zzz\n${letterC}onsole.log('2 something')`,
    `29.01`
  );
  is(
    fixRowNums(str, { padStart: null }),
    `zzz\n${letterC}onsole.log('2 something')`,
    `29.02`
  );
  is(
    fixRowNums(str, { padStart: undefined }),
    `zzz\n${letterC}onsole.log('2 something')`,
    `29.03`
  );
});

test(`30 - ${`\u001b[${33}m${`opts`}\u001b[${39}m`} - letter then digit`, () => {
  let str = `\nconsole.log("a 1")`;
  is(
    fixRowNums(str, {
      padStart: 10,
    }),
    str,
    `30`
  );
});

test(`31 - ${`\u001b[${33}m${`opts`}\u001b[${39}m`} - opts.overrideRowNum`, () => {
  let str = `\nconsole.log("a 1")`;
  is(
    fixRowNums(str, {
      overrideRowNum: 10,
    }),
    str,
    `31`
  );
});

test(`32 - ${`\u001b[${33}m${`opts`}\u001b[${39}m`} - opts.returnRangesOnly`, () => {
  let str = `\nconsole.log("a 1")`;
  is(
    fixRowNums(str, {
      returnRangesOnly: true,
    }),
    null,
    `32`
  );
});

test(`33 - ${`\u001b[${33}m${`opts`}\u001b[${39}m`} - opts.returnRangesOnly +`, () => {
  let str = `\nconsole.log("a 1")`;
  is(
    fixRowNums(str, {
      padStart: 9,
      returnRangesOnly: true,
    }),
    null,
    `33`
  );
});

test(`34 - ${`\u001b[${33}m${`opts`}\u001b[${39}m`} - opts.extractedLogContentsWereGiven`, () => {
  let str = `\nconsole.log("a 1")`;
  is(
    fixRowNums(str, {
      extractedLogContentsWereGiven: true,
    }),
    str,
    `34`
  );
});

test(`35 - ${`\u001b[${33}m${`opts`}\u001b[${39}m`} - opts.extractedLogContentsWereGiven`, () => {
  let str = `\n"a 1"`;
  is(
    fixRowNums(str, {
      extractedLogContentsWereGiven: true,
    }),
    str,
    `35`
  );
});

test(`36 - ${`\u001b[${33}m${`opts`}\u001b[${39}m`} - opts.extractedLogContentsWereGiven`, () => {
  let str = `a 1`;
  is(
    fixRowNums(str, {
      extractedLogContentsWereGiven: true,
    }),
    str,
    `36`
  );
});

test(`37 - ${`\u001b[${33}m${`opts`}\u001b[${39}m`} - opts.extractedLogContentsWereGiven`, () => {
  let str = "`a 1`";
  is(
    fixRowNums(str, {
      extractedLogContentsWereGiven: true,
    }),
    str,
    `37`
  );
});

test(`38 - ${`\u001b[${33}m${`opts`}\u001b[${39}m`} - opts.overrideRowNum and no opts.padStart`, () => {
  let str = "console.log('0 something')";
  is(
    fixRowNums(str, { padStart: null, overrideRowNum: 0 }),
    `console.log('0 something')`,
    `38`
  );
});

// -----------------------------------------------------------------------------
// group 05. ad-hoc
// -----------------------------------------------------------------------------

test(`39 - ${`\u001b[${35}m${`ad-hoc`}\u001b[${39}m`} - text that uses \\r only as EOL characters`, () => {
  is(
    fixRowNums(`zzzz\ryyyy\r${letterC}onsole.log('1 some text')`),
    `zzzz\ryyyy\r${letterC}onsole.log('003 some text')`,
    `39.01`
  );
  is(
    fixRowNums(`zzzz\nyyyy\n${letterC}onsole.log('1 some text')`),
    `zzzz\nyyyy\n${letterC}onsole.log('003 some text')`,
    `39.02`
  );
  is(
    fixRowNums(`zzzz\r\nyyyy\r\n${letterC}onsole.log('1 some text')`),
    `zzzz\r\nyyyy\r\n${letterC}onsole.log('003 some text')`,
    `39.03`
  );
});

test(`40 - ${`\u001b[${35}m${`ad-hoc`}\u001b[${39}m`} - broken ANSI - will not update`, () => {
  is(
    fixRowNums(
      `${letterC}onsole.log(\`${BACKSLASH}u001b[012399999999$\{\` \t 888 z\`}${BACKSLASH}u001b[$\{39}m\`)`
    ),
    `${letterC}onsole.log(\`${BACKSLASH}u001b[012399999999$\{\` \t 888 z\`}${BACKSLASH}u001b[$\{39}m\`)`,
    `40 - ANSI opening sequence's m is missing`
  );
});

test(`41 - ${`\u001b[${35}m${`ad-hoc`}\u001b[${39}m`} - no quotes - no text`, () => {
  is(
    fixRowNums("1", {
      overrideRowNum: 124,
      returnRangesOnly: false,
      extractedLogContentsWereGiven: true,
    }),
    "124",
    `41`
  );
});

test(`42 - ${`\u001b[${35}m${`ad-hoc`}\u001b[${39}m`} - no quotes - no text`, () => {
  equal(
    fixRowNums("1", {
      overrideRowNum: 124,
      returnRangesOnly: true,
      extractedLogContentsWereGiven: true,
    }),
    [[0, 1, "124"]],
    `42`
  );
});

test(`43 - ${`\u001b[${35}m${`ad-hoc`}\u001b[${39}m`} - no quotes - with text`, () => {
  is(
    fixRowNums("1 something", {
      overrideRowNum: 124,
      returnRangesOnly: false,
      extractedLogContentsWereGiven: true,
    }),
    "124 something",
    `43`
  );
});

test(`44 - ${`\u001b[${35}m${`ad-hoc`}\u001b[${39}m`} - no quotes - with text`, () => {
  equal(
    fixRowNums("1 something", {
      overrideRowNum: 124,
      returnRangesOnly: true,
      extractedLogContentsWereGiven: true,
    }),
    [[0, 1, "124"]],
    `44`
  );
});

test(`45 - ${`\u001b[${35}m${`ad-hoc`}\u001b[${39}m`} - with quotes - no text`, () => {
  is(
    fixRowNums(`"1"`, {
      overrideRowNum: 124,
      returnRangesOnly: false,
      extractedLogContentsWereGiven: true,
    }),
    `"124"`,
    `45`
  );
});

test(`46 - ${`\u001b[${35}m${`ad-hoc`}\u001b[${39}m`} - with quotes - no text, override rownum is number`, () => {
  equal(
    fixRowNums(`"1"`, {
      overrideRowNum: 124,
      returnRangesOnly: true,
      extractedLogContentsWereGiven: true,
    }),
    [[1, 2, "124"]],
    `46`
  );
});

test(`47 - ${`\u001b[${35}m${`ad-hoc`}\u001b[${39}m`} - with quotes - no text, override rownum is text`, () => {
  equal(
    fixRowNums(`"1"`, {
      overrideRowNum: "124", // <----- text, not number
      returnRangesOnly: true,
      extractedLogContentsWereGiven: true,
    }),
    [[1, 2, "124"]],
    `47`
  );
});

test(`48 - ${`\u001b[${35}m${`ad-hoc`}\u001b[${39}m`} - with quotes - with text`, () => {
  is(
    fixRowNums(`"1 something"`, {
      overrideRowNum: 124,
      returnRangesOnly: false,
      extractedLogContentsWereGiven: true,
    }),
    `"124 something"`,
    `48`
  );
});

test(`49 - ${`\u001b[${35}m${`ad-hoc`}\u001b[${39}m`} - with quotes - with text`, () => {
  equal(
    fixRowNums(`"1 something"`, {
      overrideRowNum: 124,
      returnRangesOnly: true,
      extractedLogContentsWereGiven: true,
    }),
    [[1, 2, "124"]],
    `49`
  );
});

test(`50 - ${`\u001b[${35}m${`ad-hoc`}\u001b[${39}m`} - with backticks - no text`, () => {
  is(
    fixRowNums("`1`", {
      overrideRowNum: 124,
      returnRangesOnly: false,
      extractedLogContentsWereGiven: true,
    }),
    "`124`",
    `50`
  );
});

test(`51 - ${`\u001b[${35}m${`ad-hoc`}\u001b[${39}m`} - with backticks - no text, override rownum is number`, () => {
  equal(
    fixRowNums("`1`", {
      overrideRowNum: 124,
      returnRangesOnly: true,
      extractedLogContentsWereGiven: true,
    }),
    [[1, 2, "124"]],
    `51`
  );
});

test(`52 - ${`\u001b[${35}m${`ad-hoc`}\u001b[${39}m`} - only number, with surrounding whitespace`, () => {
  equal(
    fixRowNums("\n1\n", {
      overrideRowNum: 124,
      returnRangesOnly: true,
      extractedLogContentsWereGiven: true,
    }),
    [[1, 2, "124"]],
    `52`
  );
});

test(`53 - ${`\u001b[${35}m${`ad-hoc`}\u001b[${39}m`} - insurance 1`, () => {
  let source = "\\u001b[${32}m${`z`}\\u001b[${39}m";
  equal(
    fixRowNums(source, {
      overrideRowNum: 124,
      returnRangesOnly: false,
      extractedLogContentsWereGiven: true,
    }),
    source,
    `53`
  );
});

test(`54 - ${`\u001b[${35}m${`ad-hoc`}\u001b[${39}m`} - insurance 2`, () => {
  let source = "some text 1 and more text";
  equal(
    fixRowNums(source, {
      overrideRowNum: 124,
      returnRangesOnly: false,
      extractedLogContentsWereGiven: true,
    }),
    source,
    `54`
  );
});

test(`55 - ${`\u001b[${35}m${`ad-hoc`}\u001b[${39}m`} - extractedLogContentsWereGiven`, () => {
  let source = `${BACKSLASH}u1000`;
  equal(
    fixRowNums(source, {
      extractedLogContentsWereGiven: true,
    }),
    source,
    `55`
  );
});

// -----------------------------------------------------------------------------
// 06. custom functions via opts.triggerKeywords
// -----------------------------------------------------------------------------

test(`56 - ${`\u001b[${34}m${`opts.triggerKeywords`}\u001b[${39}m`} - baseline`, () => {
  is(
    fixRowNums(`a\nb\nc\nlog(\`1 something\`)`),
    `a\nb\nc\nlog(\`1 something\`)`,
    "56"
  );
});

test(`57 - ${`\u001b[${34}m${`opts.triggerKeywords`}\u001b[${39}m`} - works on custom function`, () => {
  is(
    fixRowNums(`a\nb\nc\nlog(\`1 something\`)`, { triggerKeywords: [`log`] }),
    `a\nb\nc\nlog(\`004 something\`)`,
    "57"
  );
});

test(`58 - ${`\u001b[${34}m${`opts.triggerKeywords`}\u001b[${39}m`} - non-existing log function`, () => {
  let sources = [
    `a\nb\nc\n${letterC}onsole.log(\`1 something\`)`,
    `a\nb\nc\nlog(\`1 something\`)`,
  ];
  sources.forEach((source) => {
    is(fixRowNums(source, { triggerKeywords: [`zzz`] }), source);
    is(fixRowNums(source, { triggerKeywords: null }), source);
  });
});

test.run();
