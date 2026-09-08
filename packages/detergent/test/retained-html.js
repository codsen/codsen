import { test } from "uvu";
import { equal } from "uvu/assert";

import { det, opts } from "../dist/detergent.esm.js";

const disabledBooleans = Object.fromEntries(
  Object.entries(opts)
    .filter(([, value]) => typeof value === "boolean")
    .map(([key]) => [key, false]),
);

test("001 - preserves CSS escape whitespace in a default retained tag", () => {
  const source = String.raw`<b style="font-family:'\31  a'">x</b>`;

  equal(det(source).res, source, "001.01");
});

test("002 - preserves a single CSS escape terminator without adding spaces", () => {
  const source = String.raw`<b style="font-family:'\31 a'">x</b>`;

  equal(det(source).res, source, "002.01");
});

test("003 - does not repair prose-like entities inside CSS attributes", () => {
  const source = String.raw`<b style="font-family:'\26 amp;'">x</b>`;

  equal(det(source).res, source, "003.01");
  equal(det(source, { fixBrokenEntities: false }).res, source, "003.02");
});

test("004 - preserves the raw CSS of explicitly retained style elements", () => {
  const source = String.raw`<style>.a\31  a{content:"a  b &amp;";font-family:'\26 amp;'}</style><b>x</b>`;

  equal(
    det(source, { stripHtmlButIgnoreTags: ["style", "b"] }).res,
    source,
    "004.01",
  );
});

test("005 - all disabled booleans still preserve retained attribute values", () => {
  const source = String.raw`<b style="font-family:'\31  a';content:'a  b'">x</b>`;

  equal(det(source, disabledBooleans).res, source, "005.01");
});

test("006 - disabling HTML stripping preserves arbitrary tag attributes", () => {
  const source = String.raw`<section style="font-family:'\31  a';content:'a &amp; b'">x</section>`;

  equal(det(source, { stripHtml: false }).res, source, "006.01");
});

test("007 - preliminary cleanup cannot change retained attribute bytes", () => {
  const values = [
    "\u001b[31mred\u001b[0m",
    "a\u200ab",
    "can\ufffdt",
    "&amp;quot; &quot; &#34; amp;",
    "a\r\n\r\n\r\nb",
    "can't  ... -- word:word",
  ];
  const results = values.map((value) => {
    const source = `<b title="${value}">x</b>`;
    return det(source).res === source;
  });

  equal(
    results,
    values.map(() => true),
    "007.01",
  );
});

test("008 - retained style raw text survives every later prose cleanup stage", () => {
  const css = `.x{content:"\u001b[31mcan\ufffdt\u200a  amp; &amp; ..."}\r\n\r\n\r\n.a\\31  a{color:red}`;
  const source = `<style>${css}</style><b>x</b>`;
  const actual = det(source, {
    stripHtmlButIgnoreTags: ["style", "b"],
    replaceLineBreaks: true,
    removeLineBreaks: true,
    eol: "crlf",
  });

  equal(actual.res, source, "008.01");
});

test("009 - invokes the callback once per real prose slice without exposing CSS", () => {
  const opening = String.raw`<b title="two  three" style="font-family:'\31  a'">`;
  const style = String.raw`<style>.private{content:"hidden  CSS &amp;"}</style>`;
  const seen = [];
  const actual = det(`one${opening}four</b>${style}five`, {
    stripHtmlButIgnoreTags: ["b", "style"],
    removeWidows: false,
    cb: (value) => {
      seen.push(value);
      return value.toUpperCase();
    },
  });

  equal(seen, ["one", "four", "five"], "009.01");
  equal(actual.res, `ONE${opening}FOUR</b>${style}FIVE`, "009.02");
});

test("010 - opaque-looking user text and callback results cannot collide with markup", () => {
  const marker = "__detergent_opaque_0__\ue0000\ue001";
  const opening = `<b title="${marker}">`;
  const seen = [];
  const actual = det(`${marker}${opening}x</b>`, {
    ...disabledBooleans,
    cb: (value) => {
      seen.push(value);
      return value === "x" ? marker : value;
    },
  });

  equal(seen, [marker, "x"], "010.01");
  equal(actual.res, `${marker}${opening}${marker}</b>`, "010.02");
});

test("011 - protects retained markup introduced by a callback in subsequent stages", () => {
  const replacements = [
    String.raw`<b style="font-family:'\31  a'">y</b>`,
    String.raw`<style>.a\31  a{content:"a  b &amp;"}</style>`,
  ];
  const results = replacements.map((replacement) => {
    let calls = 0;
    const actual = det("x", {
      stripHtmlButIgnoreTags: ["b", "style"],
      cb: () => {
        calls++;
        return replacement;
      },
    });
    return [actual.res === replacement, calls];
  });

  equal(
    results,
    replacements.map(() => [true, 1]),
    "011.01",
  );
});

