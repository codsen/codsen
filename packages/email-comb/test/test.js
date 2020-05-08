/* eslint max-len:0 */

import tap from "tap";
import { comb } from "../dist/email-comb.esm";

// ==============================
// testing basic class/id removal
// ==============================

tap.test("01 - mvp #1", (t) => {
  const source = `<head>
<style type="text/css">
  .unused1[z] {a:1;}
  .used[z] {a:2;}
</style>
</head>
<body class="  used  "><a class="used unused3">z</a>
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

  t.equal(comb(source).result, intended, "01");
  t.end();
});

tap.test("02 - mvp #2", (t) => {
  const source = `<head>
<style type="text/css">
@namespace url(z);
@media (max-width: 600px) {
  .xx[z] {a:1;}
}
</style>
</head>
<body  class="  zz  "><a   class="yy zz">z</a>
</body>
`;

  const intended = `<head>
<style type="text/css">
@namespace url(z);
</style>
</head>
<body><a>z</a>
</body>
`;

  t.equal(comb(source).result, intended, "02");
  t.end();
});

tap.test("03 - removes @charset", (t) => {
  const source = `<head>
@charset "utf-8";
<style type="text/css">@media (max-width: 600px) {
  @supports (display: grid) {
    .rr {
      display: grid;
    }
  }
  @media (max-width: 600px) {
  .xx[z] {a:1;}
}
}
</style>
</head>
<body  class="  zz  "><a   class="yy zz">z</a>
</body>
`;

  const intended = `<head>
@charset "utf-8";
</head>
<body><a>z</a>
</body>
`;

  t.equal(comb(source).result, intended, "03");
  t.end();
});

tap.test("04 - multiple classes and id's", (t) => {
  const source = `<style>
<!--[if mso]>
<![endif]-->
  .b {a:1;}
  .a {a:2;}
  #a{b:1;}
  #b{b:2;}
</style>
<body><a class="a" id="a">z</a>
</body>
`;

  const intended = `<style>
  .a {a:2;}
  #a{b:1;}
</style>
<body><a class="a" id="a">z</a>
</body>
`;

  t.equal(comb(source).result, intended, "04");
  t.end();
});

tap.test("05 - mixed classes and non-classes", (t) => {
  const source = `<head>
<style type="text/css">
  aa, .unused[z], bb {z:2;}
</style>
</head>
<body><a>z</a>
</body>
`;

  const intended = `<head>
<style type="text/css">
  aa, bb {z:2;}
</style>
</head>
<body><a>z</a>
</body>
`;

  t.equal(comb(source).result, intended, "05");
  t.end();
});

tap.test("06 - mixed classes and non-classes", (t) => {
  const source = `<head>
<style type="text/css">
  aa, .unused[z], bb {z:2;}
</style>
</head>
<body id   =   ""  ><a class  =  "" >z</a>
</body>
`;

  const intended = `<head>
<style type="text/css">
  aa, bb {z:2;}
</style>
</head>
<body><a>z</a>
</body>
`;

  t.equal(comb(source).result, intended, "06");
  t.end();
});

tap.test("07 - sandwitched used and unused", (t) => {
  const source = `<head>
<style type="text/css">
  .used1 {z:1;}
  .used2.unused {z:2;}
</style>
</head>
<body class="used1"><a class="used2">z</a>
</body>
`;

  const intended = `<head>
<style type="text/css">
  .used1 {z:1;}
</style>
</head>
<body class="used1"><a>z</a>
</body>
`;

  t.equal(comb(source).result, intended, "07");
  t.end();
});

tap.test("08 - sandwitched used and unused", (t) => {
  const actual = comb(`<head>
  <style>
    #ab.cd[lang|en]   , .cd   { w:1; }
  </style>
</head>
<body><br class="cd">
</body>
  `).result;

  const intended = `<head>
  <style>
    .cd { w:1; }
  </style>
</head>
<body><br class="cd">
</body>
`;

  t.equal(actual, intended, "08");
  t.end();
});

tap.test("09 - sandwitched used and unused", (t) => {
  const actual = comb(`<head>
  <style>
    #ab.cd[lang|en]   , .cd#ef, .cd, .cd#ef   { w:1; }
  </style>
</head>
<body><br class="cd">
</body>
  `).result;

  const intended = `<head>
  <style>
    .cd { w:1; }
  </style>
</head>
<body><br class="cd">
</body>
`;

  t.equal(actual, intended, "09");
  t.end();
});

tap.test("10 - sandwitched used and unused", (t) => {
  const actual = comb(`<head>
  <style>
    #ab.cd[lang|en]   , .cd#ef { w:1; }
  </style>
</head>
<body><br class="cd">
</body>
`).result;

  const intended = `<head>
</head>
<body><br>
</body>
`;

  t.equal(actual, intended, "10");
  t.end();
});

tap.test("11 - mixed: classes and tag names", (t) => {
  const actual = comb(`<head>
<style>
/*! .x *//*! .y */
/*! #z */
  aa, .bb, cc { w:1; }
</style>
<body><br class="dd">
</body>
`).result;

  const intended = `<head>
<style>
  aa, cc { w:1; }
</style>
<body><br>
</body>
`;

  t.equal(actual, intended, "11");
  t.end();
});

tap.test("12 - removes unused classes and uglifies at the same time", (t) => {
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

  const actual = comb(source, { uglify: true }).result;
  const actualNotUglified = comb(source, { uglify: false }).result;
  const actual2 = comb(source, { uglify: 1 }).result;

  t.equal(actual, uglified, "12.01");

  // uglify option given as number:
  t.equal(actual2, uglified, "12.02");

  // not uglified:
  t.equal(actualNotUglified, intended, "12.03");

  // uglification disabled:
  const actual3 = comb(source, { uglify: false }).result;
  t.equal(actual3, intended, "12.04");

  const actual4 = comb(source, { uglify: 0 }).result;
  t.equal(actual4, intended, "12.05");

  const actual5 = comb(source, { uglify: 1 }).result;
  t.equal(actual5, uglified, "12.06");
  t.end();
});

tap.test("13 - adhoc #1", (t) => {
  const actual = comb(`<style>
  .aa{b: c;}
</style>
<body>
<table  id="  zz"  class="aa">
</body>
`).result;

  const intended = `<style>
  .aa{b: c;}
</style>
<body>
<table class="aa">
</body>
`;

  t.equal(actual, intended, "13");
  t.end();
});

tap.test("14 - adhoc 2", (t) => {
  const actual = comb(`<head>
<style type="text/css">
  .aa {z:2;}
</style>
</head>
<body><a class="  aa   bb  cc  ">z</a>
</body>
`).result;

  const intended = `<head>
<style type="text/css">
  .aa {z:2;}
</style>
</head>
<body><a class="aa">z</a>
</body>
`;

  t.equal(actual, intended, "14");
  t.end();
});

tap.test("15 - adhoc 3", (t) => {
  const actual = comb(`<head>
<style type="text/css">
  @media y z (a-a:0px){.col-1,.col-2,.zz{m:100%!n}}
</style>
</head>
<body><a class="  zz   bb  cc  ">z</a>
</body>
`).result;

  const intended = `<head>
<style type="text/css">
  @media y z (a-a:0px){.zz{m:100%!n}}
</style>
</head>
<body><a class="zz">z</a>
</body>
`;

  t.equal(actual, intended, "15");
  t.end();
});

tap.test("16 - mixed classes and non-classes", (t) => {
  const actual = comb(`<head>
<style type="text/css">
  @import;
  aa, .unused[z], bb {z:2;}
</style>
</head>
<body><a>z</a>
</body>
`).result;

  const intended = `<head>
<style type="text/css">
  aa, bb {z:2;}
</style>
</head>
<body><a>z</a>
</body>
`;

  t.equal(actual, intended, "16");
  t.end();
});

tap.test("17 - removes classes and id's from HTML5 (normal input)", (t) => {
  const source = `
<!DOCTYPE html>
<head>
<title>Dummy HTML</title>
<style type="text/css">
  .real-class-1:active, #head-only-id1[whatnot], whatever[lang|en]{width:100% !important;}
  #real-id-1:hover{width:100% !important;}
</style>
</head>
< body>
<table id="     real-id-1    body-only-id-1    " class="     body-only-class-1 " width="100%" cellspacing="0">
  <tr>
    <td>
      <table width="100%" cellspacing="0">
        <tr id="      body-only-id-4     ">
          <td id="     body-only-id-2     body-only-id-3   " class="     real-class-1      body-only-class-2     body-only-class-3 ">
            Dummy content.
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>
`;

  const intended = `<!DOCTYPE html>
<head>
<title>Dummy HTML</title>
<style type="text/css">
  .real-class-1:active, whatever[lang|en]{width:100% !important;}
  #real-id-1:hover{width:100% !important;}
</style>
</head>
<body>
<table id="real-id-1" width="100%" cellspacing="0">
  <tr>
    <td>
      <table width="100%" cellspacing="0">
        <tr>
          <td class="real-class-1">
            Dummy content.
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>
`;

  t.same(comb(source).result, intended, "17");
  t.end();
});

tap.test("18 - removes classes and id's from HTML5 - uglifies", (t) => {
  const actual = comb(
    `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Dummy HTML</title>
  <style type="text/css">
    .real-class-1.real-class-2:active, #head-only-id1[whatnot], whatever[lang|en]{width:100% !important;}
    #real-id-1:hover{width:100% !important;}
  </style>
</head>
<body>
  <table id='real-id-1 body-only-id-1' class='body-only-class-1' width='100%' border='0' cellpadding='0' cellspacing='0'>
    <tr>
      <td>
        <table width='100%' border='0' cellpadding='0' cellspacing='0'>
          <tr id='body-only-id-4'>
            <td id='body-only-id-2 body-only-id-3' class='real-class-1 body-only-class-2 real-class-2'>
              Dummy content.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`,
    { uglify: true }
  ).result;

  const intended = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Dummy HTML</title>
  <style type="text/css">
    .v.w:active, whatever[lang|en]{width:100% !important;}
    #t:hover{width:100% !important;}
  </style>
</head>
<body>
  <table id='t' width='100%' border='0' cellpadding='0' cellspacing='0'>
    <tr>
      <td>
        <table width='100%' border='0' cellpadding='0' cellspacing='0'>
          <tr>
            <td class='v w'>
              Dummy content.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  t.same(actual, intended, "18");
  t.end();
});

tap.test("19 - deletes blank class/id attrs", (t) => {
  const actual = comb(`
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
      <title>Dummy HTML</title>
      <style type="text/css">
        #real-id-1:hover{width:100% !important;}
        .real-class-1:hover{width:100% !important;}
      </style>
  </head>
  <body>
    <table id="body-only-id-1 body-only-id-2" class="body-only-class-1 body-only-class-2" width="100%" border="0" cellpadding="0" cellspacing="0">
      <tr>
        <td id="" class="">
          <table width="100%" border="0" cellpadding="0" cellspacing="0">
            <tr id="real-id-1" class="real-class-1">
              <td>
                Dummy content.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`).result;

  const intended = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
      <title>Dummy HTML</title>
      <style type="text/css">
        #real-id-1:hover{width:100% !important;}
        .real-class-1:hover{width:100% !important;}
      </style>
  </head>
  <body>
    <table width="100%" border="0" cellpadding="0" cellspacing="0">
      <tr>
        <td>
          <table width="100%" border="0" cellpadding="0" cellspacing="0">
            <tr id="real-id-1" class="real-class-1">
              <td>
                Dummy content.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

  t.same(actual, intended, "19");
  t.end();
});

tap.test(
  "20 - class present in both head and body, but head has it joined with nonexistent id",
  (t) => {
    const actual = comb(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>test</title>
  <style type="text/css" media="screen">
    .real-class-1#head-only-id-1, #head-only-id-2.real-class-1[lang|en]{ width:100% !important; }
  </style>
</head>
<body>
  <table class="real-class-1">
    <tr>
      <td class="real-class-1">
        <img src="spacer.gif">
      </td>
    </tr>
  </table>
</body>
</html>
`).result;

    const intended = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>test</title>
</head>
<body>
  <table>
    <tr>
      <td>
        <img src="spacer.gif">
      </td>
    </tr>
  </table>
</body>
</html>
`;
    t.same(actual, intended, "20");
    t.end();
  }
);

tap.test("21 - multiple style tags recognised and transformed", (t) => {
  const actual = comb(`
<!DOCTYPE html>
<html lang="en">
<head>
<style type="text/css">
  .real-class-1#head-only-id-1[lang|en]{width:100% !important;}
  #real-id-1.head-only-class-1:hover{display: block !important;}
  .head-only-class-2[lang|en]{width: 100% !important;}
  #real-id-1{font-size: 10px !important;}
</style>
<title>zzzz</title>
<style type="text/css">
  .real-class-1#head-only-id-1[lang|en]{width:100% !important;}
  #real-id-1.head-only-class-1:hover{display: block !important;}
  .head-only-class-3[lang|en]{width: 100% !important;}
  div .real-class-1 a:hover {width: 50%;}
</style>
</head>
<body>
<table id="real-id-1" width="100%" border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td class="real-class-1">
      <img src="spacer.gif">
    </td>
  </tr>
</table>
</body>
</html>
`).result;

  const intended = `<!DOCTYPE html>
<html lang="en">
<head>
<style type="text/css">
  #real-id-1{font-size: 10px !important;}
</style>
<title>zzzz</title>
<style type="text/css">
  div .real-class-1 a:hover {width: 50%;}
</style>
</head>
<body>
<table id="real-id-1" width="100%" border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td class="real-class-1">
      <img src="spacer.gif">
    </td>
  </tr>
</table>
</body>
</html>
`;

  t.same(actual, intended, "21");
  t.end();
});

tap.test("22 - multiple levels of media queries cleaned", (t) => {
  const actual = comb(`
<!DOCTYPE html>
<head>
<style type="text/css">
  @media (max-width: 600px) {
    .real-class-1#head-only-id-1[lang|en]{width:100% !important;}
    #real-id-1.head-only-class-1:hover{display: block !important;}
    .head-only-class-2[lang|en]{width: 100% !important;}
    @media (max-width: 200px) {
      #real-id-1{font-size: 10px !important;}
    }
    @media (max-width: 100px) {
      .head-only-class-1{font-size: 10px !important;}
    }
  }
</style>
<title>zzzz</title>
<style type="text/css">
  .real-class-1#head-only-id-1[lang|en]{width:100% !important;}
  #real-id-1.head-only-class-1:hover{display: block !important;}
  .head-only-class-3[lang|en]{width: 100% !important;}
  div .real-class-1 a:hover {width: 50%;}
</style>
</head>
<body>
<table id="real-id-1" width="100%" border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td class="real-class-1">
      <img src="spacer.gif">
    </td>
  </tr>
</table>
</body>
</html>
`).result;

  const intended = `<!DOCTYPE html>
<head>
<style type="text/css">
  @media (max-width: 600px) {
    @media (max-width: 200px) {
      #real-id-1{font-size: 10px !important;}
    }
  }
</style>
<title>zzzz</title>
<style type="text/css">
  div .real-class-1 a:hover {width: 50%;}
</style>
</head>
<body>
<table id="real-id-1" width="100%" border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td class="real-class-1">
      <img src="spacer.gif">
    </td>
  </tr>
</table>
</body>
</html>
`;

  t.same(actual, intended, "22");
  t.end();
});

tap.test(
  "23 - multiple levels of media queries cleaned + @supports wrap",
  (t) => {
    const actual = comb(`
<!DOCTYPE html>
<head>
<style type="text/css">
  @charset "utf-8";
  @supports (display: flex) {
    @media (max-width: 600px) {
      .real-class-1#head-only-id-1[lang|en]{width:100% !important;}
      #real-id-1.head-only-class-1:hover{display: block !important;}
      .head-only-class-2[lang|en]{width: 100% !important;}
      @media (max-width: 200px) {
        #real-id-1{font-size: 10px !important;}
      }
      @media (max-width: 100px) {
        .head-only-class-1{font-size: 10px !important;}
      }
    }
  }
</style>
<title>zzzz</title>
<style type="text/css">
  .real-class-1#head-only-id-1[lang|en]{width:100% !important;}
  #real-id-1.head-only-class-1:hover{display: block !important;}
  .head-only-class-3[lang|en]{width: 100% !important;}
  div .real-class-1 a:hover {width: 50%;}
</style>
</head>
<body>
<table id="real-id-1" width="100%" border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td class="real-class-1">
      <img src="spacer.gif">
    </td>
  </tr>
</table>
</body>
</html>
`).result;

    const intended = `<!DOCTYPE html>
<head>
<style type="text/css">
  @charset "utf-8";
  @supports (display: flex) {
    @media (max-width: 600px) {
      @media (max-width: 200px) {
        #real-id-1{font-size: 10px !important;}
      }
    }
  }
</style>
<title>zzzz</title>
<style type="text/css">
  div .real-class-1 a:hover {width: 50%;}
</style>
</head>
<body>
<table id="real-id-1" width="100%" border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td class="real-class-1">
      <img src="spacer.gif">
    </td>
  </tr>
</table>
</body>
</html>
`;

    t.same(actual, intended, "23");
    t.end();
  }
);

tap.test("24 - empty media queries removed", (t) => {
  const actual = comb(`
<!DOCTYPE html>
<head>
<style type="text/css">
  @media (max-width: 600px) {
    @media (max-width: 200px) {
      .head-only-class-1{font-size: 10px !important;}
    }
    @media (max-width: 100px) {
      .head-only-class-2{font-size: 10px !important;}
    }
  }
</style>
<title>zzzz</title>
<style type="text/css">
@media (max-width: 600px) {
  @media (max-width: 200px) {
    .head-only-class-3{font-size: 10px !important;}
  }
  @media (max-width: 100px) {
    .head-only-class-4{font-size: 10px !important;}
  }
}
</style>
</head>
<body>
<table id="">
  <tr>
    <td class="">
      <img src="spacer.gif">
    </td>
  </tr>
</table>
</body>
</html>
`).result;

  const intended = `<!DOCTYPE html>
<head>
<title>zzzz</title>
</head>
<body>
<table>
  <tr>
    <td>
      <img src="spacer.gif">
    </td>
  </tr>
</table>
</body>
</html>
`;

  t.same(actual, intended, "24");
  t.end();
});

tap.test("25 - style tags are outside HEAD", (t) => {
  const actual = comb(`
<!DOCTYPE html>
<style>
@media (max-width: 600px) {
@media (max-width: 200px) {
  .head-only-class-1{font-size: 10px !important;}
}
@media (max-width: 100px) {
  .head-only-class-2{font-size: 10px !important;}
}
}
</style>
<head>
<title>zzzz</title>
</head>
<body>
<style type="text/css">
@media (max-width: 600px) {
@media (max-width: 200px) {
  .head-only-class-3{font-size: 10px !important;}
}
@media (max-width: 100px) {
  .head-only-class-4{font-size: 10px !important;}
}
}
</style>
<table id="">
  <tr>
    <td class="">
      <img src="spacer.gif">
    </td>
  </tr>
</table>
</body>
</html>
`).result;

  const intended = `<!DOCTYPE html>
<head>
<title>zzzz</title>
</head>
<body>
<table>
  <tr>
    <td>
      <img src="spacer.gif">
    </td>
  </tr>
</table>
</body>
</html>
`;

  t.same(actual, intended, "25");
  t.end();
});

// original GitHub issue #3
tap.test(
  "26 - removes media query together with the whole style tag #1",
  (t) => {
    const actual = comb(`<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width">
<title>test</title>
<style>
@media screen {
._text-color.black {
  color:  black;
}
}
</style></head>
<body>
</body>
</html>
`).result;

    const intended = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width">
<title>test</title>
</head>
<body>
</body>
</html>
`;

    t.same(actual, intended, "26");
    t.end();
  }
);

