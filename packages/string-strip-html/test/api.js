import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { stripHtml } from "./util/noLog.js";

// throws
// -----------------------------------------------------------------------------

test("01 - wrong input type", () => {
  throws(
    () => {
      stripHtml(true);
    },
    /THROW_ID_01/,
    "01.01",
  );
});

test("02 - wrong input type", () => {
  throws(
    () => {
      stripHtml(false);
    },
    /THROW_ID_01/,
    "02.01",
  );
});

test("03 - wrong input type", () => {
  throws(
    () => {
      stripHtml(null);
    },
    /THROW_ID_01/,
    "03.01",
  );
});

test("04 - wrong input type", () => {
  throws(
    () => {
      stripHtml(1);
    },
    /THROW_ID_01/,
    "04.01",
  );
});

test("05 - wrong opts", () => {
  throws(
    () => {
      stripHtml("zzz", 1);
    },
    /THROW_ID_02/,
    "05.01",
  );
});

test("06 - wrong opts", () => {
  throws(
    () => {
      stripHtml("zzz", true);
    },
    /THROW_ID_02/,
    "06.01",
  );
});

test("07 - wrong opts.reportProgressFunc", () => {
  throws(
    () => {
      stripHtml("zzz", { reportProgressFunc: 1 });
    },
    /THROW_ID_03/,
    "07.01",
  );
});

test("08 - wrong opts.dumpLinkHrefsNearby", () => {
  throws(
    () => {
      stripHtml("zzz", { dumpLinkHrefsNearby: true });
    },
    /THROW_ID_04/,
    "08.01",
  );
});

test("09 - wrong opts", () => {
  throws(
    () => {
      stripHtml("zzz", {
        returnRangesOnly: true,
      });
    },
    /THROW_ID_05/,
    "09.01",
  );
  throws(
    () => {
      stripHtml("zzz", {
        returnRangesOnly: false,
      });
    },
    /THROW_ID_05/,
    "09.02",
  );
  throws(
    () => {
      stripHtml("zzz", {
        returnRangesOnly: null,
      });
    },
    /THROW_ID_05/,
    "09.03",
  );
  throws(
    () => {
      stripHtml("zzz", {
        returnRangesOnly: undefined,
      });
    },
    /THROW_ID_05/,
    "09.04",
  );
});

test("10 - wrong reportProgressFuncFrom", () => {
  throws(
    () => {
      stripHtml("zzz", {
        reportProgressFunc: () => {},
        reportProgressFuncFrom: true,
      });
    },
    /THROW_ID_06/,
    "10.01",
  );
  throws(
    () => {
      stripHtml("zzz", {
        reportProgressFunc: () => {},
        reportProgressFuncFrom: "0",
      });
    },
    /THROW_ID_06/,
    "10.02",
  );
});

test("11 - ignores wrong reportProgressFuncFrom when reportProgressFunc is off", () => {
  equal(
    stripHtml("zzz", {
      reportProgressFunc: null,
      reportProgressFuncFrom: true,
    }),
    {
      result: "zzz",
      ranges: null,
      allTagLocations: [],
      filteredTagLocations: [],
    },
    "11.01",
  );
  equal(
    stripHtml("zzz", {
      reportProgressFuncFrom: "0",
    }),
    {
      result: "zzz",
      ranges: null,
      allTagLocations: [],
      filteredTagLocations: [],
    },
    "11.02",
  );
});

test("12 - wrong opts.reportProgressFuncTo", () => {
  throws(
    () => {
      stripHtml("zzz", {
        reportProgressFunc: () => {},
        reportProgressFuncTo: true,
      });
    },
    /THROW_ID_07/,
    "12.01",
  );
  throws(
    () => {
      stripHtml("zzz", {
        reportProgressFunc: () => {},
        reportProgressFuncTo: "100",
      });
    },
    /THROW_ID_07/,
    "12.02",
  );
});

test("13 - ignores wrong reportProgressFuncTo when reportProgressFunc is off", () => {
  equal(
    stripHtml("zzz", {
      reportProgressFunc: null,
      reportProgressFuncTo: true,
    }),
    {
      result: "zzz",
      ranges: null,
      allTagLocations: [],
      filteredTagLocations: [],
    },
    "13.01",
  );
  equal(
    stripHtml("zzz", {
      reportProgressFuncTo: "0",
    }),
    {
      result: "zzz",
      ranges: null,
      allTagLocations: [],
      filteredTagLocations: [],
    },
    "13.02",
  );
});

test("14 - wrong opts.stripTogetherWithTheirContents", () => {
  throws(
    () => {
      stripHtml("zzz", { stripTogetherWithTheirContents: ["div", 1] });
    },
    /THROW_ID_08/,
    "14.01",
  );
});

// legit input
// -----------------------------------------------------------------------------

test("15 - empty input", () => {
  let { result, ranges, allTagLocations, filteredTagLocations } = stripHtml("");
  equal(
    { result, ranges, allTagLocations, filteredTagLocations },
    {
      result: "",
      ranges: null,
      allTagLocations: [],
      filteredTagLocations: [],
    },
    "15.01",
  );
});

test("16 - tabs only", () => {
  let input = "\t\t\t";
  equal(
    stripHtml(input, {
      trimOnlySpaces: true,
    }),
    {
      result: input,
      ranges: null,
      allTagLocations: [],
      filteredTagLocations: [],
    },
    "16.01",
  );
  equal(
    stripHtml(input, {
      trimOnlySpaces: false,
    }),
    {
      result: "",
      ranges: [[0, 3]],
      allTagLocations: [],
      filteredTagLocations: [],
    },
    "16.02",
  );
});

test("17 - spaces only", () => {
  let input = "   ";
  equal(
    stripHtml(input, {
      trimOnlySpaces: true,
    }),
    {
      result: "",
      ranges: [[0, 3]],
      allTagLocations: [],
      filteredTagLocations: [],
    },
    "17.01",
  );
  equal(
    stripHtml(input, {
      trimOnlySpaces: false,
    }),
    {
      result: "",
      ranges: [[0, 3]],
      allTagLocations: [],
      filteredTagLocations: [],
    },
    "17.02",
  );
});

test.run();
