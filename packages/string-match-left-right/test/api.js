import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import {
  matchLeftIncl,
  matchRightIncl,
  // matchLeft,
  // matchRight,
} from "../dist/string-match-left-right.esm.js";

// input arg validation
// -----------------------------------------------------------------------------

test("01 - throws", () => {
  // no third arg
  throws(() => {
    matchLeftIncl("zzz", 1);
  }, /THROW_ID_08/);

  throws(() => {
    matchRightIncl("zzz", 1);
  }, /THROW_ID_08/);

  // third arg being wrong

  throws(() => {
    matchRightIncl("zzz", 1, 1);
  }, /THROW_ID_05/);

  throws(() => {
    matchRightIncl("zzz", "aaa", 1);
  }, /THROW_ID_03/);

  throws(() => {
    matchRightIncl("zzz", "aaa", "");
  }, /THROW_ID_03/);

  throws(() => {
    matchRightIncl("zzz", "aaa", [""]);
  }, /THROW_ID_03/);

  throws(() => {
    matchRightIncl("zzz", "aaa", ["", ""]);
  }, /THROW_ID_03/);

  // no second arg

  throws(() => {
    matchLeftIncl("zzz", null, ["aaa"]);
  }, /THROW_ID_03/);

  throws(() => {
    matchRightIncl("zzz", null, ["aaa"]);
  }, /THROW_ID_03/);

  throws(() => {
    matchRightIncl("zzz", null, []);
  }, /THROW_ID_03/);

  throws(() => {
    matchRightIncl("zzz", null, "");
  }, /THROW_ID_03/);

  // second arg completely missing onwards

  throws(() => {
    matchLeftIncl("zzz");
  }, /THROW_ID_03/);

  throws(() => {
    matchRightIncl("zzz");
  }, /THROW_ID_03/);

  // fourth arg not a plain object
  throws(() => {
    matchRightIncl("zzz", 1, ["aaa"], true);
  }, /THROW_ID_06/);

  // opts.trimBeforeMatching wrong type
  throws(() => {
    matchRightIncl("zzz", 1, ["aaa"], {
      trimBeforeMatching: "z",
    });
  }, /THROW_ID_09/);

  throws(() => {
    matchRightIncl("zzz", 1, ["aaa"], {
      trimBeforeMatching: [],
    });
  }, /trimCharsBeforeMatching/);
});

test.run();
