import tap from "tap";
import stripHtml from "../dist/string-strip-html.esm";

// opts.returnTagLocations
// -----------------------------------------------------------------------------

tap.todo("01 - opts.returnTagLocations - anchor wrapping text", (t) => {
  // both default known range tags
  const input = "abc <a>click me</a> def";
  t.same(stripHtml(input), "abc click me def", "01.01 - default");
  t.same(stripHtml(input), "abc click me def", "01.02 - hardcoded defaults");
  t.same(
    stripHtml(input, { returnTagLocations: true }),
    [
      [4, 7],
      [15, 19],
    ],
    "01.03 - opts"
  );
  t.end();
});

tap.todo("02 - opts.returnTagLocations - no tags were present at all", (t) => {
  const input = "abc";
  t.same(stripHtml(input), input, "02.01 - control");
  t.same(
    stripHtml("abc", {
      returnTagLocations: true,
    }),
    [], // <-- not null
    "02.02"
  );
  t.end();
});
