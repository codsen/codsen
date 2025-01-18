import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import {
  genAtomic,
  version,
  headsAndTails,
  extractFromToSource,
} from "../dist/generate-atomic-css.esm.js";

const { CONFIGHEAD, CONFIGTAIL, CONTENTHEAD, CONTENTTAIL } = headsAndTails;

const allOptsVariations = [
  {
    includeConfig: true,
    includeHeadsAndTails: true,
    pad: true,
  },
  {
    includeConfig: true,
    includeHeadsAndTails: true,
    pad: false,
  },
  {
    includeConfig: true,
    includeHeadsAndTails: false,
    pad: true,
  },
  {
    includeConfig: false,
    includeHeadsAndTails: true,
    pad: true,
  },
  {
    includeConfig: false,
    includeHeadsAndTails: false,
    pad: true,
  },
  {
    includeConfig: false,
    includeHeadsAndTails: true,
    pad: false,
  },
  {
    includeConfig: true,
    includeHeadsAndTails: false,
    pad: false,
  },
  {
    includeConfig: false,
    includeHeadsAndTails: false,
    pad: false,
  },
];

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${31}m${"throws"}\u001b[${39}m`} - wrong/missing input`, () => {
  throws(
    () => {
      genAtomic();
    },
    /THROW_ID_01/g,
    "01.01",
  );
});

