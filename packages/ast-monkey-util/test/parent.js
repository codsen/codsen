import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { parent as parentItem } from "../dist/ast-monkey-util.esm.js";

test("01", () => {
  equal(parentItem(""), null, "01.01");
});

test("02", () => {
  equal(parentItem("0"), null, "02.01");
});

test("03", () => {
  equal(parentItem("1"), null, "03.01");
});

test("04", () => {
  equal(parentItem("a"), null, "04.01");
});

test("05", () => {
  equal(parentItem("1.z"), "1", "05.01");
});

test("06", () => {
  equal(parentItem("a.b"), "a", "06.01");
});

test("07", () => {
  equal(parentItem("a.b.c"), "b", "07.01");
});

test("08", () => {
  equal(parentItem("a.0.c"), "0", "08.01");
});

test("09", () => {
  equal(parentItem("9.children.3"), "children", "09.01");
});

test("10", () => {
  equal(parentItem("9.children.1.children.2"), "children", "10.01");
});

test.run();
