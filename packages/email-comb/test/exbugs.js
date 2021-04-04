import tap from "tap";
import { comb } from "./util/util";

// ex-bugs
// -----------------------------------------------------------------------------

tap.test("01 - color code hashes within head styles with no selectors", (t) => {
  const actual = comb(
    t,
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

  const intended = `<head>
<style>
a[href^="tel"], a[href^="sms"] { text-decoration: none; color: #525252; pointer-events: none; cursor: default;}
</style>
</head>
<body>
  some code
</body>
`;

  t.strictSame(
    actual.result,
    intended,
    "01 - there are no classes or id's in the query selector, checking false positives"
  );
  t.end();
});

tap.test("02 - selectors in head styles without classes or ids", (t) => {
  const actual = comb(
    t,
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

  const intended = `<head>
<style>
a {color: #525252;}
</style>
</head>
<body>
  some code
</body>
`;

  t.strictSame(
    actual.result,
    intended,
    "02 - there are no classes or id's in the query selector, checking false positives"
  );
  t.end();
});

tap.test('03 - sneaky attributes that end with characters "id"', (t) => {
  const actual = comb(
    t,
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

  const intended = `<!DOCTYPE html>
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

  t.strictSame(actual.result, intended, "03 - sneaky urlid attribute");
  t.end();
});

tap.test(
  '04 - mini version of 08.05, sneaky attributes ending with "class"',
  (t) => {
    const actual = comb(
      t,
      `<body>
<a href="zzz" superclass="26489" >Links</a>
</body>
</html>
`
    );

    const intended = `<body>
<a href="zzz" superclass="26489" >Links</a>
</body>
</html>
`;

    t.strictSame(actual.result, intended, "04 - sneaky superclass attribute");
    t.end();
  }
);

tap.test('05 - sneaky attributes that end with characters "class"', (t) => {
  const actual = comb(
    t,
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

  const intended = `<!DOCTYPE html>
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

  t.strictSame(actual.result, intended, "05 - sneaky superclass attribute");
  t.end();
});

tap.test("06 - color code hashes interpreted correctly, not as id's", (t) => {
  const actual = comb(
    t,
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

  const intended = ["#head-only-id1", ".mobile_link"];

  t.strictSame(
    actual.deletedFromHead,
    intended,
    "06 - look for #525252 in head styles, it should not be among results - v2.6.0+"
  );
  t.end();
});

tap.test("07 - one-letter classes (modern notation)", (t) => {
  const actual = comb(
    t,
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

  const intended = `<head>
<style type="text/css">
.h{display:none !important;}
</style>
</head>
<body>
<span class="h">z</span>
</body>
`;

  t.strictSame(actual.result, intended, "07 - class .h should not get removed");
  t.end();
});

tap.test("08 - one-letter classes (old notation)", (t) => {
  const actual = comb(
    t,
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

  const intended = `<head>
<style type="text/css">
*[class].h{display:none !important;}
</style>
</head>
<body>
<span class="h">z</span>
</body>
`;

  t.strictSame(actual.result, intended, "08 - class .h should not get removed");
  t.end();
});

tap.test("09 - one-letter classes - comprehensive comparison", (t) => {
  const actual = comb(
    t,
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

  const intended = {
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

  t.equal(
    actual.allInHead.sort().join(" - "),
    intended.allInHead.sort().join(" - "),
    "09.01 - allInHead"
  );
  t.equal(
    actual.allInBody.sort().join(" - "),
    intended.allInBody.sort().join(" - "),
    "09.02 - allInBody"
  );
  t.equal(
    actual.deletedFromHead.sort().join(" - "),
    intended.deletedFromHead.sort().join(" - "),
    "09.03 - deletedFromHead"
  );
  t.equal(
    actual.deletedFromBody.sort().join(" - "),
    intended.deletedFromBody.sort().join(" - "),
    "09.04 - deletedFromBody"
  );
  t.equal(actual.result, intended.result, "09.05 - result");
  t.end();
});

tap.test("10 - checking whole results object, all its keys #1", (t) => {
  const actual = comb(
    t,
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

  const intended = {
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

  t.strictSame(
    actual.allInHead.sort(),
    intended.allInHead.sort(),
    "10.01 - allInHead"
  );
  t.strictSame(
    actual.allInBody.sort(),
    intended.allInBody.sort(),
    "10.02 - allInBody"
  );
  t.strictSame(
    actual.deletedFromHead.sort(),
    intended.deletedFromHead.sort(),
    "10.03 - deletedFromHead"
  );
  t.strictSame(
    actual.deletedFromBody.sort(),
    intended.deletedFromBody.sort(),
    "10.04 - deletedFromBody"
  );
  t.strictSame(actual.result, intended.result, "10.05 - result");
  t.end();
});

tap.test("11 - checking whole results object, all its keys #2", (t) => {
  const actual = comb(
    t,
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

  const intended = {
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

  t.strictSame(
    actual.allInHead.sort(),
    intended.allInHead.sort(),
    "11.01 - allInHead"
  );
  t.strictSame(
    actual.allInBody.sort(),
    intended.allInBody.sort(),
    "11.02 - allInBody"
  );
  t.strictSame(
    actual.deletedFromHead.sort(),
    intended.deletedFromHead.sort(),
    "11.03 - deletedFromHead"
  );
  t.strictSame(
    actual.deletedFromBody.sort(),
    intended.deletedFromBody.sort(),
    "11.04 - deletedFromBody"
  );
  t.strictSame(actual.result, intended.result, "11.05 - result");
  t.end();
});

tap.test("12 - Cosmin's reported bug", (t) => {
  const srcs = [
    `<body><a href="http://a.b/c?d=2&id=xyz&e=0">\n`,
    `<body><a href="http://a.b/c?d=2&class=xyz&e=0">\n`,
  ];
  srcs.forEach((src) => {
    t.strictSame(comb(t, src).result, src);
  });
  t.end();
});

tap.test("13 - inner whitespace #1", (t) => {
  const inp = `<style>
.abc {font-family: cursive;}
</style>
</head>
<body>
<br class="xyz klm abc">
</td>
`;

  const outp = `<style>
.abc {font-family: cursive;}
</style>
</head>
<body>
<br class="abc">
</td>
`;
  t.strictSame(comb(t, inp).result, outp, "13");
  t.end();
});

tap.test("14 - inner whitespace #2", (t) => {
  const inp = `<style>
.abc {font-family: cursive;}
</style>
</head>
<body>
<br class="xyz klm  abc">
</td>
`;

  const outp = `<style>
.abc {font-family: cursive;}
</style>
</head>
<body>
<br class="abc">
</td>
`;
  t.strictSame(comb(t, inp).result, outp, "14");
  t.end();
});

tap.test("15 - inner whitespace #3", (t) => {
  const inp = `<style>
.abc {font-family: cursive;}
</style>
</head>
<body>
<br class="xyz abc klm ">
</td>
`;

  const outp = `<style>
.abc {font-family: cursive;}
</style>
</head>
<body>
<br class="abc">
</td>
`;
  t.strictSame(comb(t, inp).result, outp, "15");
  t.end();
});

tap.test("16 - adhoc", (t) => {
  const inp = `<style>
@media only screen{
  .klm{ font-size:16px !important; }
}
</style>
<body>
<a href="a("'")">
<td class="klm nop">
`;

  const outp = `<style>
@media only screen{
  .klm{ font-size:16px !important; }
}
</style>
<body>
<a href="a("'")">
<td class="klm">
`;
  t.strictSame(comb(t, inp).result, outp, "16");
  t.end();
});

tap.test("17 - adhoc", (t) => {
  const inp = `<style>
@media only screen{
  .klm{ font-size:16px !important; }
}
</style>
<body>
<a class="aaa bbb ccc-ddd" href="https://www.maps.com/search/?api=1&query={{ prs.tuv.wxy | lower | replace(" ", "+") | replace("'", "%27") | replace("&", "%26") | replace("(", "%28") | replace(")", "%29") }}" target="_blank" style="font-size: 18px;">&nbsp; &nbsp;CLICK ME&nbsp; &nbsp;</a>
<td class="klm nop">
`;

  const outp = `<style>
@media only screen{
  .klm{ font-size:16px !important; }
}
</style>
<body>
<a href="https://www.maps.com/search/?api=1&query={{ prs.tuv.wxy | lower | replace(" ", "+") | replace("'", "%27") | replace("&", "%26") | replace("(", "%28") | replace(")", "%29") }}" target="_blank" style="font-size: 18px;">&nbsp; &nbsp;CLICK ME&nbsp; &nbsp;</a>
<td class="klm">
`;
  t.strictSame(comb(t, inp).result, outp, "17");
  t.end();
});

tap.test("18 - adhoc", (t) => {
  const inp = `<style>
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

  const outp = `<style>
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
  t.strictSame(comb(t, inp).result, outp, "18");
  t.end();
});

tap.test("19 - #40 - pre", (t) => {
  const inp = `<pre>Dear name.

How are you?
Yours sincerely,

	Good person</pre>`;
  t.strictSame(comb(t, inp).result, inp, "19");
  t.end();
});
