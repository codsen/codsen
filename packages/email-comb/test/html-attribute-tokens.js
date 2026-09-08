import { test } from "uvu";
import { equal } from "uvu/assert";

import { comb } from "./util/util.js";

test("01 - splits all entity-encoded ASCII class separators", () => {
  const separators = [
    "&#9;",
    "&#10;",
    "&#12;",
    "&#13;",
    "&#32;",
    "&#x9;",
    "&#xA;",
    "&#xC;",
    "&#xD;",
    "&#x20;",
    "&Tab;",
    "&NewLine;",
  ];
  const results = separators.map((separator) => {
    const source = `<style>.foo{color:red}.bar{color:blue}</style><body><div class="foo${separator}bar">x</div></body>`;
    const actual = comb(source);
    return {
      unchanged: actual.result === source,
      allInBody: actual.allInBody,
      deletedFromHead: actual.deletedFromHead,
      deletedFromBody: actual.deletedFromBody,
    };
  });

  equal(
    results,
    separators.map(() => ({
      unchanged: true,
      allInBody: [".bar", ".foo"],
      deletedFromHead: [],
      deletedFromBody: [],
    })),
    "01.01",
  );
});

test("02 - handles encoded separators in each HTML quoting context", () => {
  const attributes = [
    'class="foo&#32;bar"',
    "class='foo&#32;bar'",
    "class=foo&#32;bar",
  ];
  const results = attributes.map((attribute) => {
    const source = `<style>.foo{color:red}.bar{color:blue}</style><body><div ${attribute}>x</div></body>`;
    const actual = comb(source);
    return [actual.result === source, actual.allInBody];
  });

  equal(
    results,
    attributes.map(() => [true, [".bar", ".foo"]]),
    "02.01",
  );
});

test("03 - combines literal and encoded ASCII class separators", () => {
  const actual = comb(
    '<style>.foo{color:red}.bar{color:blue}.baz{color:green}</style><body><div class="foo\t&#32;bar&NewLine;\fbaz">x</div></body>',
  );

  equal(actual.allInBody, [".bar", ".baz", ".foo"], "03.01");
  equal(actual.deletedFromHead, [], "03.02");
  equal(actual.deletedFromBody, [], "03.03");
});

test("04 - never invents a class containing decoded ASCII whitespace", () => {
  const actual = comb(
    String.raw`<style>.foo\20 bar{color:red}</style><body><div class="foo&#32;bar">x</div></body>`,
  );

  equal(actual.allInBody, [".bar", ".foo"], "04.01");
  equal(actual.deletedFromHead, [".foo bar"], "04.02");
  equal(actual.deletedFromBody, [".bar", ".foo"], "04.03");
});

test("05 - keeps non-ASCII whitespace inside one class identity", () => {
  const source = String.raw`<style>.foo\a0 bar{color:red}.foo\b bar{color:blue}.foo\2003 bar{color:green}</style><body><div class="foo&nbsp;bar foo&#11;bar foo&emsp;bar">x</div></body>`;
  const actual = comb(source);

  equal(actual.result, source, "05.01");
  equal(
    actual.allInBody.slice().sort(),
    [".foo\u000bbar", ".foo\u00a0bar", ".foo\u2003bar"],
    "05.02",
  );
  equal(actual.deletedFromHead, [], "05.03");
});

test("06 - keeps literal non-ASCII whitespace inside class values", () => {
  const source = `<style>.foo\\a0 bar{color:red}.foo\\b bar{color:blue}.foo\\2003 bar{color:green}</style><body><div class="foo\u00a0bar foo\u000bbar foo\u2003bar">x</div></body>`;
  const actual = comb(source);

  equal(actual.result, source, "06.01");
  equal(
    actual.allInBody.slice().sort(),
    [".foo\u000bbar", ".foo\u00a0bar", ".foo\u2003bar"],
    "06.02",
  );
});

test("07 - decodes nested ampersands only once", () => {
  const source =
    '<style>[class~="foo&#32;bar"]{color:red}[class~="&copy;"]{color:blue}</style><body><div class="foo&amp;#32;bar &amp;copy;">x</div></body>';
  const actual = comb(source);

  equal(actual.result, source, "07.01");
  equal(actual.allInBody, [".&copy;", ".foo&#32;bar"], "07.02");
  equal(actual.deletedFromHead, [], "07.03");
});

test("08 - preserves ambiguous and unknown attribute references", () => {
  const source =
    '<style>[class~="&notit;"]{color:red}[class~="&unknown;"]{color:blue}</style><body><div class="&notit; &unknown;">x</div></body>';
  const actual = comb(source);

  equal(actual.result, source, "08.01");
  equal(actual.allInBody, [".&notit;", ".&unknown;"], "08.02");
});

test("09 - retains literal backslashes instead of CSS-decoding HTML", () => {
  const source = String.raw`<style>.foo\\bar{color:red}</style><body><div class="foo\bar">x</div></body>`;
  const actual = comb(source);

  equal(actual.result, source, "09.01");
  equal(actual.allInBody, [String.raw`.foo\bar`], "09.02");
  equal(actual.deletedFromHead, [], "09.03");
});

