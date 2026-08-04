// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { rApply } from "ranges-apply";
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { stripHtml } from "./util/noLog.js";
import validateTagLocations from "./util/validateTagLocations.js";

// concentrating on ranges output
// -----------------------------------------------------------------------------

test("001 - ranges - quick sanity check", () => {
  let intendedAllTagLocations = [
    [10, 43],
    [51, 55],
  ];
  let input =
    'Some text <a class="btn btn__large" id="z">click me</a> and more text.';

  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "Some text click me and more text.", "001.01");
  equal(
    ranges,
    [
      [9, 43, " "],
      [51, 56, " "],
    ],
    "001.02",
  );
  equal(allTagLocations, intendedAllTagLocations, "001.03");
  validateTagLocations(is, input, intendedAllTagLocations);
});

// ensure consistency with ranges-apply
// -----------------------------------------------------------------------------

test("002 - consistency with ranges-apply", () => {
  let input = `<!DOCTYPE html>
  <html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    <div>
      1
    </div>
    <div>
      2
    </div>
    <div>
      3
    </div>
  </body>
  </html>`;

  let intendedResult = "1\n\n2\n\n3";

  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, intendedResult, "002.01");
  equal(
    ranges,
    [
      [0, 136],
      [137, 165, "\n\n"],
      [166, 194, "\n\n"],
      [195, 226],
    ],
    "002.02",
  );
  equal(
    allTagLocations,
    [
      [0, 15],
      [18, 44],
      [47, 53],
      [58, 80],
      [85, 92],
      [92, 100],
      [103, 110],
      [113, 119],
      [124, 129],
      [142, 148],
      [153, 158],
      [171, 177],
      [182, 187],
      [200, 206],
      [209, 216],
      [219, 226],
    ],
    "002.03",
  );

  equal(rApply(input, stripHtml(input).ranges), result, "002.04");
});

test("003 - consistency with ranges-apply", () => {
  let inputs = [
    "",
    "   ",
    "<a>",
    " <a> ",
    "  <a>  ",
    "<a> <a>",
    " <a> <a> ",
    "  <a>  <a>  ",
    "  <a >  <a >  ",
    "  <br/>  <br/>  ",
    "  <br />  <br />  ",
    "\n\n\n\n\n\n<a>\n\n\n",
    "  <script>  </script>  ",
    "<script>",
    "</script>",
    " <script> ",
    " </script> ",
    "  <script>  ",
    "  </script>  ",
    "a",
    " a",
    "\na",
    " \na",
    " \n a",
    " \n\na",
    "..",
    " .. ",
    "    a   ",
    "\n",
    "     \n      ",
    "\t",
    "      \t      ",
    "\t    a   \t",
    "\t\t\t",
    "\t \t \t\n\n\n",
    "\r\n\r\n",
    "<a class>z</a>",
    " <a class> z </a> ",
    "  <a class>  z  </a>  ",
    " \r<a class>\n z \t</a> \r",
    " \r\n<a class>\n\n z \t\t</a> \r\r",
    '<a class="link">z</a>',
    '<a class="link">z<a>',
    ' <a class="link">z</a> ',
    ' <a class="link">z<a> ',
    '\t <a class="link">z</a> \t',
    '\t <a class="link">z<a> \t',
    "<script>z<script>",
    "<script>z</script>",
    " <script>z<script> ",
    " <script>z</script> ",
    "\t<script>z<script>\t",
    "\t<script>z</script>\t",
    " \t<script>z<script>\t ",
    " \t<script>z</script>\t ",
    "\t <script>z<script> \t",
    "\t <script>z</script> \t",
    " \t <script>z<script> \t ",
    " \t <script>z</script> \t ",
    `<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    something
  </body>
</html>`,
    `<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    <div>
      1
    </div>
    <div>
      2
    </div>
    <div>
      3
    </div>
  </body>
</html>`,
  ];

  inputs.forEach((input, idx) => {
    equal(
      stripHtml(input, { trimOnlySpaces: false }).result,
      rApply(
        input,
        stripHtml(input, {
          trimOnlySpaces: false, // <----------- trim all whitespace!
        }).ranges,
      ),
      "003.01",
    );
    equal(
      stripHtml(input, { trimOnlySpaces: true }).result,
      rApply(
        input,
        stripHtml(input, {
          trimOnlySpaces: true, // <----------- trim only spaces!
        }).ranges,
      ),
      "003.02",
    );
  });
});

test("004 - decoded entities retain original range coordinates", () => {
  const input = "&amp;<b>x</b>";
  const { result, ranges, allTagLocations, filteredTagLocations } =
    stripHtml(input);

  equal(result, "&x", "004.01");
  equal(
    ranges,
    [
      [0, 8, "&"],
      [9, 13],
    ],
    "004.02",
  );
  equal(rApply(input, ranges), result, "004.03");
  equal(
    allTagLocations,
    [
      [5, 8],
      [9, 13],
    ],
    "004.04",
  );
  equal(filteredTagLocations, allTagLocations, "004.05");
  validateTagLocations(is, input, allTagLocations);
});

test("005 - adjacent entities produce applicable source ranges", () => {
  const input = "&amp;&copy;";
  const { result, ranges, allTagLocations, filteredTagLocations } =
    stripHtml(input);

  equal(result, "&©", "005.01");
  equal(ranges, [[0, 11, "&©"]], "005.02");
  equal(rApply(input, ranges), result, "005.03");
  equal(allTagLocations, [], "005.04");
  equal(filteredTagLocations, [], "005.05");
});

test("006 - numeric recursive entities retain encoded tag locations", () => {
  const input = "x&#x26;lt;b&#x26;gt;y&#x26;lt;/b&#x26;gt;z";
  const { result, ranges, allTagLocations, filteredTagLocations } =
    stripHtml(input);

  equal(result, "xyz", "006.01");
  equal(
    ranges,
    [
      [1, 20],
      [21, 41],
    ],
    "006.02",
  );
  equal(rApply(input, ranges), result, "006.03");
  equal(
    allTagLocations,
    [
      [1, 20],
      [21, 41],
    ],
    "006.04",
  );
  equal(filteredTagLocations, allTagLocations, "006.05");
  equal(input.slice(...allTagLocations[0]), "&#x26;lt;b&#x26;gt;", "006.06");
  equal(input.slice(...allTagLocations[1]), "&#x26;lt;/b&#x26;gt;", "006.07");
});

test("007 - skipHtmlDecoding leaves entity text untouched", () => {
  const input = "&amp;<b>x</b>";
  const { result, ranges, allTagLocations, filteredTagLocations } = stripHtml(
    input,
    { skipHtmlDecoding: true },
  );

  equal(result, "&amp;x", "007.01");
  equal(
    ranges,
    [
      [5, 8],
      [9, 13],
    ],
    "007.02",
  );
  equal(rApply(input, ranges), result, "007.03");
  equal(
    allTagLocations,
    [
      [5, 8],
      [9, 13],
    ],
    "007.04",
  );
  equal(filteredTagLocations, allTagLocations, "007.05");
});

test.run();
