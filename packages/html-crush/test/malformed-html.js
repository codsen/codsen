import { test } from "uvu";
import { equal } from "uvu/assert";

import { crush } from "../dist/html-crush.esm.js";

test("01 - preserves event attributes across malformed attribute separators", () => {
  const inputs = [
    "<p/onclick=alert(1)>x</p>",
    '<p style="a"/onclick=alert(1)>x</p>',
    '<p style="a"onclick=alert(1)>x</p>',
    "<p\n/onclick=alert(1)>x</p>",
    '<div/onmouseover=alert(1) style="position:fixed;inset:0">x</div>',
    "<p///onclick=alert(1)>x</p>",
    '<p class="used"onclick="alert(1)">x</p>',
  ];

  // Minification preserves attributes; it does not select safe attributes.
  equal(
    inputs.map((input) => crush(input).result),
    inputs,
    "01.01",
  );
});

test("02 - unfinished comment-like markup terminates and retains its source", () => {
  const inputs = [
    "<![CDATA[",
    "<![CDATA[ x",
    "<![if x]>",
    "<!--",
    "<p>x</p><!--",
    "<p>x</p><?",
    "<p>x</p><!",
    "<p>x</p></3",
  ];

  equal(
    inputs.map((input) => crush(input).result),
    inputs,
    "02.01",
  );
});

test.run();
