import { test } from "uvu";
import { equal, ok } from "uvu/assert";

import { comb } from "../dist/email-comb.esm.js";

function html(css, body) {
  return `<style>${css}</style>${body}`;
}

test("01 - preserve a class used by an explicit nested descendant rule", () => {
  const source = html(
    ".used{color:red;& .child{color:blue}}",
    '<div class="used"><span class="child">text</span></div>',
  );
  const actual = comb(source);
  equal(actual.result, source, "01.01");
  equal(actual.allInHead, [".child", ".used"], "01.02");
  equal(actual.allInBody, [".child", ".used"], "01.03");
  equal(actual.deletedFromHead, [], "01.04");
  equal(actual.deletedFromBody, [], "01.05");
  equal(actual.countBeforeCleaning, 2, "01.06");
  equal(actual.countAfterCleaning, 2, "01.07");
});

test("02 - uglify parent and nested descendant names consistently", () => {
  const actual = comb(
    html(
      ".newsletter{color:red;& .newsletter-title{color:blue}}",
      '<div class="newsletter"><span class="newsletter-title">text</span></div>',
    ),
    { uglify: true },
  );
  const names = new Map(actual.log.uglified);
  const parent = names.get(".newsletter");
  const child = names.get(".newsletter-title");
  ok(parent && parent !== ".newsletter", "the parent name is shortened");
  ok(child && child !== ".newsletter-title", "the child name is shortened");
  equal(
    actual.result,
    html(
      `${parent}{color:red;& ${child}{color:blue}}`,
      `<div class="${parent.slice(1)}"><span class="${child.slice(1)}">text</span></div>`,
    ),
    "02.01",
  );
  equal(actual.allInHead, [".newsletter", ".newsletter-title"], "02.02");
  equal(actual.allInBody, [".newsletter", ".newsletter-title"], "02.03");
  equal(actual.deletedFromHead, [], "02.04");
  equal(actual.deletedFromBody, [], "02.05");
});

test("03 - retain multiple nesting levels and declarations after nested rules", () => {
  const source = html(
    ".root{color:red;& .middle{color:blue;& .leaf{color:green}display:block}padding:0}",
    '<div class="root"><div class="middle"><span class="leaf">text</span></div></div>',
  );
  const actual = comb(source);
  equal(actual.result, source, "03.01");
  equal(actual.allInHead, [".leaf", ".middle", ".root"], "03.02");
  equal(actual.deletedFromHead, [], "03.03");
  equal(actual.deletedFromBody, [], "03.04");
});

test("04 - preserve nested alternatives conservatively and prune ordinary siblings", () => {
  const retained = ".parent{& .child,& .absent{color:red}color:blue}";
  const body =
    '<div class="parent"><span class="child stray">text</span></div>';
  const actual = comb(html(`${retained}.unused{color:green}`, body));
  equal(
    actual.result,
    html(retained, '<div class="parent"><span class="child">text</span></div>'),
    "04.01",
  );
  equal(actual.allInHead, [".absent", ".child", ".parent", ".unused"], "04.02");
  equal(actual.allInBody, [".child", ".parent", ".stray"], "04.03");
  equal(actual.deletedFromHead, [".unused"], "04.04");
  equal(actual.deletedFromBody, [".stray"], "04.05");
});

test("05 - preserve absent parent alternatives that affect nesting specificity", () => {
  const source = html(
    ".parent,#absent{& .child{color:red}}",
    '<div class="parent"><span class="child">text</span></div>',
  );
  const actual = comb(source);
  equal(actual.result, source, "05.01");
  equal(actual.allInHead, [".child", ".parent", "#absent"], "05.02");
  equal(actual.deletedFromHead, [], "05.03");
  equal(actual.deletedFromBody, [], "05.04");
});

test("06 - nested conditionals retain declarations and their nested selectors", () => {
  const source = html(
    ".parent{color:red;@media(width>1px){color:blue;@supports(display:grid){& .child{display:grid}padding:0}margin:0}background:white}",
    '<div class="parent"><span class="child">text</span></div>',
  );
  const actual = comb(source);
  equal(actual.result, source, "06.01");
  equal(actual.allInHead, [".child", ".parent"], "06.02");
  equal(actual.deletedFromHead, [], "06.03");
  equal(actual.deletedFromBody, [], "06.04");
});

test("07 - implicit and relative nested selectors retain their classes", () => {
  for (const selector of [
    ".child",
    "> .child",
    "+ .child",
    "~ .child",
    "span.child",
    "span:hover .child",
    "span:is(.child)",
  ]) {
    const source = html(
      `.parent{${selector}{color:red}}`,
      '<div class="parent"><span class="child">text</span></div>',
    );
    const actual = comb(source);
    equal(actual.result, source, "07.01");
    equal(actual.allInHead, [".child", ".parent"], "07.02");
    equal(actual.deletedFromBody, [], "07.03");
  }
});

