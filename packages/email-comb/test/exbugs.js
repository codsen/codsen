import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { comb } from "./util/util.js";

// ex-bugs
// -----------------------------------------------------------------------------

test("01 - color code hashes within head styles with no selectors", () => {
  let actual = comb(
    `<head>
<style>
a[href^="tel"], a[href^="sms"] { text-decoration: none; color: #525252; pointer-events: none; cursor: default;}
</style>
</head>
<body>
  some code
</body>
`,
  );

  let intended = `<head>
<style>
a[href^="tel"], a[href^="sms"] { text-decoration: none; color: #525252; pointer-events: none; cursor: default;}
</style>
</head>
<body>
  some code
</body>
`;

  equal(actual.result, intended, "01.01");
});

test("02 - selectors in head styles without classes or ids", () => {
  let actual = comb(
    `<head>
<style>
a {color: #525252;}
</style>
</head>
<body>
  some code
</body>
`,
  );

  let intended = `<head>
<style>
a {color: #525252;}
</style>
</head>
<body>
  some code
</body>
`;

  equal(actual.result, intended, "02.01");
});

test('03 - sneaky attributes that end with characters "id"', () => {
  let actual = comb(
    `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Dummy HTML</title>
<style type="text/css">
  .real-class-1:active, #head-only-id1[whatnot], whatever[lang|en]{width:100% !important;}
  #real-id-1:hover{width:100% !important;}
</style>
</head>
<body>
<table id="     real-id-1    body-only-id-1    " class="     body-only-class-1 " width="100%" border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td>
      <table width="100%" border="0" cellpadding="0" cellspacing="0">
        <tr id="      body-only-id-4     ">
          <td id="     body-only-id-2     body-only-id-3   " class="     real-class-1      body-only-class-2     body-only-class-3 ">
            <a href="zzz" urlid="26489" target="_blank">Dummy content</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>
`,
  );

  let intended = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Dummy HTML</title>
<style type="text/css">
  .real-class-1:active, whatever[lang|en]{width:100% !important;}
  #real-id-1:hover{width:100% !important;}
</style>
</head>
<body>
<table id="real-id-1" width="100%" border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td>
      <table width="100%" border="0" cellpadding="0" cellspacing="0">
        <tr>
          <td class="real-class-1">
            <a href="zzz" urlid="26489" target="_blank">Dummy content</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>
`;

  equal(actual.result, intended, "03.01");
});

test('04 - mini version of 08.05, sneaky attributes ending with "class"', () => {
  let actual = comb(
    `<body>
<a href="zzz" superclass="26489" >Links</a>
</body>
</html>
`,
  );

  let intended = `<body>
<a href="zzz" superclass="26489" >Links</a>
</body>
</html>
`;

  equal(actual.result, intended, "04.01");
});

test('05 - sneaky attributes that end with characters "class"', () => {
  let actual = comb(
    `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Dummy HTML</title>
<style type="text/css">
  .real-class-1:active, #head-only-id1[whatnot], whatever[lang|en]{width:100% !important;}
  #real-id-1:hover{width:100% !important;}
</style>
</head>
<body>
<table id="     real-id-1    body-only-id-1    " class="     body-only-class-1 " width="100%" border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td>
      <table width="100%" border="0" cellpadding="0" cellspacing="0">
        <tr id="      body-only-id-4     ">
          <td id="     body-only-id-2     body-only-id-3   " class="     real-class-1      body-only-class-2     body-only-class-3 ">
            <a href="zzz" superclass="26489" target="_blank">Dummy content</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>
`,
  );

  let intended = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Dummy HTML</title>
<style type="text/css">
  .real-class-1:active, whatever[lang|en]{width:100% !important;}
  #real-id-1:hover{width:100% !important;}
</style>
</head>
<body>
<table id="real-id-1" width="100%" border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td>
      <table width="100%" border="0" cellpadding="0" cellspacing="0">
        <tr>
          <td class="real-class-1">
            <a href="zzz" superclass="26489" target="_blank">Dummy content</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>
`;

  equal(actual.result, intended, "05.01");
});

