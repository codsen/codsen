import tap from "tap";
import { det as det1 } from "../dist/detergent.esm";
// const { det, mixer, allCombinations } from "../t-util/util";

// ================================================
// 01. Only real applicable rules keys are reported
// ================================================

tap.test(
  `01 - ${`\u001b[${31}m${`rubbish removal`}\u001b[${39}m`} - trailing/leading whitespace, convertEntities=on`,
  (t) => {
    t.same(
      Object.keys(
        det1(`&nbsp;&nbsp;&nbsp; a &nbsp;&nbsp;&nbsp;`, {
          convertEntities: 1,
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
      "01"
    );
    t.end();
  }
);
