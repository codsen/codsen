import tap from "tap";
import {
  left,
  // leftStopAtNewLines,
  right,
  // rightStopAtNewLines,
  leftSeq,
  rightSeq,
  // chompLeft,
  // chompRight,
} from "../dist/string-left-right.esm.js";

// EDGE CASES (there are no throws as it's an internal library)
// -----------------------------------------------------------------------------

tap.test(`01`, (t) => {
  t.equal(left(), null, "01.01");
  t.equal(right(), null, "01.02");
  t.end();
});

tap.test(`02`, (t) => {
  t.equal(left(1), null, "02.01");
  t.equal(right(1), null, "02.02");
  t.equal(leftSeq(1, 1, "a"), null, "02.03");
  t.equal(rightSeq(1, 1, "a"), null, "02.04");
  t.end();
});

tap.test(`03`, (t) => {
  t.equal(left(null), null, "03.01");
  t.equal(left(null, 1), null, "03.02");
  t.equal(right(null), null, "03.03");
  t.equal(right(null, 1), null, "03.04");
  t.end();
});
