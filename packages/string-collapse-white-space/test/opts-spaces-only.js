import tap from "tap";
import collapse from "../dist/string-collapse-white-space.esm";

// opts.enforceSpacesOnly
// -----------------------------------------------------------------------------

tap.test(`01`, (t) => {
  t.strictSame(
    collapse(`a b`, {
      enforceSpacesOnly: false,
    }),
    { result: `a b`, ranges: null },
    "01"
  );
  t.end();
});

tap.test(`02`, (t) => {
  t.strictSame(
    collapse(`a b`, {
      enforceSpacesOnly: true,
    }),
    { result: `a b`, ranges: null },
    "02"
  );
  t.end();
});

// -----------------------------------------------------------------------------

tap.test(`03`, (t) => {
  t.strictSame(
    collapse(`a \tb`, {
      enforceSpacesOnly: false,
    }),
    { result: `a \tb`, ranges: null },
    "03"
  );
  t.end();
});

tap.test(`04`, (t) => {
  t.strictSame(
    collapse(`a \tb`, {
      enforceSpacesOnly: true,
    }),
    { result: `a b`, ranges: [[1, 3, " "]] },
    "04"
  );
  t.end();
});

// -----------------------------------------------------------------------------

tap.test(`05`, (t) => {
  t.strictSame(
    collapse(`a\t b`, {
      enforceSpacesOnly: false,
    }),
    { result: `a\t b`, ranges: null },
    "05"
  );
  t.end();
});

tap.test(`06`, (t) => {
  t.strictSame(
    collapse(`a\t b`, {
      enforceSpacesOnly: true,
    }),
    { result: `a b`, ranges: [[1, 3, " "]] },
    "06"
  );
  t.end();
});

// -----------------------------------------------------------------------------

tap.test(`07`, (t) => {
  t.strictSame(
    collapse(`a\tb`, {
      enforceSpacesOnly: false,
    }),
    { result: `a\tb`, ranges: null },
    "07"
  );
  t.end();
});

tap.test(`08`, (t) => {
  t.strictSame(
    collapse(`a\tb`, {
      enforceSpacesOnly: true,
    }),
    { result: `a b`, ranges: [[1, 2, " "]] },
    "08"
  );
  t.end();
});

// -----------------------------------------------------------------------------

tap.test(`09`, (t) => {
  t.strictSame(
    collapse(`a\t\tb`, {
      enforceSpacesOnly: false,
    }),
    { result: `a\t\tb`, ranges: null },
    "09"
  );
  t.end();
});

tap.test(`10`, (t) => {
  t.strictSame(
    collapse(`a\t\tb`, {
      enforceSpacesOnly: true,
    }),
    { result: `a b`, ranges: [[1, 3, " "]] },
    "10"
  );
  t.end();
});

// -----------------------------------------------------------------------------

tap.test(`11`, (t) => {
  t.strictSame(
    collapse(`a\nb`, {
      enforceSpacesOnly: false,
    }),
    { result: `a\nb`, ranges: null },
    "11"
  );
  t.end();
});

tap.test(`12`, (t) => {
  t.strictSame(
    collapse(`a\nb`, {
      enforceSpacesOnly: true,
    }),
    { result: `a\nb`, ranges: null },
    "12"
  );
  t.end();
});

// -----------------------------------------------------------------------------

tap.test(`13`, (t) => {
  t.strictSame(
    collapse(`a\r\nb`, {
      enforceSpacesOnly: false,
    }),
    { result: `a\r\nb`, ranges: null },
    "13"
  );
  t.end();
});

tap.test(`14`, (t) => {
  t.strictSame(
    collapse(`a\r\nb`, {
      enforceSpacesOnly: true,
    }),
    { result: `a\r\nb`, ranges: null },
    "14"
  );
  t.end();
});

// -----------------------------------------------------------------------------
