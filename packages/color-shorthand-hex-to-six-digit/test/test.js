/* eslint func-names:0 */

import tap from "tap";
import c from "../dist/color-shorthand-hex-to-six-digit.esm";

// ==============================
// 01. String inputs
// ==============================

tap.test("01 - string input - doesn't touch full hex codes", (t) => {
  t.strictSame(
    c("aaaa #cccccc zzzz\n\t\t\t#000000."),
    "aaaa #cccccc zzzz\n\t\t\t#000000.",
    "01"
  );
  t.end();
});

tap.test("02 - string input - changes one shorthand, lowercase", (t) => {
  t.strictSame(
    c("aaaa #f0c zzzz\n\t\t\t#ffcc00"),
    "aaaa #ff00cc zzzz\n\t\t\t#ffcc00",
    "02.01"
  );
  t.strictSame(
    c("aaaa #ff00cc zzzz\n\t\t\t#fc0"),
    "aaaa #ff00cc zzzz\n\t\t\t#ffcc00",
    "02.02"
  );
  t.strictSame(
    c("aaaa #f0c zzzz\n\t\t\t#fc0"),
    "aaaa #ff00cc zzzz\n\t\t\t#ffcc00",
    "02.03"
  );
  t.end();
});

tap.test("03 - string input - changes one shorthand, uppercase", (t) => {
  t.strictSame(
    c("aaaa #f0c zzzz\n\t\t\t#ffcc00"),
    "aaaa #ff00cc zzzz\n\t\t\t#ffcc00",
    "03.01"
  );
  t.strictSame(
    c("aaaa #ff00cc zzzz\n\t\t\t#fc0"),
    "aaaa #ff00cc zzzz\n\t\t\t#ffcc00",
    "03.02"
  );
  t.strictSame(
    c("aaaa #f0c zzzz\n\t\t\t#fc0"),
    "aaaa #ff00cc zzzz\n\t\t\t#ffcc00",
    "03.03"
  );
  t.end();
});

// ==============================
// 02. Plain object inputs
// ==============================

tap.test("04 - plain object input - simple one level object", (t) => {
  t.strictSame(
    c({
      a: "#ffcc00",
      b: "#f0c",
      c: "text",
    }),
    {
      a: "#ffcc00",
      b: "#ff00cc",
      c: "text",
    },
    "04.01"
  );
  t.strictSame(
    c({
      a: "#fc0",
      b: "#f0c",
      c: "text",
    }),
    {
      a: "#ffcc00",
      b: "#ff00cc",
      c: "text",
    },
    "04.02"
  );
  t.end();
});

tap.test("05 - plain object input - nested", (t) => {
  t.strictSame(
    c({
      a: ["#fc0"],
      b: [[["#fc0", { x: ["#f0c"] }]]],
      c: "text",
      d: null,
    }),
    {
      a: ["#ffcc00"],
      b: [[["#ffcc00", { x: ["#ff00cc"] }]]],
      c: "text",
      d: null,
    },
    "05"
  );
  t.end();
});

// ==============================
// 03. Array inputs
// ==============================

tap.test("06 - array input - one level, strings inside", (t) => {
  t.strictSame(
    c(["#fc0", "#f0c", "text", ""]),
    ["#ffcc00", "#ff00cc", "text", ""],
    "06"
  );
  t.end();
});

tap.test("07 - array input - nested objects & arrays", (t) => {
  t.strictSame(
    c([[[[[[{ x: ["#fc0"] }]]]]], { z: "#f0c" }, ["text"], { y: "" }]),
    [[[[[[{ x: ["#ffcc00"] }]]]]], { z: "#ff00cc" }, ["text"], { y: "" }],
    "07"
  );
  t.end();
});

// ==================================
// 04. Unaccepted inputs are returned
// ==================================

tap.test("08 - function as input - returned", (t) => {
  const dummy = function () {
    return null;
  };
  t.strictSame(c(dummy), dummy, "08");
  t.end();
});

tap.test("09 - null input - returned", (t) => {
  t.strictSame(c(null), null, "09");
  t.end();
});

tap.test("10 - undefined input - returned", (t) => {
  t.strictSame(c(undefined), undefined, "10");
  t.end();
});

tap.test("11 - NaN input - returned", (t) => {
  t.strictSame(c(NaN), NaN, "11");
  t.end();
});

tap.test("12 - no input - returned undefined", (t) => {
  t.strictSame(c(), undefined, "12");
  t.end();
});

// ==============================
// 05. Enforces all hexes to be lowercase only
// ==============================

