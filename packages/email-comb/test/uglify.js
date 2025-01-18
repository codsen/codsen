import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { comb } from "./util/util.js";

// opts.uglify
// -----------------------------------------------------------------------------

test("01 - removes unused classes and uglifies at the same time", () => {
  let source = `<head>
<style>
  .r, .t, .y, .u, .i, .o,
  #xx, .xx, .yy { w:1; }
</style>
<body class="xx"><br class="yy" id="xx">
</body>
`;

  // one and two character-long names are just left as they were!
  // in this test both uglified and non-uglified result looks the same
  let intended = `<head>
<style>
  #xx, .xx, .yy { w:1; }
</style>
<body class="xx"><br class="yy" id="xx">
</body>
`;

  let uglified = `<head>
<style>
  #x, .x, .y { w:1; }
</style>
<body class="x"><br class="y" id="x">
</body>
`;

  let actual = comb(source, { uglify: true }).result;
  let actualNotUglified = comb(source, { uglify: false }).result;
  let actual2 = comb(source, { uglify: 1 }).result;

  equal(actual, uglified, "01.01");

  // uglify option given as number:
  equal(actual2, uglified, "01.02");

  // not uglified:
  equal(actualNotUglified, intended, "01.03");

  // uglification disabled:
  let actual3 = comb(source, { uglify: false }).result;
  equal(actual3, intended, "01.04");

  let actual4 = comb(source, { uglify: 0 }).result;
  equal(actual4, intended, "01.05");

  let actual5 = comb(source, { uglify: 1 }).result;
  equal(actual5, uglified, "01.06");
});