test("06 - color code hashes interpreted correctly, not as id's", () => {
  let actual = comb(
    `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Dummy HTML</title>
<style type="text/css">
  .real-class-1:active, #head-only-id1[whatnot], whatever[lang|en]{width:100% !important;}
  #real-id-1:hover{width:100% !important;}
  /* Clickable phone numbers */
  a[href^="tel"], a[href^="sms"] {  text-decoration: none; color: #525252; pointer-events: none; cursor: default;}
  .mobile_link a[href^="tel"], .mobile_link a[href^="sms"] { text-decoration: default;  color: #0075bc !important; pointer-events: auto;  cursor: default;}
</style>
</head>
<body>
<table id="     real-id-1    body-only-id-1    " class="     body-only-class-1 " width="100%" border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td>
      <table width="100%" border="0" cellpadding="0" cellspacing="0">
        <tr id="      body-only-id-4     ">
          <td id="     body-only-id-2     body-only-id-3   " class="     real-class-1      body-only-class-2     body-only-class-3 ">
            <a href="zzz" superclass="26489" target="_blank">Dummy content</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>
`,
  );

  let intended = [".mobile_link", "#head-only-id1"];

  equal(actual.deletedFromHead, intended, "06.01");
});

test("07 - one-letter classes (modern notation)", () => {
  let actual = comb(
    `<head>
<style type="text/css">
.h{display:none !important;}
</style>
</head>
<body>
<span class="h">z</span>
</body>
`,
  );

  let intended = `<head>
<style type="text/css">
.h{display:none !important;}
</style>
</head>
<body>
<span class="h">z</span>
</body>
`;

  equal(actual.result, intended, "07.01");
});

test("08 - one-letter classes (old notation)", () => {
  let actual = comb(
    `<head>
<style type="text/css">
*[class].h{display:none !important;}
</style>
</head>
<body>
<span class="h">z</span>
</body>
`,
  );

  let intended = `<head>
<style type="text/css">
*[class].h{display:none !important;}
</style>
</head>
<body>
<span class="h">z</span>
</body>
`;

  equal(actual.result, intended, "08.01");
});

test("09 - one-letter classes - comprehensive comparison", () => {
  let actual = comb(
    `<html>
<head>
  <style>
    .used-1 .aaaaa.aaaaaa {
      display: block;
    }
    #unused-2 {
      height: auto;
    }
  </style>
</head>
<body id="unused-3">
  <table class="unused-4 used-1">
    <tr>
      <td class="unused-5 unused-6">
        text
      </td>
    </tr>
  </table>
</body>
</html>`,
  );

  let intended = {
    result: `<html>
<head>
</head>
<body>
  <table>
    <tr>
      <td>
        text
      </td>
    </tr>
  </table>
</body>
</html>`,
    allInHead: [".used-1", ".aaaaa", ".aaaaaa", "#unused-2"],
    allInBody: ["#unused-3", ".unused-4", ".used-1", ".unused-5", ".unused-6"],
    deletedFromHead: [".used-1", ".aaaaa", ".aaaaaa", "#unused-2"],
    deletedFromBody: [
      ".used-1",
      "#unused-3",
      ".unused-4",
      ".unused-5",
      ".unused-6",
    ],
  };

  equal(
    actual.allInHead.sort().join(" - "),
    intended.allInHead.sort().join(" - "),
    "09.01",
  );
  equal(
    actual.allInBody.sort().join(" - "),
    intended.allInBody.sort().join(" - "),
    "09.02",
  );
  equal(
    actual.deletedFromHead.sort().join(" - "),
    intended.deletedFromHead.sort().join(" - "),
    "09.03",
  );
  equal(
    actual.deletedFromBody.sort().join(" - "),
    intended.deletedFromBody.sort().join(" - "),
    "09.04",
  );
  equal(actual.result, intended.result, "09.05");
});

