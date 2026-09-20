import { test } from "uvu";
import { equal, ok } from "uvu/assert";

import { comb } from "../dist/email-comb.esm.js";

function html(css, classes) {
  return `<style>${css}</style><body><div class="${classes}">x</div></body>`;
}

test("01 - escaped commas stay inside names while real commas split selectors", () => {
  const actual = comb(
    html(String.raw`.a\,b,.unused{color:red}.gone{color:blue}`, "a,b"),
  );
  equal(actual.result, html(String.raw`.a\,b{color:red}`, "a,b"), "01.01");
  equal(actual.allInHead, [".a,b", ".gone", ".unused"], "01.02");
  equal(actual.allInBody, [".a,b"], "01.03");
  equal(actual.deletedFromHead, [".gone", ".unused"], "01.04");
  equal(actual.deletedFromBody, [], "01.05");
});

test("02 - escaped braces at-signs and quotes stay inside selector names", () => {
  const fixtures = [
    [String.raw`.a\{b`, "a{b", "a{b"],
    [String.raw`.a\}b`, "a}b", "a}b"],
    [String.raw`.a\@media`, "a@media", "a@media"],
    [String.raw`.a\"b`, "a&quot;b", 'a"b'],
  ];
  for (const [selector, body, canonical] of fixtures) {
    const retained = `${selector}{color:red}`;
    const actual = comb(html(`${retained}.gone{color:blue}`, body));
    equal(actual.result, html(retained, body), "02.01");
    equal(actual.allInHead, [`.${canonical}`, ".gone"], "02.02");
    equal(actual.allInBody, [`.${canonical}`], "02.03");
    equal(actual.deletedFromHead, [".gone"], "02.04");
    equal(actual.deletedFromBody, [], "02.05");
  }
});

test("03 - escaped declaration braces do not close the containing rule", () => {
  for (const value of [
    String.raw`a\}b`,
    String.raw`a\{b`,
    String.raw`a\;b\,c`,
  ]) {
    const retained = `.keep{--x:${value};color:red}`;
    const actual = comb(html(`${retained}.gone{color:blue}`, "keep"));
    equal(actual.result, html(retained, "keep"), "03.01");
    equal(actual.allInHead, [".gone", ".keep"], "03.02");
    equal(actual.deletedFromHead, [".gone"], "03.03");
    equal(actual.deletedFromBody, [], "03.04");
  }
});

test("04 - CSS strings retain escaped quotes apparent comments and continuations", () => {
  const values = [
    String.raw`"a\"}b"`,
    String.raw`'a\'}b'`,
    '"/*literal*/.fake,#fake{@media}"',
    '"a\\\nb"',
    '"a\\\r\nb"',
  ];
  for (const value of values) {
    const retained = `.keep{content:${value};color:red}`;
    const actual = comb(html(`${retained}.gone{color:blue}`, "keep"));
    equal(actual.result, html(retained, "keep"), "04.01");
    equal(actual.allInHead, [".gone", ".keep"], "04.02");
    equal(actual.allInBody, [".keep"], "04.03");
    equal(actual.deletedFromHead, [".gone"], "04.04");
    equal(actual.log.commentsLength, 0, "04.05");
  }
});

test("05 - URL tokens retain their punctuation and apparent comment contents", () => {
  const values = [
    String.raw`url(foo\/*literal*/bar\)baz)`,
    String.raw`u\72 l(foo}bar,.fake#fake)`,
    "URL(foo/**/bar)",
    String.raw`url("foo\"}bar/*literal*/")`,
  ];
  for (const value of values) {
    const retained = `.keep{background:${value};color:red}`;
    const actual = comb(html(`${retained}.gone{color:blue}`, "keep"));
    equal(actual.result, html(retained, "keep"), "05.01");
    equal(actual.allInHead, [".gone", ".keep"], "05.02");
    equal(actual.allInBody, [".keep"], "05.03");
    equal(actual.deletedFromHead, [".gone"], "05.04");
    equal(actual.log.commentsLength, 0, "05.05");
  }
});

