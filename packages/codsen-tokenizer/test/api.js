import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { tokenizer as ct } from "../dist/codsen-tokenizer.esm.js";
// import deepContains from "ast-deep-contains");

// 00. api
// -----------------------------------------------------------------------------

test("01 - 1st arg missing", () => {
  throws(
    () => {
      ct();
    },
    /THROW_ID_01/g,
    "01.01",
  );
});

test("02 - 1st arg of a wrong type", () => {
  throws(
    () => {
      ct(true);
    },
    /THROW_ID_02/g,
    "02.01",
  );
});

test("03 - 2nd arg (opts) is wrong", () => {
  throws(
    () => {
      ct("a", "z");
    },
    /THROW_ID_03/g,
    "03.01",
  );
});

test("04 - opts.tagCb() is wrong", () => {
  throws(
    () => {
      ct("a", { tagCb: "z" });
    },
    /THROW_ID_04/g,
    "04.01",
  );
});

test("05 - opts.charCb() is wrong", () => {
  throws(
    () => {
      ct("a", { charCb: "z" });
    },
    /THROW_ID_05/g,
    "05.01",
  );
});

test("06 - opts.reportProgressFunc is wrong", () => {
  throws(
    () => {
      ct("a", { reportProgressFunc: "z" });
    },
    /THROW_ID_06/g,
    "06.01",
  );
});

test.run();
