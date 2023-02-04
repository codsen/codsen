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

test(`01 - single straight quotes - no whitespace`, () => {
  equal(
    fixRowNums(`
zzz
zzz
zzz
${letterC}onsole.log('099 something')
${letterC}onsole.log('1 something')
`).result,
    `
zzz
zzz
zzz
${letterC}onsole.log('005 something')
${letterC}onsole.log('006 something')
`,
    "01.01"
  );
});

test(`02 - single straight quotes - with whitespace`, () => {
  equal(
    fixRowNums(`
zzz
zzz
zzz
${letterC}onsole.log ( ' 099 456 something 123 ')
${letterC}onsole.log('----\n\n\n1 something')
`).result,
    `
zzz
zzz
zzz
${letterC}onsole.log ( ' 005 456 something 123 ')
${letterC}onsole.log('----\n\n\n009 something')
`,
    "02.01"
  );
});

test(`03 - single straight quotes - tight, no semicolon`, () => {
  equal(
    fixRowNums(`
zzz
zzz
zzz
${letterC}onsole.log('099 something')${letterC}onsole.log('1 something')
`).result,
    `
zzz
zzz
zzz
${letterC}onsole.log('005 something')${letterC}onsole.log('005 something')
`,
    "03.01"
  );
});

test(`04 - double quotes - tight`, () => {
  equal(
    fixRowNums(`
zzz
zzz
zzz
${letterC}onsole.log("099 123 something 456")${letterC}onsole.log("----0 something")${letterC}onsole.log("---- something")
`).result,
    `
zzz
zzz
zzz
${letterC}onsole.log("005 123 something 456")${letterC}onsole.log("----005 something")${letterC}onsole.log("---- something")
`,
    "04.01"
  );
});

test(`05 - double quotes - newlines`, () => {
  equal(
    fixRowNums(`
zzz
zzz
zzz
${letterC}onsole.log("099 123 something 456")${letterC}onsole.log("----\n\n\n0 something")
`).result,
    `
zzz
zzz
zzz
${letterC}onsole.log("005 123 something 456")${letterC}onsole.log("----\n\n\n008 something")
`,
    "05.01"
  );
});

test(`06 - double quotes - with whitespace`, () => {
  equal(
    fixRowNums(`
zzz
zzz
zzz
${letterC}onsole.log ( " 099 123 something 456 " )
${letterC}onsole.log("----\n\n\n 0 something")
`).result,
    `
zzz
zzz
zzz
${letterC}onsole.log ( " 005 123 something 456 " )
${letterC}onsole.log("----\n\n\n 009 something")
`,
    "06.01"
  );
});

test(`07 - backticks - tight`, () => {
  equal(
    fixRowNums(`
zzz
zzz
zzz
${letterC}onsole.log(\`099 123 something 456\`)${letterC}onsole.log(\`----0 something\`)${letterC}onsole.log(\`---- something\`)
`).result,
    `
zzz
zzz
zzz
${letterC}onsole.log(\`005 123 something 456\`)${letterC}onsole.log(\`----005 something\`)${letterC}onsole.log(\`---- something\`)
`,
    "07.01"
  );
});

test(`08 - console log with ANSI escapes - one ANSI escape chunk in front`, () => {
  equal(
    fixRowNums("\x63onsole.log(`\\u001b[${33}m${`999 z`}\\u001b[${39}m`)")
      .result,
    "\x63onsole.log(`\\u001b[${33}m${`001 z`}\\u001b[${39}m`)",
    "08.01"
  );
});

test(`09 - synthetic test where colour is put in deeper curlies for easier visual grepping`, () => {
  equal(
    fixRowNums(
      "\x63onsole.log(`\\u001b[${012399999999}m${`888 z`}\\u001b[${39}m`)"
    ).result,
    "\x63onsole.log(`\\u001b[${012399999999}m${`001 z`}\\u001b[${39}m`)",
    "09.01"
  );
});

