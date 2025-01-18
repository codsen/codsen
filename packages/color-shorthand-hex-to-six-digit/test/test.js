/* eslint func-names:0 */

import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { conv } from "../dist/color-shorthand-hex-to-six-digit.esm.js";

// ==============================
// 01. String inputs
// ==============================

test("01 - string input - doesn't touch full hex codes", () => {
  equal(
    conv("aaaa #cccccc zzzz\n\t\t\t#000000."),
    "aaaa #cccccc zzzz\n\t\t\t#000000.",
    "01.01",
  );
});

test("02 - string input - changes one shorthand, lowercase", () => {
  equal(
    conv("aaaa #f0c zzzz\n\t\t\t#ffcc00"),
    "aaaa #ff00cc zzzz\n\t\t\t#ffcc00",
    "02.01",
  );
  equal(
    conv("aaaa #ff00cc zzzz\n\t\t\t#fc0"),
    "aaaa #ff00cc zzzz\n\t\t\t#ffcc00",
    "02.02",
  );
  equal(
    conv("aaaa #f0c zzzz\n\t\t\t#fc0"),
    "aaaa #ff00cc zzzz\n\t\t\t#ffcc00",
    "02.03",
  );
});

test("03 - string input - changes one shorthand, uppercase", () => {
  equal(
    conv("aaaa #f0c zzzz\n\t\t\t#ffcc00"),
    "aaaa #ff00cc zzzz\n\t\t\t#ffcc00",
    "03.01",
  );
  equal(
    conv("aaaa #ff00cc zzzz\n\t\t\t#fc0"),
    "aaaa #ff00cc zzzz\n\t\t\t#ffcc00",
    "03.02",
  );
  equal(
    conv("aaaa #f0c zzzz\n\t\t\t#fc0"),
    "aaaa #ff00cc zzzz\n\t\t\t#ffcc00",
    "03.03",
  );
});

// ==============================
// 02. Plain object inputs
// ==============================

test("04 - plain object input - simple one level object", () => {
  equal(
    conv({
      a: "#ffcc00",
      b: "#f0c",
      c: "text",
    }),
    {
      a: "#ffcc00",
      b: "#ff00cc",
      c: "text",
    },
    "04.01",
  );
  equal(
    conv({
      a: "#fc0",
      b: "#f0c",
      c: "text",
    }),
    {
      a: "#ffcc00",
      b: "#ff00cc",
      c: "text",
    },
    "04.02",
  );
});

