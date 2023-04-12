import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { rOffset } from "../dist/ranges-offset.esm.js";

test("01 - bool", () => {
  equal(rOffset(true, 0), true, "01.01");
  equal(rOffset(true, 1), true, "01.02");
  equal(rOffset(true, 10), true, "01.03");
});

test("02 - null", () => {
  equal(rOffset(null, 0), null, "02.01");
  equal(rOffset(null, 1), null, "02.02");
  equal(rOffset(null, 10), null, "02.03");
});

test("03 - empty array", () => {
  equal(rOffset([], 0), [], "03.01");
  equal(rOffset([], 1), [], "03.02");
  equal(rOffset([], 10), [], "03.03");
});

test("04 - one empty range array", () => {
  equal(rOffset([[]], 0), [[]], "04.01");
  equal(rOffset([[]], 1), [[]], "04.02");
  equal(rOffset([[]], 10), [[]], "04.03");
});

test("05", () => {
  equal(rOffset([[0, 1]], 0), [[0, 1]], "05.01");
  equal(rOffset([[0, 1]], 1), [[1, 2]], "05.02");
  equal(rOffset([[0, 1]], 10), [[10, 11]], "05.03");
});

test("06 - missing offset value", () => {
  equal(rOffset([[0, 1]]), [[0, 1]], "06.01");
  equal(rOffset([[1, 2]]), [[1, 2]], "06.02");
  equal(rOffset([[10, 11]]), [[10, 11]], "06.03");
});

test("07 - input args are not mutated", () => {
  let input = [[0, 1]];
  equal(rOffset(input, 10), [[10, 11]], "07.01");
  equal(input, [[0, 1]], "07.02");
});

test.run();