test(`10 - synthetic test where colour code is put raw`, () => {
  equal(
    fixRowNums(
      "\x63onsole.log(`\\u001b[012399999999m${`888 z`}\\u001b[${39}m`)"
    ).result,
    "\x63onsole.log(`\\u001b[012399999999m${`001 z`}\\u001b[${39}m`)",
    "10.01"
  );
});

test(`11 - bunch of whitespace 1`, () => {
  equal(
    fixRowNums(
      `${letterC}onsole.log(\`\\u001b[$\{012399999999}m$\{\` \t 888 z\`}\\u001b[${39}m\`)`
    ).result,
    `${letterC}onsole.log(\`\\u001b[$\{012399999999}m$\{\` \t 001 z\`}\\u001b[${39}m\`)`,
    `11.01`
  );
});

test(`12 - bunch of whitespace 2`, () => {
  equal(
    fixRowNums(
      `${letterC}onsole.log(\`\\u001b[012399999999m$\{\` \t 888 z\`}\\u001b[${39}m\`)`
    ).result,
    `${letterC}onsole.log(\`\\u001b[012399999999m$\{\` \t 001 z\`}\\u001b[${39}m\`)`,
    `12.01`
  );
});

test(`13 - updates ${letterC}onsole.logs within comment blocks`, () => {
  equal(
    fixRowNums(`
// ${letterC}onsole.log(
//   \`111 something
// \`)
`).result,
    `
// ${letterC}onsole.log(
//   \`003 something
// \`)
`,
    "13.01"
  );
});

test(`14 - \\n in front`, () => {
  equal(
    fixRowNums(`
${letterC}onsole.log(
  \`${BACKSLASH}n111 something\`
)
`).result,
    `
${letterC}onsole.log(
  \`${BACKSLASH}n003 something\`
)
`,
    "14.01"
  );
});

test(`15 - automatic 4 digit padding on >45K chars`, () => {
  equal(
    fixRowNums(`
${`12345\n`.repeat(10000)}
${letterC}onsole.log(
  \`${BACKSLASH}n111 something\`
)
`).result,
    `
${`12345\n`.repeat(10000)}
${letterC}onsole.log(
  \`${BACKSLASH}n10004 something\`
)
`,
    "15.01"
  );
});

test(`16 - num - dot - num`, () => {
  equal(
    fixRowNums(`
zzz
zzz
zzz
${letterC}onsole.log('051.1 something')
${letterC}onsole.log('052.2 something')
`).result,
    `
zzz
zzz
zzz
${letterC}onsole.log('005.1 something')
${letterC}onsole.log('006.2 something')
`,
    "16.01"
  );
});

test(`17 - num - colon - space - num`, () => {
  equal(
    fixRowNums(`
zzz
zzz
zzz
${letterC}onsole.log('051: 1 something')
${letterC}onsole.log('052: 2 something')
`).result,
    `
zzz
zzz
zzz
${letterC}onsole.log('005: 1 something')
${letterC}onsole.log('006: 2 something')
`,
    "17.01"
  );
});

// -----------------------------------------------------------------------------
// group 03. sneaky false positives
// -----------------------------------------------------------------------------

