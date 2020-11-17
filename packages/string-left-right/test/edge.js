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
} from "../dist/string-left-right.esm";

// EDGE CASES (there are no throws as it's an internal library)
// -----------------------------------------------------------------------------

tap.test(`01`, (t) => {
  t.equal(left(), null, "01.01");
  t.equal(right(), null, "01.02");
  t.equal(leftSeq(), null, "01.03");
  t.equal(rightSeq(), null, "01.04");
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
  t.equal(leftSeq(null), null, "03.05");
  t.equal(leftSeq(null, 1), null, "03.06");
  t.equal(rightSeq(null), null, "03.07");
  t.equal(rightSeq(null, 1), null, "03.08");
  t.end();
});
