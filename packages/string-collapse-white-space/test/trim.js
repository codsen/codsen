import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { collapse } from "../dist/string-collapse-white-space.esm.js";
import { mixer } from "./util/util.js";

test("01  - one line, trimLines=false", () => {
  let input = "  a  ";
  mixer({
    trimStart: false,
    trimEnd: false,
    trimLines: false,
  }).forEach((opt) => {
    equal(collapse(input, opt).result, " a ", JSON.stringify(opt, null, 0));
  });
});

test("02  - one line, trimLines=false", () => {
  let input = "  a  ";
  mixer({
    trimStart: true,
    trimEnd: false,
    trimLines: false,
  }).forEach((opt) => {
    equal(collapse(input, opt).result, "a ", JSON.stringify(opt, null, 0));
  });
});

test("03  - one line, trimLines=false", () => {
  let input = "  a  ";
  mixer({
    trimStart: false,
    trimEnd: true,
    trimLines: false,
  }).forEach((opt) => {
    equal(collapse(input, opt).result, " a", JSON.stringify(opt, null, 0));
  });
});

test("04  - one line, trimLines=false", () => {
  let input = "  a  ";
  mixer({
    trimStart: true,
    trimEnd: true,
    trimLines: false,
  }).forEach((opt) => {
    equal(collapse(input, opt).result, "a", JSON.stringify(opt, null, 0));
  });
});

test("05  - one line, trimLines=true", () => {
  let input = "  a  ";
  mixer({
    trimLines: true,
  }).forEach((opt) => {
    equal(collapse(input, opt).result, "a", JSON.stringify(opt, null, 0));
  });
});

test.run();