test("10 - treats decoded quotes and tag delimiters as value data", () => {
  const source = `<style>[class~='a"b']{color:red}[class~="a>b"]{color:blue}</style><body><div class="a&quot;b a&gt;b">x</div></body>`;
  const actual = comb(source);

  equal(actual.result, source, "10.01");
  equal(actual.allInBody, ['.a"b', ".a>b"], "10.02");
});

test("11 - consumes complete semicolonless numeric references", () => {
  const source =
    '<style>.foo{color:red}.bar{color:blue}.foo₺r{color:green}</style><body><div class="foo&#32bar foo&#x20bar">x</div></body>';
  const actual = comb(source);

  equal(actual.result, source, "11.01");
  equal(actual.allInBody, [".bar", ".foo", ".foo₺r"], "11.02");
});

test("12 - removes first, middle, last, and all encoded class tokens", () => {
  const values = [
    "gh&#111;st&#32;us&#101;d",
    "us&#101;d&#32;gh&#111;st&#9;us&#101;d",
    "us&#101;d&#32;gh&#111;st",
    "gh&#111;st&#32;gh&#111;st",
  ];
  const results = values.map((value) =>
    comb(
      `<style>.used{color:red}</style><body><div class="${value}">x</div><p class="used">y</p></body>`,
    ),
  );

  equal(
    results.map((actual) => actual.result),
    [
      '<style>.used{color:red}</style><body><div class="us&#101;d">x</div><p class="used">y</p></body>',
      '<style>.used{color:red}</style><body><div class="us&#101;d&#9;us&#101;d">x</div><p class="used">y</p></body>',
      '<style>.used{color:red}</style><body><div class="us&#101;d">x</div><p class="used">y</p></body>',
      '<style>.used{color:red}</style><body><div>x</div><p class="used">y</p></body>',
    ],
    "12.01",
  );
  equal(
    results.map((actual) => actual.deletedFromBody),
    values.map(() => [".ghost"]),
    "12.02",
  );
});

test("13 - removes encoded separators without breaking unquoted attributes", () => {
  const actual = comb(
    '<style>.used{color:red}</style><body><div class=ghost&#32;us&#101;d&#9;ghost title="keep">x</div></body>',
  );

  equal(
    actual.result,
    '<style>.used{color:red}</style><body><div class=us&#101;d title="keep">x</div></body>',
    "13.01",
  );
  equal(actual.deletedFromBody, [".ghost"], "13.02");
});

test("14 - uglifies a surviving token at its complete raw reference span", () => {
  const actual = comb(
    '<style>.used{color:red}</style><body><div class="ghost&#32;us&#101;d&#9;ghost" title="keep">x</div></body>',
    { uglify: true },
  );

  equal(
    actual.result,
    '<style>.l{color:red}</style><body><div class="l" title="keep">x</div></body>',
    "14.01",
  );
  equal(actual.log.uglified, [[".used", ".l"]], "14.02");
  equal(actual.deletedFromBody, [".ghost"], "14.03");
});

test("15 - preserves the raw spelling of a whitelisted semantic token", () => {
  const actual = comb(
    '<body><div class="ghost&#32;us&#101;d&#9;ghost">x</div></body>',
    { whitelist: [".used"], uglify: true },
  );

  equal(actual.result, '<body><div class="us&#101;d">x</div></body>', "15.01");
  equal(actual.log.uglified, [], "15.02");
  equal(actual.deletedFromBody, [".ghost"], "15.03");
});

test("16 - retains exact IDs with leading, internal, and trailing spaces", () => {
  const source =
    '<style>[id=" x "]{color:red}[id="x y"]{color:blue}</style><body><div id=" x ">x</div><p id="x&#32;y">y</p></body>';
  const actual = comb(source);

  equal(actual.result, source, "16.01");
  equal(actual.allInBody, ["# x ", "#x y"], "16.02");
  equal(actual.deletedFromHead, [], "16.03");
});

test("17 - never matches an individual word of an exact ID", () => {
  const actual = comb(
    '<style>#foo{color:red}#bar{color:blue}</style><body><div id="foo&#32;bar">x</div></body>',
  );

  equal(actual.allInBody, ["#foo bar"], "17.01");
  equal(actual.deletedFromHead, ["#bar", "#foo"], "17.02");
  equal(actual.deletedFromBody, ["#foo bar"], "17.03");
  equal(actual.result.includes("id="), false, "17.04");
});

test("18 - uglifies an exact whitespace-bearing ID as one raw value", () => {
  const actual = comb(
    '<style>[id=" x "]{color:red}</style><body><div id="&#32;x&#32;" title="keep">x</div></body>',
    { uglify: true },
  );
  const replacement = actual.log.uglified[0]?.[1].slice(1);

  equal(actual.log.uglified.length, 1, "18.01");
  equal(actual.log.uglified[0]?.[0], "# x ", "18.02");
  equal(
    actual.result,
    `<style>[id="${replacement}"]{color:red}</style><body><div id="${replacement}" title="keep">x</div></body>`,
    "18.03",
  );
});