test("10 - checking whole results object, all its keys #1", () => {
  let actual = comb(
    `<html>
<head>
  <style>
    .used-1 .unused-2.unused-3 {
      display: block;
    }
  </style>
</head>
<body>
  <span class="used-1 unused-4"></span>
</body>
</html>`,
  );

  let intended = {
    result: `<html>
<head>
</head>
<body>
  <span></span>
</body>
</html>`,
    allInHead: [".used-1", ".unused-2", ".unused-3"],
    allInBody: [".used-1", ".unused-4"],
    deletedFromHead: [".used-1", ".unused-2", ".unused-3"],
    deletedFromBody: [".used-1", ".unused-4"],
  };

  equal(actual.allInHead.sort(), intended.allInHead.sort(), "10.01");
  equal(actual.allInBody.sort(), intended.allInBody.sort(), "10.02");
  equal(
    actual.deletedFromHead.sort(),
    intended.deletedFromHead.sort(),
    "10.03",
  );
  equal(
    actual.deletedFromBody.sort(),
    intended.deletedFromBody.sort(),
    "10.04",
  );
  equal(actual.result, intended.result, "10.05");
});

test("11 - checking whole results object, all its keys #2", () => {
  let actual = comb(
    `<html>
<head>
  <style>
    .used-1, .unused-2.unused-3 {
      display: block;
    }
  </style>
</head>
<body>
  <span class="used-1 unused-4"></span>
</body>
</html>
`,
  );

  let intended = {
    result: `<html>
<head>
  <style>
    .used-1 {
      display: block;
    }
  </style>
</head>
<body>
  <span class="used-1"></span>
</body>
</html>
`,
    allInHead: [".used-1", ".unused-2", ".unused-3"],
    allInBody: [".used-1", ".unused-4"],
    deletedFromHead: [".unused-2", ".unused-3"],
    deletedFromBody: [".unused-4"],
  };

  equal(actual.allInHead.sort(), intended.allInHead.sort(), "11.01");
  equal(actual.allInBody.sort(), intended.allInBody.sort(), "11.02");
  equal(
    actual.deletedFromHead.sort(),
    intended.deletedFromHead.sort(),
    "11.03",
  );
  equal(
    actual.deletedFromBody.sort(),
    intended.deletedFromBody.sort(),
    "11.04",
  );
  equal(actual.result, intended.result, "11.05");
});

test("12 - Cosmin's reported bug", () => {
  let srcs = [
    '<body><a href="http://a.b/c?d=2&id=xyz&e=0">\n',
    '<body><a href="http://a.b/c?d=2&class=xyz&e=0">\n',
  ];
  srcs.forEach((src) => {
    equal(comb(src).result, src);
  });
});

test("13 - inner whitespace #1", () => {
  let inp = `<style>
.abc {font-family: cursive;}
</style>
</head>
<body>
<br class="xyz klm abc">
</td>
`;

  let outp = `<style>
.abc {font-family: cursive;}
</style>
</head>
<body>
<br class="abc">
</td>
`;
  equal(comb(inp).result, outp, "13.01");
});

test("14 - inner whitespace #2", () => {
  let inp = `<style>
.abc {font-family: cursive;}
</style>
</head>
<body>
<br class="xyz klm  abc">
</td>
`;

  let outp = `<style>
.abc {font-family: cursive;}
</style>
</head>
<body>
<br class="abc">
</td>
`;
  equal(comb(inp).result, outp, "14.01");
});

test("15 - inner whitespace #3", () => {
  let inp = `<style>
.abc {font-family: cursive;}
</style>
</head>
<body>
<br class="xyz abc klm ">
</td>
`;

  let outp = `<style>
.abc {font-family: cursive;}
</style>
</head>
<body>
<br class="abc">
</td>
`;
  equal(comb(inp).result, outp, "15.01");
});

test("16 - adhoc", () => {
  let inp = `<style>
@media only screen{
  .klm{ font-size:16px !important; }
}
</style>
<body>
<a href="a("'")">
<td class="klm nop">
`;

  let outp = `<style>
@media only screen{
  .klm{ font-size:16px !important; }
}
</style>
<body>
<a href="a("'")">
<td class="klm">
`;
  equal(comb(inp).result, outp, "16.01");
});

