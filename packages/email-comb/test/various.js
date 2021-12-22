import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { comb } from "./util/util.js";

// various
// -----------------------------------------------------------------------------

test("01 - bug #01", () => {
  let { allInBody, allInHead, result, deletedFromHead, deletedFromBody } = comb(
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

  equal(allInBody, [], "01.01");
  equal(allInHead, [".unused"], "01.02");
  equal(
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
  equal(deletedFromHead, [".unused"], "01.04");
  equal(deletedFromBody, [], "01.05");
});

test("02 - working on early (stage I) per-line removal", () => {
  let source = `
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

  let intended = `<!DOCTYPE html>
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

  equal(comb(source).result, intended, "02");
});

// sneaky matching used/unused class/id names
test("03 - HTML inline CSS comments are removed - commented out selectors - semicols clean and inside comments", () => {
  let source = `<style>
  .aa {z:2;}
</style>
</head>
<body><a class="  aa   bb  cc  " style="/*color: red;*/top: 10px;">z</a>
</body>
`;

  let intended = `<style>
  .aa {z:2;}
</style>
</head>
<body><a class="aa" style="top: 10px;">z</a>
</body>
`;

  equal(comb(source).result, intended, "03");
});

test("04 - HTML inline CSS comments are removed - commented out selectors - removing comments will result in missing semicol", () => {
  let source = `<style>
  .aa {z:2;}
</style>
</head>
<body><a class="  aa   bb  cc  " style="kk: ll/*; mm: nn;*/oo: pp;">z</a>
</body>
`;

  let intended = `<style>
  .aa {z:2;}
</style>
</head>
<body><a class="aa" style="kk: ll;oo: pp;">z</a>
</body>
`;

  equal(comb(source).result, intended, "04");
});

test("05 - HTML inline CSS comments are removed - commented out selectors - very cheeky contents within comments", () => {
  let source = `<head>
<style type="text/css">
  .aa {z:2;}
</style>
</head>
<body><a class="  aa   bb  " style="color: red;/*">z<id style="*/padding-top: 10px;">z</a>
</body>
`;

  let intended = `<head>
<style type="text/css">
  .aa {z:2;}
</style>
</head>
<body><a class="aa" style="color: red;padding-top: 10px;">z</a>
</body>
`;

  equal(comb(source).result, intended, "05");
});

test("06 - Even without backend heads/tails set, it should recognise double curlies and curly-percentage -type heads", () => {
  let source = `<style>
  .aa {bb:2;}
</style>
</head>
<body><a class="{{ bb }}">
</body>
`;

  let intended = `</head>
<body><a>
</body>
`;

  equal(comb(source).result, intended, "06");
});

// TODO
test.skip("01 - empty class/id without equals and value gets deleted", () => {
  let source = `<style>
  .aa {bb:2;}
</style>
</head>
<body><a id class="bb">
</body>
`;

  let intended = `</head>
<body><a>
</body>
`;

  equal(comb(source).result, intended, "01.01");
});

test("08 - empty class/id with equals but without value gets deleted", () => {
  let source = `<style>
  .aa {bb:2;}
</style>
</head>
<body class=><a id= class="aa">
</body>
`;

  let intended = `<style>
  .aa {bb:2;}
</style>
</head>
<body><a class="aa">
</body>
`;

  equal(comb(source).result, intended, "08");
});

test("09 - cleans spaces within classes and id's", () => {
  let source = `<head>
<style type="text/css">
  .unused1[z], .unused.used {a:1;}
  .used[z] {a:2;}
</style>
</head>
<body class="   used    "><a class="   unused3   used   ">z</a>
</body>
`;

  let intended = `<head>
<style type="text/css">
  .used[z] {a:2;}
</style>
</head>
<body class="used"><a class="used">z</a>
</body>
`;

  equal(comb(source).result, intended, "09");
});

test("10 - does not mangle different-type line endings, LF", () => {
  let source = "a\n";
  equal(comb(source).result, source, "10");
});

test("11 - does not mangle different-type line endings, CR", () => {
  let source = "a\r";
  equal(comb(source).result, source, "11");
});

test("12 - does not mangle different-type line endings, LFCR", () => {
  let source = "a\r\n";
  equal(comb(source).result, source, "12");
});

test("13 - dirty code #1", () => {
  let actual = comb(
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

  let intended = `<body>
<td align="left" style="color:#00000;"><a href="https://email.yo.com" style="color:#000000;">p</a>
`;

  equal(actual, intended, "13");
});

test("14 - adhoc #1", () => {
  let actual = comb(
    `<style>
  .aa{b: c;}
</style>
<body>
<table  id="  zz"  class="aa">
</body>
`
  ).result;

  let intended = `<style>
  .aa{b: c;}
</style>
<body>
<table class="aa">
</body>
`;

  equal(actual, intended, "14");
});

test("15 - adhoc 2", () => {
  let actual = comb(
    `<head>
<style type="text/css">
  .aa {z:2;}
</style>
</head>
<body><a class="  aa   bb  cc  ">z</a>
</body>
`
  ).result;

  let intended = `<head>
<style type="text/css">
  .aa {z:2;}
</style>
</head>
<body><a class="aa">z</a>
</body>
`;

  equal(actual, intended, "15");
});

test("16 - adhoc 3", () => {
  let actual = comb(
    `<head>
<style type="text/css">
  @media y z (a-a:0px){.col-1,.col-2,.zz{m:100%!n}}
</style>
</head>
<body><a class="  zz   bb  cc  ">z</a>
</body>
`
  ).result;

  let intended = `<head>
<style type="text/css">
  @media y z (a-a:0px){.zz{m:100%!n}}
</style>
</head>
<body><a class="zz">z</a>
</body>
`;

  equal(actual, intended, "16");
});

test("17 - bug #36", () => {
  let input = `<style>@media only screen {}</style>
<style>.foo {x: y;}</style>
<body><span class="foo">z</span>`;
  let { allInBody, allInHead, result, deletedFromHead, deletedFromBody } =
    comb(input);

  equal(allInBody, [".foo"], "17.01");
  equal(allInHead, [".foo"], "17.02");
  equal(
    result,
    `<style>.foo {x: y;}</style>
<body><span class="foo">z</span>`,
    "17.03"
  );
  equal(deletedFromHead, [], "17.04");
  equal(deletedFromBody, [], "17.05");
});

test("18 - bug #45 - id", () => {
  let input = `<body><div>https://x?id=z</div>`;
  let { allInBody, allInHead, result, deletedFromHead, deletedFromBody } =
    comb(input);

  equal(allInBody, [], "18.01");
  equal(allInHead, [], "18.02");
  equal(result, input, "18.03");
  equal(deletedFromHead, [], "18.04");
  equal(deletedFromBody, [], "18.05");
});

test("19 - bug #45 - class", () => {
  let input = `<body><div>https://x?class=z</div>`;
  let { allInBody, allInHead, result, deletedFromHead, deletedFromBody } =
    comb(input);

  equal(allInBody, [], "19.01");
  equal(allInHead, [], "19.02");
  equal(result, input, "19.03");
  equal(deletedFromHead, [], "19.04");
  equal(deletedFromBody, [], "19.05");
});

test.run();
