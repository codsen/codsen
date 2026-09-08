import { decode } from "html-entity-codec";
import {
  extractCssSelectorTokens,
  readCssSelectorToken,
} from "string-extract-class-names";
import { test } from "uvu";
import { equal, ok } from "uvu/assert";

import { comb } from "../dist/email-comb.esm.js";

function html(css, attributes, extra = "") {
  return `<style>${css}</style><body><div ${attributes}>x</div>${extra}</body>`;
}

test("01 - unchanged numeric class names retain their complete CSS escapes", () => {
  for (const [selector, canonical] of [
    [String.raw`.\31`, "1"],
    [String.raw`.\000031`, "1"],
    [String.raw`.\000031 `, "1"],
  ]) {
    const source = html(`${selector}{color:red}`, `class="${canonical}"`);
    const actual = comb(source, { uglify: true });
    equal(actual.result, source, "01.01");
    equal(actual.allInHead, [`.${canonical}`], "01.02");
    equal(actual.allInBody, [`.${canonical}`], "01.03");
    equal(actual.log.uglified, [[`.${canonical}`, `.${canonical}`]], "01.04");
    equal(actual.deletedFromHead, [], "01.05");
    equal(actual.deletedFromBody, [], "01.06");
  }
});

test("02 - unchanged numeric IDs retain their complete CSS escapes", () => {
  for (const [selector, canonical] of [
    [String.raw`#\31`, "1"],
    [String.raw`#\000031`, "1"],
    [String.raw`#\000031 `, "1"],
  ]) {
    const source = html(`${selector}{color:red}`, `id="${canonical}"`);
    const actual = comb(source, { uglify: true });
    equal(actual.result, source, "02.01");
    equal(actual.allInHead, [`#${canonical}`], "02.02");
    equal(actual.allInBody, [`#${canonical}`], "02.03");
    equal(actual.log.uglified, [[`#${canonical}`, `#${canonical}`]], "02.04");
  }
});

test("03 - short punctuation class and ID names keep valid escaped spellings", () => {
  for (const [marker, attribute] of [
    [".", "class"],
    ["#", "id"],
  ]) {
    for (const [raw, canonical] of [
      [String.raw`\:`, ":"],
      [String.raw`\-`, "-"],
      [String.raw`\+`, "+"],
      [String.raw`\\`, "\\"],
      [String.raw`\.`, "."],
      [String.raw`\#`, "#"],
    ]) {
      const source = html(
        `${marker}${raw}{color:red}`,
        `${attribute}="${canonical}"`,
      );
      const actual = comb(source, { uglify: true });
      equal(actual.result, source, "03.01");
      equal(actual.allInHead, [`${marker}${canonical}`], "03.02");
      equal(actual.allInBody, [`${marker}${canonical}`], "03.03");
      equal(
        actual.log.uglified,
        [[`${marker}${canonical}`, `${marker}${canonical}`]],
        "03.04",
      );
    }
  }
});

test("04 - unchanged attribute-selector values preserve quotes and identifier syntax", () => {
  const fixtures = [
    [String.raw`[class=\31]`, "class", ".", "1"],
    [String.raw`[class="\31"]`, "class", ".", "1"],
    [String.raw`[class~='\31']`, "class", ".", "1"],
    [String.raw`[cl\61 ss~=\31]`, "class", ".", "1"],
    [String.raw`[id=\31]`, "id", "#", "1"],
    [String.raw`[id='\31']`, "id", "#", "1"],
    [String.raw`[i\64="\3a"]`, "id", "#", ":"],
    ['[class=":"]', "class", ".", ":"],
  ];
  for (const [selector, attribute, marker, canonical] of fixtures) {
    const source = html(
      `${selector}{color:red}`,
      `${attribute}="${canonical}"`,
    );
    const actual = comb(source, { uglify: true });
    equal(actual.result, source, "04.01");
    equal(actual.allInHead, [`${marker}${canonical}`], "04.02");
    equal(actual.allInBody, [`${marker}${canonical}`], "04.03");
    equal(
      actual.log.uglified,
      [[`${marker}${canonical}`, `${marker}${canonical}`]],
      "04.04",
    );
  }
});

