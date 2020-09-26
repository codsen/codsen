import tap from "tap";
import detect from "../dist/detect-is-it-html-or-xhtml.esm";

tap.test("01 - real-life code", (t) => {
  t.equal(
    detect(
      `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>Tile</title>
</head>
<body>
<table width="100%" border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td>
      <img src="image.jpg" width="zzz" height="zzz" border="0" style="display:block;" alt="zzz"/>
    </td>
  </tr>
</table>
</body>
</html>`
    ),
    "xhtml",
    "01"
  );
  t.end();
});
