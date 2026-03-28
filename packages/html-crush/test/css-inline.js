// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { m } from "./util/util.js";

// 08. inline CSS minification
// -----------------------------------------------------------------------------

test(`01 - inline CSS minification - one tag, minimal - double quotes`, () => {
  let input1 = '  <a style="a: 100%; b: c-d; ">';
  let indentationsOnly = '<a style="a: 100%; b: c-d; ">';
  equal(
    m(equal, input1, {
      removeLineBreaks: true,
    }).result,
    '<a style="a:100%;b:c-d;">',
    "01.01",
  );
  equal(
    m(equal, input1, {
      removeLineBreaks: true,
      lineLengthLimit: 0,
    }).result,
    '<a style="a:100%;b:c-d;">',
    "01.02",
  );
  equal(
    m(equal, input1, {
      removeLineBreaks: false,
    }).result,
    indentationsOnly,
    "01.03",
  );
  equal(
    m(equal, input1, {
      removeLineBreaks: false,
      removeIndentations: false,
    }).result,
    input1,
    "01.04",
  );
});

test(`02 - inline CSS minification - inline CSS comments`, () => {
  equal(
    m(equal, '<a style="a: 100%;/*b: c-d;*/e: f;">', {
      removeLineBreaks: true,
    }).result,
    '<a style="a:100%;e:f;">',
    "02.01",
  );
});

test(`03 - inline CSS minification - line length limit falls in the middle of inline CSS comment`, () => {
  equal(
    m(equal, '<a style="a: 100%;/*b: c-d;*/e: f;">', {
      removeLineBreaks: true,
      lineLengthLimit: 18,
    }).result,
    '<a style="a:100%;\ne:f;">',
    "03.01",
  );
});

test(`04 - inline CSS minification - line length becomes all right because of truncation`, () => {
  equal(
    m(equal, '<a style="a: 100%;/*b: c-d;*/e: f;">', {
      removeLineBreaks: true,
      lineLengthLimit: 30,
    }).result,
    '<a style="a:100%;e:f;">',
    "04.01",
  );
});

test(`05 - inline CSS minification - leading whitespace inside double quotes`, () => {
  equal(
    m(equal, '<a href="zzz" style=" font-size: 1px; ">', {
      removeLineBreaks: true,
    }).result,
    '<a href="zzz" style="font-size:1px;">',
    "05.01",
  );
});

test(`06 - inline CSS minification - leading whitespace inside single quotes`, () => {
  equal(
    m(equal, "<a href='zzz' style=' font-size: 1px; '>", {
      removeLineBreaks: true,
    }).result,
    "<a href='zzz' style='font-size:1px;'>",
    "06.01",
  );
});

test.run();
