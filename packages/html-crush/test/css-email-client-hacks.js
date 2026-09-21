import { rApply } from "ranges-apply";
import { test } from "uvu";
import { equal } from "uvu/assert";

import { crush } from "../dist/html-crush.esm.js";

// The required Yahoo separator is documented in the pinned post
// 2019-03-26-yahoo-2; see ops/email-client-hacks/provenance.json.
const options = { removeLineBreaks: true, breakToTheLeftOf: [] };

test("01 - preserves the significant separator in the Yahoo media-query hack", () => {
  equal(
    crush(
      "<style>@media screen yahoo { .target { color: red; } }</style>",
      options,
    ).result,
    "<style>@media screen yahoo {.target{color:red;} }</style>",
    "01.01",
  );
});

test("02 - collapses Yahoo media-query whitespace without deleting the separator", () => {
  equal(
    crush(
      "<style>@MEDIA\tSCREEN\nyahoo\n\t{ .target { color: red; } }</style>",
      options,
    ).result,
    "<style>@MEDIA SCREEN yahoo {.target{color:red;} }</style>",
    "02.01",
  );
  equal(
    crush(
      "<style>@media\nscreen\r\nyahoo\t  { .target { color: red; } }</style>",
      options,
    ).result,
    "<style>@media screen yahoo {.target{color:red;} }</style>",
    "02.02",
  );
});

test("03 - continues minifying unrelated selectors and at-rules", () => {
  for (const prelude of [
    ".yahoo",
    "yahoo",
    "screen yahoo",
    "@media print yahoo",
    "@media notscreen yahoo",
    "@supports screen yahoo",
    "@media screenyahoo",
    "@media screen notyahoo",
  ]) {
    equal(
      crush(`<style>${prelude} { color: red; }</style>`, options).result,
      `<style>${prelude}{color:red;}</style>`,
      "03.01",
    );
  }
});

test("04 - does not insert a missing Yahoo separator or change opaque CSS text", () => {
  equal(
    crush("<style>@media screen yahoo{.target{color:red;}}</style>", options)
      .result,
    "<style>@media screen yahoo{.target{color:red;} }</style>",
    "04.01",
  );
  equal(
    crush('<style>.target{content:"@media screen yahoo {"}</style>', options)
      .result,
    '<style>.target{content:"@media screen yahoo {"}</style>',
    "04.02",
  );
});

test("05 - preserves a Yahoo separator across line wrapping and reports matching ranges", () => {
  const input =
    "<style>@media screen yahoo { .target { color: red; } }</style>";
  for (const lineLengthLimit of [0, 30, 500]) {
    const actual = crush(input, { ...options, lineLengthLimit });
    equal(/yahoo\s+\{/.test(actual.result), true, "05.01");
    equal(rApply(input, actual.ranges), actual.result, "05.02");
  }
});

test.run();
