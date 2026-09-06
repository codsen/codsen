import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { test } from "uvu";
import { equal, ok } from "uvu/assert";

import { removeWidows } from "../dist/string-remove-widows.esm.js";

test("01 - protects the reported class attribute and removes the text widow", () => {
  const source =
    '<p>\n  <a href="https://example.com" class="underline font-bold">\n      Foo Bar\n  </a>\n</p>';
  const result = removeWidows(source, { minWordCount: 2 });
  const space = source.indexOf("Foo Bar") + 3;
  equal(result.res, source.replace("Foo Bar", "Foo&nbsp;Bar"), "01.01");
  equal(result.ranges, [[space, space + 1, "&nbsp;"]], "01.02");
  equal(
    result.whatWasDone,
    { removeWidows: true, convertEntities: false },
    "01.03",
  );
  equal(
    result.applicableOpts,
    { removeWidows: true, convertEntities: true },
    "01.04",
  );
});

test("02 - attributes do not satisfy the default word threshold", () => {
  const source =
    '<p>\n  <a href="https://example.com" class="underline font-bold">\n      Foo Bar\n  </a>\n</p>';
  const result = removeWidows(source);
  equal(result.res, source, "02.01");
  equal(result.ranges, null, "02.02");
  equal(
    result.applicableOpts,
    { removeWidows: false, convertEntities: false },
    "02.03",
  );
});

test("03 - preserves quoted and unquoted attribute values", () => {
  for (const opening of [
    '<a title="one > two < three" class="underline font-bold">',
    "<a title='one > two < three' class='underline font-bold'>",
    '<a title = \t"one > two" class =\n "underline font-bold">',
    "<a title=it's class=underline data-value=font-bold>",
    '<a title=one"two class="underline font-bold">',
    '<a\n title="one\ntwo"\n class="underline font-bold"\n>',
    '<a title="one \'two\' three" class="underline font-bold">',
  ]) {
    const source = `${opening}Foo Bar</a>`;
    equal(
      removeWidows(source, { minWordCount: 2 }).res,
      `${opening}Foo&nbsp;Bar</a>`,
      `03.01 - ${JSON.stringify(opening)}`,
    );
  }
});

test("04 - supports custom elements, namespaces, uppercase and self-closing tags", () => {
  for (const [opening, closing] of [
    ['<UI-Widget data-label="one two">', "</UI-Widget>"],
    ['<svg:text data-label="one two">', "</svg:text>"],
    ['<svg viewBox="0 0 10 10"><text x="1" y="2">', "</text></svg>"],
    ['<H2 CLASS="one two">', "</H2>"],
    ['<img alt="one two" />', ""],
    ['<custom_widget data-label="one two">', "</custom_widget>"],
    ['<my-widget.card class="one two">', "</my-widget.card>"],
    ['<my-élément class="one two">', "</my-élément>"],
    ['<emotion-😍 class="one two">', "</emotion-😍>"],
  ]) {
    equal(
      removeWidows(`${opening}one two three four${closing}`).res,
      `${opening}one two three&nbsp;four${closing}`,
      `04.01 - ${opening}`,
    );
  }
});

test("05 - unfinished tags and attribute quotes remain opaque", () => {
  for (const unfinished of [
    "<a",
    '<a class="one two three four"',
    '<a class="one > two three four',
    "<a class='one > two three four",
    '<a\n class="one two three four"\n',
  ]) {
    equal(
      removeWidows(unfinished, { minWordCount: 2 }).res,
      unfinished,
      `05.01 - ${JSON.stringify(unfinished)}`,
    );
    equal(
      removeWidows(`one two three four ${unfinished}`).res,
      `one two three&nbsp;four ${unfinished}`,
      `05.02 - ${JSON.stringify(unfinished)}`,
    );
  }
});

test("06 - recovers at an unquoted nested opening angle bracket", () => {
  const prefix = '<a class=broken <b class="one two">';
  equal(
    removeWidows(`${prefix}Foo Bar</b>`, { minWordCount: 2 }).res,
    `${prefix}Foo&nbsp;Bar</b>`,
    "06.01",
  );
  const repeatedPrefix = "<a class=broken ".repeat(1_000);
  equal(
    removeWidows(`${repeatedPrefix}<b>Foo Bar</b>`, { minWordCount: 2 }).res,
    `${repeatedPrefix}<b>Foo&nbsp;Bar</b>`,
    "06.02",
  );
});