test("06 - nested functions and blocks keep inner separators out of rule parsing", () => {
  const retained = String.raw`.keep{--x:fn([a\}b],{c:d});color:red}`;
  const actual = comb(html(`${retained}.gone{color:blue}`, "keep"));
  equal(actual.result, html(retained, "keep"), "06.01");
  equal(actual.allInHead, [".gone", ".keep"], "06.02");
  equal(actual.deletedFromHead, [".gone"], "06.03");
  const selector = '.keep:not([data-x="a,b"]){color:red}';
  equal(
    comb(html(`${selector}.gone{color:blue}`, "keep")).result,
    html(selector, "keep"),
    "06.04",
  );
});

test("07 - escaped and mixed-case at-keywords retain live nested rules", () => {
  for (const name of [String.raw`m\65 dia`, "MEDIA", "MeDiA"]) {
    const before = `@${name} all{@supports (display:grid){.keep{color:red}.gone{color:blue}}}`;
    const after = `@${name} all{@supports (display:grid){.keep{color:red}}}`;
    const actual = comb(html(before, "keep"));
    equal(actual.result, html(after, "keep"), "07.01");
    equal(actual.allInHead, [".gone", ".keep"], "07.02");
    equal(actual.allInBody, [".keep"], "07.03");
    equal(actual.deletedFromHead, [".gone"], "07.04");
  }
  const before = String.raw`@s\75 pports (display:grid){.keep{color:red}.gone{color:blue}}`;
  const after = String.raw`@s\75 pports (display:grid){.keep{color:red}}`;
  equal(comb(html(before, "keep")).result, html(after, "keep"), "07.05");
});

test("08 - escaped ignored at-rules keep their complete strings and URLs", () => {
  const font = String.raw`@f\6f nt-face{font-family:"x}y";src:url(foo\)bar)}`;
  const retained = `${font}.keep{color:red}`;
  const actual = comb(html(`${retained}.gone{color:blue}`, "keep"));
  equal(actual.result, html(retained, "keep"), "08.01");
  equal(actual.allInHead, [".gone", ".keep"], "08.02");
  equal(actual.deletedFromHead, [".gone"], "08.03");
  const imported = String.raw`@\69 mport u\72 l(foo,.fake#fake);`;
  equal(
    comb(html(`${imported}.keep{color:red}.gone{color:blue}`, "keep")).result,
    html(`${imported}.keep{color:red}`, "keep"),
    "08.04",
  );
});

test("09 - unrelated attribute strings do not contribute selectors or structure", () => {
  const retained = String.raw`.keep[data-x=".fake,{@media}"][title='a\']b,#ghost']{color:red}`;
  const actual = comb(html(`${retained}.gone{color:blue}`, "keep"));
  equal(actual.result, html(retained, "keep"), "09.01");
  equal(actual.allInHead, [".gone", ".keep"], "09.02");
  equal(actual.allInBody, [".keep"], "09.03");
  equal(actual.deletedFromHead, [".gone"], "09.04");
  equal(actual.deletedFromBody, [], "09.05");
});

test("10 - escaped class attribute names and string continuations match body classes", () => {
  const fixtures = [
    [String.raw`[cl\61 ss="a\,b"]`, "a,b"],
    ['[class="a\\\nb"]', "ab"],
    ['[class="a\\\r\nb"]', "ab"],
  ];
  for (const [selector, body] of fixtures) {
    const retained = `${selector}{color:red}`;
    const actual = comb(html(`${retained}.gone{color:blue}`, body));
    equal(actual.result, html(retained, body), "10.01");
    equal(actual.allInHead, [`.${body}`, ".gone"], "10.02");
    equal(actual.allInBody, [`.${body}`], "10.03");
    equal(actual.deletedFromHead, [".gone"], "10.04");
    equal(actual.deletedFromBody, [], "10.05");
  }
});

