// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
/* eslint func-names:0 */

import { test } from "uvu";
import { equal, is, match, ok, throws, type } from "uvu/assert";

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
  let dummy = () => null;
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

test("13 - normalises supported hex lengths and rejects invalid lengths", () => {
  equal(
    conv("aaaa #cCccCc zzzz\n\t\t\t#ffF."),
    "aaaa #cccccc zzzz\n\t\t\t#ffffff.",
    "13.01",
  );
  equal(conv("#AbC8"), "#abc8", "13.02");
  equal(conv("#AbCdEf12"), "#abcdef12", "13.03");
  equal(conv("#AbCdE"), "#AbCdE", "13.04");
  equal(conv("#AbCdEf1"), "#AbCdEf1", "13.05");
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
    "14.01",
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

test("18 - avoids likely CSS selectors and references", () => {
  equal(conv("#abc:hover {}"), "#abc:hover {}", "18.01");
  equal(conv("#abc-foo {}"), "#abc-foo {}", "18.02");
  equal(conv("#abcé {}"), "#abcé {}", "18.03");
  equal(conv("#abc {}"), "#abc {}", "18.04");
  equal(conv(".root #abc[data-kind] {}"), ".root #abc[data-kind] {}", "18.05");
  equal(conv(".root #abc.child {}"), ".root #abc.child {}", "18.06");
  equal(conv("svg { fill: url(#abc); }"), "svg { fill: url(#abc); }", "18.07");
  equal(conv('<a href="#abc">'), '<a href="#abc">', "18.08");
  equal(conv("<use xlink:href='#abc'>"), "<use xlink:href='#abc'>", "18.09");
  equal(conv("color: #abc;"), "color: #aabbcc;", "18.10");
  equal(conv("the colour #abc."), "the colour #aabbcc.", "18.11");
  equal(conv("#abc"), "#aabbcc", "18.12");
  equal(
    conv('svg { fill: URL(  "#abc"); }'),
    'svg { fill: URL(  "#abc"); }',
    "18.13",
  );
  equal(conv('<a HREF =  "#abc">'), '<a HREF =  "#abc">', "18.14");
  equal(conv('<a data-href="#abc">'), '<a data-href="#aabbcc">', "18.15");
  equal(conv(`the colour\u00a0#abc.`), `the colour\u00a0#aabbcc.`, "18.16");
  equal(conv('fn("#abc")'), 'fn("#aabbcc")', "18.17");
});

test("19 - preserves ID selectors across selector grammar", () => {
  const selectors = [
    "#abc, #def {}",
    "#abc div {}",
    "#abc * {}",
    "#abc/* comment */.child {}",
    "#abc /* comment */ div {}",
    ":not(#abc, #def) {}",
    ":is(.root, #abc) {}",
    "#abc || td {}",
    '#abc[data-token="{"] {}',
    "#abc > * + [data-kind] {}",
  ];

  selectors.forEach((selector, index) => {
    equal(selector, conv(selector), `19.${String(index + 1).padStart(2, "0")}`);
  });
});

test("20 - still converts colors outside selector preludes", () => {
  equal(conv("color: #abc;"), "color: #aabbcc;", "20.01");
  equal(
    conv("background: linear-gradient(#abc, #def);"),
    "background: linear-gradient(#aabbcc, #ddeeff);",
    "20.02",
  );
  equal(conv("the colour #abc."), "the colour #aabbcc.", "20.03");
  equal(conv("#abc"), "#aabbcc", "20.04");
});

test("21 - preserves complete CSS and HTML resource references", () => {
  const references = [
    "url(#abc)",
    'URL("#abc")',
    'url(/* comment */ "#abc")',
    "url(\\#abc)",
    "url(sprite.svg#abc)",
    "url('sprite.svg#abc')",
    "src(#abc)",
    'SRC(/* comment */ "icons.svg#abc")',
    '<a href="icons.svg#abc">',
    "<use xlink:href='icons.svg#abc'>",
    'a[href="icons.svg#abc"] {}',
  ];

  references.forEach((reference, index) => {
    equal(
      conv(reference),
      reference,
      `21.${String(index + 1).padStart(2, "0")}`,
    );
  });
});

test("22 - converts hashes in similarly named non-reference contexts", () => {
  equal(conv("myurl(#abc)"), "myurl(#aabbcc)", "22.01");
  equal(conv("curl(#abc)"), "curl(#aabbcc)", "22.02");
  equal(conv("srcColor(#abc)"), "srcColor(#aabbcc)", "22.03");
  equal(
    conv('<a data-href="icons.svg#abc">'),
    '<a data-href="icons.svg#aabbcc">',
    "22.04",
  );
  equal(
    conv("linear-gradient(#abc, #def)"),
    "linear-gradient(#aabbcc, #ddeeff)",
    "22.05",
  );
});

test("23 - preserves own proto keys and plain-object prototypes", () => {
  const parsed = JSON.parse('{"__proto__":{"color":"#def"},"regular":"#abc"}');
  const parsedResult = conv(parsed);
  const protoDescriptor = Object.getOwnPropertyDescriptor(
    parsedResult,
    "__proto__",
  );

  equal(parsedResult.regular, "#aabbcc", "23.01");
  equal(protoDescriptor.value, { color: "#ddeeff" }, "23.02");
  equal(
    {
      configurable: protoDescriptor.configurable,
      enumerable: protoDescriptor.enumerable,
      writable: protoDescriptor.writable,
    },
    { configurable: true, enumerable: true, writable: true },
    "23.03",
  );
  is(Object.getPrototypeOf(parsedResult), Object.prototype, "23.04");
  is(Object.getPrototypeOf(protoDescriptor.value), Object.prototype, "23.05");

  const dictionary = Object.create(null);
  Object.defineProperty(dictionary, "__proto__", {
    configurable: true,
    enumerable: true,
    value: "#abc",
    writable: true,
  });
  dictionary.nested = Object.create(null);
  dictionary.nested.color = "#def";
  const dictionaryResult = conv(dictionary);

  is(Object.getPrototypeOf(dictionaryResult), null, "23.06");
  is(Object.getPrototypeOf(dictionaryResult.nested), null, "23.07");
  equal(
    Object.getOwnPropertyDescriptor(dictionaryResult, "__proto__").value,
    "#aabbcc",
    "23.08",
  );
  equal(dictionaryResult.nested.color, "#ddeeff", "23.09");
  equal(
    Object.getOwnPropertyDescriptor(dictionary, "__proto__").value,
    "#abc",
    "23.10",
  );
  equal(dictionary.nested.color, "#def", "23.11");

  const token = Symbol("token");
  const withSymbol = { color: "#abc", [token]: "#def" };
  const withSymbolResult = conv(withSymbol);

  equal(withSymbolResult.color, "#aabbcc", "23.12");
  equal(withSymbolResult[token], "#ddeeff", "23.13");
  equal(withSymbol[token], "#def", "23.14");
});

test("24 - preserves graph shape and propagates property access errors", () => {
  const cyclicObject = { color: "#abc" };
  cyclicObject.self = cyclicObject;
  const cyclicObjectResult = conv(cyclicObject);

  is(cyclicObjectResult === cyclicObject, false, "24.01");
  equal(cyclicObjectResult.color, "#aabbcc", "24.02");
  is(cyclicObjectResult.self, cyclicObjectResult, "24.03");

  const cyclicArray = ["#def"];
  cyclicArray.push(cyclicArray);
  const cyclicArrayResult = conv(cyclicArray);

  is(cyclicArrayResult === cyclicArray, false, "24.04");
  equal(cyclicArrayResult[0], "#ddeeff", "24.05");
  is(cyclicArrayResult[1], cyclicArrayResult, "24.06");

  const shared = { color: "#abc" };
  const sharedResult = conv({ first: shared, second: shared });

  is(sharedResult.first === shared, false, "24.07");
  is(sharedResult.first, sharedResult.second, "24.08");
  equal(sharedResult.first.color, "#aabbcc", "24.09");

  const sparse = new Array(3);
  sparse[2] = "#abc";
  const sparseResult = conv(sparse);

  equal(sparseResult.length, 3, "24.10");
  is(0 in sparseResult, false, "24.11");
  equal(sparseResult[2], "#aabbcc", "24.12");

  let deeplyNested = "#abc";
  for (let index = 0; index < 250; index += 1) {
    deeplyNested = { value: deeplyNested };
  }
  let deeplyNestedResult = conv(deeplyNested);
  for (let index = 0; index < 250; index += 1) {
    deeplyNestedResult = deeplyNestedResult.value;
  }
  equal(deeplyNestedResult, "#aabbcc", "24.13");

  const accessorError = new Error("getter failed");
  const withThrowingAccessor = {};
  Object.defineProperty(withThrowingAccessor, "color", {
    enumerable: true,
    get() {
      throw accessorError;
    },
  });
  throws(() => conv(withThrowingAccessor), accessorError, "24.14");
});

test.run();
