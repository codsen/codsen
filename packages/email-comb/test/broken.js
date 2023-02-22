import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { comb } from "./util/util.js";

// broken code
// -----------------------------------------------------------------------------

test("01 - missing closing TD, TR, TABLE will not throw", () => {
  let actual = comb(
    `
<table width="100%" border="0" cellpadding="0" cellspacing="0">
<tr>
  <td>
    some text
`
  ).result;

  let intended = `<table width="100%" border="0" cellpadding="0" cellspacing="0">
<tr>
  <td>
    some text
`;

  equal(actual, intended, "01.01");
});

test("02 - doesn't remove any other empty attributes besides class/id (mini)", () => {
  let actual = comb(
    `<html>
<body>
<tr whatnot="">
<td class="">
<img alt=""/>
</body>
</html>
`
  ).result;

  let intended = `<html>
<body>
<tr whatnot="">
<td>
<img alt=""/>
</body>
</html>
`;

  equal(actual, intended, "02.01");
});

test("03 - doesn't remove any other empty attributes besides class/id", () => {
  let actual = comb(
    `<html>
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
`
  ).result;

  let intended = `<html>
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

  equal(actual, intended, "03.01");
});

test("04 - removes classes and id's from HTML even if it's heavily messed up", () => {
  let actual = comb(
    `
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
</body>`
  ).result;

  let intended = `<title>Dummy HTML</title>
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
</body>`;

  equal(actual, intended, "04.01");
});

test("05 - missing last @media curlie", () => {
  let source = `<head>
<style type="text/css">
@namespace url(z);
@media (max-width: 600px) {
  .xx[z] {a:1;}

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

  equal(comb(source).result, intended, "05.01");
});

test("06 - dirty code - blank class attribute name", () => {
  let actual1 = comb(
    `<head>
<style>@media screen and (min-width:1px){.unused {color: red;}}</style>
</head>
<body>
zzz
</body>`
  ).result;
  let intended1 = `<head>
</head>
<body>
zzz
</body>`;

  equal(actual1, intended1, "06.01");
});

test("07 - dirty code - space between class and =", () => {
  let actual = comb(
    `<head>
<style>
  .aa, .bb { w:1; }
</style>
<body><br class ="bb" align="left">
</body>
`
  ).result;

  let intended = `<head>
<style>
  .bb { w:1; }
</style>
<body><br class="bb" align="left">
</body>
`;

  equal(actual, intended, "07.01");
});

test.run();