test("11 - uglification maps long escaped names consistently across CSS and HTML", () => {
  const fixtures = [
    [String.raw`.newsletter\,title`, "newsletter,title", false],
    [String.raw`[cl\61 ss="newsletter\,title"]`, "newsletter,title", true],
  ];
  for (const [selector, canonical, attribute] of fixtures) {
    const declaration = String.raw`{content:"a\"}b";background:url(foo\/*x*/bar)}`;
    const actual = comb(
      html(`${selector}${declaration}.gone{color:blue}`, canonical),
      {
        uglify: true,
      },
    );
    const mapped = actual.log.uglified.find(
      ([original]) => original === `.${canonical}`,
    )?.[1];
    ok(mapped && mapped !== `.${canonical}`, "the long name has a replacement");
    const outputSelector = attribute
      ? `[cl\\61 ss="${mapped.slice(1)}"]`
      : mapped;
    equal(
      actual.result,
      html(`${outputSelector}${declaration}`, mapped.slice(1)),
      "11.01",
    );
    equal(actual.allInHead, [".gone", `.${canonical}`], "11.02");
    equal(actual.allInBody, [`.${canonical}`], "11.03");
    equal(actual.deletedFromHead, [".gone"], "11.04");
    equal(actual.deletedFromBody, [], "11.05");
  }
});

test("12 - comment-like data survives whether CSS comment removal is enabled", () => {
  const retained = String.raw`.keep{content:"/*literal*/";background:url(foo\/*literal*/bar)}`;
  const actual = comb(html(`${retained}.gone{color:blue}`, "keep"), {
    removeCSSComments: false,
  });
  equal(actual.result, html(retained, "keep"), "12.01");
  equal(actual.log.commentsLength, 0, "12.02");
  equal(actual.deletedFromHead, [".gone"], "12.03");
});

test("13 - final cleanup distinguishes empty wrappers from CSS string and URL data", () => {
  const retained =
    '.keep{content:"@media x{}";background:url(@media{});color:red}';
  const before = String.raw`@m\65 dia all{.gone{color:blue}}` + retained;
  const actual = comb(html(before, "keep"));
  equal(actual.result, html(retained, "keep"), "13.01");
  equal(actual.allInHead, [".gone", ".keep"], "13.02");
  equal(actual.allInBody, [".keep"], "13.03");
  equal(actual.deletedFromHead, [".gone"], "13.04");
});

test("14 - unclosed ignored at-rules stop at the HTML style boundary", () => {
  for (const css of [
    "@font-face{font-family:Brand;src:url(font.woff)",
    "@keyframes fade{from{opacity:0}to{opacity:1}",
  ]) {
    const before = `<style>${css}</style><body><div class="keep gone">x</div><style>.keep{color:red}.unused{color:blue}</style></body>`;
    const after = `<style>${css}</style><body><div class="keep">x</div><style>.keep{color:red}</style></body>`;
    const actual = comb(before);
    equal(actual.result, after, "14.01");
    equal(actual.allInHead, [".keep", ".unused"], "14.02");
    equal(actual.allInBody, [".gone", ".keep"], "14.03");
    equal(actual.deletedFromHead, [".unused"], "14.04");
    equal(actual.deletedFromBody, [".gone"], "14.05");
  }
});

test("15 - unfinished selector tokens cannot consume following HTML regions", () => {
  for (const css of [".unfinished\\", '[class="unfinished']) {
    const before = `<style>${css}</style><body><div class="keep gone">x</div><style>.keep{color:red}.unused{color:blue}</style></body>`;
    const after = `<style>${css}</style><body><div class="keep">x</div><style>.keep{color:red}</style></body>`;
    const actual = comb(before);
    equal(actual.result, after, "15.01");
    equal(actual.allInHead, [".keep", ".unused"], "15.02");
    equal(actual.allInBody, [".gone", ".keep"], "15.03");
    equal(actual.deletedFromHead, [".unused"], "15.04");
    equal(actual.deletedFromBody, [".gone"], "15.05");
  }
});

test("16 - CSS starts after the actual quoted opening style-tag boundary", () => {
  const before =
    '<style data-note="x > y">.keep{color:red}.gone{color:blue}</style><body><div class="keep">x</div></body>';
  const after =
    '<style data-note="x > y">.keep{color:red}</style><body><div class="keep">x</div></body>';
  const actual = comb(before);
  equal(actual.result, after, "16.01");
  equal(actual.allInHead, [".gone", ".keep"], "16.02");
  equal(actual.allInBody, [".keep"], "16.03");
  equal(actual.deletedFromHead, [".gone"], "16.04");
});

