import test from "ava";
import { generateAtomicCss, version } from "../dist/generate-atomic-css.esm";

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

test(`01.01 - ${`\u001b[${31}m${`throws`}\u001b[${39}m`} - wrong/missing input`, t => {
  t.throws(() => {
    generateAtomicCss();
  });
});

test(`01.02 - ${`\u001b[${31}m${`throws`}\u001b[${39}m`} - undefined literal`, t => {
  t.throws(() => {
    generateAtomicCss(undefined);
  });
});

test(`01.03 - ${`\u001b[${31}m${`throws`}\u001b[${39}m`} - numbers`, t => {
  t.throws(() => {
    generateAtomicCss(1);
  });
});

test(`01.04 - ${`\u001b[${31}m${`throws`}\u001b[${39}m`} - null`, t => {
  t.throws(() => {
    generateAtomicCss(null);
  });
});

test(`01.05 - ${`\u001b[${31}m${`throws`}\u001b[${39}m`} - bools`, t => {
  t.throws(() => {
    generateAtomicCss(true);
  });
});

// -----------------------------------------------------------------------------
// 02. generates from an input string
// -----------------------------------------------------------------------------

// test(`02.01 - ${`\u001b[${33}m${`from an input string`}\u001b[${39}m`} - defaults, empty content`, t => {
//   t.deepEqual(
//     generateAtomicCss(`111
// 222
// /*
// GENERATE-ATOMIC-CSS-CONFIG-STARTS
// | .pt$$$ { padding-top: $$$px !important; }|0|3|
//
// | .mt$$$ { margin-top: $$$px !important; }|0|3|
// GENERATE-ATOMIC-CSS-CONFIG-ENDS
// GENERATE-ATOMIC-CSS-CONTENT-STARTS
// GENERATE-ATOMIC-CSS-CONTENT-ENDS
// */
// 333
// 444
// `),
//     `111
// 222
// /*
// GENERATE-ATOMIC-CSS-CONFIG-STARTS
// | .pt$$$ { padding-top: $$$px !important; }|0|3|
//
// | .mt$$$ { margin-top: $$$px !important; }|0|3|
// GENERATE-ATOMIC-CSS-CONFIG-ENDS
// GENERATE-ATOMIC-CSS-CONTENT-STARTS
//  .pt0 { padding-top:    0 !important; }
//  .pt1 { padding-top:  1px !important; }
//  .pt2 { padding-top:  2px !important; }
//  .pt3 { padding-top:  3px !important; }
//
//  .mt0 { margin-top:    0 !important; }
//  .mt1 { margin-top:  1px !important; }
//  .mt2 { margin-top:  2px !important; }
//  .mt3 { margin-top:  3px !important; }
// GENERATE-ATOMIC-CSS-CONTENT-ENDS
// */
// 333
// 444
// `,
//     "02.01"
//   );
// });

// -----------------------------------------------------------------------------
// 99. API bits
// -----------------------------------------------------------------------------

test(`99.01 - ${`\u001b[${33}m${`API bits`}\u001b[${39}m`} - version is exported`, t => {
  t.regex(version, /\d+\.\d+\.\d+/g, "99.01");
});
