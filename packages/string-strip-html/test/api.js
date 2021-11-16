import tap from "tap";
import { stripHtml } from "../dist/string-strip-html.esm.js";

// throws
// -----------------------------------------------------------------------------

tap.test("01 - wrong input type", (t) => {
  t.throws(() => {
    stripHtml(true);
  }, /THROW_ID_01/);
  t.end();
});

tap.test("02 - wrong input type", (t) => {
  t.throws(() => {
    stripHtml(false);
  }, /THROW_ID_01/);
  t.end();
});

tap.test("03 - wrong input type", (t) => {
  t.throws(() => {
    stripHtml(null);
  }, /THROW_ID_01/);
  t.end();
});

tap.test("04 - wrong input type", (t) => {
  t.throws(() => {
    stripHtml(1);
  }, /THROW_ID_01/);
  t.end();
});

// wrong opts
// -----------------------------------------------------------------------------

tap.test("05 - wrong opts", (t) => {
  t.throws(() => {
    stripHtml("zzz", 1);
  }, /THROW_ID_02/);
  t.end();
});

tap.test("06 - wrong opts", (t) => {
  t.throws(() => {
    stripHtml("zzz", true);
  }, /THROW_ID_02/);
  t.end();
});

tap.test("07 - wrong opts", (t) => {
  t.throws(() => {
    stripHtml("zzz", {
      returnRangesOnly: true,
    });
  }, /THROW_ID_03/);
  t.throws(() => {
    stripHtml("zzz", {
      returnRangesOnly: false,
    });
  }, /THROW_ID_03/);
  t.throws(() => {
    stripHtml("zzz", {
      returnRangesOnly: null,
    });
  }, /THROW_ID_03/);
  t.throws(() => {
    stripHtml("zzz", {
      returnRangesOnly: undefined,
    });
  }, /THROW_ID_03/);
  t.end();
});

tap.test("08 - wrong opts.dumpLinkHrefsNearby", (t) => {
  t.throws(() => {
    stripHtml("zzz", { dumpLinkHrefsNearby: true });
  }, /THROW_ID_04/);
  t.end();
});

tap.test("09 - wrong opts.stripTogetherWithTheirContents", (t) => {
  t.throws(() => {
    stripHtml("zzz", { stripTogetherWithTheirContents: ["div", 1] });
  }, /THROW_ID_05/);
  t.end();
});

// legit input
// -----------------------------------------------------------------------------

tap.test("10 - empty input", (t) => {
  t.hasStrict(
    stripHtml(""),
    {
      result: "",
      ranges: null,
      allTagLocations: [],
      filteredTagLocations: [],
    },
    "10"
  );
  t.end();
});

tap.test("11 - tabs only", (t) => {
  const input = "\t\t\t";
  t.hasStrict(
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
  t.hasStrict(
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
  t.end();
});

tap.test("12 - spaces only", (t) => {
  const input = "   ";
  t.hasStrict(
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
  t.hasStrict(
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
  t.end();
});
