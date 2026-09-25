import { rApply } from "ranges-apply";
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

test("002 - closing brackets at every position in quoted values remain attribute data", () => {
  for (const quote of ['"', "'"]) {
    for (const value of [">", ">secret", "first > second > third", "tail >"]) {
      for (const skipHtmlDecoding of [false, true]) {
        const opening = `<p title=${quote}${value}${quote}>`;
        const source = `${opening}visible</p>`;
        const plain = stripHtml(source, { skipHtmlDecoding });
        const tokens = [];
        const forwarded = stripHtml(source, {
          skipHtmlDecoding,
          cb: ({ tag, rangesArr, proposedReturn }) => {
            tokens.push(tag);
            if (proposedReturn) {
              rangesArr.push(proposedReturn);
            }
          },
        });

        equal(plain.result, "visible", "002.01");
        equal(forwarded.result, "visible", "002.02");
        equal(
          tokens.map(({ kind, start, end, name, status }) => [
            kind,
            start,
            end,
            name,
            status,
          ]),
          [
            ["tag", 0, opening.length, "p", "complete"],
            ["tag", opening.length + 7, source.length, "p", "complete"],
          ],
          "002.03",
        );
        equal(
          tokens[0].attributes,
          [
            {
              nameStarts: 3,
              nameEnds: 8,
              equalsAt: 8,
              name: "title",
              valueStarts: 10,
              valueEnds: 10 + value.length,
              value,
            },
          ],
          "002.04",
        );
        equal(forwarded.ranges, plain.ranges, "002.05");
        equal(rApply(source, plain.ranges), "visible", "002.06");
        equal(rApply(source, forwarded.ranges), "visible", "002.07");
      }
    }
  }
});

test("003 - tag-like text and slashes in multiple quoted attributes remain data", () => {
  for (const [opening, attributes] of [
    [
      '<p first=">" second=\'<b>/>x\' third="end >">',
      [
        ["first", ">"],
        ["second", "<b>/>x"],
        ["third", "end >"],
      ],
    ],
    [
      "<p first='<b>/>' second=\"> >\" third='tail >'>",
      [
        ["first", "<b>/>"],
        ["second", "> >"],
        ["third", "tail >"],
      ],
    ],
    [
      "<p first=\"</b>/>\" second='one > two'>",
      [
        ["first", "</b>/>"],
        ["second", "one > two"],
      ],
    ],
  ]) {
    for (const skipHtmlDecoding of [false, true]) {
      const source = `${opening}visible</p>`;
      const plain = stripHtml(source, { skipHtmlDecoding });
      const tokens = [];
      const forwarded = stripHtml(source, {
        skipHtmlDecoding,
        cb: ({ tag, rangesArr, proposedReturn }) => {
          tokens.push(tag);
          if (proposedReturn) {
            rangesArr.push(proposedReturn);
          }
        },
      });

      equal(plain.result, "visible", "003.01");
      equal(forwarded.result, "visible", "003.02");
      equal(
        tokens.map(({ kind, start, end, name, status }) => [
          kind,
          start,
          end,
          name,
          status,
        ]),
        [
          ["tag", 0, opening.length, "p", "complete"],
          ["tag", opening.length + 7, source.length, "p", "complete"],
        ],
        "003.03",
      );
      equal(
        tokens[0].attributes,
        attributes.map(([name, value]) => {
          const nameStarts = opening.indexOf(`${name}=`);
          const nameEnds = nameStarts + name.length;
          return {
            nameStarts,
            nameEnds,
            equalsAt: nameEnds,
            name,
            valueStarts: nameEnds + 2,
            valueEnds: nameEnds + 2 + value.length,
            value,
          };
        }),
        "003.04",
      );
      equal(forwarded.ranges, plain.ranges, "003.05");
      equal(rApply(source, plain.ranges), "visible", "003.06");
      equal(rApply(source, forwarded.ranges), "visible", "003.07");
    }
  }
});

