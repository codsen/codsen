import { test } from "uvu";
import { equal } from "uvu/assert";

import { comb } from "../dist/email-comb.esm.js";

test("01 - preserves event attributes across malformed attribute separators", () => {
  const inputs = [
    "<p/onclick=alert(1)>x</p>",
    '<p style="a"/onclick=alert(1)>x</p>',
    '<p style="a"onclick=alert(1)>x</p>',
    "<p\n/onclick=alert(1)>x</p>",
    '<div/onmouseover=alert(1) style="position:fixed;inset:0">x</div>',
    "<p///onclick=alert(1)>x</p>",
  ];

  // CSS reduction preserves event attributes; it does not sanitize HTML.
  equal(
    inputs.map((input) => comb(input).result),
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
    inputs.map((input) => comb(input).result),
    inputs,
    "02.01",
  );
});

test("03 - retains CSS used after slashes and adjoining attribute quotes", () => {
  const attributes = [
    '/class="used"',
    '///class="used"',
    ' title="a"/class="used"',
    ' title="a"class="used"',
    '\n/class="used"',
    '/onclick=alert(1) class="used"',
    '/id="used"',
    ' title="a"/id="used"',
    ' title="a"id="used"',
  ];
  const results = attributes.map((attribute) => {
    const name = attribute.includes('id="') ? "#used" : ".used";
    const source = `<style>${name}{color:red}</style><body><p${attribute}>visible</p></body>`;
    const actual = comb(source);
    return [actual.result === source, actual.allInBody];
  });

  equal(
    results,
    attributes.map((attribute) => [
      true,
      [attribute.includes('id="') ? "#used" : ".used"],
    ]),
    "03.01",
  );
});

test.run();
