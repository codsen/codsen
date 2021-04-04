import tap from "tap";
import { comb } from "./util/util";

// output info object
// -----------------------------------------------------------------------------

tap.test(
  "01 - returned correct info object, nothing to delete from body, damaged HTML",
  (t) => {
    const actual = comb(
      t,
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
    <br><br>`
    );

    t.strictSame(
      actual.allInHead,
      ["#non-existent-id", "#other", ".non-existent-class"],
      "01.01"
    );
    t.strictSame(actual.allInBody, [], "01.02");
    t.strictSame(
      actual.deletedFromHead,
      ["#non-existent-id", "#other", ".non-existent-class"],
      "01.03"
    );
    t.strictSame(actual.deletedFromBody, [], "01.04");
    t.end();
  }
);

tap.test("02 - returned correct info object, clean HTML", (t) => {
  const actual = comb(
    t,
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
`
  );

  t.strictSame(
    actual.allInHead,
    ["#non-existent-id", "#other", ".non-existent-class"],
    "02.01"
  );
  t.strictSame(
    actual.allInBody,
    ["#unused4", ".unused1", ".unused2", ".unused3"],
    "02.02"
  );
  t.strictSame(
    actual.deletedFromHead,
    ["#non-existent-id", "#other", ".non-existent-class"],
    "02.03"
  );
  t.strictSame(
    actual.deletedFromBody,
    ["#unused4", ".unused1", ".unused2", ".unused3"],
    "02.04"
  );
  t.end();
});

tap.test("03 - as 06.02 but now with whitelist, dirty HTML", (t) => {
  const actual = comb(
    t,
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
  t.strictSame(
    actual.allInHead,
    ["#non-existent-id", "#other", ".non-existent-class"],
    "03.01"
  );
  t.strictSame(
    actual.allInBody,
    [".body-only-class-1", ".body-only-class-2"],
    "03.02"
  );
  t.strictSame(
    actual.deletedFromHead,
    [],
    "03.03 - nothing removed because of whitelist"
  );
  t.strictSame(
    actual.deletedFromBody,
    [],
    "03.04 - nothing removed because of whitelist"
  );
  t.end();
});

tap.test("04 - correct classes reported in info/deletedFromBody", (t) => {
  const actual = comb(
    t,
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
`
  );

  t.strictSame(actual.allInHead, [".unused", ".used"], "04.01");
  t.strictSame(actual.allInBody, [".used"], "04.02");
  t.strictSame(actual.deletedFromHead, [".unused", ".used"], "04.03");
  t.strictSame(
    actual.deletedFromBody,
    [".used"],
    "04.04 - sneaky case - it is within head, but it is sandwitched with an unused class, so it does not count!"
  );
  t.end();
});

tap.test("05 - more sandwitched classes/ids cases", (t) => {
  const actual = comb(
    t,
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
`
  );

  t.strictSame(
    actual.allInHead,
    ["#unused-id", "#used-id", ".unused-class", ".used-class"],
    "05.01"
  );
  t.strictSame(actual.allInBody, ["#used-id", ".used-class"], "05.02");
  t.strictSame(
    actual.deletedFromHead,
    ["#unused-id", "#used-id", ".unused-class", ".used-class"],
    "05.03 - deleted because they'e sandwitched with unused classes/ids"
  );
  t.strictSame(
    actual.deletedFromBody,
    ["#used-id", ".used-class"],
    "05.04 - deleted because they'e sandwitched with unused classes/ids"
  );
  t.end();
});
