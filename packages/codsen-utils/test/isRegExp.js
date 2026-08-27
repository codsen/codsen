import vm from "node:vm";

import { test } from "uvu";
import { equal } from "uvu/assert";

import { isRegExp } from "../dist/codsen-utils.esm.js";

test("01 - recognises regular expressions", () => {
  equal(isRegExp(/value/), true, "01.01");
  equal(isRegExp(vm.runInNewContext("/value/")), true, "01.02");
  equal(isRegExp(new (class extends RegExp {})("value")), true, "01.03");
});

test("02 - rejects non-regular expressions", () => {
  equal(isRegExp(null), false, "02.01");
  equal(isRegExp("/value/"), false, "02.02");
  equal(isRegExp({ [Symbol.toStringTag]: "RegExp" }), false, "02.03");
  equal(isRegExp(new Proxy(/value/, {})), false, "02.04");

  const { proxy, revoke } = Proxy.revocable(/value/, {});
  revoke();
  equal(isRegExp(proxy), false, "02.05");
});

test("03 - rejects same-realm and cross-realm RegExp prototypes", () => {
  equal(isRegExp(RegExp.prototype), false, "03.01");
  equal(isRegExp(vm.runInNewContext("RegExp.prototype")), false, "03.02");
});

test.run();