test("05 - unchanged names preserve HTML references in every attribute quoting mode", () => {
  const fixtures = [
    [String.raw`.\"`, 'class="&quot;"', '."'],
    [String.raw`.\'`, "class='&#39;'", ".'"],
    [String.raw`.\"`, "class=&#34;", '."'],
    [String.raw`.\=`, "class=&#61;", ".="],
    [String.raw`.\&`, 'class="&amp;"', ".&"],
    [String.raw`#\"`, 'id="&quot;"', '#"'],
    [String.raw`#\'`, "id='&#39;'", "#'"],
    [String.raw`#\<`, "id=&#60;", "#<"],
    [String.raw`#\=`, "id=&#61;", "#="],
  ];
  for (const [selector, attributes, canonical] of fixtures) {
    const source = html(`${selector}{color:red}`, attributes);
    const actual = comb(source, { uglify: true });
    equal(actual.result, source, "05.01");
    equal(actual.allInHead, [canonical], "05.02");
    equal(actual.allInBody, [canonical], "05.03");
    equal(actual.log.uglified, [[canonical, canonical]], "05.04");
    equal(actual.deletedFromBody, [], "05.05");
  }
});

test("06 - unchanged quoted selector values retain CSS string continuations", () => {
  for (const [attribute, marker, quote] of [
    ["class", ".", '"'],
    ["id", "#", "'"],
  ]) {
    for (const newline of ["\n", "\r\n"]) {
      const selector = `[${attribute}=${quote}a\\${newline}b${quote}]`;
      // Reserving "a" makes the allocator retain the two-character name "ab".
      const source = html(
        `${selector}{color:red}${marker}a{color:blue}`,
        `${attribute}="ab"`,
        `<i ${attribute}="a"></i>`,
      );
      const actual = comb(source, { uglify: true });
      equal(actual.result, source, "06.01");
      equal(actual.allInHead, [`${marker}a`, `${marker}ab`], "06.02");
      equal(actual.allInBody, [`${marker}a`, `${marker}ab`], "06.03");
      equal(
        actual.log.uglified.find(([name]) => name === `${marker}ab`),
        [`${marker}ab`, `${marker}ab`],
        "06.04",
      );
    }
  }
});

test("07 - mixed class replacements preserve unchanged escapes and separators", () => {
  const source = html(
    String.raw`[class="\31  newsletter"]{color:red}`,
    'class="1 newsletter"',
  );
  const actual = comb(source, { uglify: true });
  const mapping = new Map(actual.log.uglified);
  const changed = mapping.get(".newsletter");
  ok(changed && changed !== ".newsletter", "the long class has a replacement");
  equal(
    actual.result,
    html(
      `[class="\\31  ${changed.slice(1)}"]{color:red}`,
      `class="1 ${changed.slice(1)}"`,
    ),
    "07.01",
  );
  equal(
    actual.log.uglified.find(([name]) => name === ".1"),
    [".1", ".1"],
    "07.02",
  );
  equal(actual.allInHead, [".1", ".newsletter"], "07.03");
  equal(actual.allInBody, [".1", ".newsletter"], "07.04");
  equal(actual.deletedFromHead, [], "07.05");
  equal(actual.deletedFromBody, [], "07.06");
});

test("08 - replacement ranges retain encoded spaces between quoted class tokens", () => {
  const source = html(
    String.raw`[class="newsletter\20 footer"]{color:red}`,
    'class="newsletter footer"',
  );
  const actual = comb(source, { uglify: true });
  const mapping = new Map(actual.log.uglified);
  const newsletter = mapping.get(".newsletter");
  const footer = mapping.get(".footer");
  ok(
    newsletter && newsletter !== ".newsletter",
    "newsletter has a replacement",
  );
  ok(footer && footer !== ".footer", "footer has a replacement");
  equal(
    actual.result,
    html(
      `[class="${newsletter.slice(1)}\\20 ${footer.slice(1)}"]{color:red}`,
      `class="${newsletter.slice(1)} ${footer.slice(1)}"`,
    ),
    "08.01",
  );
  equal(actual.allInHead, [".footer", ".newsletter"], "08.02");
  equal(actual.allInBody, [".footer", ".newsletter"], "08.03");
});

