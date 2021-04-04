import tap from "tap";
import { comb } from "./util/util";

// whitelisting
// -----------------------------------------------------------------------------

tap.test("01 - nothing removed because of settings.whitelist", (t) => {
  const actual = comb(
    t,
    `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" />
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>Tile</title>
<style type="text/css">
  .module-1{display: none !important;}
  .module-2{display: none !important;}
  .module-3{display: none !important;}
  .module-zzzzkldfjglfjhlfjlhfglj{display: none !important;}
  .particular{width: 100% !important;}
</style>
</head>
<body>
<table class="module-92" width="100%" border="0" cellpadding="0" cellspacing="0">
<tr class="module-93">
  <td class="module-94 module-lkfjgldhglktjja">
    <img class="module-91" src="image.jpg" width="zzz" height="zzz" border="0" style="display:block;" alt="zzz" />
  </td>
</tr>
</table>
</body>
</html>
`,
    {
      whitelist: [".module-*", ".particular"],
    }
  ).result;

  const intended = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" />
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>Tile</title>
<style type="text/css">
  .module-1{display: none !important;}
  .module-2{display: none !important;}
  .module-3{display: none !important;}
  .module-zzzzkldfjglfjhlfjlhfglj{display: none !important;}
  .particular{width: 100% !important;}
</style>
</head>
<body>
<table class="module-92" width="100%" border="0" cellpadding="0" cellspacing="0">
<tr class="module-93">
  <td class="module-94 module-lkfjgldhglktjja">
    <img class="module-91" src="image.jpg" width="zzz" height="zzz" border="0" style="display:block;" alt="zzz" />
  </td>
</tr>
</table>
</body>
</html>
`;

  t.strictSame(actual, intended, "01");
  t.end();
});

tap.test("02 - some removed, some whitelisted", (t) => {
  const actual = comb(
    t,
    `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" />
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>Tile</title>
<style type="text/css">
  .module-1{display: none !important;}
  .module-2{display: none !important;}
  .module-3{display: none !important;}
  .module-zzzzkldfjglfjhlfjlhfglj{display: none !important;}
  .head-only-class-1 a.module-94:hover{width: 100% !important;}
  #head-only-id-1[lang|en]{width: 100% !important;}
</style>
</head>
<body>
<table class="module-92" width="100%" border="0" cellpadding="0" cellspacing="0">
<tr class="module-93 body-only-class-1">
  <td id="body-only-id-1" class="module-94 module-lkfjgldhglktjja">
    <img class="module-91" src="image.jpg" width="zzz" height="zzz" border="0" style="display:block;" alt="zzz" />
  </td>
</tr>
</table>
</body>
</html>
`,
    {
      whitelist: [".module-*", ".particular"],
    }
  ).result;

  const intended = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" />
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>Tile</title>
<style type="text/css">
  .module-1{display: none !important;}
  .module-2{display: none !important;}
  .module-3{display: none !important;}
  .module-zzzzkldfjglfjhlfjlhfglj{display: none !important;}
</style>
</head>
<body>
<table class="module-92" width="100%" border="0" cellpadding="0" cellspacing="0">
<tr class="module-93">
  <td class="module-94 module-lkfjgldhglktjja">
    <img class="module-91" src="image.jpg" width="zzz" height="zzz" border="0" style="display:block;" alt="zzz" />
  </td>
</tr>
</table>
</body>
</html>
`;

  t.strictSame(actual, intended, "02");
  t.end();
});

tap.test("03 - case of whitelisting everything", (t) => {
  const actual = comb(
    t,
    `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" />
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>Tile</title>
<style type="text/css">
  .module-1{display: none !important;}
  .module-2{display: none !important;}
  .module-3{display: none !important;}
  .module-zzzzkldfjglfjhlfjlhfglj{display: none !important;}
  .head-only-class-1 a.module-94:hover{width: 100% !important;}
  #head-only-id-1[lang|en]{width: 100% !important;}
</style>
</head>
<body>
<table class="module-92" width="100%" border="0" cellpadding="0" cellspacing="0">
<tr class="module-93 body-only-class-1">
  <td id="body-only-id-1" class="module-94 module-lkfjgldhglktjja">
    <img class="module-91" src="image.jpg" width="zzz" height="zzz" border="0" style="display:block;" alt="zzz" />
  </td>
</tr>
</table>
</body>
</html>
`,
    {
      whitelist: ["*"],
    }
  ).result;

  const intended = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" />
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>Tile</title>
<style type="text/css">
  .module-1{display: none !important;}
  .module-2{display: none !important;}
  .module-3{display: none !important;}
  .module-zzzzkldfjglfjhlfjlhfglj{display: none !important;}
  .head-only-class-1 a.module-94:hover{width: 100% !important;}
  #head-only-id-1[lang|en]{width: 100% !important;}
</style>
</head>
<body>
<table class="module-92" width="100%" border="0" cellpadding="0" cellspacing="0">
<tr class="module-93 body-only-class-1">
  <td id="body-only-id-1" class="module-94 module-lkfjgldhglktjja">
    <img class="module-91" src="image.jpg" width="zzz" height="zzz" border="0" style="display:block;" alt="zzz" />
  </td>
</tr>
</table>
</body>
</html>
`;

  t.strictSame(actual, intended, "03");
  t.end();
});

tap.test("04 - special case - checking adjacent markers #1", (t) => {
  const actual = comb(
    t,
    `<style type="text/css">
  .del-1{display: none;}
  .real{display: none;}
  .del-3{display: none;}
</style>
<body class="real">
zzz
</body>`
  ).result;

  const intended = `<style type="text/css">
  .real{display: none;}
</style>
<body class="real">
zzz
</body>`;

  t.strictSame(actual, intended, "04");
  t.end();
});

tap.test("05 - special case - checking adjacent markers #2", (t) => {
  const actual = comb(
    t,
    `<style type="text/css">.del-1{display: none;}.del-2{display: none;}.del-3{display: none;}</style>
<body>
zzz
</body>
`
  ).result;

  const intended = `<body>
zzz
</body>
`;

  t.strictSame(actual, intended, "05");
  t.end();
});

// div~[^whatever] .del-1 {display: none;}
tap.test("06 - special case - checking commas within curly braces", (t) => {
  const actual = comb(
    t,
    `
<style type="text/css">
  .used {display: block;}
  .deleteme{,,,<<<,>>>,,,,,}
</style>
<body class="used">
zzz
</body>`
  ).result;

  const intended = `<style type="text/css">
  .used {display: block;}
</style>
<body class="used">
zzz
</body>`;

  t.strictSame(actual, intended, "06");
  t.end();
});
