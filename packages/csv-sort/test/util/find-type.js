import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { findType } from "../../dist/csv-sort.esm.js";

test("01 - text type", () => {
  equal(findType("a"), "text");
  equal(findType("a a"), "text");
  equal(findType("a a "), "text");
  equal(findType(" Cost: £100 "), "text");
});

test("02 - empty type", () => {
  equal(findType(""), "empty");
  equal(findType(" "), "empty");
  equal(findType("\n"), "empty");
  equal(findType("\t"), "empty");
  equal(findType(" \t \n \r\n "), "empty");
});

test("03 - numeric type", () => {
  equal(findType("0"), "numeric");
  equal(findType("1"), "numeric");
  equal(findType("1.0"), "numeric");
  equal(findType("1.00"), "numeric");
  equal(findType("1.1"), "numeric");
  equal(findType("1.10"), "numeric");
  equal(findType("1.01"), "numeric");
  equal(findType("0.01"), "numeric");
  equal(findType("0.00"), "numeric");
  equal(findType("$100"), "numeric");
  equal(findType("$100.01"), "numeric");
  equal(findType("$ 100.01"), "numeric");
  equal(findType("100.01$"), "numeric");
  equal(findType("100.01 $"), "numeric");
  equal(findType("£100"), "numeric");
  equal(findType("£100.00"), "numeric");
  equal(findType("£100.10"), "numeric");
  equal(findType("£100.01"), "numeric");
  equal(findType("£ 100"), "numeric");
  equal(findType("£ 100.00"), "numeric");
  equal(findType("£ 100.01"), "numeric");
  equal(findType("£ 100.10"), "numeric");
  equal(findType("100£"), "numeric");
  equal(findType("100.00£"), "numeric");
  equal(findType("100.01£"), "numeric");
  equal(findType("100.10£"), "numeric");
  equal(findType("100 £"), "numeric");
  equal(findType("100.0 £"), "numeric");
  equal(findType("100.00 £"), "numeric");
  equal(findType("100.01 £"), "numeric");
  equal(findType("100.10 £"), "numeric");
  equal(findType("100.10 £"), "numeric");
});

test.run();
