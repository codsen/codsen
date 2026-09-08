import { test } from "uvu";
import { equal } from "uvu/assert";

import { m } from "./util/util.js";

test("01 - preserves a descendant separator after an unterminated hex escape", () => {
  const source = String.raw`<style>.a\31/*remove*/ a{color:red}</style>`;
  const unchanged = m(equal, source, { removeCSSComments: false });
  const actual = m(equal, source);

  equal(unchanged.result, source, "01.01");
  equal(
    [
      String.raw`<style>.a\31  a{color:red}</style>`,
      String.raw`<style>.a\31/**/ a{color:red}</style>`,
    ].includes(actual.result),
    true,
    "01.02",
  );
  equal(unchanged.applicableOpts.removeCSSComments, true, "01.03");
  equal(actual.applicableOpts.removeCSSComments, true, "01.04");
});

test("02 - preserves comment boundaries after one through six hex digits", () => {
  const digits = ["3", "31", "031", "0031", "00031", "000031"];
  const results = digits.map((hex) => {
    const source = `<style>.a\\${hex}/*remove*/ a{color:red}</style>`;
    return [
      `<style>.a\\${hex}  a{color:red}</style>`,
      `<style>.a\\${hex}/**/ a{color:red}</style>`,
    ].includes(m(equal, source).result);
  });

  equal(
    results,
    digits.map(() => true),
    "02.01",
  );
});

test("03 - retains CSS whitespace after comments beside hex escapes", () => {
  const separators = [" ", "\t", "\n", "\f", "\r", "\r\n"];
  const results = separators.map((separator) => {
    const source = `<style>.a\\31/*remove*/${separator}a{color:red}</style>`;
    return [
      `<style>.a\\31 ${separator}a{color:red}</style>`,
      `<style>.a\\31/**/${separator}a{color:red}</style>`,
    ].includes(m(equal, source).result);
  });

  equal(
    results,
    separators.map(() => true),
    "03.01",
  );
});

test("04 - keeps an existing hex terminator separate from descendant whitespace", () => {
  const sources = [
    String.raw`<style>.a\31 /*remove*/ a{color:red}</style>`,
    String.raw`<style>.a\000031 /*remove*/ a{color:red}</style>`,
    String.raw`<style>.a\31  /*remove*/a{color:red}</style>`,
  ];
  const results = sources.map((source) =>
    [
      source.replace("/*remove*/", ""),
      source.replace("/*remove*/", "/**/"),
    ].includes(m(equal, source).result),
  );

  equal(
    results,
    sources.map(() => true),
    "04.01",
  );
});

test("05 - does not merge identifiers when a comment has no surrounding space", () => {
  const source = "<style>a/*remove*/b{color:red}</style>";
  const actual = m(equal, source);

  equal(actual.result, "<style>a/**/b{color:red}</style>", "05.01");
  equal(m(equal, source, { removeCSSComments: false }).result, source, "05.02");
});

test("06 - preserves function, numeric, hash, and at-keyword token boundaries", () => {
  const sources = [
    "<style>a{width:calc/*remove*/(1px + 2px)}</style>",
    "<style>a{background:url/*remove*/(picture.png)}</style>",
    "<style>a{width:1/*remove*/px}</style>",
    "<style>a{width:1/*remove*/e2}</style>",
    "<style>#a/*remove*/b{color:red}</style>",
    "<style>a{color:#/*remove*/123}</style>",
    "<style>@/*remove*/media{a{color:red}}</style>",
  ];
  const results = sources.map(
    (source) =>
      m(equal, source).result === source.replace("/*remove*/", "/**/"),
  );

  equal(
    results,
    sources.map(() => true),
    "06.01",
  );
});

test("07 - keeps minimal empty comments when removing them would merge tokens", () => {
  const sources = [
    "<style>a/**/b{color:red}</style>",
    "<style>a{width:1/**/px}</style>",
    "<style>a{width:calc/**/(1px + 2px)}</style>",
    "<style>#a/**/b{color:red}</style>",
  ];
  const results = sources.map((source) => m(equal, source).result === source);

  equal(
    results,
    sources.map(() => true),
    "07.01",
  );
});

test("08 - removes comments when existing spaces preserve token separation", () => {
  const sources = [
    "<style>a/*remove*/ b{color:red}</style>",
    "<style>a /*remove*/b{color:red}</style>",
    "<style>a /*remove*/ b{color:red}</style>",
  ];
  const results = sources.map((source) =>
    [
      "<style>a b{color:red}</style>",
      "<style>a  b{color:red}</style>",
    ].includes(m(equal, source).result),
  );

  equal(
    results,
    sources.map(() => true),
    "08.01",
  );
});

test("09 - removes comments at ordinary punctuation boundaries", () => {
  const sources = [
    "<style>a{color:/*remove*/red}</style>",
    "<style>a{color:red;/*remove*/margin:0}</style>",
    "<style>/*remove*/a{color:red}/*remove*/</style>",
    "<style>a{color:red}/**/b{color:blue}</style>",
  ];
  const results = sources.map(
    (source) =>
      m(equal, source).result ===
      source.replaceAll("/*remove*/", "").replace("/**/", ""),
  );

  equal(
    results,
    sources.map(() => true),
    "09.01",
  );
});

