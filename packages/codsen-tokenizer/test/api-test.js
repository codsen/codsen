// avanotonly

import test from "ava";
import ct from "../dist/codsen-tokenizer.esm";
// import deepContains from "ast-deep-contains";

// 00. api
// -----------------------------------------------------------------------------

test("00.01 - 1st arg missing", t => {
  // pinning throws by throw ID:
  const error1 = t.throws(() => {
    ct();
  });
  t.truthy(error1.message.includes("THROW_ID_01"));
});

test("00.02 - 1nd arg of a wrong type", t => {
  // pinning throws by throw ID:
  const error1 = t.throws(() => {
    ct(true);
  });
  t.truthy(error1.message.includes("THROW_ID_02"));
});

test("00.03 - 2nd arg (tagCb()) wrong", t => {
  // pinning throws by throw ID:
  const error1 = t.throws(() => {
    ct("a", "z");
  });
  t.truthy(error1.message.includes("THROW_ID_03"));
});

test("00.04 - 3rd arg (charCb()) wrong", t => {
  // pinning throws by throw ID:
  const error1 = t.throws(() => {
    ct("a", () => {}, "z");
  });
  t.truthy(error1.message.includes("THROW_ID_04"));
});

test("00.04 - 4th arg (opts) is wrong", t => {
  // pinning throws by throw ID:
  const error1 = t.throws(() => {
    ct(
      "a",
      () => {},
      () => {},
      "z"
    );
  });
  t.truthy(error1.message.includes("THROW_ID_05"));
});

test("00.05 - opts.reportProgressFunc is wrong", t => {
  // pinning throws by throw ID:
  const error1 = t.throws(() => {
    ct(
      "a",
      () => {},
      () => {},
      { reportProgressFunc: "z" }
    );
  });
  t.truthy(error1.message.includes("THROW_ID_06"));
});
