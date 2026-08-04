// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { stripHtml } from "./util/noLog.js";

// CDATA
// -----------------------------------------------------------------------------

test("001 - CDATA - tight", () => {
  // surroundings are not a linebreaks
  equal(
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
    "001.01",
  );
});

test("002 - CDATA - normal", () => {
  equal(
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
    "002.01",
  );
});

test("003 - CDATA - loose", () => {
  equal(
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
    "003.01",
  );
});

test("004 - CDATA - single linebreaks", () => {
  // surroundings are linebreaks
  equal(
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
    "004.01",
  );
});

test("005 - CDATA - excessive linebreaks", () => {
  equal(
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
    "005.01",
  );
});

test("006 - CDATA - mixed linebreaks", () => {
  equal(
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
    "006.01",
  );
});

test.run();
