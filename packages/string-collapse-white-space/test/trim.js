// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { collapse } from "../dist/string-collapse-white-space.esm.js";
import { mixer } from "./util/util.js";

test("01 - one line, trimLines=false", () => {
  let input = "  a  ";
  mixer({
    trimStart: false,
    trimEnd: false,
    trimLines: false,
  }).forEach((opt) => {
    equal(
      collapse(input, opt).result,
      " a ",
      `01.01 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
});

test("02 - one line, trimLines=false", () => {
  let input = "  a  ";
  mixer({
    trimStart: true,
    trimEnd: false,
    trimLines: false,
  }).forEach((opt) => {
    equal(
      collapse(input, opt).result,
      "a ",
      `02.01 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
});

test("03 - one line, trimLines=false", () => {
  let input = "  a  ";
  mixer({
    trimStart: false,
    trimEnd: true,
    trimLines: false,
  }).forEach((opt) => {
    equal(
      collapse(input, opt).result,
      " a",
      `03.01 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
});

test("04 - one line, trimLines=false", () => {
  let input = "  a  ";
  mixer({
    trimStart: true,
    trimEnd: true,
    trimLines: false,
  }).forEach((opt) => {
    equal(
      collapse(input, opt).result,
      "a",
      `04.01 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
});

test("05 - one line, trimLines=true", () => {
  let input = "  a  ";
  mixer({
    trimLines: true,
  }).forEach((opt) => {
    equal(
      collapse(input, opt).result,
      "a",
      `05.01 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
});

test.run();
