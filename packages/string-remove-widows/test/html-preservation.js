import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { rApply } from "ranges-apply";
import { test } from "uvu";
import { equal, ok } from "uvu/assert";
import { removeWidows } from "../dist/string-remove-widows.esm.js";

const spellings = ["\u00a0", "&nbsp;", "&#160;", "\\u00A0", "\\0000A0"];
const formats = [
  [{}, "&nbsp;"],
  [{ convertEntities: false }, "\u00a0"],
  [{ targetLanguage: "css" }, "\\0000A0"],
  [{ targetLanguage: "js" }, "\\u00A0"],
];

test("01 - automatic opaque HTML preserves content in every output mode", () => {
  for (const region of [
    '<ScRiPt type="application/ld+json">{"name":"one two three four", "x":"<b> - &nbsp; SW1A 1AA"}</sCrIpT>',
    '<style media="screen">a { content: "one two - three four"; }</style>',
    "<!-- one two three four &nbsp; <script> -->",
    '<!DOCTYPE html [<!ENTITY example "one > two three four">]>',
    '<?xml value="one > two three four"?>',
    "<![CDATA[one two three four &nbsp; <a>]]>",
    '<pre class="one two">one two <pre>three four</pre> five six</pre>',
    "<code>one two <code>three four</code> five six</code>",
    "<textarea>one two three four &nbsp;</textarea>",
    "<title>one two three four &nbsp;</title>",
  ]) {
    for (const [options, replacement] of formats) {
      const source = `${region}<p>one two three four</p>`;
      const result = removeWidows(source, { ...options, UKPostcodes: true });
      equal(
        result.res,
        `${region}<p>one two three${replacement}four</p>`,
        "01.01",
      );
      equal(rApply(source, result.ranges), result.res, "01.02");
      ok(
        result.ranges.every(([from]) => from >= region.length),
        "01.03",
      );
      equal(
        removeWidows(region, {
          ...options,
          removeWidowPreventionMeasures: true,
        }).res,
        region,
        "01.04",
      );
    }
  }
});

test("02 - unfinished opaque regions preserve the remaining input", () => {
  for (const region of [
    "<script>one two three four </scripted>",
    "<script>one two three four </script\v> five six seven eight",
    "<style>one two three four </style\u00a0> five six seven eight",
    "<style>one two three four",
    "<!-- one two three four",
    "<![CDATA[one two three four",
    '<!DOCTYPE html ["one two three four',
    '<?xml value="one two three four',
    "<pre>one two three four",
    "<code>one two three four",
    "<textarea>one two three four",
  ]) {
    equal(removeWidows(region).res, region, "02.01");
    equal(
      removeWidows(`<p>one two three four</p>${region}`).res,
      `<p>one two three&nbsp;four</p>${region}`,
      "02.02",
    );
  }
});

test("03 - adjacent nonbreaking tokens are replaced exactly once", () => {
  for (const a of spellings) {
    for (const b of spellings) {
      for (const [options, replacement] of formats) {
        const source = `one two three${a}${b}four`;
        const result = removeWidows(source, options);
        equal(
          result.res,
          `one two three${replacement}${replacement}four`,
          "03.01",
        );
        equal(rApply(source, result.ranges), result.res, "03.02");
        equal(removeWidows(result.res, options).res, result.res, "03.03");
        const removal = removeWidows(source, {
          ...options,
          removeWidowPreventionMeasures: true,
        });
        equal(removal.res, `one two three${replacement} four`, "03.04");
      }
    }
  }
});

test("04 - nested preset blocks remain opaque through the outer close", () => {
  for (const ignore of ["jinja", "nunjucks", "liquid", "all"]) {
    for (const region of [
      "{% if a %}{% if b %}{% endif %}&nbsp; - SW1A 1AA{% endif %}",
      "{%- for a in b -%}{% if c %}{% for x in y %}{% endfor %}{% endif %}&#160;{%- endfor -%}",
      "{% if a %}{% endifx %}&nbsp;{% endif %}",
      "{% if a %}{% if b %}{% endif %}&nbsp;",
    ]) {
      equal(
        removeWidows(region, {
          ignore,
          convertEntities: false,
          UKPostcodes: true,
        }).res,
        region,
        "04.01",
      );
      if (region.endsWith("%}")) {
        const source = `${region}\none two three four`;
        equal(
          removeWidows(source, { ignore }).res,
          `${region}\none two three&nbsp;four`,
          "04.02",
        );
      }
    }
  }
});

test("05 - explicit opacity prevents inferred markup from escaping it", () => {
  for (const opaque of ["{{ value <a }}", "hidden <a", "<!-- <a -->"]) {
    const source = `${opaque} one two three four > five six`;
    equal(
      removeWidows(source, { tagRanges: [[0, opaque.length]] }).res,
      `${opaque} one two three four > five&nbsp;six`,
      "05.01",
    );
  }
});