test(`02 - ${`\u001b[${31}m${"throws"}\u001b[${39}m`} - undefined literal`, () => {
  throws(
    () => {
      genAtomic(undefined);
    },
    /THROW_ID_01/g,
    "02.01",
  );
});

test(`03 - ${`\u001b[${31}m${"throws"}\u001b[${39}m`} - numbers`, () => {
  throws(
    () => {
      genAtomic(1);
    },
    /THROW_ID_01/g,
    "03.01",
  );
});

test(`04 - ${`\u001b[${31}m${"throws"}\u001b[${39}m`} - null`, () => {
  throws(
    () => {
      genAtomic(null);
    },
    /THROW_ID_01/g,
    "04.01",
  );
});

test(`05 - ${`\u001b[${31}m${"throws"}\u001b[${39}m`} - bools`, () => {
  throws(
    () => {
      genAtomic(true);
    },
    /THROW_ID_01/g,
    "05.01",
  );
});

// -----------------------------------------------------------------------------
// 02. taster
// -----------------------------------------------------------------------------

test("06 - no $$$ - oneliner", () => {
  let source = "zzz";
  equal(
    genAtomic(source, {
      includeConfig: true,
      includeHeadsAndTails: true,
    }),
    {
      result: source,
      log: {
        count: 0,
      },
    },
    "06.01",
  );
  equal(
    genAtomic(source, {
      includeConfig: true,
      includeHeadsAndTails: false,
    }),
    {
      result: source,
      log: {
        count: 0,
      },
    },
    "06.02",
  );
  equal(
    genAtomic(source, {
      includeConfig: false,
      includeHeadsAndTails: true,
    }),
    {
      result: source,
      log: {
        count: 0,
      },
    },
    "06.03",
  );
  equal(
    genAtomic(source, {
      includeConfig: false,
      includeHeadsAndTails: false,
    }),
    {
      result: source,
      log: {
        count: 0,
      },
    },
    "06.04",
  );
});

test("07 - no $$$ - multiliner", () => {
  let source =
    "zzz\n\t\t\tyyyyy\ntralala\none dollar here $\ntwo dollars here $$\n";
  equal(
    genAtomic(source, {
      includeConfig: true,
      includeHeadsAndTails: true,
    }).result,
    source,
    "07.01",
  );
  equal(
    genAtomic(source, {
      includeConfig: true,
      includeHeadsAndTails: false,
    }).result,
    source,
    "07.02",
  );
  equal(
    genAtomic(source, {
      includeConfig: false,
      includeHeadsAndTails: true,
    }).result,
    source,
    "07.03",
  );
  equal(
    genAtomic(source, {
      includeConfig: false,
      includeHeadsAndTails: false,
    }).result,
    source,
    "07.04",
  );
});

test("08 - defaults, empty content", () => {
  equal(
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
    "08.01",
  );
});

test("09 - defaults, empty content, no pad", () => {
  equal(
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
      { pad: false },
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
    "09.01",
  );
});

test("10 - placeholder in the middle of the name, ends with px", () => {
  equal(
    genAtomic(
      `/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
|   .pt$$$px[lang|=en] { padding-top: $$$px !important } | 0 | 2 |
GENERATE-ATOMIC-CSS-CONFIG-ENDSGENERATE-ATOMIC-CSS-CONTENT-STARTSGENERATE-ATOMIC-CSS-CONTENT-ENDS */`,
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
    "10.01",
  );
});

test("11 - placeholder in the middle of the name, ends with px", () => {
  equal(
    genAtomic(
      `/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
|   .pt$$$px[lang|=en] { padding-top: $$$px !important } | 0 | 10 |
GENERATE-ATOMIC-CSS-CONFIG-ENDSGENERATE-ATOMIC-CSS-CONTENT-STARTSGENERATE-ATOMIC-CSS-CONTENT-ENDS */`,
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
    "11.01",
  );
});

test("12 - placeholder in the middle of the name, ends with p", () => {
  equal(
    genAtomic(
      `/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
| .pt$$$p { padding-top: $$$% !important; }|0|3|
GENERATE-ATOMIC-CSS-CONFIG-ENDSGENERATE-ATOMIC-CSS-CONTENT-STARTSGENERATE-ATOMIC-CSS-CONTENT-ENDS */
`,
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
    "12.01",
  );
});

test("13 - starts with a placeholder (not legit)", () => {
  equal(
    genAtomic(
      `/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
| .pt$$$p { padding-top: $$$px !important; }|0|3|
GENERATE-ATOMIC-CSS-CONFIG-ENDSGENERATE-ATOMIC-CSS-CONTENT-STARTSGENERATE-ATOMIC-CSS-CONTENT-ENDS */
`,
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
    "13.01",
  );
});

// -----------------------------------------------------------------------------
// 03. generates from an input string, returns it - config + heads/tails off
// -----------------------------------------------------------------------------

test(`14 - ${`\u001b[${33}m${"no config, no heads/tails requested"}\u001b[${39}m`} - defaults, empty content`, () => {
  let source = ".pt$$$ { padding-top: $$$px !important; }";
  let generated = genAtomic(source, {
    includeConfig: false,
    includeHeadsAndTails: false,
  }).result;
  equal(generated.trim().split("\n").length, 501, "14.01");
  ok(generated.includes("padding-top:     0 !important", "03.01.02"), "14.02");
  ok(generated.includes("padding-top: 500px !important", "03.01.03"), "14.03");
  ok(
    generated.includes(".pt401 { padding-top: 401px !important; }", "03.01.04"),
    "14.04",
  );
});

test(`15 - ${`\u001b[${33}m${"no config, no heads/tails requested"}\u001b[${39}m`} - min max set #1`, () => {
  let source1 = `
.pt$$$ { padding-top: $$$px !important; }|0|5
.pr$$$ { padding-right: $$$px !important; }|0|5
.pb$$$ { padding-bottom: $$$px !important; }|0|5`.trim();
  // if "from" index is default, it can be omitted:
  let source2 = `
.pt$$$ { padding-top: $$$px !important; }|5
.pr$$$ { padding-right: $$$px !important; }|5
.pb$$$ { padding-bottom: $$$px !important; }|5`.trim();
  let ref = `.pt0 { padding-top:   0 !important; }
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
  let generated1 = genAtomic(source1, {
    includeConfig: false,
    includeHeadsAndTails: false,
  }).result;
  let generated2 = genAtomic(source2, {
    includeConfig: false,
    includeHeadsAndTails: false,
  }).result;

  equal(generated1, ref, "15.01");
  equal(generated2, ref, "15.02");
});

test(`16 - ${`\u001b[${33}m${"no config, no heads/tails requested"}\u001b[${39}m`} - min max set #2`, () => {
  let source = `
| .pt$$$ { padding-top: $$$px !important; } |5|10|
|.pr$$$ { padding-right: $$$px !important; } | 5|10
.pb$$$ { padding-bottom: $$$px !important; } | 5 | 10 |`.trim();
  let ref = ` .pt5  { padding-top:  5px !important; }
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
  let generated = genAtomic(source, {
    includeConfig: false,
    includeHeadsAndTails: false,
  }).result;

  equal(generated, ref, "16.01");
});

// -----------------------------------------------------------------------------
// 04. generates from an input string, returns it, heads only requested
// -----------------------------------------------------------------------------

test(`17 - ${`\u001b[${35}m${"no config, only heads/tails requested"}\u001b[${39}m`} - but no heads tails incoming, default range`, () => {
  let source = ".pt$$$ { padding-top: $$$px !important; }";
  let generated = genAtomic(source, {
    includeConfig: false,
    includeHeadsAndTails: true,
  }).result;
  equal(generated.split("\n").length, 504, "17.01");
  ok(generated.includes("padding-top:     0 !important", "04.01.02"), "17.02");
  ok(generated.includes("padding-top: 500px !important", "04.01.03"), "17.03");
  ok(
    generated.includes(".pt401 { padding-top: 401px !important; }", "04.01.04"),
    "17.04",
  );

  // without config we can't do a second cycle so unit test ends here
});

test(`18 - ${`\u001b[${35}m${"no config, only heads/tails requested"}\u001b[${39}m`} - but no heads tails incoming, capped upper`, () => {
  let source1 = `
.pt$$$ { padding-top: $$$px !important; }|0|5
.pr$$$ { padding-right: $$$px !important; }|0|5
.pb$$$ { padding-bottom: $$$px !important; }|0|5`.trim();
  // if "from" index is default, it can be omitted:
  let source2 = `
.pt$$$ { padding-top: $$$px !important; }|5
.pr$$$ { padding-right: $$$px !important; }|5
.pb$$$ { padding-bottom: $$$px !important; }|5`.trim();
  let ref = `/* ${CONTENTHEAD} */
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
  let generated1 = genAtomic(source1, {
    includeConfig: false,
    includeHeadsAndTails: true,
  }).result;
  let generated2 = genAtomic(source2, {
    includeConfig: false,
    includeHeadsAndTails: true,
  }).result;

  equal(generated1, ref, "18.01");
  equal(generated2, ref, "18.02");

  // without config we can't do a second cycle so unit test ends here
});

test(`19 - ${`\u001b[${35}m${"no config, only heads/tails requested"}\u001b[${39}m`} - but no heads tails incoming, fully custom range`, () => {
  let source = `
| .pt$$$ { padding-top: $$$px !important; } |5|10|
|.pr$$$ { padding-right: $$$px !important; } | 5|10
.pb$$$ { padding-bottom: $$$px !important; } | 5 | 10 |`.trim();
  let ref = `/* ${CONTENTHEAD} */
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
  let generated = genAtomic(source, {
    includeConfig: false,
    includeHeadsAndTails: true,
  }).result;

  equal(generated, ref, "19.01");
  // without config we can't do a second cycle so unit test ends here
});

test(`20 - ${`\u001b[${35}m${"no config, only heads/tails requested"}\u001b[${39}m`} - incoming content heads without opening comment and content in front`, () => {
  // ---------------------------------------------------------------------------

  let source = `zzz

${CONTENTHEAD}
    */

.pb$$$ { padding-bottom: $$$px !important; } | 5 | 10

.mt$$$ { margin-top: $$$px !important; } | 1

/*
     ${CONTENTTAIL}
*/`;

  // ---------------------------------------------------------------------------

  let ref = `zzz

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

  let generated = genAtomic(source, {
    includeConfig: false,
    includeHeadsAndTails: true,
  }).result;
  equal(generated, ref, "20.01");
  // without config we can't do a second cycle so unit test ends here
});

test(`21 - ${`\u001b[${35}m${"no config, only heads/tails requested"}\u001b[${39}m`} - incoming content heads without opening comment and comments clash`, () => {
  // ---------------------------------------------------------------------------

  let source = `/* zzz

${CONTENTHEAD} */

.pb$$$ { padding-bottom: $$$px !important; } | 5 | 7

.mt$$$ { margin-top: $$$px !important; } | 1

/* ${CONTENTTAIL} */`;

  // ---------------------------------------------------------------------------

  let ref = `/* zzz

/* ${CONTENTHEAD} */
.pb5 { padding-bottom: 5px !important; }
.pb6 { padding-bottom: 6px !important; }
.pb7 { padding-bottom: 7px !important; }

.mt0 { margin-top:   0 !important; }
.mt1 { margin-top: 1px !important; }
/* ${CONTENTTAIL} */
`;

  // ---------------------------------------------------------------------------

  let generated = genAtomic(source, {
    includeConfig: false,
    includeHeadsAndTails: true,
  }).result;

  // ---------------------------------------------------------------------------

  equal(generated, ref, "21.01");

  // without config we can't do a second cycle so unit test ends here
});

test(`22 - ${`\u001b[${35}m${"no config, only heads/tails requested"}\u001b[${39}m`} - content's heads and tails instead of config's heads and tails`, () => {
  let source = `/*${CONTENTHEAD}*/

.pb$$$ { padding-bottom: $$$px !important; } | 5 | 7

.mt$$$ { margin-top: $$$px !important; } | 1

/*${CONTENTTAIL}*/`;
  let ref = `/* ${CONTENTHEAD} */
.pb5 { padding-bottom: 5px !important; }
.pb6 { padding-bottom: 6px !important; }
.pb7 { padding-bottom: 7px !important; }

.mt0 { margin-top:   0 !important; }
.mt1 { margin-top: 1px !important; }
/* ${CONTENTTAIL} */
`;

  let generated = genAtomic(source, {
    includeConfig: false,
    includeHeadsAndTails: true,
  }).result;

  equal(generated, ref, "22.01");

  // without config we can't do a second cycle so unit test ends here
});

test(`23 - ${`\u001b[${35}m${"no config, only heads/tails requested"}\u001b[${39}m`} - blank content heads/tails`, () => {
  let contents = "\t\n\n \t\t\t   \t";
  let input = `
${CONTENTHEAD}${contents}${CONTENTTAIL}
`;
  equal(
    genAtomic(input, {
      includeConfig: false,
      includeHeadsAndTails: false,
    }).result,
    "",
    "23.01",
  );
  equal(
    genAtomic(input, {
      includeConfig: false,
      includeHeadsAndTails: true,
    }).result,
    "",
    "23.02",
  );
  equal(
    genAtomic(input, {
      includeConfig: true,
      includeHeadsAndTails: false,
    }).result,
    "",
    "23.03",
  );
  equal(
    genAtomic(input, {
      includeConfig: true,
      includeHeadsAndTails: true,
    }).result,
    "",
    "23.04",
  );
});

test(`24 - ${`\u001b[${35}m${"no config, only heads/tails requested"}\u001b[${39}m`} - blank config heads/tails`, () => {
  let input = `
${CONTENTHEAD}
\t\n\n \t\t\t   \t
${CONTENTTAIL}
`;
  equal(
    genAtomic(input, {
      includeConfig: false,
      includeHeadsAndTails: false,
    }).result,
    "",
    "24.01",
  );
  equal(
    genAtomic(input, {
      includeConfig: false,
      includeHeadsAndTails: true,
    }).result,
    "",
    "24.02",
  );
  equal(
    genAtomic(input, {
      includeConfig: true,
      includeHeadsAndTails: false,
    }).result,
    "",
    "24.03",
  );
  equal(
    genAtomic(input, {
      includeConfig: true,
      includeHeadsAndTails: true,
    }).result,
    "",
    "24.04",
  );
});

test(`25 - ${`\u001b[${35}m${"no config, only heads/tails requested"}\u001b[${39}m`} - retains content around`, () => {
  equal(
    genAtomic(
      `tra

.pb$$$ { padding-bottom: $$$px !important; } | 1 | 2

.mt$$$ { margin-top: $$$px !important; } | 2

lala`,
      {
        includeConfig: false,
        includeHeadsAndTails: true,
      },
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

    "25.01",
  );
});

test(`26 - ${`\u001b[${35}m${"no config, only heads/tails requested"}\u001b[${39}m`} - retains content around, incl. tails`, () => {
  let { log, result } = genAtomic(
    `tra

/* GENERATE-ATOMIC-CSS-CONTENT-STARTS */
.pb$$$ { padding-bottom: $$$px !important; } | 1 | 2

.mt$$$ { margin-top: $$$px !important; } | 2
/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */

lala`,
    {
      includeConfig: false,
      includeHeadsAndTails: true,
    },
  );
  equal(
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

    "26.01",
  );
  equal(log.count, 5, "26.02");
});

test(`27 - ${`\u001b[${35}m${"no config, only heads/tails requested"}\u001b[${39}m`} - retains content around, incl. config tails`, () => {
  equal(
    genAtomic(
      `tra

/* GENERATE-ATOMIC-CSS-CONFIG-STARTS */
.pb$$$ { padding-bottom: $$$px !important; } | 1 | 2

.mt$$$ { margin-top: $$$px !important; } | 2
/* GENERATE-ATOMIC-CSS-CONFIG-ENDS */

lala`,
      {
        includeConfig: false,
        includeHeadsAndTails: true,
      },
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

    "27.01",
  );
});

test(`28 - ${`\u001b[${35}m${"no config, only heads/tails requested"}\u001b[${39}m`} - incl. config tails, one comment block`, () => {
  equal(
    genAtomic(
      `tra

/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
.pb$$$ { padding-bottom: $$$px !important; } | 1 | 2

.mt$$$ { margin-top: $$$px !important; } | 2
GENERATE-ATOMIC-CSS-CONFIG-ENDS */

lala`,
      {
        includeConfig: false,
        includeHeadsAndTails: true,
      },
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

    "28.01",
  );
});

test(`29 - ${`\u001b[${31}m${"config, heads/tails requested"}\u001b[${39}m`} - retains content around`, () => {
  equal(
    genAtomic(
      `tra

.pb$$$ { padding-bottom: $$$px !important; } | 1 | 2

.mt$$$ { margin-top: $$$px !important; } | 2

lala`,
      {
        includeConfig: true,
        includeHeadsAndTails: true,
      },
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

    "29.01",
  );
});

test(`30 - ${`\u001b[${31}m${"config, heads/tails requested"}\u001b[${39}m`} - retains content around, incl. tails`, () => {
  equal(
    genAtomic(
      `tra

/* GENERATE-ATOMIC-CSS-CONTENT-STARTS */
.pb$$$ { padding-bottom: $$$px !important; } | 1 | 2

.mt$$$ { margin-top: $$$px !important; } | 2
/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */

lala`,
      {
        includeConfig: true,
        includeHeadsAndTails: true,
      },
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

    "30.01",
  );
});

test(`31 - ${`\u001b[${31}m${"config, heads/tails requested"}\u001b[${39}m`} - retains content around, incl. config tails`, () => {
  equal(
    genAtomic(
      `tra

/* GENERATE-ATOMIC-CSS-CONFIG-STARTS */
.pb$$$ { padding-bottom: $$$px !important; } | 1 | 2

.mt$$$ { margin-top: $$$px !important; } | 2
/* GENERATE-ATOMIC-CSS-CONFIG-ENDS */

lala`,
      {
        includeConfig: true,
        includeHeadsAndTails: true,
      },
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

    "31.01",
  );
});

test(`32 - ${`\u001b[${31}m${"config, heads/tails requested"}\u001b[${39}m`} - incl. config tails, one comment block`, () => {
  equal(
    genAtomic(
      `tra

/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
.pb$$$ { padding-bottom: $$$px !important; } | 1 | 2

.mt$$$ { margin-top: $$$px !important; } | 2
GENERATE-ATOMIC-CSS-CONFIG-ENDS */

lala`,
      {
        includeConfig: true,
        includeHeadsAndTails: true,
      },
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

    "32.01",
  );
});

test(`33 - ${`\u001b[${35}m${"config present no config requested"}\u001b[${39}m`} - comments surrounding`, () => {
  equal(
    genAtomic(
      `/* tra */

/* GENERATE-ATOMIC-CSS-CONFIG-STARTS */
.pb$$$ { padding-bottom: $$$px !important; } | 1 | 2

.mt$$$ { margin-top: $$$px !important; } | 2
/* GENERATE-ATOMIC-CSS-CONFIG-ENDS

/* lala */`,
      {
        includeConfig: false,
        includeHeadsAndTails: true,
      },
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

    "33.01",
  );
});

test(`34 - ${`\u001b[${35}m${"content tails present no config requested"}\u001b[${39}m`} - comments surrounding`, () => {
  equal(
    genAtomic(
      `/* tra */

/* GENERATE-ATOMIC-CSS-CONTENT-STARTS */
.pb$$$ { padding-bottom: $$$px !important; } | 1 | 2

.mt$$$ { margin-top: $$$px !important; } | 2
/* GENERATE-ATOMIC-CSS-CONTENT-ENDS

/* lala */`,
      {
        includeConfig: false,
        includeHeadsAndTails: true,
      },
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

    "34.01",
  );
});

test(`35 - ${`\u001b[${35}m${"no config, only heads/tails requested"}\u001b[${39}m`} - but no heads tails incoming, capped upper`, () => {
  let source = `a
.pt$$$ { padding-top: $$$px !important; }|0|5
.pr$$$ { padding-right: $$$px !important; }|0|5
.pb$$$ { padding-bottom: $$$px !important; }|0|5
b`;
  let ref = `a
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
  let generated = genAtomic(source, {
    includeConfig: false,
    includeHeadsAndTails: true,
  }).result;
  equal(generated, ref, "35.01");
});

test(`36 - ${`\u001b[${35}m${"no config, only heads/tails requested"}\u001b[${39}m`} - head missing`, () => {
  equal(
    genAtomic(
      `tra

.pb$$$ { padding-bottom: $$$px !important; } | 1 | 2

.mt$$$ { margin-top: $$$px !important; } | 2
/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */

lala`,
      {
        includeConfig: false,
        includeHeadsAndTails: true,
      },
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

    "36.01",
  );
});

// -----------------------------------------------------------------------------
// 05. generates from an input string, config requested but not present
// -----------------------------------------------------------------------------

test(`37 - ${`\u001b[${34}m${"config requested but not present"}\u001b[${39}m`} - but no heads tails incoming, default range`, () => {
  let source = ".pt$$$ { padding-top: $$$px !important; }";
  let generated = genAtomic(source, {
    includeConfig: true,
    includeHeadsAndTails: true,
  }).result;
  equal(generated.split("\n").length, 507, "37.01");
  ok(generated.includes("padding-top:     0 !important", "05.01.02"), "37.02");
  ok(generated.includes("padding-top:   5px !important", "05.01.03"), "37.03");
  ok(generated.includes("padding-top:  50px !important", "05.01.04"), "37.04");
  ok(generated.includes("padding-top: 500px !important", "05.01.05"), "37.05");
  ok(
    generated.includes(".pt401 { padding-top: 401px !important; }", "05.01.06"),
    "37.06",
  );

  ok(generated.includes(CONFIGHEAD, "05.01.07"), "37.07");
  ok(generated.includes(CONFIGTAIL, "05.01.08"), "37.08");
  ok(generated.includes(CONTENTHEAD, "05.01.09"), "37.09");
  ok(generated.includes(CONTENTTAIL, "05.01.10"), "37.10");
});

test(`38 - ${`\u001b[${34}m${"config requested but not present"}\u001b[${39}m`} - but no heads tails incoming, capped upper`, () => {
  let source1 = `
.pt$$$ { padding-top: $$$px !important; }|0|5
.pr$$$ { padding-right: $$$px !important; }|0|5
.pb$$$ { padding-bottom: $$$px !important; }|0|5
`.trim();
  // if "from" index is default, it can be omitted:
  let source2 = `
.pt$$$ { padding-top: $$$px !important; }|5
.pr$$$ { padding-right: $$$px !important; }|5
.pb$$$ { padding-bottom: $$$px !important; }|5
`.trim();
  let ref1 = `/* ${CONFIGHEAD}
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
  let ref2 = `/* ${CONFIGHEAD}
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
  let generated1 = genAtomic(source1, {
    includeConfig: true,
    includeHeadsAndTails: true,
  }).result;
  let generated2 = genAtomic(source2, {
    includeConfig: true,
    includeHeadsAndTails: true,
  }).result;

  equal(generated1, ref1, "38.01");
  equal(generated2, ref2, "38.02");
});

test(`39 - ${`\u001b[${34}m${"config requested but not present"}\u001b[${39}m`} - but no heads tails incoming, capped upper - second cycle`, () => {
  let ref1 = `/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
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
  let { log, result } = genAtomic(ref1, {
    includeConfig: true,
    includeHeadsAndTails: true,
  });

  equal(result, ref1, "39.01");
  equal(log.count, 18, "39.02");
  equal(
    result,
    genAtomic(result, {
      includeConfig: true,
      includeHeadsAndTails: true,
    }).result,
    "39.03",
  );
});

test(`40 - ${`\u001b[${34}m${"config requested but not present"}\u001b[${39}m`} - but no heads tails incoming, capped upper - second cycle`, () => {
  let ref2 = `/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
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
  let generated2 = genAtomic(ref2, {
    includeConfig: true,
    includeHeadsAndTails: true,
  }).result;
  equal(generated2, ref2, "40.01");
  equal(
    generated2,
    genAtomic(generated2, {
      includeConfig: true,
      includeHeadsAndTails: true,
    }).result,
    "40.02",
  );
});

test(`41 - ${`\u001b[${34}m${"config requested but not present"}\u001b[${39}m`} - but no heads tails incoming, fully custom range`, () => {
  let source = `
| .pt$$$ { padding-top: $$$px !important; } |5|10|
|.pr$$$ { padding-right: $$$px !important; } | 5|10
.pb$$$ { padding-bottom: $$$px !important; } | 5 | 10 |
`.trim();
  let ref = `/* ${CONFIGHEAD}
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
  let generated = genAtomic(source, {
    includeConfig: true,
    includeHeadsAndTails: true,
  }).result;

  equal(generated, ref, "41.01");

  // second cycle should not change anything since it's the same config
  equal(
    generated,
    genAtomic(generated, {
      includeConfig: true,
      includeHeadsAndTails: true,
    }).result,
    "41.02",
  );
});

test(`42 - ${`\u001b[${34}m${"config requested but not present"}\u001b[${39}m`} - only content heads/tails, no content around`, () => {
  let source = `
.pt$$$ { padding-top: $$$rem !important; }\t|\t3\t|
|.pr$$$ { padding-right: $$$vmax !important; }\t|\t99\t|\t101\t
`.trim();
  let ref = `/* ${CONFIGHEAD}
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
  let generated = genAtomic(source, {
    includeConfig: true,
    includeHeadsAndTails: true,
  }).result;

  equal(generated, ref, "42.01");

  // second cycle should not change anything since it's the same config
  equal(
    generated,
    genAtomic(generated, {
      includeConfig: true,
      includeHeadsAndTails: true,
    }).result,
    "42.02",
  );
});

test(`43 - ${`\u001b[${34}m${"config requested but not present"}\u001b[${39}m`} - only content heads/tails, content on top`, () => {
  let source = `
.pt$$$ { padding-top: $$$rem !important; }\t|\t3\t|
|.pr$$$ { padding-right: $$$vmax !important; }\t|\t99\t|\t101\t
`.trim();
  let ref = `<div>zzz</div>
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
  let generated = genAtomic(`<div>zzz</div>\n${source}`, {
    includeConfig: true,
    includeHeadsAndTails: true,
  }).result;

  equal(generated, ref, "43.01");

  // second cycle should not change anything since it's the same config
  equal(
    generated,
    genAtomic(generated, {
      includeConfig: true,
      includeHeadsAndTails: true,
    }).result,
    "43.02",
  );
});

test(`44 - ${`\u001b[${34}m${"config requested but not present"}\u001b[${39}m`} - retains content around, content tails`, () => {
  equal(
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
        includeHeadsAndTails: true,
      },
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

    "44.01",
  );
});

test(`45 - ${`\u001b[${34}m${"config requested but not present"}\u001b[${39}m`} - retains content around, config tails`, () => {
  equal(
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
        includeHeadsAndTails: true,
      },
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

    "45.01",
  );
});

test(`46 - ${`\u001b[${34}m${"config requested but not present"}\u001b[${39}m`} - retains content around`, () => {
  equal(
    genAtomic(
      `tra

.pb$$$ { padding-bottom: $$$px !important; } | 1 | 2

.mt$$$ { margin-top: $$$px !important; } | 2

lala`,
      {
        includeConfig: true,
        includeHeadsAndTails: true,
      },
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

    "46.01",
  );
});

test(`47 - ${`\u001b[${34}m${"config requested but not present"}\u001b[${39}m`} - above there are comments followed by content`, () => {
  equal(
    genAtomic(
      `/* tra */

<table>
.pb$$$ { padding-bottom: $$$px !important; } | 1 | 2

.mt$$$ { margin-top: $$$px !important; } | 2

lala`,
      {
        includeConfig: true,
        includeHeadsAndTails: true,
      },
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

    "47.01",
  );
});

test(`48 - ${`\u001b[${34}m${"config requested but not present"}\u001b[${39}m`} - but no heads tails incoming, fully custom range, no pad`, () => {
  // ---------------------------------------------------------------------------

  let source = `
| .pt$$$ { padding-top: $$$px !important; } |5|10|
|.pr$$$ { padding-right: $$$px !important; } | 5|10
.pb$$$ { padding-bottom: $$$px !important; } | 5 | 10 |
`.trim();

  // ---------------------------------------------------------------------------

  let ref = `/* ${CONFIGHEAD}
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

  let generated = genAtomic(source, {
    includeConfig: true,
    includeHeadsAndTails: true,
    pad: false,
  }).result;

  // ---------------------------------------------------------------------------

  equal(generated, ref, "48.01");

  // ---------------------------------------------------------------------------

  // second cycle should not change anything since it's the same config
  equal(
    generated,
    genAtomic(generated, {
      includeConfig: true,
      includeHeadsAndTails: true,
      pad: false,
    }).result,
    "48.02",
  );
});

test(`49 - ${`\u001b[${34}m${"config requested but not present"}\u001b[${39}m`} - style with no $$$`, () => {
  // ---------------------------------------------------------------------------

  let source = `
.plr$$$ { padding-left : $$$px !important; padding-right : $$$px !important }|0|2
.db { display: block !important }
`.trim();

  // ---------------------------------------------------------------------------

  let ref = `/* ${CONFIGHEAD}
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

  let generated = genAtomic(source, {
    includeConfig: true,
    includeHeadsAndTails: true,
    pad: false,
  }).result;

  // ---------------------------------------------------------------------------

  equal(generated, ref, "49.01");

  // ---------------------------------------------------------------------------

  // second cycle should not change anything since it's the same config
  equal(
    generated,
    genAtomic(generated, {
      includeConfig: true,
      includeHeadsAndTails: true,
      pad: false,
    }).result,
    "49.02",
  );
});

test(`50 - ${`\u001b[${34}m${"config requested but not present"}\u001b[${39}m`} - style with no $$$`, () => {
  // ---------------------------------------------------------------------------

  let source = `
.db { display: block!important }
.plr$$$ { padding-left: $$$px !important; padding-right: $$$px !important }|0|2
`.trim();

  // ---------------------------------------------------------------------------

  let ref = `/* ${CONFIGHEAD}
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

  let generated = genAtomic(source, {
    includeConfig: true,
    includeHeadsAndTails: true,
    pad: false,
  }).result;

  // ---------------------------------------------------------------------------

  equal(generated, ref, "50.01");

  // ---------------------------------------------------------------------------

  // a second cycle should not change anything since it's the same config
  equal(
    generated,
    genAtomic(generated, {
      includeConfig: true,
      includeHeadsAndTails: true,
      pad: false,
    }).result,
    "50.02",
  );
});

test(`51 - ${`\u001b[${34}m${"no config requested, not present"}\u001b[${39}m`} - style with no $$$`, () => {
  // ---------------------------------------------------------------------------

  let source = `a

.plr$$$ { padding-left: $$$px !important; padding-right: $$$px !important }|0|2
.db { display: block!important }

b
`.trim();

  // ---------------------------------------------------------------------------

  let ref = `a

/* ${CONTENTHEAD} */
.plr0 { padding-left:   0 !important; padding-right:   0 !important }
.plr1 { padding-left: 1px !important; padding-right: 1px !important }
.plr2 { padding-left: 2px !important; padding-right: 2px !important }
.db { display: block!important }
/* ${CONTENTTAIL} */

b
`;

  // ---------------------------------------------------------------------------

  let generated = genAtomic(source, {
    includeConfig: false,
    includeHeadsAndTails: true,
  }).result;

  // ---------------------------------------------------------------------------

  equal(generated, ref, "51.01");
});

test(`52 - ${`\u001b[${34}m${"config requested but not present"}\u001b[${39}m`} - style with no $$$, no pad`, () => {
  // ---------------------------------------------------------------------------

  let source = `/* ${CONFIGHEAD}
.m$$$ { margin: $$$px !important }|1

.db { display: block  !important }

.p$$$ { padding: $$$px !important }|1
${CONFIGTAIL}
${CONTENTHEAD} */
.db$$$ { display: block  !important } <--- nonsense, but it does not matter
/* ${CONTENTTAIL} */
`.trim();

  // ---------------------------------------------------------------------------

  let ref = `/* ${CONTENTHEAD} */
.m0 { margin: 0 !important }
.m1 { margin: 1px !important }

.db { display: block  !important }

.p0 { padding: 0 !important }
.p1 { padding: 1px !important }
/* ${CONTENTTAIL} */
`;

  // ---------------------------------------------------------------------------

  let generated = genAtomic(source, {
    includeConfig: false,
    includeHeadsAndTails: true,
    pad: 0,
  }).result;

  // ---------------------------------------------------------------------------

  equal(generated, ref, "52.01");
});

test(`53 - ${`\u001b[${34}m${"config requested but not present"}\u001b[${39}m`} - via opts.configOverride`, () => {
  // ---------------------------------------------------------------------------

  let source = `/* ${CONFIGHEAD}
.m$$$ { margin: $$$px !important }|1

.db { display: block  !important }

.p$$$ { padding: $$$px !important }|1
${CONFIGTAIL}
${CONTENTHEAD} */
.db$$$ { display: block  !important } <--- nonsense, but it does not matter
/* ${CONTENTTAIL} */
`.trim();

  // ---------------------------------------------------------------------------

  let ref = `/* ${CONTENTHEAD} */
.m0 { margin: 0 !important }
.m1 { margin: 1px !important }

.db { display: block  !important }

.p0 { padding: 0 !important }
.p1 { padding: 1px !important }
/* ${CONTENTTAIL} */
`;

  // ---------------------------------------------------------------------------

  let generated = genAtomic("$$$", {
    includeConfig: false,
    includeHeadsAndTails: true,
    pad: 0,
    configOverride: source,
  }).result;

  // ---------------------------------------------------------------------------

  equal(generated, ref, "53.01");
});

test(`54 - ${`\u001b[${34}m${"no config requested, not present"}\u001b[${39}m`} - via opts.configOverride`, () => {
  let source = `
/* ${CONFIGHEAD}
.m$$$ { margin: $$$px !important }|1

.db { display: block  !important }

.p$$$ { padding: $$$px !important }|1
${CONFIGTAIL}
${CONTENTHEAD} */
.db$$$ { display: block  !important } <--- nonsense, but it does not matter
/* ${CONTENTTAIL} */
`.trim();
  let ref = `a

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
  let generated = genAtomic(
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
      configOverride: source,
    },
  ).result;

  equal(generated, ref, "54.01");
});

test(`55 - ${`\u001b[${34}m${"config requested but not present"}\u001b[${39}m`} - via opts.configOverride`, () => {
  let source = `
/* ${CONFIGHEAD}
.m$$$ { margin: $$$px !important }|1

.db { display: block  !important }

.p$$$ { padding: $$$px !important }|1
${CONFIGTAIL}
${CONTENTHEAD} */
.db$$$ { display: block  !important } <--- nonsense, but it does not matter
/* ${CONTENTTAIL} */
`.trim();
  let ref = `x

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
  let generated = genAtomic(
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
      configOverride: source,
    },
  ).result;

  equal(generated, ref, "55.01");
});

test(`56 - ${`\u001b[${34}m${"no config requested, not present"}\u001b[${39}m`} - via opts.configOverride #2`, () => {
  let source = `
/* ${CONFIGHEAD}
.m$$$ { margin: $$$px !important }|1

.db { display: block  !important }

.p$$$ { padding: $$$px !important }|1
${CONFIGTAIL}
${CONTENTHEAD} */
.db$$$ { display: block  !important } <--- nonsense, but it does not matter
/* ${CONTENTTAIL} */
`.trim();
  let ref = `a

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
  let generated = genAtomic(
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
      configOverride: source,
    },
  ).result;

  equal(generated, ref, "56.01");
});

test(`57 - ${`\u001b[${34}m${"no config requested, not present"}\u001b[${39}m`} - via opts.configOverride #3`, () => {
  let source = `
/* ${CONFIGHEAD}
.m$$$ { margin: $$$px !important }|1

.db { display: block  !important }

.p$$$ { padding: $$$px !important }|1
${CONFIGTAIL}
${CONTENTHEAD} */
.db$$$ { display: block  !important } <--- nonsense, but it does not matter
/* ${CONTENTTAIL} */
`.trim();
  let ref = `a

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
  let generated = genAtomic(
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
      configOverride: source,
    },
  ).result;

  equal(generated, ref, "57.01");
});

// -----------------------------------------------------------------------------
// 06. full set present but neither config requested nor heads/tails requested
// ----class-------------------------------------------------------------------------

test(`58 - ${`\u001b[${35}m${"config present, not requested (neither tails)"}\u001b[${39}m`} - case #1`, () => {
  let source = `a

/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
.pb$$$ { padding-bottom: $$$px !important; } | 9 | 10

.mt$$$ { margin-top: $$$px !important; } | 1
GENERATE-ATOMIC-CSS-CONFIG-ENDS
GENERATE-ATOMIC-CSS-CONTENT-STARTS */

tralala

/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */

z`;
  equal(
    genAtomic(source, {
      includeConfig: false,
      includeHeadsAndTails: false,
    }).result,
    `a

.pb9  { padding-bottom:  9px !important; }
.pb10 { padding-bottom: 10px !important; }

.mt0 { margin-top:   0 !important; }
.mt1 { margin-top: 1px !important; }

z
`,
    "58.01",
  );
});

test(`59 - ${`\u001b[${35}m${"config present, not requested (neither tails)"}\u001b[${39}m`} - case #2`, () => {
  let source = `a

/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
.pb$$$${""}{padding-bottom:$$$px!important}| 5 | 10

.mt$$$${""}{margin-top:$$$px!important}| 1
GENERATE-ATOMIC-CSS-CONFIG-ENDS
GENERATE-ATOMIC-CSS-CONTENT-STARTS */

tralala

/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */

z`;
  equal(
    genAtomic(source, {
      includeConfig: false,
      includeHeadsAndTails: true,
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
    "59.01",
  );
});

test(`60 - ${`\u001b[${35}m${"config present, not requested (neither tails)"}\u001b[${39}m`} - case #3`, () => {
  let source = `a

/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
.pb$$$ { padding-bottom: $$$px !important; } | 5 | 10

.mt$$$ { margin-top: $$$px !important; } | 1
GENERATE-ATOMIC-CSS-CONFIG-ENDS
GENERATE-ATOMIC-CSS-CONTENT-STARTS */

tralala

/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */

z`;
  equal(
    genAtomic(source, {
      includeConfig: true,
      includeHeadsAndTails: false,
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
    "60.01",
  );
});

// -----------------------------------------------------------------------------
// 07. opts.configOverride
// -----------------------------------------------------------------------------

test(`61 - ${`\u001b[${36}m${"config override"}\u001b[${39}m`} - no $$$ anywhere (both in override and existing) - control`, () => {
  let source = `a

/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
zzz
GENERATE-ATOMIC-CSS-CONFIG-ENDS
GENERATE-ATOMIC-CSS-CONTENT-STARTS */
yyy
/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */

z`;
  equal(
    genAtomic(source, {
      includeConfig: false,
      includeHeadsAndTails: false,
    }).result,
    `a

zzz

z
`,
    "61.01",
  );
});

test(`62 - ${`\u001b[${36}m${"config override"}\u001b[${39}m`} - no $$$ anywhere (both in override and existing) - config/tails off`, () => {
  let source = `a

/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
zzz
GENERATE-ATOMIC-CSS-CONFIG-ENDS
GENERATE-ATOMIC-CSS-CONTENT-STARTS */
yyy
/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */

z`;
  equal(
    genAtomic(source, {
      includeConfig: false,
      includeHeadsAndTails: false,
      configOverride: ".mt$$$ { margin-top: $$$px; }|3",
    }).result,
    `a

.mt0 { margin-top:   0; }
.mt1 { margin-top: 1px; }
.mt2 { margin-top: 2px; }
.mt3 { margin-top: 3px; }

z
`,
    "62.01",
  );
});

test(`63 - ${`\u001b[${36}m${"config override"}\u001b[${39}m`} - no $$$ anywhere (both in override and existing) - only tails on`, () => {
  let source = `a

/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
zzz
GENERATE-ATOMIC-CSS-CONFIG-ENDS
GENERATE-ATOMIC-CSS-CONTENT-STARTS */
yyy
/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */

z`;
  equal(
    genAtomic(source, {
      includeConfig: false,
      includeHeadsAndTails: true,
      configOverride: ".mt$$$ { margin-top: $$$px; }|3",
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
    "63.01",
  );
});

test(`64 - ${`\u001b[${36}m${"config override"}\u001b[${39}m`} - no $$$ anywhere (both in override and existing) - config & tails on`, () => {
  let source = `a

/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
zzz
GENERATE-ATOMIC-CSS-CONFIG-ENDS
GENERATE-ATOMIC-CSS-CONTENT-STARTS */
yyy
/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */

z`;

  // notice how override gets written into top config section:
  equal(
    genAtomic(source, {
      includeConfig: true,
      configOverride: ".mt$$$ { margin-top: $$$px; }|3",
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
    "64.01",
  );
});

// -----------------------------------------------------------------------------
// 08. heads on, config on
// -----------------------------------------------------------------------------

test(`65 - ${`\u001b[${33}m${"heads on, config on"}\u001b[${39}m`} - combo styles`, () => {
  let content = `
.plr$$$ { padding-left: $$$px!important; padding-right: $$$px!important }|0|2
.db { display: block !important }
.dib { display: inline-block !important }
`.trim();
  equal(
    genAtomic(
      `/* ${CONFIGHEAD}
${content}
${CONFIGTAIL}
${CONTENTHEAD} */
zzz
/* ${CONTENTTAIL} */
`,
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
    "65.01",
  );
});

test(`66 - ${`\u001b[${33}m${"heads on, config on"}\u001b[${39}m`} - combo styles #2, tighter`, () => {
  let content = `
.plr$$$ { padding-left:$$$px!important;padding-right:$$$px!important }|0|2
.db { display: block !important }
`.trim();
  equal(
    genAtomic(
      `/* ${CONFIGHEAD}
${content}
${CONFIGTAIL}
${CONTENTHEAD} */
zzz
/* ${CONTENTTAIL} */
`,
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
    "66.01",
  );
});

test(`67 - ${`\u001b[${33}m${"heads on, config on"}\u001b[${39}m`} - reports 5 generated - control`, () => {
  let content = `
.p$$$ { padding: $$$px !important } | 1
.zzz1 { yyy: 0 auto !important }
.zzz2 { yyy: 0 auto !important }
.zzz3 { yyy: 0 auto !important }
`.trim();

  equal(
    genAtomic(
      `/* ${CONFIGHEAD}
${content}
${CONFIGTAIL}
${CONTENTHEAD} */
zzz
/* ${CONTENTTAIL} */
`,
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
    "67.01",
  );
});

test(`68 - ${`\u001b[${33}m${"heads on, config on"}\u001b[${39}m`} - reports 5 generated - log/count - dollars last`, () => {
  let content1 = `
.zzz1 { yyy: 0 auto !important }
.zzz2 { yyy: 0 auto !important }
.zzz3 { yyy: 0 auto !important }
.p$$$ { padding: $$$px !important } | 1
`.trim();
  let content2 = `
  .p$$$ { padding: $$$px !important } | 1
.zzz1 { yyy: 0 auto !important }
.zzz2 { yyy: 0 auto !important }
.zzz3 { yyy: 0 auto !important }
`.trim();
  let content3 = `
.zzz1 { yyy: 0 auto !important }
.zzz2 { yyy: 0 auto !important }
.p$$$ { padding: $$$px !important } | 1
.zzz3 { yyy: 0 auto !important }
`.trim();

  allOptsVariations.forEach((setOfOpts, i) => {
    equal(
      genAtomic(
        `/* ${CONFIGHEAD}
${content1}
${CONFIGTAIL}
${CONTENTHEAD} */
zzz
/* ${CONTENTTAIL} */
`,
        setOfOpts,
      ).log.count,
      5,
      `08.04.1${i} - ${JSON.stringify(setOfOpts, null, 0)}`,
    );
    equal(
      genAtomic(
        `/* ${CONFIGHEAD}
${content2}
${CONFIGTAIL}
${CONTENTHEAD} */
zzz
/* ${CONTENTTAIL} */
`,
        setOfOpts,
      ).log.count,
      5,
      `08.04.2${i} - ${JSON.stringify(setOfOpts, null, 0)}`,
    );
    equal(
      genAtomic(
        `/* ${CONFIGHEAD}
${content3}
${CONFIGTAIL}
${CONTENTHEAD} */
zzz
/* ${CONTENTTAIL} */
`,
        setOfOpts,
      ).log.count,
      5,
      `08.04.3${i} - ${JSON.stringify(setOfOpts, null, 0)}`,
    );
  });

  //
});

test(`69 - ${`\u001b[${33}m${"heads on, config on"}\u001b[${39}m`} - reports 5 generated - log/count - dollars last - content via opts.configOverride`, () => {
  let content1 = `
.zzz1 { yyy: 0 auto !important }
.zzz2 { yyy: 0 auto !important }
.zzz3 { yyy: 0 auto !important }
.p$$$ { padding: $$$px !important } | 1
`.trim();
  let content2 = `
  .p$$$ { padding: $$$px !important } | 1
.zzz1 { yyy: 0 auto !important }
.zzz2 { yyy: 0 auto !important }
.zzz3 { yyy: 0 auto !important }
`.trim();
  let content3 = `
.zzz1 { yyy: 0 auto !important }
.zzz2 { yyy: 0 auto !important }
.p$$$ { padding: $$$px !important } | 1
.zzz3 { yyy: 0 auto !important }
`.trim();

  allOptsVariations.forEach((setOfOpts, i) => {
    equal(
      genAtomic("zzz", { ...setOfOpts, configOverride: content1 }).log.count,
      5,
      `08.05.1${i} - ${JSON.stringify(setOfOpts, null, 0)}`,
    );
    equal(
      genAtomic(
        `/* ${CONFIGHEAD}
.tralala { $$$ }
${CONFIGTAIL}
${CONTENTHEAD} */
replace me
/* ${CONTENTTAIL} */
`,
        { ...setOfOpts, configOverride: content1 },
      ).log.count,
      5,
      `08.05.2${i} - ${JSON.stringify(setOfOpts, null, 0)}`,
    );

    // content2
    equal(
      genAtomic("zzz", { ...setOfOpts, configOverride: content2 }).log.count,
      5,
      `08.05.3${i} - ${JSON.stringify(setOfOpts, null, 0)}`,
    );
    equal(
      genAtomic(
        `/* ${CONFIGHEAD}
.tralala { $$$ }
${CONFIGTAIL}
${CONTENTHEAD} */
replace me
/* ${CONTENTTAIL} */
`,
        { ...setOfOpts, configOverride: content2 },
      ).log.count,
      5,
      `08.05.4${i} - ${JSON.stringify(setOfOpts, null, 0)}`,
    );

    // content3
    equal(
      genAtomic("zzz", { ...setOfOpts, configOverride: content3 }).log.count,
      5,
      `08.05.5${i} - ${JSON.stringify(setOfOpts, null, 0)}`,
    );
    equal(
      genAtomic(
        `/* ${CONFIGHEAD}
.tralala { $$$ }
${CONFIGTAIL}
${CONTENTHEAD} */
replace me
/* ${CONTENTTAIL} */
`,
        { ...setOfOpts, configOverride: content3 },
      ).log.count,
      5,
      `08.05.6${i} - ${JSON.stringify(setOfOpts, null, 0)}`,
    );
  });
});

test(`70 - ${`\u001b[${33}m${"heads on, config on"}\u001b[${39}m`} - two levels of curlies wrapping the source`, () => {
  let source = `@media screen and (max-width: 650px) {
  .w$$$p { width: $$$% !important }|0|2
}`;
  equal(
    genAtomic(source, {
      includeConfig: true,
      includeHeadsAndTails: true,
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
    "70.01",
  );
});

test(`71 - ${`\u001b[${33}m${"heads on, config on"}\u001b[${39}m`} - only content heads/tails`, () => {
  let source = `@media screen and (max-width: 650px) {
  .w$$$p { width: $$$% !important }|0|2
}`;
  equal(
    genAtomic(source, {
      includeConfig: false,
      includeHeadsAndTails: true,
    }).result,
    `/* GENERATE-ATOMIC-CSS-CONTENT-STARTS */
@media screen and (max-width: 650px) {
  .w0p { width:  0 !important }
  .w1p { width: 1% !important }
  .w2p { width: 2% !important }
}
/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */
`,
    "71.01",
  );
});

test(`72 - ${`\u001b[${33}m${"heads on, config on"}\u001b[${39}m`} - no heads/tails`, () => {
  let source = `@media screen and (max-width: 650px) {
  .w$$$p { width: $$$% !important }|0|2
}`;
  equal(
    genAtomic(source, {
      includeConfig: false,
      includeHeadsAndTails: false,
    }).result,
    `@media screen and (max-width: 650px) {
  .w0p { width:  0 !important }
  .w1p { width: 1% !important }
  .w2p { width: 2% !important }
}
`,
    "72.01",
  );
});

// -----------------------------------------------------------------------------
// 98. API bits - extractFromToSource
// -----------------------------------------------------------------------------

test(`73 - ${`\u001b[${33}m${"API bits"}\u001b[${39}m`} - extractFromToSource - wizard case, 1 arg`, () => {
  equal(extractFromToSource("mt|10"), [0, 10, "mt"], "73.01");
  equal(extractFromToSource("mt|10|"), [0, 10, "mt"], "73.02");
  equal(extractFromToSource("|mt|10|"), [0, 10, "mt"], "73.03");
  equal(extractFromToSource("| mt | 10 |"), [0, 10, " mt"], "73.04");
  equal(extractFromToSource(" | mt | 10 | "), [0, 10, " mt"], "73.05");
  equal(extractFromToSource(" | mt| 0 "), [0, 0, " mt"], "73.06");
  equal(extractFromToSource(" |||| mt| 0 "), [0, 0, " mt"], "73.07");
});

test(`74 - ${`\u001b[${33}m${"API bits"}\u001b[${39}m`} - extractFromToSource - wizard case, 2 args`, () => {
  equal(extractFromToSource("mt|2|10"), [2, 10, "mt"], "74.01");
  equal(extractFromToSource("mt|2|10|"), [2, 10, "mt"], "74.02");
  equal(extractFromToSource("|mt|2|10|"), [2, 10, "mt"], "74.03");
  equal(extractFromToSource(" mt | 2 | 10 "), [2, 10, " mt"], "74.04");
  equal(extractFromToSource(" mt | 2 | 10 |"), [2, 10, " mt"], "74.05");
  equal(extractFromToSource("| mt | 2 | 10 |"), [2, 10, " mt"], "74.06");
  equal(extractFromToSource(" | mt | 2 | 10 | "), [2, 10, " mt"], "74.07");
  equal(extractFromToSource("  mt| 2| 10|\n"), [2, 10, "  mt"], "74.08");
  equal(extractFromToSource("||| |  mt| 2| 10|\n"), [2, 10, "  mt"], "74.09");
});

test(`75 - ${`\u001b[${33}m${"API bits"}\u001b[${39}m`} - extractFromToSource - wizard case, 3 args`, () => {
  // takes first two digits
  equal(extractFromToSource("mt|2|10|0"), [2, 10, "mt"], "75.01");
  equal(extractFromToSource("mt|2|10|0|"), [2, 10, "mt"], "75.02");
  equal(extractFromToSource("|mt|2|10|0|"), [2, 10, "mt"], "75.03");
  equal(extractFromToSource("||||mt|2|10|0|"), [2, 10, "mt"], "75.04");
});

test(`76 - ${`\u001b[${33}m${"API bits"}\u001b[${39}m`} - extractFromToSource - wizard case, 3 args - taster`, () => {
  equal(extractFromToSource("mt[lang|=en]|2"), [0, 2, "mt[lang|=en]"], "76.01");
});

test(`77 - ${`\u001b[${33}m${"API bits"}\u001b[${39}m`} - extractFromToSource - wizard case, 3 args`, () => {
  equal(
    extractFromToSource("mt[lang|=en]|2|10"),
    [2, 10, "mt[lang|=en]"],
    "77.01",
  );
  equal(
    extractFromToSource(".mt[lang|=en]|2|"),
    [0, 2, ".mt[lang|=en]"],
    "77.02",
  );
  equal(
    extractFromToSource(".mt[lang|=en]|2|10|"),
    [2, 10, ".mt[lang|=en]"],
    "77.03",
  );
  equal(
    extractFromToSource("mt[lang|=en] | 2 | 10 | 0"),
    [2, 10, "mt[lang|=en]"],
    "77.04",
  );
  equal(
    extractFromToSource("mt[lang|=en] | 2 | 10 | a"),
    [2, 10, "mt[lang|=en]"],
    "77.05",
  );
  equal(
    extractFromToSource("|mt[lang|=en] | 2 | 10 | a"),
    [2, 10, "mt[lang|=en]"],
    "77.06",
  );
  equal(
    extractFromToSource("||||mt[lang|=en] | 2 | 10 | a"),
    [2, 10, "mt[lang|=en]"],
    "77.07",
  );
});

test(`78 - ${`\u001b[${33}m${"API bits"}\u001b[${39}m`} - extractFromToSource - generator case, 1 arg`, () => {
  equal(
    extractFromToSource(".mt$$$ { margin-top: $$$px !important; } | 10"),
    [0, 10, ".mt$$$ { margin-top: $$$px !important; }"],
    "78.01",
  );
  equal(
    extractFromToSource("   .mt$$$ { margin-top: $$$px !important; } | 10"),
    [0, 10, "   .mt$$$ { margin-top: $$$px !important; }"],
    "78.02",
  );
  equal(
    extractFromToSource("   .mt$$$ { margin-top: $$$px !important; } | 10 "),
    [0, 10, "   .mt$$$ { margin-top: $$$px !important; }"],
    "78.03",
  );
  equal(
    extractFromToSource("   .mt$$$ { margin-top: $$$px !important; } | 10 |"),
    [0, 10, "   .mt$$$ { margin-top: $$$px !important; }"],
    "78.04",
  );
  equal(
    extractFromToSource("   .mt$$$ { margin-top: $$$px !important; } | 10 | "),
    [0, 10, "   .mt$$$ { margin-top: $$$px !important; }"],
    "78.05",
  );
  equal(
    extractFromToSource("|   .mt$$$ { margin-top: $$$px !important; } | 10 | "),
    [0, 10, "   .mt$$$ { margin-top: $$$px !important; }"],
    "78.06",
  );
  equal(
    extractFromToSource(
      "||||   .mt$$$ { margin-top: $$$px !important; } | 10 | ",
    ),
    [0, 10, "   .mt$$$ { margin-top: $$$px !important; }"],
    "78.07",
  );
});

test(`79 - ${`\u001b[${33}m${"API bits"}\u001b[${39}m`} - extractFromToSource - generator case, 2 arg`, () => {
  equal(
    extractFromToSource(".mt$$$ { margin-top: $$$px !important; }|2|10"),
    [2, 10, ".mt$$$ { margin-top: $$$px !important; }"],
    "79.01",
  );
  equal(
    extractFromToSource(".mt$$$ { margin-top: $$$px !important; } | 2 | 10 "),
    [2, 10, ".mt$$$ { margin-top: $$$px !important; }"],
    "79.02",
  );
  equal(
    extractFromToSource(".mt$$$ { margin-top: $$$px !important; } | 2 | 10 |"),
    [2, 10, ".mt$$$ { margin-top: $$$px !important; }"],
    "79.03",
  );
  equal(
    extractFromToSource(
      " .mt$$$ { margin-top: $$$px !important; } | 2 | 10  | ",
    ),
    [2, 10, " .mt$$$ { margin-top: $$$px !important; }"],
    "79.04",
  );
  equal(
    extractFromToSource(
      " .mt$$$ { margin-top: $$$px !important; } | 2 | 10  | a",
    ),
    [2, 10, " .mt$$$ { margin-top: $$$px !important; }"],
    "79.05",
  );
  equal(
    extractFromToSource(
      "| .mt$$$ { margin-top: $$$px !important; } | 2 | 10  | a",
    ),
    [2, 10, " .mt$$$ { margin-top: $$$px !important; }"],
    "79.06",
  );
  equal(
    extractFromToSource(
      "|| .mt$$$ { margin-top: $$$px !important; } | 2 | 10  | a |",
    ),
    [2, 10, " .mt$$$ { margin-top: $$$px !important; }"],
    "79.07",
  );
});

test(`80 - ${`\u001b[${33}m${"API bits"}\u001b[${39}m`} - extractFromToSource - pipe in CSS`, () => {
  equal(
    extractFromToSource(
      ".mt$$$[lang|=en] { margin-top: $$$px !important; }|10",
    ),
    [0, 10, ".mt$$$[lang|=en] { margin-top: $$$px !important; }"],
    "80.01",
  );
  equal(
    extractFromToSource(
      ".mt$$$[lang|=en] { margin-top: $$$px !important; }|2|10",
    ),
    [2, 10, ".mt$$$[lang|=en] { margin-top: $$$px !important; }"],
    "80.02",
  );
  equal(
    extractFromToSource(
      "|.mt$$$[lang|=en] { margin-top: $$$px !important; }|10|",
    ),
    [0, 10, ".mt$$$[lang|=en] { margin-top: $$$px !important; }"],
    "80.03",
  );
  equal(
    extractFromToSource(
      "| .mt$$$[lang|=en] { margin-top: $$$px !important; }| 2 | 10 | ",
    ),
    [2, 10, " .mt$$$[lang|=en] { margin-top: $$$px !important; }"],
    "80.04",
  );
  equal(
    extractFromToSource(
      "|||| .mt$$$[lang|=en] { margin-top: $$$px !important; }| 2 | 10 | ",
    ),
    [2, 10, " .mt$$$[lang|=en] { margin-top: $$$px !important; }"],
    "80.05",
  );
});

// -----------------------------------------------------------------------------
// 99. API bits - the others
// -----------------------------------------------------------------------------

test(`81 - ${`\u001b[${33}m${"API bits"}\u001b[${39}m`} - version is exported`, () => {
  match(version, /\d+\.\d+\.\d+/g, "81.01");
});

test(`82 - ${`\u001b[${33}m${"API bits"}\u001b[${39}m`} - heads and tails are exported`, () => {
  equal(Object.keys(headsAndTails).length, 4, "82.01");
});

test(`83 - ${`\u001b[${33}m${"API bits"}\u001b[${39}m`} - exports reportProgressFunc which works`, () => {
  let counterArr = [];
  let source = ".pt$$$ { padding-top: $$$px !important; }";
  let generated = genAtomic(source, {
    includeConfig: false,
    includeHeadsAndTails: false,
    reportProgressFunc: (perc) => {
      counterArr.push(perc);
    },
  }).result;
  ok(generated.split("\n").length > 500, "83.01");
  ok(counterArr.length > 98, "83.02");
});

test.run();
