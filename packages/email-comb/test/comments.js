import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { comb } from "./util/util.js";

// HTML Comment removal
// -----------------------------------------------------------------------------

test("01 - removes HTML comments - healthy code", () => {
  let source = `<style>
  .a {b:2;}
</style>
<body class="a">
<!-- zzz -->
</body>
`;

  let intended = `<style>
  .a {b:2;}
</style>
<body class="a">
</body>
`;

  let uglified = `<style>
  .a {b:2;}
</style>
<body class="a">
</body>
`;

  let uglifiedWithComments = `<style>
  .a {b:2;}
</style>
<body class="a">
<!-- zzz -->
</body>
`;

  equal(comb(source).result, intended, "01.01");
  equal(comb(source, { removeHTMLComments: true }).result, intended, "01.02");
  equal(comb(source, { removeHTMLComments: false }).result, source, "01.03");

  // uglify on:
  equal(
    comb(source, {
      uglify: true,
    }).result,
    uglified,
    "01.04"
  );
  equal(
    comb(source, { removeHTMLComments: true, uglify: true }).result,
    uglified,
    "01.05"
  );
  equal(
    comb(source, { removeHTMLComments: false, uglify: true }).result,
    uglifiedWithComments,
    "01.06"
  );
});

test("02 - removes bogus HTML comments", () => {
  let source = `<style>
  .a {b:2;}
</style>
<body class="a">
<! zzz trlalala \n\n\n\n lfhdfghdfgkdh >
</body>
`;

  let slightlyProcessed = `<style>
  .a {b:2;}
</style>
<body class="a">
<! zzz trlalala  lfhdfghdfgkdh >
</body>
`;

  let intended = `<style>
  .a {b:2;}
</style>
<body class="a">
</body>
`;

  equal(comb(source).result, intended, "02.01");
  equal(comb(source, { removeHTMLComments: true }).result, intended, "02.02");
  // when HTML comment removal is off, redundant whitespace within the tag is
  // still removed
  equal(
    comb(source, { removeHTMLComments: false }).result,
    slightlyProcessed,
    "02.03"
  );
});

test("03 - removes HTML comments - healthy code with mso conditional - one liner", () => {
  let source = `abc<!--[if gte mso 9]><xml></xml><![endif]-->xyz
`;

  let conditionalRemoved = `abc xyz
`;

  equal(comb(source).result, source, "03.01");
  equal(comb(source, { removeHTMLComments: true }).result, source, "03.02");
  equal(comb(source, { removeHTMLComments: false }).result, source, "03.03");
  equal(
    comb(source, {
      doNotRemoveHTMLCommentsWhoseOpeningTagContains: ["mso", "ie"],
    }).result,
    source,
    "03.04"
  );
  equal(
    comb(source, {
      doNotRemoveHTMLCommentsWhoseOpeningTagContains: "mso",
    }).result,
    source,
    "03.05"
  );
  equal(
    comb(source, {
      doNotRemoveHTMLCommentsWhoseOpeningTagContains: "ie",
    }).result,
    conditionalRemoved,
    "03.06"
  );
  equal(
    comb(source, {
      doNotRemoveHTMLCommentsWhoseOpeningTagContains: "",
    }).result,
    conditionalRemoved,
    "03.07"
  );
  equal(
    comb(source, {
      doNotRemoveHTMLCommentsWhoseOpeningTagContains: [],
    }).result,
    conditionalRemoved,
    "03.08"
  );
});

test("04 - removes HTML comments - everywhere-except-outlook conditional - type 1", () => {
  let source = `aaa<!--[if !mso]><!-- -->
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<!--<![endif]-->bbb
`;

  let completelyStripped = `aaa
<meta http-equiv="X-UA-Compatible" content="IE=edge" /> bbb
`;

  equal(comb(source).result, source, "04.01");
  equal(comb(source, { removeHTMLComments: true }).result, source, "04.02");
  equal(comb(source, { removeHTMLComments: false }).result, source, "04.03");
  equal(
    comb(source, {
      removeHTMLComments: true,
      doNotRemoveHTMLCommentsWhoseOpeningTagContains: [],
    }).result,
    completelyStripped,
    "04.04"
  );
});

test("05 - removes HTML comments - everywhere-except-outlook conditional - type 2", () => {
  // not <!-- --> but <!-->

  let source2 = `aaa<!--[if !mso]><!-->
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<!--<![endif]-->bbb
`;
  let completelyStripped = `aaa
<meta http-equiv="X-UA-Compatible" content="IE=edge" /> bbb
`;

  equal(comb(source2).result, source2, "05.01");
  equal(comb(source2, { removeHTMLComments: true }).result, source2, "05.02");
  equal(comb(source2, { removeHTMLComments: false }).result, source2, "05.03");
  equal(
    comb(source2, {
      removeHTMLComments: true,
      doNotRemoveHTMLCommentsWhoseOpeningTagContains: [],
    }).result,
    completelyStripped,
    "05.04"
  );
});

test("06 - removes HTML comments - everywhere-except-outlook conditional - alternative", () => {
  // theoretical alternatives: mso, ie
  let source3 = `aaa<!--[if mso]><!-->
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<!--<![endif]-->bbb
`;

  equal(
    comb(source3, {
      doNotRemoveHTMLCommentsWhoseOpeningTagContains: ["mso", "endif"],
    }).result,
    source3,
    "06.01"
  );

  let source4 = `aaa<!--[if ie]><!-->
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<!--<![endif]-->bbb
`;

  equal(
    comb(source4, {
      doNotRemoveHTMLCommentsWhoseOpeningTagContains: ["ie", "endif"],
    }).result,
    source4,
    "06.02"
  );
});