test("09 - changed long names are written consistently in every CSS destination", () => {
  const fixtures = [
    [
      String.raw`.newsletter\,title`,
      ".",
      "class",
      "newsletter,title",
      (name) => `.${name}`,
    ],
    [
      String.raw`#newsletter\,title`,
      "#",
      "id",
      "newsletter,title",
      (name) => `#${name}`,
    ],
    [
      String.raw`[class=newsletter\,title]`,
      ".",
      "class",
      "newsletter,title",
      (name) => `[class=${name}]`,
    ],
    [
      String.raw`[class="newsletter\,title"]`,
      ".",
      "class",
      "newsletter,title",
      (name) => `[class="${name}"]`,
    ],
    [
      String.raw`[cl\61 ss~='newsletter\,title']`,
      ".",
      "class",
      "newsletter,title",
      (name) => `[cl\\61 ss~='${name}']`,
    ],
    [
      String.raw`[id=newsletter\,title]`,
      "#",
      "id",
      "newsletter,title",
      (name) => `[id=${name}]`,
    ],
    [
      String.raw`[id='newsletter\,title']`,
      "#",
      "id",
      "newsletter,title",
      (name) => `[id='${name}']`,
    ],
    [
      String.raw`[i\64="newsletter\,title"]`,
      "#",
      "id",
      "newsletter,title",
      (name) => `[i\\64="${name}"]`,
    ],
    [String.raw`.\31 23`, ".", "class", "123", (name) => `.${name}`],
    ['[class="123"]', ".", "class", "123", (name) => `[class="${name}"]`],
  ];
  for (const [selector, marker, attribute, name, rewritten] of fixtures) {
    const canonical = `${marker}${name}`;
    const source = html(`${selector}{color:red}`, `${attribute}="${name}"`);
    const actual = comb(source, { uglify: true });
    const mapped = new Map(actual.log.uglified).get(canonical);
    ok(mapped && mapped !== canonical, "the long name has a replacement");
    equal(
      actual.result,
      html(
        `${rewritten(mapped.slice(1))}{color:red}`,
        `${attribute}="${mapped.slice(1)}"`,
      ),
      "09.01",
    );
    equal(actual.allInHead, [canonical], "09.02");
    equal(actual.allInBody, [canonical], "09.03");
    equal(actual.log.uglified, [[canonical, mapped]], "09.04");
  }
});

test("10 - changing an escaped identifier preserves its following descendant separator", () => {
  const source = html(
    String.raw`.newsletter\31  a{color:red}`,
    'class="newsletter1"',
  );
  const actual = comb(source, { uglify: true });
  const mapped = new Map(actual.log.uglified).get(".newsletter1");
  ok(
    mapped && mapped !== ".newsletter1",
    "the escaped long name has a replacement",
  );
  equal(
    actual.result,
    html(`${mapped} a{color:red}`, `class="${mapped.slice(1)}"`),
    "10.01",
  );
  equal(actual.allInHead, [".newsletter1"], "10.02");
  equal(actual.allInBody, [".newsletter1"], "10.03");
});

test("11 - apparent attribute syntax inside CSS strings and HTML values stays unchanged", () => {
  const content = " class=' x; id=' x";
  const source = html(
    `.newsletter{content:"${content}"}`,
    `class="newsletter" title="${content}"`,
  );
  const actual = comb(source, { uglify: true });
  const mapped = new Map(actual.log.uglified).get(".newsletter");
  ok(mapped && mapped !== ".newsletter", "newsletter has a replacement");
  equal(
    actual.result,
    html(
      `${mapped}{content:"${content}"}`,
      `class="${mapped.slice(1)}" title="${content}"`,
    ),
    "11.01",
  );
  equal(actual.allInHead, [".newsletter"], "11.02");
  equal(actual.allInBody, [".newsletter"], "11.03");
});

