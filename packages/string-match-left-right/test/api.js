import tap from "tap";
import {
  matchLeftIncl,
  matchRightIncl,
  // matchLeft,
  // matchRight,
} from "../dist/string-match-left-right.esm.js";

// input arg validation
// -----------------------------------------------------------------------------

tap.test("01 - throws", (t) => {
  // no third arg
  t.throws(() => {
    matchLeftIncl("zzz", 1);
  }, /THROW_ID_08/);

  t.throws(() => {
    matchRightIncl("zzz", 1);
  }, /THROW_ID_08/);

  // third arg being wrong

  t.throws(() => {
    matchRightIncl("zzz", 1, 1);
  }, /THROW_ID_05/);

  t.throws(() => {
    matchRightIncl("zzz", "aaa", 1);
  }, /THROW_ID_03/);

  t.throws(() => {
    matchRightIncl("zzz", "aaa", "");
  }, /THROW_ID_03/);

  t.throws(() => {
    matchRightIncl("zzz", "aaa", [""]);
  }, /THROW_ID_03/);

  t.throws(() => {
    matchRightIncl("zzz", "aaa", ["", ""]);
  }, /THROW_ID_03/);

  // no second arg

  t.throws(() => {
    matchLeftIncl("zzz", null, ["aaa"]);
  }, /THROW_ID_03/);

  t.throws(() => {
    matchRightIncl("zzz", null, ["aaa"]);
  }, /THROW_ID_03/);

  t.throws(() => {
    matchRightIncl("zzz", null, []);
  }, /THROW_ID_03/);

  t.throws(() => {
    matchRightIncl("zzz", null, "");
  }, /THROW_ID_03/);

  // second arg completely missing onwards

  t.throws(() => {
    matchLeftIncl("zzz");
  }, /THROW_ID_03/);

  t.throws(() => {
    matchRightIncl("zzz");
  }, /THROW_ID_03/);

  // fourth arg not a plain object
  t.throws(() => {
    matchRightIncl("zzz", 1, ["aaa"], true);
  }, /THROW_ID_06/);

  // opts.trimBeforeMatching wrong type
  t.throws(() => {
    matchRightIncl("zzz", 1, ["aaa"], {
      trimBeforeMatching: "z",
    });
  }, /THROW_ID_09/);

  t.throws(() => {
    matchRightIncl("zzz", 1, ["aaa"], {
      trimBeforeMatching: [],
    });
  }, /trimCharsBeforeMatching/);

  t.end();
});
