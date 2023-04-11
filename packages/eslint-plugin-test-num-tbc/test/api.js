/* eslint-disable no-prototype-builtins */
import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";
import api from "../dist/eslint-plugin-test-num.esm.js";

// 00. API wirings
// -----------------------------------------------------------------------------

test("01 - object is exported", () => {
  equal(typeof api, "object", "01.01");
});

test("02 - exported object has rules", () => {
  ok(api.hasOwnProperty("rules"), "02.01");
});

test('03 - rule "correct-test-num" is exported', () => {
  ok(api.rules.hasOwnProperty("correct-test-num"), "03.01");
  equal(typeof api.rules["correct-test-num"], "object", "03.02");
  ok(api.rules["correct-test-num"].hasOwnProperty("create"), "03.03");
  equal(typeof api.rules["correct-test-num"].create, "function", "03.04");
});

test.run();