test("12 - shortening two-character names emits valid numeric and punctuation selectors", () => {
  for (const [marker, attribute] of [
    [".", "class"],
    ["#", "id"],
  ]) {
    for (const [raw, canonical] of [
      [String.raw`\31 a`, "1a"],
      [String.raw`\000031a`, "1a"],
      [String.raw`-\31`, "-1"],
      [String.raw`\:x`, ":x"],
      [String.raw`\+x`, "+x"],
      [String.raw`\\x`, "\\x"],
      [String.raw`a\,`, "a,"],
    ]) {
      const source = html(
        `${marker}${raw}{color:red}`,
        `${attribute}="${canonical}"`,
      );
      const actual = comb(source, { uglify: true });
      const mapped = new Map(actual.log.uglified).get(`${marker}${canonical}`);
      equal(mapped, `${marker}${canonical[0]}`, "12.01");
      const css = actual.result.slice(7, actual.result.indexOf("</style>"));
      const token = readCssSelectorToken(css, 0);
      equal(token?.value, mapped, "12.02");
      equal(css.slice(token.range[1]), "{color:red}", "12.03");
      equal(
        actual.result.slice(actual.result.indexOf("<body>")),
        `<body><div ${attribute}="${mapped.slice(1)}">x</div></body>`,
        "12.04",
      );
      equal(actual.allInHead, [`${marker}${canonical}`], "12.05");
      equal(actual.allInBody, [`${marker}${canonical}`], "12.06");
    }
  }
});

test("13 - changed short attribute values retain CSS and HTML quoting semantics", () => {
  const fixtures = [
    [String.raw`[class=\31 a]`, ".1a", 'class="1a"'],
    [String.raw`[class="\31 a"]`, ".1a", 'class="1a"'],
    [String.raw`[cl\61 ss~='\:x']`, ".:x", 'class=":x"'],
    [String.raw`[id=-\31]`, "#-1", 'id="-1"'],
    [String.raw`[i\64="\\x"]`, "#\\x", 'id="\\x"'],
    [String.raw`[class='\'x']`, ".'x", "class=&#39;x"],
    [String.raw`[class="\"x"]`, '."x', "class=&#34;x"],
    [String.raw`[id='\'x']`, "#'x", "id='&#39;x'"],
    [String.raw`[class=\=x]`, ".=x", "class=&#61;x"],
    ["[id=\\`x]", "#`x", "id=&#96;x"],
  ];
  for (const [selector, canonical, attributes] of fixtures) {
    const source = html(`${selector}{color:red}`, attributes);
    const actual = comb(source, { uglify: true });
    const mapped = new Map(actual.log.uglified).get(canonical);
    equal(mapped, canonical.slice(0, 2), "13.01");
    const css = actual.result.slice(7, actual.result.indexOf("</style>"));
    const prelude = css.slice(0, css.indexOf("{"));
    equal(
      extractCssSelectorTokens(prelude).map(({ value }) => value),
      [mapped],
      "13.02",
    );
    equal(css.slice(css.indexOf("{")), "{color:red}", "13.03");
    const body = actual.result.slice(actual.result.indexOf("<body>"));
    const attribute =
      /^<body><div (?:class|id)=(?:"([^"]*)"|'([^']*)'|([^\t\n\f\r "'`=<>]+))>x<\/div><\/body>$/.exec(
        body,
      );
    ok(attribute, "the rewritten body remains one valid attribute");
    equal(
      decode(attribute[1] ?? attribute[2] ?? attribute[3], {
        context: "attribute",
      }),
      mapped.slice(1),
      "13.04",
    );
    equal(actual.allInHead, [canonical], "13.05");
    equal(actual.allInBody, [canonical], "13.06");
  }
});

test("14 - numeric replacements retain the following descendant separator", () => {
  for (const htmlCrushOpts of [
    undefined,
    {
      removeIndentations: false,
      removeLineBreaks: false,
      lineLengthLimit: 0,
    },
  ]) {
    const source = html(String.raw`.\31 a a{color:red}`, 'class="1a"');
    const actual = comb(source, {
      uglify: true,
      ...(htmlCrushOpts ? { htmlCrushOpts } : {}),
    });
    const mapped = new Map(actual.log.uglified).get(".1a");
    equal(mapped, ".1", "14.01");
    const css = actual.result.slice(7, actual.result.indexOf("</style>"));
    const token = readCssSelectorToken(css, 0);
    equal(
      token,
      { value: mapped, raw: String.raw`.\31 `, range: [0, 5] },
      "14.02",
    );
    equal(css.slice(token.range[1]), " a{color:red}", "14.03");
    equal(
      actual.result.slice(actual.result.indexOf("<body>")),
      `<body><div class="${mapped.slice(1)}">x</div></body>`,
      "14.04",
    );
    equal(actual.allInHead, [".1a"], "14.05");
    equal(actual.allInBody, [".1a"], "14.06");
  }
});

test.run();