test("08 - functional selectors inside nesting retain alternatives and exclusions", () => {
  for (const selector of [
    "& :is(.child,.absent)",
    "& :where(.child,.absent)",
    "& .child:not(.absent)",
    "&:has(.child,.absent)",
  ]) {
    const source = html(
      `.parent{${selector}{color:red}}`,
      '<div class="parent"><span class="child">text</span></div>',
    );
    const actual = comb(source);
    equal(actual.result, source, "08.01");
    equal(actual.allInHead, [".absent", ".child", ".parent"], "08.02");
    equal(actual.deletedFromHead, [], "08.03");
    equal(actual.deletedFromBody, [], "08.04");
  }
});

test("09 - class and ID attribute selectors inside nesting share the canonical inventory", () => {
  const source = html(
    '.parent{& [class~="child"][id="detail"][data-note=".fake,#ghost{}"]{color:red}}',
    '<div class="parent"><span class="child" id="detail">text</span></div>',
  );
  const actual = comb(source);
  equal(actual.result, source, "09.01");
  equal(actual.allInHead, [".child", ".parent", "#detail"], "09.02");
  equal(actual.allInBody, [".child", ".parent", "#detail"], "09.03");
  equal(actual.deletedFromBody, [], "09.04");
});

test("10 - escaped nested identifiers and attribute selectors uglify consistently", () => {
  const actual = comb(
    html(
      String.raw`.newsletter{& .newsletter\,title[cl\61 ss~="newsletter\,title"][id="newsletter-detail"]{color:red}}`,
      '<div class="newsletter"><span class="newsletter,title" id="newsletter-detail">text</span></div>',
    ),
    { uglify: true },
  );
  const names = new Map(actual.log.uglified);
  const parent = names.get(".newsletter");
  const child = names.get(".newsletter,title");
  const id = names.get("#newsletter-detail");
  ok(parent && child && id, "every canonical nested name has a legend entry");
  equal(
    actual.result,
    html(
      `${parent}{& ${child}[cl\\61 ss~="${child.slice(1)}"][id="${id.slice(1)}"]{color:red}}`,
      `<div class="${parent.slice(1)}"><span class="${child.slice(1)}" id="${id.slice(1)}">text</span></div>`,
    ),
    "10.01",
  );
  equal(
    actual.allInHead,
    [".newsletter", ".newsletter,title", "#newsletter-detail"],
    "10.02",
  );
  equal(actual.deletedFromHead, [], "10.03");
  equal(actual.deletedFromBody, [], "10.04");
});

test("11 - declaration strings URLs and custom-property blocks are not nested selectors", () => {
  const retained =
    '.parent{content:"& .fake{#ghost}";background:url(foo}.url-fake{bar);--theme:{.property-fake{color:red}};& .child{color:blue}--other:fn({.function-fake});color:green}';
  const actual = comb(
    html(
      `${retained}.unused{color:red}`,
      '<div class="parent"><span class="child fake property-fake function-fake">text</span></div>',
    ),
  );
  equal(
    actual.result,
    html(retained, '<div class="parent"><span class="child">text</span></div>'),
    "11.01",
  );
  equal(actual.allInHead, [".child", ".parent", ".unused"], "11.02");
  equal(actual.deletedFromHead, [".unused"], "11.03");
  equal(
    actual.deletedFromBody,
    [".fake", ".function-fake", ".property-fake"],
    "11.04",
  );
});

test("12 - comment removal leaves nested selectors and their token boundaries intact", () => {
  const source = html(
    ".parent{color:red;/* before */& .child{/* inside */color:blue}/* after */padding:0}",
    '<div class="parent"><span class="child">text</span></div>',
  );
  const actual = comb(source);
  equal(
    actual.result,
    html(
      ".parent{color:red;& .child{color:blue}padding:0}",
      '<div class="parent"><span class="child">text</span></div>',
    ),
    "12.01",
  );
  equal(actual.allInHead, [".child", ".parent"], "12.02");
  equal(comb(source, { removeCSSComments: false }).result, source, "12.03");
});

test("13 - independent style regions retain nested names without hiding ordinary rules", () => {
  const source =
    '<style>.parent{& .child{color:red}}</style><div class="parent"><span class="child sibling stray">text</span></div><style>.sibling{color:blue}.unused{color:green}</style>';
  const actual = comb(source);
  equal(
    actual.result,
    '<style>.parent{& .child{color:red}}</style><div class="parent"><span class="child sibling">text</span></div><style>.sibling{color:blue}</style>',
    "13.01",
  );
  equal(
    actual.allInHead,
    [".child", ".parent", ".sibling", ".unused"],
    "13.02",
  );
  equal(actual.deletedFromHead, [".unused"], "13.03");
  equal(actual.deletedFromBody, [".stray"], "13.04");
});