test("004 - quoted brackets preserve Unicode and raw entity source offsets", () => {
  for (const quote of ['"', "'"]) {
    for (const [rawValue, decodedValue] of [
      ["α😊\ud800 > \udc00 β", "α😊\ud800 > \udc00 β"],
      ["\ud7fb\ue000＞ > “quoted”", "\ud7fb\ue000＞ > “quoted”"],
      ["&gt;", ">"],
      ["&gt;&gt; tail >", ">> tail >"],
      ["α &#x1F60A; &gt; &amp; β >", "α 😊 > & β >"],
    ]) {
      for (const skipHtmlDecoding of [false, true]) {
        const opening = `<p title=${quote}${rawValue}${quote}>`;
        const source = `${opening}visible</p>`;
        const plain = stripHtml(source, { skipHtmlDecoding });
        const tokens = [];
        const forwarded = stripHtml(source, {
          skipHtmlDecoding,
          cb: ({ tag, rangesArr, proposedReturn }) => {
            tokens.push(tag);
            if (proposedReturn) {
              rangesArr.push(proposedReturn);
            }
          },
        });

        equal(plain.result, "visible", "004.01");
        equal(forwarded.result, "visible", "004.02");
        equal(
          tokens.map(({ kind, start, end }) => [kind, start, end]),
          [
            ["tag", 0, opening.length],
            ["tag", opening.length + 7, source.length],
          ],
          "004.03",
        );
        equal(
          tokens[0].attributes,
          [
            {
              nameStarts: 3,
              nameEnds: 8,
              equalsAt: 8,
              name: "title",
              valueStarts: 10,
              valueEnds: 10 + rawValue.length,
              value: skipHtmlDecoding ? rawValue : decodedValue,
            },
          ],
          "004.04",
        );
        equal(
          source.slice(
            tokens[0].attributes[0].valueStarts,
            tokens[0].attributes[0].valueEnds,
          ),
          rawValue,
          "004.05",
        );
        equal(forwarded.ranges, plain.ranges, "004.06");
        equal(rApply(source, plain.ranges), "visible", "004.07");
        equal(rApply(source, forwarded.ranges), "visible", "004.08");
      }
    }
  }
});

test("005 - decoding before quoted tags keeps callbacks and ranges on original input", () => {
  const prefix = "😊&#65;";
  const opening = "<a first=\"&gt;>\" second='x &amp; > y'>";
  const content = "visible &amp; tail";
  const source = `${prefix}${opening}${content}</a>`;

  for (const skipHtmlDecoding of [false, true]) {
    const expected = skipHtmlDecoding
      ? `${prefix}${content}`
      : "😊Avisible & tail";
    const plain = stripHtml(source, { skipHtmlDecoding });
    const tokens = [];
    const forwarded = stripHtml(source, {
      skipHtmlDecoding,
      cb: ({ tag, rangesArr, proposedReturn }) => {
        tokens.push(tag);
        if (proposedReturn) {
          rangesArr.push(proposedReturn);
        }
      },
    });

    equal(plain.result, expected, "005.01");
    equal(forwarded.result, expected, "005.02");
    equal(
      tokens.map(({ kind, start, end, name, status }) => [
        kind,
        start,
        end,
        name,
        status,
      ]),
      [
        ["tag", prefix.length, prefix.length + opening.length, "a", "complete"],
        ["tag", source.length - 4, source.length, "a", "complete"],
      ],
      "005.03",
    );
    equal(
      tokens[0].attributes.map(({ name, valueStarts, valueEnds, value }) => [
        name,
        valueStarts,
        valueEnds,
        value,
        source.slice(valueStarts, valueEnds),
      ]),
      [
        ["first", 17, 22, skipHtmlDecoding ? "&gt;>" : ">>", "&gt;>"],
        [
          "second",
          32,
          43,
          skipHtmlDecoding ? "x &amp; > y" : "x & > y",
          "x &amp; > y",
        ],
      ],
      "005.04",
    );
    equal(forwarded.ranges, plain.ranges, "005.05");
    equal(rApply(source, plain.ranges), expected, "005.06");
    equal(rApply(source, forwarded.ranges), expected, "005.07");
  }
});