test("012 - ordinary prose still receives its requested typography cleanup", () => {
  const opening = String.raw`<b title="can't  ... -- amp;" style="font-family:'\31  a'">`;
  const prose = 'He said "hello"... I can\'t  wait.';
  const options = { removeWidows: false };
  const expectedProse = det(prose, options).res;
  const actual = det(`${opening}${prose}</b>`, options);

  equal(expectedProse === prose, false, "012.01");
  equal(actual.res, `${opening}${expectedProse}</b>`, "012.02");
});

test("013 - ANSI removal and hair-space cleanup still apply to prose", () => {
  const opening = '<b title="\u001b[31mred\u200atext\u001b[0m">';
  const actual = det(`${opening}\u001b[31mred\u001b[0m\u200atext</b>`, {
    removeWidows: false,
  });

  equal(actual.res, `${opening}red text</b>`, "013.01");
});

test("014 - widow processing retains its context across inline tags", () => {
  const source = 'one two three four<a title="x  y &amp;">link</a>';

  equal(
    det(source, { stripHtml: false }).res,
    'one two three&nbsp;four<a title="x  y &amp;">link</a>',
    "014.01",
  );
});

test("015 - XHTML normalization changes tag syntax without rewriting attributes", () => {
  const source = String.raw`a<br style="font-family:'\31  a'" title="amp;  &amp;">b`;

  equal(
    det(source, { useXHTML: true }).res,
    String.raw`a<br style="font-family:'\31  a'" title="amp;  &amp;"/>b`,
    "015.01",
  );
  equal(det(source, { useXHTML: false }).res, source, "015.02");
});

test("016 - retains existing malformed void-tag normalization", () => {
  const source = String.raw`a< / / br style="font-family:'\31  a'" / />b`;

  equal(
    det(source, { useXHTML: true }).res,
    String.raw`a<br style="font-family:'\31  a'"/>b`,
    "016.01",
  );
  equal(
    det(source, { useXHTML: false }).res,
    String.raw`a<br style="font-family:'\31  a'">b`,
    "016.02",
  );
});

test("017 - protected markup alone does not activate prose options", () => {
  const values = [
    '<b title="amp; can\ufffdt ... -- word:word\nword">x</b>',
    '<style>.x{content:"amp; can\ufffdt ... -- word:word\nword"}</style>',
  ];
  const proseKeys = [
    "fixBrokenEntities",
    "removeWidows",
    "convertEntities",
    "convertDashes",
    "convertApostrophes",
    "replaceLineBreaks",
    "removeLineBreaks",
    "addMissingSpaces",
    "convertDotsToEllipsis",
  ];
  const results = values.map((source) => {
    const actual = det(source, { stripHtmlButIgnoreTags: ["b", "style"] });
    return [
      proseKeys.map((key) => actual.applicableOpts[key]),
      actual.applicableOpts.stripHtml,
    ];
  });

  equal(
    results,
    values.map(() => [proseKeys.map(() => false), true]),
    "017.01",
  );
});

test("018 - applicable entity repair is still reported for eligible prose", () => {
  const results = [false, true].map(
    (fixBrokenEntities) =>
      det('<b title="amp;">x amp; y</b>', { fixBrokenEntities }).applicableOpts
        .fixBrokenEntities,
  );

  equal(results, [true, true], "018.01");
});

test("019 - discarded style contents stay excluded from prose callbacks", () => {
  const source = String.raw`<style>.a\31  a{content:"discarded  CSS"}</style><b>x</b>`;
  const seen = [];
  const actual = det(source, {
    cb: (value) => {
      seen.push(value);
      return value;
    },
  });

  equal(actual.res, "<b>x</b>", "019.01");
  equal(seen, ["x"], "019.02");
});

test("020 - arbitrary backslashes in prose are not CSS-decoded", () => {
  const source = String.raw`copy \61 now`;

  equal(det(source, disabledBooleans).res, source, "020.01");
});

test("021 - apparent unfinished HTML inside CSS cannot consume following real tags", () => {
  const style = `<style>b::before{content:"<b title='";}</style>`;
  const results = [false, true].map((useXHTML) => {
    const actual = det(`${style}<p>one</p><br title="two  three"><b>x</b>`, {
      stripHtmlButIgnoreTags: ["style", "b", "br"],
      useXHTML,
    }).res;
    return [
      actual.startsWith(style),
      actual.includes("<p>"),
      actual.includes("</p>"),
      actual.includes("one"),
      actual.includes(`<br title="two  three"${useXHTML ? "/" : ""}>`),
      actual.endsWith("<b>x</b>"),
    ];
  });

  equal(
    results,
    [false, true].map(() => [true, false, false, true, true, true]),
    "021.01",
  );
});

test.run();