tap.test("13 - fixes mixed case three and six digit hexes", (t) => {
  t.strictSame(
    c("aaaa #cCccCc zzzz\n\t\t\t#ffF."),
    "aaaa #cccccc zzzz\n\t\t\t#ffffff.",
    "13"
  );
  t.end();
});

// ==============================
// 06. Does not mutate input args
// ==============================

tap.test("14 - does not mutate the input args", (t) => {
  const input1 = {
    a: "aaaa #f0c zzzz\n\t\t\t#FFcc00",
    b: "aaaa #ff00CC zzzz\n\t\t\t#ffcc00",
  };

  const unneededRes = c(input1);
  t.pass(unneededRes); // dummy to please JS Standard
  t.strictSame(
    input1,
    {
      a: "aaaa #f0c zzzz\n\t\t\t#FFcc00",
      b: "aaaa #ff00CC zzzz\n\t\t\t#ffcc00",
    },
    "14.01"
  ); // real deal
  t.end();
});

// =============================
// 07. Deals with real HTML code
// =============================

tap.test("15 - does not remove closing slashes from XHTML, #1", (t) => {
  t.strictSame(
    c(
      '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\n<html xmlns="http://www.w3.org/1999/xhtml">\n<head>\n  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />\n  <style type="text/css">\n    @media (max-width: 600px) {\n      .real-class-1#head-only-class-1[lang|en]{width:100% !important;}\n      #real-id-1.head-only-class-1:hover{display: block !important;}\n      .head-only-class-2[lang|en]{color: #CCC !important;}\n      @media (max-width: 200px) {\n        #real-id-1{background-color: #000;}\n      }\n      @media (max-width: 100px) {\n        .head-only-class-1{border: 1px solid #FfF !important;}\n      }\n    }\n  </style>\n  <title>zzzz</title>\n  <style type="text/css">\n    .real-class-1#head-only-class-1[lang|en]{color: #c0f !important;}\n    #real-id-1.head-only-class-1:hover{display: block !important;}\n    .head-only-class-3[lang|en]{background-color: #ff0 !important;}\n    div .real-class-1 a:hover {color: #00c;}\n  </style>\n</head>\n<body>\n  <table id="real-id-1" width="100%" border="0" cellpadding="0" cellspacing="0">\n    <tr>\n      <td class="real-class-1" style="color: #ffc;">\n        <img src="spacer.gif" alt="spacer" />\n      </td>\n    </tr>\n  </table>\n</body>\n</html>\n'
    ),

    '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\n<html xmlns="http://www.w3.org/1999/xhtml">\n<head>\n  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />\n  <style type="text/css">\n    @media (max-width: 600px) {\n      .real-class-1#head-only-class-1[lang|en]{width:100% !important;}\n      #real-id-1.head-only-class-1:hover{display: block !important;}\n      .head-only-class-2[lang|en]{color: #cccccc !important;}\n      @media (max-width: 200px) {\n        #real-id-1{background-color: #000000;}\n      }\n      @media (max-width: 100px) {\n        .head-only-class-1{border: 1px solid #ffffff !important;}\n      }\n    }\n  </style>\n  <title>zzzz</title>\n  <style type="text/css">\n    .real-class-1#head-only-class-1[lang|en]{color: #cc00ff !important;}\n    #real-id-1.head-only-class-1:hover{display: block !important;}\n    .head-only-class-3[lang|en]{background-color: #ffff00 !important;}\n    div .real-class-1 a:hover {color: #0000cc;}\n  </style>\n</head>\n<body>\n  <table id="real-id-1" width="100%" border="0" cellpadding="0" cellspacing="0">\n    <tr>\n      <td class="real-class-1" style="color: #ffffcc;">\n        <img src="spacer.gif" alt="spacer" />\n      </td>\n    </tr>\n  </table>\n</body>\n</html>\n',
    "15"
  );
  t.end();
});

tap.test("16 - does not remove closing slashes from XHTML, #2", (t) => {
  t.strictSame(
    c('<img src="spacer.gif" alt="spacer" />'),
    '<img src="spacer.gif" alt="spacer" />',
    "16"
  );
  t.end();
});

tap.test(
  "17 - does not mangle encoded HTML entities that look like hex codes",
  (t) => {
    t.strictSame(
      c("aaa &#124; bbb #125 ccc &#126; ddd"),
      "aaa &#124; bbb #112255 ccc &#126; ddd",
      "17"
    );
    t.end();
  }
);
