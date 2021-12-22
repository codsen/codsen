import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { comb } from "./util/util.js";

// at rules
// -----------------------------------------------------------------------------

test("01 - mvp", () => {
  let source = `<head>
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

  let intended = `<head>
<style type="text/css">
@namespace url(z);
</style>
</head>
<body><a>z</a>
</body>
`;

  equal(comb(source).result, intended, "01");
});

test("02 - @charset", () => {
  let source = `<head>
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

  let intended = `<head>
@charset "utf-8";
</head>
<body><a>z</a>
</body>
`;

  equal(comb(source).result, intended, "02");
});

// original GitHub issue #3
test("03 - removes media query together with the whole style tag #1", () => {
  let actual = comb(
    `<!doctype html>
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

  equal(actual, intended, "03");
});

test("04 - removes media query together with the whole style tag #2", () => {
  let actual = comb(
    `<!doctype html>
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
`
  ).result;

  let intended = `<!doctype html>
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

  equal(actual, intended, "04");
});

test("05 - removes three media queries together with the style tags", () => {
  let actual = comb(
    `<!doctype html>
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

  equal(actual, intended, "05");
});

test("06 - empty media queries removed", () => {
  let actual = comb(
    `
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

  equal(actual, intended, "06");
});

test("07 - multiple levels of media queries cleaned", () => {
  let actual = comb(
    `
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
`
  ).result;

  let intended = `<!DOCTYPE html>
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

  equal(actual, intended, "07");
});

test("08 - multiple levels of media queries cleaned + @supports wrap", () => {
  let actual = comb(
    `
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
`
  ).result;

  let intended = `<!DOCTYPE html>
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

  equal(actual, intended, "08");
});

test("09 - @charset #1", () => {
  let actual = comb(
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

  let intended = `<html lang="en">
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

  equal(actual, intended, "09");
});

test("10 - @charset #2", () => {
  let actual = comb(
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

  let intended = `<html lang="en">
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

  equal(actual, intended, "10");
});

test("11 - @charset #3", () => {
  let actual = comb(
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

  let intended = `<html lang="en">
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

  equal(actual, intended, "11");
});

test("12 - @charset #4", () => {
  let actual = comb(
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

  let intended = `<html lang="en">
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

  equal(actual, intended, "12");
});

test("13 - @charset #5", () => {
  let actual = comb(
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

  let intended = `<html lang="en">
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

  equal(actual, intended, "13");
});

test("14 - at-rule is followed by whitespace and another at-rule", () => {
  let actual = comb(
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

  let intended = `<html lang="en">
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

  equal(actual, intended, "14");
});

test("15 - at-rule is followed by whitespace and another at-rule", () => {
  let actual = comb(
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

  let intended = `<html lang="en">
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

  equal(actual, intended, "15");
});

test("16 - at-rule followed by closing </style>", () => {
  let actual = comb(
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

  let intended = `<html lang="en">
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

  equal(actual, intended, "16");
});

test("17 - at-rule followed by semicolon without contents", () => {
  let actual = comb(
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

  let intended = `<html lang="en">
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

  equal(actual, intended, "17");
});

test("18 - at-rule with single quotes", () => {
  let actual = comb(
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

  let intended = `<html lang="en">
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

  equal(actual, intended, "18");
});

test("19 - copes with @font-face within media query", () => {
  let source = `
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

  let intended = `<!DOCTYPE html>
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
  equal(comb(source).result, intended, "19");
});

test("20 - copes with @font-face not within media query", () => {
  let source = `
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

  let intended = `<!DOCTYPE html>
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
  equal(comb(source).result, intended, "20");
});

test("21 - retains media queries", () => {
  let source = `<head>
<style>
.zz{a:1;}
@media screen and (max-width: 600px){.bb .cc{max-width:100%;}
}
</style>
</head>
<body><a class="zz bb cc">z</a>
</body>
`;
  let uglified = `<head>
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
  equal(
    comb(source, {
      uglify: false,
      removeHTMLComments: false,
      doNotRemoveHTMLCommentsWhoseOpeningTagContains: ["[if", "[endif"],
    }).result,
    source,
    "21.01"
  );
  equal(
    comb(source, {
      uglify: false,
      removeHTMLComments: true,
      doNotRemoveHTMLCommentsWhoseOpeningTagContains: ["[if", "[endif"],
    }).result,
    source,
    "21.02"
  );
  equal(
    comb(source, {
      uglify: true,
      removeHTMLComments: false,
      doNotRemoveHTMLCommentsWhoseOpeningTagContains: ["[if", "[endif"],
    }).result,
    uglified,
    "21.03"
  );
  equal(
    comb(source, {
      uglify: true,
      uglified: true,
      doNotRemoveHTMLCommentsWhoseOpeningTagContains: ["[if", "[endif"],
    }).result,
    uglified,
    "21.04"
  );

  // opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains empty
  equal(
    comb(source, {
      uglify: false,
      removeHTMLComments: false,
      doNotRemoveHTMLCommentsWhoseOpeningTagContains: [],
    }).result,
    source,
    "21.05"
  );
  equal(
    comb(source, {
      uglify: false,
      removeHTMLComments: true,
      doNotRemoveHTMLCommentsWhoseOpeningTagContains: [],
    }).result,
    source,
    "21.06"
  );
  equal(
    comb(source, {
      uglify: true,
      removeHTMLComments: false,
      doNotRemoveHTMLCommentsWhoseOpeningTagContains: [],
    }).result,
    uglified,
    "21.07"
  );
  equal(
    comb(source, {
      uglify: true,
      removeHTMLComments: true,
      doNotRemoveHTMLCommentsWhoseOpeningTagContains: [],
    }).result,
    uglified,
    "21.08"
  );
});

test("22 - does not touch @font-face", () => {
  let actual = comb(
    `
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
`
  ).result;

  let intended = `<!DOCTYPE html>
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

  equal(actual, intended, "22");
});

test("23 - does not touch @import with query strings containing commas", () => {
  let actual = comb(
    `
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
`
  ).result;

  let intended = `<!DOCTYPE html>
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

  equal(actual, intended, "23");
});

test("24 - @media contains classes to remove, @import present in the vicinity", () => {
  let actual = comb(
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

  let intended = `<html lang="en">
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

  equal(actual, intended, "24");
});

test("25 - media query with asterisk", () => {
  let actual = comb(
    `<!doctype html>
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

  equal(actual, intended, "25");
});

test("26 - complex media query #1", () => {
  let actual = comb(
    `<!doctype html>
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

  equal(actual, intended, "26");
});

test("27 - complex media query #2", () => {
  let actual = comb(
    `<!doctype html>
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

  equal(actual, intended, "27");
});

test.run();
