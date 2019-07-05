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
// 02. taster
// -----------------------------------------------------------------------------

test(`02.01 - ${`\u001b[${33}m${`taster`}\u001b[${39}m`} - no $$$ - oneliner`, t => {
  const source = "zzz";
  t.is(
    genAtomic(source, {
      includeConfig: true,
      includeHeadsAndTails: true
    }).result,
    source,
    "02.01.01"
  );
  t.is(
    genAtomic(source, {
      includeConfig: true,
      includeHeadsAndTails: false
    }).result,
    source,
    "02.01.02"
  );
  t.is(
    genAtomic(source, {
      includeConfig: false,
      includeHeadsAndTails: true
    }).result,
    source,
    "02.01.03"
  );
  t.is(
    genAtomic(source, {
      includeConfig: false,
      includeHeadsAndTails: false
    }).result,
    source,
    "02.01.04"
  );
});

test(`02.02 - ${`\u001b[${33}m${`taster`}\u001b[${39}m`} - no $$$ - multiliner`, t => {
  const source =
    "zzz\n\t\t\tyyyyy\ntralala\none dollar here $\ntwo dollars here $$\n";
  t.is(
    genAtomic(source, {
      includeConfig: true,
      includeHeadsAndTails: true
    }).result,
    source,
    "02.02.01"
  );
  t.is(
    genAtomic(source, {
      includeConfig: true,
      includeHeadsAndTails: false
    }).result,
    source,
    "02.02.02"
  );
  t.is(
    genAtomic(source, {
      includeConfig: false,
      includeHeadsAndTails: true
    }).result,
    source,
    "02.02.03"
  );
  t.is(
    genAtomic(source, {
      includeConfig: false,
      includeHeadsAndTails: false
    }).result,
    source,
    "02.02.04"
  );
});

test(`02.03 - ${`\u001b[${33}m${`taster`}\u001b[${39}m`} - defaults, empty content`, t => {
  t.deepEqual(
    genAtomic(`111
222
/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
| .pt$$$ { padding-top: $$$px !important; }|0|3|

| .mt$$$ { margin-top: $$$px !important; }|0|3|
GENERATE-ATOMIC-CSS-CONFIG-ENDSGENERATE-ATOMIC-CSS-CONTENT-STARTSGENERATE-ATOMIC-CSS-CONTENT-ENDS */
333
444
`).result,
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
    "02.03"
  );
});

// -----------------------------------------------------------------------------
// 03. generates from an input string, returns it - config + heads/tails off
// -----------------------------------------------------------------------------

test(`03.01 - ${`\u001b[${33}m${`no config, no heads/tails requested`}\u001b[${39}m`} - defaults, empty content`, t => {
  const source = ".pt$$$ { padding-top: $$$px !important; }";
  const generated = genAtomic(source, {
    includeConfig: false,
    includeHeadsAndTails: false
  }).result;
  t.is(generated.trim().split("\n").length, 501, "03.01.01");
  t.true(generated.includes("padding-top:     0 !important", "03.01.02"));
  t.true(generated.includes("padding-top: 500px !important", "03.01.03"));
  t.true(
    generated.includes(".pt401 { padding-top: 401px !important; }", "03.01.04")
  );
});

test(`03.02 - ${`\u001b[${33}m${`no config, no heads/tails requested`}\u001b[${39}m`} - min max set #1`, t => {
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
  }).result;
  const generated2 = genAtomic(source2, {
    includeConfig: false,
    includeHeadsAndTails: false
  }).result;

  t.is(generated1, ref, "03.02.01");
  t.is(generated2, ref, "03.02.02");
});

test(`03.03 - ${`\u001b[${33}m${`no config, no heads/tails requested`}\u001b[${39}m`} - min max set #2`, t => {
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
  }).result;

  t.is(generated, ref, "03.03.01");
});

// -----------------------------------------------------------------------------
// 04. generates from an input string, returns it, heads only requested
// -----------------------------------------------------------------------------

test(`04.01 - ${`\u001b[${35}m${`no config, only heads/tails requested`}\u001b[${39}m`} - but no heads tails incoming, default range`, t => {
  const source = ".pt$$$ { padding-top: $$$px !important; }";
  const generated = genAtomic(source, {
    includeConfig: false,
    includeHeadsAndTails: true
  }).result;
  t.is(generated.split("\n").length, 504, "04.01.01");
  t.true(generated.includes("padding-top:     0 !important", "04.01.02"));
  t.true(generated.includes("padding-top: 500px !important", "04.01.03"));
  t.true(
    generated.includes(".pt401 { padding-top: 401px !important; }", "04.01.04")
  );

  // without config we can't do a second cycle so unit test ends here
});

test(`04.02 - ${`\u001b[${35}m${`no config, only heads/tails requested`}\u001b[${39}m`} - but no heads tails incoming, capped upper`, t => {
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
  }).result;
  const generated2 = genAtomic(source2, {
    includeConfig: false,
    includeHeadsAndTails: true
  }).result;

  t.is(generated1, ref, "04.02.01");
  t.is(generated2, ref, "04.02.02");

  // without config we can't do a second cycle so unit test ends here
});

test(`04.03 - ${`\u001b[${35}m${`no config, only heads/tails requested`}\u001b[${39}m`} - but no heads tails incoming, fully custom range`, t => {
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
  }).result;

  t.is(generated, ref, "04.03");
  // without config we can't do a second cycle so unit test ends here
});

test(`04.04 - ${`\u001b[${35}m${`no config, only heads/tails requested`}\u001b[${39}m`} - incoming content heads without opening comment and content in front`, t => {
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
  }).result;
  t.is(generated, ref, "04.04");
  // without config we can't do a second cycle so unit test ends here
});

test(`04.05 - ${`\u001b[${35}m${`no config, only heads/tails requested`}\u001b[${39}m`} - incoming content heads without opening comment and comments clash`, t => {
  // ---------------------------------------------------------------------------

  const source = `/* zzz

${CONTENTHEAD} */

.pb$$$ { padding-bottom: $$$px !important; } | 5 | 7

.mt$$$ { margin-top: $$$px !important; } | 1

/* ${CONTENTTAIL} */`;

  // ---------------------------------------------------------------------------

  const ref = `/* zzz

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
  }).result;

  // ---------------------------------------------------------------------------

  t.is(generated, ref, "04.05");

  // without config we can't do a second cycle so unit test ends here
});

test(`04.06 - ${`\u001b[${35}m${`no config, only heads/tails requested`}\u001b[${39}m`} - content's heads and tails instead of config's heads and tails`, t => {
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
  }).result;

  t.is(generated, ref, "04.06");

  // without config we can't do a second cycle so unit test ends here
});

test(`04.07 - ${`\u001b[${35}m${`no config, only heads/tails requested`}\u001b[${39}m`} - blank content heads/tails`, t => {
  const contents = `\t\n\n \t\t\t   \t`;
  const input = `
${CONTENTHEAD}${contents}${CONTENTTAIL}
`;
  t.is(
    genAtomic(input, {
      includeConfig: false,
      includeHeadsAndTails: false
    }).result,
    "",
    "04.07.01"
  );
  t.is(
    genAtomic(input, {
      includeConfig: false,
      includeHeadsAndTails: true
    }).result,
    "",
    "04.07.02"
  );
  t.is(
    genAtomic(input, {
      includeConfig: true,
      includeHeadsAndTails: false
    }).result,
    "",
    "04.07.03"
  );
  t.is(
    genAtomic(input, {
      includeConfig: true,
      includeHeadsAndTails: true
    }).result,
    "",
    "04.07.04"
  );
});

test(`04.08 - ${`\u001b[${35}m${`no config, only heads/tails requested`}\u001b[${39}m`} - blank config heads/tails`, t => {
  const input = `
${CONTENTHEAD}
\t\n\n \t\t\t   \t
${CONTENTTAIL}
`;
  t.is(
    genAtomic(input, {
      includeConfig: false,
      includeHeadsAndTails: false
    }).result,
    "",
    "04.08.01"
  );
  t.is(
    genAtomic(input, {
      includeConfig: false,
      includeHeadsAndTails: true
    }).result,
    "",
    "04.08.02"
  );
  t.is(
    genAtomic(input, {
      includeConfig: true,
      includeHeadsAndTails: false
    }).result,
    "",
    "04.08.03"
  );
  t.is(
    genAtomic(input, {
      includeConfig: true,
      includeHeadsAndTails: true
    }).result,
    "",
    "04.08.04"
  );
});

test(`04.09 - ${`\u001b[${35}m${`no config, only heads/tails requested`}\u001b[${39}m`} - retains content around`, t => {
  t.deepEqual(
    genAtomic(
      `tra

.pb$$$ { padding-bottom: $$$px !important; } | 1 | 2

.mt$$$ { margin-top: $$$px !important; } | 2

lala`,
      {
        includeConfig: false,
        includeHeadsAndTails: true
      }
    ).result,
    `tra

/* GENERATE-ATOMIC-CSS-CONTENT-STARTS */
.pb1 { padding-bottom: 1px !important; }
.pb2 { padding-bottom: 2px !important; }

.mt0 { margin-top:   0 !important; }
.mt1 { margin-top: 1px !important; }
.mt2 { margin-top: 2px !important; }
/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */

lala
`,

    "04.09"
  );
});

test(`04.10 - ${`\u001b[${35}m${`no config, only heads/tails requested`}\u001b[${39}m`} - retains content around, incl. tails`, t => {
  const { log, result } = genAtomic(
    `tra

/* GENERATE-ATOMIC-CSS-CONTENT-STARTS */
.pb$$$ { padding-bottom: $$$px !important; } | 1 | 2

.mt$$$ { margin-top: $$$px !important; } | 2
/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */

lala`,
    {
      includeConfig: false,
      includeHeadsAndTails: true
    }
  );
  t.deepEqual(
    result,
    `tra

/* GENERATE-ATOMIC-CSS-CONTENT-STARTS */
.pb1 { padding-bottom: 1px !important; }
.pb2 { padding-bottom: 2px !important; }

.mt0 { margin-top:   0 !important; }
.mt1 { margin-top: 1px !important; }
.mt2 { margin-top: 2px !important; }
/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */

lala
`,

    "04.10.01"
  );
  t.is(log.count, 5, "04.10.02");
});

test(`04.11 - ${`\u001b[${35}m${`no config, only heads/tails requested`}\u001b[${39}m`} - retains content around, incl. config tails`, t => {
  t.deepEqual(
    genAtomic(
      `tra

/* GENERATE-ATOMIC-CSS-CONFIG-STARTS */
.pb$$$ { padding-bottom: $$$px !important; } | 1 | 2

.mt$$$ { margin-top: $$$px !important; } | 2
/* GENERATE-ATOMIC-CSS-CONFIG-ENDS */

lala`,
      {
        includeConfig: false,
        includeHeadsAndTails: true
      }
    ).result,
    `tra

/* GENERATE-ATOMIC-CSS-CONTENT-STARTS */
.pb1 { padding-bottom: 1px !important; }
.pb2 { padding-bottom: 2px !important; }

.mt0 { margin-top:   0 !important; }
.mt1 { margin-top: 1px !important; }
.mt2 { margin-top: 2px !important; }
/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */

lala
`,

    "04.11"
  );
});

test(`04.12 - ${`\u001b[${35}m${`no config, only heads/tails requested`}\u001b[${39}m`} - incl. config tails, one comment block`, t => {
  t.deepEqual(
    genAtomic(
      `tra

/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
.pb$$$ { padding-bottom: $$$px !important; } | 1 | 2

.mt$$$ { margin-top: $$$px !important; } | 2
GENERATE-ATOMIC-CSS-CONFIG-ENDS */

lala`,
      {
        includeConfig: false,
        includeHeadsAndTails: true
      }
    ).result,
    `tra

/* GENERATE-ATOMIC-CSS-CONTENT-STARTS */
.pb1 { padding-bottom: 1px !important; }
.pb2 { padding-bottom: 2px !important; }

.mt0 { margin-top:   0 !important; }
.mt1 { margin-top: 1px !important; }
.mt2 { margin-top: 2px !important; }
/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */

lala
`,

    "04.12"
  );
});

test(`04.13 - ${`\u001b[${31}m${`config, heads/tails requested`}\u001b[${39}m`} - retains content around`, t => {
  t.deepEqual(
    genAtomic(
      `tra

.pb$$$ { padding-bottom: $$$px !important; } | 1 | 2

.mt$$$ { margin-top: $$$px !important; } | 2

lala`,
      {
        includeConfig: true,
        includeHeadsAndTails: true
      }
    ).result,
    `tra

/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
.pb$$$ { padding-bottom: $$$px !important; } | 1 | 2

.mt$$$ { margin-top: $$$px !important; } | 2
GENERATE-ATOMIC-CSS-CONFIG-ENDS
GENERATE-ATOMIC-CSS-CONTENT-STARTS */
.pb1 { padding-bottom: 1px !important; }
.pb2 { padding-bottom: 2px !important; }

.mt0 { margin-top:   0 !important; }
.mt1 { margin-top: 1px !important; }
.mt2 { margin-top: 2px !important; }
/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */

lala
`,

    "04.13"
  );
});

test(`04.14 - ${`\u001b[${31}m${`config, heads/tails requested`}\u001b[${39}m`} - retains content around, incl. tails`, t => {
  t.deepEqual(
    genAtomic(
      `tra

/* GENERATE-ATOMIC-CSS-CONTENT-STARTS */
.pb$$$ { padding-bottom: $$$px !important; } | 1 | 2

.mt$$$ { margin-top: $$$px !important; } | 2
/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */

lala`,
      {
        includeConfig: true,
        includeHeadsAndTails: true
      }
    ).result,
    `tra

/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
.pb$$$ { padding-bottom: $$$px !important; } | 1 | 2

.mt$$$ { margin-top: $$$px !important; } | 2
GENERATE-ATOMIC-CSS-CONFIG-ENDS
GENERATE-ATOMIC-CSS-CONTENT-STARTS */
.pb1 { padding-bottom: 1px !important; }
.pb2 { padding-bottom: 2px !important; }

.mt0 { margin-top:   0 !important; }
.mt1 { margin-top: 1px !important; }
.mt2 { margin-top: 2px !important; }
/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */

lala
`,

    "04.14"
  );
});

test(`04.15 - ${`\u001b[${31}m${`config, heads/tails requested`}\u001b[${39}m`} - retains content around, incl. config tails`, t => {
  t.deepEqual(
    genAtomic(
      `tra

/* GENERATE-ATOMIC-CSS-CONFIG-STARTS */
.pb$$$ { padding-bottom: $$$px !important; } | 1 | 2

.mt$$$ { margin-top: $$$px !important; } | 2
/* GENERATE-ATOMIC-CSS-CONFIG-ENDS */

lala`,
      {
        includeConfig: true,
        includeHeadsAndTails: true
      }
    ).result,
    `tra

/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
.pb$$$ { padding-bottom: $$$px !important; } | 1 | 2

.mt$$$ { margin-top: $$$px !important; } | 2
GENERATE-ATOMIC-CSS-CONFIG-ENDS
GENERATE-ATOMIC-CSS-CONTENT-STARTS */
.pb1 { padding-bottom: 1px !important; }
.pb2 { padding-bottom: 2px !important; }

.mt0 { margin-top:   0 !important; }
.mt1 { margin-top: 1px !important; }
.mt2 { margin-top: 2px !important; }
/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */

lala
`,

    "04.15"
  );
});

test(`04.16 - ${`\u001b[${31}m${`config, heads/tails requested`}\u001b[${39}m`} - incl. config tails, one comment block`, t => {
  t.deepEqual(
    genAtomic(
      `tra

/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
.pb$$$ { padding-bottom: $$$px !important; } | 1 | 2

.mt$$$ { margin-top: $$$px !important; } | 2
GENERATE-ATOMIC-CSS-CONFIG-ENDS */

lala`,
      {
        includeConfig: true,
        includeHeadsAndTails: true
      }
    ).result,
    `tra

/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
.pb$$$ { padding-bottom: $$$px !important; } | 1 | 2

.mt$$$ { margin-top: $$$px !important; } | 2
GENERATE-ATOMIC-CSS-CONFIG-ENDS
GENERATE-ATOMIC-CSS-CONTENT-STARTS */
.pb1 { padding-bottom: 1px !important; }
.pb2 { padding-bottom: 2px !important; }

.mt0 { margin-top:   0 !important; }
.mt1 { margin-top: 1px !important; }
.mt2 { margin-top: 2px !important; }
/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */

lala
`,

    "04.16"
  );
});

test(`04.19 - ${`\u001b[${35}m${`config present no config requested`}\u001b[${39}m`} - comments surrounding`, t => {
  t.deepEqual(
    genAtomic(
      `/* tra */

/* GENERATE-ATOMIC-CSS-CONFIG-STARTS */
.pb$$$ { padding-bottom: $$$px !important; } | 1 | 2

.mt$$$ { margin-top: $$$px !important; } | 2
/* GENERATE-ATOMIC-CSS-CONFIG-ENDS

/* lala */`,
      {
        includeConfig: false,
        includeHeadsAndTails: true
      }
    ).result,
    `/* tra */

/* GENERATE-ATOMIC-CSS-CONTENT-STARTS */
.pb1 { padding-bottom: 1px !important; }
.pb2 { padding-bottom: 2px !important; }

.mt0 { margin-top:   0 !important; }
.mt1 { margin-top: 1px !important; }
.mt2 { margin-top: 2px !important; }
/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */

/* lala */
`,

    "04.19"
  );
});

test(`04.20 - ${`\u001b[${35}m${`content tails present no config requested`}\u001b[${39}m`} - comments surrounding`, t => {
  t.deepEqual(
    genAtomic(
      `/* tra */

/* GENERATE-ATOMIC-CSS-CONTENT-STARTS */
.pb$$$ { padding-bottom: $$$px !important; } | 1 | 2

.mt$$$ { margin-top: $$$px !important; } | 2
/* GENERATE-ATOMIC-CSS-CONTENT-ENDS

/* lala */`,
      {
        includeConfig: false,
        includeHeadsAndTails: true
      }
    ).result,
    `/* tra */

/* GENERATE-ATOMIC-CSS-CONTENT-STARTS */
.pb1 { padding-bottom: 1px !important; }
.pb2 { padding-bottom: 2px !important; }

.mt0 { margin-top:   0 !important; }
.mt1 { margin-top: 1px !important; }
.mt2 { margin-top: 2px !important; }
/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */

/* lala */
`,

    "04.20"
  );
});

test(`04.21 - ${`\u001b[${35}m${`no config, only heads/tails requested`}\u001b[${39}m`} - but no heads tails incoming, capped upper`, t => {
  const source = `a
.pt$$$ { padding-top: $$$px !important; }|0|5
.pr$$$ { padding-right: $$$px !important; }|0|5
.pb$$$ { padding-bottom: $$$px !important; }|0|5
b`;
  const ref = `a
/* ${CONTENTHEAD} */
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
b
`;
  const generated = genAtomic(source, {
    includeConfig: false,
    includeHeadsAndTails: true
  }).result;
  t.is(generated, ref, "04.21");
});

test(`04.22 - ${`\u001b[${35}m${`no config, only heads/tails requested`}\u001b[${39}m`} - head missing`, t => {
  t.deepEqual(
    genAtomic(
      `tra

.pb$$$ { padding-bottom: $$$px !important; } | 1 | 2

.mt$$$ { margin-top: $$$px !important; } | 2
/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */

lala`,
      {
        includeConfig: false,
        includeHeadsAndTails: true
      }
    ).result,
    `tra

/* GENERATE-ATOMIC-CSS-CONTENT-STARTS */
.pb1 { padding-bottom: 1px !important; }
.pb2 { padding-bottom: 2px !important; }

.mt0 { margin-top:   0 !important; }
.mt1 { margin-top: 1px !important; }
.mt2 { margin-top: 2px !important; }
/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */

lala
`,

    "04.22"
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
  }).result;
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
  }).result;
  const generated2 = genAtomic(source2, {
    includeConfig: true,
    includeHeadsAndTails: true
  }).result;

  t.is(generated1, ref1, "05.02.01");
  t.is(generated2, ref2, "05.02.02");
});

test(`05.03 - ${`\u001b[${34}m${`config requested but not present`}\u001b[${39}m`} - but no heads tails incoming, capped upper - second cycle`, t => {
  const ref1 = `/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
.pt$$$ { padding-top: $$$px !important; }|0|5
.pr$$$ { padding-right: $$$px !important; }|0|5
.pb$$$ { padding-bottom: $$$px !important; }|0|5
GENERATE-ATOMIC-CSS-CONFIG-ENDS
GENERATE-ATOMIC-CSS-CONTENT-STARTS */
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
/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */
`;
  const { log, result } = genAtomic(ref1, {
    includeConfig: true,
    includeHeadsAndTails: true
  });

  t.is(result, ref1, "05.03.01");
  t.is(log.count, 18, "05.03.02");
  t.is(
    result,
    genAtomic(result, {
      includeConfig: true,
      includeHeadsAndTails: true
    }).result,
    "05.03.03"
  );
});

test(`05.04 - ${`\u001b[${34}m${`config requested but not present`}\u001b[${39}m`} - but no heads tails incoming, capped upper - second cycle`, t => {
  const ref2 = `/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
.pt$$$ { padding-top: $$$px !important; }|5
.pr$$$ { padding-right: $$$px !important; }|5
.pb$$$ { padding-bottom: $$$px !important; }|5
GENERATE-ATOMIC-CSS-CONFIG-ENDS
GENERATE-ATOMIC-CSS-CONTENT-STARTS */
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
/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */
`;
  const generated2 = genAtomic(ref2, {
    includeConfig: true,
    includeHeadsAndTails: true
  }).result;
  t.is(generated2, ref2, "05.04.01");
  t.is(
    generated2,
    genAtomic(generated2, {
      includeConfig: true,
      includeHeadsAndTails: true
    }).result,
    "05.04.02"
  );
});

test(`05.05 - ${`\u001b[${34}m${`config requested but not present`}\u001b[${39}m`} - but no heads tails incoming, fully custom range`, t => {
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
  }).result;

  t.is(generated, ref, "05.05.01");

  // second cycle should not change anything since it's the same config
  t.is(
    generated,
    genAtomic(generated, {
      includeConfig: true,
      includeHeadsAndTails: true
    }).result,
    "05.05.02"
  );
});

test(`05.06 - ${`\u001b[${34}m${`config requested but not present`}\u001b[${39}m`} - only content heads/tails, no content around`, t => {
  const source = `
.pt$$$ { padding-top: $$$rem !important; }\t|\t3\t|
|.pr$$$ { padding-right: $$$vmax !important; }\t|\t99\t|\t101\t
`.trim();
  const ref = `/* ${CONFIGHEAD}
${source}
${CONFIGTAIL}
${CONTENTHEAD} */
.pt0 { padding-top:    0 !important; }
.pt1 { padding-top: 1rem !important; }
.pt2 { padding-top: 2rem !important; }
.pt3 { padding-top: 3rem !important; }
.pr99  { padding-right:  99vmax !important; }
.pr100 { padding-right: 100vmax !important; }
.pr101 { padding-right: 101vmax !important; }
/* ${CONTENTTAIL} */
`;
  const generated = genAtomic(source, {
    includeConfig: true,
    includeHeadsAndTails: true
  }).result;

  t.is(generated, ref, "05.06.01");

  // second cycle should not change anything since it's the same config
  t.is(
    generated,
    genAtomic(generated, {
      includeConfig: true,
      includeHeadsAndTails: true
    }).result,
    "05.06.02"
  );
});

test(`05.07 - ${`\u001b[${34}m${`config requested but not present`}\u001b[${39}m`} - only content heads/tails, content on top`, t => {
  const source = `
.pt$$$ { padding-top: $$$rem !important; }\t|\t3\t|
|.pr$$$ { padding-right: $$$vmax !important; }\t|\t99\t|\t101\t
`.trim();
  const ref = `<div>zzz</div>
/* ${CONFIGHEAD}
${source}
${CONFIGTAIL}
${CONTENTHEAD} */
.pt0 { padding-top:    0 !important; }
.pt1 { padding-top: 1rem !important; }
.pt2 { padding-top: 2rem !important; }
.pt3 { padding-top: 3rem !important; }
.pr99  { padding-right:  99vmax !important; }
.pr100 { padding-right: 100vmax !important; }
.pr101 { padding-right: 101vmax !important; }
/* ${CONTENTTAIL} */
`;
  const generated = genAtomic(`<div>zzz</div>\n${source}`, {
    includeConfig: true,
    includeHeadsAndTails: true
  }).result;

  t.is(generated, ref, "05.07.01");

  // second cycle should not change anything since it's the same config
  t.is(
    generated,
    genAtomic(generated, {
      includeConfig: true,
      includeHeadsAndTails: true
    }).result,
    "05.07.02"
  );
});

test(`05.08 - ${`\u001b[${34}m${`config requested but not present`}\u001b[${39}m`} - retains content around, content tails`, t => {
  t.deepEqual(
    genAtomic(
      `<style>
/* GENERATE-ATOMIC-CSS-CONTENT-STARTS */
.pb$$$ { padding-bottom: $$$px !important; } | 1 | 2
.mt$$$ { margin-top: $$$px !important; } | 2
/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */
</style>
<table width="100%" border="0" cellpadding="0" cellspacing="0">
<tr>
  <td>
    zzz
  </td>
</tr>
</table>
`,
      {
        includeConfig: false,
        includeHeadsAndTails: true
      }
    ).result,
    `<style>
/* GENERATE-ATOMIC-CSS-CONTENT-STARTS */
.pb1 { padding-bottom: 1px !important; }
.pb2 { padding-bottom: 2px !important; }
.mt0 { margin-top:   0 !important; }
.mt1 { margin-top: 1px !important; }
.mt2 { margin-top: 2px !important; }
/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */
</style>
<table width="100%" border="0" cellpadding="0" cellspacing="0">
<tr>
  <td>
    zzz
  </td>
</tr>
</table>
`,

    "05.08"
  );
});

test(`05.09 - ${`\u001b[${34}m${`config requested but not present`}\u001b[${39}m`} - retains content around, config tails`, t => {
  t.deepEqual(
    genAtomic(
      `<style>
/* GENERATE-ATOMIC-CSS-CONFIG-STARTS */
.pb$$$ { padding-bottom: $$$px !important; } | 1 | 2
.mt$$$ { margin-top: $$$px !important; } | 2
/* GENERATE-ATOMIC-CSS-CONFIG-ENDS */
</style>
<table width="100%" border="0" cellpadding="0" cellspacing="0">
<tr>
  <td>
    zzz
  </td>
</tr>
</table>
`,
      {
        includeConfig: false,
        includeHeadsAndTails: true
      }
    ).result,
    `<style>
/* GENERATE-ATOMIC-CSS-CONTENT-STARTS */
.pb1 { padding-bottom: 1px !important; }
.pb2 { padding-bottom: 2px !important; }
.mt0 { margin-top:   0 !important; }
.mt1 { margin-top: 1px !important; }
.mt2 { margin-top: 2px !important; }
/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */
</style>
<table width="100%" border="0" cellpadding="0" cellspacing="0">
<tr>
  <td>
    zzz
  </td>
</tr>
</table>
`,

    "05.09"
  );
});

test(`05.10 - ${`\u001b[${34}m${`config requested but not present`}\u001b[${39}m`} - retains content around`, t => {
  t.deepEqual(
    genAtomic(
      `tra

.pb$$$ { padding-bottom: $$$px !important; } | 1 | 2

.mt$$$ { margin-top: $$$px !important; } | 2

lala`,
      {
        includeConfig: true,
        includeHeadsAndTails: true
      }
    ).result,
    `tra

/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
.pb$$$ { padding-bottom: $$$px !important; } | 1 | 2

.mt$$$ { margin-top: $$$px !important; } | 2
GENERATE-ATOMIC-CSS-CONFIG-ENDS
GENERATE-ATOMIC-CSS-CONTENT-STARTS */
.pb1 { padding-bottom: 1px !important; }
.pb2 { padding-bottom: 2px !important; }

.mt0 { margin-top:   0 !important; }
.mt1 { margin-top: 1px !important; }
.mt2 { margin-top: 2px !important; }
/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */

lala
`,

    "05.10"
  );
});

test(`05.11 - ${`\u001b[${34}m${`config requested but not present`}\u001b[${39}m`} - above there are comments followed by content`, t => {
  t.deepEqual(
    genAtomic(
      `/* tra */

<table>
.pb$$$ { padding-bottom: $$$px !important; } | 1 | 2

.mt$$$ { margin-top: $$$px !important; } | 2

lala`,
      {
        includeConfig: true,
        includeHeadsAndTails: true
      }
    ).result,
    `/* tra */

<table>
/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
.pb$$$ { padding-bottom: $$$px !important; } | 1 | 2

.mt$$$ { margin-top: $$$px !important; } | 2
GENERATE-ATOMIC-CSS-CONFIG-ENDS
GENERATE-ATOMIC-CSS-CONTENT-STARTS */
.pb1 { padding-bottom: 1px !important; }
.pb2 { padding-bottom: 2px !important; }

.mt0 { margin-top:   0 !important; }
.mt1 { margin-top: 1px !important; }
.mt2 { margin-top: 2px !important; }
/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */

lala
`,

    "05.11"
  );
});

// -----------------------------------------------------------------------------
// 06. full set present but neither config requested nor heads/tails requested
// ----class-------------------------------------------------------------------------

test(`06.01 - ${`\u001b[${35}m${`config present, not requested (neither tails)`}\u001b[${39}m`} - case #1`, t => {
  const source = `a

/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
.pb$$$ { padding-bottom: $$$px !important; } | 5 | 10

.mt$$$ { margin-top: $$$px !important; } | 1
GENERATE-ATOMIC-CSS-CONFIG-ENDS
GENERATE-ATOMIC-CSS-CONTENT-STARTS */

tralala

/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */

z`;
  t.is(
    genAtomic(source, {
      includeConfig: false,
      includeHeadsAndTails: false
    }).result,
    `a

.pb5  { padding-bottom:  5px !important; }
.pb6  { padding-bottom:  6px !important; }
.pb7  { padding-bottom:  7px !important; }
.pb8  { padding-bottom:  8px !important; }
.pb9  { padding-bottom:  9px !important; }
.pb10 { padding-bottom: 10px !important; }

.mt0 { margin-top:   0 !important; }
.mt1 { margin-top: 1px !important; }

z
`,
    "06.01"
  );
});

test(`06.02 - ${`\u001b[${35}m${`config present, not requested (neither tails)`}\u001b[${39}m`} - case #2`, t => {
  const source = `a

/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
.pb$$$ { padding-bottom: $$$px !important; } | 5 | 10

.mt$$$ { margin-top: $$$px !important; } | 1
GENERATE-ATOMIC-CSS-CONFIG-ENDS
GENERATE-ATOMIC-CSS-CONTENT-STARTS */

tralala

/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */

z`;
  t.is(
    genAtomic(source, {
      includeConfig: false,
      includeHeadsAndTails: true
    }).result,
    `a

/* GENERATE-ATOMIC-CSS-CONTENT-STARTS */
.pb5  { padding-bottom:  5px !important; }
.pb6  { padding-bottom:  6px !important; }
.pb7  { padding-bottom:  7px !important; }
.pb8  { padding-bottom:  8px !important; }
.pb9  { padding-bottom:  9px !important; }
.pb10 { padding-bottom: 10px !important; }

.mt0 { margin-top:   0 !important; }
.mt1 { margin-top: 1px !important; }
/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */

z
`,
    "06.02"
  );
});

test(`06.03 - ${`\u001b[${35}m${`config present, not requested (neither tails)`}\u001b[${39}m`} - case #3`, t => {
  const source = `a

/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
.pb$$$ { padding-bottom: $$$px !important; } | 5 | 10

.mt$$$ { margin-top: $$$px !important; } | 1
GENERATE-ATOMIC-CSS-CONFIG-ENDS
GENERATE-ATOMIC-CSS-CONTENT-STARTS */

tralala

/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */

z`;
  t.is(
    genAtomic(source, {
      includeConfig: true,
      includeHeadsAndTails: false
    }).result,
    `a

/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
.pb$$$ { padding-bottom: $$$px !important; } | 5 | 10

.mt$$$ { margin-top: $$$px !important; } | 1
GENERATE-ATOMIC-CSS-CONFIG-ENDS
GENERATE-ATOMIC-CSS-CONTENT-STARTS */
.pb5  { padding-bottom:  5px !important; }
.pb6  { padding-bottom:  6px !important; }
.pb7  { padding-bottom:  7px !important; }
.pb8  { padding-bottom:  8px !important; }
.pb9  { padding-bottom:  9px !important; }
.pb10 { padding-bottom: 10px !important; }

.mt0 { margin-top:   0 !important; }
.mt1 { margin-top: 1px !important; }
/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */

z
`,
    "06.03"
  );
});

// -----------------------------------------------------------------------------
// 07. opts.configOverride
// -----------------------------------------------------------------------------

test(`07.01 - ${`\u001b[${36}m${`config override`}\u001b[${39}m`} - no $$$ anywhere (both in override and existing) - control`, t => {
  const source = `a

/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
zzz
GENERATE-ATOMIC-CSS-CONFIG-ENDS
GENERATE-ATOMIC-CSS-CONTENT-STARTS */
yyy
/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */

z`;
  t.is(
    genAtomic(source, {
      includeConfig: false,
      includeHeadsAndTails: false
    }).result,
    `a

zzz

z
`,
    "07.01"
  );
});

test(`07.02 - ${`\u001b[${36}m${`config override`}\u001b[${39}m`} - no $$$ anywhere (both in override and existing) - config/tails off`, t => {
  const source = `a

/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
zzz
GENERATE-ATOMIC-CSS-CONFIG-ENDS
GENERATE-ATOMIC-CSS-CONTENT-STARTS */
yyy
/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */

z`;
  t.is(
    genAtomic(source, {
      includeConfig: false,
      includeHeadsAndTails: false,
      configOverride: `.mt$$$ { margin-top: $$$px; }|3`
    }).result,
    `a

.mt0 { margin-top:   0; }
.mt1 { margin-top: 1px; }
.mt2 { margin-top: 2px; }
.mt3 { margin-top: 3px; }

z
`,
    "07.02"
  );
});

test(`07.03 - ${`\u001b[${36}m${`config override`}\u001b[${39}m`} - no $$$ anywhere (both in override and existing) - only tails on`, t => {
  const source = `a

/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
zzz
GENERATE-ATOMIC-CSS-CONFIG-ENDS
GENERATE-ATOMIC-CSS-CONTENT-STARTS */
yyy
/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */

z`;
  t.is(
    genAtomic(source, {
      includeConfig: false,
      includeHeadsAndTails: true,
      configOverride: `.mt$$$ { margin-top: $$$px; }|3`
    }).result,
    `a

/* GENERATE-ATOMIC-CSS-CONTENT-STARTS */
.mt0 { margin-top:   0; }
.mt1 { margin-top: 1px; }
.mt2 { margin-top: 2px; }
.mt3 { margin-top: 3px; }
/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */

z
`,
    "07.03"
  );
});

test(`07.04 - ${`\u001b[${36}m${`config override`}\u001b[${39}m`} - no $$$ anywhere (both in override and existing) - config & tails on`, t => {
  const source = `a

/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
zzz
GENERATE-ATOMIC-CSS-CONFIG-ENDS
GENERATE-ATOMIC-CSS-CONTENT-STARTS */
yyy
/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */

z`;

  // notice how override gets written into top config section:
  t.is(
    genAtomic(source, {
      includeConfig: true,
      configOverride: `.mt$$$ { margin-top: $$$px; }|3`
    }).result,
    `a

/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
.mt$$$ { margin-top: $$$px; }|3
GENERATE-ATOMIC-CSS-CONFIG-ENDS
GENERATE-ATOMIC-CSS-CONTENT-STARTS */
.mt0 { margin-top:   0; }
.mt1 { margin-top: 1px; }
.mt2 { margin-top: 2px; }
.mt3 { margin-top: 3px; }
/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */

z
`,
    "07.04"
  );
});

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
  }).result;
  t.true(generated.split("\n").length > 500, "99.03.01");
  t.true(counterArr.length > 98, "99.03.02");
});
