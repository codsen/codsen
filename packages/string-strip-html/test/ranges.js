import tap from "tap";
import applyR from "ranges-apply";
import stripHtml from "../dist/string-strip-html.esm";
import validateTagLocations from "./util/validateTagLocations";

// concentrating on ranges output
// -----------------------------------------------------------------------------

tap.test("01 - ranges - quick sanity check", (t) => {
  const allTagLocations = [
    [10, 43],
    [51, 55],
  ];
  const input = `Some text <a class="btn btn__large" id="z">click me</a> and more text.`;
  t.match(
    stripHtml(input),
    {
      result: "Some text click me and more text.",
      ranges: [
        [9, 43, " "],
        [51, 56, " "],
      ],
      allTagLocations,
    },
    "01"
  );
  validateTagLocations(t, input, allTagLocations);
  t.end();
});

// ensure consistency with ranges-apply
// -----------------------------------------------------------------------------

tap.test("02 - consistency with ranges-apply", (t) => {
  const input = `<!DOCTYPE html>
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

  const result = "1\n\n2\n\n3";
  t.match(
    stripHtml(input),
    {
      result,
      ranges: [
        [0, 136],
        [137, 165, "\n\n"],
        [166, 194, "\n\n"],
        [195, 226],
      ],
      allTagLocations: [[0, 15]],
    },
    `02.01`
  );

  t.same(applyR(input, stripHtml(input).ranges), result, `02.02`);
  t.end();
});

tap.test("03 - consistency with ranges-apply", (t) => {
  const inputs = [
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
    t.same(
      stripHtml(input, { trimOnlySpaces: false }).result,
      applyR(
        input,
        stripHtml(input, {
          trimOnlySpaces: false, // <----------- trim all whitespace!
        }).ranges
      ),
      `${idx} - ${input}`
    );
    t.same(
      stripHtml(input, { trimOnlySpaces: true }).result,
      applyR(
        input,
        stripHtml(input, {
          trimOnlySpaces: true, // <----------- trim only spaces!
        }).ranges
      ),
      `${idx} - ${input}`
    );
  });
  t.end();
});