test("19 - protects the exact single ID referenced by a label", () => {
  const actual = comb(
    '<body><label for="first&#32;second">x</label><input id="first second"><input id="first"><input id="second"></body>',
    { uglify: true },
  );

  equal(
    actual.result,
    '<body><label for="first&#32;second">x</label><input id="first second"><input><input></body>',
    "19.01",
  );
  equal(actual.deletedFromBody, ["#first", "#second"], "19.02");
  equal(actual.log.uglified, [], "19.03");
});

test("20 - protects the ASCII-separated ID list referenced by output", () => {
  const actual = comb(
    '<body><output for="first&#32;second&Tab;third">x</output><input id="first"><input id="second"><input id="third"><input id="first second"></body>',
    { uglify: true },
  );

  equal(
    actual.result,
    '<body><output for="first&#32;second&Tab;third">x</output><input id="first"><input id="second"><input id="third"><input></body>',
    "20.01",
  );
  equal(actual.deletedFromBody, ["#first second"], "20.02");
  equal(actual.log.uglified, [], "20.03");
});

test("21 - decodes label and output references only once", () => {
  const source =
    '<body><label for="&amp;copy;">x</label><input id="&amp;copy;"><output for="&amp;#32;">y</output><input id="&amp;#32;"></body>';
  const actual = comb(source, { uglify: true });

  equal(actual.result, source, "21.01");
  equal(actual.allInBody, ["#&#32;", "#&copy;"], "21.02");
  equal(actual.deletedFromBody, [], "21.03");
  equal(actual.log.uglified, [], "21.04");
});

test("22 - decodes static class segments around configured backend expressions", () => {
  const values = [
    "used&#32;other {{ dynamic }}",
    "{{ dynamic }} used&#32;other",
  ];
  const results = values.map((value) => {
    const source = `<style>.used{color:red}.other{color:blue}</style><body><div class="${value}">x</div></body>`;
    const actual = comb(source, {
      backend: [{ heads: "{{", tails: "}}" }],
    });
    return [
      actual.result === source,
      actual.allInBody,
      actual.deletedFromHead,
      actual.deletedFromBody,
    ];
  });

  equal(
    results,
    values.map(() => [true, [".other", ".used"], [], []]),
    "22.01",
  );
});

test("23 - removes unused mapped class tokens beside backend expressions", () => {
  const actual = comb(
    '<style>.used{color:red}</style><body><div class="{{ dynamic }} ghost&#32;us&#101;d">x</div></body>',
    { backend: [{ heads: "{{", tails: "}}" }] },
  );

  equal(
    actual.result,
    '<style>.used{color:red}</style><body><div class="{{ dynamic }} us&#101;d">x</div></body>',
    "23.01",
  );
  equal(actual.allInBody, [".ghost", ".used"], "23.02");
  equal(actual.deletedFromBody, [".ghost"], "23.03");
});

test("24 - keeps unmatched template closing markers in exact static IDs", () => {
  const source =
    '<style>[id="x}} y"]{color:red}[id="x%} y"]{color:blue}</style><body><div id="x}} y">x</div><p id="x%} y">y</p></body>';
  const actual = comb(source);

  equal(actual.result, source, "24.01");
  equal(actual.allInBody.slice().sort(), ["#x%} y", "#x}} y"], "24.02");
  equal(actual.deletedFromHead, [], "24.03");
});

test("25 - distinguishes literal input preprocessing from reference decoding", () => {
  const source = `<style>[id="x\\a y"]{color:red}[id="x\\d y"]{color:blue}.x\\fffd y{color:green}</style><body><div id="x\r\ny">x</div><p id="x\ry">y</p><i id="x&#13;y" class="x\u0000y">z</i></body>`;
  const actual = comb(source);

  equal(actual.result, source, "25.01");
  equal(
    actual.allInBody.slice().sort(),
    ["#x\ny", "#x\ry", ".x\ufffdy"],
    "25.02",
  );
  equal(actual.deletedFromHead, [], "25.03");
});

test("26 - preserves raw offsets after Unicode characters whose lowercase expands", () => {
  const prefix = "İ".repeat(60);
  const fixtures = [
    [
      `<style>/*${prefix}*/.foo{color:red}</style><body><div class='foo'>x</div></body>`,
      "<style>.foo{color:red}</style><body><div class='foo'>x</div></body>",
    ],
    [
      `<style>.foo{color:red}</style><body><div title="${prefix}" CLASS="foo">x</div></body>`,
      `<style>.foo{color:red}</style><body><div title="${prefix}" CLASS="foo">x</div></body>`,
    ],
  ];
  const results = fixtures.map(([source, expected]) => {
    const actual = comb(source);
    return [
      actual.result === expected,
      actual.allInHead,
      actual.allInBody,
      actual.deletedFromHead,
      actual.deletedFromBody,
    ];
  });

  equal(
    results,
    fixtures.map(() => [true, [".foo"], [".foo"], [], []]),
    "26.01",
  );
});

test.run();
