// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { rApply } from "ranges-apply";
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { stripHtml } from "./util/noLog.js";

// whacky inputs
// -----------------------------------------------------------------------------

test("001 - whacky - sequence of empty <> - single", () => {
  let input = "<>";
  equal(stripHtml(input).result, input, "001.01");
  equal(rApply(input, stripHtml(input).ranges), input, "001.02");
});

test("002 - whacky - sequence of empty <> - tight outside EOL", () => {
  let input = "<><>";
  equal(stripHtml(input).result, input, "002.01");
  equal(rApply(input, stripHtml(input).ranges), input, "002.02");
});

test("003 - whacky - sequence of empty <> - tight outside, content", () => {
  let input = "a<><>b";
  equal(stripHtml(input).result, input, "003.01");
  equal(rApply(input, stripHtml(input).ranges), input, "003.02");
});

test("004 - whacky - sequence of empty <> - just trimmed", () => {
  let input = "\na<><>b\n";
  let result = "a<><>b";
  equal(stripHtml(input).result, result, "004.01");
  equal(rApply(input, stripHtml(input).ranges), result, "004.02");
});

test("005 - whacky - brackets used for expressive purposes (very very suspicious but possible)", () => {
  let input = "text <<<<<<<<<<< text";
  equal(stripHtml(input).result, input, "005.01");
  equal(rApply(input, stripHtml(input).ranges), input, "005.02");
});

test("006 - brackets used for expressive purposes (very very suspicious but possible)", () => {
  let input = "text <<<<<<<<<<< text <<<<<<<<<<< text";
  equal(stripHtml(input).result, input, "006.01");
  equal(rApply(input, stripHtml(input).ranges), input, "006.02");
});

test("007 - brackets used for expressive purposes (very very suspicious but possible)", () => {
  let input = "<article> text <<<<<<<<<<< text </article>";
  let result = "text <<<<<<<<<<< text";
  equal(stripHtml(input).result, result, "007.01");
  equal(rApply(input, stripHtml(input).ranges), result, "007.02");
});

test("008 - brackets used for expressive purposes (very very suspicious but possible)", () => {
  // will not remove
  let input = "text1 <<<<<<<<<<< text2 >>>>>>>>>>> text3";
  equal(stripHtml(input).result, input, "008.01");
  equal(rApply(input, stripHtml(input).ranges), input, "008.02");
});

test("009 - brackets used for expressive purposes (very very suspicious but possible)", () => {
  let input = "<article> text1 <<<<<<<<<<< text2 >>>>>>>>> text3 </article>";
  let result = "text1 <<<<<<<<<<< text2 >>>>>>>>> text3";
  equal(stripHtml(input).result, result, "009.01");
  equal(rApply(input, stripHtml(input).ranges), result, "009.02");
});

test.run();
