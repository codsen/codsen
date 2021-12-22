import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { comb } from "./util/util.js";

// basic class/id removal
// -----------------------------------------------------------------------------

test("01 - mvp", () => {
  let source = `<head>
<style type="text/css">
  .unused1[z] {a:1;}
  .used[z] {a:2;}
</style>
</head>
<body class="  used  "><a class="used unused3">z</a>
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

  equal(comb(source).result, intended, "01");
});

test("02 - multiple classes and id's", () => {
  let source = `<style>
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

  let intended = `<style>
  .a {a:2;}
  #a{b:1;}
</style>
<body><a class="a" id="a">z</a>
</body>
`;

  equal(comb(source).result, intended, "02");
});

test("03 - mixed classes and non-classes", () => {
  let source = `<head>
<style type="text/css">
  aa, .unused[z], bb {z:2;}
</style>
</head>
<body><a>z</a>
</body>
`;

  let intended = `<head>
<style type="text/css">
  aa, bb {z:2;}
</style>
</head>
<body><a>z</a>
</body>
`;

  equal(comb(source).result, intended, "03");
});

test("04 - mixed classes and non-classes", () => {
  let source = `<head>
<style type="text/css">
  aa, .unused[z], bb {z:2;}
</style>
</head>
<body id   =   ""  ><a class  =  "" >z</a>
</body>
`;

  let intended = `<head>
<style type="text/css">
  aa, bb {z:2;}
</style>
</head>
<body><a>z</a>
</body>
`;

  equal(comb(source).result, intended, "04");
});

test("05 - sandwitched used and unused", () => {
  let source = `<head>
<style type="text/css">
  .used1 {z:1;}
  .used2.unused {z:2;}
</style>
</head>
<body class="used1"><a class="used2">z</a>
</body>
`;

  let intended = `<head>
<style type="text/css">
  .used1 {z:1;}
</style>
</head>
<body class="used1"><a>z</a>
</body>
`;

  equal(comb(source).result, intended, "05");
});

test("06 - sandwitched used and unused", () => {
  let actual = comb(
    `<head>
  <style>
    #ab.cd[lang|en]   , .cd   { w:1; }
  </style>
</head>
<body><br class="cd">
</body>
`
  ).result;

  let intended = `<head>
  <style>
    .cd { w:1; }
  </style>
</head>
<body><br class="cd">
</body>
`;

  equal(actual, intended, "06");
});

test("07 - sandwitched used and unused", () => {
  let actual = comb(
    `<head>
  <style>
    #ab.cd[lang|en]   , .cd#ef, .cd, .cd#ef   { w:1; }
  </style>
</head>
<body><br class="cd">
</body>
  `
  ).result;

  let intended = `<head>
  <style>
    .cd { w:1; }
  </style>
</head>
<body><br class="cd">
</body>`;

  equal(actual, intended, "07");
});

test("08 - sandwitched used and unused", () => {
  let actual = comb(
    `<head>
  <style>
    #ab.cd[lang|en]   , .cd#ef { w:1; }
  </style>
</head>
<body><br class="cd">
</body>
`
  ).result;

  let intended = `<head>
</head>
<body><br>
</body>
`;

  equal(actual, intended, "08");
});

