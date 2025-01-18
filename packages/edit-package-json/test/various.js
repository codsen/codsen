import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { set } from "../dist/edit-package-json.esm.js";

// -----------------------------------------------------------------------------
// Various
// -----------------------------------------------------------------------------

test("01", () => {
  let source = '{"a": ["b", "0"]}';
  let result = '{"a": ["1", "0"]}';
  equal(set(source, "a.0", "1"), result, "01.01");
});

test("02", () => {
  let source = '{"a": ["b", "0"]}';
  let result = '{"a": ["b", "1"]}';
  equal(set(source, "a.1", "1"), result, "02.01");
});

test("03", () => {
  let source = '{"a": {"b": "0"}}';
  let result = '{"a": {"b": "1"}}';
  equal(set(source, "a.b", "1"), result, "03.01");
});

test("04", () => {
  let source = '{"a": [{"b": "0"}]}';
  let result = '{"a": [{"b": "1"}]}';
  equal(set(source, "a.0.b", "1"), result, "04.01");
});

test("05", () => {
  let source = '{"a": [{"b": []},{"c": "0"}]}';
  let result = '{"a": [{"b": []},{"c": "1"}]}';
  equal(set(source, "a.1.c", "1"), result, "05.01");
});

test("06", () => {
  let source = '{"a": [{"b": {}},{"c": "0"}]}';
  let result = '{"a": [{"b": {}},{"c": "1"}]}';
  equal(set(source, "a.1.c", "1"), result, "06.01");
});

test("07 - string instead of empty array of #6", () => {
  let source = '{"a": [{"b": "x","c": {}},{"d": "0"}]}';
  let result = '{"a": [{"b": "x","c": {}},{"d": "1"}]}';
  equal(set(source, "a.1.d", "1"), result, "07.01");
});

test("08", () => {
  let source = '{"a": [{"b": {},"c": {}},{"d": "0"}]}';
  let result = '{"a": [{"b": {},"c": {}},{"d": "1"}]}';
  equal(set(source, "a.1.d", "1"), result, "08.01");
});

test("09", () => {
  let source = '{"a": [{"c": {}},{"d": "0"}]}';
  let result = '{"a": [{"c": {}},{"d": "1"}]}';
  equal(set(source, "a.1.d", "1"), result, "09.01");
});

test("10", () => {
  let source = '{"a": [{"b": ["x"],"c": {}},{"d": "0"}]}';
  let result = '{"a": [{"b": ["x"],"c": {}},{"d": "1"}]}';
  equal(set(source, "a.1.d", "1"), result, "10.01");
});

test("11", () => {
  let source = '{"a": [{"b": [],"c": {}},{"d": "0"}]}';
  let result = '{"a": [{"b": [],"c": {}},{"d": "1"}]}';
  equal(set(source, "a.1.d", "1"), result, "11.01");
});

test.run();
