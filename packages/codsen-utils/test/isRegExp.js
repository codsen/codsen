import vm from "node:vm";

import { test } from "uvu";
import { equal } from "uvu/assert";

import { isRegExp } from "../dist/codsen-utils.esm.js";

test("01 - recognises regular expressions", () => {
  equal(isRegExp(/value/), true, "01.01");
  equal(isRegExp(vm.runInNewContext("/value/")), true, "01.02");
});

test("02 - rejects non-regular expressions", () => {
  equal(isRegExp(null), false, "02.01");
  equal(isRegExp("/value/"), false, "02.02");
  equal(isRegExp({ [Symbol.toStringTag]: "RegExp" }), false, "02.03");
});

test("03 - RegExp.prototype answers as it always has", () => {
  // it is not a regex, but the spec's source getter special-cases it instead
  // of throwing, so this has always reported true - pinned against drift
  equal(isRegExp(RegExp.prototype), true, "03.01");
  equal(isRegExp(vm.runInNewContext("RegExp.prototype")), false, "03.02");
});

test.run();
