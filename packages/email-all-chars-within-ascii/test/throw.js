import tap from "tap";
import { within } from "../dist/email-all-chars-within-ascii.esm";

tap.test("01 - wrong/missing input = throw", (t) => {
  t.throws(() => {
    within();
  }, /THROW_ID_01/g);
  t.throws(() => {
    within(1);
  }, /THROW_ID_01/g);
  t.throws(() => {
    within(null);
  }, /THROW_ID_01/g);
  t.throws(() => {
    within(undefined);
  }, /THROW_ID_01/g);
  t.throws(() => {
    within(true);
  }, /THROW_ID_01/g);

  t.end();
});

tap.test("02 - wrong opts = throw", (t) => {
  t.throws(() => {
    within("aaaa", true); // not object but bool
  }, /THROW_ID_02/g);
  t.throws(() => {
    within("aaaa", 1); // not object but number
  }, /THROW_ID_02/g);
  t.doesNotThrow(() => {
    within("aaaa", undefined); // hardcoded "nothing" is ok!
  }, "02.03");
  t.doesNotThrow(() => {
    within("aaaa", null); // null fine too - that's hardcoded "nothing"
  }, "02.04");

  t.end();
});
