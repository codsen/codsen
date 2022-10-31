import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { stripHtml } from "./util/noLog.js";

// throws
// -----------------------------------------------------------------------------

test("01 - wrong input type", () => {
  throws(() => {
    stripHtml(true);
  }, /THROW_ID_01/);
});

test("02 - wrong input type", () => {
  throws(() => {
    stripHtml(false);
  }, /THROW_ID_01/);
});

test("03 - wrong input type", () => {
  throws(() => {
    stripHtml(null);
  }, /THROW_ID_01/);
});

test("04 - wrong input type", () => {
  throws(() => {
    stripHtml(1);
  }, /THROW_ID_01/);
});

test("05 - wrong opts", () => {
  throws(() => {
    stripHtml("zzz", 1);
  }, /THROW_ID_02/);
});

test("06 - wrong opts", () => {
  throws(() => {
    stripHtml("zzz", true);
  }, /THROW_ID_02/);
});

test("07 - wrong opts.reportProgressFunc", () => {
  throws(() => {
    stripHtml("zzz", { reportProgressFunc: 1 });
  }, /THROW_ID_03/);
});

test("08 - wrong opts.dumpLinkHrefsNearby", () => {
  throws(() => {
    stripHtml("zzz", { dumpLinkHrefsNearby: true });
  }, /THROW_ID_04/);
});

test("09 - wrong opts", () => {
  throws(() => {
    stripHtml("zzz", {
      returnRangesOnly: true,
    });
  }, /THROW_ID_05/);
  throws(() => {
    stripHtml("zzz", {
      returnRangesOnly: false,
    });
  }, /THROW_ID_05/);
  throws(() => {
    stripHtml("zzz", {
      returnRangesOnly: null,
    });
  }, /THROW_ID_05/);
  throws(() => {
    stripHtml("zzz", {
      returnRangesOnly: undefined,
    });
  }, /THROW_ID_05/);
});

test("10 - wrong opts.reportProgressFuncFrom", () => {
  throws(() => {
    stripHtml("zzz", {
      reportProgressFunc: () => {},
      reportProgressFuncFrom: true,
    });
  }, /THROW_ID_06/);
  throws(() => {
    stripHtml("zzz", { reportProgressFuncFrom: true });
  }, /THROW_ID_06/);
  throws(() => {
    stripHtml("zzz", { reportProgressFuncFrom: "0" });
  }, /THROW_ID_06/);
});

test("11 - wrong opts.reportProgressFuncTo", () => {
  throws(() => {
    stripHtml("zzz", {
      reportProgressFunc: () => {},
      reportProgressFuncTo: true,
    });
  }, /THROW_ID_07/);
  throws(() => {
    stripHtml("zzz", { reportProgressFuncTo: true });
  }, /THROW_ID_07/);
  throws(() => {
    stripHtml("zzz", { reportProgressFuncTo: "100" });
  }, /THROW_ID_07/);
});

test("12 - wrong opts.stripTogetherWithTheirContents", () => {
  throws(() => {
    stripHtml("zzz", { stripTogetherWithTheirContents: ["div", 1] });
  }, /THROW_ID_08/);
});

// legit input
// -----------------------------------------------------------------------------

test("13 - empty input", () => {
  let { result, ranges, allTagLocations, filteredTagLocations } = stripHtml("");
  equal(
    { result, ranges, allTagLocations, filteredTagLocations },
    {
      result: "",
      ranges: null,
      allTagLocations: [],
      filteredTagLocations: [],
    },
    "13.01"
  );
});

test("14 - tabs only", () => {
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
    "14.01"
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
    "14.02"
  );
});

test("15 - spaces only", () => {
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
    "15.01"
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
    "15.02"
  );
});

test.run();