test("17 - adhoc", () => {
  let inp = `<style>
@media only screen{
  .klm{ font-size:16px !important; }
}
</style>
<body>
<a class="aaa bbb ccc-ddd" href="https://www.maps.com/search/?api=1&query={{ prs.tuv.wxy | lower | replace(" ", "+") | replace("'", "%27") | replace("&", "%26") | replace("(", "%28") | replace(")", "%29") }}" target="_blank" style="font-size: 18px;">&nbsp; &nbsp;CLICK ME&nbsp; &nbsp;</a>
<td class="klm nop">
`;

  let outp = `<style>
@media only screen{
  .klm{ font-size:16px !important; }
}
</style>
<body>
<a href="https://www.maps.com/search/?api=1&query={{ prs.tuv.wxy | lower | replace(" ", "+") | replace("'", "%27") | replace("&", "%26") | replace("(", "%28") | replace(")", "%29") }}" target="_blank" style="font-size: 18px;">&nbsp; &nbsp;CLICK ME&nbsp; &nbsp;</a>
<td class="klm">
`;
  equal(comb(inp).result, outp, "17.01");
});

test("18 - adhoc", () => {
  let inp = `<style>
@media screen {
  .sm-border-0 {
    border-width: 0 !important;
  }
}
</style>
<body>
<span>S's</span>
<td class="py-16 leading-0 sm-leading-full sm-border-0">
`;

  let outp = `<style>
@media screen {
  .sm-border-0 {
    border-width: 0 !important;
  }
}
</style>
<body>
<span>S's</span>
<td class="sm-border-0">
`;
  equal(comb(inp).result, outp, "18.01");
});

test("19 - #40 - pre", () => {
  let inp = `<pre>Dear name.

How are you?
Yours sincerely,

\tGood person</pre>`;
  equal(comb(inp).result, inp, "19.01");
});

test("20 - DW reported - x-apple-data-detectors: - combo", () => {
  let actual = comb(
    `<head>
<style>
a[href^="x-apple-data-detectors:"] { color: inherit; text-decoration: inherit;}
[class].HOV{transition: all .25s ease-in-out!important}
[class].HOV:hover{transform:scale(1.07)!important}
</style>
</head>
<body>
<a class="HOV">some code</a>
</body>
`,
  );

  let intended = `<head>
<style>
a[href^="x-apple-data-detectors:"] { color: inherit; text-decoration: inherit;}
[class].HOV{transition: all .25s ease-in-out!important}
[class].HOV:hover{transform:scale(1.07)!important}
</style>
</head>
<body>
<a class="HOV">some code</a>
</body>
`;

  equal(actual.result, intended, "20.01");
});

test("21 - DW reported - x-apple-data-detectors: - only - detectors no colon", () => {
  let actual = comb(
    `<head>
<style>
a[href^="x-apple-data-detectors"] { color: inherit; text-decoration: inherit;}
</style>
</head>
<body>
<a class="x">some code</a>
</body>
`,
  );

  let intended = `<head>
<style>
a[href^="x-apple-data-detectors"] { color: inherit; text-decoration: inherit;}
</style>
</head>
<body>
<a>some code</a>
</body>
`;

  equal(actual.result, intended, "21.01");
});

test("22 - DW reported - x-apple-data-detectors: - only - detectors + colon", () => {
  let actual = comb(
    `<head>
<style>
a[href^="x-apple-data-detectors:"] { color: inherit; text-decoration: inherit;}
</style>
</head>
<body>
<a class="x">some code</a>
</body>
`,
  );

  let intended = `<head>
<style>
a[href^="x-apple-data-detectors:"] { color: inherit; text-decoration: inherit;}
</style>
</head>
<body>
<a>some code</a>
</body>
`;

  equal(actual.result, intended, "22.01");
});

test("23 - DW reported - transition only - used", () => {
  let actual = comb(
    `<head>
<style>
[class].HOV{transition: all .25s ease-in-out!important}
[class].HOV:hover{transform:scale(1.07)!important}
.x{color: red !important}
</style>
</head>
<body>
<a class="HOV">some code</a>
</body>
`,
  );

  let intended = `<head>
<style>
[class].HOV{transition: all .25s ease-in-out!important}
[class].HOV:hover{transform:scale(1.07)!important}
</style>
</head>
<body>
<a class="HOV">some code</a>
</body>
`;

  equal(actual.result, intended, "23.01");
});

