import tap from "tap";
import stripHtml from "../dist/string-strip-html.esm";

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

// legit input
// -----------------------------------------------------------------------------

tap.test("07 - empty input", (t) => {
  t.same(stripHtml(""), "", "07.01");
  t.same(
    stripHtml("", {
      returnRangesOnly: true,
    }),
    null,
    "07.02"
  );
  t.same(
    stripHtml("", {
      returnTagLocations: true,
    }),
    [],
    "07.03"
  );
  t.end();
});

tap.test("08 - whitespace only", (t) => {
  const source = "\t\t\t";
  t.same(stripHtml(source), "", "08.01");
  t.same(
    stripHtml(source, {
      trimOnlySpaces: true,
    }),
    source,
    "08.02"
  );

  // opts.returnRangesOnly
  t.same(
    stripHtml(source, {
      returnRangesOnly: true,
    }),
    [[0, 3]],
    "08.03"
  );
  t.same(
    stripHtml(source, {
      returnRangesOnly: true,
      trimOnlySpaces: true,
    }),
    null, // no ranges is always null
    "08.04"
  );

  // opts.returnTagLocations
  t.same(
    stripHtml(source, {
      returnTagLocations: true,
      trimOnlySpaces: false, // default
    }),
    [],
    "08.05"
  );
  t.same(
    stripHtml(source, {
      returnTagLocations: true,
      trimOnlySpaces: true, // doesn't matter, there are no tags anyway
    }),
    [],
    "08.06"
  );
  t.end();
});
