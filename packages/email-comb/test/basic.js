import tap from "tap";
import { comb } from "./util/util";

// basic class/id removal
// -----------------------------------------------------------------------------

tap.test("01 - mvp", (t) => {
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

  t.equal(comb(t, source).result, intended, "01");
  t.end();
});

tap.test("02 - multiple classes and id's", (t) => {
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

  t.equal(comb(t, source).result, intended, "02");
  t.end();
});

tap.test("03 - mixed classes and non-classes", (t) => {
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

  t.equal(comb(t, source).result, intended, "03");
  t.end();
});

tap.test("04 - mixed classes and non-classes", (t) => {
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

  t.equal(comb(t, source).result, intended, "04");
  t.end();
});

tap.test("05 - sandwitched used and unused", (t) => {
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

  t.equal(comb(t, source).result, intended, "05");
  t.end();
});

tap.test("06 - sandwitched used and unused", (t) => {
  const actual = comb(
    t,
    `<head>
  <style>
    #ab.cd[lang|en]   , .cd   { w:1; }
  </style>
</head>
<body><br class="cd">
</body>
`
  ).result;

  const intended = `<head>
  <style>
    .cd { w:1; }
  </style>
</head>
<body><br class="cd">
</body>
`;

  t.equal(actual, intended, "06");
  t.end();
});

tap.test("07 - sandwitched used and unused", (t) => {
  const actual = comb(
    t,
    `<head>
  <style>
    #ab.cd[lang|en]   , .cd#ef, .cd, .cd#ef   { w:1; }
  </style>
</head>
<body><br class="cd">
</body>
  `
  ).result;

  const intended = `<head>
  <style>
    .cd { w:1; }
  </style>
</head>
<body><br class="cd">
</body>`;

  t.equal(actual, intended, "07");
  t.end();
});

tap.test("08 - sandwitched used and unused", (t) => {
  const actual = comb(
    t,
    `<head>
  <style>
    #ab.cd[lang|en]   , .cd#ef { w:1; }
  </style>
</head>
<body><br class="cd">
</body>
`
  ).result;

  const intended = `<head>
</head>
<body><br>
</body>
`;

  t.equal(actual, intended, "08");
  t.end();
});

tap.test("09 - mixed classes and non-classes", (t) => {
  const actual = comb(
    t,
    `<head>
<style type="text/css">
  @import;
  aa, .unused[z], bb {z:2;}
</style>
</head>
<body><a>z</a>
</body>
`
  ).result;

  const intended = `<head>
<style type="text/css">
  aa, bb {z:2;}
</style>
</head>
<body><a>z</a>
</body>
`;

  t.equal(actual, intended, "09");
  t.end();
});

tap.test("10 - removes classes and id's from HTML5 (normal input)", (t) => {
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

  t.strictSame(comb(t, source).result, intended, "10");
  t.end();
});

