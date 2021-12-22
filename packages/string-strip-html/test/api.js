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

// wrong opts
// -----------------------------------------------------------------------------

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

test("07 - wrong opts", () => {
  throws(() => {
    stripHtml("zzz", {
      returnRangesOnly: true,
    });
  }, /THROW_ID_03/);
  throws(() => {
    stripHtml("zzz", {
      returnRangesOnly: false,
    });
  }, /THROW_ID_03/);
  throws(() => {
    stripHtml("zzz", {
      returnRangesOnly: null,
    });
  }, /THROW_ID_03/);
  throws(() => {
    stripHtml("zzz", {
      returnRangesOnly: undefined,
    });
  }, /THROW_ID_03/);
});

test("08 - wrong opts.dumpLinkHrefsNearby", () => {
  throws(() => {
    stripHtml("zzz", { dumpLinkHrefsNearby: true });
  }, /THROW_ID_04/);
});

test("09 - wrong opts.stripTogetherWithTheirContents", () => {
  throws(() => {
    stripHtml("zzz", { stripTogetherWithTheirContents: ["div", 1] });
  }, /THROW_ID_05/);
});

// legit input
// -----------------------------------------------------------------------------

test("10 - empty input", () => {
  let { result, ranges, allTagLocations, filteredTagLocations } = stripHtml("");
  equal(
    { result, ranges, allTagLocations, filteredTagLocations },
    {
      result: "",
      ranges: null,
      allTagLocations: [],
      filteredTagLocations: [],
    },
    "10"
  );
});

test("11 - tabs only", () => {
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
    "11.01"
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
    "11.02"
  );
});

test("12 - spaces only", () => {
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
    "12.01"
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
    "12.02"
  );
});

test.run();
