import tap from "tap";
import collapse from "../dist/string-collapse-white-space.esm";

// opts.enforceSpacesOnly
// -----------------------------------------------------------------------------

tap.test(`01`, (t) => {
  t.equal(
    collapse(`a b`, {
      enforceSpacesOnly: false,
    }).result,
    `a b`,
    "01"
  );
  t.end();
});

tap.test(`02`, (t) => {
  t.equal(
    collapse(`a b`, {
      enforceSpacesOnly: true,
    }).result,
    `a b`,
    "02"
  );
  t.end();
});

// -----------------------------------------------------------------------------

tap.test(`03`, (t) => {
  t.equal(
    collapse(`a \tb`, {
      enforceSpacesOnly: false,
    }).result,
    `a \tb`,
    "03"
  );
  t.end();
});

tap.test(`04`, (t) => {
  t.equal(
    collapse(`a \tb`, {
      enforceSpacesOnly: true,
    }).result,
    `a b`,
    "04"
  );
  t.end();
});

// -----------------------------------------------------------------------------

tap.test(`05`, (t) => {
  t.equal(
    collapse(`a\t b`, {
      enforceSpacesOnly: false,
    }).result,
    `a\t b`,
    "05"
  );
  t.end();
});

tap.test(`06`, (t) => {
  t.equal(
    collapse(`a\t b`, {
      enforceSpacesOnly: true,
    }).result,
    `a b`,
    "06"
  );
  t.end();
});

// -----------------------------------------------------------------------------

tap.test(`07`, (t) => {
  t.equal(
    collapse(`a\tb`, {
      enforceSpacesOnly: false,
    }).result,
    `a\tb`,
    "07"
  );
  t.end();
});

tap.test(`08`, (t) => {
  t.equal(
    collapse(`a\tb`, {
      enforceSpacesOnly: true,
    }).result,
    `a b`,
    "08"
  );
  t.end();
});

// -----------------------------------------------------------------------------

tap.test(`09`, (t) => {
  t.equal(
    collapse(`a\t\tb`, {
      enforceSpacesOnly: false,
    }).result,
    `a\t\tb`,
    "09"
  );
  t.end();
});

tap.test(`10`, (t) => {
  t.equal(
    collapse(`a\t\tb`, {
      enforceSpacesOnly: true,
    }).result,
    `a b`,
    "10"
  );
  t.end();
});

// -----------------------------------------------------------------------------

tap.test(`11`, (t) => {
  t.equal(
    collapse(`a\nb`, {
      enforceSpacesOnly: false,
    }).result,
    `a\nb`,
    "11"
  );
  t.end();
});

tap.test(`12`, (t) => {
  t.equal(
    collapse(`a\nb`, {
      enforceSpacesOnly: true,
    }).result,
    `a\nb`,
    "12"
  );
  t.end();
});

// -----------------------------------------------------------------------------

tap.test(`13`, (t) => {
  t.equal(
    collapse(`a\r\nb`, {
      enforceSpacesOnly: false,
    }).result,
    `a\r\nb`,
    "13"
  );
  t.end();
});

tap.test(`14`, (t) => {
  t.equal(
    collapse(`a\r\nb`, {
      enforceSpacesOnly: true,
    }).result,
    `a\r\nb`,
    "14"
  );
  t.end();
});

// -----------------------------------------------------------------------------
