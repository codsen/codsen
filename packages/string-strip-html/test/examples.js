import tap from "tap";
import { rInvert } from "ranges-invert";
import { rApply } from "ranges-apply";
import { stripHtml } from "../dist/string-strip-html.esm";
import validateTagLocations from "./util/validateTagLocations";

// 1. Remove HTML tags, give me a clean string.
// -----------------------------------------------------------------------------

tap.test("01 - Remove HTML tags, give me a clean string.", (t) => {
  const input = `<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    <div class="container">
      <div class="module">
        text1
      </div>
    </div>
    <div class="container">
      <div class="module">
        text2
      </div>
    </div>
  </body>
</html>`;
  const allTagLocations = [
    [0, 15],
    [16, 42],
    [45, 51],
    [56, 78],
    [83, 90],
    [90, 98],
    [101, 108],
    [111, 117],
    [122, 145],
    [152, 172],
    [193, 199],
    [204, 210],
    [215, 238],
    [245, 265],
    [286, 292],
    [297, 303],
    [306, 313],
    [314, 321],
  ];
  validateTagLocations(t, input, allTagLocations);
  t.match(
    stripHtml(input),
    {
      result: "text1\n\ntext2",
      ranges: [
        [0, 181],
        [186, 274, "\n\n"],
        [279, 321],
      ],
      allTagLocations,
      filteredTagLocations: allTagLocations,
    },
    "01"
  );
  t.end();
});

// 2. Leave only HTML tags.
// -----------------------------------------------------------------------------

tap.test("02 - Leave only HTML tags.", (t) => {
  const input = `<div class="module-container">
{% if data.customer.purchases[0].spendTotal < 100 %}
You earned a discount!
{% else %}
The promo is still on!
{% endif %}
</div>
`;
  const { result, ranges, allTagLocations, filteredTagLocations } = stripHtml(
    input
  );
  t.equal(
    result,
    `{% if data.customer.purchases[0].spendTotal < 100 %}\nYou earned a discount!\n{% else %}\nThe promo is still on!\n{% endif %}`,
    "02.01"
  );
  t.strictSame(
    ranges,
    [
      [0, 31],
      [152, 160],
    ],
    "02.02"
  );
  t.strictSame(
    allTagLocations,
    [
      [0, 30],
      [153, 159],
    ],
    "02.03"
  );
  t.strictSame(
    filteredTagLocations,
    [
      [0, 30],
      [153, 159],
    ],
    "02.04"
  );
  t.equal(
    rApply(input, rInvert(allTagLocations, input.length)),
    `<div class="module-container"></div>`,
    "02.05"
  );
  t.end();
});

// 03. Tell me String indexes of where the <tr> tags are.
// -----------------------------------------------------------------------------

tap.test("03 - Tell me String indexes of where the <tr> tags are.", (t) => {
  const input = `<table width="100">
  <tr>
    <td>
      <table width="100">
        <tr>
          <td>
            This is content.
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`;
  const { filteredTagLocations } = stripHtml(input, {
    onlyStripTags: ["tr"],
  });
  t.strictSame(
    filteredTagLocations,
    [
      [22, 26],
      [70, 74],
      [143, 148],
      [176, 181],
    ],
    "03.01"
  );
  const gatheredExtractedTagStrings = [];
  filteredTagLocations.forEach(([from, to]) => {
    gatheredExtractedTagStrings.push(input.slice(from, to));
  });

  t.strictSame(
    gatheredExtractedTagStrings,
    [`<tr>`, `<tr>`, `</tr>`, `</tr>`],
    "03.02"
  );
  t.end();
});
