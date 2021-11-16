import tap from "tap";
import { stripHtml } from "../dist/string-strip-html.esm.js";

// CDATA
// -----------------------------------------------------------------------------

tap.test("01 - CDATA - tight", (t) => {
  // surroundings are not a linebreaks
  t.hasStrict(
    stripHtml(`a<![CDATA[
    The <, &, ', and " can be used,
    *and* %MyParamEntity; can be expanded.
  ]]>b`),
    {
      result: "a b",
      ranges: [[1, 95, " "]],
      allTagLocations: [[1, 95]],
      filteredTagLocations: [[1, 95]],
    },
    "01"
  );
  t.end();
});

tap.test("02 - CDATA - normal", (t) => {
  t.hasStrict(
    stripHtml(`a <![CDATA[
  The <, &, ', and " can be used,
  *and* %MyParamEntity; can be expanded.
]]> b`),
    {
      result: "a b",
      ranges: [[1, 91, " "]],
      allTagLocations: [[2, 90]],
      filteredTagLocations: [[2, 90]],
    },
    "02"
  );
  t.end();
});

tap.test("03 - CDATA - loose", (t) => {
  t.hasStrict(
    stripHtml(`a \t\t<![CDATA[
    The <, &, ', and " can be used,
    *and* %MyParamEntity; can be expanded.
  ]]>       b`),
    {
      result: "a b",
      ranges: [[1, 105, " "]],
      allTagLocations: [[4, 98]],
      filteredTagLocations: [[4, 98]],
    },
    "03"
  );
  t.end();
});

tap.test("04 - CDATA - single linebreaks", (t) => {
  // surroundings are linebreaks
  t.hasStrict(
    stripHtml(`a\n<![CDATA[
    The <, &, ', and " can be used,
    *and* %MyParamEntity; can be expanded.
  ]]>\nb`),
    {
      result: "a\n\nb",
      ranges: [[1, 97, "\n\n"]],
      allTagLocations: [[2, 96]],
      filteredTagLocations: [[2, 96]],
    },
    "04"
  );
  t.end();
});

tap.test("05 - CDATA - excessive linebreaks", (t) => {
  t.hasStrict(
    stripHtml(`a\n\n\n<![CDATA[
    The <, &, ', and " can be used,
    *and* %MyParamEntity; can be expanded.
  ]]>\n\n\nb`),
    {
      result: "a\n\nb",
      ranges: [[1, 101, "\n\n"]],
      allTagLocations: [[4, 98]],
      filteredTagLocations: [[4, 98]],
    },
    "05"
  );
  t.end();
});

tap.test("06 - CDATA - mixed linebreaks", (t) => {
  t.hasStrict(
    stripHtml(`a\n \t\n\n<![CDATA[
    The <, &, ', and " can be used,
    *and* %MyParamEntity; can be expanded.
  ]]>\n\n\n\t b`),
    {
      result: "a\n\nb",
      ranges: [[1, 105, "\n\n"]],
      allTagLocations: [[6, 100]],
      filteredTagLocations: [[6, 100]],
    },
    "06"
  );
  t.end();
});
