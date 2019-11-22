// avanotonly

import test from "ava";
import { det as det1 } from "../dist/detergent.esm";
// import { det, mixer } from "../t-util/util";
// import deepContains from "ast-deep-contains";

// ================================================
// 01. Only real applicable rules keys are reported
// ================================================

test(`01.01 - ${`\u001b[${31}m${`rubbish removal`}\u001b[${39}m`} - trailing/leading whitespace, convertEntities=on`, t => {
  t.deepEqual(
    Object.keys(
      det1(`&nbsp;&nbsp;&nbsp; a &nbsp;&nbsp;&nbsp;`, {
        convertEntities: 1
      }).applicableOpts
    ).sort(),
    [
      "fixBrokenEntities",
      "removeWidows",
      "convertEntities",
      "convertDashes",
      "convertApostrophes",
      "replaceLineBreaks",
      "removeLineBreaks",
      "useXHTML",
      "dontEncodeNonLatin",
      "addMissingSpaces",
      "convertDotsToEllipsis",
      "stripHtml",
      "eol"
    ].sort()
  );
});
