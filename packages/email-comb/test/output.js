import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { comb } from "./util/util.js";

// output info object
// -----------------------------------------------------------------------------

test("01 - returned correct info object, nothing to delete from body, damaged HTML", () => {
  let actual = comb(
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
<table width="100%" border="0" cellpadding="0" cellspacing="0">
<tr>
  <td>
    <img src="image.jpg" width="zzz" height="zzz" border="0" style="display:block;" alt="zzz">
    <br><br>
    <hr>
    <br><br>`,
  );

  equal(
    actual.allInHead,
    [".non-existent-class", "#non-existent-id", "#other"],
    "01.01",
  );
  equal(actual.allInBody, [], "01.02");
  equal(
    actual.deletedFromHead,
    [".non-existent-class", "#non-existent-id", "#other"],
    "01.03",
  );
  equal(actual.deletedFromBody, [], "01.04");
});

test("02 - returned correct info object, clean HTML", () => {
  let actual = comb(
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
`,
  );

  equal(
    actual.allInHead,
    [".non-existent-class", "#non-existent-id", "#other"],
    "02.01",
  );
  equal(
    actual.allInBody,
    [".unused1", ".unused2", ".unused3", "#unused4"],
    "02.02",
  );
  equal(
    actual.deletedFromHead,
    [".non-existent-class", "#non-existent-id", "#other"],
    "02.03",
  );
  equal(
    actual.deletedFromBody,
    [".unused1", ".unused2", ".unused3", "#unused4"],
    "02.04",
  );
});

test("03 - as 06.02 but now with whitelist, dirty HTML", () => {
  let actual = comb(
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
    },
  );
  equal(
    actual.allInHead,
    [".non-existent-class", "#non-existent-id", "#other"],
    "03.01",
  );
  equal(
    actual.allInBody,
    [".body-only-class-1", ".body-only-class-2"],
    "03.02",
  );
  equal(actual.deletedFromHead, [], "03.03");
  equal(actual.deletedFromBody, [], "03.04");
});

test("04 - correct classes reported in info/deletedFromBody", () => {
  let actual = comb(
    `<!DOCTYPE html>
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
`,
  );

  equal(actual.allInHead, [".unused", ".used"], "04.01");
  equal(actual.allInBody, [".used"], "04.02");
  equal(actual.deletedFromHead, [".unused", ".used"], "04.03");
  equal(actual.deletedFromBody, [".used"], "04.04");
});

test("05 - more sandwitched classes/ids cases", () => {
  let actual = comb(
    `<!DOCTYPE html>
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
`,
  );

  equal(
    actual.allInHead,
    [".unused-class", ".used-class", "#unused-id", "#used-id"],
    "05.01",
  );
  equal(actual.allInBody, [".used-class", "#used-id"], "05.02");
  equal(
    actual.deletedFromHead,
    [".unused-class", ".used-class", "#unused-id", "#used-id"],
    "05.03",
  );
  equal(actual.deletedFromBody, [".used-class", "#used-id"], "05.04");
});

test.run();
