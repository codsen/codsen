import vm from "node:vm";

import { test } from "uvu";
import { equal } from "uvu/assert";

import { isDate } from "../dist/codsen-utils.esm.js";

test("01 - recognises dates", () => {
  equal(isDate(new Date()), true, "01.01");
  equal(isDate(new Date("invalid")), true, "01.02");
  equal(isDate(vm.runInNewContext("new Date(0)")), true, "01.03");
  equal(isDate(new (class ExtendedDate extends Date {})()), true, "01.04");
});

test("02 - rejects non-dates", () => {
  equal(isDate(null), false, "02.01");
  equal(isDate(0), false, "02.02");
  equal(isDate({ [Symbol.toStringTag]: "Date" }), false, "02.03");
  equal(isDate([]), false, "02.04");
  equal(isDate(new (class FakeDate {})()), false, "02.05");
});

test.run();
