import tap from "tap";
import { comb } from "./util/util";

// various
// -----------------------------------------------------------------------------

tap.test("01 - bug #01", (t) => {
  const { allInBody, allInHead, result, deletedFromHead, deletedFromBody } =
    comb(
      t,
      `<head>
<style type="text/css">
@font-face {zzz}
.unused {zzz}
</style>
</head>
<body a="z;">
</body>
`
    );

  t.strictSame(allInBody, [], "01.01");
  t.strictSame(allInHead, [".unused"], "01.02");
  t.strictSame(
    result,
    `<head>
<style type="text/css">
@font-face {zzz}
</style>
</head>
<body a="z;">
</body>
`,
    "01.03"
  );
  t.strictSame(deletedFromHead, [".unused"], "01.04");
  t.strictSame(deletedFromBody, [], "01.05");
  t.end();
});

tap.test("02 - working on early (stage I) per-line removal", (t) => {
  const source = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Dummy HTML</title>
<style type="text/css">
  .pt1.mt1 { padding-top: 1px; }
  .pt2 { padding-top: 2px; }
  .pt3 { padding-top: 3px; }
  .pt4{ padding-top: 4px; }
  .pt5 {padding-top: 5px; }
  .pt6{padding-top: 6px; }
  .pt7{padding-top: 7px;}
.pt8{padding-top: 8px}
</style>
</head>
<body>
<table width="100%" border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td class="pt2">z</td>
  </tr>
</table>
</body>
</html>
`;

  const intended = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Dummy HTML</title>
<style type="text/css">
  .pt2 { padding-top: 2px; }
</style>
</head>
<body>
<table width="100%" border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td class="pt2">z</td>
  </tr>
</table>
</body>
</html>
`;

  t.strictSame(comb(t, source).result, intended, "02");
  t.end();
});

// sneaky matching used/unused class/id names
tap.test(
  "03 - HTML inline CSS comments are removed - commented out selectors - semicols clean and inside comments",
  (t) => {
    const source = `<style>
  .aa {z:2;}
</style>
</head>
<body><a class="  aa   bb  cc  " style="/*color: red;*/top: 10px;">z</a>
</body>
`;

    const intended = `<style>
  .aa {z:2;}
</style>
</head>
<body><a class="aa" style="top: 10px;">z</a>
</body>
`;

    t.equal(comb(t, source).result, intended, "03");
    t.end();
  }
);

tap.test(
  "04 - HTML inline CSS comments are removed - commented out selectors - removing comments will result in missing semicol",
  (t) => {
    const source = `<style>
  .aa {z:2;}
</style>
</head>
<body><a class="  aa   bb  cc  " style="kk: ll/*; mm: nn;*/oo: pp;">z</a>
</body>
`;

    const intended = `<style>
  .aa {z:2;}
</style>
</head>
<body><a class="aa" style="kk: ll;oo: pp;">z</a>
</body>
`;

    t.equal(comb(t, source).result, intended, "04");
    t.end();
  }
);

tap.test(
  "05 - HTML inline CSS comments are removed - commented out selectors - very cheeky contents within comments",
  (t) => {
    const source = `<head>
<style type="text/css">
  .aa {z:2;}
</style>
</head>
<body><a class="  aa   bb  " style="color: red;/*">z<id style="*/padding-top: 10px;">z</a>
</body>
`;

    const intended = `<head>
<style type="text/css">
  .aa {z:2;}
</style>
</head>
<body><a class="aa" style="color: red;padding-top: 10px;">z</a>
</body>
`;

    t.equal(comb(t, source).result, intended, "05");
    t.end();
  }
);

tap.test(
  "06 - Even without backend heads/tails set, it should recognise double curlies and curly-percentage -type heads",
  (t) => {
    const source = `<style>
  .aa {bb:2;}
</style>
</head>
<body><a class="{{ bb }}">
</body>
`;

    const intended = `</head>
<body><a>
</body>
`;

    t.equal(comb(t, source).result, intended, "06");
    t.end();
  }
);

tap.todo("07 - empty class/id without equals and value gets deleted", (t) => {
  const source = `<style>
  .aa {bb:2;}
</style>
</head>
<body><a id class="bb">
</body>
`;

  const intended = `</head>
<body><a>
</body>
`;

  t.equal(comb(t, source).result, intended, "07");
  t.end();
});

tap.test(
  "08 - empty class/id with equals but without value gets deleted",
  (t) => {
    const source = `<style>
  .aa {bb:2;}
</style>
</head>
<body class=><a id= class="aa">
</body>
`;

    const intended = `<style>
  .aa {bb:2;}
</style>
</head>
<body><a class="aa">
</body>
`;

    t.equal(comb(t, source).result, intended, "08");
    t.end();
  }
);

