import tap from "tap";
import stripHtml from "../dist/string-strip-html.esm";

// opts.returnRangesOnly
// -----------------------------------------------------------------------------

tap.test("01 - opts.returnRangesOnly - anchor wrapping text", (t) => {
  // both default known range tags
  t.same(
    stripHtml(
      'Some text <a class="btn btn__large" id="z">click me</a> and more text.'
    ),
    "Some text click me and more text.",
    "01.01 - default"
  );
  t.same(
    stripHtml(
      'Some text <a class="btn btn__large" id="z">click me</a> and more text.'
    ),
    "Some text click me and more text.",
    "01.02 - hardcoded defaults"
  );
  t.same(
    stripHtml(
      'Some text <a class="btn btn__large" id="z">click me</a> and more text.',
      { returnRangesOnly: true }
    ),
    [
      [9, 43, " "],
      [51, 56, " "],
    ],
    "01.03 - opts"
  );
  t.end();
});

tap.test("02 - opts.returnRangesOnly - no tags were present at all", (t) => {
  // t.same(stripHtml("Some text"), "Some text", "15.02.01 - control");
  t.same(
    stripHtml("Some text", {
      returnRangesOnly: true,
    }),
    [],
    "02 - returns empty array (no ranges inside)"
  );
  t.end();
});