test("06 - trailing markup and whitespace preserve an existing final measure", () => {
  for (const measure of spellings) {
    for (const trailing of [
      " </p>",
      "</p> ",
      " <i></i></p>",
      "</b> </p>",
      "\t</p>",
    ]) {
      const source = `<p>one two three${measure}${trailing.startsWith("</b>") ? "<b>" : ""}four${trailing}`;
      for (const [options] of formats) {
        const result = removeWidows(source, options);
        equal(removeWidows(result.res, options).res, result.res, "06.01");
        ok(result.res.startsWith("<p>one two three"), "06.02");
      }
    }
  }
});

test("07 - block and break boundaries isolate word thresholds", () => {
  for (const tag of ["p", "div", "li", "h1", "h6", "td", "section"]) {
    const first = `<${tag}>one two three four</${tag}>`;
    const second = `<${tag}>five six seven eight</${tag}>`;
    for (const gap of ["", "\n", "\r\n"]) {
      equal(
        removeWidows(first + gap + second).res,
        first.replace("three four", "three&nbsp;four") +
          gap +
          second.replace("seven eight", "seven&nbsp;eight"),
        "07.01",
      );
      const short = `<${tag}>one two three</${tag}>${gap}<${tag}>four five six</${tag}>`;
      equal(removeWidows(short).res, short, "07.02");
    }
  }
  for (const tag of ["<br>", "<br/>", '<HR class="one two">']) {
    equal(
      removeWidows(`one two three four${tag}five six seven eight`).res,
      `one two three&nbsp;four${tag}five six seven&nbsp;eight`,
      "07.03",
    );
  }
  equal(
    removeWidows("<p>one two three four</p><p> - five</p>").res,
    "<p>one two three&nbsp;four</p><p> - five</p>",
    "07.04",
  );
  equal(
    removeWidows("one <b>two</b> three <i>four</i>").res,
    "one <b>two</b> three&nbsp;<i>four</i>",
    "07.05",
  );
});

test("08 - trailing encoded whitespace does not become a final word", () => {
  for (const measure of spellings) {
    for (const tail of ["", " </p>", "\n"]) {
      const prefix = tail.includes("</p>") ? "<p>" : "";
      const source = `${prefix}one two three four ${measure}${measure === "\\0000A0" && tail ? " " : ""}${tail}`;
      equal(
        removeWidows(source, { convertEntities: false }).res,
        `${prefix}one two three\u00a0four \u00a0${tail}`,
        "08.01",
      );
    }
  }
});

test("09 - final placeholders retain their preceding whitespace", () => {
  for (const [ignore, placeholder] of [
    ["hugo", "{{four}}"],
    ["jinja", "{{four}}"],
    [[{ heads: "[[", tails: "]]" }], "[[four]]"],
  ]) {
    for (const gap of [" ", "  ", "\t"]) {
      const source = `one two three${gap}${placeholder}`;
      equal(
        removeWidows(source, { ignore }).res,
        `one two three&nbsp;${placeholder}`,
        "09.01",
      );
    }
    equal(
      removeWidows(`one two${placeholder}`, { ignore }).res,
      `one two${placeholder}`,
      "09.02",
    );
  }
});

test("10 - ordinary tag-name and punctuation words use ordinary gaps", () => {
  for (const source of [
    "one two HR four",
    "one two BR four",
    "one two br four",
    "one two hr four",
    "one two three /path",
    "one two three >value",
  ]) {
    const expected = source.replace(/ (\S+)$/, "&nbsp;$1");
    equal(removeWidows(source).res, expected, "10.01");
    equal(removeWidows(source, {}).res, expected, "10.02");
  }
});

test("11 - browser results preserve semantic fields and range replay", () => {
  const browser = {};
  runInNewContext(
    readFileSync(
      new URL("../dist/string-remove-widows.umd.js", import.meta.url),
      "utf8",
    ),
    browser,
  );
  for (const source of [
    "<script>one two three four</script><p>one two three four</p>",
    "one two three&#160;&#160;four",
    "<p>one two three&nbsp;four </p>",
    "<p>one two three four</p><p>five six seven eight</p>",
  ]) {
    const esm = removeWidows(source);
    const result = browser.stringRemoveWidows.removeWidows(source);
    const { log: _a, ...expected } = esm;
    const { log: _b, ...actual } = result;
    equal(JSON.parse(JSON.stringify(actual)), expected, "11.01");
    equal(rApply(source, result.ranges), result.res, "11.02");
  }
});

test("12 - whitespace split by empty inline tags is protected in one call", () => {
  for (const [options, replacement] of formats) {
    for (const tags of ["<i></i>", "<i> </i>", "<i></i><b></b>"]) {
      const source = `<p>one two three ${tags} four </p>`;
      const expected = `<p>one two three${replacement}${tags.replace(" ", replacement)}${replacement}four </p>`;
      const result = removeWidows(source, options);
      equal(result.res, expected, "12.01");
      equal(removeWidows(result.res, options).res, result.res, "12.02");
      equal(rApply(source, result.ranges), result.res, "12.03");
    }
  }
});

test.run();