test("09 - mixed classes and non-classes", () => {
  let actual = comb(
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

  let intended = `<head>
<style type="text/css">
  aa, bb {z:2;}
</style>
</head>
<body><a>z</a>
</body>
`;

  equal(actual, intended, "09");
});

test("10 - removes classes and id's from HTML5 (normal input)", () => {
  let source = `
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

  let intended = `<!DOCTYPE html>
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

  equal(comb(source).result, intended, "10");
});

test("11 - removes classes and id's from HTML5 - uglifies", () => {
  let actual = comb(
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

  let intended = `<!DOCTYPE html>
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

  equal(actual, intended, "11");
});

test("12 - deletes blank class/id attrs", () => {
  let actual = comb(
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

  let intended = `<!DOCTYPE html>
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

  equal(actual, intended, "12");
});

test("13 - class present in both head and body, but head has it joined with nonexistent id", () => {
  let actual = comb(
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

  let intended = `<!DOCTYPE html>
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
  equal(actual, intended, "13");
});

test("14 - multiple style tags recognised and transformed", () => {
  let actual = comb(
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

  let intended = `<!DOCTYPE html>
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

  equal(actual, intended, "14");
});

test("15 - style tags are outside HEAD", () => {
  let actual = comb(
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

  let intended = `<!DOCTYPE html>
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

  equal(actual, intended, "15");
});

test("16 - removes last styles together with the whole style tag", () => {
  let actual = comb(
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

  let intended = `<!doctype html>
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

  equal(actual, intended, "16");
});

test("17 - deletes multiple empty style tags", () => {
  let actual = comb(
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

  let intended = `<!DOCTYPE html>
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
  equal(actual, intended, "17");
});

test("18 - removes classes wrapped with conditional Outlook comments", () => {
  let source = `
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

  let actual = comb(source).result;
  let actualUglified = comb(source, {
    uglify: true,
  }).result;

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

  let intendedUglified = `<!DOCTYPE html>
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

  equal(actual, intended, "18.01");
  equal(actualUglified, intendedUglified, "18.02");
});

test("19 - peculiar pattern - two classes to be removed, then used class", () => {
  let source = `
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

  let intended = `<html>
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
  equal(comb(source).result, intended, "19");
});

test("20 - head CSS is given minified", () => {
  let source1 = `<head>
  <style>.col-3{z:2%}.col-4{y:3%}</style>
</head>
<body>
<a class="col-3">z</a>
</body>
</html>
`;

  let source2 = `<head>
  <style>#col-1{width:100%;}#col-3{z:2%}#col-4{y:3%}</style>
</head>
<body>
<a id="col-3">z</a>
</body>
</html>
`;

  let intended1 = `<head>
  <style>.col-3{z:2%}</style>
</head>
<body>
<a class="col-3">z</a>
</body>
</html>
`;
  let intended2 = `<head>
  <style>#col-3{z:2%}</style>
</head>
<body>
<a id="col-3">z</a>
</body>
</html>
`;
  equal(comb(source1).result, intended1, "20.01");
  equal(comb(source2).result, intended2, "20.02");
});

test("21 - head CSS is given minified, comma separated", () => {
  let source1 = `<head>
  <style>.col-12,.col-3,.col-4, .col-6{y:3%}</style>
</head>
<body>
<a class="col-3">
</html>
`;

  let source2 = `<head>
  <style>.col-12,.col-3,.col-4, .col-6
{y:3%}</style>
</head>
<body>
<a class="col-3">
</html>
`;

  let source3 = `<head>
  <style>.col-12,.col-3,.col-4, .col-6
  \t\t\t


  {y:3%}</style>
</head>
<body>
<a class="col-3">
</html>
`;

  let intended = `<head>
  <style>.col-3{y:3%}</style>
</head>
<body>
<a class="col-3">
</html>
`;

  equal(comb(source1).result, intended, "21.01");
  equal(comb(source2).result, intended, "21.02");
  equal(comb(source3).result, intended, "21.03");
});

test("22 - head CSS is expanded", () => {
  let source = `<head>
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

  let intended = `<head>
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

  equal(comb(source).result, intended, "22");
});

test("23 - empty string produces empty string", () => {
  equal(comb("").result, "", "23");
});

test("24 - issue no.2 - mini", () => {
  let source = `<html>
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

  equal(source, comb(source).result, "24");
});

test("25 - issue no.2 - full", () => {
  let actual = comb(
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

  let intended = `<!DOCTYPE html>
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

  equal(actual, intended, "25");
});

test("26 - separate style tags, wrapped with Outlook comments - used CSS", () => {
  let source = `<html>
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

  let actual = comb(source).result;
  let actualUglified = comb(source, {
    uglify: true,
  }).result;

  let intended = `<html>
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

  let intendedUglified = `<html>
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

  equal(actual, intended, "26.01");
  equal(actualUglified, intendedUglified, "26.02");
});

test("27 - separate style tags, wrapped with Outlook comments - unused CSS", () => {
  let source = `<html>
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

  let actual = comb(source).result;
  let actualUglified = comb(source, {
    uglify: true,
  }).result;

  let intended = `<html>
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

  let intendedUglified = `<html>
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

  equal(actual, intended, "27.01");
  equal(actualUglified, intendedUglified, "27.02");
});

test("28 - separate style tags, wrapped with Outlook comments - part-used CSS", () => {
  let source = `<html>
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

  let actual = comb(source).result;
  let actualUglified = comb(source, {
    uglify: true,
  }).result;
  let actualAllCommentsDeleted = comb(source, {
    doNotRemoveHTMLCommentsWhoseOpeningTagContains: [],
  }).result;
  let actualAllCommentsDeletedUglified = comb(source, {
    doNotRemoveHTMLCommentsWhoseOpeningTagContains: [],
    uglify: true,
  }).result;

  let intended = `<html>
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

  let intendedUglified = `<html>
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

  let intendedAllCommentsDeleted = `<html>
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

  let intendedAllCommentsDeletedUglified = `<html>
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

  equal(actual, intended, "28.01");
  equal(actualUglified, intendedUglified, "28.02");
  equal(actualAllCommentsDeleted, intendedAllCommentsDeleted, "28.03");
  equal(
    actualAllCommentsDeletedUglified,
    intendedAllCommentsDeletedUglified,
    "28.04"
  );

  // comment removal off:
  let actualUglifiedCommentsOffAndIgnored = comb(source, {
    removeHTMLComments: false,
    doNotRemoveHTMLCommentsWhoseOpeningTagContains: [],
  }).result;
  equal(actualUglifiedCommentsOffAndIgnored, intended, "28.05");

  let actualUglifiedCommentsOff = comb(source, {
    removeHTMLComments: false,
  }).result;
  equal(actualUglifiedCommentsOff, intended, "28.06");

  let actualUglifiedCommentsOffUglify = comb(source, {
    removeHTMLComments: false,
    uglify: true,
  }).result;
  equal(actualUglifiedCommentsOffUglify, intendedUglified, "28.07");
});

test("29 - plus selector", () => {
  let actual1 = comb(
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
  let intended1 = `<style>
[owa] .klm,
body[nop] .klm,
u+.a .klm,
u+.a .jb{uvw}
</style>
<body>
<u><a class="a"><i class="klm">x</i></a></u>
<u><a class="a"><i>y</i></a></u>
<u><a class="a"><i class="jb">z</i></a></u>`;

  equal(actual1, intended1, "29");
});

test("30 - double curlies around values", () => {
  let actual1 = comb(
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
  let intended1 = `<style>
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

  equal(actual1, intended1, "30");
});

test.run();