tap.test(
  "27 - removes media query together with the whole style tag #2",
  (t) => {
    const actual = comb(`<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width">
<title>test</title>
<style>
@media screen {
._text-color.black {
  color: black;
}
}
</style></head>
<body class="_text-color  black">
zzz
</body>
</html>
`).result;

    const intended = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width">
<title>test</title>
<style>
@media screen {
._text-color.black {
  color: black;
}
}
</style></head>
<body class="_text-color black">
zzz
</body>
</html>
`;

    t.same(actual, intended, "27");
    t.end();
  }
);

tap.test(
  "28 - removes three media queries together with the style tags",
  (t) => {
    const actual = comb(`<!doctype html>
<html>
<head>
<meta charset="utf-8">
<style>
@media screen {
#_something-here#green {
  color:  green;
  display: block;
}
}
</style>
<meta name="viewport" content="width=device-width">
<style>
@media screen {
._something-else.red {
  color:  red;
}
}
</style>
<title>test</title>
<style>
@media screen {
._text-color.black {
  color:  black;
}
}
</style></head>
<body class="black">
</body>
</html>
`).result;

    const intended = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width">
<title>test</title>
</head>
<body>
</body>
</html>
`;

    t.same(actual, intended, "28");
    t.end();
  }
);

tap.test("29 - removes last styles together with the whole style tag", (t) => {
  const actual = comb(`<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width">
<title>test</title>
<style>
._text-color.black {
color:  black;
}
</style></head>
<body>
</body>
</html>
`).result;

  const intended = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width">
<title>test</title>
</head>
<body>
</body>
</html>
`;

  t.same(actual, intended, "29");
  t.end();
});

tap.test("30 - media query with asterisk", (t) => {
  const actual = comb(`<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width">
<title>test</title>
<style>
@media * {
  ._text-color.black {
    color:  black;
  }
}
</style>
</head>
<body>
</body>
</html>
`).result;

  const intended = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width">
<title>test</title>
</head>
<body>
</body>
</html>
`;

  t.same(actual, intended, "30");
  t.end();
});

tap.test("31 - complex media query #1", (t) => {
  const actual = comb(`<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width">
<title>test</title>
<style>
@media tv and (min-width: 700px) and (orientation: landscape) {
  .text-color.black {
    color:  black;
  }
}
</style>
</head>
<body class="black">
</body>
</html>
`).result;

  const intended = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width">
<title>test</title>
</head>
<body>
</body>
</html>
`;

  t.same(actual, intended, "31");
  t.end();
});

tap.test("32 - complex media query #2", (t) => {
  const actual = comb(`<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width">
<title>test</title>
<style>
@media (min-width: 700px), handheld and (orientation: landscape) {
  ._text-color.black {
    color:  black;
  }
}
</style>
</head>
<body class="black">
</body>
</html>
`).result;

  const intended = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width">
<title>test</title>
</head>
<body>
</body>
</html>
`;

  t.same(actual, intended, "32");
  t.end();
});

tap.test("33 - deletes multiple empty style tags", (t) => {
  const actual = comb(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>test</title>
  <style type="text/css" media="screen">

  </style>
  <style type="text/css" media="screen">      </style>
</head>
<body>
  <table class="real-class-1">
    <tr>
      <td class="real-class-1">
        <img src="spacer.gif">
      </td>
    </tr>
  </table>
</body>
</html>
`).result;

  const intended = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>test</title>
</head>
<body>
  <table>
    <tr>
      <td>
        <img src="spacer.gif">
      </td>
    </tr>
  </table>
</body>
</html>
`;
  t.same(actual, intended, "33");
  t.end();
});

tap.test("34 - does not touch @font-face", (t) => {
  const actual = comb(`
<!DOCTYPE html>
<head>
<style type="text/css">
  @media (max-width: 600px) {
    @media (max-width: 200px) {
      .head-only-class-1{font-size: 10px !important;}
    }
    @media (max-width: 100px) {
      .head-only-class-2{font-size: 10px !important;}
    }
  }
  @font-face {
    font-family: 'My Font';
    font-style: normal;
    font-weight: normal;
    src: url(https://myserver.com/example.woff2) format('woff2');
  }
</style>
<title>zzzz</title>
<style type="text/css">
@media (max-width: 600px) {
  @media (max-width: 200px) {
    .head-only-class-3{font-size: 10px !important;}
  }
  @media (max-width: 100px) {
    .head-only-class-4{font-size: 10px !important;}
  }
}
</style>
</head>
<body>
<table id="">
  <tr>
    <td class="">
      <img src="spacer.gif">
    </td>
  </tr>
</table>
</body>
</html>
`).result;

  const intended = `<!DOCTYPE html>
<head>
<style type="text/css">
  @font-face {
    font-family: 'My Font';
    font-style: normal;
    font-weight: normal;
    src: url(https://myserver.com/example.woff2) format('woff2');
  }
</style>
<title>zzzz</title>
</head>
<body>
<table>
  <tr>
    <td>
      <img src="spacer.gif">
    </td>
  </tr>
</table>
</body>
</html>
`;

  t.same(actual, intended, "34");
  t.end();
});

tap.test(
  "35 - does not touch @import with query strings containing commas",
  (t) => {
    const actual = comb(`
<!DOCTYPE html>
<head>
<title>zzzz</title>
<style type="text/css">
  @import url('https://fonts.googleapis.com/css?family=Lato:400,400i,700');
</style>
</head>
<body>
<table id="">
  <tr>
    <td class="">
      <img src="spacer.gif">
    </td>
  </tr>
</table>
</body>
</html>
`).result;

    const intended = `<!DOCTYPE html>
<head>
<title>zzzz</title>
<style type="text/css">
  @import url('https://fonts.googleapis.com/css?family=Lato:400,400i,700');
</style>
</head>
<body>
<table>
  <tr>
    <td>
      <img src="spacer.gif">
    </td>
  </tr>
</table>
</body>
</html>
`;

    t.same(actual, intended, "35");
    t.end();
  }
);

tap.test(
  "36 - @media contains classes to remove, @import present in the vicinity",
  (t) => {
    const actual = comb(
      `<html lang="en">
<head>
<style type="text/css">

  @import url('https://fonts.googleapis.com/css?family=Meriweather|Open+Sans');
  @media only screen {
    .serif {font-family: 'Merriweather', Georgia, serif!important;}
    .sans-serif {font-family: 'Open Sans', Arial, sans-serif!important;}
  }

  #outlook a {padding: 0;}
</style>
</head>
<body>
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
      }
    ).result;

    const intended = `<html lang="en">
<head>
<style type="text/css">
  @import url('https://fonts.googleapis.com/css?family=Meriweather|Open+Sans');
  #outlook a {padding: 0;}
</style>
</head>
<body>
zzz
</body>
</html>
`;

    t.same(actual, intended, "36");
    t.end();
  }
);

tap.test("37 - @charset #1", (t) => {
  const actual = comb(
    `<html lang="en">
<head>
<style type="text/css">
  @charset "utf-8";
  @import url('https://fonts.googleapis.com/css?family=Meriweather|Open+Sans');
  @media only screen {
    .serif {font-family: 'Merriweather', Georgia, serif!important;}
    .sans-serif {font-family: 'Open Sans', Arial, sans-serif!important;}
  }

  #outlook a {padding: 0;}
</style>
</head>
<body>
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
    }
  ).result;

  const intended = `<html lang="en">
<head>
<style type="text/css">
  @charset "utf-8";
  @import url('https://fonts.googleapis.com/css?family=Meriweather|Open+Sans');
  #outlook a {padding: 0;}
</style>
</head>
<body>
zzz
</body>
</html>
`;

  t.same(actual, intended, "37");
  t.end();
});

tap.test("38 - @charset #2", (t) => {
  const actual = comb(
    `<html lang="en">
<head>
<style type="text/css">
  @charset "utf-8";
  #outlook a {padding: 0;}
</style>
</head>
<body>
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
    }
  ).result;

  const intended = `<html lang="en">
<head>
<style type="text/css">
  @charset "utf-8";
  #outlook a {padding: 0;}
</style>
</head>
<body>
zzz
</body>
</html>
`;

  t.same(actual, intended, "38");
  t.end();
});

tap.test("39 - @charset #3", (t) => {
  const actual = comb(
    `<html lang="en">
<head>
<style type="text/css">
  #outlook a {padding: 0;}
  @charset "utf-8";
  .ExternalClass { color: red !important; }
</style>
</head>
<body>
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
    }
  ).result;

  const intended = `<html lang="en">
<head>
<style type="text/css">
  #outlook a {padding: 0;}
  @charset "utf-8";
  .ExternalClass { color: red !important; }
</style>
</head>
<body>
zzz
</body>
</html>
`;

  t.same(actual, intended, "39");
  t.end();
});

tap.test("40 - @charset #4", (t) => {
  const actual = comb(
    `<html lang="en">
<head>
<style type="text/css">
  #outlook a {padding: 0;}
  .unused-class-1 { color: red !important;
  }
  @charset "utf-8";
  .unused-class-2 { color: red !important;
  }
</style>
</head>
<body>
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
    }
  ).result;

  const intended = `<html lang="en">
<head>
<style type="text/css">
  #outlook a {padding: 0;}
  @charset "utf-8";
</style>
</head>
<body>
zzz
</body>
</html>
`;

  t.same(actual, intended, "40");
  t.end();
});

tap.test("41 - @charset #5", (t) => {
  const actual = comb(
    `<html lang="en">
<head>
<style type="text/css">
  .unused-class-1 { color: red !important;
  }
  @charset "utf-8";
  .unused-class-2 { color: red !important;
  }
</style>
</head>
<body>
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
    }
  ).result;

  const intended = `<html lang="en">
<head>
<style type="text/css">
  @charset "utf-8";
</style>
</head>
<body>
zzz
</body>
</html>
`;

  t.same(actual, intended, "41");
  t.end();
});

tap.test("42 - at-rule is followed by whitespace and another at-rule", (t) => {
  const actual = comb(
    `<html lang="en">
<head>
<style type="text/css">

  @import
  @media only screen {
    .serif {font-family: 'Merriweather', Georgia, serif!important;}
    .sans-serif {font-family: 'Open Sans', Arial, sans-serif!important;}
  }

  #outlook a {padding: 0;}
</style>
</head>
<body>
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
    }
  ).result;

  const intended = `<html lang="en">
<head>
<style type="text/css">
  #outlook a {padding: 0;}
</style>
</head>
<body>
zzz
</body>
</html>
`;

  t.same(actual, intended, "42");
  t.end();
});

tap.test("43 - at-rule is followed by whitespace and another at-rule", (t) => {
  const actual = comb(
    `<html lang="en">
<head>
<style type="text/css">

  @charset
  @media only screen {
    .serif {font-family: 'Merriweather', Georgia, serif!important;}
    .sans-serif {font-family: 'Open Sans', Arial, sans-serif!important;}
  }

  #outlook a {padding: 0;}
</style>
</head>
<body>
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
    }
  ).result;

  const intended = `<html lang="en">
<head>
<style type="text/css">
  #outlook a {padding: 0;}
</style>
</head>
<body>
zzz
</body>
</html>
`;

  t.same(actual, intended, "43");
  t.end();
});

tap.test("44 - at-rule followed by closing </style>", (t) => {
  const actual = comb(
    `<html lang="en">
<head>
<style type="text/css">
  @media only screen {
    .serif {font-family: 'Merriweather', Georgia, serif!important;}
    .sans-serif {font-family: 'Open Sans', Arial, sans-serif!important;}
  }

  #outlook a {padding: 0;}
  @charset</style>
</head>
<body>
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
    }
  ).result;

  const intended = `<html lang="en">
<head>
<style type="text/css">
  #outlook a {padding: 0;}
  </style>
</head>
<body>
zzz
</body>
</html>
`;

  t.same(actual, intended, "44");
  t.end();
});

tap.test("45 - at-rule followed by semicolon without contents", (t) => {
  const actual = comb(
    `<html lang="en">
<head>
<style type="text/css">

  @import;
  @media only screen {
    .serif {font-family: 'Merriweather', Georgia, serif!important;}
    .sans-serif {font-family: 'Open Sans', Arial, sans-serif!important;}
  }

  #outlook a {padding: 0;}
</style>
</head>
<body>
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
    }
  ).result;

  const intended = `<html lang="en">
<head>
<style type="text/css">
  #outlook a {padding: 0;}
</style>
</head>
<body>
zzz
</body>
</html>
`;

  t.same(actual, intended, "45");
  t.end();
});

