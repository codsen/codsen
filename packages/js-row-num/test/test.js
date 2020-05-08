/* eslint no-template-curly-in-string: 0 */

import tap from "tap";
import fixRowNums from "../dist/js-row-num.esm";

const BACKSLASH = `\u005C`;
// we need to escape to prevent accidental "fixing" of this file through
// build scripts
const letterC = "\x63";

// -----------------------------------------------------------------------------
// group 01. no throws
// -----------------------------------------------------------------------------

tap.test(`01 - wrong input is just being returned`, (t) => {
  t.doesNotThrow(() => {
    fixRowNums();
  }, "01.01");
  t.doesNotThrow(() => {
    fixRowNums(1);
  }, "01.02");
  t.doesNotThrow(() => {
    fixRowNums(``);
  }, "01.03");
  t.doesNotThrow(() => {
    fixRowNums(null);
  }, "01.04");
  t.doesNotThrow(() => {
    fixRowNums(undefined);
  }, "01.05");
  t.doesNotThrow(() => {
    fixRowNums(true);
  }, "01.06");
  t.doesNotThrow(() => {
    fixRowNums({});
  }, "01.07");
  t.end();
});

// -----------------------------------------------------------------------------
// 02. normal use
// -----------------------------------------------------------------------------

tap.test(`02 - single straight quotes - no whitespace`, (t) => {
  t.is(
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
  t.end();
});

tap.test(`03 - single straight quotes - with whitespace`, (t) => {
  t.is(
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
  t.end();
});

tap.test(`04 - single straight quotes - tight, no semicolon`, (t) => {
  t.is(
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
  t.end();
});

tap.test(`05 - double quotes - tight`, (t) => {
  t.is(
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
  t.end();
});

tap.test(`06 - double quotes - newlines`, (t) => {
  t.is(
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
  t.end();
});

tap.test(`07 - double quotes - with whitespace`, (t) => {
  t.is(
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
  t.end();
});

tap.test(`08 - backticks - tight`, (t) => {
  t.is(
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
  t.end();
});

tap.test(
  `09 - console log with ANSI escapes - one ANSI escape chunk in front`,
  (t) => {
    t.is(
      fixRowNums("\x63onsole.log(`\\u001b[${33}m${`999 z`}\\u001b[${39}m`)"),
      "\x63onsole.log(`\\u001b[${33}m${`001 z`}\\u001b[${39}m`)",
      "09"
    );
    t.end();
  }
);

tap.test(
  `10 - synthetic test where colour is put in deeper curlies for easier visual grepping`,
  (t) => {
    t.is(
      fixRowNums(
        "\x63onsole.log(`\\u001b[${012399999999}m${`888 z`}\\u001b[${39}m`)"
      ),
      "\x63onsole.log(`\\u001b[${012399999999}m${`001 z`}\\u001b[${39}m`)",
      "10"
    );
    t.end();
  }
);

tap.test(`11 - synthetic test where colour code is put raw`, (t) => {
  t.is(
    fixRowNums(
      "\x63onsole.log(`\\u001b[012399999999m${`888 z`}\\u001b[${39}m`)"
    ),
    "\x63onsole.log(`\\u001b[012399999999m${`001 z`}\\u001b[${39}m`)",
    "11"
  );
  t.end();
});

tap.test(`12 - bunch of whitespace 1`, (t) => {
  t.is(
    fixRowNums(
      `${letterC}onsole.log(\`\\u001b[$\{012399999999}m$\{\` \t 888 z\`}\\u001b[${39}m\`)`
    ),
    `${letterC}onsole.log(\`\\u001b[$\{012399999999}m$\{\` \t 001 z\`}\\u001b[${39}m\`)`,
    `12 - synthetic test where colour is put in deeper curlies for easier visual grepping`
  );
  t.end();
});

tap.test(`13 - bunch of whitespace 2`, (t) => {
  t.is(
    fixRowNums(
      `${letterC}onsole.log(\`\\u001b[012399999999m$\{\` \t 888 z\`}\\u001b[${39}m\`)`
    ),
    `${letterC}onsole.log(\`\\u001b[012399999999m$\{\` \t 001 z\`}\\u001b[${39}m\`)`,
    `13 - synthetic test where colour code is put raw`
  );
  t.end();
});

tap.test(`14 - updates ${letterC}onsole.logs within comment blocks`, (t) => {
  t.is(
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
  t.end();
});

tap.test(`15 - \\n in front`, (t) => {
  t.is(
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
  t.end();
});

tap.test(`16 - automatic 4 digit padding on >45K chars`, (t) => {
  t.is(
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
  t.end();
});

tap.test(`17 - num - dot - num`, (t) => {
  t.is(
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
  t.end();
});

tap.test(`18 - num - colon - space - num`, (t) => {
  t.is(
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
  t.end();
});

// -----------------------------------------------------------------------------
// group 03. sneaky false positives
// -----------------------------------------------------------------------------

tap.test(
  `19 - ${`\u001b[${36}m${`false positives`}\u001b[${39}m`} - text that mentions ${letterC}onsole.log`,
  (t) => {
    const str =
      "I added a ${letterC}onsole.log (and then added 3 so-called `quotes`).";
    t.is(fixRowNums(str), str, `19`);
    t.end();
  }
);

tap.test(
  `20 - ${`\u001b[${36}m${`false positives`}\u001b[${39}m`} - no digits at all`,
  (t) => {
    const str = "${letterC}onsole.log(`zzz`)";
    t.is(fixRowNums(str), str, `20`);
    t.end();
  }
);

tap.test(
  `21 - ${`\u001b[${36}m${`false positives`}\u001b[${39}m`} - no opening bracket after ${letterC}onsole.log`,
  (t) => {
    const str = "${letterC}onsole.log `123`";
    t.is(fixRowNums(str), str, `21`);
    t.end();
  }
);

tap.test(
  `22 - ${`\u001b[${36}m${`false positives`}\u001b[${39}m`} - all ASCII symbols`,
  (t) => {
    let allAscii = new Array(127);
    allAscii = allAscii.map((val, i) => String.fromCharCode(i)).join(``);
    t.is(fixRowNums(allAscii), allAscii, `22.01`);
    t.end();
  }
);

tap.test(
  `23 - ${`\u001b[${36}m${`false positives`}\u001b[${39}m`} - letter, then digit`,
  (t) => {
    const str = `\nconsole.log("a 1")`;
    t.is(fixRowNums(str), str, `23`);
    t.end();
  }
);

tap.test(
  `24 - ${`\u001b[${36}m${`false positives`}\u001b[${39}m`} - freak out clauses kick in`,
  (t) => {
    const str = `console.log(z)`;
    t.is(fixRowNums(str), str, `24`);
    t.end();
  }
);

tap.test(
  `25 - ${`\u001b[${36}m${`false positives`}\u001b[${39}m`} - console.log without brackets`,
  (t) => {
    const str = `console.log[]`;
    t.is(fixRowNums(str), str, `25`);
    t.end();
  }
);

tap.test(
  `26 - ${`\u001b[${36}m${`false positives`}\u001b[${39}m`} - console.log without brackets`,
  (t) => {
    const str = `I used console.log 3 times`;
    t.is(fixRowNums(str), str, `26`);
    t.end();
  }
);

tap.test(
  `27 - ${`\u001b[${36}m${`false positives`}\u001b[${39}m`} - console.log without brackets`,
  (t) => {
    const str = `I used console.log 3 times`;
    t.is(
      fixRowNums(str, {
        overrideRowNum: 100,
      }),
      str,
      `27`
    );
    t.end();
  }
);

// -----------------------------------------------------------------------------
// group 04. opts
// -----------------------------------------------------------------------------

tap.test(
  `28 - ${`\u001b[${33}m${`opts`}\u001b[${39}m`} - padding is set to numbers`,
  (t) => {
    const str = `zzz\n${letterC}onsole.log('1 something')`;
    t.is(
      fixRowNums(str),
      `zzz\n${letterC}onsole.log('002 something')`,
      `28.01 - control - default is three`
    );
    t.is(
      fixRowNums(str, { padStart: 0 }),
      `zzz\n${letterC}onsole.log('2 something')`,
      `28.02`
    );
    t.is(
      fixRowNums(str, { padStart: 1 }),
      `zzz\n${letterC}onsole.log('2 something')`,
      `28.03`
    );
    t.is(
      fixRowNums(str, { padStart: 2 }),
      `zzz\n${letterC}onsole.log('02 something')`,
      `28.04`
    );
    t.is(
      fixRowNums(str, { padStart: 3 }),
      `zzz\n${letterC}onsole.log('002 something')`,
      `28.05`
    );
    t.is(
      fixRowNums(str, { padStart: 4 }),
      `zzz\n${letterC}onsole.log('0002 something')`,
      `28.06`
    );
    t.is(
      fixRowNums(str, { padStart: 9 }),
      `zzz\n${letterC}onsole.log('000000002 something')`,
      `28.07`
    );
    t.is(
      fixRowNums(str, { padStart: 1 }),
      `zzz\n${letterC}onsole.log('2 something')`,
      `28.08 - negative numbers are ignored, default (3) is used`
    );

    // opts.overrideRowNum
    t.is(
      fixRowNums(str, { padStart: 9, overrideRowNum: 1 }),
      `zzz\n${letterC}onsole.log('000000001 something')`,
      `28.09`
    );
    t.is(
      fixRowNums(str, { overrideRowNum: null }),
      `zzz\n${letterC}onsole.log('002 something')`,
      `28.10`
    );
    t.end();
  }
);

tap.test(
  `29 - ${`\u001b[${33}m${`opts`}\u001b[${39}m`} - padding is set to be falsey`,
  (t) => {
    const str = `zzz\n${letterC}onsole.log('1 something')`;
    t.is(
      fixRowNums(str, { padStart: false }),
      `zzz\n${letterC}onsole.log('2 something')`,
      `29.01`
    );
    t.is(
      fixRowNums(str, { padStart: null }),
      `zzz\n${letterC}onsole.log('2 something')`,
      `29.02`
    );
    t.is(
      fixRowNums(str, { padStart: undefined }),
      `zzz\n${letterC}onsole.log('2 something')`,
      `29.03`
    );
    t.end();
  }
);

tap.test(
  `30 - ${`\u001b[${33}m${`opts`}\u001b[${39}m`} - letter then digit`,
  (t) => {
    const str = `\nconsole.log("a 1")`;
    t.is(
      fixRowNums(str, {
        padStart: 10,
      }),
      str,
      `30`
    );
    t.end();
  }
);

tap.test(
  `31 - ${`\u001b[${33}m${`opts`}\u001b[${39}m`} - opts.overrideRowNum`,
  (t) => {
    const str = `\nconsole.log("a 1")`;
    t.is(
      fixRowNums(str, {
        overrideRowNum: 10,
      }),
      str,
      `31`
    );
    t.end();
  }
);

tap.test(
  `32 - ${`\u001b[${33}m${`opts`}\u001b[${39}m`} - opts.returnRangesOnly`,
  (t) => {
    const str = `\nconsole.log("a 1")`;
    t.is(
      fixRowNums(str, {
        returnRangesOnly: true,
      }),
      null,
      `32`
    );
    t.end();
  }
);

tap.test(
  `33 - ${`\u001b[${33}m${`opts`}\u001b[${39}m`} - opts.returnRangesOnly +`,
  (t) => {
    const str = `\nconsole.log("a 1")`;
    t.is(
      fixRowNums(str, {
        padStart: 9,
        returnRangesOnly: true,
      }),
      null,
      `33`
    );
    t.end();
  }
);

tap.test(
  `34 - ${`\u001b[${33}m${`opts`}\u001b[${39}m`} - opts.extractedLogContentsWereGiven`,
  (t) => {
    const str = `\nconsole.log("a 1")`;
    t.is(
      fixRowNums(str, {
        extractedLogContentsWereGiven: true,
      }),
      str,
      `34`
    );
    t.end();
  }
);

tap.test(
  `35 - ${`\u001b[${33}m${`opts`}\u001b[${39}m`} - opts.extractedLogContentsWereGiven`,
  (t) => {
    const str = `\n"a 1"`;
    t.is(
      fixRowNums(str, {
        extractedLogContentsWereGiven: true,
      }),
      str,
      `35`
    );
    t.end();
  }
);

tap.test(
  `36 - ${`\u001b[${33}m${`opts`}\u001b[${39}m`} - opts.extractedLogContentsWereGiven`,
  (t) => {
    const str = `a 1`;
    t.is(
      fixRowNums(str, {
        extractedLogContentsWereGiven: true,
      }),
      str,
      `36`
    );
    t.end();
  }
);

tap.test(
  `37 - ${`\u001b[${33}m${`opts`}\u001b[${39}m`} - opts.extractedLogContentsWereGiven`,
  (t) => {
    const str = "`a 1`";
    t.is(
      fixRowNums(str, {
        extractedLogContentsWereGiven: true,
      }),
      str,
      `37`
    );
    t.end();
  }
);

tap.test(
  `38 - ${`\u001b[${33}m${`opts`}\u001b[${39}m`} - opts.overrideRowNum and no opts.padStart`,
  (t) => {
    const str = "console.log('0 something')";
    t.is(
      fixRowNums(str, { padStart: null, overrideRowNum: 0 }),
      `console.log('0 something')`,
      `38`
    );
    t.end();
  }
);

// -----------------------------------------------------------------------------
// group 05. ad-hoc
// -----------------------------------------------------------------------------

tap.test(
  `39 - ${`\u001b[${35}m${`ad-hoc`}\u001b[${39}m`} - text that uses \\r only as EOL characters`,
  (t) => {
    t.is(
      fixRowNums(`zzzz\ryyyy\r${letterC}onsole.log('1 some text')`),
      `zzzz\ryyyy\r${letterC}onsole.log('003 some text')`,
      `39.01`
    );
    t.is(
      fixRowNums(`zzzz\nyyyy\n${letterC}onsole.log('1 some text')`),
      `zzzz\nyyyy\n${letterC}onsole.log('003 some text')`,
      `39.02`
    );
    t.is(
      fixRowNums(`zzzz\r\nyyyy\r\n${letterC}onsole.log('1 some text')`),
      `zzzz\r\nyyyy\r\n${letterC}onsole.log('003 some text')`,
      `39.03`
    );
    t.end();
  }
);

tap.test(
  `40 - ${`\u001b[${35}m${`ad-hoc`}\u001b[${39}m`} - broken ANSI - will not update`,
  (t) => {
    t.is(
      fixRowNums(
        `${letterC}onsole.log(\`${BACKSLASH}u001b[012399999999$\{\` \t 888 z\`}${BACKSLASH}u001b[$\{39}m\`)`
      ),
      `${letterC}onsole.log(\`${BACKSLASH}u001b[012399999999$\{\` \t 888 z\`}${BACKSLASH}u001b[$\{39}m\`)`,
      `40 - ANSI opening sequence's m is missing`
    );
    t.end();
  }
);

tap.test(
  `41 - ${`\u001b[${35}m${`ad-hoc`}\u001b[${39}m`} - no quotes - no text`,
  (t) => {
    t.is(
      fixRowNums("1", {
        overrideRowNum: 124,
        returnRangesOnly: false,
        extractedLogContentsWereGiven: true,
      }),
      "124",
      `41`
    );
    t.end();
  }
);

tap.test(
  `42 - ${`\u001b[${35}m${`ad-hoc`}\u001b[${39}m`} - no quotes - no text`,
  (t) => {
    t.same(
      fixRowNums("1", {
        overrideRowNum: 124,
        returnRangesOnly: true,
        extractedLogContentsWereGiven: true,
      }),
      [[0, 1, "124"]],
      `42`
    );
    t.end();
  }
);

tap.test(
  `43 - ${`\u001b[${35}m${`ad-hoc`}\u001b[${39}m`} - no quotes - with text`,
  (t) => {
    t.is(
      fixRowNums("1 something", {
        overrideRowNum: 124,
        returnRangesOnly: false,
        extractedLogContentsWereGiven: true,
      }),
      "124 something",
      `43`
    );
    t.end();
  }
);

tap.test(
  `44 - ${`\u001b[${35}m${`ad-hoc`}\u001b[${39}m`} - no quotes - with text`,
  (t) => {
    t.same(
      fixRowNums("1 something", {
        overrideRowNum: 124,
        returnRangesOnly: true,
        extractedLogContentsWereGiven: true,
      }),
      [[0, 1, "124"]],
      `44`
    );
    t.end();
  }
);

tap.test(
  `45 - ${`\u001b[${35}m${`ad-hoc`}\u001b[${39}m`} - with quotes - no text`,
  (t) => {
    t.is(
      fixRowNums(`"1"`, {
        overrideRowNum: 124,
        returnRangesOnly: false,
        extractedLogContentsWereGiven: true,
      }),
      `"124"`,
      `45`
    );
    t.end();
  }
);

tap.test(
  `46 - ${`\u001b[${35}m${`ad-hoc`}\u001b[${39}m`} - with quotes - no text, override rownum is number`,
  (t) => {
    t.same(
      fixRowNums(`"1"`, {
        overrideRowNum: 124,
        returnRangesOnly: true,
        extractedLogContentsWereGiven: true,
      }),
      [[1, 2, "124"]],
      `46`
    );
    t.end();
  }
);

tap.test(
  `47 - ${`\u001b[${35}m${`ad-hoc`}\u001b[${39}m`} - with quotes - no text, override rownum is text`,
  (t) => {
    t.same(
      fixRowNums(`"1"`, {
        overrideRowNum: "124", // <----- text, not number
        returnRangesOnly: true,
        extractedLogContentsWereGiven: true,
      }),
      [[1, 2, "124"]],
      `47`
    );
    t.end();
  }
);

tap.test(
  `48 - ${`\u001b[${35}m${`ad-hoc`}\u001b[${39}m`} - with quotes - with text`,
  (t) => {
    t.is(
      fixRowNums(`"1 something"`, {
        overrideRowNum: 124,
        returnRangesOnly: false,
        extractedLogContentsWereGiven: true,
      }),
      `"124 something"`,
      `48`
    );
    t.end();
  }
);

tap.test(
  `49 - ${`\u001b[${35}m${`ad-hoc`}\u001b[${39}m`} - with quotes - with text`,
  (t) => {
    t.same(
      fixRowNums(`"1 something"`, {
        overrideRowNum: 124,
        returnRangesOnly: true,
        extractedLogContentsWereGiven: true,
      }),
      [[1, 2, "124"]],
      `49`
    );
    t.end();
  }
);

tap.test(
  `50 - ${`\u001b[${35}m${`ad-hoc`}\u001b[${39}m`} - with backticks - no text`,
  (t) => {
    t.is(
      fixRowNums("`1`", {
        overrideRowNum: 124,
        returnRangesOnly: false,
        extractedLogContentsWereGiven: true,
      }),
      "`124`",
      `50`
    );
    t.end();
  }
);

tap.test(
  `51 - ${`\u001b[${35}m${`ad-hoc`}\u001b[${39}m`} - with backticks - no text, override rownum is number`,
  (t) => {
    t.same(
      fixRowNums("`1`", {
        overrideRowNum: 124,
        returnRangesOnly: true,
        extractedLogContentsWereGiven: true,
      }),
      [[1, 2, "124"]],
      `51`
    );
    t.end();
  }
);

tap.test(
  `52 - ${`\u001b[${35}m${`ad-hoc`}\u001b[${39}m`} - only number, with surrounding whitespace`,
  (t) => {
    t.same(
      fixRowNums("\n1\n", {
        overrideRowNum: 124,
        returnRangesOnly: true,
        extractedLogContentsWereGiven: true,
      }),
      [[1, 2, "124"]],
      `52`
    );
    t.end();
  }
);

tap.test(
  `53 - ${`\u001b[${35}m${`ad-hoc`}\u001b[${39}m`} - insurance 1`,
  (t) => {
    const source = "\\u001b[${32}m${`z`}\\u001b[${39}m";
    t.same(
      fixRowNums(source, {
        overrideRowNum: 124,
        returnRangesOnly: false,
        extractedLogContentsWereGiven: true,
      }),
      source,
      `53`
    );
    t.end();
  }
);

tap.test(
  `54 - ${`\u001b[${35}m${`ad-hoc`}\u001b[${39}m`} - insurance 2`,
  (t) => {
    const source = "some text 1 and more text";
    t.same(
      fixRowNums(source, {
        overrideRowNum: 124,
        returnRangesOnly: false,
        extractedLogContentsWereGiven: true,
      }),
      source,
      `54`
    );
    t.end();
  }
);

tap.test(
  `55 - ${`\u001b[${35}m${`ad-hoc`}\u001b[${39}m`} - extractedLogContentsWereGiven`,
  (t) => {
    const source = `${BACKSLASH}u1000`;
    t.same(
      fixRowNums(source, {
        extractedLogContentsWereGiven: true,
      }),
      source,
      `55`
    );
    t.end();
  }
);

// -----------------------------------------------------------------------------
// 06. custom functions via opts.triggerKeywords
// -----------------------------------------------------------------------------

tap.test(
  `56 - ${`\u001b[${34}m${`opts.triggerKeywords`}\u001b[${39}m`} - baseline`,
  (t) => {
    t.is(
      fixRowNums(`a\nb\nc\nlog(\`1 something\`)`),
      `a\nb\nc\nlog(\`1 something\`)`,
      "56"
    );
    t.end();
  }
);

tap.test(
  `57 - ${`\u001b[${34}m${`opts.triggerKeywords`}\u001b[${39}m`} - works on custom function`,
  (t) => {
    t.is(
      fixRowNums(`a\nb\nc\nlog(\`1 something\`)`, { triggerKeywords: [`log`] }),
      `a\nb\nc\nlog(\`004 something\`)`,
      "57"
    );
    t.end();
  }
);

tap.test(
  `58 - ${`\u001b[${34}m${`opts.triggerKeywords`}\u001b[${39}m`} - non-existing log function`,
  (t) => {
    const sources = [
      `a\nb\nc\n${letterC}onsole.log(\`1 something\`)`,
      `a\nb\nc\nlog(\`1 something\`)`,
    ];
    sources.forEach((source) => {
      t.is(fixRowNums(source, { triggerKeywords: [`zzz`] }), source);
      t.is(fixRowNums(source, { triggerKeywords: null }), source);
    });
    t.end();
  }
);