tap.test("09 - cleans spaces within classes and id's", (t) => {
  const source = `<head>
<style type="text/css">
  .unused1[z], .unused.used {a:1;}
  .used[z] {a:2;}
</style>
</head>
<body class="   used    "><a class="   unused3   used   ">z</a>
</body>
`;

  const intended = `<head>
<style type="text/css">
  .used[z] {a:2;}
</style>
</head>
<body class="used"><a class="used">z</a>
</body>
`;

  t.equal(comb(t, source).result, intended, "09");
  t.end();
});

tap.test("10 - does not mangle different-type line endings, LF", (t) => {
  const source = "a\n";
  t.equal(comb(t, source).result, source, "10");
  t.end();
});

tap.test("11 - does not mangle different-type line endings, CR", (t) => {
  const source = "a\r";
  t.equal(comb(t, source).result, source, "11");
  t.end();
});

tap.test("12 - does not mangle different-type line endings, LFCR", (t) => {
  const source = "a\r\n";
  t.equal(comb(t, source).result, source, "12");
  t.end();
});

tap.test("13 - dirty code #1", (t) => {
  const actual = comb(
    t,
    `<body>

<style>

@media screen {
td[class=rr] { zzz }

</style>


<td class="a" align="left" style="color:#00000;"><a href="https://email.yo.com" style="color:#000000;">p</a>
<style>
td[class=rr] { font-family: 'GillSans', Gill Sans, Gill Sans MT, Arial, sans-serif !important; font-size: 13px!important; line-height: 13px!important;letter-spacing:1px !important}
td[class=jj] { font-family: 'GillSans', Gill Sans, Gill Sans MT, Arial, sans-serif !important; font-size: 13px!important; line-height: 13px!important; letter-spacing: 0.5px !important}
@media screen {
.z {
float:left !important;}
}

</style>`
  ).result;

  const intended = `<body>
<td align="left" style="color:#00000;"><a href="https://email.yo.com" style="color:#000000;">p</a>
`;

  t.equal(actual, intended, "13");
  t.end();
});

tap.test("14 - adhoc #1", (t) => {
  const actual = comb(
    t,
    `<style>
  .aa{b: c;}
</style>
<body>
<table  id="  zz"  class="aa">
</body>
`
  ).result;

  const intended = `<style>
  .aa{b: c;}
</style>
<body>
<table class="aa">
</body>
`;

  t.equal(actual, intended, "14");
  t.end();
});

tap.test("15 - adhoc 2", (t) => {
  const actual = comb(
    t,
    `<head>
<style type="text/css">
  .aa {z:2;}
</style>
</head>
<body><a class="  aa   bb  cc  ">z</a>
</body>
`
  ).result;

  const intended = `<head>
<style type="text/css">
  .aa {z:2;}
</style>
</head>
<body><a class="aa">z</a>
</body>
`;

  t.equal(actual, intended, "15");
  t.end();
});

tap.test("16 - adhoc 3", (t) => {
  const actual = comb(
    t,
    `<head>
<style type="text/css">
  @media y z (a-a:0px){.col-1,.col-2,.zz{m:100%!n}}
</style>
</head>
<body><a class="  zz   bb  cc  ">z</a>
</body>
`
  ).result;

  const intended = `<head>
<style type="text/css">
  @media y z (a-a:0px){.zz{m:100%!n}}
</style>
</head>
<body><a class="zz">z</a>
</body>
`;

  t.equal(actual, intended, "16");
  t.end();
});

tap.test("17 - bug #36", (t) => {
  const input = `<style>@media only screen {}</style>
<style>.foo {x: y;}</style>
<body><span class="foo">z</span>`;
  const { allInBody, allInHead, result, deletedFromHead, deletedFromBody } =
    comb(t, input);

  t.strictSame(allInBody, [".foo"], "17.01");
  t.strictSame(allInHead, [".foo"], "17.02");
  t.strictSame(
    result,
    `<style>.foo {x: y;}</style>
<body><span class="foo">z</span>`,
    "17.03"
  );
  t.strictSame(deletedFromHead, [], "17.04");
  t.strictSame(deletedFromBody, [], "17.05");
  t.end();
});

tap.test("18 - bug #45 - id", (t) => {
  const input = `<body><div>https://x?id=z</div>`;
  const { allInBody, allInHead, result, deletedFromHead, deletedFromBody } =
    comb(t, input);

  t.strictSame(allInBody, [], "18.01");
  t.strictSame(allInHead, [], "18.02");
  t.strictSame(result, input, "18.03");
  t.strictSame(deletedFromHead, [], "18.04");
  t.strictSame(deletedFromBody, [], "18.05");
  t.end();
});

tap.test("19 - bug #45 - class", (t) => {
  const input = `<body><div>https://x?class=z</div>`;
  const { allInBody, allInHead, result, deletedFromHead, deletedFromBody } =
    comb(t, input);

  t.strictSame(allInBody, [], "19.01");
  t.strictSame(allInHead, [], "19.02");
  t.strictSame(result, input, "19.03");
  t.strictSame(deletedFromHead, [], "19.04");
  t.strictSame(deletedFromBody, [], "19.05");
  t.end();
});