tap.test("11 - removes classes and id's from HTML5 - uglifies", (t) => {
  const actual = comb(
    t,
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

  t.strictSame(actual, intended, "11");
  t.end();
});

tap.test("12 - deletes blank class/id attrs", (t) => {
  const actual = comb(
    t,
    `
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
`
  ).result;

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

  t.strictSame(actual, intended, "12");
  t.end();
});

tap.test(
  "13 - class present in both head and body, but head has it joined with nonexistent id",
  (t) => {
    const actual = comb(
      t,
      `
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
`
    ).result;

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
    t.strictSame(actual, intended, "13");
    t.end();
  }
);

tap.test("14 - multiple style tags recognised and transformed", (t) => {
  const actual = comb(
    t,
    `
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
`
  ).result;

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

  t.strictSame(actual, intended, "14");
  t.end();
});

tap.test("15 - style tags are outside HEAD", (t) => {
  const actual = comb(
    t,
    `
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
`
  ).result;

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

  t.strictSame(actual, intended, "15");
  t.end();
});

tap.test("16 - removes last styles together with the whole style tag", (t) => {
  const actual = comb(
    t,
    `<!doctype html>
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
`
  ).result;

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

  t.strictSame(actual, intended, "16");
  t.end();
});

tap.test("17 - deletes multiple empty style tags", (t) => {
  const actual = comb(
    t,
    `
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
`
  ).result;

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
  t.strictSame(actual, intended, "17");
  t.end();
});

tap.test(
  "18 - removes classes wrapped with conditional Outlook comments",
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

    const actual = comb(t, source).result;
    const actualUglified = comb(t, source, {
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

    t.strictSame(actual, intended, "18.01");
    t.strictSame(actualUglified, intendedUglified, "18.02");
    t.end();
  }
);

tap.test(
  "19 - peculiar pattern - two classes to be removed, then used class",
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
    t.strictSame(comb(t, source).result, intended, "19");
    t.end();
  }
);

tap.test("20 - head CSS is given minified", (t) => {
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
  t.strictSame(comb(t, source1).result, intended1, "20.01");
  t.strictSame(comb(t, source2).result, intended2, "20.02");
  t.end();
});

tap.test("21 - head CSS is given minified, comma separated", (t) => {
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

  t.strictSame(comb(t, source1).result, intended, "21.01");
  t.strictSame(comb(t, source2).result, intended, "21.02");
  t.strictSame(comb(t, source3).result, intended, "21.03");
  t.end();
});

tap.test("22 - head CSS is expanded", (t) => {
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

  t.strictSame(comb(t, source).result, intended, "22");
  t.end();
});

tap.test("23 - empty string produces empty string", (t) => {
  t.strictSame(comb(t, "").result, "", "23");
  t.end();
});

tap.test("24 - issue no.2 - mini", (t) => {
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

  t.equal(source, comb(t, source).result, "24");
  t.end();
});

tap.test("25 - issue no.2 - full", (t) => {
  const actual = comb(
    t,
    `<!DOCTYPE html>
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
`
  ).result;

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

  t.equal(actual, intended, "25");
  t.end();
});

tap.test(
  "26 - separate style tags, wrapped with Outlook comments - used CSS",
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

    const actual = comb(t, source).result;
    const actualUglified = comb(t, source, {
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

    t.strictSame(actual, intended, "26.01");
    t.strictSame(actualUglified, intendedUglified, "26.02");
    t.end();
  }
);

tap.test(
  "27 - separate style tags, wrapped with Outlook comments - unused CSS",
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

    const actual = comb(t, source).result;
    const actualUglified = comb(t, source, {
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

    t.strictSame(actual, intended, "27.01");
    t.strictSame(actualUglified, intendedUglified, "27.02");
    t.end();
  }
);

tap.test(
  "28 - separate style tags, wrapped with Outlook comments - part-used CSS",
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

    const actual = comb(t, source).result;
    const actualUglified = comb(t, source, {
      uglify: true,
    }).result;
    const actualAllCommentsDeleted = comb(t, source, {
      doNotRemoveHTMLCommentsWhoseOpeningTagContains: [],
    }).result;
    const actualAllCommentsDeletedUglified = comb(t, source, {
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

    t.strictSame(actual, intended, "28.01");
    t.strictSame(actualUglified, intendedUglified, "28.02");
    t.strictSame(actualAllCommentsDeleted, intendedAllCommentsDeleted, "28.03");
    t.strictSame(
      actualAllCommentsDeletedUglified,
      intendedAllCommentsDeletedUglified,
      "28.04"
    );

    // comment removal off:
    const actualUglifiedCommentsOffAndIgnored = comb(t, source, {
      removeHTMLComments: false,
      doNotRemoveHTMLCommentsWhoseOpeningTagContains: [],
    }).result;
    t.strictSame(actualUglifiedCommentsOffAndIgnored, intended, "28.05");

    const actualUglifiedCommentsOff = comb(t, source, {
      removeHTMLComments: false,
    }).result;
    t.strictSame(actualUglifiedCommentsOff, intended, "28.06");

    const actualUglifiedCommentsOffUglify = comb(t, source, {
      removeHTMLComments: false,
      uglify: true,
    }).result;
    t.strictSame(actualUglifiedCommentsOffUglify, intendedUglified, "28.07");
    t.end();
  }
);

tap.test("29 - plus selector", (t) => {
  const actual1 = comb(
    t,
    `<style>
[owa] .klm,
body[nop] .klm,
u+.a .klm,
u+.a .ib,
u+.a .jb{uvw}
</style>
<body>
<u><a class="a"><i class="klm">x</i></a></u>
<u><a class="a"><i class="zb">y</i></a></u>
<u><a class="a"><i class="jb">z</i></a></u>`
  ).result;
  const intended1 = `<style>
[owa] .klm,
body[nop] .klm,
u+.a .klm,
u+.a .jb{uvw}
</style>
<body>
<u><a class="a"><i class="klm">x</i></a></u>
<u><a class="a"><i>y</i></a></u>
<u><a class="a"><i class="jb">z</i></a></u>`;

  t.equal(actual1, intended1, "29");
  t.end();
});

tap.test("30 - double curlies around values", (t) => {
  const actual1 = comb(
    t,
    `<style>
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
text`
  ).result;
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
text`;

  t.equal(actual1, intended1, "30");
  t.end();
});