test("24 - DW reported - deletes 2 x [class]", () => {
  let actual = comb(
    `<head>
<style>
[class].HOV{transition: all .25s ease-in-out!important}
[class].HOV:hover{transform:scale(1.07)!important}
.x{color: red !important}
</style>
</head>
<body>
<a class="x">some code</a>
</body>
`,
  );

  let intended = `<head>
<style>
.x{color: red !important}
</style>
</head>
<body>
<a class="x">some code</a>
</body>
`;

  equal(actual.result, intended, "24.01");
});

test("25 - #68 leftover commas - class+tag+class+class", () => {
  let actual = comb(
    `<head>
<style>
.a, li, .b, .c {}
</style>
</head>
<body class="a">
x
</body>
`,
  );

  let intended = `<head>
<style>
.a, li{}
</style>
</head>
<body class="a">
x
</body>
`;

  equal(actual.result, intended, "25.01");
});

test("26 - #68 leftover commas - tag+tag+class+class", () => {
  let actual = comb(
    `<head>
<style>
p, li, .unused-class-1, .unused-class-2 {}
</style>
</head>
<body>
x
</body>
`,
  );

  let intended = `<head>
<style>
p, li{}
</style>
</head>
<body>
x
</body>
`;

  equal(actual.result, intended, "26.01");
});

test("27 - #68 leftover commas - 1", () => {
  let actual = comb(
    `<head>
<style>
.a, li, .b, .c {}
</style>
</head>
<body class="a">
x
</body>
`,
  );

  let intended = `<head>
<style>
.a, li{}
</style>
</head>
<body class="a">
x
</body>
`;

  equal(actual.result, intended, "27.01");
});

test("28 - #68 leftover commas - 2", () => {
  let actual = comb(
    `<head>
<style>
.c, .a, li, .b {}
</style>
</head>
<body class="a">
x
</body>
`,
  );

  let intended = `<head>
<style>
.a, li {}
</style>
</head>
<body class="a">
x
</body>
`;

  equal(actual.result, intended, "28.01");
});

test("29 - #68 leftover commas - 3", () => {
  let actual = comb(
    `<head>
<style>
.b, .c, .a, li {}
</style>
</head>
<body class="a">
x
</body>
`,
  );

  let intended = `<head>
<style>
.a, li {}
</style>
</head>
<body class="a">
x
</body>
`;

  equal(actual.result, intended, "29.01");
});

test("30 - #68 leftover commas - 4", () => {
  let actual = comb(
    `<head>
<style>
li, .b, .c, .a {}
</style>
</head>
<body class="a">
x
</body>
`,
  );

  let intended = `<head>
<style>
li, .a {}
</style>
</head>
<body class="a">
x
</body>
`;

  equal(actual.result, intended, "30.01");
});

test("31 - #83 misinterpreted CSS comments - URL - no uglify", () => {
  let actual = comb(
    `<html>
<body>
<table>
<tr>
<td>
http://*
</td>
</tr>
</table>
<table id="1">
<tr>
<td>
</td>
</tr>
</table>
</body>

</html>
`,
    { uglify: false },
  );

  let intended = `<html>
<body>
<table>
<tr>
<td>
http://*
</td>
</tr>
</table>
<table>
<tr>
<td>
</td>
</tr>
</table>
</body>
</html>
`;

  equal(actual.result, intended, "31.01");
});

test("32 - #83 misinterpreted CSS comments - URL - uglify", () => {
  let actual = comb(
    `<html>
<body>
<table>
<tr>
<td>
http://*
</td>
</tr>
</table>
<table id="1">
<tr>
<td>
</td>
</tr>
</table>
</body>

</html>
`,
    { uglify: true },
  );

  let intended = `<html>
<body>
<table>
<tr>
<td>
http://*
</td>
</tr>
</table>
<table>
<tr>
<td>
</td>
</tr>
</table>
</body>
</html>
`;

  equal(actual.result, intended, "32.01");
});

test("33 - #102 trailing comma - no uglify", () => {
  let actual = comb(
    `<head>
<style>
.foo,
.bar div,
.baz{
color:red;
}
</style>
</head>
<body>
<div class="foo">test</div>
</body>`,
    { uglify: false },
  );

  let intended = `<head>
<style>
.foo{
color:red;
}
</style>
</head>
<body>
<div class="foo">test</div>
</body>`;

  equal(actual.result, intended, "33.01");
});

test.run();
