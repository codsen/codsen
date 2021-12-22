import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";
import { rApply } from "ranges-apply";

import { stripHtml } from "./util/noLog.js";
import validateTagLocations from "./util/validateTagLocations.js";

// concentrating on ranges output
// -----------------------------------------------------------------------------

test("01 - ranges - quick sanity check", () => {
  let intendedAllTagLocations = [
    [10, 43],
    [51, 55],
  ];
  let input = `Some text <a class="btn btn__large" id="z">click me</a> and more text.`;

  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "Some text click me and more text.");
  equal(ranges, [
    [9, 43, " "],
    [51, 56, " "],
  ]);
  equal(allTagLocations, intendedAllTagLocations);
  validateTagLocations(is, input, intendedAllTagLocations);
});

// ensure consistency with ranges-apply
// -----------------------------------------------------------------------------

test("02 - consistency with ranges-apply", () => {
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
  equal(result, intendedResult);
  equal(ranges, [
    [0, 136],
    [137, 165, "\n\n"],
    [166, 194, "\n\n"],
    [195, 226],
  ]);
  equal(allTagLocations, [
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
  ]);

  equal(rApply(input, stripHtml(input).ranges), result, `02.02`);
});

test("03 - consistency with ranges-apply", () => {
  let inputs = [
    ``,
    `   `,
    `<a>`,
    ` <a> `,
    `  <a>  `,
    `<a> <a>`,
    ` <a> <a> `,
    `  <a>  <a>  `,
    `  <a >  <a >  `,
    `  <br/>  <br/>  `,
    `  <br />  <br />  `,
    `\n\n\n\n\n\n<a>\n\n\n`,
    `  <script>  </script>  `,
    `<script>`,
    `</script>`,
    ` <script> `,
    ` </script> `,
    `  <script>  `,
    `  </script>  `,
    `a`,
    ` a`,
    `\na`,
    ` \na`,
    ` \n a`,
    ` \n\na`,
    `..`,
    ` .. `,
    `    a   `,
    `\n`,
    `     \n      `,
    `\t`,
    `      \t      `,
    `\t    a   \t`,
    `\t\t\t`,
    `\t \t \t\n\n\n`,
    `\r\n\r\n`,
    `<a class>z</a>`,
    ` <a class> z </a> `,
    `  <a class>  z  </a>  `,
    ` \r<a class>\n z \t</a> \r`,
    ` \r\n<a class>\n\n z \t\t</a> \r\r`,
    `<a class="link">z</a>`,
    `<a class="link">z<a>`,
    ` <a class="link">z</a> `,
    ` <a class="link">z<a> `,
    `\t <a class="link">z</a> \t`,
    `\t <a class="link">z<a> \t`,
    `<script>z<script>`,
    `<script>z</script>`,
    ` <script>z<script> `,
    ` <script>z</script> `,
    `\t<script>z<script>\t`,
    `\t<script>z</script>\t`,
    ` \t<script>z<script>\t `,
    ` \t<script>z</script>\t `,
    `\t <script>z<script> \t`,
    `\t <script>z</script> \t`,
    ` \t <script>z<script> \t `,
    ` \t <script>z</script> \t `,
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
        }).ranges
      ),
      `${idx} - ${input}`
    );
    equal(
      stripHtml(input, { trimOnlySpaces: true }).result,
      rApply(
        input,
        stripHtml(input, {
          trimOnlySpaces: true, // <----------- trim only spaces!
        }).ranges
      ),
      `${idx} - ${input}`
    );
  });
});

test.run();