test(`18 - ${`\u001b[${36}m${`false positives`}\u001b[${39}m`} - text that mentions ${letterC}onsole.log`, () => {
  let str =
    "I added a ${letterC}onsole.log (and then added 3 so-called `quotes`).";
  let { result, ranges } = fixRowNums(str);
  equal(result, str, `18.01`);
  equal(ranges, null, `18.02`);
});

test(`19 - ${`\u001b[${36}m${`false positives`}\u001b[${39}m`} - no digits at all`, () => {
  let str = "${letterC}onsole.log(`zzz`)";
  let { result, ranges } = fixRowNums(str);
  equal(result, str, `19.01`);
  equal(ranges, null, `19.02`);
});

test(`20 - ${`\u001b[${36}m${`false positives`}\u001b[${39}m`} - no opening bracket after ${letterC}onsole.log`, () => {
  let str = "${letterC}onsole.log `123`";
  let { result, ranges } = fixRowNums(str);
  equal(result, str, `20.01`);
  equal(ranges, null, `20.02`);
});

test(`21 - ${`\u001b[${36}m${`false positives`}\u001b[${39}m`} - all ASCII symbols`, () => {
  let str = new Array(127).map((val, i) => String.fromCharCode(i)).join(``);
  let { result, ranges } = fixRowNums(str);
  equal(result, str, `21.01`);
  equal(ranges, null, `21.02`);
});

test(`22 - ${`\u001b[${36}m${`false positives`}\u001b[${39}m`} - letter, then digit`, () => {
  let str = `\nconsole.log("a 1")`;
  let { result, ranges } = fixRowNums(str);
  equal(result, str, `22.01`);
  equal(ranges, null, `22.02`);
});

test(`23 - ${`\u001b[${36}m${`false positives`}\u001b[${39}m`} - freak out clauses kick in`, () => {
  let str = `console.log(z)`;
  let { result, ranges } = fixRowNums(str);
  equal(result, str, `23.01`);
  equal(ranges, null, `23.02`);
});

test(`24 - ${`\u001b[${36}m${`false positives`}\u001b[${39}m`} - console.log without brackets`, () => {
  let str = `console.log[]`;
  let { result, ranges } = fixRowNums(str);
  equal(result, str, `24.01`);
  equal(ranges, null, `24.02`);
});

test(`25 - ${`\u001b[${36}m${`false positives`}\u001b[${39}m`} - console.log without brackets`, () => {
  let str = `I used console.log 3 times`;
  let { result, ranges } = fixRowNums(str);
  equal(result, str, `25.01`);
  equal(ranges, null, `25.02`);
});

test(`26 - ${`\u001b[${36}m${`false positives`}\u001b[${39}m`} - console.log without brackets`, () => {
  let str = `I used console.log 3 times`;
  let { result, ranges } = fixRowNums(str, {
    overrideRowNum: 100,
  });
  equal(result, str, `26.01`);
  equal(ranges, null, `26.02`);
});

// -----------------------------------------------------------------------------
// group 04. opts
// -----------------------------------------------------------------------------

test(`27 - padding is set to numbers`, () => {
  let str = `zzz\n${letterC}onsole.log('1 something')`;
  equal(
    fixRowNums(str).result,
    `zzz\n${letterC}onsole.log('002 something')`,
    `27.01`
  );
  equal(
    fixRowNums(str, { padStart: 0 }).result,
    `zzz\n${letterC}onsole.log('2 something')`,
    `27.02`
  );
  equal(
    fixRowNums(str, { padStart: 1 }).result,
    `zzz\n${letterC}onsole.log('2 something')`,
    `27.03`
  );
  equal(
    fixRowNums(str, { padStart: 2 }).result,
    `zzz\n${letterC}onsole.log('02 something')`,
    `27.04`
  );
  equal(
    fixRowNums(str, { padStart: 3 }).result,
    `zzz\n${letterC}onsole.log('002 something')`,
    `27.05`
  );
  equal(
    fixRowNums(str, { padStart: 4 }).result,
    `zzz\n${letterC}onsole.log('0002 something')`,
    `27.06`
  );
  equal(
    fixRowNums(str, { padStart: 9 }).result,
    `zzz\n${letterC}onsole.log('000000002 something')`,
    `27.07`
  );
  equal(
    fixRowNums(str, { padStart: 1 }).result,
    `zzz\n${letterC}onsole.log('2 something')`,
    `27.08`
  );

  // opts.overrideRowNum
  equal(
    fixRowNums(str, { padStart: 9, overrideRowNum: 1 }).result,
    `zzz\n${letterC}onsole.log('000000001 something')`,
    `27.09`
  );
  equal(
    fixRowNums(str, { overrideRowNum: null }).result,
    `zzz\n${letterC}onsole.log('002 something')`,
    `27.10`
  );
});

test(`28 - padding is set to be falsey`, () => {
  let str = `zzz\n${letterC}onsole.log('1 something')`;
  equal(
    fixRowNums(str, { padStart: false }).result,
    `zzz\n${letterC}onsole.log('2 something')`,
    `28.01`
  );
  equal(
    fixRowNums(str, { padStart: null }).result,
    `zzz\n${letterC}onsole.log('2 something')`,
    `28.02`
  );
  equal(
    fixRowNums(str, { padStart: undefined }).result,
    `zzz\n${letterC}onsole.log('2 something')`,
    `28.03`
  );
});

test(`29 - letter then digit`, () => {
  let str = `\nconsole.log("a 1")`;
  equal(
    fixRowNums(str, {
      padStart: 10,
    }).result,
    str,
    `29.01`
  );
});

test(`30 - opts.overrideRowNum`, () => {
  let str = `\nconsole.log("a 1")`;
  equal(
    fixRowNums(str, {
      overrideRowNum: 10,
    }).result,
    str,
    `30.01`
  );
});

test(`31 - opts.extractedLogContentsWereGiven`, () => {
  let str = `\nconsole.log("a 1")`;
  equal(
    fixRowNums(str, {
      extractedLogContentsWereGiven: true,
    }).result,
    str,
    `31.01`
  );
});

test(`32 - opts.extractedLogContentsWereGiven`, () => {
  let str = `\n"a 1"`;
  equal(
    fixRowNums(str, {
      extractedLogContentsWereGiven: true,
    }).result,
    str,
    `32.01`
  );
});

test(`33 - opts.extractedLogContentsWereGiven`, () => {
  let str = `a 1`;
  equal(
    fixRowNums(str, {
      extractedLogContentsWereGiven: true,
    }).result,
    str,
    `33.01`
  );
});

test(`34 - opts.extractedLogContentsWereGiven`, () => {
  let str = "`a 1`";
  equal(
    fixRowNums(str, {
      extractedLogContentsWereGiven: true,
    }).result,
    str,
    `34.01`
  );
});

test(`35 - opts.overrideRowNum and no opts.padStart`, () => {
  let str = "console.log('0 something')";
  equal(
    fixRowNums(str, { padStart: null, overrideRowNum: 0 }).result,
    `console.log('0 something')`,
    `35.01`
  );
});

// -----------------------------------------------------------------------------
// group 05. ad-hoc
// -----------------------------------------------------------------------------

test(`36 - ${`\u001b[${35}m${`ad-hoc`}\u001b[${39}m`} - text that uses \\r only as EOL characters`, () => {
  equal(
    fixRowNums(`zzzz\ryyyy\r${letterC}onsole.log('1 some text')`).result,
    `zzzz\ryyyy\r${letterC}onsole.log('003 some text')`,
    `36.01`
  );
  equal(
    fixRowNums(`zzzz\nyyyy\n${letterC}onsole.log('1 some text')`).result,
    `zzzz\nyyyy\n${letterC}onsole.log('003 some text')`,
    `36.02`
  );
  equal(
    fixRowNums(`zzzz\r\nyyyy\r\n${letterC}onsole.log('1 some text')`).result,
    `zzzz\r\nyyyy\r\n${letterC}onsole.log('003 some text')`,
    `36.03`
  );
});

test(`37 - ${`\u001b[${35}m${`ad-hoc`}\u001b[${39}m`} - broken ANSI - will not update`, () => {
  equal(
    fixRowNums(
      `${letterC}onsole.log(\`${BACKSLASH}u001b[012399999999$\{\` \t 888 z\`}${BACKSLASH}u001b[$\{39}m\`)`
    ).result,
    `${letterC}onsole.log(\`${BACKSLASH}u001b[012399999999$\{\` \t 888 z\`}${BACKSLASH}u001b[$\{39}m\`)`,
    `37.01`
  );
});

test(`38 - ${`\u001b[${35}m${`ad-hoc`}\u001b[${39}m`} - no quotes - no text`, () => {
  equal(
    fixRowNums("1", {
      overrideRowNum: 124,
      extractedLogContentsWereGiven: true,
    }).result,
    "124",
    `38.01`
  );
});

test(`39 - ${`\u001b[${35}m${`ad-hoc`}\u001b[${39}m`} - no quotes - with text`, () => {
  equal(
    fixRowNums("1 something", {
      overrideRowNum: 124,
      extractedLogContentsWereGiven: true,
    }).result,
    "124 something",
    `39.01`
  );
});

test(`40 - ${`\u001b[${35}m${`ad-hoc`}\u001b[${39}m`} - with quotes - no text`, () => {
  equal(
    fixRowNums(`"1"`, {
      overrideRowNum: 124,
      extractedLogContentsWereGiven: true,
    }).result,
    `"124"`,
    `40.01`
  );
});

test(`41 - ${`\u001b[${35}m${`ad-hoc`}\u001b[${39}m`} - with quotes - with text`, () => {
  equal(
    fixRowNums(`"1 something"`, {
      overrideRowNum: 124,
      extractedLogContentsWereGiven: true,
    }).result,
    `"124 something"`,
    `41.01`
  );
});

test(`42 - ${`\u001b[${35}m${`ad-hoc`}\u001b[${39}m`} - with backticks - no text`, () => {
  equal(
    fixRowNums("`1`", {
      overrideRowNum: 124,
      extractedLogContentsWereGiven: true,
    }).result,
    "`124`",
    `42.01`
  );
});

test(`43 - ${`\u001b[${35}m${`ad-hoc`}\u001b[${39}m`} - insurance 1`, () => {
  let source = "\\u001b[${32}m${`z`}\\u001b[${39}m";
  equal(
    fixRowNums(source, {
      overrideRowNum: 124,
      extractedLogContentsWereGiven: true,
    }).result,
    source,
    `43.01`
  );
});

test(`44 - ${`\u001b[${35}m${`ad-hoc`}\u001b[${39}m`} - insurance 2`, () => {
  let source = "some text 1 and more text";
  equal(
    fixRowNums(source, {
      overrideRowNum: 124,
      extractedLogContentsWereGiven: true,
    }).result,
    source,
    `44.01`
  );
});

test(`45 - ${`\u001b[${35}m${`ad-hoc`}\u001b[${39}m`} - extractedLogContentsWereGiven`, () => {
  let source = `${BACKSLASH}u1000`;
  equal(
    fixRowNums(source, {
      extractedLogContentsWereGiven: true,
    }).result,
    source,
    `45.01`
  );
});

// -----------------------------------------------------------------------------
// 06. custom functions via opts.triggerKeywords
// -----------------------------------------------------------------------------

test(`46 - ${`\u001b[${34}m${`opts.triggerKeywords`}\u001b[${39}m`} - baseline`, () => {
  equal(
    fixRowNums(`a\nb\nc\nlog(\`1 something\`)`).result,
    `a\nb\nc\nlog(\`1 something\`)`,
    "46.01"
  );
});

test(`47 - ${`\u001b[${34}m${`opts.triggerKeywords`}\u001b[${39}m`} - works on custom function`, () => {
  equal(
    fixRowNums(`a\nb\nc\nlog(\`1 something\`)`, { triggerKeywords: [`log`] })
      .result,
    `a\nb\nc\nlog(\`004 something\`)`,
    "47.01"
  );
});

test(`48 - ${`\u001b[${34}m${`opts.triggerKeywords`}\u001b[${39}m`} - non-existing log function`, () => {
  let sources = [
    `a\nb\nc\n${letterC}onsole.log(\`1 something\`)`,
    `a\nb\nc\nlog(\`1 something\`)`,
  ];
  sources.forEach((source) => {
    equal(fixRowNums(source, { triggerKeywords: [`zzz`] }).result, source);
    equal(fixRowNums(source, { triggerKeywords: null }).result, source);
  });
});

test.run();