test("07 - does not touch a table with conditional comment on the columns", () => {
  let source = `<table>
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

  equal(comb(source).result, source, "07.01");
  equal(comb(source, { removeHTMLComments: true }).result, source, "07.02");
  equal(comb(source, { removeHTMLComments: false }).result, source, "07.03");
});

test("08 - trims commented-out HTML", () => {
  let source = `<table>
<tr>
  <span>
  <!-- <td>
    mso IE MSO ie
  </td> -->
  <span>
</tr>
</table>
`;

  let intended = `<table>
<tr>
  <span> <span>
</tr>
</table>
`;

  equal(comb(source).result, intended, "08.01");
  equal(comb(source, { removeHTMLComments: true }).result, intended, "08.02");
  equal(comb(source, { removeHTMLComments: false }).result, source, "08.03");
});

test("09 - outer trims - single leading space", () => {
  let source = " <body>";
  let intended = "<body>";

  equal(comb(source).result, intended, "09.01");
});

test("10 - outer trims - doctype with leading line break", () => {
  let source = `\n<!DOCTYPE html>
<html>`;

  let intended = `<!DOCTYPE html>
<html>`;

  equal(
    comb(source, { uglify: true, removeIndentations: true }).result,
    intended,
    "10.01"
  );
});

test("11 - outer trims - trailing line breaks", () => {
  let source = " <body>\n\n\n";
  let intended = `<body>
`;

  equal(comb(source).result, intended, "11.01");
});

test("12 - comment surrounded by tags", () => {
  let source = " <strong><!-- --></strong> ";
  let intended = "<strong></strong>";

  equal(comb(source).result, intended, "12.01");
});

test("13 - leading comment", () => {
  let source = "<!-- something -->zzz";
  let intended = "zzz";

  equal(comb(source).result, intended, "13.01");
});

test("14 - leading spaces #1 - just text", () => {
  let source = "  a";
  let intended = "a";

  equal(comb(source).result, intended, "14.01");
});

test("15 - leading spaces #2 - no body", () => {
  let source = `<style>
    /* Media Queries */
    @media screen and (max-width: 480px) {
      a:b;
    }
</style>
`;

  let intended = `<style>
    @media screen and (max-width: 480px) {
      a:b;
    }
</style>
`;

  equal(comb(source).result, intended, "15.01");
});

test("16 - outer trims - some leading tabs", () => {
  let source = "\n\t\t<body>";
  let intended = "<body>";

  equal(comb(source).result, intended, "16.01");
});

test("17 - outer trims - doctype with leading space", () => {
  let source = " <!DOCTYPE>";
  let intended = "<!DOCTYPE>";

  equal(comb(source).result, intended, "17.01");
});

test("18 - mixed: classes and tag names", () => {
  let actual = comb(
    `<head>
<style>
/*! .x *//*! .y */
/*! #z */
  aa, .bb, cc { w:1; }
</style>
<body><br class="dd">
</body>
`
  ).result;

  let intended = `<head>
<style>
  aa, cc { w:1; }
</style>
<body><br>
</body>
`;

  equal(actual, intended, "18.01");
});

test("19 - removes comments from style blocks - opts.removeHTMLComments + opts.removeCSSComments", () => {
  let source = `
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

  let cssAndHtmlCommentsRemoved = `<!DOCTYPE html>
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
  let htmlRemovedCssNot = `<!DOCTYPE html>
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
  let cssRemovedHtmlNot = `<!DOCTYPE html>
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
  let neitherCssNorHtml = `<!DOCTYPE html>
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
  equal(comb(source).result, cssAndHtmlCommentsRemoved, "19.01");
  equal(
    comb(source, { removeCSSComments: true }).result,
    cssAndHtmlCommentsRemoved,
    "19.02"
  );
  equal(
    comb(source, { removeCSSComments: false }).result,
    htmlRemovedCssNot,
    "19.03"
  );

  equal(
    comb(source, { removeCSSComments: true, removeHTMLComments: true }).result,
    cssAndHtmlCommentsRemoved,
    "19.04"
  );
  equal(
    comb(source, { removeCSSComments: false, removeHTMLComments: true }).result,
    htmlRemovedCssNot,
    "19.05"
  );
  equal(
    comb(source, { removeCSSComments: true, removeHTMLComments: false }).result,
    cssRemovedHtmlNot,
    "19.06"
  );
  equal(
    comb(source, { removeCSSComments: false, removeHTMLComments: false })
      .result,
    neitherCssNorHtml,
    "19.07"
  );
});

test("20 - false real class is commented-out and therefore gets removed", () => {
  let source = `
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

  let intended = `<!DOCTYPE html>
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

  equal(comb(source).result, intended, "20.01");
});

test("21 - comments in the inline styles", () => {
  let actual = comb(
    `<head>
<style>
  .aa, .bb { w:1; }
</style>
<body><br class="bb" style="font-size: 10px;/*\r\ncolor:#333333;\r\n*/line-height: 14px;">
</body>
`
  ).result;

  let intended = `<head>
<style>
  .bb { w:1; }
</style>
<body><br class="bb" style="font-size: 10px;line-height: 14px;">
</body>
`;

  equal(actual, intended, "21.01");
});

test.run();
