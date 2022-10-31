import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { findType } from "../../dist/csv-sort.esm.js";

test("01 - text type", () => {
  equal(findType("a"), "text", "01.01");
  equal(findType("a a"), "text", "01.02");
  equal(findType("a a "), "text", "01.03");
  equal(findType(" Cost: £100 "), "text", "01.04");
});

test("02 - empty type", () => {
  equal(findType(""), "empty", "02.01");
  equal(findType(" "), "empty", "02.02");
  equal(findType("\n"), "empty", "02.03");
  equal(findType("\t"), "empty", "02.04");
  equal(findType(" \t \n \r\n "), "empty", "02.05");
});

test("03 - numeric type", () => {
  equal(findType("0"), "numeric", "03.01");
  equal(findType("1"), "numeric", "03.02");
  equal(findType("1.0"), "numeric", "03.03");
  equal(findType("1.00"), "numeric", "03.04");
  equal(findType("1.1"), "numeric", "03.05");
  equal(findType("1.10"), "numeric", "03.06");
  equal(findType("1.01"), "numeric", "03.07");
  equal(findType("0.01"), "numeric", "03.08");
  equal(findType("0.00"), "numeric", "03.09");
  equal(findType("$100"), "numeric", "03.10");
  equal(findType("$100.01"), "numeric", "03.11");
  equal(findType("$ 100.01"), "numeric", "03.12");
  equal(findType("100.01$"), "numeric", "03.13");
  equal(findType("100.01 $"), "numeric", "03.14");
  equal(findType("£100"), "numeric", "03.15");
  equal(findType("£100.00"), "numeric", "03.16");
  equal(findType("£100.10"), "numeric", "03.17");
  equal(findType("£100.01"), "numeric", "03.18");
  equal(findType("£ 100"), "numeric", "03.19");
  equal(findType("£ 100.00"), "numeric", "03.20");
  equal(findType("£ 100.01"), "numeric", "03.21");
  equal(findType("£ 100.10"), "numeric", "03.22");
  equal(findType("100£"), "numeric", "03.23");
  equal(findType("100.00£"), "numeric", "03.24");
  equal(findType("100.01£"), "numeric", "03.25");
  equal(findType("100.10£"), "numeric", "03.26");
  equal(findType("100 £"), "numeric", "03.27");
  equal(findType("100.0 £"), "numeric", "03.28");
  equal(findType("100.00 £"), "numeric", "03.29");
  equal(findType("100.01 £"), "numeric", "03.30");
  equal(findType("100.10 £"), "numeric", "03.31");
  equal(findType("100.10 £"), "numeric", "03.32");
});

test.run();
