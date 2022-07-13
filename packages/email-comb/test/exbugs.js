import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
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
`
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

  equal(
    actual.result,
    intended,
    "01 - there are no classes or id's in the query selector, checking false positives"
  );
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
`
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

  equal(
    actual.result,
    intended,
    "02 - there are no classes or id's in the query selector, checking false positives"
  );
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
`
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

  equal(actual.result, intended, "03 - sneaky urlid attribute");
});

test('04 - mini version of 08.05, sneaky attributes ending with "class"', () => {
  let actual = comb(
    `<body>
<a href="zzz" superclass="26489" >Links</a>
</body>
</html>
`
  );

  let intended = `<body>
<a href="zzz" superclass="26489" >Links</a>
</body>
</html>
`;

  equal(actual.result, intended, "04 - sneaky superclass attribute");
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
`
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

  equal(actual.result, intended, "05 - sneaky superclass attribute");
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
`
  );

  let intended = ["#head-only-id1", ".mobile_link"];

  equal(
    actual.deletedFromHead,
    intended,
    "06 - look for #525252 in head styles, it should not be among results - v2.6.0+"
  );
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
`
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

  equal(actual.result, intended, "07 - class .h should not get removed");
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
`
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

  equal(actual.result, intended, "08 - class .h should not get removed");
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
</html>`
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
    "09.01 - allInHead"
  );
  equal(
    actual.allInBody.sort().join(" - "),
    intended.allInBody.sort().join(" - "),
    "09.02 - allInBody"
  );
  equal(
    actual.deletedFromHead.sort().join(" - "),
    intended.deletedFromHead.sort().join(" - "),
    "09.03 - deletedFromHead"
  );
  equal(
    actual.deletedFromBody.sort().join(" - "),
    intended.deletedFromBody.sort().join(" - "),
    "09.04 - deletedFromBody"
  );
  equal(actual.result, intended.result, "09.05 - result");
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
</html>`
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

  equal(
    actual.allInHead.sort(),
    intended.allInHead.sort(),
    "10.01 - allInHead"
  );
  equal(
    actual.allInBody.sort(),
    intended.allInBody.sort(),
    "10.02 - allInBody"
  );
  equal(
    actual.deletedFromHead.sort(),
    intended.deletedFromHead.sort(),
    "10.03 - deletedFromHead"
  );
  equal(
    actual.deletedFromBody.sort(),
    intended.deletedFromBody.sort(),
    "10.04 - deletedFromBody"
  );
  equal(actual.result, intended.result, "10.05 - result");
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
`
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

  equal(
    actual.allInHead.sort(),
    intended.allInHead.sort(),
    "11.01 - allInHead"
  );
  equal(
    actual.allInBody.sort(),
    intended.allInBody.sort(),
    "11.02 - allInBody"
  );
  equal(
    actual.deletedFromHead.sort(),
    intended.deletedFromHead.sort(),
    "11.03 - deletedFromHead"
  );
  equal(
    actual.deletedFromBody.sort(),
    intended.deletedFromBody.sort(),
    "11.04 - deletedFromBody"
  );
  equal(actual.result, intended.result, "11.05 - result");
});

test("12 - Cosmin's reported bug", () => {
  let srcs = [
    `<body><a href="http://a.b/c?d=2&id=xyz&e=0">\n`,
    `<body><a href="http://a.b/c?d=2&class=xyz&e=0">\n`,
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
  equal(comb(inp).result, outp, "13");
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
  equal(comb(inp).result, outp, "14");
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
  equal(comb(inp).result, outp, "15");
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
  equal(comb(inp).result, outp, "16");
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
  equal(comb(inp).result, outp, "17");
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
  equal(comb(inp).result, outp, "18");
});

test("19 - #40 - pre", () => {
  let inp = `<pre>Dear name.

How are you?
Yours sincerely,

\tGood person</pre>`;
  equal(comb(inp).result, inp, "19");
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
`
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

  equal(actual.result, intended, "20");
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
`
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

  equal(actual.result, intended, "21");
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
`
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

  equal(actual.result, intended, "22");
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
`
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

  equal(actual.result, intended, "23");
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
`
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

  equal(actual.result, intended, "24");
});

test.run();
