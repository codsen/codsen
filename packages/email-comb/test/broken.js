import tap from "tap";
import { comb } from "./util/util";

// broken code
// -----------------------------------------------------------------------------

tap.test("01 - missing closing TD, TR, TABLE will not throw", (t) => {
  const actual = comb(
    t,
    `
<table width="100%" border="0" cellpadding="0" cellspacing="0">
<tr>
  <td>
    some text
`
  ).result;

  const intended = `<table width="100%" border="0" cellpadding="0" cellspacing="0">
<tr>
  <td>
    some text
`;

  t.strictSame(actual, intended, "01 - does nothing as head has no styles");
  t.end();
});

tap.test(
  "02 - doesn't remove any other empty attributes besides class/id (mini)",
  (t) => {
    const actual = comb(
      t,
      `<html>
<body>
<tr whatnot="">
<td class="">
<img alt=""/>
</body>
</html>
`
    ).result;

    const intended = `<html>
<body>
<tr whatnot="">
<td>
<img alt=""/>
</body>
</html>
`;

    t.strictSame(actual, intended, "02");
    t.end();
  }
);

tap.test(
  "03 - doesn't remove any other empty attributes besides class/id",
  (t) => {
    const actual = comb(
      t,
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

    t.strictSame(actual, intended, "03");
    t.end();
  }
);

tap.test(
  "04 - removes classes and id's from HTML even if it's heavily messed up",
  (t) => {
    const actual = comb(
      t,
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
</body>`;

    t.strictSame(
      actual,
      intended,
      "04 - rubbish in, rubbish out, only rubbish-with-unused-CSS-removed-out!"
    );
    t.end();
  }
);

tap.test("05 - missing last @media curlie", (t) => {
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

  t.equal(comb(t, source).result, intended, "05");
  t.end();
});

tap.test("06 - dirty code - blank class attribute name", (t) => {
  const actual1 = comb(
    t,
    `<head>
<style>@media screen and (min-width:1px){.unused {color: red;}}</style>
</head>
<body>
zzz
</body>`
  ).result;
  const intended1 = `<head>
</head>
<body>
zzz
</body>`;

  t.equal(actual1, intended1, "06");
  t.end();
});

tap.test("07 - dirty code - space between class and =", (t) => {
  const actual = comb(
    t,
    `<head>
<style>
  .aa, .bb { w:1; }
</style>
<body><br class ="bb" align="left">
</body>
`
  ).result;

  const intended = `<head>
<style>
  .bb { w:1; }
</style>
<body><br class="bb" align="left">
</body>
`;

  t.equal(actual, intended, "07");
  t.end();
});

tap.todo("08 - dirty code - blank class attribute name", (t) => {
  const actual1 = comb(
    t,
    `<head>
<style>
  .aa, .bb { w:1; }
</style>
<body class="bb"><br class >
</body>
`
  ).result;
  const intended1 = `<head>
<style>
  .bb { w:1; }
</style>
<body class="bb"><br>
</body>
`;

  const actual2 = comb(
    t,
    `<head>
<style>
  .aa, .bb { w:1; }
</style>
<body class="bb"><br class />
</body>
`
  ).result;
  const intended2 = `<head>
<style>
  .bb { w:1; }
</style>
<body class="bb"><br/>
</body>
`;

  t.equal(actual1, intended1, "08.01");
  t.equal(actual2, intended2, "08.02");
  t.end();
});