test("006 - quoted tag text respects attribute boundaries and malformed recovery", () => {
  for (const skipHtmlDecoding of [false, true]) {
    const malformed = 'aaa<br class="zzzz <br>\n<div class="x">bbb</div>';
    const plainMalformed = stripHtml(malformed, { skipHtmlDecoding });
    const forwardedMalformed = stripHtml(malformed, {
      skipHtmlDecoding,
      cb: ({ rangesArr, proposedReturn }) => {
        if (proposedReturn) {
          rangesArr.push(proposedReturn);
        }
      },
    });

    equal(plainMalformed.result, "aaa\nbbb", "006.01");
    equal(forwardedMalformed.result, "aaa\nbbb", "006.02");
    equal(rApply(malformed, forwardedMalformed.ranges), "aaa\nbbb", "006.03");

    for (const quote of ['"', "'"]) {
      for (const ending of [">", " >", ' data-next="kept">', "/>", "\n>"]) {
        const value = "prefix <b> hidden";
        const opening = `<p title=${quote}${value}${quote}${ending}`;
        const source = `${opening}visible</p>`;
        const plain = stripHtml(source, { skipHtmlDecoding });
        const tokens = [];
        const forwarded = stripHtml(source, {
          skipHtmlDecoding,
          cb: ({ tag, rangesArr, proposedReturn }) => {
            tokens.push(tag);
            if (proposedReturn) {
              rangesArr.push(proposedReturn);
            }
          },
        });

        equal(plain.result, "visible", "006.04");
        equal(forwarded.result, "visible", "006.05");
        equal(
          tokens.map(({ kind, start, end, name, status }) => [
            kind,
            start,
            end,
            name,
            status,
          ]),
          [
            ["tag", 0, opening.length, "p", "complete"],
            ["tag", opening.length + 7, source.length, "p", "complete"],
          ],
          "006.06",
        );
        equal(
          tokens[0].attributes.map(({ name, value }) => [name, value]),
          ending.includes("data-next")
            ? [
                ["title", value],
                ["data-next", "kept"],
              ]
            : [["title", value]],
          "006.07",
        );
        equal(forwarded.ranges, plain.ranges, "006.08");
        equal(rApply(source, plain.ranges), "visible", "006.09");
        equal(rApply(source, forwarded.ranges), "visible", "006.10");
      }

      const source = `<p title=${quote}prefix <b> hidden${quote}`;
      const plain = stripHtml(source, { skipHtmlDecoding });
      const tokens = [];
      const forwarded = stripHtml(source, {
        skipHtmlDecoding,
        cb: ({ tag, rangesArr, proposedReturn }) => {
          tokens.push(tag);
          if (proposedReturn) {
            rangesArr.push(proposedReturn);
          }
        },
      });

      equal(plain.result, "", "006.11");
      equal(forwarded.result, "", "006.12");
      equal(
        tokens.map(({ kind, start, end, name, status }) => [
          kind,
          start,
          end,
          name,
          status,
        ]),
        [["tag", 0, source.length, "p", "incomplete"]],
        "006.13",
      );
      equal(
        tokens[0].attributes,
        [
          {
            nameStarts: 3,
            nameEnds: 8,
            equalsAt: 8,
            name: "title",
            valueStarts: 10,
            valueEnds: 27,
            value: "prefix <b> hidden",
          },
        ],
        "006.14",
      );
      equal(forwarded.ranges, plain.ranges, "006.15");
      equal(rApply(source, plain.ranges), "", "006.16");
      equal(rApply(source, forwarded.ranges), "", "006.17");
    }
  }
});

test("007 - quotes in bracketed prose do not consume matching quotes in later text", () => {
  for (const [source, expected] of [
    ["<Bach's Suite> played it's fine", "played it's fine"],
    ["<a's> body", "body"],
    ["<no apostrophe> body it's here", "body it's here"],
    ['<a"s> body it"s here', 'body it"s here'],
  ]) {
    equal(stripHtml(source).result, expected, "007.01");
  }
});

test("008 - stray quotes without attribute assignments leave tag boundaries intact", () => {
  for (const quote of ['"', "'"]) {
    for (const opening of [
      `<Bach${quote}s Suite>`,
      `<a${quote}s>`,
      `<div data-${quote}s>`,
      `<div ${quote}stray>`,
    ]) {
      for (const suffix of [
        `body it${quote}s here`,
        `body ${quote} here`,
        `body ${quote}`,
        `body <b title=${quote}value${quote}>here</b>`,
      ]) {
        const source = `${opening} ${suffix}`;
        const expected = suffix.includes("<b") ? "body here" : suffix;
        for (const skipHtmlDecoding of [false, true]) {
          const plain = stripHtml(source, { skipHtmlDecoding });
          const tokens = [];
          const forwarded = stripHtml(source, {
            skipHtmlDecoding,
            cb: ({ tag, rangesArr, proposedReturn }) => {
              tokens.push(tag);
              if (proposedReturn) {
                rangesArr.push(proposedReturn);
              }
            },
          });

          equal(plain.result, expected, "008.01");
          equal(forwarded.result, expected, "008.02");
          equal(
            [tokens[0].start, tokens[0].end, tokens[0].status],
            [0, opening.length, "complete"],
            "008.03",
          );
          equal(plain.allTagLocations[0], [0, opening.length], "008.04");
          equal(plain.filteredTagLocations[0], [0, opening.length], "008.05");
          equal(forwarded.ranges, plain.ranges, "008.06");
          equal(rApply(source, plain.ranges), expected, "008.07");
        }
      }
    }
  }
});

test("009 - stray name quotes allow recovery at the next opening tag", () => {
  for (const quote of ['"', "'"]) {
    const source = `<a${quote}s <b>body ${quote} here`;
    const expected = `body ${quote} here`;
    const plain = stripHtml(source);
    const tokens = [];
    const forwarded = stripHtml(source, {
      cb: ({ tag, rangesArr, proposedReturn }) => {
        tokens.push(tag);
        if (proposedReturn) {
          rangesArr.push(proposedReturn);
        }
      },
    });

    equal(plain.result, expected, "009.01");
    equal(forwarded.result, expected, "009.02");
    equal(
      tokens.map(({ start, end, name, status }) => [start, end, name, status]),
      [
        [0, 5, "a", "incomplete"],
        [5, 8, "b", "complete"],
      ],
      "009.03",
    );
    equal(plain.ranges, [[0, 8]], "009.04");
    equal(forwarded.ranges, plain.ranges, "009.05");
    equal(rApply(source, plain.ranges), expected, "009.06");
  }
});

test.run();
