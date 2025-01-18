import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { comb } from "./util/util.js";

// release 2.11.0 - backend variables with spaces as classes
// -----------------------------------------------------------------------------

test("01 - nunjucks variable as a class name", () => {
  let actual = comb(
    `<!doctype html>
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
`,
  ).result;

  let intended = `<!doctype html>
<html>
<head>
</head>
<body>
<div>
</div>
</body>
</html>
`;

  equal(actual, intended, "01.01");
});

test("02 - nunjucks variable as a class name", () => {
  let actual = comb(
    `<!doctype html>
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
`,
  ).result;

  let intended = `<!doctype html>
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

  equal(actual, intended, "02.01");
});

test("03 - nunjucks variable as a class name (simplified version)", () => {
  let actual = comb(
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
    },
  ).result;

  let intended = `</head>
<body id="{% ee %}">
<br id="{{ ff }}">
</body>
`;

  equal(actual, intended, "03.01");
});

test("04 - nunjucks variable as a class name (full version)", () => {
  let actual = comb(
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
    },
  ).result;

  let intended = `<!doctype html>
<html>
<head>
</head>
<body class="{% var1 %}">
<div class="{{ var2 }}">
</div>
</body>
</html>
`;

  equal(actual, intended, "04.01");
});

test("05 - nunjucks variables mixed with classes and id's (minimal version)", () => {
  let actual = comb(
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
    },
  ).result;

  let intended = `<style>
#aa {bb: cc;}
</style></head>
<body id="{{ zz }} aa {{ yy }} {{xx}}">
</body>
`;

  equal(actual, intended, "05.01");
});

test("06 - nunjucks variables mixed with classes and id's (full version)", () => {
  let actual = comb(
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
    },
  ).result;

  let intended = `<!DOCTYPE html>
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

  equal(actual, intended, "06.01");
});

test("07 - esp tag at the end of ignored class", () => {
  let actual = comb(
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
    },
  ).result;

  let intended = `<body>
<table class="module-zzz-{{ loop.index }}">
`;

  equal(actual, intended, "07.01");
});

test("08 - esp tag at the end of ignored class", () => {
  let actual = comb(
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
    },
  ).result;

  let intended = `<body>
<table class="module-zzz-{{ loop.index }}">
`;

  equal(actual, intended, "08.01");
});

test("09 - bug #6 - esp in head css within @font-face", () => {
  let input = `<head>
<style>
@font-face {
  font-family: 'SomeFont';
  font-style: normal;
  font-weight: 400;
  src: url({{ static_url }}/some-path.ttf) format('truetype');
  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
</style>
</head>
<body>yo</body>`;
  let actual = comb(input).result;

  equal(actual, input, "09.01");
});

test("10 - bug #6 - unlikely case, Jinja curlies end right at real closing-ones (unlikely scenario)", () => {
  let input = `<head>
<style>
@font-face {
  font-family: 'SomeFont';
  font-style: normal;
  font-weight: 400;
  src: url({{ static_url }}}
</style>
</head>
<body>yo</body>`;
  let actual = comb(input).result;

  equal(actual, input, "10.01");
});

test("11 - bug #6 - jinja/liquid blocks, spaced", () => {
  let input = `<head>
<style>
@font-face {
  font-family: 'SomeFont';
  font-style: normal;
  font-weight: 400;
  src: url(
  {%- if z -%}
    {{ static_url }}
  {%- else -%}
    {{ other_url }}
  {%- endif -%}
  /some-path.ttf) format('truetype');
  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
</style>
</head>
<body>yo</body>`;
  let actual = comb(input).result;

  equal(actual, input, "11.01");
});

test("12 - bug #6 - jinja/liquid blocks, tight (unlikely, but possible in theory)", () => {
  let input = `<head>
<style>
@font-face {
  font-family: 'SomeFont';
  font-style: normal;
  font-weight: 400;
  src: url({% if z %}{{ static_url }}{% endif %}}
</style>
</head>
<body>yo</body>`;
  let actual = comb(input).result;

  equal(actual, input, "12.01");
});

test.run();
