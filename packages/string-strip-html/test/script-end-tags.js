import { test } from "uvu";
import { equal } from "uvu/assert";

import { stripHtml } from "./util/noLog.js";

function tagSlices(input, locations) {
  return locations.map(([from, to]) => input.slice(from, to));
}

test("001 - longer script-name prefix stays raw", () => {
  const input = '<script>const x="</scripture>"; ok</script>';
  const events = [];
  const actual = stripHtml(input, {
    stripTogetherWithTheirContents: [],
    cb: ({ tag, rangesArr, proposedReturn }) => {
      events.push(tag.name);
      if (proposedReturn) {
        rangesArr.push(...proposedReturn);
      }
    },
  });

  equal(
    actual,
    {
      result: 'const x="</scripture>"; ok',
      ranges: [
        [0, 8],
        [34, 43],
      ],
      allTagLocations: [
        [0, 8],
        [34, 43],
      ],
      filteredTagLocations: [
        [0, 8],
        [34, 43],
      ],
    },
    "001.01",
  );
  equal(events, ["script", "script"], "001.02");
});

test("002 - longer and punctuated names do not close script mode", () => {
  const falseNames = [
    "scripture",
    "scripted",
    "script-foo",
    "script_foo",
    "script1",
    "script:foo",
    "script!",
    "script.",
  ];

  for (const falseName of falseNames) {
    const input = `<script>a</${falseName}>b</script>`;
    const events = [];
    const actual = stripHtml(input, {
      stripTogetherWithTheirContents: [],
      cb: ({ tag, rangesArr, proposedReturn }) => {
        events.push(tag.name);
        if (proposedReturn) {
          rangesArr.push(...proposedReturn);
        }
      },
    });

    equal(actual.result, `a</${falseName}>b`, "002.01");
    equal(
      tagSlices(input, actual.allTagLocations),
      ["<script>", "</script>"],
      "002.02",
    );
    equal(actual.filteredTagLocations, actual.allTagLocations, "002.03");
    equal(events, ["script", "script"], "002.04");
  }
});

test("003 - exact script names accept valid boundaries", () => {
  const cases = [
    ["<script>x</script>y", "x y", ["<script>", "</script>"]],
    ["<script>x</ScRiPt >y", "x y", ["<script>", "</ScRiPt >"]],
    ["<script>x</script/>y", "x y", ["<script>", "</script/>"]],
    ["<script>x</script\t>y", "x y", ["<script>", "</script\t>"]],
  ];

  for (const [input, expectedResult, expectedTags] of cases) {
    const actual = stripHtml(input, { stripTogetherWithTheirContents: [] });
    equal(actual.result, expectedResult, "003.01");
    equal(tagSlices(input, actual.allTagLocations), expectedTags, "003.02");
  }
});

test("004 - supported dirty and incomplete boundaries still close", () => {
  const cases = [
    ["<script>x< / SCRIPT >y", "x y", ["<script>", "< / SCRIPT >"]],
    ["<script>x</script<body>y", "x y", ["<script>", "</script", "<body>"]],
    ["<script>x</script", "x", ["<script>", "</script"]],
  ];

  for (const [input, expectedResult, expectedTags] of cases) {
    const actual = stripHtml(input, { stripTogetherWithTheirContents: [] });
    equal(actual.result, expectedResult, "004.01");
    equal(tagSlices(input, actual.allTagLocations), expectedTags, "004.02");
  }
});

test("005 - an exact close inside JavaScript-looking text still closes", () => {
  const input = '<script>const x="</script>"; ok</script>';
  const actual = stripHtml(input, { stripTogetherWithTheirContents: [] });

  equal(actual.result, 'const x=""; ok', "005.01");
  equal(
    tagSlices(input, actual.allTagLocations),
    ["<script>", "</script>", "</script>"],
    "005.02",
  );
});

test("006 - default paired deletion does not report false script tags", () => {
  const input = 'before<script>const x="</scripture>"; ok</script>after';
  const actual = stripHtml(input);

  equal(actual.result, "before after", "006.01");
  equal(
    tagSlices(input, actual.allTagLocations),
    ["<script>", "</script>"],
    "006.02",
  );
  equal(actual.filteredTagLocations, actual.allTagLocations, "006.03");
});

test("007 - script ignore policies retain false prefixes", () => {
  const input = '<script>const x="</scripture>"; ok</script>';
  const ignoreTag = stripHtml(input, {
    stripTogetherWithTheirContents: [],
    ignoreTags: ["script"],
  });
  const ignoreContents = stripHtml(input, {
    stripTogetherWithTheirContents: [],
    ignoreTagsWithTheirContents: ["script"],
  });

  equal(ignoreTag.result, input, "007.01");
  equal(ignoreTag.ranges, null, "007.02");
  equal(ignoreTag.filteredTagLocations, [], "007.03");
  equal(ignoreContents.result, input, "007.04");
  equal(ignoreContents.ranges, null, "007.05");
  equal(ignoreContents.filteredTagLocations, [], "007.06");
  equal(
    tagSlices(input, ignoreContents.allTagLocations),
    ["<script>", "</script>"],
    "007.07",
  );
});

test.run();