test("07 - comparison signs and invalid tag names remain text", () => {
  for (const prefix of [
    "one < two",
    "one > two",
    "one <3 two",
    "one <_token> two",
    "one <value=number> two",
    "one </ two",
  ]) {
    equal(
      removeWidows(`${prefix} three four`).res,
      `${prefix} three&nbsp;four`,
      `07.01 - ${prefix}`,
    );
  }
});

test("08 - preserves template markers inside and outside attributes", () => {
  const source = '<a class="{{ one two }}">Foo <%= "one two" %> Bar</a>';
  equal(
    removeWidows(source, { minWordCount: 2, ignore: "all" }).res,
    '<a class="{{ one two }}">Foo <%= "one two" %>&nbsp;Bar</a>',
    "08.01",
  );
});

test("09 - output encoding does not change attribute entities or spaces", () => {
  const opening =
    '<a title="one&nbsp;two &#160; \\u00A0 \\0000A0 \u00a0 three - four SW1A 1AA">';
  for (const [targetLanguage, replacement] of [
    ["html", "&nbsp;"],
    ["css", "\\0000A0"],
    ["js", "\\u00A0"],
  ]) {
    equal(
      removeWidows(`${opening}Foo Bar</a>`, {
        minWordCount: 2,
        UKPostcodes: true,
        targetLanguage,
      }).res,
      `${opening}Foo${replacement}Bar</a>`,
      `09.01 - ${targetLanguage}`,
    );
    equal(
      removeWidows(`${opening}Foo Bar</a>`, {
        minWordCount: 2,
        UKPostcodes: true,
        convertEntities: false,
        targetLanguage,
      }).res,
      `${opening}Foo\u00a0Bar</a>`,
      `09.02 - ${targetLanguage}`,
    );
  }
});

test("10 - removing existing measures leaves attributes untouched", () => {
  for (const measure of ["&nbsp;", "&#160;", "\\u00A0", "\\0000A0", "\u00a0"]) {
    const opening = `<a title="Foo${measure}Bar">`;
    equal(
      removeWidows(`${opening}Foo${measure}Bar</a>`, {
        minWordCount: 2,
        removeWidowPreventionMeasures: true,
      }).res,
      `${opening}Foo Bar</a>`,
      `10.01 - ${JSON.stringify(measure)}`,
    );
  }
});

test("11 - postcode and hyphen handling applies only outside attributes", () => {
  const opening = '<p data-value="SW1A 1AA; one - two">';
  equal(
    removeWidows(`${opening}SW1A 1AA; one - two</p>`, {
      minWordCount: 99,
      UKPostcodes: true,
    }).res,
    `${opening}SW1A&nbsp;1AA; one&nbsp;- two</p>`,
    "11.01",
  );
});

test("12 - overlapping and adjacent explicit ranges extend tag protection", () => {
  const source = '<a class="one two">hidden words</a> three four five six';
  const closing = source.indexOf("</a>");
  const tagRanges = [
    [closing, closing + 4],
    [12, closing],
    [7, 15, "unused"],
  ];
  const snapshot = JSON.stringify(tagRanges);
  const result = removeWidows(source, { tagRanges });
  equal(result.res, source.replace("five six", "five&nbsp;six"), "12.01");
  equal(JSON.stringify(tagRanges), snapshot, "12.02");
  ok(
    result.ranges.every(([from]) => from > closing + 4),
    "12.03",
  );
  equal(
    removeWidows('LOCK<a class="one two">Foo Bar</a>', {
      minWordCount: 2,
      tagRanges: [[0, 4]],
    }).res,
    'LOCK<a class="one two">Foo&nbsp;Bar</a>',
    "12.04",
  );
  const straddling = '<b one="x">hidden<a class="foo bar">';
  equal(
    removeWidows(straddling, {
      minWordCount: 0,
      minCharCount: 0,
      tagRanges: [[5, 16]],
    }).res,
    straddling,
    "12.05",
  );
  const opaque = "{{ value <a }}";
  equal(
    removeWidows(`${opaque} one two three four`, {
      tagRanges: [[0, opaque.length]],
    }).res,
    `${opaque} one two three&nbsp;four`,
    "12.06",
  );
});

test("13 - explicit protection of a tag prefix preserves the complete tag", () => {
  const source = '<a\n class="one two">\nFoo Bar\n</a>';
  equal(
    removeWidows(source, { minWordCount: 2, tagRanges: [[0, 4]] }).res,
    source.replace("Foo Bar", "Foo&nbsp;Bar"),
    "13.01",
  );
});

