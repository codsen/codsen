import test from "ava";
import {
  genAtomic,
  version,
  headsAndTails
} from "../dist/generate-atomic-css.esm";

const { CONFIGHEAD, CONFIGTAIL, CONTENTHEAD, CONTENTTAIL } = headsAndTails;

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

test(`01.01 - ${`\u001b[${31}m${`throws`}\u001b[${39}m`} - wrong/missing input`, t => {
  t.throws(() => {
    genAtomic();
  });
});

test(`01.02 - ${`\u001b[${31}m${`throws`}\u001b[${39}m`} - undefined literal`, t => {
  t.throws(() => {
    genAtomic(undefined);
  });
});

test(`01.03 - ${`\u001b[${31}m${`throws`}\u001b[${39}m`} - numbers`, t => {
  t.throws(() => {
    genAtomic(1);
  });
});

test(`01.04 - ${`\u001b[${31}m${`throws`}\u001b[${39}m`} - null`, t => {
  t.throws(() => {
    genAtomic(null);
  });
});

test(`01.05 - ${`\u001b[${31}m${`throws`}\u001b[${39}m`} - bools`, t => {
  t.throws(() => {
    genAtomic(true);
  });
});

// -----------------------------------------------------------------------------
// 02. generates from an input string, places between marks
// -----------------------------------------------------------------------------

test(`02.01 - ${`\u001b[${33}m${`places between marks`}\u001b[${39}m`} - defaults, empty content`, t => {
  t.deepEqual(
    genAtomic(`111
222
/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
| .pt$$$ { padding-top: $$$px !important; }|0|3|

| .mt$$$ { margin-top: $$$px !important; }|0|3|
GENERATE-ATOMIC-CSS-CONFIG-ENDS
GENERATE-ATOMIC-CSS-CONTENT-STARTS
GENERATE-ATOMIC-CSS-CONTENT-ENDS */
333
444
`),
    `111
222
/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
| .pt$$$ { padding-top: $$$px !important; }|0|3|

| .mt$$$ { margin-top: $$$px !important; }|0|3|
GENERATE-ATOMIC-CSS-CONFIG-ENDS
GENERATE-ATOMIC-CSS-CONTENT-STARTS */
 .pt0 { padding-top:   0 !important; }
 .pt1 { padding-top: 1px !important; }
 .pt2 { padding-top: 2px !important; }
 .pt3 { padding-top: 3px !important; }

 .mt0 { margin-top:   0 !important; }
 .mt1 { margin-top: 1px !important; }
 .mt2 { margin-top: 2px !important; }
 .mt3 { margin-top: 3px !important; }
/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */
333
444
`,
    "02.01"
  );
});

// -----------------------------------------------------------------------------
// 03. generates from an input string, returns it - config + heads/tails off
// -----------------------------------------------------------------------------

test(`03.01 - ${`\u001b[${33}m${`no config, no heads/tails`}\u001b[${39}m`} - defaults, empty content`, t => {
  const source = ".pt$$$ { padding-top: $$$px !important; }";
  const generated = genAtomic(source, {
    includeConfig: false,
    includeHeadsAndTails: false
  });
  t.is(generated.trim().split("\n").length, 501, "03.01.01");
  t.true(generated.includes("padding-top:     0 !important", "03.01.02"));
  t.true(generated.includes("padding-top: 500px !important", "03.01.03"));
  t.true(
    generated.includes(".pt401 { padding-top: 401px !important; }", "03.01.04")
  );
});

test(`03.02 - ${`\u001b[${33}m${`no config, no heads/tails`}\u001b[${39}m`} - min max set #1`, t => {
  const source1 = `
.pt$$$ { padding-top: $$$px !important; }|0|5
.pr$$$ { padding-right: $$$px !important; }|0|5
.pb$$$ { padding-bottom: $$$px !important; }|0|5`.trim();
  // if "from" index is default, it can be omitted:
  const source2 = `
.pt$$$ { padding-top: $$$px !important; }|5
.pr$$$ { padding-right: $$$px !important; }|5
.pb$$$ { padding-bottom: $$$px !important; }|5`.trim();
  const ref = `.pt0 { padding-top:   0 !important; }
.pt1 { padding-top: 1px !important; }
.pt2 { padding-top: 2px !important; }
.pt3 { padding-top: 3px !important; }
.pt4 { padding-top: 4px !important; }
.pt5 { padding-top: 5px !important; }
.pr0 { padding-right:   0 !important; }
.pr1 { padding-right: 1px !important; }
.pr2 { padding-right: 2px !important; }
.pr3 { padding-right: 3px !important; }
.pr4 { padding-right: 4px !important; }
.pr5 { padding-right: 5px !important; }
.pb0 { padding-bottom:   0 !important; }
.pb1 { padding-bottom: 1px !important; }
.pb2 { padding-bottom: 2px !important; }
.pb3 { padding-bottom: 3px !important; }
.pb4 { padding-bottom: 4px !important; }
.pb5 { padding-bottom: 5px !important; }
`;
  const generated1 = genAtomic(source1, {
    includeConfig: false,
    includeHeadsAndTails: false
  });
  const generated2 = genAtomic(source2, {
    includeConfig: false,
    includeHeadsAndTails: false
  });

  t.is(generated1, ref, "03.02.01");
  t.is(generated2, ref, "03.02.02");
});

test(`03.03 - ${`\u001b[${33}m${`no config, no heads/tails`}\u001b[${39}m`} - min max set #2`, t => {
  const source = `
| .pt$$$ { padding-top: $$$px !important; } |5|10|
|.pr$$$ { padding-right: $$$px !important; } | 5|10
.pb$$$ { padding-bottom: $$$px !important; } | 5 | 10 |`.trim();
  const ref = ` .pt5  { padding-top:  5px !important; }
 .pt6  { padding-top:  6px !important; }
 .pt7  { padding-top:  7px !important; }
 .pt8  { padding-top:  8px !important; }
 .pt9  { padding-top:  9px !important; }
 .pt10 { padding-top: 10px !important; }
.pr5  { padding-right:  5px !important; }
.pr6  { padding-right:  6px !important; }
.pr7  { padding-right:  7px !important; }
.pr8  { padding-right:  8px !important; }
.pr9  { padding-right:  9px !important; }
.pr10 { padding-right: 10px !important; }
.pb5  { padding-bottom:  5px !important; }
.pb6  { padding-bottom:  6px !important; }
.pb7  { padding-bottom:  7px !important; }
.pb8  { padding-bottom:  8px !important; }
.pb9  { padding-bottom:  9px !important; }
.pb10 { padding-bottom: 10px !important; }
`;
  const generated = genAtomic(source, {
    includeConfig: false,
    includeHeadsAndTails: false
  });

  t.is(generated, ref, "03.03.01");
});

// -----------------------------------------------------------------------------
// 04. generates from an input string, returns it, heads only requested
// -----------------------------------------------------------------------------

test(`04.01 - ${`\u001b[${35}m${`no config, only heads/tails`}\u001b[${39}m`} - but no heads tails incoming, default range`, t => {
  const source = ".pt$$$ { padding-top: $$$px !important; }";
  const generated = genAtomic(source, {
    includeConfig: false,
    includeHeadsAndTails: true
  });
  t.is(generated.split("\n").length, 504, "04.01.01");
  t.true(generated.includes("padding-top:     0 !important", "04.01.02"));
  t.true(generated.includes("padding-top: 500px !important", "04.01.03"));
  t.true(
    generated.includes(".pt401 { padding-top: 401px !important; }", "04.01.04")
  );

  // without config we can't do a second cycle so unit test ends here
});

test(`04.02 - ${`\u001b[${35}m${`no config, only heads/tails`}\u001b[${39}m`} - but no heads tails incoming, capped upper`, t => {
  const source1 = `
.pt$$$ { padding-top: $$$px !important; }|0|5
.pr$$$ { padding-right: $$$px !important; }|0|5
.pb$$$ { padding-bottom: $$$px !important; }|0|5`.trim();
  // if "from" index is default, it can be omitted:
  const source2 = `
.pt$$$ { padding-top: $$$px !important; }|5
.pr$$$ { padding-right: $$$px !important; }|5
.pb$$$ { padding-bottom: $$$px !important; }|5`.trim();
  const ref = `/* ${CONTENTHEAD} */
.pt0 { padding-top:   0 !important; }
.pt1 { padding-top: 1px !important; }
.pt2 { padding-top: 2px !important; }
.pt3 { padding-top: 3px !important; }
.pt4 { padding-top: 4px !important; }
.pt5 { padding-top: 5px !important; }
.pr0 { padding-right:   0 !important; }
.pr1 { padding-right: 1px !important; }
.pr2 { padding-right: 2px !important; }
.pr3 { padding-right: 3px !important; }
.pr4 { padding-right: 4px !important; }
.pr5 { padding-right: 5px !important; }
.pb0 { padding-bottom:   0 !important; }
.pb1 { padding-bottom: 1px !important; }
.pb2 { padding-bottom: 2px !important; }
.pb3 { padding-bottom: 3px !important; }
.pb4 { padding-bottom: 4px !important; }
.pb5 { padding-bottom: 5px !important; }
/* ${CONTENTTAIL} */
`;
  const generated1 = genAtomic(source1, {
    includeConfig: false,
    includeHeadsAndTails: true
  });
  const generated2 = genAtomic(source2, {
    includeConfig: false,
    includeHeadsAndTails: true
  });

  t.is(generated1, ref, "04.02.01");
  t.is(generated2, ref, "04.02.02");

  // without config we can't do a second cycle so unit test ends here
});

test(`04.03 - ${`\u001b[${35}m${`no config, only heads/tails`}\u001b[${39}m`} - but no heads tails incoming, fully custom range`, t => {
  const source = `
| .pt$$$ { padding-top: $$$px !important; } |5|10|
|.pr$$$ { padding-right: $$$px !important; } | 5|10
.pb$$$ { padding-bottom: $$$px !important; } | 5 | 10 |`.trim();
  const ref = `/* ${CONTENTHEAD} */
 .pt5  { padding-top:  5px !important; }
 .pt6  { padding-top:  6px !important; }
 .pt7  { padding-top:  7px !important; }
 .pt8  { padding-top:  8px !important; }
 .pt9  { padding-top:  9px !important; }
 .pt10 { padding-top: 10px !important; }
.pr5  { padding-right:  5px !important; }
.pr6  { padding-right:  6px !important; }
.pr7  { padding-right:  7px !important; }
.pr8  { padding-right:  8px !important; }
.pr9  { padding-right:  9px !important; }
.pr10 { padding-right: 10px !important; }
.pb5  { padding-bottom:  5px !important; }
.pb6  { padding-bottom:  6px !important; }
.pb7  { padding-bottom:  7px !important; }
.pb8  { padding-bottom:  8px !important; }
.pb9  { padding-bottom:  9px !important; }
.pb10 { padding-bottom: 10px !important; }
/* ${CONTENTTAIL} */
`;
  const generated = genAtomic(source, {
    includeConfig: false,
    includeHeadsAndTails: true
  });

  t.is(generated, ref, "04.03");
  // without config we can't do a second cycle so unit test ends here
});

test(`04.04 - ${`\u001b[${35}m${`no config, only heads/tails`}\u001b[${39}m`} - incoming content heads without opening comment and content in front`, t => {
  // ---------------------------------------------------------------------------

  const source = `zzz

${CONTENTHEAD}
    */

.pb$$$ { padding-bottom: $$$px !important; } | 5 | 10

.mt$$$ { margin-top: $$$px !important; } | 1

/*
     ${CONTENTTAIL}
*/`;

  // ---------------------------------------------------------------------------

  const ref = `zzz

/* ${CONTENTHEAD} */
.pb5  { padding-bottom:  5px !important; }
.pb6  { padding-bottom:  6px !important; }
.pb7  { padding-bottom:  7px !important; }
.pb8  { padding-bottom:  8px !important; }
.pb9  { padding-bottom:  9px !important; }
.pb10 { padding-bottom: 10px !important; }

.mt0 { margin-top:   0 !important; }
.mt1 { margin-top: 1px !important; }
/* ${CONTENTTAIL} */
`;

  // ---------------------------------------------------------------------------

  const generated = genAtomic(source, {
    includeConfig: false,
    includeHeadsAndTails: true
  });
  console.log(
    `310 ${`\u001b[${33}m${`GENERATED RESULT`}\u001b[${39}m`}:
███████████████████████████████████████
"${generated}"
███████████████████████████████████████
`
  );

  t.is(generated, ref, "04.04");
  // without config we can't do a second cycle so unit test ends here
});

test(`04.05 - ${`\u001b[${35}m${`no config, only heads/tails`}\u001b[${39}m`} - incoming content heads without opening comment and comments clash`, t => {
  // ---------------------------------------------------------------------------

  const source = `/* zzz

${CONTENTHEAD} */

.pb$$$ { padding-bottom: $$$px !important; } | 5 | 7

.mt$$$ { margin-top: $$$px !important; } | 1

/* ${CONTENTTAIL} */`;

  // ---------------------------------------------------------------------------

  const ref = `/* zzz */

/* ${CONTENTHEAD} */
.pb5 { padding-bottom: 5px !important; }
.pb6 { padding-bottom: 6px !important; }
.pb7 { padding-bottom: 7px !important; }

.mt0 { margin-top:   0 !important; }
.mt1 { margin-top: 1px !important; }
/* ${CONTENTTAIL} */
`;

  // ---------------------------------------------------------------------------

  const generated = genAtomic(source, {
    includeConfig: false,
    includeHeadsAndTails: true
  });

  // ---------------------------------------------------------------------------

  t.is(generated, ref, "04.05");

  // without config we can't do a second cycle so unit test ends here
});

test(`04.06 - ${`\u001b[${35}m${`no config, only heads/tails`}\u001b[${39}m`} - content's heads and tails instead of config's heads and tails`, t => {
  const source = `/*${CONTENTHEAD}*/

.pb$$$ { padding-bottom: $$$px !important; } | 5 | 7

.mt$$$ { margin-top: $$$px !important; } | 1

/*${CONTENTTAIL}*/`;
  const ref = `/* ${CONTENTHEAD} */
.pb5 { padding-bottom: 5px !important; }
.pb6 { padding-bottom: 6px !important; }
.pb7 { padding-bottom: 7px !important; }

.mt0 { margin-top:   0 !important; }
.mt1 { margin-top: 1px !important; }
/* ${CONTENTTAIL} */
`;

  const generated = genAtomic(source, {
    includeConfig: false,
    includeHeadsAndTails: true
  });

  t.is(generated, ref, "04.06");

  // without config we can't do a second cycle so unit test ends here
});

test(`04.07 - ${`\u001b[${35}m${`no config, only heads/tails`}\u001b[${39}m`} - blank content heads/tails`, t => {
  t.is(
    genAtomic(
      `
${CONTENTHEAD}
\t\n\n \t\t\t   \t
${CONTENTTAIL}
  `,
      {
        includeConfig: false,
        includeHeadsAndTails: false
      }
    ),
    "",
    "04.07.01"
  );
  t.is(
    genAtomic(
      `
${CONTENTHEAD}
\t\n\n \t\t\t   \t
${CONTENTTAIL}
  `,
      {
        includeConfig: false,
        includeHeadsAndTails: true
      }
    ),
    "",
    "04.07.02"
  );
  t.is(
    genAtomic(
      `
${CONTENTHEAD}
\t\n\n \t\t\t   \t
${CONTENTTAIL}
  `,
      {
        includeConfig: true,
        includeHeadsAndTails: false
      }
    ),
    "",
    "04.07.03"
  );
  t.is(
    genAtomic(
      `
${CONTENTHEAD}
\t\n\n \t\t\t   \t
${CONTENTTAIL}
  `,
      {
        includeConfig: true,
        includeHeadsAndTails: true
      }
    ),
    "",
    "04.07.04"
  );
});

test(`04.08 - ${`\u001b[${35}m${`no config, only heads/tails`}\u001b[${39}m`} - blank config heads/tails`, t => {
  t.is(
    genAtomic(
      `
${CONFIGHEAD}
\t\n\n \t\t\t   \t
${CONFIGTAIL}
  `,
      {
        includeConfig: false,
        includeHeadsAndTails: false
      }
    ),
    "",
    "04.08.01"
  );
  t.is(
    genAtomic(
      `
${CONFIGHEAD}
\t\n\n \t\t\t   \t
${CONFIGTAIL}
  `,
      {
        includeConfig: false,
        includeHeadsAndTails: true
      }
    ),
    "",
    "04.08.02"
  );
  t.is(
    genAtomic(
      `
${CONFIGHEAD}
\t\n\n \t\t\t   \t
${CONFIGTAIL}
  `,
      {
        includeConfig: true,
        includeHeadsAndTails: false
      }
    ),
    "",
    "04.08.03"
  );
  t.is(
    genAtomic(
      `
${CONFIGHEAD}
\t\n\n \t\t\t   \t
${CONFIGTAIL}
  `,
      {
        includeConfig: true,
        includeHeadsAndTails: true
      }
    ),
    "",
    "04.08.04"
  );
});

// -----------------------------------------------------------------------------
// 05. generates from an input string, config requested but not present
// -----------------------------------------------------------------------------

test(`05.01 - ${`\u001b[${34}m${`config requested but not present`}\u001b[${39}m`} - but no heads tails incoming, default range`, t => {
  const source = ".pt$$$ { padding-top: $$$px !important; }";
  const generated = genAtomic(source, {
    includeConfig: true,
    includeHeadsAndTails: true
  });
  console.log(
    `278 test.js: ${`\u001b[${33}m${`generated 0-300`}\u001b[${39}m`} = "${generated.slice(
      0,
      300
    )}"`
  );
  console.log(
    `284 test.js: ${`\u001b[${33}m${`generated last 100`}\u001b[${39}m`} = "${generated.slice(
      generated.length - 100
    )}"`
  );
  t.is(generated.split("\n").length, 507, "05.01.01");
  t.true(generated.includes("padding-top:     0 !important", "05.01.02"));
  t.true(generated.includes("padding-top:   5px !important", "05.01.03"));
  t.true(generated.includes("padding-top:  50px !important", "05.01.04"));
  t.true(generated.includes("padding-top: 500px !important", "05.01.05"));
  t.true(
    generated.includes(".pt401 { padding-top: 401px !important; }", "05.01.06")
  );

  t.true(generated.includes(CONFIGHEAD, "05.01.07"));
  t.true(generated.includes(CONFIGTAIL, "05.01.08"));
  t.true(generated.includes(CONTENTHEAD, "05.01.09"));
  t.true(generated.includes(CONTENTTAIL, "05.01.10"));
});

test(`05.02 - ${`\u001b[${34}m${`config requested but not present`}\u001b[${39}m`} - but no heads tails incoming, capped upper`, t => {
  const source1 = `
.pt$$$ { padding-top: $$$px !important; }|0|5
.pr$$$ { padding-right: $$$px !important; }|0|5
.pb$$$ { padding-bottom: $$$px !important; }|0|5
`.trim();
  // if "from" index is default, it can be omitted:
  const source2 = `
.pt$$$ { padding-top: $$$px !important; }|5
.pr$$$ { padding-right: $$$px !important; }|5
.pb$$$ { padding-bottom: $$$px !important; }|5
`.trim();
  const ref1 = `/* ${CONFIGHEAD}
${source1}
${CONFIGTAIL}
${CONTENTHEAD} */
.pt0 { padding-top:   0 !important; }
.pt1 { padding-top: 1px !important; }
.pt2 { padding-top: 2px !important; }
.pt3 { padding-top: 3px !important; }
.pt4 { padding-top: 4px !important; }
.pt5 { padding-top: 5px !important; }
.pr0 { padding-right:   0 !important; }
.pr1 { padding-right: 1px !important; }
.pr2 { padding-right: 2px !important; }
.pr3 { padding-right: 3px !important; }
.pr4 { padding-right: 4px !important; }
.pr5 { padding-right: 5px !important; }
.pb0 { padding-bottom:   0 !important; }
.pb1 { padding-bottom: 1px !important; }
.pb2 { padding-bottom: 2px !important; }
.pb3 { padding-bottom: 3px !important; }
.pb4 { padding-bottom: 4px !important; }
.pb5 { padding-bottom: 5px !important; }
/* ${CONTENTTAIL} */
`;
  const ref2 = `/* ${CONFIGHEAD}
${source2}
${CONFIGTAIL}
${CONTENTHEAD} */
.pt0 { padding-top:   0 !important; }
.pt1 { padding-top: 1px !important; }
.pt2 { padding-top: 2px !important; }
.pt3 { padding-top: 3px !important; }
.pt4 { padding-top: 4px !important; }
.pt5 { padding-top: 5px !important; }
.pr0 { padding-right:   0 !important; }
.pr1 { padding-right: 1px !important; }
.pr2 { padding-right: 2px !important; }
.pr3 { padding-right: 3px !important; }
.pr4 { padding-right: 4px !important; }
.pr5 { padding-right: 5px !important; }
.pb0 { padding-bottom:   0 !important; }
.pb1 { padding-bottom: 1px !important; }
.pb2 { padding-bottom: 2px !important; }
.pb3 { padding-bottom: 3px !important; }
.pb4 { padding-bottom: 4px !important; }
.pb5 { padding-bottom: 5px !important; }
/* ${CONTENTTAIL} */
`;
  const generated1 = genAtomic(source1, {
    includeConfig: true,
    includeHeadsAndTails: true
  });
  const generated2 = genAtomic(source2, {
    includeConfig: true,
    includeHeadsAndTails: true
  });

  t.is(generated1, ref1, "05.02.01");
  t.is(generated2, ref2, "05.02.02");

  // second cycle should not change anything since it's the same config
  t.is(
    generated1,
    genAtomic(generated1, {
      includeConfig: true,
      includeHeadsAndTails: true
    }),
    "05.02.03"
  );
  t.is(
    generated2,
    genAtomic(generated2, {
      includeConfig: true,
      includeHeadsAndTails: true
    }),
    "05.02.04"
  );
});

test(`05.03 - ${`\u001b[${34}m${`config requested but not present`}\u001b[${39}m`} - but no heads tails incoming, fully custom range`, t => {
  const source = `
| .pt$$$ { padding-top: $$$px !important; } |5|10|
|.pr$$$ { padding-right: $$$px !important; } | 5|10
.pb$$$ { padding-bottom: $$$px !important; } | 5 | 10 |
`.trim();
  const ref = `/* ${CONFIGHEAD}
${source}
${CONFIGTAIL}
${CONTENTHEAD} */
 .pt5  { padding-top:  5px !important; }
 .pt6  { padding-top:  6px !important; }
 .pt7  { padding-top:  7px !important; }
 .pt8  { padding-top:  8px !important; }
 .pt9  { padding-top:  9px !important; }
 .pt10 { padding-top: 10px !important; }
.pr5  { padding-right:  5px !important; }
.pr6  { padding-right:  6px !important; }
.pr7  { padding-right:  7px !important; }
.pr8  { padding-right:  8px !important; }
.pr9  { padding-right:  9px !important; }
.pr10 { padding-right: 10px !important; }
.pb5  { padding-bottom:  5px !important; }
.pb6  { padding-bottom:  6px !important; }
.pb7  { padding-bottom:  7px !important; }
.pb8  { padding-bottom:  8px !important; }
.pb9  { padding-bottom:  9px !important; }
.pb10 { padding-bottom: 10px !important; }
/* ${CONTENTTAIL} */
`;
  const generated = genAtomic(source, {
    includeConfig: true,
    includeHeadsAndTails: true
  });

  t.is(generated, ref, "05.03.01");

  // second cycle should not change anything since it's the same config
  // t.is(
  //   generated,
  //   genAtomic(generated, {
  //     includeConfig: true,
  //     includeHeadsAndTails: true
  //   }),
  //   "05.03.02"
  // );
});

test.todo(
  "05.04 - no config present, only content heads/tails, no old CSS, no content around"
);
test.todo(
  "05.05 - no config present, only content heads/tails, no old CSS, content on top"
);
test.todo(
  "05.06 - no config present, only content heads/tails, no old CSS, content on bottom"
);
test.todo(
  "05.07 - no config present, only content heads/tails, no old CSS, content wrapped around"
);

test.todo(
  "05.08 - no config present, only content heads/tails, old CSS present, no content around"
);
test.todo(
  "05.09 - no config present, only content heads/tails, old CSS present, content on top"
);
test.todo(
  "05.10 - no config present, only content heads/tails, old CSS present, content on bottom"
);
test.todo(
  "05.11 - no config present, only content heads/tails, old CSS present, content wrapped around"
);

// -----------------------------------------------------------------------------
// 06. full set present and requested: config and heads/tails
// -----------------------------------------------------------------------------

test.todo(
  "06.01 - minimal example, generates from head config, no old CSS content"
);
test.todo(
  "06.02 - minimal example, generates from head config, old CSS content present"
);
test.todo(
  "06.03 - minimal example, opts config overrides head config, clean head config present"
);
test.todo(
  "06.04 - minimal example, opts config overrides head config, head config present but dirty - config tail missing"
);
test.todo(
  "06.05 - minimal example, opts config overrides head config, head config present but dirty - config head missing"
);
test.todo(
  "06.06 - minimal example, opts config overrides head config, head config present but dirty - split into multiple CSS comments"
);
test.todo(
  "06.07 - minimal example, opts config overrides head config, head config not present"
);
test.todo(
  "06.08 - minimal example, generates from head config, no content heads/tails whatsoever"
);
test.todo(
  "06.09 - minimal example, content tail missing, leads to end of a file"
);
test.todo(
  "06.10 - minimal example, content head missing, leads to end of a file"
);
test.todo("06.11 - minimal example, one line input");
test.todo(
  "06.12 - config head is missing but config is present and config tails is present (%%%)"
);
test.todo(
  "06.13 - config is missing, only its tail is present and input starts with its tail "
);
test.todo(
  "06.14 - config is missing, only its tail is present and there is config above (no %%%)"
);

// -----------------------------------------------------------------------------
// 07. full set present but no config requested
// -----------------------------------------------------------------------------

test.todo("07.01 - generates from old CSS config");

test.todo("07.02 - generates from opts override, old CSS config present");

// -----------------------------------------------------------------------------
// 08. full set present but no config requested, only heads/tails
// -----------------------------------------------------------------------------

test.todo("08.01 - generates from old CSS config");

test.todo("08.02 - generates from opts override, old CSS config present");

// -----------------------------------------------------------------------------
// 09. full set present but neither config requested nor heads/tails requested
// -----------------------------------------------------------------------------

test.todo("09.01 - generates from old CSS config");

test.todo("09.02 - generates from opts override, old CSS config present");

// -----------------------------------------------------------------------------
// 99. API bits
// -----------------------------------------------------------------------------

test(`99.01 - ${`\u001b[${33}m${`API bits`}\u001b[${39}m`} - version is exported`, t => {
  t.regex(version, /\d+\.\d+\.\d+/g, "99.01");
});

test(`99.02 - ${`\u001b[${33}m${`API bits`}\u001b[${39}m`} - heads and tails are exported`, t => {
  t.is(Object.keys(headsAndTails).length, 4, "99.02");
});

test(`99.03 - ${`\u001b[${33}m${`API bits`}\u001b[${39}m`} - exports reportProgressFunc which works`, t => {
  const counterArr = [];
  const source = ".pt$$$ { padding-top: $$$px !important; }";
  const generated = genAtomic(source, {
    includeConfig: false,
    includeHeadsAndTails: false,
    reportProgressFunc: perc => {
      counterArr.push(perc);
    }
  });
  t.true(generated.split("\n").length > 500, "99.03.01");
  t.true(counterArr.length > 98, "99.03.02");
});