test("05 - plain object input - nested", () => {
  equal(
    conv({
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
    "05.01",
  );
});

// ==============================
// 03. Array inputs
// ==============================

test("06 - array input - one level, strings inside", () => {
  equal(
    conv(["#fc0", "#f0c", "text", ""]),
    ["#ffcc00", "#ff00cc", "text", ""],
    "06.01",
  );
});

test("07 - array input - nested objects & arrays", () => {
  equal(
    conv([[[[[[{ x: ["#fc0"] }]]]]], { z: "#f0c" }, ["text"], { y: "" }]),
    [[[[[[{ x: ["#ffcc00"] }]]]]], { z: "#ff00cc" }, ["text"], { y: "" }],
    "07.01",
  );
});

// ==================================
// 04. Unaccepted inputs are returned
// ==================================

test("08 - function as input - returned", () => {
  let dummy = function () {
    return null;
  };
  equal(conv(dummy), dummy, "08.01");
});

test("09 - null input - returned", () => {
  equal(conv(null), null, "09.01");
});

test("10 - undefined input - returned", () => {
  equal(conv(undefined), undefined, "10.01");
});

test("11 - NaN input - returned", () => {
  equal(conv(NaN), NaN, "11.01");
});

test("12 - no input - returned undefined", () => {
  equal(conv(), undefined, "12.01");
});

// ==============================
// 05. Enforces all hexes to be lowercase only
// ==============================

test("13 - fixes mixed case three and six digit hexes", () => {
  equal(
    conv("aaaa #cCccCc zzzz\n\t\t\t#ffF."),
    "aaaa #cccccc zzzz\n\t\t\t#ffffff.",
    "13.01",
  );
});

// ==============================
// 06. Does not mutate input args
// ==============================

test("14 - does not mutate the input args", () => {
  let input1 = {
    a: "aaaa #f0c zzzz\n\t\t\t#FFcc00",
    b: "aaaa #ff00CC zzzz\n\t\t\t#ffcc00",
  };

  let unneededRes = conv(input1);
  ok(unneededRes, "14.01"); // dummy to please JS Standard
  equal(
    input1,
    {
      a: "aaaa #f0c zzzz\n\t\t\t#FFcc00",
      b: "aaaa #ff00CC zzzz\n\t\t\t#ffcc00",
    },
    "14.02",
  ); // real deal
});

// =============================
// 07. Deals with real HTML code
// =============================

test("15 - does not remove closing slashes from XHTML, #1", () => {
  equal(
    conv(
      '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\n<html xmlns="http://www.w3.org/1999/xhtml">\n<head>\n  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />\n  <style type="text/css">\n    @media (max-width: 600px) {\n      .real-class-1#head-only-class-1[lang|en]{width:100% !important;}\n      #real-id-1.head-only-class-1:hover{display: block !important;}\n      .head-only-class-2[lang|en]{color: #CCC !important;}\n      @media (max-width: 200px) {\n        #real-id-1{background-color: #000;}\n      }\n      @media (max-width: 100px) {\n        .head-only-class-1{border: 1px solid #FfF !important;}\n      }\n    }\n  </style>\n  <title>zzzz</title>\n  <style type="text/css">\n    .real-class-1#head-only-class-1[lang|en]{color: #c0f !important;}\n    #real-id-1.head-only-class-1:hover{display: block !important;}\n    .head-only-class-3[lang|en]{background-color: #ff0 !important;}\n    div .real-class-1 a:hover {color: #00c;}\n  </style>\n</head>\n<body>\n  <table id="real-id-1" width="100%" border="0" cellpadding="0" cellspacing="0">\n    <tr>\n      <td class="real-class-1" style="color: #ffc;">\n        <img src="spacer.gif" alt="spacer" />\n      </td>\n    </tr>\n  </table>\n</body>\n</html>\n',
    ),

    '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\n<html xmlns="http://www.w3.org/1999/xhtml">\n<head>\n  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />\n  <style type="text/css">\n    @media (max-width: 600px) {\n      .real-class-1#head-only-class-1[lang|en]{width:100% !important;}\n      #real-id-1.head-only-class-1:hover{display: block !important;}\n      .head-only-class-2[lang|en]{color: #cccccc !important;}\n      @media (max-width: 200px) {\n        #real-id-1{background-color: #000000;}\n      }\n      @media (max-width: 100px) {\n        .head-only-class-1{border: 1px solid #ffffff !important;}\n      }\n    }\n  </style>\n  <title>zzzz</title>\n  <style type="text/css">\n    .real-class-1#head-only-class-1[lang|en]{color: #cc00ff !important;}\n    #real-id-1.head-only-class-1:hover{display: block !important;}\n    .head-only-class-3[lang|en]{background-color: #ffff00 !important;}\n    div .real-class-1 a:hover {color: #0000cc;}\n  </style>\n</head>\n<body>\n  <table id="real-id-1" width="100%" border="0" cellpadding="0" cellspacing="0">\n    <tr>\n      <td class="real-class-1" style="color: #ffffcc;">\n        <img src="spacer.gif" alt="spacer" />\n      </td>\n    </tr>\n  </table>\n</body>\n</html>\n',
    "15.01",
  );
});

test("16 - does not remove closing slashes from XHTML, #2", () => {
  equal(
    conv('<img src="spacer.gif" alt="spacer" />'),
    '<img src="spacer.gif" alt="spacer" />',
    "16.01",
  );
});

test("17 - does not mangle encoded HTML entities that look like hex codes", () => {
  equal(
    conv("aaa &#124; bbb #125 ccc &#126; ddd"),
    "aaa &#124; bbb #112255 ccc &#126; ddd",
    "17.01",
  );
});

test.run();