test("14 - whitelist names remain unchanged while other nested names uglify", () => {
  const actual = comb(
    html(
      ".newsletter{& .newsletter-title{color:red}}",
      '<div class="newsletter"><span class="newsletter-title">text</span></div>',
    ),
    { uglify: true, whitelist: [".newsletter-title"] },
  );
  const parent = new Map(actual.log.uglified).get(".newsletter");
  ok(parent && parent !== ".newsletter", "the unprotected parent is shortened");
  equal(
    actual.result,
    html(
      `${parent}{& .newsletter-title{color:red}}`,
      `<div class="${parent.slice(1)}"><span class="newsletter-title">text</span></div>`,
    ),
    "14.01",
  );
  equal(actual.deletedFromHead, [], "14.02");
  equal(actual.deletedFromBody, [], "14.03");
});

test("15 - repeated processing preserves nested CSS and transformed HTML", () => {
  const source = html(
    ".newsletter{& .newsletter-title{color:red}}.unused{color:blue}",
    '<div class="newsletter"><span class="newsletter-title stray">text</span></div>',
  );
  for (const uglify of [false, true]) {
    const first = comb(source, { uglify });
    const second = comb(first.result, { uglify });
    equal(second.result, first.result, "15.01");
    equal(second.deletedFromHead, [], "15.02");
    equal(second.deletedFromBody, [], "15.03");
  }
});

test("16 - supports selector queries do not apply the names they inspect", () => {
  const retained = ".parent{@supports selector(.probe){& .child{color:red}}}";
  const actual = comb(
    html(
      retained,
      '<div class="parent probe"><span class="child">text</span></div>',
    ),
  );
  equal(
    actual.result,
    html(retained, '<div class="parent"><span class="child">text</span></div>'),
    "16.01",
  );
  equal(actual.allInHead, [".child", ".parent"], "16.02");
  equal(actual.allInBody, [".child", ".parent", ".probe"], "16.03");
  equal(actual.deletedFromBody, [".probe"], "16.04");
});

test("17 - named layers and container groups retain nested rules and synchronize uglification", () => {
  for (const group of [
    "@layer newsletter",
    "@container newsletter (width>1px)",
    "@starting-style",
  ]) {
    const source = html(
      `${group}{.newsletter{& .newsletter-title{color:red}}}`,
      '<div class="newsletter"><span class="newsletter-title">text</span></div>',
    );
    equal(comb(source).result, source, "17.01");
    const actual = comb(source, { uglify: true });
    const names = new Map(actual.log.uglified);
    const parent = names.get(".newsletter");
    const child = names.get(".newsletter-title");
    ok(parent && child, "all nested selector names have legend entries");
    equal(
      actual.result,
      html(
        `${group}{${parent}{& ${child}{color:red}}}`,
        `<div class="${parent.slice(1)}"><span class="${child.slice(1)}">text</span></div>`,
      ),
      "17.02",
    );
    equal(actual.allInHead, [".newsletter", ".newsletter-title"], "17.03");
    equal(actual.deletedFromBody, [], "17.04");
  }
});

test("18 - top-level scope bounds are applying selectors and uglify with HTML", () => {
  const source = html(
    "@scope (.newsletter-root) to (.newsletter-limit){.newsletter{& .newsletter-title{color:red}}}",
    '<div class="newsletter-root newsletter"><span class="newsletter-title newsletter-limit">text</span></div>',
  );
  equal(comb(source).result, source, "18.01");
  const actual = comb(source, { uglify: true });
  const names = new Map(actual.log.uglified);
  const root = names.get(".newsletter-root");
  const limit = names.get(".newsletter-limit");
  const parent = names.get(".newsletter");
  const child = names.get(".newsletter-title");
  ok(
    root && limit && parent && child,
    "scope and nested names are inventoried",
  );
  equal(
    actual.result,
    html(
      `@scope (${root}) to (${limit}){${parent}{& ${child}{color:red}}}`,
      `<div class="${root.slice(1)} ${parent.slice(1)}"><span class="${child.slice(1)} ${limit.slice(1)}">text</span></div>`,
    ),
    "18.02",
  );
  equal(
    actual.allInHead,
    [
      ".newsletter",
      ".newsletter-limit",
      ".newsletter-root",
      ".newsletter-title",
    ],
    "18.03",
  );
  equal(actual.deletedFromHead, [], "18.04");
  equal(actual.deletedFromBody, [], "18.05");
});

