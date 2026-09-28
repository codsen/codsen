// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { comb } from "./util/util.js";

// bracket notation
// -----------------------------------------------------------------------------

test(`01 - bracket notation - classes`, () => {
  let source = `<head>
<style type="text/css">
  a[class="used"]{x:1;}
  b[class="unused1"]{y:2;}
</style>
</head>
<body class="used"><a class="used unused2">z</a>
</body>
`;

  // pruning "unused2" would leave class="used", which a[class="used"] would
  // then start to match, so the anchor keeps its class list as it is
  let intended = `<head>
<style type="text/css">
  a[class="used"]{x:1;}
</style>
</head>
<body class="used"><a class="used unused2">z</a>
</body>
`;

  equal(comb(source).result, intended, "01.01");
});

test(`02 - bracket notation - bracket notation - id's`, () => {
  let source = `<head>
<style type="text/css">
  a[id="used"]{x:1;}
  b[id="unused1"]{y:2;}
</style>
</head>
<body id="used"><a id="used unused2">z</a>
</body>
`;

  let intended = `<head>
<style type="text/css">
  a[id="used"]{x:1;}
</style>
</head>
<body id="used"><a>z</a>
</body>
`;

  equal(comb(source).result, intended, "02.01");
});

test("03 - HTML-style class and ID attribute selectors", () => {
  let membership =
    '<style>a[class~=_used]{x:1}</style><body><a class="_used"></a></body>';
  let multipleClasses =
    '<style>a[class="used extra"]{x:1}</style><body><a class="used extra"></a></body>';
  let hyphenClass =
    '<style>a[class=-used]{x:1}</style><body><a class="-used"></a></body>';
  let underscoreId =
    '<style>a[id=_used]{x:1}</style><body><a id="_used"></a></body>';

  equal(comb(membership).result, membership, "03.01");
  equal(
    comb(membership, { uglify: true }).result,
    '<style>a[class~=c]{x:1}</style><body><a class="c"></a></body>',
    "03.02",
  );
  equal(comb(multipleClasses).result, multipleClasses, "03.03");
  equal(
    comb(multipleClasses, { uglify: true }).result,
    '<style>a[class="l w"]{x:1}</style><body><a class="l w"></a></body>',
    "03.04",
  );
  equal(comb(hyphenClass).result, hyphenClass, "03.05");
  equal(
    comb(hyphenClass, { uglify: true }).result,
    '<style>a[class=e]{x:1}</style><body><a class="e"></a></body>',
    "03.06",
  );
  equal(comb(underscoreId).result, underscoreId, "03.07");
  equal(
    comb(underscoreId, { uglify: true }).result,
    '<style>a[id=r]{x:1}</style><body><a id="r"></a></body>',
    "03.08",
  );
  equal(
    comb("<style>a[class=é]{x:1}</style><body></body>").result,
    "<body></body>",
    "03.09",
  );
});

// attribute selectors which read the raw class or id value
// -----------------------------------------------------------------------------

test("04 - presence selectors retain the attribute they match", () => {
  for (const [selector, html] of [
    ["[class]", "<p class=foo>x</p>"],
    ["[class]", '<p class="">x</p>'],
    ["[class]", "<p class=>x</p>"],
    ["[class]", '<p class="foo unused">x</p>'],
    ["[CLASS]", "<p class=foo>x</p>"],
    ["[ class ]", "<p class=foo>x</p>"],
    ["[|class]", "<p class=foo>x</p>"],
    ["[*|class]", "<p class=foo>x</p>"],
    ["[id]", "<p id=foo>x</p>"],
  ]) {
    const source = `<style>${selector}{color:red}</style>${html}`;
    equal(comb(source).result, source, "04.01");
    equal(comb(source, { uglify: true }).result, source, "04.02");
  }
  // the attribute survives the pruning of its other classes, so the
  // presence selector goes on matching it either way
  equal(
    comb('<style>[class]{color:red}.a{x:1}</style><p class="a unused">x</p>')
      .result,
    '<style>[class]{color:red}.a{x:1}</style><p class="a">x</p>',
    "04.03",
  );
});

