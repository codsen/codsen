import tap from "tap";
import applyR from "ranges-apply";
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
    null,
    "02"
  );
  t.end();
});

// ensure consistency with ranges-apply
// -----------------------------------------------------------------------------

tap.test("03 - consistency with ranges-apply", (t) => {
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

  // t.same(stripHtml(input), "1\n\n2\n\n3", `03`);

  t.same(
    stripHtml(input, {
      returnRangesOnly: true,
    }),
    [
      [0, 136],
      [137, 165, "\n\n"],
      [166, 194, "\n\n"],
      [195, 226],
    ],
    `03`
  );

  // t.same(
  //   applyR(
  //     input,
  //     stripHtml(input, {
  //       returnRangesOnly: true,
  //     })
  //   ),
  //   "1\n\n2\n\n3",
  //   `03`
  // );
  t.end();
});

tap.test("04 - consistency with ranges-apply", (t) => {
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

  // ensure the string result matches applied ranges result
  inputs.forEach((input, idx) => {
    t.same(
      stripHtml(input, { trimOnlySpaces: false }),
      applyR(
        input,
        stripHtml(input, {
          returnRangesOnly: true,
          trimOnlySpaces: false, // <----------- trim all whitespace!
        })
      ),
      `${idx} - ${input}`
    );
  });

  // check opts.trimOnlySpaces
  inputs.forEach((input, idx) => {
    t.same(
      stripHtml(input, { trimOnlySpaces: true }),
      applyR(
        input,
        stripHtml(input, {
          returnRangesOnly: true,
          trimOnlySpaces: true, // <----------- trim only spaces!
        })
      ),
      `${idx} - ${input}`
    );
  });
  t.end();
});
