import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";
import { rApply } from "ranges-apply";

import { stripHtml } from "./util/noLog.js";

// whacky inputs
// -----------------------------------------------------------------------------

test("01 - whacky - sequence of empty <> - single", () => {
  let input = "<>";
  equal(stripHtml(input).result, input, "01.01");
  equal(rApply(input, stripHtml(input).ranges), input, "01.02");
});

test("02 - whacky - sequence of empty <> - tight outside EOL", () => {
  let input = "<><>";
  equal(stripHtml(input).result, input, "02.01");
  equal(rApply(input, stripHtml(input).ranges), input, "02.02");
});

test("03 - whacky - sequence of empty <> - tight outside, content", () => {
  let input = "a<><>b";
  equal(stripHtml(input).result, input, "03.01");
  equal(rApply(input, stripHtml(input).ranges), input, "03.02");
});

test("04 - whacky - sequence of empty <> - just trimmed", () => {
  let input = "\na<><>b\n";
  let result = "a<><>b";
  equal(stripHtml(input).result, result, "04.01");
  equal(rApply(input, stripHtml(input).ranges), result, "04.02");
});

test("05 - whacky - brackets used for expressive purposes (very very suspicious but possible)", () => {
  let input = "text <<<<<<<<<<< text";
  equal(stripHtml(input).result, input, "05.01");
  equal(rApply(input, stripHtml(input).ranges), input, "05.02");
});

test("06 - brackets used for expressive purposes (very very suspicious but possible)", () => {
  let input = "text <<<<<<<<<<< text <<<<<<<<<<< text";
  equal(stripHtml(input).result, input, "06.01");
  equal(rApply(input, stripHtml(input).ranges), input, "06.02");
});

test("07 - brackets used for expressive purposes (very very suspicious but possible)", () => {
  let input = "<article> text <<<<<<<<<<< text </article>";
  let result = "text <<<<<<<<<<< text";
  equal(stripHtml(input).result, result, "07.01");
  equal(rApply(input, stripHtml(input).ranges), result, "07.02");
});

test("08 - brackets used for expressive purposes (very very suspicious but possible)", () => {
  // will not remove
  let input = "text1 <<<<<<<<<<< text2 >>>>>>>>>>> text3";
  equal(stripHtml(input).result, input, "08.01");
  equal(rApply(input, stripHtml(input).ranges), input, "08.02");
});

test("09 - brackets used for expressive purposes (very very suspicious but possible)", () => {
  let input = "<article> text1 <<<<<<<<<<< text2 >>>>>>>>> text3 </article>";
  let result = "text1 <<<<<<<<<<< text2 >>>>>>>>> text3";
  equal(stripHtml(input).result, result, "09.01");
  equal(rApply(input, stripHtml(input).ranges), result, "09.02");
});

test.run();