test(`02 - ${`\u001b[${31}m${"uglify"}\u001b[${39}m`} - ignores`, () => {
  let source = `<head>
<style>
.abc { w:1; }
</style>
<body class="abc"><br class="yyy1 zzz2" id="xx">
</body>
`;

  let baseline = `<head>
<style>
.abc { w:1; }
</style>
<body class="abc"><br>
</body>
`;

  let baselineUglified = `<head>
<style>
.c { w:1; }
</style>
<body class="c"><br>
</body>
`;

  let ignores = `<head>
<style>
.abc { w:1; }
</style>
<body class="abc"><br class="zzz2">
</body>
`;

  let ignoresUglified = `<head>
<style>
.c { w:1; }
</style>
<body class="c"><br class="zzz2">
</body>
`;

  equal(comb(source, { uglify: false }).result, baseline, "02.01");

  equal(comb(source, { uglify: true }).result, baselineUglified, "02.02");

  equal(
    comb(source, {
      uglify: false,
      whitelist: ".zzz*",
    }).result,
    ignores,
    "02.03",
  );

  equal(
    comb(source, {
      uglify: true,
      whitelist: ".zzz*",
    }).result,
    ignoresUglified,
    "02.04",
  );
});

test(`03 - ${`\u001b[${31}m${"uglify"}\u001b[${39}m`} - class name exceeds library's length (all 26 letters used up)`, () => {
  let actual = `<head>
<style>
.aaa01,
.aaa02,
.aaa03,
.aaa04,
.aaa05,
.aaa06,
.aaa07,
.aaa08,
.aaa09,
.aaa10,
.aaa11,
.aaa12,
.aaa13,
.aaa14,
.aaa15,
.aaa16,
.aaa17,
.aaa18,
.aaa19,
.aaa20,
.aaa21,
.aaa22,
.aaa23,
.aaa24,
.aaa25,
.aaa26,
.aaa27,
.aaa28,
.aaa29,
.aaa30 { w:1; }
</style>
<body class="aaa01 aaa02 aaa03 aaa04 aaa05 aaa06 aaa07 aaa08 aaa09 aaa10 aaa11 aaa12 aaa13 aaa14 aaa15 aaa16 aaa17 aaa18 aaa19 aaa20 aaa21 aaa22 aaa23 aaa24 aaa25 aaa26 aaa27 aaa28 aaa29 aaa30">
</body>
`;

  let intended = `<head>
<style>
.s,
.t,
.u,
.v,
.w,
.x,
.y,
.z,
.a,
.sce,
.tdj,
.ueq,
.vfz,
.wga,
.xhn,
.yi2,
.zjj,
.akk,
.b,
.tdjs,
.ueq6,
.vfzo,
.wgaa,
.xhn0,
.yi2u,
.zjjs,
.akku,
.blw,
.c,
.ueq6m { w:1; }
</style>
<body class="s t u v w x y z a sce tdj ueq vfz wga xhn yi2 zjj akk b tdjs ueq6 vfzo wgaa xhn0 yi2u zjjs akku blw c ueq6m">
</body>
`;

  equal(comb(actual, { uglify: false }).result, actual, "03.01");

  let res = comb(actual, { uglify: true });
  equal(res.result, intended, "03.02");

  equal(
    res.log.uglified,
    [
      [".aaa01", ".s"],
      [".aaa02", ".t"],
      [".aaa03", ".u"],
      [".aaa04", ".v"],
      [".aaa05", ".w"],
      [".aaa06", ".x"],
      [".aaa07", ".y"],
      [".aaa08", ".z"],
      [".aaa09", ".a"],
      [".aaa10", ".sce"],
      [".aaa11", ".tdj"],
      [".aaa12", ".ueq"],
      [".aaa13", ".vfz"],
      [".aaa14", ".wga"],
      [".aaa15", ".xhn"],
      [".aaa16", ".yi2"],
      [".aaa17", ".zjj"],
      [".aaa18", ".akk"],
      [".aaa19", ".b"],
      [".aaa20", ".tdjs"],
      [".aaa21", ".ueq6"],
      [".aaa22", ".vfzo"],
      [".aaa23", ".wgaa"],
      [".aaa24", ".xhn0"],
      [".aaa25", ".yi2u"],
      [".aaa26", ".zjjs"],
      [".aaa27", ".akku"],
      [".aaa28", ".blw"],
      [".aaa29", ".c"],
      [".aaa30", ".ueq6m"],
    ],
    "03.03",
  );
});

test(`04 - ${`\u001b[${31}m${"uglify"}\u001b[${39}m`} - style tag within Outlook conditionals, used CSS`, () => {
  let source = `<html>
<head>
<!--[if mso]>
<style>
  #outlook a {padding: 0;}
  .myclass {color: blue}
  td {padding: 0}
</style>
<![endif]-->
</head>
<body id="outlook">
<a class="myclass">
`;
  let intended = `<html>
<head>
<!--[if mso]>
<style>
  #outlook a {padding: 0;}
  .myclass {color: blue}
  td {padding: 0}
</style>
<![endif]-->
</head>
<body id="outlook">
<a class="myclass">
`;
  let uglified = `<html>
<head>
<!--[if mso]>
<style>
  #k a {padding: 0;}
  .e {color: blue}
  td {padding: 0}
</style>
<![endif]-->
</head>
<body id="k">
<a class="e">
`;

  equal(
    comb(source, {
      uglify: false,
    }).result,
    intended,
    "04.01",
  );
  equal(
    comb(source, {
      uglify: true,
    }).result,
    uglified,
    "04.02",
  );
});

test(`05 - ${`\u001b[${31}m${"uglify"}\u001b[${39}m`} - style tag within Outlook conditionals, unused CSS`, () => {
  let source = `<html>
<head>
<!--[if mso]>
<style>
  #outlook a {padding: 0;}
  .myclass {color: blue}
  td {padding: 0}
</style>
<![endif]-->
</head>
<body id="outlook"><a>
`;
  let intended = `<html>
<head>
<!--[if mso]>
<style>
  #outlook a {padding: 0;}
  td {padding: 0}
</style>
<![endif]-->
</head>
<body id="outlook"><a>
`;
  let uglified = `<html>
<head>
<!--[if mso]>
<style>
  #k a {padding: 0;}
  td {padding: 0}
</style>
<![endif]-->
</head>
<body id="k"><a>
`;
  let ignored = `<html>
<head>
<!--[if mso]>
<style>
  #outlook a {padding: 0;}
  .myclass {color: blue}
  td {padding: 0}
</style>
<![endif]-->
</head>
<body id="outlook"><a>
`;

  equal(
    comb(source, {
      uglify: false,
    }).result,
    intended,
    "05.01",
  );
  equal(
    comb(source, {
      uglify: true,
    }).result,
    uglified,
    "05.02",
  );
  // now ignores are set, so deletion is prevented:
  equal(
    comb(source, {
      uglify: false,
      whitelist: ["#outlook", ".myclass"],
    }).result,
    ignored,
    "05.03",
  );
  equal(
    comb(source, {
      uglify: true,
      whitelist: ["#outlook", ".myclass"],
    }).result,
    ignored,
    "05.04",
  );
});

test(`06 - ${`\u001b[${31}m${"uglify"}\u001b[${39}m`} - ignores on used id's`, () => {
  let source = `<html>
<head>
<style>
#mn a {z}
</style>
</head>
<body id="mn"><a>
`;
  equal(
    comb(source, {
      uglify: true,
      whitelist: ["#mn", ".op"],
    }).result,
    source,
    "06.01",
  );
  equal(
    comb(source, {
      uglify: true,
      whitelist: ["#mn"],
    }).result,
    source,
    "06.02",
  );
});

test(`07 - ${`\u001b[${31}m${"uglify"}\u001b[${39}m`} - ignores on used classes`, () => {
  let source = `<html>
<head>
<style>
.mn a {z}
</style>
</head>
<body class="mn"><a>
`;
  equal(
    comb(source, {
      uglify: true,
      whitelist: [".mn", ".op"],
    }).result,
    source,
    "07.01",
  );
  equal(
    comb(source, {
      uglify: true,
      whitelist: [".mn"],
    }).result,
    source,
    "07.02",
  );
});

test(`08 - ${`\u001b[${31}m${"uglify"}\u001b[${39}m`} - ignored values don't appear among uglified legend entries`, () => {
  let actual = comb(
    `<html lang="en">
<head>
<style type="text/css">
  @media only screen {
    .serif {font-family: 'Merriweather', Georgia, serif!important;}
    .sans-serif {font-family: 'Open Sans', Arial, sans-serif!important;}
  }
  #outlook a {padding: 0;}
</style>
</head>
<body class="serif">
zzz
</body>
</html>
`,
    {
      whitelist: [
        "#outlook",
        ".ExternalClass",
        ".module-*",
        ".Mso*",
        ".ReadMsgBody",
        ".yshortcuts",
      ],
      uglify: true,
    },
  );

  let intended = `<html lang="en">
<head>
<style type="text/css">
  @media only screen {
    .serif {font-family: 'Merriweather', Georgia, serif!important;}
  }
  #outlook a {padding: 0;}
</style>
</head>
<body class="serif">
zzz
</body>
</html>
`;

  // whatever uglified class is named, it's there, Merriweather font is kept:
  ok(actual.result.includes("Merriweather"), "08.01");

  // also, the result contains whitelisted entries...
  ok(intended.includes("#outlook"), "08.02");

  // ... and uglified legend doesn't contain it
  not.ok(actual.log.uglified.includes("#outlook"), "08.03");

  // but there's "serif" uglified value in the uglification legend:
  equal(actual.log.uglified.length, 1, "08.03");
});

test.run();