test("14 - inline markup does not add word or character counts", () => {
  const source = "<b>one</b><i>two</i> three four";
  equal(removeWidows(source).res, source, "14.01");
  equal(
    removeWidows(source, { minWordCount: 3 }).res,
    "<b>one</b><i>two</i> three&nbsp;four",
    "14.02",
  );
  equal(
    removeWidows("<b>one two thr</b>ee four").res,
    "<b>one two thr</b>ee&nbsp;four",
    "14.03",
  );
  const short = '<a title="many extra characters">ab cd</a>';
  equal(removeWidows(short, { minWordCount: 2 }).res, short, "14.04");
  equal(
    removeWidows(short, { minWordCount: 2, minCharCount: 4 }).res,
    '<a title="many extra characters">ab&nbsp;cd</a>',
    "14.05",
  );
});

test("15 - finds whitespace on either side of inline and adjacent tags", () => {
  for (const [source, expected] of [
    ["one two three <b>four</b>", "one two three&nbsp;<b>four</b>"],
    ["one two three<b> four</b>", "one two three<b>&nbsp;four</b>"],
    ["one two three <b></b>four", "one two three&nbsp;<b></b>four"],
    ["one two three<b> </b>four", "one two three<b>&nbsp;</b>four"],
    ["one two three four <i></i>", "one two three&nbsp;four <i></i>"],
  ]) {
    equal(removeWidows(source).res, expected, `15.01 - ${source}`);
  }
});

test("16 - custom ignore markers take precedence over element recognition", () => {
  const source =
    '<code>one <a title="three four">two</a> three four</code> five six seven eight';
  for (const marker of [
    { heads: "<code>", tails: "</code>" },
    { heads: ["<pre>", "<code>"], tails: ["</pre>", "</code>"] },
  ]) {
    equal(
      removeWidows(source, { ignore: [marker] }).res,
      source.replace("seven eight", "seven&nbsp;eight"),
      `16.01 - ${JSON.stringify(marker)}`,
    );
    equal(
      removeWidows(`<p>${source}</p>`, { ignore: [marker] }).res,
      `<p>${source.replace("seven eight", "seven&nbsp;eight")}</p>`,
      `16.02 - ${JSON.stringify(marker)}`,
    );
  }
});

test("17 - explicit ignore markers still protect comments and raw text", () => {
  const prefix =
    '<!-- one two three four --><script>const value = "one two";</script><style>a { font: normal bold }</style>';
  equal(
    removeWidows(`${prefix}<p>one two three four</p>`, {
      ignore: [
        { heads: "<!--", tails: "-->" },
        { heads: "<script>", tails: "</script>" },
        { heads: "<style>", tails: "</style>" },
      ],
    }).res,
    `${prefix}<p>one two three&nbsp;four</p>`,
    "17.01",
  );
});

test("18 - browser bundle preserves HTML results and progress reporting", () => {
  const browser = {};
  runInNewContext(
    readFileSync(
      new URL("../dist/string-remove-widows.umd.js", import.meta.url),
      "utf8",
    ),
    browser,
  );
  const source =
    '<p>\n  <a href="https://example.com" class="underline font-bold">\n      Foo Bar\n  </a>\n</p>';
  const options = {
    minWordCount: 2,
    reportProgressFuncFrom: 10,
    reportProgressFuncTo: 90,
  };
  const esmProgress = [];
  const browserProgress = [];
  const esmResult = removeWidows(source, {
    ...options,
    reportProgressFunc: (value) => esmProgress.push(value),
  });
  const browserResult = browser.stringRemoveWidows.removeWidows(source, {
    ...options,
    reportProgressFunc: (value) => browserProgress.push(value),
  });
  const expected = JSON.parse(JSON.stringify(esmResult));
  const actual = JSON.parse(JSON.stringify(browserResult));
  delete expected.log;
  delete actual.log;
  equal(browserResult.res, source.replace("Foo Bar", "Foo&nbsp;Bar"), "18.01");
  equal(actual, expected, "18.02");
  equal(browserProgress, esmProgress, "18.03");
  equal(
    [browserProgress[0], browserProgress[browserProgress.length - 1]],
    [10, 90],
    "18.04",
  );
  ok(
    browserProgress.every(
      (value, index) =>
        Number.isInteger(value) &&
        value >= 10 &&
        value <= 90 &&
        (index === 0 || value > browserProgress[index - 1]),
    ),
    "18.05",
  );
  ok(Number.isFinite(browserResult.log.timeTakenInMilliseconds), "18.06");
});

test.run();
