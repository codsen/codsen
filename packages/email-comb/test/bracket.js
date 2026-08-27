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

  let intended = `<head>
<style type="text/css">
  a[class="used"]{x:1;}
</style>
</head>
<body class="used"><a class="used">z</a>
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
<body id="used"><a id="used">z</a>
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

test.run();
