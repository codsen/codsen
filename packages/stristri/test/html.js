import { test } from "uvu";
import * as assert from "uvu/assert";

import { stri as stri2 } from "../dist/stristri.esm.js";
import { stri, mixer } from "./util/util.js";

test("01 - testing api directly", () => {
  assert.equal(stri2("<div>").result, "", "01.01");
});

// HTML only
// -----------------------------------------------------------------------------

test("02 - basic", () => {
  let source = "<html><div>";
  mixer({
    html: true,
  }).forEach((opt, n) => {
    assert.equal(
      stri(assert, n, source, opt).result,
      "",
      JSON.stringify(opt, null, 4),
    );
  });
  mixer({
    html: false,
  }).forEach((opt, n) => {
    assert.equal(
      stri(assert, n, source, opt).result,
      "<html><div>",
      JSON.stringify(opt, null, 4),
    );
  });
});

test("03 - basic", () => {
  let source = "abc<!--tralala-->def";
  mixer({
    html: true,
    text: true,
  }).forEach((opt, n) => {
    assert.equal(
      stri(assert, n, source, opt).result,
      "",
      JSON.stringify(opt, null, 4),
    );
  });
  mixer({
    html: true,
    text: false,
  }).forEach((opt, n) => {
    assert.equal(
      stri(assert, n, source, opt).result,
      "abc def",
      JSON.stringify(opt, null, 4),
    );
  });
  mixer({
    html: false,
    text: true,
  }).forEach((opt, n) => {
    assert.equal(
      stri(assert, n, source, opt).result,
      "<!--tralala-->",
      JSON.stringify(opt, null, 4),
    );
  });
  mixer({
    html: false,
    text: false,
  }).forEach((opt, n) => {
    assert.equal(
      stri(assert, n, source, opt).result,
      source,
      JSON.stringify(opt, null, 4),
    );
  });
});

// mixed
// -----------------------------------------------------------------------------

test("04 - ensure no accidental text concat", () => {
  let source = "abc<html><div>def";

  mixer({
    html: true,
    text: true,
  }).forEach((opt, n) => {
    assert.equal(
      stri(assert, n, source, opt).result,
      "",
      JSON.stringify(opt, null, 4),
    );
  });

  mixer({
    html: true,
    text: false,
  }).forEach((opt, n) => {
    assert.equal(
      stri(assert, n, source, opt).result,
      "abc def",
      JSON.stringify(opt, null, 4),
    );
  });

  mixer({
    html: false,
    text: true,
  }).forEach((opt, n) => {
    assert.equal(
      stri(assert, n, source, opt).result,
      "<html><div>",
      JSON.stringify(opt, null, 4),
    );
  });

  mixer({
    html: false,
    text: false,
  }).forEach((opt, n) => {
    assert.equal(
      stri(assert, n, source, opt).result,
      source,
      JSON.stringify(opt, null, 4),
    );
  });
});

test("05", () => {
  let { result, applicableOpts, templatingLang } = stri2(
    "<div>Script says hello world and sky and sea</div>",
  );
  assert.equal(
    { result, applicableOpts, templatingLang },
    {
      result: "Script says hello world and sky and sea",
      applicableOpts: {
        html: true,
        css: false,
        text: true,
        templatingTags: false,
        js: false,
      },
      templatingLang: {
        name: null,
      },
    },
    "05.01",
  );
});

test.run();
