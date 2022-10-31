import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { convertOne, convertAll } from "../dist/string-apostrophes.esm.js";

// convertOne()
// -----------------------------------------------------------------------------

test(`01 - 1st input arg is missing`, () => {
  throws(() => {
    convertOne();
  }, /THROW_ID_01/);
});

test(`02 - 1st input arg wrong type`, () => {
  throws(() => {
    convertOne(true);
  }, /THROW_ID_01/);
});

test(`03 - 2nd input arg wrong type`, () => {
  throws(() => {
    convertOne("abc", true);
  }, /THROW_ID_02/);
});

test(`04 - 2nd input arg wrong type`, () => {
  throws(() => {
    convertOne("abc", []);
  }, /THROW_ID_02/);
});

test(`05 - opts.to is wrong`, () => {
  throws(() => {
    convertOne("abc", {});
  }, /THROW_ID_03/);
});

test(`06 - opts.from is wrong`, () => {
  throws(() => {
    convertOne("abc", { from: true });
  }, /THROW_ID_03/);
});

test(`07 - opts.from is wrong`, () => {
  throws(() => {
    convertOne("a", { from: -1 });
  }, /THROW_ID_03/);
});

test(`08 - opts.from is at or beyond str.length`, () => {
  throws(() => {
    convertOne("a", { from: 1 });
  }, /THROW_ID_04/);
});

test(`09 - opts.from is at or beyond str.length`, () => {
  throws(() => {
    convertOne("abc", { from: 999 });
  }, /THROW_ID_04/);
});

// convertAll()
// -----------------------------------------------------------------------------

test(`10 - 1st input arg is wrong`, () => {
  throws(() => {
    convertAll();
  }, /THROW_ID_10/);
});

test(`11 - 1st input arg is wrong`, () => {
  throws(() => {
    convertAll(true);
  }, /THROW_ID_10/);
});

test(`12 - 2nd input arg is wrong`, () => {
  throws(() => {
    convertAll("abc", true);
  }, /THROW_ID_11/);
});

test(`13 - 2nd input arg is wrong`, () => {
  throws(() => {
    convertAll("abc", []);
  }, /THROW_ID_11/);
});

test(`14 - early exit`, () => {
  equal(
    convertAll("", {}),
    {
      result: "",
      ranges: null,
    },
    "14.01"
  );
});

test.run();
