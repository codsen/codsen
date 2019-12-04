const t = require("tap");
const detergent = require("../dist/detergent.cjs");
const det1 = detergent.det;
// const { det, mixer, allCombinations } = require("../t-util/util");

// ================================================
// 01. Only real applicable rules keys are reported
// ================================================

t.test(
  `01.01 - ${`\u001b[${31}m${`rubbish removal`}\u001b[${39}m`} - trailing/leading whitespace, convertEntities=on`,
  t => {
    t.same(
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
    t.end();
  }
);