test("17 - removing adjacent selectors preserves an escaped trailing comma", () => {
  for (const before of [
    String.raw`.keep\,,.gone{color:red}`,
    String.raw`.gone,.keep\,{color:red}`,
  ]) {
    const actual = comb(html(before, "keep,"));
    equal(
      actual.result,
      html(String.raw`.keep\,{color:red}`, "keep,"),
      "17.01",
    );
    equal(actual.allInHead, [".gone", ".keep,"], "17.02");
    equal(actual.allInBody, [".keep,"], "17.03");
    equal(actual.deletedFromHead, [".gone"], "17.04");
    equal(actual.deletedFromBody, [], "17.05");
  }
});

test("18 - apparent HTML tags and comments inside CSS tokens stay opaque", () => {
  for (const value of [
    '"<body>"',
    '"<body class=other>"',
    '"<!-- comment -->"',
    '"<!-- unterminated"',
    "url(foo<!--x-->bar)",
  ]) {
    const retained = `.keep{content:${value};color:red}`;
    const result = comb(html(`${retained}.gone{color:blue}`, "keep"));
    equal(result.result, html(retained, "keep"), "18.01");
    equal(result.allInHead, [".gone", ".keep"], "18.02");
    equal(result.allInBody, [".keep"], "18.03");
    equal(result.log.commentsLength, 0, "18.04");
  }
});

test("19 - cleanup preserves style-looking HTML attribute and raw-text data", () => {
  const source =
    '<style>.keep{color:red}</style><body><div class="keep" title="<style></style>">x</div></body>';
  equal(comb(source).result, source, "19.01");
  for (const tag of [
    "script",
    "textarea",
    "title",
    "xmp",
    "iframe",
    "noembed",
    "noframes",
    "plaintext",
  ]) {
    const raw = `<body><${tag}><style>@media x{}</style></${tag}></body>`;
    equal(comb(raw).result, raw, "19.02");
  }
});

test("20 - legacy comment-wrapped style contents still expose live rules", () => {
  const result = comb(
    html("<!-- .keep{color:red}.gone{color:blue} -->", "keep"),
  );
  equal(result.allInHead, [".gone", ".keep"], "20.01");
  equal(result.allInBody, [".keep"], "20.02");
  equal(result.deletedFromHead, [".gone"], "20.03");
  equal(result.result.includes(".keep{color:red}"), true, "20.04");
});

test("21 - empty nested wrappers collapse while ordinary block data remains", () => {
  for (const depth of [1, 20, 100]) {
    const css = `${"@media all{".repeat(depth)}.gone{color:red}${"}".repeat(depth)}`;
    equal(
      comb(`<style>${css}</style><body>x</body>`).result,
      "<body>x</body>",
      "21.01",
    );
  }
  const retained = ".keep{--x:@media x{};color:red}";
  equal(comb(html(retained, "keep")).result, html(retained, "keep"), "21.02");
  const commented = "@media all{/* keep */}.keep{color:red}";
  equal(
    comb(html(commented, "keep"), { removeCSSComments: false }).result,
    html(commented, "keep"),
    "21.03",
  );
});

test("22 - functional selectors retain alternatives and exclusions conservatively", () => {
  for (const selector of [
    ":is(.keep,.absent)",
    ":where(.keep,.absent)",
    ".keep:not(.absent)",
    ".keep:has(.absent)",
    ".keep:nth-child(2n of .absent,.keep)",
  ]) {
    const source = `${selector}{color:red}`;
    const actual = comb(html(`${source}.unused{color:blue}`, "keep"));
    equal(actual.result, html(source, "keep"), "22.01");
    equal(actual.allInHead, [".absent", ".keep", ".unused"], "22.02");
    equal(actual.deletedFromHead, [".unused"], "22.03");
    equal(actual.deletedFromBody, [], "22.04");
  }
});

test("23 - uglification keeps names synchronized inside functional selectors", () => {
  const actual = comb(
    html(":is(.newsletter,.unavailable){color:red}", "newsletter"),
    { uglify: true },
  );
  const newsletter = actual.log.uglified.find(
    ([name]) => name === ".newsletter",
  )[1];
  const unavailable = actual.log.uglified.find(
    ([name]) => name === ".unavailable",
  )[1];
  equal(
    actual.result,
    html(`:is(${newsletter},${unavailable}){color:red}`, newsletter.slice(1)),
    "23.01",
  );
  equal(actual.deletedFromHead, [], "23.02");
  equal(actual.deletedFromBody, [], "23.03");
});

test.run();
