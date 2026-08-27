// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { pullAll } from "../dist/codsen-utils.esm.js";

test("01", () => {
  let input = null;
  let result = pullAll(input, ["a", "c"]);
  equal(result, [], "01.01");
});

test("02", () => {
  let input = [];
  let result = pullAll(input, ["a", "c"]);
  equal(result, [], "02.01");
});

test("03", () => {
  let input = ["a"];
  let result = pullAll(input, ["a", "c"]);
  equal(result, [], "03.01");
});

test("04", () => {
  let input = ["a", "a"];
  let result = pullAll(input, ["a", "c"]);
  equal(result, [], "04.01");
});

test("05 - with numbers", () => {
  let input = [1, 1];
  let result = pullAll(input, ["a", "c"]);
  equal(result, [1, 1], "05.01");
});

test("06", () => {
  let input = ["a", "b", "a", "b", "c"];
  let result = pullAll(input, ["a", "c"]);
  equal(result, ["b", "b"], "06.01");
});

test("07 - second arg null", () => {
  let input = [];
  let result = pullAll(input, null);
  equal(result, [], "07.01");
});

test("08 - second arg null", () => {
  let input = ["a"];
  let result = pullAll(input, null);
  equal(result, ["a"], "08.01");
  is.not(result, input, "08.02");
});

test("09 - second arg empty", () => {
  let input = [];
  let result = pullAll(input, []);
  equal(result, [], "09.01");
});

test("10 - second arg empty", () => {
  let input = ["a"];
  let result = pullAll(input, []);
  equal(result, ["a"], "10.01");
  is.not(result, input, "10.02");
});

test("11 - both empty", () => {
  let input = [];
  let result = pullAll(input, []);
  equal(result, [], "11.01");
});

test("12 - both null", () => {
  let input = null;
  let result = pullAll(input, null);
  equal(result, [], "12.01");
});

test("13 - both empty strings", () => {
  let input = "";
  let result = pullAll(input, "");
  equal(result, [], "13.01");
});

test("14 - both undefined", () => {
  let input;
  let result = pullAll(input, undefined);
  equal(result, [], "14.01");
});

test("15 - uses SameValueZero equality", () => {
  let result = pullAll([NaN, -0, 0, 1], [NaN, 0]);

  equal(result, [1], "15.01");
});

test("16 - sparse inputs are compacted like Array.prototype.filter", () => {
  let input = new Array(5);
  input[1] = undefined;
  input[2] = "keep";
  input[4] = "remove";

  let result = pullAll(input, ["remove"]);

  equal(result, [undefined, "keep"], "16.01");
  equal(result.length, 2, "16.02");
  equal(0 in result, true, "16.03");
});

test("17 - uses a Set for large inputs and removal lists", () => {
  let input = Array.from({ length: 130 }, (_, index) => index % 10);
  let result = pullAll(input, [1, 3, 5, 7, 9]);

  equal(
    result,
    input.filter((value) => value % 2 === 0),
    "17.01",
  );
});

test("18 - no-removal copies preserve holes and shallow element identity", () => {
  let shared = { marker: true };
  let input = new Array(4);
  input[1] = shared;
  input[3] = undefined;

  let result = pullAll(input, []);

  is.not(result, input, "18.01");
  equal(result.length, 4, "18.02");
  equal(0 in result, false, "18.03");
  equal(1 in result, true, "18.04");
  equal(2 in result, false, "18.05");
  equal(3 in result, true, "18.06");
  is(result[1], shared, "18.07");
});

test.run();
