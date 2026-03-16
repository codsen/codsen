// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { det as det1 } from "../dist/detergent.esm.js";

// const { det, mixer } from "../t-util/util.js";

// ================================================
// 01. Only real applicable rules keys are reported
// ================================================

test("001 - rubbish removal - trailing/leading whitespace, convertEntities=on", () => {
  equal(
    Object.keys(
      det1("&nbsp;&nbsp;&nbsp; a &nbsp;&nbsp;&nbsp;", {
        convertEntities: true,
      }).applicableOpts,
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
    "001.01",
  );
});

test.run();
