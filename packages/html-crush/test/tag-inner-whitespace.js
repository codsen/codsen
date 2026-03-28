// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { m } from "./util/util.js";

// whitespace around tag brackets, inside tag
// -----------------------------------------------------------------------------

test(`01 - tag inner whitespace - whitespace before closing bracket on opening tag`, () => {
  equal(
    m(equal, "x<a >y", {
      removeLineBreaks: true,
    }).result,
    "x<a>y",
    "01.01",
  );
  equal(
    m(equal, "x<a > y", {
      removeLineBreaks: true,
    }).result,
    "x<a> y",
    "01.02",
  );
  equal(
    m(equal, "x<a>y", {
      removeLineBreaks: true,
    }).result,
    "x<a>y",
    "01.03",
  );
});

test(`02 - tag inner whitespace - div - block level`, () => {
  equal(
    m(equal, "x<div >y", {
      removeLineBreaks: true,
    }).result,
    "x<div>y",
    "02.01",
  );
});

test(`03 - tag inner whitespace - a - inline tag`, () => {
  equal(
    m(equal, "x<a >y", {
      removeLineBreaks: false,
    }).result,
    "x<a>y",
    "03.01",
  );
});

test(`04 - tag inner whitespace - removeLineBreaks = off`, () => {
  equal(
    m(equal, "x<div >y", {
      removeLineBreaks: false,
    }).result,
    "x<div>y",
    "04.01",
  );
});

test(`05 - tag inner whitespace - all opts off, inline tag`, () => {
  equal(
    m(equal, "x<a >y", {
      removeLineBreaks: false,
      removeIndentations: false,
    }).result,
    "x<a>y",
    "05.01",
  );
});

test(`06 - tag inner whitespace - all opts off, block level tag`, () => {
  equal(
    m(equal, "x<div >y", {
      removeLineBreaks: false,
      removeIndentations: false,
    }).result,
    "x<div>y",
    "06.01",
  );
});

test(`07 - tag inner whitespace - before closing slash`, () => {
  equal(
    m(equal, "x<a />y", {
      removeLineBreaks: true,
    }).result,
    "x<a/>y",
    "07.01",
  );
});

test(`08 - tag inner whitespace - after closing slash`, () => {
  equal(
    m(equal, "x<a/ >y", {
      removeLineBreaks: true,
    }).result,
    "x<a/>y",
    "08.01",
  );
});

test(`09 - tag inner whitespace - around closing slash`, () => {
  equal(
    m(equal, "x<a / >y", {
      removeLineBreaks: true,
    }).result,
    "x<a/>y",
    "09.01",
  );
});

test(`10 - tag inner whitespace - around closing slash - non inline tag`, () => {
  equal(
    m(equal, "x<div / >y", {
      removeLineBreaks: true,
    }).result,
    "x<div/>y",
    "10.01",
  );
});

test.run();