test("19 - scope bounds nested inside a style rule retain and uglify their names", () => {
  const source = html(
    ".newsletter{@scope (.newsletter-root) to (.newsletter-limit){& .newsletter-title{color:red}}}",
    '<div class="newsletter newsletter-root"><span class="newsletter-title newsletter-limit">text</span></div>',
  );
  equal(comb(source).result, source, "19.01");
  const actual = comb(source, { uglify: true });
  const names = new Map(actual.log.uglified);
  const root = names.get(".newsletter-root");
  const limit = names.get(".newsletter-limit");
  const parent = names.get(".newsletter");
  const child = names.get(".newsletter-title");
  ok(
    root && limit && parent && child,
    "nested scope names have legend entries",
  );
  equal(
    actual.result,
    html(
      `${parent}{@scope (${root}) to (${limit}){& ${child}{color:red}}}`,
      `<div class="${parent.slice(1)} ${root.slice(1)}"><span class="${child.slice(1)} ${limit.slice(1)}">text</span></div>`,
    ),
    "19.02",
  );
  equal(actual.deletedFromBody, [], "19.03");
});

test("20 - nested rules inside ordinary conditional groups coexist with pruned siblings", () => {
  for (const group of [
    "@media screen",
    "@supports(display:grid)",
    '@document url("https://example.com")',
  ]) {
    const actual = comb(
      html(
        `${group}{.parent{& .child{color:red}}.unused{color:blue}}`,
        '<div class="parent"><span class="child">text</span></div>',
      ),
    );
    equal(
      actual.result,
      html(
        `${group}{.parent{& .child{color:red}}}`,
        '<div class="parent"><span class="child">text</span></div>',
      ),
      "20.01",
    );
    equal(actual.allInHead, [".child", ".parent", ".unused"], "20.02");
    equal(actual.deletedFromHead, [".unused"], "20.03");
    equal(actual.deletedFromBody, [], "20.04");
  }
});

test("21 - a negated nesting selector can match when its parent name is absent", () => {
  const source = html(
    ".absent{:not(&) .child{color:red}}",
    '<div><span class="child">text</span></div>',
  );
  const actual = comb(source);
  equal(actual.result, source, "21.01");
  equal(actual.allInHead, [".absent", ".child"], "21.02");
  equal(actual.allInBody, [".child"], "21.03");
  equal(actual.deletedFromHead, [], "21.04");
  equal(actual.deletedFromBody, [], "21.05");
});

test("22 - sole brace declaration values and important annotations remain opaque", () => {
  for (const declaration of [
    "--theme:{.fake{color:red}}",
    "--theme:{.fake{color:red}}!important",
    "--theme:{.fake{color:red}}{}!IMPORTANT",
    String.raw`--t\68 eme:{.fake{color:red}}!important`,
    "arbitrary:{.fake{color:red}}",
    "arbitrary:{.fake{color:red}}!important",
    "arbitrary:{.fake{color:red}}!IMPORTANT",
  ]) {
    const css = `.parent{${declaration};& .child{color:blue}}`;
    const actual = comb(
      html(
        css,
        '<div class="parent"><span class="child fake">text</span></div>',
      ),
    );
    equal(
      actual.result,
      html(css, '<div class="parent"><span class="child">text</span></div>'),
      "22.01",
    );
    equal(actual.allInHead, [".child", ".parent"], "22.02");
    equal(actual.deletedFromBody, [".fake"], "22.03");
  }
});

test("23 - stylesheet CDO and CDC markers do not conceal nested rule preludes", () => {
  for (const css of [
    "<!-- .parent{& .child{color:red}} -->",
    "<!--.parent{& .child{color:red}}-->",
    "-->.parent{& .child{color:red}}<!--",
  ]) {
    const source = html(
      css,
      '<div class="parent"><span class="child">text</span></div>',
    );
    const actual = comb(source);
    equal(actual.result, source, "23.01");
    equal(actual.allInHead, [".child", ".parent"], "23.02");
    equal(actual.deletedFromBody, [], "23.03");
  }
});

test("24 - unclosed nested blocks stop at the HTML style boundary", () => {
  for (const css of [
    ".parent{& .child{color:red}",
    ".parent{& .child{color:red",
  ]) {
    const actual = comb(
      `${html(css, '<div class="parent"><span class="child sibling stray">text</span></div>')}<style>.sibling{color:green}.unused{color:blue}</style>`,
    );
    equal(
      actual.result,
      `${html(css, '<div class="parent"><span class="child sibling">text</span></div>')}<style>.sibling{color:green}</style>`,
      "24.01",
    );
    equal(
      actual.allInHead,
      [".child", ".parent", ".sibling", ".unused"],
      "24.02",
    );
    equal(actual.deletedFromHead, [".unused"], "24.03");
    equal(actual.deletedFromBody, [".stray"], "24.04");
  }
});

test.run();
