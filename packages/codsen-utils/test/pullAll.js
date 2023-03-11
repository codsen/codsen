import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

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
  let input = undefined;
  let result = pullAll(input, undefined);
  equal(result, [], "14.01");
});

test.run();