tap.test("46 - at-rule with single quotes", (t) => {
  const actual = comb(
    `<html lang="en">
<head>
<style type="text/css">

  @namespace 'XML-namespace-URL';
  @media only screen {
    .serif {font-family: 'Merriweather', Georgia, serif!important;}
    .sans-serif {font-family: 'Open Sans', Arial, sans-serif!important;}
  }

  #outlook a {padding: 0;}
</style>
</head>
<body>
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
    }
  ).result;

  const intended = `<html lang="en">
<head>
<style type="text/css">
  @namespace 'XML-namespace-URL';
  #outlook a {padding: 0;}
</style>
</head>
<body>
zzz
</body>
</html>
`;

  t.same(actual, intended, "46");
  t.end();
});

tap.test(
  "47 - removes classes wrapped with conditional Outlook comments",
  (t) => {
    const source = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Dummy HTML</title>
  <style type="text/css">
    <!--[if mso]>
    .unused-class-1, .unused-class2 table { display: block; }
    <![endif]-->
    .real-class-1:active, #head-only-id1[whatnot], whatever[lang|en]{width:100% !important;}
    #real-id-1:hover{width:100% !important;}
  </style>
</head>
<body>
  <table id="real-id-1 body-only-id-1" class="body-only-class-1" width="100%" border="0" cellpadding="0" cellspacing="0">
    <tr>
      <td>
        <table width="100%" border="0" cellpadding="0" cellspacing="0">
          <tr id="body-only-id-4">
            <td id="body-only-id-2 body-only-id-3" class="real-class-1 body-only-class-2">
              Dummy content.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

    const actual = comb(source).result;
    const actualUglified = comb(source, {
      uglify: true,
    }).result;

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
              Dummy content.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

    const intendedUglified = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Dummy HTML</title>
  <style type="text/css">
    .v:active, whatever[lang|en]{width:100% !important;}
    #t:hover{width:100% !important;}
  </style>
</head>
<body>
  <table id="t" width="100%" border="0" cellpadding="0" cellspacing="0">
    <tr>
      <td>
        <table width="100%" border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td class="v">
              Dummy content.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

    t.same(actual, intended, "47.01");
    t.same(actualUglified, intendedUglified, "47.02");
    t.end();
  }
);

tap.test(
  "48 - removes comments from style blocks - opts.removeHTMLComments + opts.removeCSSComments",
  (t) => {
    const source = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Dummy HTML</title>
<style type="text/css">
  .real-class-1:active, #head-only-id1[whatnot], whatever[lang|en]{width:100% !important;}
  /* some comments */
  #real-id-1:hover{width:100% !important;} /* some more comments */
</style>
</head>
< body>
<!-- zzz -->
<table id="     real-id-1    body-only-id-1    " class="     body-only-class-1 " width="100%" border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td>
      <table width="100%" border="0" cellpadding="0" cellspacing="0">
        <tr id="      body-only-id-4     ">
          <td id="     body-only-id-2     body-only-id-3   " class="     real-class-1      body-only-class-2     body-only-class-3 ">
            Dummy content.
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>
`;

    const cssAndHtmlCommentsRemoved = `<!DOCTYPE html>
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
            Dummy content.
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>
`;
    const htmlRemovedCssNot = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Dummy HTML</title>
<style type="text/css">
  .real-class-1:active, whatever[lang|en]{width:100% !important;}
  /* some comments */
  #real-id-1:hover{width:100% !important;} /* some more comments */
</style>
</head>
<body>
<table id="real-id-1" width="100%" border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td>
      <table width="100%" border="0" cellpadding="0" cellspacing="0">
        <tr>
          <td class="real-class-1">
            Dummy content.
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>
`;
    const cssRemovedHtmlNot = `<!DOCTYPE html>
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
<!-- zzz -->
<table id="real-id-1" width="100%" border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td>
      <table width="100%" border="0" cellpadding="0" cellspacing="0">
        <tr>
          <td class="real-class-1">
            Dummy content.
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>
`;
    const neitherCssNorHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Dummy HTML</title>
<style type="text/css">
  .real-class-1:active, whatever[lang|en]{width:100% !important;}
  /* some comments */
  #real-id-1:hover{width:100% !important;} /* some more comments */
</style>
</head>
<body>
<!-- zzz -->
<table id="real-id-1" width="100%" border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td>
      <table width="100%" border="0" cellpadding="0" cellspacing="0">
        <tr>
          <td class="real-class-1">
            Dummy content.
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>
`;
    t.same(comb(source).result, cssAndHtmlCommentsRemoved, "48.01 - defaults");
    t.same(
      comb(source, { removeCSSComments: true }).result,
      cssAndHtmlCommentsRemoved,
      "48.02 - hardcoded defaults"
    );
    t.same(
      comb(source, { removeCSSComments: false }).result,
      htmlRemovedCssNot,
      "48.03 - off"
    );

    t.same(
      comb(source, { removeCSSComments: true, removeHTMLComments: true })
        .result,
      cssAndHtmlCommentsRemoved,
      "48.04 - html on, css on"
    );
    t.same(
      comb(source, { removeCSSComments: false, removeHTMLComments: true })
        .result,
      htmlRemovedCssNot,
      "48.05 - html on, css off"
    );
    t.same(
      comb(source, { removeCSSComments: true, removeHTMLComments: false })
        .result,
      cssRemovedHtmlNot,
      "48.06 - html off, css on"
    );
    t.same(
      comb(source, { removeCSSComments: false, removeHTMLComments: false })
        .result,
      neitherCssNorHtml,
      "48.07 - html off, css off"
    );
    t.end();
  }
);

tap.test(
  "49 - false real class is commented-out and therefore gets removed",
  (t) => {
    const source = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Dummy HTML</title>
<style type="text/css">
  /*.real-class-1:active {width:100% !important;}*/
  #real-id-1:hover{width:100% !important;} /* some more comments */
</style>
</head>
< body>
<table id="     real-id-1    body-only-id-1    " class="     body-only-class-1 " width="100%" border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td>
      <table width="100%" border="0" cellpadding="0" cellspacing="0">
        <tr id="      body-only-id-4     ">
          <td id="     body-only-id-2     body-only-id-3   " class="     real-class-1      body-only-class-2     body-only-class-3 ">
            Dummy content.
          </td>
        </tr>
      </table>
    </td>
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
  #real-id-1:hover{width:100% !important;}
</style>
</head>
<body>
<table id="real-id-1" width="100%" border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td>
      <table width="100%" border="0" cellpadding="0" cellspacing="0">
        <tr>
          <td>
            Dummy content.
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>
`;

    t.same(comb(source).result, intended, "49");
    t.end();
  }
);

tap.test("50 - copes with @font-face within media query", (t) => {
  const source = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Dummy HTML</title>
<style type="text/css">
  #real-id-1:hover{width:100% !important;} /* some more comments */
  @media screen {
    @font-face {
      font-family:CodsenNormal;
      src:url(http://codsen.com/fonts/bold.eot); src:url(http://codsen.com/fonts/bold.eot?#iefix) format("embedded-opentype"),url(http://codsen.com/fonts/bold.woff2) format("woff2"),url(http://codsen.com/fonts/bold.woff) format("woff"),url(http://codsen.com/fonts/bold.ttf) format("truetype"),url(http://codsen.com/fonts/bold.svg#Codsenbold) format("svg");
      font-weight:600;
      font-style:normal;
    }
    @font-face {
      font-family:CodsenCondensed;
      src:url(http://codsen.com/fonts/condensedbook.eot);
      src:url(http://codsen.com/fonts/condensedbook.eot?#iefix) format("embedded-opentype"),url(http://codsen.com/fonts/condensedbook.woff2) format("woff2"),url(http://codsen.com/fonts/condensedbook.woff) format("woff"),url(http://codsen.com/fonts/condensedbook.ttf) format("truetype"),url(http://codsen.com/fonts/condensedbook.svg#Codsencondensed_book) format("svg");
      font-weight:400;
      font-style:normal;
    }
  }
  .real-class-1:active, #head-only-id1[whatnot], whatever[lang|en]{width:100% !important;}
</style>
</head>
< body>
<table id="     real-id-1    body-only-id-1    " class="     body-only-class-1 " width="100%" border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td>
      <table width="100%" border="0" cellpadding="0" cellspacing="0">
        <tr id="      body-only-id-4     ">
          <td id="     body-only-id-2     body-only-id-3   " class="     real-class-1      body-only-class-2     body-only-class-3 ">
            Dummy content.
          </td>
        </tr>
      </table>
    </td>
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
  #real-id-1:hover{width:100% !important;}
  @media screen {
    @font-face {
      font-family:CodsenNormal;
      src:url(http://codsen.com/fonts/bold.eot); src:url(http://codsen.com/fonts/bold.eot?#iefix) format("embedded-opentype"),url(http://codsen.com/fonts/bold.woff2) format("woff2"),url(http://codsen.com/fonts/bold.woff) format("woff"),url(http://codsen.com/fonts/bold.ttf) format("truetype"),url(http://codsen.com/fonts/bold.svg#Codsenbold) format("svg");
      font-weight:600;
      font-style:normal;
    }
    @font-face {
      font-family:CodsenCondensed;
      src:url(http://codsen.com/fonts/condensedbook.eot);
      src:url(http://codsen.com/fonts/condensedbook.eot?#iefix) format("embedded-opentype"),url(http://codsen.com/fonts/condensedbook.woff2) format("woff2"),url(http://codsen.com/fonts/condensedbook.woff) format("woff"),url(http://codsen.com/fonts/condensedbook.ttf) format("truetype"),url(http://codsen.com/fonts/condensedbook.svg#Codsencondensed_book) format("svg");
      font-weight:400;
      font-style:normal;
    }
  }
  .real-class-1:active, whatever[lang|en]{width:100% !important;}
</style>
</head>
<body>
<table id="real-id-1" width="100%" border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td>
      <table width="100%" border="0" cellpadding="0" cellspacing="0">
        <tr>
          <td class="real-class-1">
            Dummy content.
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>
`;
  t.same(comb(source).result, intended, "50");
  t.end();
});

tap.test("51 - copes with @font-face not within media query", (t) => {
  const source = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Dummy HTML</title>
<style type="text/css">
@font-face{font-family:CodsenNormal;src:url(http://codsen.com/fonts/bold.eot); src:url(http://codsen.com/fonts/bold.eot?#iefix) format("embedded-opentype"),url(http://codsen.com/fonts/bold.woff2) format("woff2"),url(http://codsen.com/fonts/bold.woff) format("woff"),url(http://codsen.com/fonts/bold.ttf) format("truetype"),url(http://codsen.com/fonts/bold.svg#Codsenbold) format("svg"); font-weight:600; font-style:normal} @font-face{font-family:CodsenCondensed; src:url(http://codsen.com/fonts/condensedbook.eot); src:url(http://codsen.com/fonts/condensedbook.eot?#iefix) format("embedded-opentype"),url(http://codsen.com/fonts/condensedbook.woff2) format("woff2"),url(http://codsen.com/fonts/condensedbook.woff) format("woff"),url(http://codsen.com/fonts/condensedbook.ttf) format("truetype"),url(http://codsen.com/fonts/condensedbook.svg#Codsencondensed_book) format("svg"); font-weight:400; font-style:normal} .real-class-1:active, #head-only-id1[whatnot], whatever[lang|en]{width:100% !important;} #real-id-1:hover{width:100% !important;} .unused-zzz { display: block}</style>
</head>
< body>
<table id="     real-id-1    body-only-id-1    " class="     body-only-class-1 " width="100%" border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td>
      <table width="100%" border="0" cellpadding="0" cellspacing="0">
        <tr id="      body-only-id-4     ">
          <td id="     body-only-id-2     body-only-id-3   " class="     real-class-1      body-only-class-2     body-only-class-3 ">
            Dummy content.
          </td>
        </tr>
      </table>
    </td>
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
@font-face{font-family:CodsenNormal;src:url(http://codsen.com/fonts/bold.eot); src:url(http://codsen.com/fonts/bold.eot?#iefix) format("embedded-opentype"),url(http://codsen.com/fonts/bold.woff2) format("woff2"),url(http://codsen.com/fonts/bold.woff) format("woff"),url(http://codsen.com/fonts/bold.ttf) format("truetype"),url(http://codsen.com/fonts/bold.svg#Codsenbold) format("svg"); font-weight:600; font-style:normal} @font-face{font-family:CodsenCondensed; src:url(http://codsen.com/fonts/condensedbook.eot); src:url(http://codsen.com/fonts/condensedbook.eot?#iefix) format("embedded-opentype"),url(http://codsen.com/fonts/condensedbook.woff2) format("woff2"),url(http://codsen.com/fonts/condensedbook.woff) format("woff"),url(http://codsen.com/fonts/condensedbook.ttf) format("truetype"),url(http://codsen.com/fonts/condensedbook.svg#Codsencondensed_book) format("svg"); font-weight:400; font-style:normal} .real-class-1:active, whatever[lang|en]{width:100% !important;} #real-id-1:hover{width:100% !important;}</style>
</head>
<body>
<table id="real-id-1" width="100%" border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td>
      <table width="100%" border="0" cellpadding="0" cellspacing="0">
        <tr>
          <td class="real-class-1">
            Dummy content.
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>
`;
  t.same(comb(source).result, intended, "51");
  t.end();
});

tap.test(
  "52 - peculiar pattern - two classes to be removed, then used class",
  (t) => {
    const source = `
<html>
  <head>
    <style>
      @media screen and (max-width:500px){.col-1,.col-10,.used-1{width:100%!important}}
      .used-1 {
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
</html>
`;

    const intended = `<html>
  <head>
    <style>
      @media screen and (max-width:500px){.used-1{width:100%!important}}
      .used-1 {
        display: block;
      }
    </style>
  </head>
  <body>
    <table class="used-1">
      <tr>
        <td>
          text
        </td>
      </tr>
    </table>
  </body>
</html>
`;
    t.same(comb(source).result, intended, "52");
    t.end();
  }
);

tap.test("53 - head CSS is given minified", (t) => {
  const source1 = `<head>
  <style>.col-3{z:2%}.col-4{y:3%}</style>
</head>
<body>
<a class="col-3">z</a>
</body>
</html>
`;

  const source2 = `<head>
  <style>#col-1{width:100%;}#col-3{z:2%}#col-4{y:3%}</style>
</head>
<body>
<a id="col-3">z</a>
</body>
</html>
`;

  const intended1 = `<head>
  <style>.col-3{z:2%}</style>
</head>
<body>
<a class="col-3">z</a>
</body>
</html>
`;
  const intended2 = `<head>
  <style>#col-3{z:2%}</style>
</head>
<body>
<a id="col-3">z</a>
</body>
</html>
`;
  t.same(comb(source1).result, intended1, "53.01");
  t.same(comb(source2).result, intended2, "53.02");
  t.end();
});

tap.test("54 - head CSS is given minified, comma separated", (t) => {
  const source1 = `<head>
  <style>.col-12,.col-3,.col-4, .col-6{y:3%}</style>
</head>
<body>
<a class="col-3">
</html>
`;

  const source2 = `<head>
  <style>.col-12,.col-3,.col-4, .col-6
{y:3%}</style>
</head>
<body>
<a class="col-3">
</html>
`;

  const source3 = `<head>
  <style>.col-12,.col-3,.col-4, .col-6
  \t\t\t


  {y:3%}</style>
</head>
<body>
<a class="col-3">
</html>
`;

  const intended = `<head>
  <style>.col-3{y:3%}</style>
</head>
<body>
<a class="col-3">
</html>
`;

  t.same(comb(source1).result, intended, "54.01");
  t.same(comb(source2).result, intended, "54.02");
  t.same(comb(source3).result, intended, "54.03");
  t.end();
});

tap.test("55 - head CSS is expanded", (t) => {
  const source = `<head>
  <style>
    .col-12,
    .col-3,
    .col-4,
    .col-6 {
      something: 100%;
    }
  </style>
</head>
<body>
<a class="col-3">
</html>
`;

  const intended = `<head>
  <style>
    .col-3 {
      something: 100%;
    }
  </style>
</head>
<body>
<a class="col-3">
</html>
`;

  t.same(comb(source).result, intended, "55");
  t.end();
});

tap.test("56 - retains media queries", (t) => {
  const source = `<head>
<style>
.zz{a:1;}
@media screen and (max-width: 600px){.bb .cc{max-width:100%;}
}
</style>
</head>
<body><a class="zz bb cc">z</a>
</body>
`;
  const uglified = `<head>
<style>
.z{a:1;}
@media screen and (max-width: 600px){.b .c{max-width:100%;}
}
</style>
</head>
<body><a class="z b c">z</a>
</body>
`;

  // opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains set
  t.equal(
    comb(source, {
      uglify: false,
      removeHTMLComments: false,
      doNotRemoveHTMLCommentsWhoseOpeningTagContains: ["[if", "[endif"],
    }).result,
    source,
    "56.01"
  );
  t.equal(
    comb(source, {
      uglify: false,
      removeHTMLComments: true,
      doNotRemoveHTMLCommentsWhoseOpeningTagContains: ["[if", "[endif"],
    }).result,
    source,
    "56.02"
  );
  t.equal(
    comb(source, {
      uglify: true,
      removeHTMLComments: false,
      doNotRemoveHTMLCommentsWhoseOpeningTagContains: ["[if", "[endif"],
    }).result,
    uglified,
    "56.03"
  );
  t.equal(
    comb(source, {
      uglify: true,
      uglified: true,
      doNotRemoveHTMLCommentsWhoseOpeningTagContains: ["[if", "[endif"],
    }).result,
    uglified,
    "56.04"
  );

  // opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains empty
  t.equal(
    comb(source, {
      uglify: false,
      removeHTMLComments: false,
      doNotRemoveHTMLCommentsWhoseOpeningTagContains: [],
    }).result,
    source,
    "56.05"
  );
  t.equal(
    comb(source, {
      uglify: false,
      removeHTMLComments: true,
      doNotRemoveHTMLCommentsWhoseOpeningTagContains: [],
    }).result,
    source,
    "56.06"
  );
  t.equal(
    comb(source, {
      uglify: true,
      removeHTMLComments: false,
      doNotRemoveHTMLCommentsWhoseOpeningTagContains: [],
    }).result,
    uglified,
    "56.07"
  );
  t.equal(
    comb(source, {
      uglify: true,
      removeHTMLComments: true,
      doNotRemoveHTMLCommentsWhoseOpeningTagContains: [],
    }).result,
    uglified,
    "56.08"
  );
  t.end();
});

tap.test("57 - empty string produces empty string", (t) => {
  t.same(comb("").result, "", "57");
  t.end();
});

tap.test("58 - issue no.2 - mini", (t) => {
  const source = `<html>
<head>
<!--[if gte mso 9]>
<style>a</style>
<![endif]-->
  <style>
    .banana {
      color: red;
    }
  @media (max-width: 600px) {
    .banana {
      color: green;
    }
  }
  </style>
</head>
<body>
   <div class="banana">Banana</div>
</body>
</html>
`;

  t.equal(source, comb(source).result, "58");
  t.end();
});

tap.test("59 - issue no.2 - full", (t) => {
  const actual = comb(`<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <!--[if gte mso 9]>
  <xml>
  <o:OfficeDocumentSettings>
    <o:AllowPNG/>
    <o:PixelsPerInch>96</o:PixelsPerInch>
  </o:OfficeDocumentSettings>
  </xml>
  <style>
    table {border-collapse: collapse;}
    td,th,div,p,a,h1,h2,h3,h4,h5,h6 {font-family: "Segoe UI", sans-serif; mso-line-height-rule: exactly;}
  </style>
  <![endif]-->

  <style>
    .banana {
      color: red;
    }
  @media (max-width: 600px) {
    .banana {
      color: green;
    }
  }
  </style>
</head>
<body>
   <div class="banana">Banana</div>
</body>
</html>
`).result;

  const intended = `<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <!--[if gte mso 9]>
  <xml>
  <o:OfficeDocumentSettings>
    <o:AllowPNG/>
    <o:PixelsPerInch>96</o:PixelsPerInch>
  </o:OfficeDocumentSettings>
  </xml>
  <style>
    table {border-collapse: collapse;}
    td,th,div,p,a,h1,h2,h3,h4,h5,h6 {font-family: "Segoe UI", sans-serif; mso-line-height-rule: exactly;}
  </style>
  <![endif]-->
  <style>
    .banana {
      color: red;
    }
  @media (max-width: 600px) {
    .banana {
      color: green;
    }
  }
  </style>
</head>
<body>
   <div class="banana">Banana</div>
</body>
</html>
`;

  t.equal(actual, intended, "59");
  t.end();
});

tap.test(
  "60 - separate style tags, wrapped with Outlook comments - used CSS",
  (t) => {
    const source = `<html>
<head>
<style>
#real-id-1:hover{z}
</style>
<!--[if mso]>
<style>
.real-class-1, .real-class-1 table { display: block; }
</style><![endif]-->
</head>
<body>
  <table id="real-id-1 body-only-id-1" class="body-only-class-1" width="100%">
    <tr>
      <td>
        <table width="100%">
          <tr id="body-only-id-4">
            <td id="body-only-id-2 body-only-id-3" class="real-class-1 body-only-class-2">
              Dummy content.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

    const actual = comb(source).result;
    const actualUglified = comb(source, {
      uglify: true,
    }).result;

    const intended = `<html>
<head>
<style>
#real-id-1:hover{z}
</style>
<!--[if mso]>
<style>
.real-class-1, .real-class-1 table { display: block; }
</style><![endif]-->
</head>
<body>
  <table id="real-id-1" width="100%">
    <tr>
      <td>
        <table width="100%">
          <tr>
            <td class="real-class-1">
              Dummy content.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

    const intendedUglified = `<html>
<head>
<style>
#t:hover{z}
</style>
<!--[if mso]>
<style>
.v, .v table { display: block; }
</style><![endif]-->
</head>
<body>
  <table id="t" width="100%">
    <tr>
      <td>
        <table width="100%">
          <tr>
            <td class="v">
              Dummy content.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

    t.same(actual, intended, "60.01");
    t.same(actualUglified, intendedUglified, "60.02");
    t.end();
  }
);

tap.test(
  "61 - separate style tags, wrapped with Outlook comments - unused CSS",
  (t) => {
    const source = `<html>
<head>
<style>
#real-id-1:hover{z}
</style>
<!--[if mso]>
<style>
.unused-class-1, .unused-class-2 table { display: block; }
</style><![endif]-->
</head>
<body>
  <table id="real-id-1 body-only-id-1" class="body-only-class-1" width="100%">
    <tr>
      <td>
        <table width="100%">
          <tr id="body-only-id-4">
            <td id="body-only-id-2 body-only-id-3" class="real-class-1 body-only-class-2">
              Dummy content.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

    const actual = comb(source).result;
    const actualUglified = comb(source, {
      uglify: true,
    }).result;

    const intended = `<html>
<head>
<style>
#real-id-1:hover{z}
</style>
</head>
<body>
  <table id="real-id-1" width="100%">
    <tr>
      <td>
        <table width="100%">
          <tr>
            <td>
              Dummy content.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

    const intendedUglified = `<html>
<head>
<style>
#t:hover{z}
</style>
</head>
<body>
  <table id="t" width="100%">
    <tr>
      <td>
        <table width="100%">
          <tr>
            <td>
              Dummy content.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

    t.same(actual, intended, "61.01");
    t.same(actualUglified, intendedUglified, "61.02");
    t.end();
  }
);

tap.test(
  "62 - separate style tags, wrapped with Outlook comments - part-used CSS",
  (t) => {
    const source = `<html>
<head>
<style>
#real-id-1:hover{z}
</style>
<!--[if mso]>
<style>
.head-only-class-1, .real-class-1 table { display: block; }
</style><![endif]-->
</head>
<body>
  <table id="real-id-1 body-only-id-1" class="body-only-class-1" width="100%">
    <tr>
      <td>
        <table width="100%">
          <tr id="body-only-id-4">
            <td id="body-only-id-2 body-only-id-3" class="real-class-1 body-only-class-2">
              Dummy content.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

    const actual = comb(source).result;
    const actualUglified = comb(source, {
      uglify: true,
    }).result;
    const actualAllCommentsDeleted = comb(source, {
      doNotRemoveHTMLCommentsWhoseOpeningTagContains: [],
    }).result;
    const actualAllCommentsDeletedUglified = comb(source, {
      doNotRemoveHTMLCommentsWhoseOpeningTagContains: [],
      uglify: true,
    }).result;

    const intended = `<html>
<head>
<style>
#real-id-1:hover{z}
</style>
<!--[if mso]>
<style>
.real-class-1 table { display: block; }
</style><![endif]-->
</head>
<body>
  <table id="real-id-1" width="100%">
    <tr>
      <td>
        <table width="100%">
          <tr>
            <td class="real-class-1">
              Dummy content.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

    const intendedUglified = `<html>
<head>
<style>
#t:hover{z}
</style>
<!--[if mso]>
<style>
.v table { display: block; }
</style><![endif]-->
</head>
<body>
  <table id="t" width="100%">
    <tr>
      <td>
        <table width="100%">
          <tr>
            <td class="v">
              Dummy content.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

    const intendedAllCommentsDeleted = `<html>
<head>
<style>
#real-id-1:hover{z}
</style>
</head>
<body>
  <table id="real-id-1" width="100%">
    <tr>
      <td>
        <table width="100%">
          <tr>
            <td>
              Dummy content.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

    const intendedAllCommentsDeletedUglified = `<html>
<head>
<style>
#t:hover{z}
</style>
</head>
<body>
  <table id="t" width="100%">
    <tr>
      <td>
        <table width="100%">
          <tr>
            <td>
              Dummy content.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

    t.same(actual, intended, "62.01");
    t.same(actualUglified, intendedUglified, "62.02");
    t.same(actualAllCommentsDeleted, intendedAllCommentsDeleted, "62.03");
    t.same(
      actualAllCommentsDeletedUglified,
      intendedAllCommentsDeletedUglified,
      "62.04"
    );

    // comment removal off:
    const actualUglifiedCommentsOffAndIgnored = comb(source, {
      removeHTMLComments: false,
      doNotRemoveHTMLCommentsWhoseOpeningTagContains: [],
    }).result;
    t.same(actualUglifiedCommentsOffAndIgnored, intended, "62.05");

    const actualUglifiedCommentsOff = comb(source, {
      removeHTMLComments: false,
    }).result;
    t.same(actualUglifiedCommentsOff, intended, "62.06");

    const actualUglifiedCommentsOffUglify = comb(source, {
      removeHTMLComments: false,
      uglify: true,
    }).result;
    t.same(actualUglifiedCommentsOffUglify, intendedUglified, "62.07");
    t.end();
  }
);

tap.test("63 - comments in the inline styles", (t) => {
  const actual = comb(`<head>
<style>
  .aa, .bb { w:1; }
</style>
<body><br class="bb" style="font-size: 10px;/*\r\ncolor:#333333;\r\n*/line-height: 14px;">
</body>
`).result;

  const intended = `<head>
<style>
  .bb { w:1; }
</style>
<body><br class="bb" style="font-size: 10px;line-height: 14px;">
</body>
`;

  t.equal(actual, intended, "63");
  t.end();
});

tap.test("64 - dirty code - space between class and =", (t) => {
  const actual = comb(`<head>
<style>
  .aa, .bb { w:1; }
</style>
<body><br class ="bb" align="left">
</body>
`).result;

  const intended = `<head>
<style>
  .bb { w:1; }
</style>
<body><br class="bb" align="left">
</body>
`;

  t.equal(actual, intended, "64");
  t.end();
});

tap.test("65 - dirty code - blank class attribute name", (t) => {
  const actual1 = comb(`<head>
<style>
  .aa, .bb { w:1; }
</style>
<body class="bb"><br class >
</body>
`).result;
  const intended1 = `<head>
<style>
  .bb { w:1; }
</style>
<body class="bb"><br>
</body>
`;

  const actual2 = comb(`<head>
<style>
  .aa, .bb { w:1; }
</style>
<body class="bb"><br class />
</body>
`).result;
  const intended2 = `<head>
<style>
  .bb { w:1; }
</style>
<body class="bb"><br/>
</body>
`;

  t.equal(actual1, intended1, "65.01");
  t.equal(actual2, intended2, "65.02");
  t.end();
});

tap.test("66 - dirty code - blank class attribute name", (t) => {
  const actual1 = comb(`<head>
<style>@media screen and (min-width:1px){.unused {color: red;}}</style>
</head>
<body>
zzz
</body>`).result;
  const intended1 = `<head>
</head>
<body>
zzz
</body>
`;

  t.equal(actual1, intended1, "66");
  t.end();
});

tap.test("67 - plus selector", (t) => {
  const actual1 = comb(`<style>
[owa] .klm,
body[nop] .klm,
u+.a .klm,
u+.a .ib,
u+.a .jb{uvw}
</style>
<body>
<u><a class="a"><i class="klm">x</i></a></u>
<u><a class="a"><i class="zb">y</i></a></u>
<u><a class="a"><i class="jb">z</i></a></u>`).result;
  const intended1 = `<style>
[owa] .klm,
body[nop] .klm,
u+.a .klm,
u+.a .jb{uvw}
</style>
<body>
<u><a class="a"><i class="klm">x</i></a></u>
<u><a class="a"><i>y</i></a></u>
<u><a class="a"><i class="jb">z</i></a></u>
`;

  t.equal(actual1, intended1, "67");
  t.end();
});

tap.test("68 - double curlies around values", (t) => {
  const actual1 = comb(`<style>
.used-1 {
display: {{ abc.de_fg | hi_jk: 10 }};
}
#unused-2 {
height: {{ abc.de_fg | hi_jk: 10 }};
}
</style>
</head>
<body id="unused-3">
<table class="unused-4 used-1">
<tr>
<td class="unused-5 unused-6">
text`).result;
  const intended1 = `<style>
.used-1 {
display: {{ abc.de_fg | hi_jk: 10 }};
}
</style>
</head>
<body>
<table class="used-1">
<tr>
<td>
text
`;

  t.equal(actual1, intended1, "68");
  t.end();
});

//
//
//                                                             222222222222222
//                                                            2:::::::::::::::22
//                                                            2::::::222222:::::2
//                                                            2222222     2:::::2
//                                                                        2:::::2
//                                                                        2:::::2
//                                                                     2222::::2
//                                                                22222::::::22
//                                                              22::::::::222
//                                                             2:::::22222
//                                                            2:::::2
//                                                            2:::::2
//                                                            2:::::2       222222
//                                                            2::::::2222222:::::2
//                                                            2::::::::::::::::::2
//                                                            22222222222222222222
//

// ==============================
// 2. HTML/XHTML issues
// ==============================

// test.skip('02.01 - nothing to remove, one img tag', (t) => {
//   const actual = comb('<img src="image.jpg" width="zzz" height="zzz" bor className=""der="0" style="display:block;" alt="zzz"/>').result
//
//   const intended = `<img src="image.jpg" width="zzz" height="zzz" border="0" style="display:block;" alt="zzz"/>
// `
//
//   t.same(
//     const actual,
//     const intended,
//     '02.01',
//   )
// })
//
// test.skip('02.02 - nothing to remove, few single tags', (t) => {
//   const actual = comb('<br><hr><meta>').result
//
//   const intended = '<br><hr><meta>\n'
//
//   t.same(
//     const actual,
//     const intended,
//     '02.02.01',
//   )
//
//   // ----------------
//
//   const actual = comb('<br/><hr/><meta/>').result
//
//   const intended = '<br/><hr/><meta/>\n'
//
//   t.same(
//     const actual,
//     const intended,
//     '02.02.02',
//   )
//
//   // ----------------
//
//   const actual = comb('<br><hr/><meta/>').result
//
//   const intended = '<br/><hr/><meta/>\n'
//
//   t.same(
//     const actual,
//     const intended,
//     '02.02.03',
//   )
//
//   // ----------------
//
//   const actual = comb('<br><hr/><meta>').result
//
//   const intended = '<br><hr><meta>\n'
//
//   t.same(
//     const actual,
//     const intended,
//     '02.02.04',
//   )
// })
//
// test.skip('02.03 - nothing to remove, respects XHTML images within', (t) => {
//   const actual = comb(`
// <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
// <html xmlns="http://www.w3.org/1999/xhtml">
// <head>
// <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
// <title>Tile</title>
// </head>
// <body>
// <table width="100%" border="0" cellpadding="0" cellspacing="0">
// <tr>
//   <td>
//     <img src="image.jpg" width="zzz" height="zzz" border="0" style="display:block;" alt="zzz"/>
//   </td>
// </tr>
// </table>
// </body>
// </html>
// `).result
//
//   const intended = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
// <html xmlns="http://www.w3.org/1999/xhtml">
// <head>
// <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
// <title>Tile</title>
// </head>
// <body>
// <table width="100%" border="0" cellpadding="0" cellspacing="0">
// <tr>
//   <td>
//     <img src="image.jpg" width="zzz" height="zzz" border="0" style="display:block;" alt="zzz"/>
//   </td>
// </tr>
// </table>
// </body>
// </html>
// `
//
//   t.same(
//     const actual,
//     const intended,
//     '02.03',
//   )
// })
//
// test.skip('02.04 - fixes the IMG, HR, BR and META tags to be closed because of doctype', (t) => {
//   const actual = comb(`<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
// <html xmlns="http://www.w3.org/1999/xhtml">
// <head>
// <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
// <title>Tile</title>
// </head>
// <body>
// <table width="100%" border="0" cellpadding="0" cellspacing="0">
// <tr>
//   <td>
//     <img src="image.jpg" width="zzz" height="zzz" border="0" style="display:block;" alt="zzz">
//     <br><br>
//     <hr>
//     <br><br>
//   </td>
// </tr>
// </table>
// </body>
// </html>
// `).result
//
//   const intended = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
// <html xmlns="http://www.w3.org/1999/xhtml">
// <head>
// <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
// <title>Tile</title>
// </head>
// <body>
// <table width="100%" border="0" cellpadding="0" cellspacing="0">
// <tr>
//   <td>
//     <img src="image.jpg" width="zzz" height="zzz" border="0" style="display:block;" alt="zzz"/>
//     <br/><br/>
//     <hr/>
//     <br/><br/>
//   </td>
// </tr>
// </table>
// </body>
// </html>
// `
//
//   t.same(
//     const actual,
//     const intended,
//     '02.04',
//   )
// })
//
// test.skip('02.05 - doesn\'t fix the IMG, HR, BR and META tags because of doctype', (t) => {
//   const actual = comb(`<!DOCTYPE html>
// <html>
// <head>
// <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
// <title>Tile</title>
// </head>
// <body>
// <table width="100%" border="0" cellpadding="0" cellspacing="0">
// <tr>
//   <td>
//     <img src="image.jpg" width="zzz" height="zzz" border="0" style="display:block;" alt="zzz">
//     <br><br>
//     <hr>
//     <br><br>
//   </td>
// </tr>
// </table>
// </body>
// </html>
// `).result
//
//   const intended = `<!DOCTYPE html>
// <html>
// <head>
// <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
// <title>Tile</title>
// </head>
// <body>
// <table width="100%" border="0" cellpadding="0" cellspacing="0">
// <tr>
//   <td>
//     <img src="image.jpg" width="zzz" height="zzz" border="0" style="display:block;" alt="zzz"/>
//     <br/><br/>
//     <hr/>
//     <br/><br/>
//   </td>
// </tr>
// </table>
// </body>
// </html>
// `
//
//   t.same(
//     const actual,
//     const intended,
//     '02.05',
//   )
// })

//
//
//
//                                                             333333333333333
//                                                            3:::::::::::::::33
//                                                            3::::::33333::::::3
//                                                            3333333     3:::::3
//                                                                        3:::::3
//                                                                        3:::::3
//                                                                33333333:::::3
//                                                                3:::::::::::3
//                                                                33333333:::::3
//                                                                        3:::::3
//                                                                        3:::::3
//                                                                        3:::::3
//                                                            3333333     3:::::3
//                                                            3::::::33333::::::3
//                                                            3:::::::::::::::33
//                                                             333333333333333
//

// ==============================
// 3. SHADES OF MESSED UP HTML
// ==============================

tap.test("69 - missing closing TD, TR, TABLE will not throw", (t) => {
  const actual = comb(`
<table width="100%" border="0" cellpadding="0" cellspacing="0">
<tr>
  <td>
    some text
`).result;

  const intended = `<table width="100%" border="0" cellpadding="0" cellspacing="0">
<tr>
  <td>
    some text
`;

  t.same(actual, intended, "69 - does nothing as head has no styles");
  t.end();
});

tap.test(
  "70 - doesn't remove any other empty attributes besides class/id (mini)",
  (t) => {
    const actual = comb(`<html>
<body>
<tr whatnot="">
<td class="">
<img alt=""/>
</body>
</html>
`).result;

    const intended = `<html>
<body>
<tr whatnot="">
<td>
<img alt=""/>
</body>
</html>
`;

    t.same(actual, intended, "70");
    t.end();
  }
);

tap.test(
  "71 - doesn't remove any other empty attributes besides class/id",
  (t) => {
    const actual = comb(`<html>
<body>
  <table width="100%" border="0" cellpadding="0" cellspacing="0">
    <tr whatnot="">
      <td class="">
        <img src="spacer.gif" width="1" height="1" border="0" style="display:block;" alt=""/>
      </td>
    </tr>
  </table>
</body>
</html>
`).result;

    const intended = `<html>
<body>
  <table width="100%" border="0" cellpadding="0" cellspacing="0">
    <tr whatnot="">
      <td>
        <img src="spacer.gif" width="1" height="1" border="0" style="display:block;" alt=""/>
      </td>
    </tr>
  </table>
</body>
</html>
`;

    t.same(actual, intended, "71");
    t.end();
  }
);

tap.test(
  "72 - removes classes and id's from HTML even if it's heavily messed up",
  (t) => {
    const actual = comb(`
<title>Dummy HTML</title>
<style type="text/css">
  .real-class-1:active, #head-only-id1[whatnot], whatever[lang|en]{width:100% !important;}
  #real-id-1:hover{width:100% !important;}
</style>
</head>
<body>
<table id="     real-id-1    body-only-id-1    " class="     body-only-class-1  " width="100%" border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td>
      <table width="100%" border="0" cellpadding="0" cellspacing="0">
        <tr id="      body-only-id-4     ">
          <td id="     body-only-id-2     body-only-id-3   " class="     real-class-1      body-only-class-2     body-only-class-3 ">
            Dummy content.

    </td>
  </tr>
</table>
</body>`).result;

    const intended = `<title>Dummy HTML</title>
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
            Dummy content.
    </td>
  </tr>
</table>
</body>
`;

    t.same(
      actual,
      intended,
      "72 - rubbish in, rubbish out, only rubbish-with-unused-CSS-removed-out!"
    );
    t.end();
  }
);

tap.test("73 - missing last @media curlie", (t) => {
  const source = `<head>
<style type="text/css">
@namespace url(z);
@media (max-width: 600px) {
  .xx[z] {a:1;}

</style>
</head>
<body  class="  zz  "><a   class="yy zz">z</a>
</body>
`;

  const intended = `<head>
<style type="text/css">
@namespace url(z);
</style>
</head>
<body><a>z</a>
</body>
`;

  t.equal(comb(source).result, intended, "73");
  t.end();
});

// ==============================
// 4. Emoji content
// ==============================

tap.test("74 - doesn't affect emoji characters within the code", (t) => {
  const actual = comb("<td>🦄</td>").result;
  const intended = `<td>🦄</td>
`;

  t.same(actual, intended, "74");
  t.end();
});

tap.test(
  "75 - doesn't affect emoji characters within the attribute names",
  (t) => {
    const actual = comb('<td data-emoji="🦄">emoji</td>').result;
    const intended = `<td data-emoji="🦄">emoji</td>
`;

    t.same(actual, intended, "75");
    t.end();
  }
);

// ==============================
// 5. Missing/wrong input args
// ==============================

tap.test("76 - wrong inputs result in throw'ing", (t) => {
  // pinning throws by throw ID:
  t.throws(() => {
    comb();
  }, /THROW_ID_01/);

  t.throws(() => {
    comb(true);
  }, /THROW_ID_01/);

  t.throws(() => {
    comb(null);
  }, /THROW_ID_01/);

  t.throws(() => {
    comb({ a: "b" });
  }, /THROW_ID_01/);

  t.doesNotThrow(() => {
    comb("");
  }, "76.05");
  t.doesNotThrow(() => {
    comb("a");
  }, "76.06");
  t.end();
});

tap.test("77 - wrong opts", (t) => {
  t.throws(() => {
    comb("", 1);
  }, /THROW_ID_02/);

  t.throws(() => {
    comb("", true);
  }, /THROW_ID_02/);

  t.throws(() => {
    comb("", { whitelist: 1 });
  }, /THROW_ID_03/);

  t.doesNotThrow(() => {
    comb("", {});
  }, "77.04");
  t.doesNotThrow(() => {
    comb("", null);
  }, "77.05");
  t.doesNotThrow(() => {
    comb("", undefined);
  }, "77.06");

  t.throws(() => {
    comb("zzz", { whitelist: true });
  }, /THROW_ID_03/);

  t.doesNotThrow(() => {
    comb("zzz", { whitelist: [] });
  }, "77.08");
  t.doesNotThrow(() => {
    comb("zzz", { whitelist: "" });
  }, "77.09");
  t.doesNotThrow(() => {
    comb("zzz", { whitelist: "a" });
  }, "77.10");

  t.throws(() => {
    comb("zzz", { whitelist: [true] });
  }, /THROW_ID_04/);

  // opts.backend
  t.throws(() => {
    comb("zzz", { backend: 1 });
  }, /THROW_ID_05/);

  t.throws(() => {
    comb("zzz", { backend: "a" });
  }, /THROW_ID_05/);

  t.throws(() => {
    comb("zzz", { backend: ["a"] }); // sneaky
  }, /THROW_ID_06/);

  t.doesNotThrow(() => {
    comb("zzz", { backend: [{}] }); // empty arrays are permitted
  }, "77.15");
  t.throws(() => {
    comb("zzz", { backend: [{ a: "b" }] }); // unrecognised keys
  }, /THROW_ID_07/);
  t.end();
});

tap.test("78 - opts.uglify wrong", (t) => {
  t.doesNotThrow(() => {
    comb("z", { uglify: 0 });
  }, "78.01");
  t.doesNotThrow(() => {
    comb("z", { uglify: 1 });
  }, "78.02");
  t.throws(() => {
    comb("z", { uglify: "z" });
  }, /THROW_ID_08/);
  t.end();
});

tap.test("79 - opts.reportProgressFunc wrong", (t) => {
  t.doesNotThrow(() => {
    comb("z", { reportProgressFunc: 0 });
  }, "79.01");
  t.doesNotThrow(() => {
    comb("z", { reportProgressFunc: false });
  }, "79.02");
  t.throws(() => {
    comb("z", { reportProgressFunc: "z" });
  }, /THROW_ID_09/);
  t.end();
});

// ==============================
// 6. Output info object
// ==============================

tap.test(
  "80 - returned correct info object, nothing to delete from body, damaged HTML",
  (t) => {
    const actual = comb(`<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Tile</title>
<style type="text/css">
  div.non-existent-class{display: block;}
  table#other div#non-existent-id{width:100%; display: inline-block;}
</style>
</head>
<body>
<table width="100%" border="0" cellpadding="0" cellspacing="0">
<tr>
  <td>
    <img src="image.jpg" width="zzz" height="zzz" border="0" style="display:block;" alt="zzz">
    <br><br>
    <hr>
    <br><br>`);

    t.same(
      actual.allInHead,
      ["#non-existent-id", "#other", ".non-existent-class"],
      "80.01"
    );
    t.same(actual.allInBody, [], "80.02");
    t.same(
      actual.deletedFromHead,
      ["#non-existent-id", "#other", ".non-existent-class"],
      "80.03"
    );
    t.same(actual.deletedFromBody, [], "80.04");
    t.end();
  }
);

tap.test("81 - returned correct info object, clean HTML", (t) => {
  const actual = comb(`<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Tile</title>
<style type="text/css">
  div.non-existent-class{display: block;}
  table#other div#non-existent-id{width:100%; display: inline-block;}
</style>
</head>
<body>
<table width="100%" border="0" cellpadding="0" cellspacing="0">
  <td>
    <img class="unused1 unused2" src="image.jpg" width="zzz" height="zzz" border="0" style="display:block;" alt="zzz">
    <br><br>
    <hr class="unused3">
    <br><br id="unused4">
  </td>
</tr>
</table>
</body>
</html>
`);

  t.same(
    actual.allInHead,
    ["#non-existent-id", "#other", ".non-existent-class"],
    "81.01"
  );
  t.same(
    actual.allInBody,
    ["#unused4", ".unused1", ".unused2", ".unused3"],
    "81.02"
  );
  t.same(
    actual.deletedFromHead,
    ["#non-existent-id", "#other", ".non-existent-class"],
    "81.03"
  );
  t.same(
    actual.deletedFromBody,
    ["#unused4", ".unused1", ".unused2", ".unused3"],
    "81.04"
  );
  t.end();
});

tap.test("82 - as 06.02 but now with whitelist, dirty HTML", (t) => {
  const actual = comb(
    `<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Tile</title>
<style type="text/css">
  div.non-existent-class{display: block;}
  table#other div#non-existent-id{width:100%; display: inline-block;}
</style>
</head>
<body>
<table class="body-only-class-1 body-only-class-2" width="100%" border="0" cellpadding="0" cellspacing="0">
<tr>
  <td>
    <img src="image.jpg" width="zzz" height="zzz" border="0" style="display:block;" alt="zzz">
    <br><br>
    <hr>
    <br><br>`,
    {
      whitelist: [
        ".non-existent-*",
        "#other*",
        "#non-existent-*",
        ".body-only-*",
      ],
    }
  );
  t.same(
    actual.allInHead,
    ["#non-existent-id", "#other", ".non-existent-class"],
    "82.01"
  );
  t.same(
    actual.allInBody,
    [".body-only-class-1", ".body-only-class-2"],
    "82.02"
  );
  t.same(
    actual.deletedFromHead,
    [],
    "82.03 - nothing removed because of whitelist"
  );
  t.same(
    actual.deletedFromBody,
    [],
    "82.04 - nothing removed because of whitelist"
  );
  t.end();
});

tap.test("83 - correct classes reported in info/deletedFromBody", (t) => {
  const actual = comb(`<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Tile</title>
<style type="text/css">
  .unused.used {display: block;}
</style>
</head>
<body>
<table class="used" width="100%" border="0" cellpadding="0" cellspacing="0">
<tr>
  <td>
    Text
  </td>
</tr>
</table>
</body>
</html>
`);

  t.same(actual.allInHead, [".unused", ".used"], "83.01");
  t.same(actual.allInBody, [".used"], "83.02");
  t.same(actual.deletedFromHead, [".unused", ".used"], "83.03");
  t.same(
    actual.deletedFromBody,
    [".used"],
    "83.04 - sneaky case - it is within head, but it is sandwitched with an unused class, so it does not count!"
  );
  t.end();
});

tap.test("84 - more sandwitched classes/ids cases", (t) => {
  const actual = comb(`<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Tile</title>
<style type="text/css">
  .unused-class.used-class {display: block;}
  .unused-class#used-id {display: block;}
  #unused-id#used-id {display: block;}
</style>
</head>
<body>
<table class="used-class" width="100%" border="0" cellpadding="0" cellspacing="0">
<tr>
  <td id="used-id">
    Text
  </td>
</tr>
</table>
</body>
</html>
`);

  t.same(
    actual.allInHead,
    ["#unused-id", "#used-id", ".unused-class", ".used-class"],
    "84.01"
  );
  t.same(actual.allInBody, ["#used-id", ".used-class"], "84.02");
  t.same(
    actual.deletedFromHead,
    ["#unused-id", "#used-id", ".unused-class", ".used-class"],
    "84.03 - deleted because they'e sandwitched with unused classes/ids"
  );
  t.same(
    actual.deletedFromBody,
    ["#used-id", ".used-class"],
    "84.04 - deleted because they'e sandwitched with unused classes/ids"
  );
  t.end();
});

// ==============================
// 7. Whitelist
// ==============================

tap.test("85 - nothing removed because of settings.whitelist", (t) => {
  const actual = comb(
    `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" />
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>Tile</title>
<style type="text/css">
  .module-1{display: none !important;}
  .module-2{display: none !important;}
  .module-3{display: none !important;}
  .module-zzzzkldfjglfjhlfjlhfglj{display: none !important;}
  .particular{width: 100% !important;}
</style>
</head>
<body>
<table class="module-92" width="100%" border="0" cellpadding="0" cellspacing="0">
<tr class="module-93">
  <td class="module-94 module-lkfjgldhglktjja">
    <img class="module-91" src="image.jpg" width="zzz" height="zzz" border="0" style="display:block;" alt="zzz" />
  </td>
</tr>
</table>
</body>
</html>
`,
    {
      whitelist: [".module-*", ".particular"],
    }
  ).result;

  const intended = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" />
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>Tile</title>
<style type="text/css">
  .module-1{display: none !important;}
  .module-2{display: none !important;}
  .module-3{display: none !important;}
  .module-zzzzkldfjglfjhlfjlhfglj{display: none !important;}
  .particular{width: 100% !important;}
</style>
</head>
<body>
<table class="module-92" width="100%" border="0" cellpadding="0" cellspacing="0">
<tr class="module-93">
  <td class="module-94 module-lkfjgldhglktjja">
    <img class="module-91" src="image.jpg" width="zzz" height="zzz" border="0" style="display:block;" alt="zzz" />
  </td>
</tr>
</table>
</body>
</html>
`;

  t.same(actual, intended, "85");
  t.end();
});

tap.test("86 - some removed, some whitelisted", (t) => {
  const actual = comb(
    `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" />
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>Tile</title>
<style type="text/css">
  .module-1{display: none !important;}
  .module-2{display: none !important;}
  .module-3{display: none !important;}
  .module-zzzzkldfjglfjhlfjlhfglj{display: none !important;}
  .head-only-class-1 a.module-94:hover{width: 100% !important;}
  #head-only-id-1[lang|en]{width: 100% !important;}
</style>
</head>
<body>
<table class="module-92" width="100%" border="0" cellpadding="0" cellspacing="0">
<tr class="module-93 body-only-class-1">
  <td id="body-only-id-1" class="module-94 module-lkfjgldhglktjja">
    <img class="module-91" src="image.jpg" width="zzz" height="zzz" border="0" style="display:block;" alt="zzz" />
  </td>
</tr>
</table>
</body>
</html>
`,
    {
      whitelist: [".module-*", ".particular"],
    }
  ).result;

  const intended = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" />
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>Tile</title>
<style type="text/css">
  .module-1{display: none !important;}
  .module-2{display: none !important;}
  .module-3{display: none !important;}
  .module-zzzzkldfjglfjhlfjlhfglj{display: none !important;}
</style>
</head>
<body>
<table class="module-92" width="100%" border="0" cellpadding="0" cellspacing="0">
<tr class="module-93">
  <td class="module-94 module-lkfjgldhglktjja">
    <img class="module-91" src="image.jpg" width="zzz" height="zzz" border="0" style="display:block;" alt="zzz" />
  </td>
</tr>
</table>
</body>
</html>
`;

  t.same(actual, intended, "86");
  t.end();
});

tap.test("87 - case of whitelisting everything", (t) => {
  const actual = comb(
    `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" />
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>Tile</title>
<style type="text/css">
  .module-1{display: none !important;}
  .module-2{display: none !important;}
  .module-3{display: none !important;}
  .module-zzzzkldfjglfjhlfjlhfglj{display: none !important;}
  .head-only-class-1 a.module-94:hover{width: 100% !important;}
  #head-only-id-1[lang|en]{width: 100% !important;}
</style>
</head>
<body>
<table class="module-92" width="100%" border="0" cellpadding="0" cellspacing="0">
<tr class="module-93 body-only-class-1">
  <td id="body-only-id-1" class="module-94 module-lkfjgldhglktjja">
    <img class="module-91" src="image.jpg" width="zzz" height="zzz" border="0" style="display:block;" alt="zzz" />
  </td>
</tr>
</table>
</body>
</html>
`,
    {
      whitelist: ["*"],
    }
  ).result;

  const intended = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" />
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>Tile</title>
<style type="text/css">
  .module-1{display: none !important;}
  .module-2{display: none !important;}
  .module-3{display: none !important;}
  .module-zzzzkldfjglfjhlfjlhfglj{display: none !important;}
  .head-only-class-1 a.module-94:hover{width: 100% !important;}
  #head-only-id-1[lang|en]{width: 100% !important;}
</style>
</head>
<body>
<table class="module-92" width="100%" border="0" cellpadding="0" cellspacing="0">
<tr class="module-93 body-only-class-1">
  <td id="body-only-id-1" class="module-94 module-lkfjgldhglktjja">
    <img class="module-91" src="image.jpg" width="zzz" height="zzz" border="0" style="display:block;" alt="zzz" />
  </td>
</tr>
</table>
</body>
</html>
`;

  t.same(actual, intended, "87");
  t.end();
});

tap.test("88 - special case - checking adjacent markers #1", (t) => {
  const actual = comb(`<style type="text/css">
  .del-1{display: none;}
  .real{display: none;}
  .del-3{display: none;}
</style>
<body class="real">
zzz
</body>`).result;

  const intended = `<style type="text/css">
  .real{display: none;}
</style>
<body class="real">
zzz
</body>
`;

  t.same(actual, intended, "88");
  t.end();
});

tap.test("89 - special case - checking adjacent markers #2", (t) => {
  const actual = comb(`<style type="text/css">.del-1{display: none;}.del-2{display: none;}.del-3{display: none;}</style>
<body>
zzz
</body>`).result;

  const intended = `<body>
zzz
</body>
`;

  t.same(actual, intended, "89");
  t.end();
});

// div~[^whatever] .del-1 {display: none;}
tap.test("90 - special case - checking commas within curly braces", (t) => {
  const actual = comb(`
<style type="text/css">
  .used {display: block;}
  .deleteme{,,,<<<,>>>,,,,,}
</style>
<body class="used">
zzz
</body>`).result;

  const intended = `<style type="text/css">
  .used {display: block;}
</style>
<body class="used">
zzz
</body>
`;

  t.same(actual, intended, "90");
  t.end();
});

// ==============================
// 8. Discovered bugs
// ==============================

tap.test("91 - color code hashes within head styles with no selectors", (t) => {
  const actual = comb(`<head>
<style>
a[href^="tel"], a[href^="sms"] { text-decoration: none; color: #525252; pointer-events: none; cursor: default;}
</style>
</head>
<body>
  some code
</body>
`);

  const intended = `<head>
<style>
a[href^="tel"], a[href^="sms"] { text-decoration: none; color: #525252; pointer-events: none; cursor: default;}
</style>
</head>
<body>
  some code
</body>
`;

  t.same(
    actual.result,
    intended,
    "91 - there are no classes or id's in the query selector, checking false positives"
  );
  t.end();
});

tap.test("92 - selectors in head styles without classes or ids", (t) => {
  const actual = comb(`<head>
<style>
a {color: #525252;}
</style>
</head>
<body>
  some code
</body>
`);

  const intended = `<head>
<style>
a {color: #525252;}
</style>
</head>
<body>
  some code
</body>
`;

  t.same(
    actual.result,
    intended,
    "92 - there are no classes or id's in the query selector, checking false positives"
  );
  t.end();
});

tap.test('93 - sneaky attributes that end with characters "id"', (t) => {
  const actual = comb(`<!DOCTYPE html>
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
`);

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

  t.same(actual.result, intended, "93 - sneaky urlid attribute");
  t.end();
});

tap.test(
  '94 - mini version of 08.05, sneaky attributes ending with "class"',
  (t) => {
    const actual = comb(`<body>
<a href="zzz" superclass="26489" >Links</a>
</body>
</html>
`);

    const intended = `<body>
<a href="zzz" superclass="26489" >Links</a>
</body>
</html>
`;

    t.same(actual.result, intended, "94 - sneaky superclass attribute");
    t.end();
  }
);

tap.test('95 - sneaky attributes that end with characters "class"', (t) => {
  const actual = comb(`<!DOCTYPE html>
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
`);

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

  t.same(actual.result, intended, "95 - sneaky superclass attribute");
  t.end();
});

tap.test("96 - color code hashes interpreted correctly, not as id's", (t) => {
  const actual = comb(`<!DOCTYPE html>
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
`);

  const intended = ["#head-only-id1", ".mobile_link"];

  t.same(
    actual.deletedFromHead,
    intended,
    "96 - look for #525252 in head styles, it should not be among results - v2.6.0+"
  );
  t.end();
});

tap.test("97 - one-letter classes (modern notation)", (t) => {
  const actual = comb(`<head>
<style type="text/css">
.h{display:none !important;}
</style>
</head>
<body>
<span class="h">z</span>
</body>
`);

  const intended = `<head>
<style type="text/css">
.h{display:none !important;}
</style>
</head>
<body>
<span class="h">z</span>
</body>
`;

  t.same(actual.result, intended, "97 - class .h should not get removed");
  t.end();
});

tap.test("98 - one-letter classes (old notation)", (t) => {
  const actual = comb(`<head>
<style type="text/css">
*[class].h{display:none !important;}
</style>
</head>
<body>
<span class="h">z</span>
</body>
`);

  const intended = `<head>
<style type="text/css">
*[class].h{display:none !important;}
</style>
</head>
<body>
<span class="h">z</span>
</body>
`;

  t.same(actual.result, intended, "98 - class .h should not get removed");
  t.end();
});

tap.test("99 - one-letter classes - comprehensive comparison", (t) => {
  const actual = comb(`<html>
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
</html>`);

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
</html>
`,
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
    "99.01 - allInHead"
  );
  t.equal(
    actual.allInBody.sort().join(" - "),
    intended.allInBody.sort().join(" - "),
    "99.02 - allInBody"
  );
  t.equal(
    actual.deletedFromHead.sort().join(" - "),
    intended.deletedFromHead.sort().join(" - "),
    "99.03 - deletedFromHead"
  );
  t.equal(
    actual.deletedFromBody.sort().join(" - "),
    intended.deletedFromBody.sort().join(" - "),
    "99.04 - deletedFromBody"
  );
  t.equal(actual.result, intended.result, "99.05 - result");
  t.end();
});

tap.test("100 - checking whole results object, all its keys #1", (t) => {
  const actual = comb(`<html>
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
</html>`);

  const intended = {
    result: `<html>
<head>
</head>
<body>
  <span></span>
</body>
</html>
`,
    allInHead: [".used-1", ".unused-2", ".unused-3"],
    allInBody: [".used-1", ".unused-4"],
    deletedFromHead: [".used-1", ".unused-2", ".unused-3"],
    deletedFromBody: [".used-1", ".unused-4"],
  };

  t.same(
    actual.allInHead.sort(),
    intended.allInHead.sort(),
    "100.01 - allInHead"
  );
  t.same(
    actual.allInBody.sort(),
    intended.allInBody.sort(),
    "100.02 - allInBody"
  );
  t.same(
    actual.deletedFromHead.sort(),
    intended.deletedFromHead.sort(),
    "100.03 - deletedFromHead"
  );
  t.same(
    actual.deletedFromBody.sort(),
    intended.deletedFromBody.sort(),
    "100.04 - deletedFromBody"
  );
  t.same(actual.result, intended.result, "100.05 - result");
  t.end();
});

tap.test("101 - checking whole results object, all its keys #2", (t) => {
  const actual = comb(`<html>
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
</html>`);

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

  t.same(
    actual.allInHead.sort(),
    intended.allInHead.sort(),
    "101.01 - allInHead"
  );
  t.same(
    actual.allInBody.sort(),
    intended.allInBody.sort(),
    "101.02 - allInBody"
  );
  t.same(
    actual.deletedFromHead.sort(),
    intended.deletedFromHead.sort(),
    "101.03 - deletedFromHead"
  );
  t.same(
    actual.deletedFromBody.sort(),
    intended.deletedFromBody.sort(),
    "101.04 - deletedFromBody"
  );
  t.same(actual.result, intended.result, "101.05 - result");
  t.end();
});

tap.test("102 - Cosmin's reported bug", (t) => {
  const srcs = [
    `<body><a href="http://a.b/c?d=2&id=xyz&e=0">\n`,
    `<body><a href="http://a.b/c?d=2&class=xyz&e=0">\n`,
  ];
  srcs.forEach((src) => {
    t.same(comb(src).result, src);
  });
  t.end();
});

tap.test("103 - inner whitespace #1", (t) => {
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
  t.same(comb(inp).result, outp, "103");
  t.end();
});

tap.test("104 - inner whitespace #2", (t) => {
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
  t.same(comb(inp).result, outp, "104");
  t.end();
});

tap.test("105 - inner whitespace #3", (t) => {
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
  t.same(comb(inp).result, outp, "105");
  t.end();
});

tap.test("106 - adhoc", (t) => {
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
  t.same(comb(inp).result, outp, "106");
  t.end();
});

tap.test("107 - adhoc", (t) => {
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
  t.same(comb(inp).result, outp, "107");
  t.end();
});

tap.test("108 - adhoc", (t) => {
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
  t.same(comb(inp).result, outp, "108");
  t.end();
});

// ============================================================
// 9. Release 2.11.0 - backend variables with spaces as classes
// ============================================================

tap.test("109 - nunjucks variable as a class name", (t) => {
  const actual = comb(`<!doctype html>
<html>
<head>
<style>
.aaa {
color:  black;
}
</style></head>
<body>
<div class="{{ var1 }}">
</div>
</body>
</html>
`).result;

  const intended = `<!doctype html>
<html>
<head>
</head>
<body>
<div>
</div>
</body>
</html>
`;

  t.same(actual, intended, "109 - default behaviour - lib will extract var1");
  t.end();
});

tap.test("110 - nunjucks variable as a class name", (t) => {
  const actual = comb(`<!doctype html>
<html>
<head>
<style>
.aaa {
color: black;
}
</style></head>
<body>
<div class="{{ aaa }}">
</div>
</body>
</html>
`).result;

  const intended = `<!doctype html>
<html>
<head>
<style>
.aaa {
color: black;
}
</style></head>
<body>
<div class="{{ aaa }}">
</div>
</body>
</html>
`;

  t.same(
    actual,
    intended,
    "110 - default behaviour - curlies are not legal characters to be used as class names"
  );
  t.end();
});

tap.test(
  "111 - nunjucks variable as a class name (simplified version)",
  (t) => {
    const actual = comb(
      `<style>
.aa {bb: cc;}
</style></head>
<body id="{% ee %}">
<br id="{{ ff }}">
</body>
`,
      {
        backend: [
          {
            heads: "{{",
            tails: "}}",
          },
          {
            heads: "{%",
            tails: "%}",
          },
        ],
      }
    ).result;

    const intended = `</head>
<body id="{% ee %}">
<br id="{{ ff }}">
</body>
`;

    t.same(
      actual,
      intended,
      "111 - we taught it how heads and tails look so it skips them now"
    );
    t.end();
  }
);

tap.test("112 - nunjucks variable as a class name (full version)", (t) => {
  const actual = comb(
    `<!doctype html>
<html>
<head>
<style>
.aaa {
color:  black;
}
</style></head>
<body class="{% var1 %}">
<div class="{{ var2 }}">
</div>
</body>
</html>
`,
    {
      backend: [
        {
          heads: "{{",
          tails: "}}",
        },
        {
          heads: "{%",
          tails: "%}",
        },
      ],
    }
  ).result;

  const intended = `<!doctype html>
<html>
<head>
</head>
<body class="{% var1 %}">
<div class="{{ var2 }}">
</div>
</body>
</html>
`;

  t.same(
    actual,
    intended,
    "112 - we taught it how heads and tails look so it skips them now"
  );
  t.end();
});

tap.test(
  "113 - nunjucks variables mixed with classes and id's (minimal version)",
  (t) => {
    const actual = comb(
      `<style>
#aa {bb: cc;}
</style></head>
<body id="  {{ zz }}   aa {{ yy }} dd{{xx}}">
</body>
`,
      {
        backend: [
          {
            heads: "{{",
            tails: "}}",
          },
          {
            heads: "{%",
            tails: "%}",
          },
        ],
      }
    ).result;

    const intended = `<style>
#aa {bb: cc;}
</style></head>
<body id="{{ zz }} aa {{ yy }} {{xx}}">
</body>
`;

    t.same(
      actual,
      intended,
      "113 - we taught it how heads and tails look so it skips them now"
    );
    t.end();
  }
);

tap.test(
  "114 - nunjucks variables mixed with classes and id's (full version)",
  (t) => {
    const actual = comb(
      `<!DOCTYPE html>
<html lang="en">
<head>
<style type="text/css">
.real-class-1:active, #head-only-id1[whatnot], whatever[lang|en]{width:100% !important;}
#real-id-1:hover{width:100% !important;}
</style>
</head>
<body>
<table id="{{ something }}   real-id-1 {{ anything }} body-only-id-1{{here}}" class="  {{ anything }}   body-only-class-1 {{ here }}     real-class-1     " width="100%" border="0" cellpadding="0" cellspacing="0">
<tr>
  <td>
    <table width="100%" border="0" cellpadding="0" cellspacing="0">
      <tr id="      body-only-id-4     ">
        <td id="     body-only-id-2     body-only-id-3   " class="     real-class-1      body-only-class-2     body-only-class-3 ">
          Dummy content.
        </td>
      </tr>
    </table>
  </td>
</tr>
</table>
</body>
</html>
`,
      {
        backend: [
          {
            heads: "{{",
            tails: "}}",
          },
        ],
      }
    ).result;

    const intended = `<!DOCTYPE html>
<html lang="en">
<head>
<style type="text/css">
.real-class-1:active, whatever[lang|en]{width:100% !important;}
#real-id-1:hover{width:100% !important;}
</style>
</head>
<body>
<table id="{{ something }} real-id-1 {{ anything }} {{here}}" class="{{ anything }} {{ here }} real-class-1" width="100%" border="0" cellpadding="0" cellspacing="0">
<tr>
  <td>
    <table width="100%" border="0" cellpadding="0" cellspacing="0">
      <tr>
        <td class="real-class-1">
          Dummy content.
        </td>
      </tr>
    </table>
  </td>
</tr>
</table>
</body>
</html>
`;

    t.same(actual, intended, "114");
    t.end();
  }
);

tap.test("115 - esp tag at the end of ignored class", (t) => {
  const actual = comb(
    `<body>
<table class="module-zzz-{{ loop.index }}">
`,
    {
      whitelist: [
        "#outlook",
        ".ExternalClass",
        ".Mso*",
        ".module-*",
        ".ReadMsgBody",
        ".yshortcuts",
      ],
      backend: [
        {
          heads: "{{", // define heads and tails in pairs
          tails: "}}",
        },
        {
          heads: "{%", // second pair
          tails: "%}",
        },
      ],
    }
  ).result;

  const intended = `<body>
<table class="module-zzz-{{ loop.index }}">
`;

  t.same(actual, intended, "115");
  t.end();
});

tap.test("116 - esp tag at the end of ignored class", (t) => {
  const actual = comb(
    `<body>
<table class="module-zzz-{{ loop.index }}">
`,
    {
      backend: [
        {
          heads: "{{", // define heads and tails in pairs
          tails: "}}",
        },
        {
          heads: "{%", // second pair
          tails: "%}",
        },
      ],
    }
  ).result;

  const intended = `<body>
<table class="module-zzz-{{ loop.index }}">
`;

  t.same(actual, intended, "116");
  t.end();
});

// ============================================================
// 10. Various tests
// ============================================================

tap.test("117 - bug #01", (t) => {
  const {
    allInBody,
    allInHead,
    result,
    deletedFromHead,
    deletedFromBody,
  } = comb(`<head>
<style type="text/css">
@font-face {zzz}
.unused {zzz}
</style>
</head>
<body a="z;">
</body>
`);

  t.same(allInBody, [], "117.01");
  t.same(allInHead, [".unused"], "117.02");
  t.same(
    result,
    `<head>
<style type="text/css">
@font-face {zzz}
</style>
</head>
<body a="z;">
</body>
`,
    "117.03"
  );
  t.same(deletedFromHead, [".unused"], "117.04");
  t.same(deletedFromBody, [], "117.05");
  t.end();
});

tap.test("118 - working on early (stage I) per-line removal", (t) => {
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

  t.same(comb(source).result, intended, "118");
  t.end();
});

// sneaky matching used/unused class/id names
tap.test(
  "119 - HTML inline CSS comments are removed - commented out selectors - semicols clean and inside comments",
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

    t.equal(comb(source).result, intended, "119");
    t.end();
  }
);

tap.test(
  "120 - HTML inline CSS comments are removed - commented out selectors - removing comments will result in missing semicol",
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

    t.equal(comb(source).result, intended, "120");
    t.end();
  }
);

tap.test(
  "121 - HTML inline CSS comments are removed - commented out selectors - very cheeky contents within comments",
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

    t.equal(comb(source).result, intended, "121");
    t.end();
  }
);

tap.test(
  "122 - Even without backend heads/tails set, it should recognise double curlies and curly-percentage -type heads",
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

    t.equal(comb(source).result, intended, "122");
    t.end();
  }
);

tap.test("123 - empty class/id without equals and value gets deleted", (t) => {
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

  t.equal(comb(source).result, intended, "123");
  t.end();
});

tap.test(
  "124 - empty class/id with equals but without value gets deleted",
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

    t.equal(comb(source).result, intended, "124");
    t.end();
  }
);

tap.test("125 - cleans spaces within classes and id's", (t) => {
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

  t.equal(comb(source).result, intended, "125");
  t.end();
});

tap.test("126 - does not mangle different-type line endings", (t) => {
  const source1 = "a\n";
  const source2 = "a\r";
  const source3 = "a\r\n";
  t.equal(comb(source1).result, source1, "126.01");
  t.equal(comb(source2).result, source2, "126.02");
  t.equal(comb(source3).result, source3, "126.03");
  t.end();
});

tap.test("127 - dirty code #1", (t) => {
  const actual = comb(`<body>

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

</style>`).result;

  const intended = `<body>
<td align="left" style="color:#00000;"><a href="https://email.yo.com" style="color:#000000;">p</a>
`;

  t.equal(actual, intended, "127");
  t.end();
});

// ============================================================
// 11. HTML Comment removal
// ============================================================

tap.test("128 - removes HTML comments - healthy code", (t) => {
  const source = `<style>
  .a {b:2;}
</style>
<body class="a">
<!-- zzz -->
</body>
`;

  const intended = `<style>
  .a {b:2;}
</style>
<body class="a">
</body>
`;

  const uglified = `<style>
  .a {b:2;}
</style>
<body class="a">
</body>
`;

  const uglifiedWithComments = `<style>
  .a {b:2;}
</style>
<body class="a">
<!-- zzz -->
</body>
`;

  t.equal(comb(source).result, intended, "128.01");
  t.equal(
    comb(source, { removeHTMLComments: true }).result,
    intended,
    "128.02 - hardcoded default"
  );
  t.equal(comb(source, { removeHTMLComments: false }).result, source, "128.03");

  // uglify on:
  t.equal(
    comb(source, {
      uglify: true,
    }).result,
    uglified,
    "128.04"
  );
  t.equal(
    comb(source, { removeHTMLComments: true, uglify: true }).result,
    uglified,
    "128.05 - hardcoded default"
  );
  t.equal(
    comb(source, { removeHTMLComments: false, uglify: true }).result,
    uglifiedWithComments,
    "128.06"
  );
  t.end();
});

tap.test("129 - removes bogus HTML comments", (t) => {
  const source = `<style>
  .a {b:2;}
</style>
<body class="a">
<! zzz trlalala \n\n\n\n lfhdfghdfgkdh >
</body>
`;

  const slightlyProcessed = `<style>
  .a {b:2;}
</style>
<body class="a">
<! zzz trlalala\n lfhdfghdfgkdh >
</body>
`;

  const intended = `<style>
  .a {b:2;}
</style>
<body class="a">
</body>
`;

  t.equal(comb(source).result, intended, "129.01");
  t.equal(
    comb(source, { removeHTMLComments: true }).result,
    intended,
    "129.02"
  );
  // when HTML comment removal is off, redundant whitespace within the tag is
  // still removed
  t.equal(
    comb(source, { removeHTMLComments: false }).result,
    slightlyProcessed,
    "129.03"
  );
  t.end();
});

tap.test(
  "130 - removes HTML comments - healthy code with mso conditional - one liner",
  (t) => {
    const source = `abc<!--[if gte mso 9]><xml></xml><![endif]-->xyz
`;

    const conditionalRemoved = `abc xyz
`;

    t.equal(comb(source).result, source, "130.01");
    t.equal(
      comb(source, { removeHTMLComments: true }).result,
      source,
      "130.02 - hardcoded default"
    );
    t.equal(
      comb(source, { removeHTMLComments: false }).result,
      source,
      "130.03"
    );
    t.equal(
      comb(source, {
        doNotRemoveHTMLCommentsWhoseOpeningTagContains: ["mso", "ie"],
      }).result,
      source,
      "130.04 - both mso and ie ignores cause a complete skip"
    );
    t.equal(
      comb(source, {
        doNotRemoveHTMLCommentsWhoseOpeningTagContains: "mso",
      }).result,
      source,
      "130.05 - mso ignore causes a complete skip"
    );
    t.equal(
      comb(source, {
        doNotRemoveHTMLCommentsWhoseOpeningTagContains: "ie",
      }).result,
      conditionalRemoved,
      "130.06 - ie ignore is redundant and comment is removed"
    );
    t.equal(
      comb(source, {
        doNotRemoveHTMLCommentsWhoseOpeningTagContains: "",
      }).result,
      conditionalRemoved,
      "130.07 - empty string"
    );
    t.equal(
      comb(source, {
        doNotRemoveHTMLCommentsWhoseOpeningTagContains: [],
      }).result,
      conditionalRemoved,
      "130.08 - empty array"
    );
    t.end();
  }
);

tap.test(
  "131 - removes HTML comments - everywhere-except-outlook conditional - type 1",
  (t) => {
    const source = `aaa<!--[if !mso]><!-- -->
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<!--<![endif]-->bbb
`;

    const completelyStripped = `aaa
<meta http-equiv="X-UA-Compatible" content="IE=edge" /> bbb
`;

    t.equal(comb(source).result, source, "131.01");
    t.equal(
      comb(source, { removeHTMLComments: true }).result,
      source,
      "131.02 - hardcoded default"
    );
    t.equal(
      comb(source, { removeHTMLComments: false }).result,
      source,
      "131.03"
    );
    t.equal(
      comb(source, {
        removeHTMLComments: true,
        doNotRemoveHTMLCommentsWhoseOpeningTagContains: [],
      }).result,
      completelyStripped,
      "131.04 - completely strips all comments, including outlook conditionals"
    );

    t.end();
  }
);

tap.test(
  "132 - removes HTML comments - everywhere-except-outlook conditional - type 2",
  (t) => {
    // not <!-- --> but <!-->

    const source2 = `aaa<!--[if !mso]><!-->
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<!--<![endif]-->bbb
`;
    const completelyStripped = `aaa
<meta http-equiv="X-UA-Compatible" content="IE=edge" /> bbb
`;

    t.equal(comb(source2).result, source2, "132.01");
    t.equal(
      comb(source2, { removeHTMLComments: true }).result,
      source2,
      "132.02 - hardcoded default"
    );
    t.equal(
      comb(source2, { removeHTMLComments: false }).result,
      source2,
      "132.03"
    );
    t.equal(
      comb(source2, {
        removeHTMLComments: true,
        doNotRemoveHTMLCommentsWhoseOpeningTagContains: [],
      }).result,
      completelyStripped,
      "132.04 - completely strips all comments, including outlook conditionals"
    );
    t.end();
  }
);

tap.test(
  "133 - removes HTML comments - everywhere-except-outlook conditional - alternative",
  (t) => {
    // theoretical alternatives: mso, ie
    const source3 = `aaa<!--[if mso]><!-->
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<!--<![endif]-->bbb
`;

    t.equal(
      comb(source3, {
        doNotRemoveHTMLCommentsWhoseOpeningTagContains: ["mso", "endif"],
      }).result,
      source3,
      "133.01"
    );

    const source4 = `aaa<!--[if ie]><!-->
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<!--<![endif]-->bbb
`;

    t.equal(
      comb(source4, {
        doNotRemoveHTMLCommentsWhoseOpeningTagContains: ["ie", "endif"],
      }).result,
      source4,
      "133.02"
    );
    t.end();
  }
);

tap.test(
  "134 - does not touch a table with conditional comment on the columns",
  (t) => {
    const source = `<table>
  <tr>
    <td>
      zzz
    </td>
    <!--[if (gte mso 9)|(IE)]>
    <td>
      zzz
    </td>
    <![endif]-->
    <td>
      zzz
    </td>
  </tr>
</table>
`;

    t.equal(comb(source).result, source, "134.01");
    t.equal(
      comb(source, { removeHTMLComments: true }).result,
      source,
      "134.02 - hardcoded default"
    );
    t.equal(
      comb(source, { removeHTMLComments: false }).result,
      source,
      "134.03"
    );
    t.end();
  }
);

tap.test("135 - trims commented-out HTML", (t) => {
  const source = `<table>
<tr>
  <span>
  <!-- <td>
    mso IE MSO ie
  </td> -->
  <span>
</tr>
</table>
`;

  const intended = `<table>
<tr>
  <span> <span>
</tr>
</table>
`;

  t.equal(comb(source).result, intended, "135.01");
  t.equal(
    comb(source, { removeHTMLComments: true }).result,
    intended,
    "135.02 - hardcoded default"
  );
  t.equal(comb(source, { removeHTMLComments: false }).result, source, "135.03");
  t.end();
});

tap.test("136 - outer trims - single leading space", (t) => {
  const source = ` <body>`;
  const intended = `<body>
`;

  t.equal(comb(source).result, intended, "136");
  t.end();
});

tap.test("137 - outer trims - doctype with leading line break", (t) => {
  const source = `\n<!DOCTYPE html>
<html>`;

  const intended = `<!DOCTYPE html>
<html>
`;

  t.equal(
    comb(source, { uglify: true, removeIndentations: true }).result,
    intended,
    "137"
  );
  t.end();
});

tap.test("138 - outer trims - trailing line breaks", (t) => {
  const source = ` <body>\n\n\n`;
  const intended = `<body>
`;

  t.equal(comb(source).result, intended, "138");
  t.end();
});

tap.test("139 - comment surrounded by tags", (t) => {
  const source = ` <strong><!-- --></strong> `;
  const intended = `<strong></strong>
`;

  t.equal(comb(source).result, intended, "139");
  t.end();
});

tap.test("140 - leading comment", (t) => {
  const source = `<!-- something -->zzz`;
  const intended = `zzz
`;

  t.equal(comb(source).result, intended, "140");
  t.end();
});

tap.test("141 - leading spaces #1 - just text", (t) => {
  const source = `  a`;
  const intended = `a
`;

  t.equal(comb(source).result, intended, "141");
  t.end();
});

tap.test("142 - leading spaces #2 - no body", (t) => {
  const source = `<style>
    /* Media Queries */
    @media screen and (max-width: 480px) {
      a:b;
    }
</style>
`;

  const intended = `<style>
    @media screen and (max-width: 480px) {
      a:b;
    }
</style>
`;

  t.equal(comb(source).result, intended, "142");
  t.end();
});

tap.test("143 - outer trims - some leading tabs", (t) => {
  const source = `\n\t\t<body>`;
  const intended = `<body>
`;

  t.equal(comb(source).result, intended, "143");
  t.end();
});

tap.test("144 - outer trims - doctype with leading space", (t) => {
  const source = ` <!DOCTYPE>`;
  const intended = `<!DOCTYPE>
`;

  t.equal(comb(source).result, intended, "144");
  t.end();
});

// ============================================================
// 12. opts.uglify
// ============================================================

tap.test(`145 - ${`\u001b[${31}m${`uglify`}\u001b[${39}m`} - ignores`, (t) => {
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
    comb(source, { uglify: false }).result,
    baseline,
    "145.01 - default settings (no uglify, no ignores)"
  );

  t.equal(
    comb(source, { uglify: true }).result,
    baselineUglified,
    "145.02 - uglified, no ignores"
  );

  t.equal(
    comb(source, {
      uglify: false,
      whitelist: ".zzz*",
    }).result,
    ignores,
    "145.03 - no uglify, with ignores"
  );

  t.equal(
    comb(source, {
      uglify: true,
      whitelist: ".zzz*",
    }).result,
    ignoresUglified,
    "145.04 - uglified + with ignores"
  );

  t.end();
});

tap.test(
  `146 - ${`\u001b[${31}m${`uglify`}\u001b[${39}m`} - class name exceeds library's length (all 26 letters used up)`,
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
      comb(actual, { uglify: false }).result,
      actual,
      "146.01 - uglify is off"
    );

    const res = comb(actual, { uglify: true });
    t.equal(res.result, intended, "146.02 - uglify is on");

    t.same(
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
      "146.03"
    );

    t.end();
  }
);

tap.test(
  `147 - ${`\u001b[${31}m${`uglify`}\u001b[${39}m`} - style tag within Outlook conditionals, used CSS`,
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
      comb(source, {
        uglify: false,
      }).result,
      intended,
      "147.01"
    );
    t.equal(
      comb(source, {
        uglify: true,
      }).result,
      uglified,
      "147.02"
    );
    t.end();
  }
);

tap.test(
  `148 - ${`\u001b[${31}m${`uglify`}\u001b[${39}m`} - style tag within Outlook conditionals, unused CSS`,
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
      comb(source, {
        uglify: false,
      }).result,
      intended,
      "148.01"
    );
    t.equal(
      comb(source, {
        uglify: true,
      }).result,
      uglified,
      "148.02"
    );
    // now ignores are set, so deletion is prevented:
    t.equal(
      comb(source, {
        uglify: false,
        whitelist: ["#outlook", ".myclass"],
      }).result,
      ignored,
      "148.03"
    );
    t.equal(
      comb(source, {
        uglify: true,
        whitelist: ["#outlook", ".myclass"],
      }).result,
      ignored,
      "148.04"
    );
    t.end();
  }
);

tap.test(
  `149 - ${`\u001b[${31}m${`uglify`}\u001b[${39}m`} - ignores on used id's`,
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
      comb(source, {
        uglify: true,
        whitelist: ["#mn", ".op"],
      }).result,
      source,
      "149.01"
    );
    t.equal(
      comb(source, {
        uglify: true,
        whitelist: ["#mn"],
      }).result,
      source,
      "149.02"
    );
    t.end();
  }
);

tap.test(
  `150 - ${`\u001b[${31}m${`uglify`}\u001b[${39}m`} - ignores on used classes`,
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
      comb(source, {
        uglify: true,
        whitelist: [".mn", ".op"],
      }).result,
      source,
      "150.01"
    );
    t.equal(
      comb(source, {
        uglify: true,
        whitelist: [".mn"],
      }).result,
      source,
      "150.02"
    );
    t.end();
  }
);

tap.test(
  `151 - ${`\u001b[${31}m${`uglify`}\u001b[${39}m`} - ignored values don't appear among uglified legend entries`,
  (t) => {
    const actual = comb(
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
    t.ok(actual.result.includes("Merriweather"), "151.01");

    // also, the result contains whitelisted entries...
    t.ok(intended.includes("#outlook"), "151.02");

    // ... and uglified legend doesn't contain it
    t.false(actual.log.uglified.includes("#outlook"), "151.03");

    // but there's "serif" uglified value in the uglification legend:
    t.equal(actual.log.uglified.length, 1, "151.04");

    t.end();
  }
);

// ============================================================
// 13. opts.reportProgressFunc
// ============================================================

tap.test(
  `152 - ${`\u001b[${36}m${`opts.reportProgressFunc`}\u001b[${39}m`} - calls the progress function`,
  (t) => {
    function shouldveBeenCalled(val) {
      throw new Error(val);
    }

    let counter = 0;
    const countingFunction = () => {
      // const countingFunction = val => {
      // console.log(`val received: ${val}`);
      counter += 1;
    };

    t.same(
      comb("aaaaaaaaaa").result,
      "aaaaaaaaaa\n",
      "152.01 - default behaviour"
    );
    t.same(
      comb("aaaaaaaaaa", { reportProgressFunc: null }).result,
      "aaaaaaaaaa\n",
      "152.02"
    );
    t.same(
      comb("aaaaaaaaaa", { reportProgressFunc: false }).result,
      "aaaaaaaaaa\n",
      "152.03"
    );

    // short input string should report only when passing at 50%:
    t.throws(() => {
      comb(
        `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
        { reportProgressFunc: shouldveBeenCalled }
      );
    }, /50/);

    // long input (>1000 chars long) should report at each natural number percentage passed:

    // 1. our function will mutate the counter variable:
    t.pass(
      comb(
        `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
        { reportProgressFunc: countingFunction }
      )
    );

    // 2. check the counter variable:
    t.ok(counter > 50, "152.05 - counter called");

    t.end();
  }
);

tap.test(
  `153 - ${`\u001b[${36}m${`opts.reportProgressFunc`}\u001b[${39}m`} - reports when passing at 50% only`,
  (t) => {
    function shouldveBeenCalled(val) {
      throw new Error(val);
    }

    // short input string should report only when passing at 50%:
    t.throws(() => {
      comb(
        `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
        {
          reportProgressFunc: shouldveBeenCalled,
          reportProgressFuncFrom: 21,
          reportProgressFuncTo: 86,
        }
      );
    }, /32/);

    t.end();
  }
);

tap.test(
  `154 - ${`\u001b[${36}m${`opts.reportProgressFunc`}\u001b[${39}m`} - adjusted from-to range`,
  (t) => {
    const gather = [];
    const countingFunction = (val) => {
      // const countingFunction = val => {
      // console.log(`val received: ${val}`);
      gather.push(val);
    };

    // long input (>1000 chars long) should report at each natural number percentage passed:

    // 1. our function will mutate the counter variable:
    t.pass(
      comb(
        `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
        {
          reportProgressFunc: countingFunction,
          reportProgressFuncFrom: 21,
          reportProgressFuncTo: 86,
        }
      )
    );

    // 2. check the counter variable:
    const compareTo = [];
    for (let i = 21; i < 87; i++) {
      if (i !== 81) {
        compareTo.push(i);
      }
    }
    // since we use Math.floor, some percentages can be skipped, so let's just
    // confirm that no numbers outside of permitted values are reported
    gather.forEach((perc) => t.ok(compareTo.includes(perc)));
    t.equal(gather.length, 86 - 21, "154.01");

    t.same(gather, compareTo, "154.02");
    t.end();
  }
);

// ============================================================
// 14. web-dev style-minified templates - quoteless attributes
// ============================================================

tap.test(
  `155 - ${`\u001b[${35}m${`quoteless attr`}\u001b[${39}m`} - class - retained, quoteless attr is the last`,
  (t) => {
    const actual = comb(`<head>
<style>
  .aa {z:1;}
</style>
</head>
<body><a class=aa>z</a>
</body>
`).result;

    const intended = `<head>
<style>
  .aa {z:1;}
</style>
</head>
<body><a class="aa">z</a>
</body>
`;

    t.equal(actual, intended, "155");

    t.end();
  }
);

tap.test(
  `156 - ${`\u001b[${35}m${`quoteless attr`}\u001b[${39}m`} - class - retained, just patches up`,
  (t) => {
    const actual = comb(`<head>
<style>
  .aa {z:1;}
</style>
</head>
<body><a class=aa href=zzz>z</a>
</body>
`).result;

    const intended = `<head>
<style>
  .aa {z:1;}
</style>
</head>
<body><a class="aa" href=zzz>z</a>
</body>
`;

    t.equal(actual, intended, "156");

    t.end();
  }
);

tap.test(
  `157 - ${`\u001b[${35}m${`quoteless attr`}\u001b[${39}m`} - class - removed`,
  (t) => {
    const actual = comb(`<head>
<style>
  .aa-1 {z:2;}
</style>
</head>
<body class="aa-1"><a class=bb-2 >z</a>
</body>
`).result;

    const intended = `<head>
<style>
  .aa-1 {z:2;}
</style>
</head>
<body class="aa-1"><a>z</a>
</body>
`;

    t.equal(actual, intended, "157");

    t.end();
  }
);

tap.test(
  `158 - ${`\u001b[${35}m${`quoteless attr`}\u001b[${39}m`} - id - retained, quoteless attr is the last`,
  (t) => {
    const actual = comb(`<head>
<style>
  #aa {z:1;}
</style>
</head>
<body><a id=aa>z</a>
</body>
`).result;

    const intended = `<head>
<style>
  #aa {z:1;}
</style>
</head>
<body><a id="aa">z</a>
</body>
`;

    t.equal(actual, intended, "158");

    t.end();
  }
);

tap.test(
  `159 - ${`\u001b[${35}m${`quoteless attr`}\u001b[${39}m`} - id - retained, just patches up`,
  (t) => {
    const actual = comb(`<head>
<style>
  #aa {z:1;}
</style>
</head>
<body><a id=aa href=zzz>z</a>
</body>
`).result;

    const intended = `<head>
<style>
  #aa {z:1;}
</style>
</head>
<body><a id="aa" href=zzz>z</a>
</body>
`;

    t.equal(actual, intended, "159");

    t.end();
  }
);

tap.test(
  `160 - ${`\u001b[${35}m${`quoteless attr`}\u001b[${39}m`} - id - removed`,
  (t) => {
    const actual = comb(`<head>
<style>
  #aa-1 {z:2;}
</style>
</head>
<body id="aa-1"><a id="bb-2">z</a>
</body>
`).result;

    const intended = `<head>
<style>
  #aa-1 {z:2;}
</style>
</head>
<body id="aa-1"><a>z</a>
</body>
`;

    t.equal(actual, intended, "160");

    t.end();
  }
);

tap.test(
  `161 - ${`\u001b[${35}m${`quoteless attr`}\u001b[${39}m`} - class - one removed, one retainer quoteless neighbour - dashes`,
  (t) => {
    const actual = comb(`<head>
<style>
  .aa-1 {z:2;}
</style>
</head>
<body class=aa-1><a class=bb-2 >z</a>
</body>
`).result;

    const intended = `<head>
<style>
  .aa-1 {z:2;}
</style>
</head>
<body class="aa-1"><a>z</a>
</body>
`;
    t.equal(actual, intended, "161");

    t.end();
  }
);

tap.test(
  `162 - ${`\u001b[${35}m${`quoteless attr`}\u001b[${39}m`} - class - one removed, one retainer quoteless neighbour - dashes`,
  (t) => {
    const actual = comb(`<head>
<style>
  #aa-1 {z:2;}
</style>
</head>
<body id=aa-1><a id=bb-2 >z</a>
</body>
`).result;

    const intended = `<head>
<style>
  #aa-1 {z:2;}
</style>
</head>
<body id="aa-1"><a>z</a>
</body>
`;
    t.equal(actual, intended, "162");

    t.end();
  }
);

tap.test(
  `163 - ${`\u001b[${35}m${`quoteless attr`}\u001b[${39}m`} - class - one removed, one retainer quoteless neighbour - underscores`,
  (t) => {
    const actual = comb(`<head>
<style>
  .aa_1 {z:2;}
</style>
</head>
<body class=aa_1><a class=bb_2 >z</a>
</body>
`).result;

    const intended = `<head>
<style>
  .aa_1 {z:2;}
</style>
</head>
<body class="aa_1"><a>z</a>
</body>
`;
    t.equal(actual, intended, "163");

    t.end();
  }
);

tap.test(
  `164 - ${`\u001b[${35}m${`quoteless attr`}\u001b[${39}m`} - id - one removed, one retainer quoteless neighbour - underscores`,
  (t) => {
    const actual = comb(`<head>
<style>
  #aa_1 {z:2;}
</style>
</head>
<body id=aa_1><a id=bb_2 >z</a>
</body>
`).result;

    const intended = `<head>
<style>
  #aa_1 {z:2;}
</style>
</head>
<body id="aa_1"><a>z</a>
</body>
`;
    t.equal(actual, intended, "164");

    t.end();
  }
);

tap.test(
  `165 - ${`\u001b[${35}m${`quoteless attr`}\u001b[${39}m`} - trailing whitespace control`,
  (t) => {
    const actual = comb(`<html>
<head>
</head>
<body id=unused-1 align="center">
<table class=unused-2 align="center">
`).result;

    const intended = `<html>
<head>
</head>
<body align="center">
<table align="center">
`;
    t.equal(actual, intended, "165");

    t.end();
  }
);

// ============================================================
// 15 bracket notation
// ============================================================

tap.test(
  `166 - ${`\u001b[${34}m${`bracket notation`}\u001b[${39}m`} - classes`,
  (t) => {
    const source = `<head>
<style type="text/css">
  a[class="used"]{x:1;}
  b[class="unused1"]{y:2;}
</style>
</head>
<body class="used"><a class="used unused2">z</a>
</body>
`;

    const intended = `<head>
<style type="text/css">
  a[class="used"]{x:1;}
</style>
</head>
<body class="used"><a class="used">z</a>
</body>
`;

    t.equal(comb(source).result, intended, "166");

    t.end();
  }
);

tap.test(
  `167 - ${`\u001b[${34}m${`bracket notation`}\u001b[${39}m`} - bracket notation - id's`,
  (t) => {
    const source = `<head>
<style type="text/css">
  a[id="used"]{x:1;}
  b[id="unused1"]{y:2;}
</style>
</head>
<body id="used"><a id="used unused2">z</a>
</body>
`;

    const intended = `<head>
<style type="text/css">
  a[id="used"]{x:1;}
</style>
</head>
<body id="used"><a id="used">z</a>
</body>
`;

    t.equal(comb(source).result, intended, "167");

    t.end();
  }
);
