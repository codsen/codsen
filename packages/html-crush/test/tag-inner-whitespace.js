import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { m } from "./util/util.js";

// whitespace around tag brackets, inside tag
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${33}m${"tag inner whitespace"}\u001b[${39}m`} - whitespace before closing bracket on opening tag`, () => {
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

test(`02 - ${`\u001b[${33}m${"tag inner whitespace"}\u001b[${39}m`} - div - block level`, () => {
  equal(
    m(equal, "x<div >y", {
      removeLineBreaks: true,
    }).result,
    "x<div>y",
    "02.01",
  );
});

test(`03 - ${`\u001b[${33}m${"tag inner whitespace"}\u001b[${39}m`} - a - inline tag`, () => {
  equal(
    m(equal, "x<a >y", {
      removeLineBreaks: false,
    }).result,
    "x<a>y",
    "03.01",
  );
});

test(`04 - ${`\u001b[${33}m${"tag inner whitespace"}\u001b[${39}m`} - removeLineBreaks = off`, () => {
  equal(
    m(equal, "x<div >y", {
      removeLineBreaks: false,
    }).result,
    "x<div>y",
    "04.01",
  );
});

test(`05 - ${`\u001b[${33}m${"tag inner whitespace"}\u001b[${39}m`} - all opts off, inline tag`, () => {
  equal(
    m(equal, "x<a >y", {
      removeLineBreaks: false,
      removeIndentations: false,
    }).result,
    "x<a>y",
    "05.01",
  );
});

test(`06 - ${`\u001b[${33}m${"tag inner whitespace"}\u001b[${39}m`} - all opts off, block level tag`, () => {
  equal(
    m(equal, "x<div >y", {
      removeLineBreaks: false,
      removeIndentations: false,
    }).result,
    "x<div>y",
    "06.01",
  );
});

test(`07 - ${`\u001b[${33}m${"tag inner whitespace"}\u001b[${39}m`} - before closing slash`, () => {
  equal(
    m(equal, "x<a />y", {
      removeLineBreaks: true,
    }).result,
    "x<a/>y",
    "07.01",
  );
});

test(`08 - ${`\u001b[${33}m${"tag inner whitespace"}\u001b[${39}m`} - after closing slash`, () => {
  equal(
    m(equal, "x<a/ >y", {
      removeLineBreaks: true,
    }).result,
    "x<a/>y",
    "08.01",
  );
});

test(`09 - ${`\u001b[${33}m${"tag inner whitespace"}\u001b[${39}m`} - around closing slash`, () => {
  equal(
    m(equal, "x<a / >y", {
      removeLineBreaks: true,
    }).result,
    "x<a/>y",
    "09.01",
  );
});

test(`10 - ${`\u001b[${33}m${"tag inner whitespace"}\u001b[${39}m`} - around closing slash - non inline tag`, () => {
  equal(
    m(equal, "x<div / >y", {
      removeLineBreaks: true,
    }).result,
    "x<div/>y",
    "10.01",
  );
});

test.run();
