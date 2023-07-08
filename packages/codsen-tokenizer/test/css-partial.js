import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { tokenizer as ct } from "../dist/codsen-tokenizer.esm.js";

// This programmatic test is to ensure the tokenizer doesn't
// throw on partial input. We take a sample source code,
// run tokenizer with the first character of the source,
// then run with two first characters, then with three,
// and so on, until we run in (str.length) runs we cover
// the whole input source.

test("no throwing on partial inputs, anywhere", () => {
  let str = `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
<meta charset="utf-8">
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
<!--[if !mso]><!-- -->
<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
<!--<![endif]-->
<meta name="format-detection" content="telephone=no"/>
<meta name="format-detection" content="date=no"/>
<meta name="format-detection" content="address=no"/>
<meta name="format-detection" content="email=no"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<link rel="icon" href="https://codsen.com/favicon.ico" type="image/x-icon"/>
<title>x</title>
<style type=text/css>
@a b {.c{d: e}@f g {.h{i: j}}.k{l: m}}
@c e {.c{d: e !important}@f g {.h{i: j !important}}.k{l: m !important}}
@f g {.c{d: e !important; e: f !important; color: red !important;}@f g {.h{i: j !important; m: n !important; }
} .k {
  l: m !important;
}
}
</style>

</head>
<body id="l" style="color:#000000;background-color:#CCC;font-family:Arial,sans-serif;font-size:14px;margin:0;padding:0;" bgcolor="#fefefe"><center style="-webkit-text-size-adjust:none;-moz-text-size-adjust:none;-ms-text-size-adjust:none;text-size-adjust:none;background-color:#CCCCCC;margin:0;padding:0 0 20px;display:block;">
<table width="100" border="0" cellpadding="0" cellspacing="0">
<tr>
<td>
<table width="100" border="0" cellpadding="0" cellspacing="0" align="left" style="font-size: 1px; mso-line-height-rule:exactly; line-height: 2px; color: red !imporant;">
<tr>
<td class="y" id="m" align="left" style="color: #ccc; text-decoration: none !important;">
<div class="x">x</div>
</td>
</tr>
</table>
</td>
</tr>
</table>
</center>
</body>
</html>`;

  for (let i = 1, len = str.length; i < len; i++) {
    not.throws(
      () =>
        ct(str.slice(0, i), {
          tagCb: () => {},
        }),
      `${str.slice(0, i)}`,
    );
  }
});

test("02 isolated", () => {
  not.throws(
    () =>
      ct('<body id="l" style="', {
        tagCb: () => {},
      }),
    "02.01",
  );
});

test.run();