test("05 - substring and case-insensitive selectors retain the values they read", () => {
  for (const [selector, html] of [
    ["[class^=foo]", "<p class=foobar>x</p>"],
    ["[class^=foo]", '<p class="bar foobar">x</p>'],
    ["[class$=bar]", "<p class=foobar>x</p>"],
    ["[class*=oob]", "<p class=foobar>x</p>"],
    ["[class|=foo]", "<p class=foo-bar>x</p>"],
    ["[class^=FOO i]", "<p class=foobar>x</p>"],
    ['[class="foo" i]', "<p class=FOO>x</p>"],
    ["[class~=foo i]", "<p class=FOO>x</p>"],
    ["[/**/class^=foo]", "<p class=foobar>x</p>"],
    ["[class/**/^=foo]", "<p class=foobar>x</p>"],
    ["[class^=/**/foo]", "<p class=foobar>x</p>"],
    [String.raw`[cl\61 ss^=foo]`, "<p class=foobar>x</p>"],
    ["[ns|class^=foo]", "<p class=foobar>x</p>"],
    ["[id^=foo]", "<p id=foobar>x</p>"],
    ["[id$=bar]", "<p id=foobar>x</p>"],
  ]) {
    const source = `<style>${selector}{color:red}</style>${html}`;
    equal(comb(source).result, source, "05.01");
    equal(comb(source, { uglify: true }).result, source, "05.02");
  }
});

test("06 - exact class equality must not gain a match after pruning", () => {
  const source =
    '<style>[class=foo]{color:red}</style><p class="foo unused">x</p>';
  equal(comb(source).result, source, "06.01");
  equal(comb(source, { uglify: true }).result, source, "06.02");
  const caseInsensitive =
    '<style>[class="FOO" i]{color:red}</style><p class="foo unused">x</p>';
  equal(comb(caseInsensitive).result, caseInsensitive, "06.03");
});

test("07 - selectors which cannot match leave unused names to go", () => {
  for (const [selector, html] of [
    ["[class^=zzz]", "<p class=foobar>x</p>"],
    ["[class^='']", "<p class=foobar>x</p>"],
    ["[class|=zzz]", "<p class=foobar>x</p>"],
    ["[id^=zzz]", "<p id=foobar>x</p>"],
    ["[data-x]", "<p class=foobar>x</p>"],
    ["[class^]", "<p class=foobar>x</p>"],
    ["[class^=1]", "<p class=foobar>x</p>"],
    ["[class^=foo x]", "<p class=foobar>x</p>"],
    ["[class!=foo]", "<p class=foobar>x</p>"],
  ]) {
    const source = `<style>${selector}{color:red}</style>${html}`;
    equal(
      comb(source).result,
      `<style>${selector}{color:red}</style><p>x</p>`,
      "07.01",
    );
  }
  // a token-shaped selector goes with its unused class, and the emptied
  // style element with it
  equal(
    comb("<style>[class=foo]{color:red}</style><p class=bar>x</p>").result,
    "<p>x</p>",
    "07.02",
  );
  // an unclosed bracket reads no selector at all
  equal(
    comb("<style>[class^=foo{color:red}</style><p class=foobar>x</p>").result,
    "<style>[class^=foo{color:red}</style><p>x</p>",
    "07.03",
  );
});

test("08 - uglify keeps a name whose short form a selector would start to match", () => {
  // "bar" would become "r", which [class^=r] would then match
  equal(
    comb(
      '<style>.bar{x:1}[class^=r]{y:1}</style><p class="bar zebra foo">x</p>',
      {
        uglify: true,
      },
    ).result,
    '<style>.bar{x:1}[class^=r]{y:1}</style><p class="bar">x</p>',
    "08.01",
  );
});

test.run();
