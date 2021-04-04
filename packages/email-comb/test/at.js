import tap from "tap";
import { comb } from "./util/util";

// at rules
// -----------------------------------------------------------------------------

tap.test("01 - mvp", (t) => {
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

  t.equal(comb(t, source).result, intended, "01");
  t.end();
});

tap.test("02 - @charset", (t) => {
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

  t.equal(comb(t, source).result, intended, "02");
  t.end();
});

// original GitHub issue #3
tap.test(
  "03 - removes media query together with the whole style tag #1",
  (t) => {
    const actual = comb(
      t,
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

    t.strictSame(actual, intended, "03");
    t.end();
  }
);

tap.test(
  "04 - removes media query together with the whole style tag #2",
  (t) => {
    const actual = comb(
      t,
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

    t.strictSame(actual, intended, "04");
    t.end();
  }
);

tap.test(
  "05 - removes three media queries together with the style tags",
  (t) => {
    const actual = comb(
      t,
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

    t.strictSame(actual, intended, "05");
    t.end();
  }
);

tap.test("06 - empty media queries removed", (t) => {
  const actual = comb(
    t,
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

  t.strictSame(actual, intended, "06");
  t.end();
});

tap.test("07 - multiple levels of media queries cleaned", (t) => {
  const actual = comb(
    t,
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

  t.strictSame(actual, intended, "07");
  t.end();
});

tap.test(
  "08 - multiple levels of media queries cleaned + @supports wrap",
  (t) => {
    const actual = comb(
      t,
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

    t.strictSame(actual, intended, "08");
    t.end();
  }
);

tap.test("09 - @charset #1", (t) => {
  const actual = comb(
    t,
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

  t.strictSame(actual, intended, "09");
  t.end();
});

tap.test("10 - @charset #2", (t) => {
  const actual = comb(
    t,
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

  t.strictSame(actual, intended, "10");
  t.end();
});

tap.test("11 - @charset #3", (t) => {
  const actual = comb(
    t,
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

  t.strictSame(actual, intended, "11");
  t.end();
});

tap.test("12 - @charset #4", (t) => {
  const actual = comb(
    t,
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

  t.strictSame(actual, intended, "12");
  t.end();
});

tap.test("13 - @charset #5", (t) => {
  const actual = comb(
    t,
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

  t.strictSame(actual, intended, "13");
  t.end();
});

tap.test("14 - at-rule is followed by whitespace and another at-rule", (t) => {
  const actual = comb(
    t,
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

  t.strictSame(actual, intended, "14");
  t.end();
});

tap.test("15 - at-rule is followed by whitespace and another at-rule", (t) => {
  const actual = comb(
    t,
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

  t.strictSame(actual, intended, "15");
  t.end();
});

tap.test("16 - at-rule followed by closing </style>", (t) => {
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

  t.strictSame(actual, intended, "16");
  t.end();
});

tap.test("17 - at-rule followed by semicolon without contents", (t) => {
  const actual = comb(
    t,
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

  t.strictSame(actual, intended, "17");
  t.end();
});

tap.test("18 - at-rule with single quotes", (t) => {
  const actual = comb(
    t,
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

  t.strictSame(actual, intended, "18");
  t.end();
});

tap.test("19 - copes with @font-face within media query", (t) => {
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
  t.strictSame(comb(t, source).result, intended, "19");
  t.end();
});

tap.test("20 - copes with @font-face not within media query", (t) => {
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
  t.strictSame(comb(t, source).result, intended, "20");
  t.end();
});

tap.test("21 - retains media queries", (t) => {
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
    comb(t, source, {
      uglify: false,
      removeHTMLComments: false,
      doNotRemoveHTMLCommentsWhoseOpeningTagContains: ["[if", "[endif"],
    }).result,
    source,
    "21.01"
  );
  t.equal(
    comb(t, source, {
      uglify: false,
      removeHTMLComments: true,
      doNotRemoveHTMLCommentsWhoseOpeningTagContains: ["[if", "[endif"],
    }).result,
    source,
    "21.02"
  );
  t.equal(
    comb(t, source, {
      uglify: true,
      removeHTMLComments: false,
      doNotRemoveHTMLCommentsWhoseOpeningTagContains: ["[if", "[endif"],
    }).result,
    uglified,
    "21.03"
  );
  t.equal(
    comb(t, source, {
      uglify: true,
      uglified: true,
      doNotRemoveHTMLCommentsWhoseOpeningTagContains: ["[if", "[endif"],
    }).result,
    uglified,
    "21.04"
  );

  // opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains empty
  t.equal(
    comb(t, source, {
      uglify: false,
      removeHTMLComments: false,
      doNotRemoveHTMLCommentsWhoseOpeningTagContains: [],
    }).result,
    source,
    "21.05"
  );
  t.equal(
    comb(t, source, {
      uglify: false,
      removeHTMLComments: true,
      doNotRemoveHTMLCommentsWhoseOpeningTagContains: [],
    }).result,
    source,
    "21.06"
  );
  t.equal(
    comb(t, source, {
      uglify: true,
      removeHTMLComments: false,
      doNotRemoveHTMLCommentsWhoseOpeningTagContains: [],
    }).result,
    uglified,
    "21.07"
  );
  t.equal(
    comb(t, source, {
      uglify: true,
      removeHTMLComments: true,
      doNotRemoveHTMLCommentsWhoseOpeningTagContains: [],
    }).result,
    uglified,
    "21.08"
  );
  t.end();
});

tap.test("22 - does not touch @font-face", (t) => {
  const actual = comb(
    t,
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

  t.strictSame(actual, intended, "22");
  t.end();
});

tap.test(
  "23 - does not touch @import with query strings containing commas",
  (t) => {
    const actual = comb(
      t,
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

    t.strictSame(actual, intended, "23");
    t.end();
  }
);

tap.test(
  "24 - @media contains classes to remove, @import present in the vicinity",
  (t) => {
    const actual = comb(
      t,
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

    t.strictSame(actual, intended, "24");
    t.end();
  }
);

tap.test("25 - media query with asterisk", (t) => {
  const actual = comb(
    t,
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

  t.strictSame(actual, intended, "25");
  t.end();
});

tap.test("26 - complex media query #1", (t) => {
  const actual = comb(
    t,
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

  t.strictSame(actual, intended, "26");
  t.end();
});

tap.test("27 - complex media query #2", (t) => {
  const actual = comb(
    t,
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

  t.strictSame(actual, intended, "27");
  t.end();
});
