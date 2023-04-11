import { test } from "uvu";
import * as assert from "uvu/assert";

import { stri as stri2 } from "../dist/stristri.esm.js";
import { stri, mixer } from "./util/util.js";

test("01 - testing api directly", () => {
  assert.equal(stri2("<script>console.log</script>").result, "", "01.01");
});

test("02", () => {
  let source = "<script>{{</script>";
  assert.equal(
    stri2(source, {
      html: false,
      js: true,
    }).result,
    "<script></script>",
    "02.01"
  );
});

test("03", () => {
  let source = "<script>{{</script>";
  mixer({
    html: true,
    js: true,
  }).forEach((opt, n) => {
    assert.equal(
      stri(assert, n, source, opt).result,
      "",
      JSON.stringify(opt, null, 4)
    );
  });
  mixer({
    html: false,
    js: true,
  }).forEach((opt, n) => {
    assert.equal(
      stri(assert, n, source, opt).result,
      "<script></script>",
      JSON.stringify(opt, null, 4)
    );
  });
  mixer({
    html: true,
    js: false,
  }).forEach((opt, n) => {
    assert.equal(
      stri(assert, n, source, opt).result,
      "{{",
      JSON.stringify(opt, null, 4)
    );
  });
  mixer({
    html: false,
    js: false,
  }).forEach((opt, n) => {
    assert.equal(
      stri(assert, n, source, opt).result,
      source,
      JSON.stringify(opt, null, 4)
    );
  });
});

test("04", () => {
  let source =
    '<html>real text<script>!function(e){function z{}};return"></script></body></html>';

  // 2^3=8 combinations

  mixer({
    html: true,
    text: true,
    js: true,
  }).forEach((opt, n) => {
    assert.equal(
      stri(assert, n, source, opt).result,
      "",
      JSON.stringify(opt, null, 4)
    );
  });
  mixer({
    html: true,
    text: true,
    js: false,
  }).forEach((opt, n) => {
    assert.equal(
      stri(assert, n, source, opt).result,
      '!function(e){function z{}};return">',
      JSON.stringify(opt, null, 4)
    );
  });
  mixer({
    html: true,
    text: false,
    js: true,
  }).forEach((opt, n) => {
    assert.equal(
      stri(assert, n, source, opt).result,
      "real text",
      JSON.stringify(opt, null, 4)
    );
  });
  mixer({
    html: false,
    text: true,
    js: true,
  }).forEach((opt, n) => {
    assert.equal(
      stri(assert, n, source, opt).result,
      "<html> <script></script></body></html>",
      JSON.stringify(opt, null, 4)
    );
  });
  mixer({
    html: false,
    text: false,
    js: true,
  }).forEach((opt, n) => {
    assert.equal(
      stri(assert, n, source, opt).result,
      "<html>real text<script></script></body></html>",
      JSON.stringify(opt, null, 4)
    );
  });
  mixer({
    html: true,
    text: false,
    js: false,
  }).forEach((opt, n) => {
    assert.equal(
      stri(assert, n, source, opt).result,
      'real text !function(e){function z{}};return">',
      JSON.stringify(opt, null, 4)
    );
  });
  mixer({
    html: false,
    text: true,
    js: false,
  }).forEach((opt, n) => {
    assert.equal(
      stri(assert, n, source, opt).result,
      '<html> <script>!function(e){function z{}};return"></script></body></html>',
      JSON.stringify(opt, null, 4)
    );
  });
  mixer({
    html: false,
    text: false,
    js: false,
  }).forEach((opt, n) => {
    assert.equal(
      stri(assert, n, source, opt).result,
      source,
      JSON.stringify(opt, null, 4)
    );
  });
});

test("05", () => {
  let source = '<html> <script>console.log("<html>")</script></html>';

  // 2^2 = 4 variations

  mixer({
    html: true,
    js: true,
  }).forEach((opt, n) => {
    assert.equal(
      stri(assert, n, source, opt).result,
      "",
      JSON.stringify(opt, null, 4)
    );
  });
  mixer({
    html: true,
    js: false,
  }).forEach((opt, n) => {
    assert.equal(
      stri(assert, n, source, opt).result,
      'console.log("<html>")',
      JSON.stringify(opt, null, 4)
    );
  });
  mixer({
    html: false,
    js: true,
  }).forEach((opt, n) => {
    assert.equal(
      stri(assert, n, source, opt).result,
      "<html> <script></script></html>",
      JSON.stringify(opt, null, 4)
    );
  });
  mixer({
    html: false,
    js: false,
  }).forEach((opt, n) => {
    assert.equal(
      stri(assert, n, source, opt).result,
      source,
      JSON.stringify(opt, null, 4)
    );
  });
});

test("06 - minimal <script> tags", () => {
  let source = "abc<script>\nconst x = 0;\n</script>xyz";
  mixer({
    html: true,
    js: true,
    text: false,
  }).forEach((opt, n) => {
    assert.equal(
      stri(assert, n, source, opt).result,
      "abc xyz",
      JSON.stringify(opt, null, 4)
    );
  });
});

test("07 - <script> tags", () => {
  let source = `abc<script>
const x = [
  'a',
];
const y = [
  'b',
];
function c(d, e, f) {
  if ( d === c || !x(y) || f.g(d) || h.i(j) ) {
    return null;
  } else {
    return [d, e ? f : '', g].filter(el => el !== '').join('');
  }
};
</script>xyz`;

  mixer({
    html: true,
    js: false,
    text: true,
  }).forEach((opt, n) => {
    assert.equal(
      stri(assert, n, source, opt).result,
      `const x = [
'a',
];
const y = [
'b',
];
function c(d, e, f) {
if ( d === c || !x(y) || f.g(d) || h.i(j) ) {
return null;
} else {
return [d, e ? f : '', g].filter(el => el !== '').join('');
}
};`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test.run();
