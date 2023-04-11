import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { det as det1 } from "../dist/detergent.esm.js";
// const { det, mixer } from "../t-util/util.js";

// ================================================
// 01. Only real applicable rules keys are reported
// ================================================

test(`01 - ${`\u001b[${31}m${"rubbish removal"}\u001b[${39}m`} - trailing/leading whitespace, convertEntities=on`, () => {
  equal(
    Object.keys(
      det1("&nbsp;&nbsp;&nbsp; a &nbsp;&nbsp;&nbsp;", {
        convertEntities: true,
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
      "eol",
    ].sort(),
    "01.01"
  );
});

test.run();
