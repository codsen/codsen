import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";
import { rInvert } from "ranges-invert";
import { rApply } from "ranges-apply";

import { stripHtml } from "./util/noLog.js";
import validateTagLocations from "./util/validateTagLocations.js";

// 1. Remove HTML tags, give me a clean string.
// -----------------------------------------------------------------------------

test("01 - Remove HTML tags, give me a clean string.", () => {
  let input = `<!DOCTYPE html>
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
  let allTagLocations = [
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
  validateTagLocations(is, input, allTagLocations);
  equal(
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
    "01.01",
  );
});

// 2. Leave only HTML tags.
// -----------------------------------------------------------------------------

test("02 - Leave only HTML tags.", () => {
  let input = `<div class="module-container">
{% if data.customer.purchases[0].spendTotal < 100 %}
You earned a discount!
{% else %}
The promo is still on!
{% endif %}
</div>
`;
  let { result, ranges, allTagLocations, filteredTagLocations } =
    stripHtml(input);
  equal(
    result,
    "{% if data.customer.purchases[0].spendTotal < 100 %}\nYou earned a discount!\n{% else %}\nThe promo is still on!\n{% endif %}",
    "02.01",
  );
  equal(
    ranges,
    [
      [0, 31],
      [152, 160],
    ],
    "02.02",
  );
  equal(
    allTagLocations,
    [
      [0, 30],
      [153, 159],
    ],
    "02.03",
  );
  equal(
    filteredTagLocations,
    [
      [0, 30],
      [153, 159],
    ],
    "02.04",
  );
  equal(
    rApply(input, rInvert(allTagLocations, input.length)),
    '<div class="module-container"></div>',
    "02.05",
  );
});

// 03. Tell me String indexes of where the <tr> tags are.
// -----------------------------------------------------------------------------

test("03 - Tell me String indexes of where the <tr> tags are.", () => {
  let input = `<table width="100">
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
  let { filteredTagLocations } = stripHtml(input, {
    onlyStripTags: ["tr"],
  });
  equal(
    filteredTagLocations,
    [
      [22, 26],
      [70, 74],
      [143, 148],
      [176, 181],
    ],
    "03.01",
  );
  let gatheredExtractedTagStrings = [];
  filteredTagLocations.forEach(([from, to]) => {
    gatheredExtractedTagStrings.push(input.slice(from, to));
  });

  equal(
    gatheredExtractedTagStrings,
    ["<tr>", "<tr>", "</tr>", "</tr>"],
    "03.02",
  );
});

test.run();
