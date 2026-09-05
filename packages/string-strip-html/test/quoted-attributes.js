import { test } from "uvu";
import { equal } from "uvu/assert";
import { stripHtml } from "../dist/string-strip-html.esm.js";

test("001 - repeated quoted attributes preserve callback keys and source offsets", () => {
  const source =
    '&#65;<a empty="" one="&copy;" empty2=\'\' two=\'x &amp; y\' one="again">text</a>';
  const tokenKeys = [
    "kind",
    "start",
    "end",
    "attributes",
    "slashPresent",
    "leftOuterWhitespace",
    "onlyPlausible",
    "nameStarts",
    "nameContainsLetters",
    "nameEnds",
    "name",
    "status",
    "lastOpeningBracketAt",
    "lastClosingBracketAt",
  ];
  const attributeKeys = [
    "nameStarts",
    "nameEnds",
    "equalsAt",
    "name",
    "valueStarts",
    "valueEnds",
    "value",
  ];

  for (const skipHtmlDecoding of [false, true]) {
    const tokens = [];
    const { log, ...actual } = stripHtml(source, {
      skipHtmlDecoding,
      cb: ({ tag, rangesArr, proposedReturn }) => {
        tokens.push(tag);
        if (proposedReturn) {
          rangesArr.push(proposedReturn);
        }
      },
    });

    equal(
      tokens.map((token) => Reflect.ownKeys(token)),
      [tokenKeys, tokenKeys],
      "001.01",
    );
    equal(
      tokens[0].attributes.map((attribute) => Reflect.ownKeys(attribute)),
      [attributeKeys, attributeKeys, attributeKeys],
      "001.02",
    );
    equal(
      tokens[0].attributes,
      [
        {
          nameStarts: 17,
          nameEnds: 20,
          equalsAt: 20,
          name: "one",
          valueStarts: 22,
          valueEnds: 28,
          value: skipHtmlDecoding ? "&copy;" : "©",
        },
        {
          nameStarts: 40,
          nameEnds: 43,
          equalsAt: 43,
          name: "two",
          valueStarts: 45,
          valueEnds: 54,
          value: skipHtmlDecoding ? "x &amp; y" : "x & y",
        },
        {
          nameStarts: 56,
          nameEnds: 59,
          equalsAt: 59,
          name: "one",
          valueStarts: 61,
          valueEnds: 66,
          value: "again",
        },
      ],
      "001.03",
    );
    equal(tokens[1].attributes, [], "001.04");
    equal(
      actual,
      {
        result: skipHtmlDecoding ? "&#65;text" : "Atext",
        ranges: [skipHtmlDecoding ? [5, 68] : [0, 68, "A"], [72, 76]],
        allTagLocations: [
          [5, 68],
          [72, 76],
        ],
        filteredTagLocations: [
          [5, 68],
          [72, 76],
        ],
      },
      "001.05",
    );
    equal(typeof log.timeTakenInMilliseconds, "number", "001.06");
  }
});

test.run();
