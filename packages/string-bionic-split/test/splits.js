import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { split } from "../dist/string-bionic-split.esm.js";

test("01 - the", () => {
  equal(split("the"), 1, "01.01");
});

test("02 - of", () => {
  equal(split("of"), 1, "02.01");
});

test("03 - and", () => {
  equal(split("and"), 1, "03.01");
});

test("04 - a", () => {
  equal(split("a"), 1, "04.01");
});

test("05 - text", () => {
  equal(split("text"), 2, "05.01");
});

test("06 - s", () => {
  equal(split("s"), 0, "06.01");
});

test("07 - km", () => {
  equal(split("km"), 0, "07.01");
});

test("08 - four", () => {
  equal(split("four"), 2, "08.01");
});

test("09 - proof", () => {
  equal(split("proof"), 3, "09.01");
});

test("10 - amazing", () => {
  equal(split("amazing"), 4, "10.01");
});

test("11 - suites", () => {
  equal(split("suites"), 3, "11.01");
});

test("12 - trichotillomania", () => {
  equal(split("trichotillomania"), 8, "12.01");
});

test("13 - dès", () => {
  equal(split("dès"), 1, "13.01");
});

test("14 - impérieux", () => {
  equal(split("impérieux"), 5, "14.01");
});

test("15 - pourquoi", () => {
  equal(split("pourquoi"), 4, "15.01");
});

test("16 - théâtres", () => {
  equal(split("théâtres"), 4, "16.01");
});

test("17 - речь", () => {
  equal(split("речь"), 2, "17.01");
});

test("18 - и", () => {
  equal(split("и"), 1, "18.01");
});

test("19 - время", () => {
  equal(split("время"), 3, "19.01");
});

test("20 - был", () => {
  equal(split("был"), 1, "20.01");
});

test("21 - зрения", () => {
  equal(split("зрения"), 3, "21.01");
});

test.run();
