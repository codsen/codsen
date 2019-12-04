const t = require("tap");
const {
  genAtomic,
  version,
  headsAndTails,
  extractFromToSource
} = require("../dist/generate-atomic-css.cjs");

const { CONFIGHEAD, CONFIGTAIL, CONTENTHEAD, CONTENTTAIL } = headsAndTails;

const allOptsVariations = [
  {
    includeConfig: true,
    includeHeadsAndTails: true,
    pad: true
  },
  {
    includeConfig: true,
    includeHeadsAndTails: true,
    pad: false
  },
  {
    includeConfig: true,
    includeHeadsAndTails: false,
    pad: true
  },
  {
    includeConfig: false,
    includeHeadsAndTails: true,
    pad: true
  },
  {
    includeConfig: false,
    includeHeadsAndTails: false,
    pad: true
  },
  {
    includeConfig: false,
    includeHeadsAndTails: true,
    pad: false
  },
  {
    includeConfig: true,
    includeHeadsAndTails: false,
    pad: false
  },
  {
    includeConfig: false,
    includeHeadsAndTails: false,
    pad: false
  }
];

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

t.test(
  `01.01 - ${`\u001b[${31}m${`throws`}\u001b[${39}m`} - wrong/missing input`,
  t => {
    t.throws(() => {
      genAtomic();
    }, /THROW_ID_01/g);
    t.end();
  }
);

t.test(
  `01.02 - ${`\u001b[${31}m${`throws`}\u001b[${39}m`} - undefined literal`,
  t => {
    t.throws(() => {
      genAtomic(undefined);
    }, /THROW_ID_01/g);
    t.end();
  }
);

t.test(`01.03 - ${`\u001b[${31}m${`throws`}\u001b[${39}m`} - numbers`, t => {
  t.throws(() => {
    genAtomic(1);
  }, /THROW_ID_01/g);
  t.end();
});

t.test(`01.04 - ${`\u001b[${31}m${`throws`}\u001b[${39}m`} - null`, t => {
  t.throws(() => {
    genAtomic(null);
  }, /THROW_ID_01/g);
  t.end();
});

t.test(`01.05 - ${`\u001b[${31}m${`throws`}\u001b[${39}m`} - bools`, t => {
  t.throws(() => {
    genAtomic(true);
  }, /THROW_ID_01/g);
  t.end();
});

// -----------------------------------------------------------------------------
// 02. taster
// -----------------------------------------------------------------------------

t.test(
  `02.01 - ${`\u001b[${33}m${`taster`}\u001b[${39}m`} - no $$$ - oneliner`,
  t => {
    const source = "zzz";
    t.same(
      genAtomic(source, {
        includeConfig: true,
        includeHeadsAndTails: true
      }),
      {
        result: source,
        log: {
          count: 0
        }
      },
      "02.01.01"
    );
    t.same(
      genAtomic(source, {
        includeConfig: true,
        includeHeadsAndTails: false
      }),
      {
        result: source,
        log: {
          count: 0
        }
      },
      "02.01.02"
    );
    t.same(
      genAtomic(source, {
        includeConfig: false,
        includeHeadsAndTails: true
      }),
      {
        result: source,
        log: {
          count: 0
        }
      },
      "02.01.03"
    );
    t.same(
      genAtomic(source, {
        includeConfig: false,
        includeHeadsAndTails: false
      }),
      {
        result: source,
        log: {
          count: 0
        }
      },
      "02.01.04"
    );
    t.end();
  }
);

t.test(
  `02.02 - ${`\u001b[${33}m${`taster`}\u001b[${39}m`} - no $$$ - multiliner`,
  t => {
    const source =
      "zzz\n\t\t\tyyyyy\ntralala\none dollar here $\ntwo dollars here $$\n";
    t.equal(
      genAtomic(source, {
        includeConfig: true,
        includeHeadsAndTails: true
      }).result,
      source,
      "02.02.01"
    );
    t.equal(
      genAtomic(source, {
        includeConfig: true,
        includeHeadsAndTails: false
      }).result,
      source,
      "02.02.02"
    );
    t.equal(
      genAtomic(source, {
        includeConfig: false,
        includeHeadsAndTails: true
      }).result,
      source,
      "02.02.03"
    );
    t.equal(
      genAtomic(source, {
        includeConfig: false,
        includeHeadsAndTails: false
      }).result,
      source,
      "02.02.04"
    );
    t.end();
  }
);

t.test(
  `02.03 - ${`\u001b[${33}m${`taster`}\u001b[${39}m`} - defaults, empty content`,
  t => {
    t.same(
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
    t.end();
  }
);

t.test(
  `02.04 - ${`\u001b[${33}m${`taster`}\u001b[${39}m`} - defaults, empty content, no pad`,
  t => {
    t.same(
      genAtomic(
        `111
222
/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
| .pt$$$ { padding-top: $$$px !important; }|0|3|

| .mt$$$ { margin-top: $$$px !important; }|0|3|
GENERATE-ATOMIC-CSS-CONFIG-ENDSGENERATE-ATOMIC-CSS-CONTENT-STARTSGENERATE-ATOMIC-CSS-CONTENT-ENDS */
333
444
`,
        { pad: false }
      ).result,
      `111
222
/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
| .pt$$$ { padding-top: $$$px !important; }|0|3|

| .mt$$$ { margin-top: $$$px !important; }|0|3|
GENERATE-ATOMIC-CSS-CONFIG-ENDS
GENERATE-ATOMIC-CSS-CONTENT-STARTS */
 .pt0 { padding-top: 0 !important; }
 .pt1 { padding-top: 1px !important; }
 .pt2 { padding-top: 2px !important; }
 .pt3 { padding-top: 3px !important; }

 .mt0 { margin-top: 0 !important; }
 .mt1 { margin-top: 1px !important; }
 .mt2 { margin-top: 2px !important; }
 .mt3 { margin-top: 3px !important; }
/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */
333
444
`,
      "02.04"
    );
    t.end();
  }
);

t.test(
  `02.05 - ${`\u001b[${33}m${`taster`}\u001b[${39}m`} - placeholder in the middle of the name, ends with px`,
  t => {
    t.same(
      genAtomic(
        `/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
|   .pt$$$px[lang|=en] { padding-top: $$$px !important } | 0 | 2 |
GENERATE-ATOMIC-CSS-CONFIG-ENDSGENERATE-ATOMIC-CSS-CONTENT-STARTSGENERATE-ATOMIC-CSS-CONTENT-ENDS */`
      ).result,
      `/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
|   .pt$$$px[lang|=en] { padding-top: $$$px !important } | 0 | 2 |
GENERATE-ATOMIC-CSS-CONFIG-ENDS
GENERATE-ATOMIC-CSS-CONTENT-STARTS */
   .pt0px[lang|=en] { padding-top:   0 !important }
   .pt1px[lang|=en] { padding-top: 1px !important }
   .pt2px[lang|=en] { padding-top: 2px !important }
/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */
`,
      "02.05"
    );
    t.end();
  }
);

t.test(
  `02.06 - ${`\u001b[${33}m${`taster`}\u001b[${39}m`} - placeholder in the middle of the name, ends with px`,
  t => {
    t.same(
      genAtomic(
        `/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
|   .pt$$$px[lang|=en] { padding-top: $$$px !important } | 0 | 10 |
GENERATE-ATOMIC-CSS-CONFIG-ENDSGENERATE-ATOMIC-CSS-CONTENT-STARTSGENERATE-ATOMIC-CSS-CONTENT-ENDS */`
      ).result,
      `/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
|   .pt$$$px[lang|=en] { padding-top: $$$px !important } | 0 | 10 |
GENERATE-ATOMIC-CSS-CONFIG-ENDS
GENERATE-ATOMIC-CSS-CONTENT-STARTS */
   .pt0px[lang|=en]  { padding-top:    0 !important }
   .pt1px[lang|=en]  { padding-top:  1px !important }
   .pt2px[lang|=en]  { padding-top:  2px !important }
   .pt3px[lang|=en]  { padding-top:  3px !important }
   .pt4px[lang|=en]  { padding-top:  4px !important }
   .pt5px[lang|=en]  { padding-top:  5px !important }
   .pt6px[lang|=en]  { padding-top:  6px !important }
   .pt7px[lang|=en]  { padding-top:  7px !important }
   .pt8px[lang|=en]  { padding-top:  8px !important }
   .pt9px[lang|=en]  { padding-top:  9px !important }
   .pt10px[lang|=en] { padding-top: 10px !important }
/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */
`,
      "02.06"
    );
    t.end();
  }
);

t.test(
  `02.07 - ${`\u001b[${33}m${`taster`}\u001b[${39}m`} - placeholder in the middle of the name, ends with p`,
  t => {
    t.same(
      genAtomic(
        `/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
| .pt$$$p { padding-top: $$$% !important; }|0|3|
GENERATE-ATOMIC-CSS-CONFIG-ENDSGENERATE-ATOMIC-CSS-CONTENT-STARTSGENERATE-ATOMIC-CSS-CONTENT-ENDS */
`
      ).result,
      `/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
| .pt$$$p { padding-top: $$$% !important; }|0|3|
GENERATE-ATOMIC-CSS-CONFIG-ENDS
GENERATE-ATOMIC-CSS-CONTENT-STARTS */
 .pt0p { padding-top:  0 !important; }
 .pt1p { padding-top: 1% !important; }
 .pt2p { padding-top: 2% !important; }
 .pt3p { padding-top: 3% !important; }
/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */
`,
      "02.07"
    );
    t.end();
  }
);

t.test(
  `02.08 - ${`\u001b[${33}m${`taster`}\u001b[${39}m`} - starts with a placeholder (not legit)`,
  t => {
    t.same(
      genAtomic(
        `/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
| .pt$$$p { padding-top: $$$px !important; }|0|3|
GENERATE-ATOMIC-CSS-CONFIG-ENDSGENERATE-ATOMIC-CSS-CONTENT-STARTSGENERATE-ATOMIC-CSS-CONTENT-ENDS */
`
      ).result,
      `/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
| .pt$$$p { padding-top: $$$px !important; }|0|3|
GENERATE-ATOMIC-CSS-CONFIG-ENDS
GENERATE-ATOMIC-CSS-CONTENT-STARTS */
 .pt0p { padding-top:   0 !important; }
 .pt1p { padding-top: 1px !important; }
 .pt2p { padding-top: 2px !important; }
 .pt3p { padding-top: 3px !important; }
/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */
`,
      "02.08"
    );
    t.end();
  }
);

// -----------------------------------------------------------------------------
// 03. generates from an input string, returns it - config + heads/tails off
// -----------------------------------------------------------------------------

t.test(
  `03.01 - ${`\u001b[${33}m${`no config, no heads/tails requested`}\u001b[${39}m`} - defaults, empty content`,
  t => {
    const source = ".pt$$$ { padding-top: $$$px !important; }";
    const generated = genAtomic(source, {
      includeConfig: false,
      includeHeadsAndTails: false
    }).result;
    t.equal(generated.trim().split("\n").length, 501, "03.01.01");
    t.ok(generated.includes("padding-top:     0 !important", "03.01.02"));
    t.ok(generated.includes("padding-top: 500px !important", "03.01.03"));
    t.ok(
      generated.includes(
        ".pt401 { padding-top: 401px !important; }",
        "03.01.04"
      )
    );
    t.end();
  }
);

t.test(
  `03.02 - ${`\u001b[${33}m${`no config, no heads/tails requested`}\u001b[${39}m`} - min max set #1`,
  t => {
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

    t.equal(generated1, ref, "03.02.01");
    t.equal(generated2, ref, "03.02.02");
    t.end();
  }
);

t.test(
  `03.03 - ${`\u001b[${33}m${`no config, no heads/tails requested`}\u001b[${39}m`} - min max set #2`,
  t => {
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

    t.equal(generated, ref, "03.03.01");
    t.end();
  }
);

// -----------------------------------------------------------------------------
// 04. generates from an input string, returns it, heads only requested
// -----------------------------------------------------------------------------

t.test(
  `04.01 - ${`\u001b[${35}m${`no config, only heads/tails requested`}\u001b[${39}m`} - but no heads tails incoming, default range`,
  t => {
    const source = ".pt$$$ { padding-top: $$$px !important; }";
    const generated = genAtomic(source, {
      includeConfig: false,
      includeHeadsAndTails: true
    }).result;
    t.equal(generated.split("\n").length, 504, "04.01.01");
    t.ok(generated.includes("padding-top:     0 !important", "04.01.02"));
    t.ok(generated.includes("padding-top: 500px !important", "04.01.03"));
    t.ok(
      generated.includes(
        ".pt401 { padding-top: 401px !important; }",
        "04.01.04"
      )
    );

    // without config we can't do a second cycle so unit test ends here
    t.end();
  }
);

t.test(
  `04.02 - ${`\u001b[${35}m${`no config, only heads/tails requested`}\u001b[${39}m`} - but no heads tails incoming, capped upper`,
  t => {
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

    t.equal(generated1, ref, "04.02.01");
    t.equal(generated2, ref, "04.02.02");

    // without config we can't do a second cycle so unit test ends here
    t.end();
  }
);

t.test(
  `04.03 - ${`\u001b[${35}m${`no config, only heads/tails requested`}\u001b[${39}m`} - but no heads tails incoming, fully custom range`,
  t => {
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

    t.equal(generated, ref, "04.03");
    // without config we can't do a second cycle so unit test ends here
    t.end();
  }
);

t.test(
  `04.04 - ${`\u001b[${35}m${`no config, only heads/tails requested`}\u001b[${39}m`} - incoming content heads without opening comment and content in front`,
  t => {
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
    t.equal(generated, ref, "04.04");
    // without config we can't do a second cycle so unit test ends here
    t.end();
  }
);

t.test(
  `04.05 - ${`\u001b[${35}m${`no config, only heads/tails requested`}\u001b[${39}m`} - incoming content heads without opening comment and comments clash`,
  t => {
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

    t.equal(generated, ref, "04.05");

    // without config we can't do a second cycle so unit test ends here
    t.end();
  }
);

t.test(
  `04.06 - ${`\u001b[${35}m${`no config, only heads/tails requested`}\u001b[${39}m`} - content's heads and tails instead of config's heads and tails`,
  t => {
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

    t.equal(generated, ref, "04.06");

    // without config we can't do a second cycle so unit test ends here
    t.end();
  }
);

t.test(
  `04.07 - ${`\u001b[${35}m${`no config, only heads/tails requested`}\u001b[${39}m`} - blank content heads/tails`,
  t => {
    const contents = `\t\n\n \t\t\t   \t`;
    const input = `
${CONTENTHEAD}${contents}${CONTENTTAIL}
`;
    t.equal(
      genAtomic(input, {
        includeConfig: false,
        includeHeadsAndTails: false
      }).result,
      "",
      "04.07.01"
    );
    t.equal(
      genAtomic(input, {
        includeConfig: false,
        includeHeadsAndTails: true
      }).result,
      "",
      "04.07.02"
    );
    t.equal(
      genAtomic(input, {
        includeConfig: true,
        includeHeadsAndTails: false
      }).result,
      "",
      "04.07.03"
    );
    t.equal(
      genAtomic(input, {
        includeConfig: true,
        includeHeadsAndTails: true
      }).result,
      "",
      "04.07.04"
    );
    t.end();
  }
);

t.test(
  `04.08 - ${`\u001b[${35}m${`no config, only heads/tails requested`}\u001b[${39}m`} - blank config heads/tails`,
  t => {
    const input = `
${CONTENTHEAD}
\t\n\n \t\t\t   \t
${CONTENTTAIL}
`;
    t.equal(
      genAtomic(input, {
        includeConfig: false,
        includeHeadsAndTails: false
      }).result,
      "",
      "04.08.01"
    );
    t.equal(
      genAtomic(input, {
        includeConfig: false,
        includeHeadsAndTails: true
      }).result,
      "",
      "04.08.02"
    );
    t.equal(
      genAtomic(input, {
        includeConfig: true,
        includeHeadsAndTails: false
      }).result,
      "",
      "04.08.03"
    );
    t.equal(
      genAtomic(input, {
        includeConfig: true,
        includeHeadsAndTails: true
      }).result,
      "",
      "04.08.04"
    );
    t.end();
  }
);

t.test(
  `04.09 - ${`\u001b[${35}m${`no config, only heads/tails requested`}\u001b[${39}m`} - retains content around`,
  t => {
    t.same(
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
    t.end();
  }
);

t.test(
  `04.10 - ${`\u001b[${35}m${`no config, only heads/tails requested`}\u001b[${39}m`} - retains content around, incl. tails`,
  t => {
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
    t.same(
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
    t.equal(log.count, 5, "04.10.02");
    t.end();
  }
);

t.test(
  `04.11 - ${`\u001b[${35}m${`no config, only heads/tails requested`}\u001b[${39}m`} - retains content around, incl. config tails`,
  t => {
    t.same(
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
    t.end();
  }
);

t.test(
  `04.12 - ${`\u001b[${35}m${`no config, only heads/tails requested`}\u001b[${39}m`} - incl. config tails, one comment block`,
  t => {
    t.same(
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
    t.end();
  }
);

t.test(
  `04.13 - ${`\u001b[${31}m${`config, heads/tails requested`}\u001b[${39}m`} - retains content around`,
  t => {
    t.same(
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
    t.end();
  }
);

t.test(
  `04.14 - ${`\u001b[${31}m${`config, heads/tails requested`}\u001b[${39}m`} - retains content around, incl. tails`,
  t => {
    t.same(
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
    t.end();
  }
);

t.test(
  `04.15 - ${`\u001b[${31}m${`config, heads/tails requested`}\u001b[${39}m`} - retains content around, incl. config tails`,
  t => {
    t.same(
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
    t.end();
  }
);

t.test(
  `04.16 - ${`\u001b[${31}m${`config, heads/tails requested`}\u001b[${39}m`} - incl. config tails, one comment block`,
  t => {
    t.same(
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
    t.end();
  }
);

t.test(
  `04.19 - ${`\u001b[${35}m${`config present no config requested`}\u001b[${39}m`} - comments surrounding`,
  t => {
    t.same(
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
    t.end();
  }
);

t.test(
  `04.20 - ${`\u001b[${35}m${`content tails present no config requested`}\u001b[${39}m`} - comments surrounding`,
  t => {
    t.same(
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
    t.end();
  }
);

t.test(
  `04.21 - ${`\u001b[${35}m${`no config, only heads/tails requested`}\u001b[${39}m`} - but no heads tails incoming, capped upper`,
  t => {
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
    t.equal(generated, ref, "04.21");
    t.end();
  }
);

t.test(
  `04.22 - ${`\u001b[${35}m${`no config, only heads/tails requested`}\u001b[${39}m`} - head missing`,
  t => {
    t.same(
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
    t.end();
  }
);

// -----------------------------------------------------------------------------
// 05. generates from an input string, config requested but not present
// -----------------------------------------------------------------------------

t.test(
  `05.01 - ${`\u001b[${34}m${`config requested but not present`}\u001b[${39}m`} - but no heads tails incoming, default range`,
  t => {
    const source = ".pt$$$ { padding-top: $$$px !important; }";
    const generated = genAtomic(source, {
      includeConfig: true,
      includeHeadsAndTails: true
    }).result;
    t.equal(generated.split("\n").length, 507, "05.01.01");
    t.ok(generated.includes("padding-top:     0 !important", "05.01.02"));
    t.ok(generated.includes("padding-top:   5px !important", "05.01.03"));
    t.ok(generated.includes("padding-top:  50px !important", "05.01.04"));
    t.ok(generated.includes("padding-top: 500px !important", "05.01.05"));
    t.ok(
      generated.includes(
        ".pt401 { padding-top: 401px !important; }",
        "05.01.06"
      )
    );

    t.ok(generated.includes(CONFIGHEAD, "05.01.07"));
    t.ok(generated.includes(CONFIGTAIL, "05.01.08"));
    t.ok(generated.includes(CONTENTHEAD, "05.01.09"));
    t.ok(generated.includes(CONTENTTAIL, "05.01.10"));
    t.end();
  }
);

t.test(
  `05.02 - ${`\u001b[${34}m${`config requested but not present`}\u001b[${39}m`} - but no heads tails incoming, capped upper`,
  t => {
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

    t.equal(generated1, ref1, "05.02.01");
    t.equal(generated2, ref2, "05.02.02");
    t.end();
  }
);

t.test(
  `05.03 - ${`\u001b[${34}m${`config requested but not present`}\u001b[${39}m`} - but no heads tails incoming, capped upper - second cycle`,
  t => {
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

    t.equal(result, ref1, "05.03.01");
    t.equal(log.count, 18, "05.03.02");
    t.equal(
      result,
      genAtomic(result, {
        includeConfig: true,
        includeHeadsAndTails: true
      }).result,
      "05.03.03"
    );
    t.end();
  }
);

t.test(
  `05.04 - ${`\u001b[${34}m${`config requested but not present`}\u001b[${39}m`} - but no heads tails incoming, capped upper - second cycle`,
  t => {
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
    t.equal(generated2, ref2, "05.04.01");
    t.equal(
      generated2,
      genAtomic(generated2, {
        includeConfig: true,
        includeHeadsAndTails: true
      }).result,
      "05.04.02"
    );
    t.end();
  }
);

t.test(
  `05.05 - ${`\u001b[${34}m${`config requested but not present`}\u001b[${39}m`} - but no heads tails incoming, fully custom range`,
  t => {
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

    t.equal(generated, ref, "05.05.01");

    // second cycle should not change anything since it's the same config
    t.equal(
      generated,
      genAtomic(generated, {
        includeConfig: true,
        includeHeadsAndTails: true
      }).result,
      "05.05.02"
    );
    t.end();
  }
);

t.test(
  `05.06 - ${`\u001b[${34}m${`config requested but not present`}\u001b[${39}m`} - only content heads/tails, no content around`,
  t => {
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

    t.equal(generated, ref, "05.06.01");

    // second cycle should not change anything since it's the same config
    t.equal(
      generated,
      genAtomic(generated, {
        includeConfig: true,
        includeHeadsAndTails: true
      }).result,
      "05.06.02"
    );
    t.end();
  }
);

t.test(
  `05.07 - ${`\u001b[${34}m${`config requested but not present`}\u001b[${39}m`} - only content heads/tails, content on top`,
  t => {
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

    t.equal(generated, ref, "05.07.01");

    // second cycle should not change anything since it's the same config
    t.equal(
      generated,
      genAtomic(generated, {
        includeConfig: true,
        includeHeadsAndTails: true
      }).result,
      "05.07.02"
    );
    t.end();
  }
);

t.test(
  `05.08 - ${`\u001b[${34}m${`config requested but not present`}\u001b[${39}m`} - retains content around, content tails`,
  t => {
    t.same(
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
    t.end();
  }
);

t.test(
  `05.09 - ${`\u001b[${34}m${`config requested but not present`}\u001b[${39}m`} - retains content around, config tails`,
  t => {
    t.same(
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
    t.end();
  }
);

t.test(
  `05.10 - ${`\u001b[${34}m${`config requested but not present`}\u001b[${39}m`} - retains content around`,
  t => {
    t.same(
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
    t.end();
  }
);

t.test(
  `05.11 - ${`\u001b[${34}m${`config requested but not present`}\u001b[${39}m`} - above there are comments followed by content`,
  t => {
    t.same(
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
    t.end();
  }
);

t.test(
  `05.12 - ${`\u001b[${34}m${`config requested but not present`}\u001b[${39}m`} - but no heads tails incoming, fully custom range, no pad`,
  t => {
    // ---------------------------------------------------------------------------

    const source = `
| .pt$$$ { padding-top: $$$px !important; } |5|10|
|.pr$$$ { padding-right: $$$px !important; } | 5|10
.pb$$$ { padding-bottom: $$$px !important; } | 5 | 10 |
`.trim();

    // ---------------------------------------------------------------------------

    const ref = `/* ${CONFIGHEAD}
${source}
${CONFIGTAIL}
${CONTENTHEAD} */
 .pt5 { padding-top: 5px !important; }
 .pt6 { padding-top: 6px !important; }
 .pt7 { padding-top: 7px !important; }
 .pt8 { padding-top: 8px !important; }
 .pt9 { padding-top: 9px !important; }
 .pt10 { padding-top: 10px !important; }
.pr5 { padding-right: 5px !important; }
.pr6 { padding-right: 6px !important; }
.pr7 { padding-right: 7px !important; }
.pr8 { padding-right: 8px !important; }
.pr9 { padding-right: 9px !important; }
.pr10 { padding-right: 10px !important; }
.pb5 { padding-bottom: 5px !important; }
.pb6 { padding-bottom: 6px !important; }
.pb7 { padding-bottom: 7px !important; }
.pb8 { padding-bottom: 8px !important; }
.pb9 { padding-bottom: 9px !important; }
.pb10 { padding-bottom: 10px !important; }
/* ${CONTENTTAIL} */
`;

    // ---------------------------------------------------------------------------

    const generated = genAtomic(source, {
      includeConfig: true,
      includeHeadsAndTails: true,
      pad: false
    }).result;

    // ---------------------------------------------------------------------------

    t.equal(generated, ref, "05.12.01");

    // ---------------------------------------------------------------------------

    // second cycle should not change anything since it's the same config
    t.equal(
      generated,
      genAtomic(generated, {
        includeConfig: true,
        includeHeadsAndTails: true,
        pad: false
      }).result,
      "05.12.02"
    );
    t.end();
  }
);

t.test(
  `05.13 - ${`\u001b[${34}m${`config requested but not present`}\u001b[${39}m`} - style with no $$$`,
  t => {
    // ---------------------------------------------------------------------------

    const source = `
.plr$$$ { padding-left : $$$px !important; padding-right : $$$px !important }|0|2
.db { display: block !important }
`.trim();

    // ---------------------------------------------------------------------------

    const ref = `/* ${CONFIGHEAD}
${source}
${CONFIGTAIL}
${CONTENTHEAD} */
.plr0 { padding-left : 0 !important; padding-right : 0 !important }
.plr1 { padding-left : 1px !important; padding-right : 1px !important }
.plr2 { padding-left : 2px !important; padding-right : 2px !important }
.db { display: block !important }
/* ${CONTENTTAIL} */
`;

    // ---------------------------------------------------------------------------

    const generated = genAtomic(source, {
      includeConfig: true,
      includeHeadsAndTails: true,
      pad: false
    }).result;

    // ---------------------------------------------------------------------------

    t.equal(generated, ref, "05.13.01");

    // ---------------------------------------------------------------------------

    // second cycle should not change anything since it's the same config
    t.equal(
      generated,
      genAtomic(generated, {
        includeConfig: true,
        includeHeadsAndTails: true,
        pad: false
      }).result,
      "05.13.02"
    );
    t.end();
  }
);

t.test(
  `05.14 - ${`\u001b[${34}m${`config requested but not present`}\u001b[${39}m`} - style with no $$$`,
  t => {
    // ---------------------------------------------------------------------------

    const source = `
.db { display: block!important }
.plr$$$ { padding-left: $$$px !important; padding-right: $$$px !important }|0|2
`.trim();

    // ---------------------------------------------------------------------------

    const ref = `/* ${CONFIGHEAD}
${source}
${CONFIGTAIL}
${CONTENTHEAD} */
.db { display: block!important }
.plr0 { padding-left: 0 !important; padding-right: 0 !important }
.plr1 { padding-left: 1px !important; padding-right: 1px !important }
.plr2 { padding-left: 2px !important; padding-right: 2px !important }
/* ${CONTENTTAIL} */
`;

    // ---------------------------------------------------------------------------

    const generated = genAtomic(source, {
      includeConfig: true,
      includeHeadsAndTails: true,
      pad: false
    }).result;

    // ---------------------------------------------------------------------------

    t.equal(generated, ref, "05.14.01");

    // ---------------------------------------------------------------------------

    // a second cycle should not change anything since it's the same config
    t.equal(
      generated,
      genAtomic(generated, {
        includeConfig: true,
        includeHeadsAndTails: true,
        pad: false
      }).result,
      "05.14.02"
    );
    t.end();
  }
);

t.test(
  `05.15 - ${`\u001b[${34}m${`no config requested, not present`}\u001b[${39}m`} - style with no $$$`,
  t => {
    // ---------------------------------------------------------------------------

    const source = `a

.plr$$$ { padding-left: $$$px !important; padding-right: $$$px !important }|0|2
.db { display: block!important }

b
`.trim();

    // ---------------------------------------------------------------------------

    const ref = `a

/* ${CONTENTHEAD} */
.plr0 { padding-left:   0 !important; padding-right:   0 !important }
.plr1 { padding-left: 1px !important; padding-right: 1px !important }
.plr2 { padding-left: 2px !important; padding-right: 2px !important }
.db { display: block!important }
/* ${CONTENTTAIL} */

b
`;

    // ---------------------------------------------------------------------------

    const generated = genAtomic(source, {
      includeConfig: false,
      includeHeadsAndTails: true
    }).result;

    // ---------------------------------------------------------------------------

    t.equal(generated, ref, "05.15");
    t.end();
  }
);

t.test(
  `05.16 - ${`\u001b[${34}m${`config requested but not present`}\u001b[${39}m`} - style with no $$$, no pad`,
  t => {
    // ---------------------------------------------------------------------------

    const source = `/* ${CONFIGHEAD}
.m$$$ { margin: $$$px !important }|1

.db { display: block  !important }

.p$$$ { padding: $$$px !important }|1
${CONFIGTAIL}
${CONTENTHEAD} */
.db$$$ { display: block  !important } <--- nonsense, but it does not matter
/* ${CONTENTTAIL} */
`.trim();

    // ---------------------------------------------------------------------------

    const ref = `/* ${CONTENTHEAD} */
.m0 { margin: 0 !important }
.m1 { margin: 1px !important }

.db { display: block  !important }

.p0 { padding: 0 !important }
.p1 { padding: 1px !important }
/* ${CONTENTTAIL} */
`;

    // ---------------------------------------------------------------------------

    const generated = genAtomic(source, {
      includeConfig: false,
      includeHeadsAndTails: true,
      pad: 0
    }).result;

    // ---------------------------------------------------------------------------

    t.equal(generated, ref, "05.16");
    t.end();
  }
);

t.test(
  `05.17 - ${`\u001b[${34}m${`config requested but not present`}\u001b[${39}m`} - via opts.configOverride`,
  t => {
    // ---------------------------------------------------------------------------

    const source = `/* ${CONFIGHEAD}
.m$$$ { margin: $$$px !important }|1

.db { display: block  !important }

.p$$$ { padding: $$$px !important }|1
${CONFIGTAIL}
${CONTENTHEAD} */
.db$$$ { display: block  !important } <--- nonsense, but it does not matter
/* ${CONTENTTAIL} */
`.trim();

    // ---------------------------------------------------------------------------

    const ref = `/* ${CONTENTHEAD} */
.m0 { margin: 0 !important }
.m1 { margin: 1px !important }

.db { display: block  !important }

.p0 { padding: 0 !important }
.p1 { padding: 1px !important }
/* ${CONTENTTAIL} */
`;

    // ---------------------------------------------------------------------------

    const generated = genAtomic("$$$", {
      includeConfig: false,
      includeHeadsAndTails: true,
      pad: 0,
      configOverride: source
    }).result;

    // ---------------------------------------------------------------------------

    t.equal(
      generated,
      ref,
      "05.17 - no content heads and tails - replaces whole thing with result"
    );
    t.end();
  }
);

t.test(
  `05.18 - ${`\u001b[${34}m${`no config requested, not present`}\u001b[${39}m`} - via opts.configOverride`,
  t => {
    const source = `
/* ${CONFIGHEAD}
.m$$$ { margin: $$$px !important }|1

.db { display: block  !important }

.p$$$ { padding: $$$px !important }|1
${CONFIGTAIL}
${CONTENTHEAD} */
.db$$$ { display: block  !important } <--- nonsense, but it does not matter
/* ${CONTENTTAIL} */
`.trim();
    const ref = `a

/* GENERATE-ATOMIC-CSS-CONTENT-STARTS */
.m0 { margin: 0 !important }
.m1 { margin: 1px !important }

.db { display: block  !important }

.p0 { padding: 0 !important }
.p1 { padding: 1px !important }
/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */

b
`;

    // notice no CSS comments:
    const generated = genAtomic(
      `a

GENERATE-ATOMIC-CSS-CONFIG-STARTS
tra la la
GENERATE-ATOMIC-CSS-CONFIG-ENDS
GENERATE-ATOMIC-CSS-CONTENT-STARTS
la laaa
GENERATE-ATOMIC-CSS-CONTENT-ENDS

b
`,
      {
        includeConfig: false,
        includeHeadsAndTails: true,
        pad: 0,
        configOverride: source
      }
    ).result;

    t.equal(
      generated,
      ref,
      "05.18 - with heads and tails - places generated content between content heads/tails"
    );
    t.end();
  }
);

t.test(
  `05.19 - ${`\u001b[${34}m${`config requested but not present`}\u001b[${39}m`} - via opts.configOverride`,
  t => {
    const source = `
/* ${CONFIGHEAD}
.m$$$ { margin: $$$px !important }|1

.db { display: block  !important }

.p$$$ { padding: $$$px !important }|1
${CONFIGTAIL}
${CONTENTHEAD} */
.db$$$ { display: block  !important } <--- nonsense, but it does not matter
/* ${CONTENTTAIL} */
`.trim();
    const ref = `x

/* ${CONFIGHEAD}
.m$$$ { margin: $$$px !important }|1

.db { display: block  !important }

.p$$$ { padding: $$$px !important }|1
${CONFIGTAIL}
${CONTENTHEAD} */
.m0 { margin: 0 !important }
.m1 { margin: 1px !important }

.db { display: block  !important }

.p0 { padding: 0 !important }
.p1 { padding: 1px !important }
/* ${CONTENTTAIL} */

y
`;
    const generated = genAtomic(
      `x

${CONFIGHEAD}
tra la la
${CONFIGTAIL}
${CONTENTHEAD}
la laaa
${CONTENTTAIL}

y
`,
      {
        includeConfig: true,
        includeHeadsAndTails: true,
        pad: 0,
        configOverride: source
      }
    ).result;

    t.equal(
      generated,
      ref,
      "05.19 - with heads and tails - places generated content between content heads/tails"
    );
    t.end();
  }
);

t.test(
  `05.20 - ${`\u001b[${34}m${`no config requested, not present`}\u001b[${39}m`} - via opts.configOverride #2`,
  t => {
    const source = `
/* ${CONFIGHEAD}
.m$$$ { margin: $$$px !important }|1

.db { display: block  !important }

.p$$$ { padding: $$$px !important }|1
${CONFIGTAIL}
${CONTENTHEAD} */
.db$$$ { display: block  !important } <--- nonsense, but it does not matter
/* ${CONTENTTAIL} */
`.trim();
    const ref = `a

/* GENERATE-ATOMIC-CSS-CONTENT-STARTS */
.m0 { margin: 0 !important }
.m1 { margin: 1px !important }

.db { display: block  !important }

.p0 { padding: 0 !important }
.p1 { padding: 1px !important }
/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */

b
`;

    // notice per-line CSS comments:
    const generated = genAtomic(
      `a

/* GENERATE-ATOMIC-CSS-CONFIG-STARTS */
tra la la
/* GENERATE-ATOMIC-CSS-CONFIG-ENDS */
/* GENERATE-ATOMIC-CSS-CONTENT-STARTS */
la laaa
/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */

b
`,
      {
        includeConfig: false,
        includeHeadsAndTails: true,
        pad: 0,
        configOverride: source
      }
    ).result;

    t.equal(
      generated,
      ref,
      "05.20 - with heads and tails - places generated content between content heads/tails"
    );
    t.end();
  }
);

t.test(
  `05.21 - ${`\u001b[${34}m${`no config requested, not present`}\u001b[${39}m`} - via opts.configOverride #3`,
  t => {
    const source = `
/* ${CONFIGHEAD}
.m$$$ { margin: $$$px !important }|1

.db { display: block  !important }

.p$$$ { padding: $$$px !important }|1
${CONFIGTAIL}
${CONTENTHEAD} */
.db$$$ { display: block  !important } <--- nonsense, but it does not matter
/* ${CONTENTTAIL} */
`.trim();
    const ref = `a

/* GENERATE-ATOMIC-CSS-CONTENT-STARTS */
.m0 { margin: 0 !important }
.m1 { margin: 1px !important }

.db { display: block  !important }

.p0 { padding: 0 !important }
.p1 { padding: 1px !important }
/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */

b
`;

    // notice no CSS comments:
    const generated = genAtomic(
      `a

/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
tra la la
GENERATE-ATOMIC-CSS-CONFIG-ENDS
GENERATE-ATOMIC-CSS-CONTENT-STARTS */
la laaa
/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */

b
`,
      {
        includeConfig: false,
        includeHeadsAndTails: true,
        pad: 0,
        configOverride: source
      }
    ).result;

    t.equal(
      generated,
      ref,
      "05.21 - with heads and tails - places generated content between content heads/tails"
    );
    t.end();
  }
);

// -----------------------------------------------------------------------------
// 06. full set present but neither config requested nor heads/tails requested
// ----class-------------------------------------------------------------------------

t.test(
  `06.01 - ${`\u001b[${35}m${`config present, not requested (neither tails)`}\u001b[${39}m`} - case #1`,
  t => {
    const source = `a

/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
.pb$$$ { padding-bottom: $$$px !important; } | 9 | 10

.mt$$$ { margin-top: $$$px !important; } | 1
GENERATE-ATOMIC-CSS-CONFIG-ENDS
GENERATE-ATOMIC-CSS-CONTENT-STARTS */

tralala

/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */

z`;
    t.equal(
      genAtomic(source, {
        includeConfig: false,
        includeHeadsAndTails: false
      }).result,
      `a

.pb9  { padding-bottom:  9px !important; }
.pb10 { padding-bottom: 10px !important; }

.mt0 { margin-top:   0 !important; }
.mt1 { margin-top: 1px !important; }

z
`,
      "06.01"
    );
    t.end();
  }
);

t.test(
  `06.02 - ${`\u001b[${35}m${`config present, not requested (neither tails)`}\u001b[${39}m`} - case #2`,
  t => {
    const source = `a

/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
.pb$$$${""}{padding-bottom:$$$px!important}| 5 | 10

.mt$$$${""}{margin-top:$$$px!important}| 1
GENERATE-ATOMIC-CSS-CONFIG-ENDS
GENERATE-ATOMIC-CSS-CONTENT-STARTS */

tralala

/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */

z`;
    t.equal(
      genAtomic(source, {
        includeConfig: false,
        includeHeadsAndTails: true
      }).result,
      `a

/* GENERATE-ATOMIC-CSS-CONTENT-STARTS */
.pb5 {padding-bottom: 5px!important}
.pb6 {padding-bottom: 6px!important}
.pb7 {padding-bottom: 7px!important}
.pb8 {padding-bottom: 8px!important}
.pb9 {padding-bottom: 9px!important}
.pb10{padding-bottom:10px!important}

.mt0{margin-top:  0!important}
.mt1{margin-top:1px!important}
/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */

z
`,
      "06.02"
    );
    t.end();
  }
);

t.test(
  `06.03 - ${`\u001b[${35}m${`config present, not requested (neither tails)`}\u001b[${39}m`} - case #3`,
  t => {
    const source = `a

/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
.pb$$$ { padding-bottom: $$$px !important; } | 5 | 10

.mt$$$ { margin-top: $$$px !important; } | 1
GENERATE-ATOMIC-CSS-CONFIG-ENDS
GENERATE-ATOMIC-CSS-CONTENT-STARTS */

tralala

/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */

z`;
    t.equal(
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
    t.end();
  }
);

// -----------------------------------------------------------------------------
// 07. opts.configOverride
// -----------------------------------------------------------------------------

t.test(
  `07.01 - ${`\u001b[${36}m${`config override`}\u001b[${39}m`} - no $$$ anywhere (both in override and existing) - control`,
  t => {
    const source = `a

/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
zzz
GENERATE-ATOMIC-CSS-CONFIG-ENDS
GENERATE-ATOMIC-CSS-CONTENT-STARTS */
yyy
/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */

z`;
    t.equal(
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
    t.end();
  }
);

t.test(
  `07.02 - ${`\u001b[${36}m${`config override`}\u001b[${39}m`} - no $$$ anywhere (both in override and existing) - config/tails off`,
  t => {
    const source = `a

/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
zzz
GENERATE-ATOMIC-CSS-CONFIG-ENDS
GENERATE-ATOMIC-CSS-CONTENT-STARTS */
yyy
/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */

z`;
    t.equal(
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
    t.end();
  }
);

t.test(
  `07.03 - ${`\u001b[${36}m${`config override`}\u001b[${39}m`} - no $$$ anywhere (both in override and existing) - only tails on`,
  t => {
    const source = `a

/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
zzz
GENERATE-ATOMIC-CSS-CONFIG-ENDS
GENERATE-ATOMIC-CSS-CONTENT-STARTS */
yyy
/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */

z`;
    t.equal(
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
    t.end();
  }
);

t.test(
  `07.04 - ${`\u001b[${36}m${`config override`}\u001b[${39}m`} - no $$$ anywhere (both in override and existing) - config & tails on`,
  t => {
    const source = `a

/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
zzz
GENERATE-ATOMIC-CSS-CONFIG-ENDS
GENERATE-ATOMIC-CSS-CONTENT-STARTS */
yyy
/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */

z`;

    // notice how override gets written into top config section:
    t.equal(
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
    t.end();
  }
);

// -----------------------------------------------------------------------------
// 08. heads on, config on
// -----------------------------------------------------------------------------

t.test(
  `08.01 - ${`\u001b[${33}m${`heads on, config on`}\u001b[${39}m`} - combo styles`,
  t => {
    const content = `
.plr$$$ { padding-left: $$$px!important; padding-right: $$$px!important }|0|2
.db { display: block !important }
.dib { display: inline-block !important }
`.trim();
    t.same(
      genAtomic(
        `/* ${CONFIGHEAD}
${content}
${CONFIGTAIL}
${CONTENTHEAD} */
zzz
/* ${CONTENTTAIL} */
`
      ).result,
      `/* ${CONFIGHEAD}
${content}
${CONFIGTAIL}
${CONTENTHEAD} */
.plr0 { padding-left:   0!important; padding-right:   0!important }
.plr1 { padding-left: 1px!important; padding-right: 1px!important }
.plr2 { padding-left: 2px!important; padding-right: 2px!important }
.db { display: block !important }
.dib { display: inline-block !important }
/* ${CONTENTTAIL} */
`,
      "08.01"
    );
    t.end();
  }
);

t.test(
  `08.02 - ${`\u001b[${33}m${`heads on, config on`}\u001b[${39}m`} - combo styles #2, tighter`,
  t => {
    const content = `
.plr$$$ { padding-left:$$$px!important;padding-right:$$$px!important }|0|2
.db { display: block !important }
`.trim();
    t.same(
      genAtomic(
        `/* ${CONFIGHEAD}
${content}
${CONFIGTAIL}
${CONTENTHEAD} */
zzz
/* ${CONTENTTAIL} */
`
      ).result,
      `/* ${CONFIGHEAD}
${content}
${CONFIGTAIL}
${CONTENTHEAD} */
.plr0 { padding-left:  0!important;padding-right:  0!important }
.plr1 { padding-left:1px!important;padding-right:1px!important }
.plr2 { padding-left:2px!important;padding-right:2px!important }
.db { display: block !important }
/* ${CONTENTTAIL} */
`,
      "08.02"
    );
    t.end();
  }
);

t.test(
  `08.03 - ${`\u001b[${33}m${`heads on, config on`}\u001b[${39}m`} - reports 5 generated - control`,
  t => {
    const content = `
.p$$$ { padding: $$$px !important } | 1
.zzz1 { yyy: 0 auto !important }
.zzz2 { yyy: 0 auto !important }
.zzz3 { yyy: 0 auto !important }
`.trim();

    t.same(
      genAtomic(
        `/* ${CONFIGHEAD}
${content}
${CONFIGTAIL}
${CONTENTHEAD} */
zzz
/* ${CONTENTTAIL} */
`
      ).result,
      `/* ${CONFIGHEAD}
${content}
${CONFIGTAIL}
${CONTENTHEAD} */
.p0 { padding:   0 !important }
.p1 { padding: 1px !important }
.zzz1 { yyy: 0 auto !important }
.zzz2 { yyy: 0 auto !important }
.zzz3 { yyy: 0 auto !important }
/* ${CONTENTTAIL} */
`,
      "08.03"
    );
    t.end();
  }
);

t.test(
  `08.04 - ${`\u001b[${33}m${`heads on, config on`}\u001b[${39}m`} - reports 5 generated - log/count - dollars last`,
  t => {
    const content1 = `
.zzz1 { yyy: 0 auto !important }
.zzz2 { yyy: 0 auto !important }
.zzz3 { yyy: 0 auto !important }
.p$$$ { padding: $$$px !important } | 1
`.trim();
    const content2 = `
  .p$$$ { padding: $$$px !important } | 1
.zzz1 { yyy: 0 auto !important }
.zzz2 { yyy: 0 auto !important }
.zzz3 { yyy: 0 auto !important }
`.trim();
    const content3 = `
.zzz1 { yyy: 0 auto !important }
.zzz2 { yyy: 0 auto !important }
.p$$$ { padding: $$$px !important } | 1
.zzz3 { yyy: 0 auto !important }
`.trim();

    allOptsVariations.forEach((setOfOpts, i) => {
      t.equal(
        genAtomic(
          `/* ${CONFIGHEAD}
${content1}
${CONFIGTAIL}
${CONTENTHEAD} */
zzz
/* ${CONTENTTAIL} */
`,
          setOfOpts
        ).log.count,
        5,
        `08.04.1${i} - ${JSON.stringify(setOfOpts, null, 0)}`
      );
      t.equal(
        genAtomic(
          `/* ${CONFIGHEAD}
${content2}
${CONFIGTAIL}
${CONTENTHEAD} */
zzz
/* ${CONTENTTAIL} */
`,
          setOfOpts
        ).log.count,
        5,
        `08.04.2${i} - ${JSON.stringify(setOfOpts, null, 0)}`
      );
      t.equal(
        genAtomic(
          `/* ${CONFIGHEAD}
${content3}
${CONFIGTAIL}
${CONTENTHEAD} */
zzz
/* ${CONTENTTAIL} */
`,
          setOfOpts
        ).log.count,
        5,
        `08.04.3${i} - ${JSON.stringify(setOfOpts, null, 0)}`
      );
    });

    //
    t.end();
  }
);

t.test(
  `08.05 - ${`\u001b[${33}m${`heads on, config on`}\u001b[${39}m`} - reports 5 generated - log/count - dollars last - content via opts.configOverride`,
  t => {
    const content1 = `
.zzz1 { yyy: 0 auto !important }
.zzz2 { yyy: 0 auto !important }
.zzz3 { yyy: 0 auto !important }
.p$$$ { padding: $$$px !important } | 1
`.trim();
    const content2 = `
  .p$$$ { padding: $$$px !important } | 1
.zzz1 { yyy: 0 auto !important }
.zzz2 { yyy: 0 auto !important }
.zzz3 { yyy: 0 auto !important }
`.trim();
    const content3 = `
.zzz1 { yyy: 0 auto !important }
.zzz2 { yyy: 0 auto !important }
.p$$$ { padding: $$$px !important } | 1
.zzz3 { yyy: 0 auto !important }
`.trim();

    allOptsVariations.forEach((setOfOpts, i) => {
      t.equal(
        genAtomic(
          `zzz`,
          Object.assign({}, setOfOpts, { configOverride: content1 })
        ).log.count,
        5,
        `08.05.1${i} - ${JSON.stringify(setOfOpts, null, 0)}`
      );
      t.equal(
        genAtomic(
          `/* ${CONFIGHEAD}
.tralala { $$$ }
${CONFIGTAIL}
${CONTENTHEAD} */
replace me
/* ${CONTENTTAIL} */
`,
          Object.assign({}, setOfOpts, { configOverride: content1 })
        ).log.count,
        5,
        `08.05.2${i} - ${JSON.stringify(setOfOpts, null, 0)}`
      );

      // content2
      t.equal(
        genAtomic(
          `zzz`,
          Object.assign({}, setOfOpts, { configOverride: content2 })
        ).log.count,
        5,
        `08.05.3${i} - ${JSON.stringify(setOfOpts, null, 0)}`
      );
      t.equal(
        genAtomic(
          `/* ${CONFIGHEAD}
.tralala { $$$ }
${CONFIGTAIL}
${CONTENTHEAD} */
replace me
/* ${CONTENTTAIL} */
`,
          Object.assign({}, setOfOpts, { configOverride: content2 })
        ).log.count,
        5,
        `08.05.4${i} - ${JSON.stringify(setOfOpts, null, 0)}`
      );

      // content3
      t.equal(
        genAtomic(
          `zzz`,
          Object.assign({}, setOfOpts, { configOverride: content3 })
        ).log.count,
        5,
        `08.05.5${i} - ${JSON.stringify(setOfOpts, null, 0)}`
      );
      t.equal(
        genAtomic(
          `/* ${CONFIGHEAD}
.tralala { $$$ }
${CONFIGTAIL}
${CONTENTHEAD} */
replace me
/* ${CONTENTTAIL} */
`,
          Object.assign({}, setOfOpts, { configOverride: content3 })
        ).log.count,
        5,
        `08.05.6${i} - ${JSON.stringify(setOfOpts, null, 0)}`
      );
    });
    t.end();
  }
);

t.test(
  `08.06 - ${`\u001b[${33}m${`heads on, config on`}\u001b[${39}m`} - two levels of curlies wrapping the source`,
  t => {
    const source = `@media screen and (max-width: 650px) {
  .w$$$p { width: $$$% !important }|0|2
}`;
    t.equal(
      genAtomic(source, {
        includeConfig: true,
        includeHeadsAndTails: true
      }).result,
      `/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
@media screen and (max-width: 650px) {
  .w$$$p { width: $$$% !important }|0|2
}
GENERATE-ATOMIC-CSS-CONFIG-ENDS
GENERATE-ATOMIC-CSS-CONTENT-STARTS */
@media screen and (max-width: 650px) {
  .w0p { width:  0 !important }
  .w1p { width: 1% !important }
  .w2p { width: 2% !important }
}
/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */
`,
      "08.06"
    );
    t.end();
  }
);

t.test(
  `08.07 - ${`\u001b[${33}m${`heads on, config on`}\u001b[${39}m`} - only content heads/tails`,
  t => {
    const source = `@media screen and (max-width: 650px) {
  .w$$$p { width: $$$% !important }|0|2
}`;
    t.equal(
      genAtomic(source, {
        includeConfig: false,
        includeHeadsAndTails: true
      }).result,
      `/* GENERATE-ATOMIC-CSS-CONTENT-STARTS */
@media screen and (max-width: 650px) {
  .w0p { width:  0 !important }
  .w1p { width: 1% !important }
  .w2p { width: 2% !important }
}
/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */
`,
      "08.07"
    );
    t.end();
  }
);

t.test(
  `08.08 - ${`\u001b[${33}m${`heads on, config on`}\u001b[${39}m`} - no heads/tails`,
  t => {
    const source = `@media screen and (max-width: 650px) {
  .w$$$p { width: $$$% !important }|0|2
}`;
    t.equal(
      genAtomic(source, {
        includeConfig: false,
        includeHeadsAndTails: false
      }).result,
      `@media screen and (max-width: 650px) {
  .w0p { width:  0 !important }
  .w1p { width: 1% !important }
  .w2p { width: 2% !important }
}
`,
      "08.08"
    );
    t.end();
  }
);

// -----------------------------------------------------------------------------
// 98. API bits - extractFromToSource
// -----------------------------------------------------------------------------

t.test(
  `98.01 - ${`\u001b[${33}m${`API bits`}\u001b[${39}m`} - extractFromToSource - wizard case, 1 arg`,
  t => {
    t.same(extractFromToSource("mt|10"), [0, 10, "mt"], "98.01.01");
    t.same(extractFromToSource("mt|10|"), [0, 10, "mt"], "98.01.02");
    t.same(extractFromToSource("|mt|10|"), [0, 10, "mt"], "98.01.03");
    t.same(extractFromToSource("| mt | 10 |"), [0, 10, " mt"], "98.01.04");
    t.same(extractFromToSource(" | mt | 10 | "), [0, 10, " mt"], "98.01.05");
    t.same(extractFromToSource(" | mt| 0 "), [0, 0, " mt"], "98.01.06");
    t.same(extractFromToSource(" |||| mt| 0 "), [0, 0, " mt"], "98.01.06");
    t.end();
  }
);

t.test(
  `98.02 - ${`\u001b[${33}m${`API bits`}\u001b[${39}m`} - extractFromToSource - wizard case, 2 args`,
  t => {
    t.same(extractFromToSource("mt|2|10"), [2, 10, "mt"], "98.02.01");
    t.same(extractFromToSource("mt|2|10|"), [2, 10, "mt"], "98.02.02");
    t.same(extractFromToSource("|mt|2|10|"), [2, 10, "mt"], "98.02.03");
    t.same(extractFromToSource(" mt | 2 | 10 "), [2, 10, " mt"], "98.02.04");
    t.same(extractFromToSource(" mt | 2 | 10 |"), [2, 10, " mt"], "98.02.05");
    t.same(extractFromToSource("| mt | 2 | 10 |"), [2, 10, " mt"], "98.02.06");
    t.same(
      extractFromToSource(" | mt | 2 | 10 | "),
      [2, 10, " mt"],
      "98.02.07"
    );
    t.same(extractFromToSource("  mt| 2| 10|\n"), [2, 10, "  mt"], "98.02.08");
    t.same(
      extractFromToSource("||| |  mt| 2| 10|\n"),
      [2, 10, "  mt"],
      "98.02.09"
    );
    t.end();
  }
);

t.test(
  `98.03 - ${`\u001b[${33}m${`API bits`}\u001b[${39}m`} - extractFromToSource - wizard case, 3 args`,
  t => {
    // takes first two digits
    t.same(extractFromToSource("mt|2|10|0"), [2, 10, "mt"], "98.03.01");
    t.same(extractFromToSource("mt|2|10|0|"), [2, 10, "mt"], "98.03.02");
    t.same(extractFromToSource("|mt|2|10|0|"), [2, 10, "mt"], "98.03.03");
    t.same(extractFromToSource("||||mt|2|10|0|"), [2, 10, "mt"], "98.03.04");
    t.end();
  }
);

t.test(
  `98.04 - ${`\u001b[${33}m${`API bits`}\u001b[${39}m`} - extractFromToSource - wizard case, 3 args - taster`,
  t => {
    t.same(
      extractFromToSource("mt[lang|=en]|2"),
      [0, 2, "mt[lang|=en]"],
      "98.04.01"
    );
    t.end();
  }
);

t.test(
  `98.04 - ${`\u001b[${33}m${`API bits`}\u001b[${39}m`} - extractFromToSource - wizard case, 3 args`,
  t => {
    t.same(
      extractFromToSource("mt[lang|=en]|2|10"),
      [2, 10, "mt[lang|=en]"],
      "98.04.02"
    );
    t.same(
      extractFromToSource(".mt[lang|=en]|2|"),
      [0, 2, ".mt[lang|=en]"],
      "98.04.03"
    );
    t.same(
      extractFromToSource(".mt[lang|=en]|2|10|"),
      [2, 10, ".mt[lang|=en]"],
      "98.04.04"
    );
    t.same(
      extractFromToSource("mt[lang|=en] | 2 | 10 | 0"),
      [2, 10, "mt[lang|=en]"],
      "98.04.05"
    );
    t.same(
      extractFromToSource("mt[lang|=en] | 2 | 10 | a"),
      [2, 10, "mt[lang|=en]"],
      "98.04.06"
    );
    t.same(
      extractFromToSource("|mt[lang|=en] | 2 | 10 | a"),
      [2, 10, "mt[lang|=en]"],
      "98.04.07"
    );
    t.same(
      extractFromToSource("||||mt[lang|=en] | 2 | 10 | a"),
      [2, 10, "mt[lang|=en]"],
      "98.04.08"
    );
    t.end();
  }
);

t.test(
  `98.05 - ${`\u001b[${33}m${`API bits`}\u001b[${39}m`} - extractFromToSource - generator case, 1 arg`,
  t => {
    t.same(
      extractFromToSource(".mt$$$ { margin-top: $$$px !important; } | 10"),
      [0, 10, ".mt$$$ { margin-top: $$$px !important; }"],
      "98.05.01"
    );
    t.same(
      extractFromToSource("   .mt$$$ { margin-top: $$$px !important; } | 10"),
      [0, 10, "   .mt$$$ { margin-top: $$$px !important; }"],
      "98.05.02"
    );
    t.same(
      extractFromToSource("   .mt$$$ { margin-top: $$$px !important; } | 10 "),
      [0, 10, "   .mt$$$ { margin-top: $$$px !important; }"],
      "98.05.03"
    );
    t.same(
      extractFromToSource("   .mt$$$ { margin-top: $$$px !important; } | 10 |"),
      [0, 10, "   .mt$$$ { margin-top: $$$px !important; }"],
      "98.05.04"
    );
    t.same(
      extractFromToSource(
        "   .mt$$$ { margin-top: $$$px !important; } | 10 | "
      ),
      [0, 10, "   .mt$$$ { margin-top: $$$px !important; }"],
      "98.05.05"
    );
    t.same(
      extractFromToSource(
        "|   .mt$$$ { margin-top: $$$px !important; } | 10 | "
      ),
      [0, 10, "   .mt$$$ { margin-top: $$$px !important; }"],
      "98.05.06"
    );
    t.same(
      extractFromToSource(
        "||||   .mt$$$ { margin-top: $$$px !important; } | 10 | "
      ),
      [0, 10, "   .mt$$$ { margin-top: $$$px !important; }"],
      "98.05.07"
    );
    t.end();
  }
);

t.test(
  `98.06 - ${`\u001b[${33}m${`API bits`}\u001b[${39}m`} - extractFromToSource - generator case, 2 arg`,
  t => {
    t.same(
      extractFromToSource(".mt$$$ { margin-top: $$$px !important; }|2|10"),
      [2, 10, ".mt$$$ { margin-top: $$$px !important; }"],
      "98.06.01"
    );
    t.same(
      extractFromToSource(".mt$$$ { margin-top: $$$px !important; } | 2 | 10 "),
      [2, 10, ".mt$$$ { margin-top: $$$px !important; }"],
      "98.06.02"
    );
    t.same(
      extractFromToSource(
        ".mt$$$ { margin-top: $$$px !important; } | 2 | 10 |"
      ),
      [2, 10, ".mt$$$ { margin-top: $$$px !important; }"],
      "98.06.03"
    );
    t.same(
      extractFromToSource(
        " .mt$$$ { margin-top: $$$px !important; } | 2 | 10  | "
      ),
      [2, 10, " .mt$$$ { margin-top: $$$px !important; }"],
      "98.06.04"
    );
    t.same(
      extractFromToSource(
        " .mt$$$ { margin-top: $$$px !important; } | 2 | 10  | a"
      ),
      [2, 10, " .mt$$$ { margin-top: $$$px !important; }"],
      "98.06.05"
    );
    t.same(
      extractFromToSource(
        "| .mt$$$ { margin-top: $$$px !important; } | 2 | 10  | a"
      ),
      [2, 10, " .mt$$$ { margin-top: $$$px !important; }"],
      "98.06.06"
    );
    t.same(
      extractFromToSource(
        "|| .mt$$$ { margin-top: $$$px !important; } | 2 | 10  | a |"
      ),
      [2, 10, " .mt$$$ { margin-top: $$$px !important; }"],
      "98.06.07"
    );
    t.end();
  }
);

t.test(
  `98.07 - ${`\u001b[${33}m${`API bits`}\u001b[${39}m`} - extractFromToSource - pipe in CSS`,
  t => {
    t.same(
      extractFromToSource(
        ".mt$$$[lang|=en] { margin-top: $$$px !important; }|10"
      ),
      [0, 10, ".mt$$$[lang|=en] { margin-top: $$$px !important; }"],
      "98.07.01"
    );
    t.same(
      extractFromToSource(
        ".mt$$$[lang|=en] { margin-top: $$$px !important; }|2|10"
      ),
      [2, 10, ".mt$$$[lang|=en] { margin-top: $$$px !important; }"],
      "98.07.02"
    );
    t.same(
      extractFromToSource(
        "|.mt$$$[lang|=en] { margin-top: $$$px !important; }|10|"
      ),
      [0, 10, ".mt$$$[lang|=en] { margin-top: $$$px !important; }"],
      "98.07.03"
    );
    t.same(
      extractFromToSource(
        "| .mt$$$[lang|=en] { margin-top: $$$px !important; }| 2 | 10 | "
      ),
      [2, 10, " .mt$$$[lang|=en] { margin-top: $$$px !important; }"],
      "98.07.04"
    );
    t.same(
      extractFromToSource(
        "|||| .mt$$$[lang|=en] { margin-top: $$$px !important; }| 2 | 10 | "
      ),
      [2, 10, " .mt$$$[lang|=en] { margin-top: $$$px !important; }"],
      "98.07.05"
    );
    t.end();
  }
);

// -----------------------------------------------------------------------------
// 99. API bits - the others
// -----------------------------------------------------------------------------

t.test(
  `99.01 - ${`\u001b[${33}m${`API bits`}\u001b[${39}m`} - version is exported`,
  t => {
    t.match(version, /\d+\.\d+\.\d+/g, "99.01");
    t.end();
  }
);

t.test(
  `99.02 - ${`\u001b[${33}m${`API bits`}\u001b[${39}m`} - heads and tails are exported`,
  t => {
    t.equal(Object.keys(headsAndTails).length, 4, "99.02");
    t.end();
  }
);

t.test(
  `99.03 - ${`\u001b[${33}m${`API bits`}\u001b[${39}m`} - exports reportProgressFunc which works`,
  t => {
    const counterArr = [];
    const source = ".pt$$$ { padding-top: $$$px !important; }";
    const generated = genAtomic(source, {
      includeConfig: false,
      includeHeadsAndTails: false,
      reportProgressFunc: perc => {
        counterArr.push(perc);
      }
    }).result;
    t.ok(generated.split("\n").length > 500, "99.03.01");
    t.ok(counterArr.length > 98, "99.03.02");
    t.end();
  }
);
