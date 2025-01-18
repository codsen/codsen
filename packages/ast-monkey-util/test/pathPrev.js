import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { pathPrev } from "../dist/ast-monkey-util.esm.js";

test("01", () => {
  equal(pathPrev(""), null, "01.01");
});

test("02", () => {
  equal(pathPrev("0"), null, "02.01");
});

test("03", () => {
  equal(pathPrev("1"), "0", "03.01");
});

test("04", () => {
  equal(pathPrev("1.z"), null, "04.01");
});

test("05", () => {
  equal(pathPrev("9.children.33"), "9.children.32", "05.01");
});

test("06", () => {
  equal(
    pathPrev("9.children.1.children.2"),
    "9.children.1.children.1",
    "06.01",
  );
});

test.run();