test("10 - adjacent comments cannot jointly disappear between identifiers", () => {
  const source = "<style>a/*first*//*second*/b{color:red}</style>";
  const actual = m(equal, source);

  equal(
    [
      "<style>a/**/b{color:red}</style>",
      "<style>a/**//**/b{color:red}</style>",
    ].includes(actual.result),
    true,
    "10.01",
  );
  equal(m(equal, source, { removeCSSComments: false }).result, source, "10.02");
});

test("11 - preserves boundaries while deleting encoded inline comments", () => {
  const comments = [
    "&#47;*remove*&#47;",
    "&#47;&#42;remove&#42;&#47;",
    "&sol;*remove*&sol;",
  ];
  const results = comments.map((comment) => {
    const source = `<div style="width:1${comment}px">x</div>`;
    const actual = m(equal, source);
    return [
      actual.result === '<div style="width:1/**/px">x</div>',
      actual.applicableOpts.removeCSSComments,
      m(equal, source, { removeCSSComments: false }).result === source,
    ];
  });

  equal(
    results,
    comments.map(() => [true, true, true]),
    "11.01",
  );
});

test("12 - keeps encoded inline escape terminators and separators distinct", () => {
  const sources = [
    '<div style="font-family:&#92;31&#47;*remove*&#47; a">x</div>',
    '<div style="font-family:&#92;31/*remove*/&#32;a">x</div>',
  ];
  const accepted = [
    [
      '<div style="font-family:&#92;31  a">x</div>',
      '<div style="font-family:&#92;31/**/ a">x</div>',
    ],
    [
      '<div style="font-family:&#92;31 &#32;a">x</div>',
      '<div style="font-family:&#92;31/**/&#32;a">x</div>',
    ],
  ];
  const results = sources.map((source, index) =>
    accepted[index].includes(m(equal, source).result),
  );

  equal(results, [true, true], "12.01");
});

test("13 - aggressive wrapping does not insert whitespace at preserved boundaries", () => {
  const boundaries = ["a/**/b", "1/**/px", "calc/**/(", "#a/**/b"];
  const sources = [
    "<style>a/*remove*/b{color:red}</style>",
    "<style>a{width:1/*remove*/px}</style>",
    "<style>a{width:calc/*remove*/(1px + 2px)}</style>",
    "<style>#a/*remove*/b{color:red}</style>",
  ];
  const results = [];
  for (const removeIndentations of [false, true]) {
    for (const removeLineBreaks of [false, true]) {
      for (let index = 0; index < sources.length; index++) {
        const actual = m(equal, sources[index], {
          removeIndentations,
          removeLineBreaks,
          lineLengthLimit: 10,
        });
        results.push(actual.result.includes(boundaries[index]));
      }
    }
  }

  equal(results, Array(16).fill(true), "13.01");
});

test("14 - line wrapping keeps a descendant after a removed hex-adjacent comment", () => {
  const source = String.raw`<style>.a\31/*remove*/ a{color:red}</style>`;
  const results = [];
  for (const removeLineBreaks of [false, true]) {
    const actual = m(equal, source, {
      removeLineBreaks,
      lineLengthLimit: 10,
    });
    const normalized = actual.result.replace(/\r\n/g, "\n");
    results.push(
      /\.a\\31(?:[\t\n\f\r ]{2,}|\/\*\*\/[\t\n\f\r ]+)a/.test(normalized),
    );
  }

  equal(results, [true, true], "14.01");
});

test("15 - does not introduce descendant whitespace between compound selectors", () => {
  const source = "<style>.a/*remove*/.b{color:red}</style>";
  const actual = m(equal, source);

  equal(
    [
      "<style>.a.b{color:red}</style>",
      "<style>.a/**/.b{color:red}</style>",
    ].includes(actual.result),
    true,
    "15.01",
  );
});

test("16 - keeps descendant and compound pseudo-selectors distinct", () => {
  const fixtures = [
    {
      selector: "div/*x*/ :first-child",
      retained: /div\/\*x\*\/[\t\n\f\r ]+:first-child/,
      removed: /div(?:\/\*\*\/)?[\t\n\f\r ]+:first-child/,
    },
    {
      selector: "div/*x*/:first-child",
      retained: /div\/\*x\*\/:first-child/,
      removed: /div(?:\/\*\*\/)?:first-child/,
    },
  ];
  const results = [];
  for (const fixture of fixtures) {
    for (const removeCSSComments of [false, true]) {
      for (const removeLineBreaks of [false, true]) {
        for (const lineLengthLimit of [0, 10]) {
          const actual = m(
            equal,
            `<style>${fixture.selector}{color:red}</style>`,
            {
              removeCSSComments,
              removeLineBreaks,
              lineLengthLimit,
              breakToTheLeftOf: [],
            },
          );
          results.push(
            (removeCSSComments ? fixture.removed : fixture.retained).test(
              actual.result,
            ),
          );
        }
      }
    }
  }

  equal(results, Array(16).fill(true), "16.01");
});

test("17 - applicability excludes already minimal required separators", () => {
  const sources = [
    ["<style>a/**/b{color:red}</style>", false],
    ["<style>a/*note*/b{color:red}</style>", true],
    ['<b style="width:1&#47;**&#47;px">x</b>', true],
    ["<style>/**/a{color:red}</style>", true],
  ];
  const results = [];
  for (const [source, expected] of sources) {
    for (const removeCSSComments of [false, true]) {
      results.push(
        m(equal, source, { removeCSSComments }).applicableOpts
          .removeCSSComments === expected,
      );
    }
  }
  equal(results, Array(8).fill(true), "17.01");
});

test.run();
