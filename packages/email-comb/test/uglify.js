import tap from "tap";
import { comb } from "./util/util";

// opts.uglify
// -----------------------------------------------------------------------------

tap.test("01 - removes unused classes and uglifies at the same time", (t) => {
  const source = `<head>
<style>
  .r, .t, .y, .u, .i, .o,
  #xx, .xx, .yy { w:1; }
</style>
<body class="xx"><br class="yy" id="xx">
</body>
`;

  // one and two character-long names are just left as they were!
  // in this test both uglified and non-uglified result looks the same
  const intended = `<head>
<style>
  #xx, .xx, .yy { w:1; }
</style>
<body class="xx"><br class="yy" id="xx">
</body>
`;

  const uglified = `<head>
<style>
  #x, .x, .y { w:1; }
</style>
<body class="x"><br class="y" id="x">
</body>
`;

  const actual = comb(t, source, { uglify: true }).result;
  const actualNotUglified = comb(t, source, { uglify: false }).result;
  const actual2 = comb(t, source, { uglify: 1 }).result;

  t.equal(actual, uglified, "01.01");

  // uglify option given as number:
  t.equal(actual2, uglified, "01.02");

  // not uglified:
  t.equal(actualNotUglified, intended, "01.03");

  // uglification disabled:
  const actual3 = comb(t, source, { uglify: false }).result;
  t.equal(actual3, intended, "01.04");

  const actual4 = comb(t, source, { uglify: 0 }).result;
  t.equal(actual4, intended, "01.05");

  const actual5 = comb(t, source, { uglify: 1 }).result;
  t.equal(actual5, uglified, "01.06");
  t.end();
});

tap.test(`02 - ${`\u001b[${31}m${`uglify`}\u001b[${39}m`} - ignores`, (t) => {
  const source = `<head>
<style>
.abc { w:1; }
</style>
<body class="abc"><br class="yyy1 zzz2" id="xx">
</body>
`;

  const baseline = `<head>
<style>
.abc { w:1; }
</style>
<body class="abc"><br>
</body>
`;

  const baselineUglified = `<head>
<style>
.c { w:1; }
</style>
<body class="c"><br>
</body>
`;

  const ignores = `<head>
<style>
.abc { w:1; }
</style>
<body class="abc"><br class="zzz2">
</body>
`;

  const ignoresUglified = `<head>
<style>
.c { w:1; }
</style>
<body class="c"><br class="zzz2">
</body>
`;

  t.equal(
    comb(t, source, { uglify: false }).result,
    baseline,
    "02.01 - default settings (no uglify, no ignores)"
  );

  t.equal(
    comb(t, source, { uglify: true }).result,
    baselineUglified,
    "02.02 - uglified, no ignores"
  );

  t.equal(
    comb(t, source, {
      uglify: false,
      whitelist: ".zzz*",
    }).result,
    ignores,
    "02.03 - no uglify, with ignores"
  );

  t.equal(
    comb(t, source, {
      uglify: true,
      whitelist: ".zzz*",
    }).result,
    ignoresUglified,
    "02.04 - uglified + with ignores"
  );

  t.end();
});

tap.test(
  `03 - ${`\u001b[${31}m${`uglify`}\u001b[${39}m`} - class name exceeds library's length (all 26 letters used up)`,
  (t) => {
    const actual = `<head>
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

    const intended = `<head>
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

    t.equal(
      comb(t, actual, { uglify: false }).result,
      actual,
      "03.01 - uglify is off"
    );

    const res = comb(t, actual, { uglify: true });
    t.equal(res.result, intended, "03.02 - uglify is on");

    t.strictSame(
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
      "03.03"
    );

    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${31}m${`uglify`}\u001b[${39}m`} - style tag within Outlook conditionals, used CSS`,
  (t) => {
    const source = `<html>
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
    const intended = `<html>
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
    const uglified = `<html>
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

    t.equal(
      comb(t, source, {
        uglify: false,
      }).result,
      intended,
      "04.01"
    );
    t.equal(
      comb(t, source, {
        uglify: true,
      }).result,
      uglified,
      "04.02"
    );
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${31}m${`uglify`}\u001b[${39}m`} - style tag within Outlook conditionals, unused CSS`,
  (t) => {
    const source = `<html>
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
    const intended = `<html>
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
    const uglified = `<html>
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
    const ignored = `<html>
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

    t.equal(
      comb(t, source, {
        uglify: false,
      }).result,
      intended,
      "05.01"
    );
    t.equal(
      comb(t, source, {
        uglify: true,
      }).result,
      uglified,
      "05.02"
    );
    // now ignores are set, so deletion is prevented:
    t.equal(
      comb(t, source, {
        uglify: false,
        whitelist: ["#outlook", ".myclass"],
      }).result,
      ignored,
      "05.03"
    );
    t.equal(
      comb(t, source, {
        uglify: true,
        whitelist: ["#outlook", ".myclass"],
      }).result,
      ignored,
      "05.04"
    );
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${31}m${`uglify`}\u001b[${39}m`} - ignores on used id's`,
  (t) => {
    const source = `<html>
<head>
<style>
#mn a {z}
</style>
</head>
<body id="mn"><a>
`;
    t.equal(
      comb(t, source, {
        uglify: true,
        whitelist: ["#mn", ".op"],
      }).result,
      source,
      "06.01"
    );
    t.equal(
      comb(t, source, {
        uglify: true,
        whitelist: ["#mn"],
      }).result,
      source,
      "06.02"
    );
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${31}m${`uglify`}\u001b[${39}m`} - ignores on used classes`,
  (t) => {
    const source = `<html>
<head>
<style>
.mn a {z}
</style>
</head>
<body class="mn"><a>
`;
    t.equal(
      comb(t, source, {
        uglify: true,
        whitelist: [".mn", ".op"],
      }).result,
      source,
      "07.01"
    );
    t.equal(
      comb(t, source, {
        uglify: true,
        whitelist: [".mn"],
      }).result,
      source,
      "07.02"
    );
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${31}m${`uglify`}\u001b[${39}m`} - ignored values don't appear among uglified legend entries`,
  (t) => {
    const actual = comb(
      t,
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
      }
    );

    const intended = `<html lang="en">
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
    t.ok(actual.result.includes("Merriweather"), "08.01");

    // also, the result contains whitelisted entries...
    t.ok(intended.includes("#outlook"), "08.02");

    // ... and uglified legend doesn't contain it
    t.false(actual.log.uglified.includes("#outlook"), "08.03");

    // but there's "serif" uglified value in the uglification legend:
    t.equal(actual.log.uglified.length, 1, "08.04");

    t.end();
  }
);
