import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { truncate } from "../dist/string-truncator.esm.js";

// THROW_01
// -----------------------------------------------------------------------------

test("01 - no 1st arg", () => {
  throws(() => {
    truncate();
  }, /THROW_ID_01/g);
});

test("02 - 1st arg null", () => {
  throws(() => {
    truncate(null);
  }, /THROW_ID_01/g);
});

test("03 - 1st arg undefined", () => {
  throws(() => {
    truncate(undefined);
  }, /THROW_ID_01/g);
});

// THROW_02
// -----------------------------------------------------------------------------

test("04 - 1st arg bool", () => {
  throws(() => {
    truncate(true);
  }, /THROW_ID_02/g);
});

test("05 - 1st arg number", () => {
  throws(() => {
    truncate(1);
  }, /THROW_ID_02/g);
});

// THROW_03
// -----------------------------------------------------------------------------

test("06 - opts.noEmpty", () => {
  throws(() => {
    truncate("");
  }, /THROW_ID_03/g);
  throws(() => {
    truncate("", { noEmpty: true });
  }, /THROW_ID_03/g);
  equal(
    truncate("", { noEmpty: false }),
    { result: "", addEllipsis: false }, // length limit is 11 chars!
    "06.03"
  );
});

// THROW_ID_04
// -----------------------------------------------------------------------------

test("07 - opts.maxLen", () => {
  throws(() => {
    truncate("aaa", {
      maxLen: true,
    });
  }, /THROW_ID_04/g);
  throws(() => {
    truncate("aaa", {
      maxLen: "10",
    });
  }, /THROW_ID_04/g);
});

// THROW_ID_05
// -----------------------------------------------------------------------------

test("08 - opts.maxLines wrong type", () => {
  throws(() => {
    truncate("aaa", {
      maxLines: true,
    });
  }, /THROW_ID_05/g);
  throws(() => {
    truncate("aaa", {
      maxLines: "10",
    });
  }, /THROW_ID_05/g);
});

// THROW_ID_06
// -----------------------------------------------------------------------------

test("09 - opts.maxLines === 0", () => {
  throws(() => {
    truncate("aaa", {
      maxLines: 0,
    });
  }, /THROW_ID_06/g);
});

test.run();
