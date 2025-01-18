import { test } from "uvu";
import * as assert from "uvu/assert";

import { stri, mixer } from "./util/util.js";

// Templating tags only
// -----------------------------------------------------------------------------

test("01 - nunjucks only, one token", () => {
  let input = "{% set x = 1 %}";
  mixer({
    templatingTags: true,
  }).forEach((opt, n) => {
    assert.equal(
      stri(assert, n, input, opt).result,
      "",
      JSON.stringify(opt, null, 4),
    );
    assert.equal(
      stri(assert, n, input, opt).templatingLang.name,
      "Nunjucks",
      JSON.stringify(opt, null, 4),
    );
  });
  mixer({
    templatingTags: false,
  }).forEach((opt, n) => {
    assert.equal(
      stri(assert, n, input, opt).result,
      input,
      JSON.stringify(opt, null, 4),
    );
    assert.equal(
      stri(assert, n, input, opt).templatingLang.name,
      "Nunjucks",
      JSON.stringify(opt, null, 4),
    );
  });
});

test("02 - nunjucks only, multiple tokens", () => {
  let input = "{% if something %}{% set z = 0 %}{% endif %}";
  mixer({
    templatingTags: true,
  }).forEach((opt, n) => {
    assert.equal(
      stri(assert, n, input, opt).result,
      "",
      JSON.stringify(opt, null, 4),
    );
  });
  mixer({
    templatingTags: false,
  }).forEach((opt, n) => {
    assert.equal(
      stri(assert, n, input, opt).result,
      input,
      JSON.stringify(opt, null, 4),
    );
  });
});

// Templating tags mixed with html
// -----------------------------------------------------------------------------

test("03 - nunjucks only, one token", () => {
  let input = "{% set x = 1 %}";
  mixer({
    templatingTags: true,
  }).forEach((opt, n) => {
    assert.equal(
      stri(assert, n, input, opt).result,
      "",
      JSON.stringify(opt, null, 4),
    );
  });
  mixer({
    templatingTags: false,
  }).forEach((opt, n) => {
    assert.equal(
      stri(assert, n, input, opt).result,
      input,
      JSON.stringify(opt, null, 4),
    );
  });
});

// Templating tags mixed with text
// -----------------------------------------------------------------------------

test("04 - imaginary templating language, tag includes line breaks", () => {
  let input = `abc
\${ klm
nop }$
def`;
  mixer({
    templatingTags: true,
    text: true,
  }).forEach((opt, n) => {
    assert.equal(
      stri(assert, n, input, opt).result,
      "",
      JSON.stringify(opt, null, 4),
    );
  });
  mixer({
    templatingTags: true,
    text: false,
  }).forEach((opt, n) => {
    assert.equal(
      stri(assert, n, input, opt).result,
      "abc\n\ndef",
      JSON.stringify(opt, null, 4),
    );
  });
  mixer({
    templatingTags: false,
    text: true,
  }).forEach((opt, n) => {
    assert.equal(
      stri(assert, n, input, opt).result,
      `\${ klm
nop }$`,
      JSON.stringify(opt, null, 4),
    );
  });
  mixer({
    templatingTags: false,
    text: false,
  }).forEach((opt, n) => {
    assert.equal(
      stri(assert, n, input, opt).result,
      input,
      JSON.stringify(opt, null, 4),
    );
  });
});

test("05 - ERB embedded expressions", () => {
  let input =
    '<a href="https://example.com/test?param1=<%= @param1 %>&param2=<%= @param2 %>">click me</a>';
  mixer({
    html: true,
    text: true,
  }).forEach((opt, n) => {
    assert.equal(
      stri(assert, n, input, opt).result,
      "",
      JSON.stringify(opt, null, 4),
    );
  });
  mixer({
    html: false,
    text: true,
  }).forEach((opt, n) => {
    assert.equal(
      stri(assert, n, input, opt).result,
      '<a href="https://example.com/test?param1=<%= @param1 %>&param2=<%= @param2 %>"> </a>',
      JSON.stringify(opt, null, 4),
    );
  });
  mixer({
    html: true,
    text: false,
  }).forEach((opt, n) => {
    assert.equal(
      stri(assert, n, input, opt).result,
      "click me",
      JSON.stringify(opt, null, 4),
    );
  });
  mixer({
    html: false,
    text: false,
  }).forEach((opt, n) => {
    assert.equal(
      stri(assert, n, input, opt).result,
      input,
      JSON.stringify(opt, null, 4),
    );
  });
});

test.run();
