import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { det as det1 } from "../dist/detergent.esm.js";
import { det, mixer } from "../t-util/util.js";

// task is to ensure HTML and XHTML-style (self-closing) br tags are
// stripped, ignored and/or replaced with line breaks
// correctly, across all combinations of possible settings

test("01", () => {
  // replaceLineBreaks=false
  equal(
    det1("abc<br>def", {
      stripHtml: true,
      replaceLineBreaks: false,
      stripHtmlButIgnoreTags: [],
      stripHtmlAddNewLine: ["br"], // <---
    }).res,
    "abc\ndef",
    "01.01"
  );
  equal(
    det1("abc<br>def", {
      stripHtml: true,
      replaceLineBreaks: false,
      stripHtmlButIgnoreTags: [],
      stripHtmlAddNewLine: [], // <---
    }).res,
    "abc def",
    "01.02"
  );

  // replaceLineBreaks=true
  // useXHTML=true,
  equal(
    det1("abc<br>def", {
      stripHtml: true,
      replaceLineBreaks: true,
      useXHTML: true,
      stripHtmlButIgnoreTags: [],
      stripHtmlAddNewLine: ["br"], // <---
    }).res,
    "abc<br/>\ndef",
    "01.03"
  );
  // replaceLineBreaks=true
  // useXHTML=true,
  equal(
    det1("abc<br>def", {
      stripHtml: true,
      replaceLineBreaks: true,
      useXHTML: false,
      stripHtmlButIgnoreTags: [],
      stripHtmlAddNewLine: ["br"], // <---
    }).res,
    "abc<br>\ndef",
    "01.04"
  );

  equal(
    det1("abc<br>def", {
      stripHtml: true,
      stripHtmlButIgnoreTags: [],
      stripHtmlAddNewLine: [], // <---
    }).res,
    "abc def",
    "01.05"
  );
});

test("02", () => {
  mixer({
    stripHtml: true,
    removeLineBreaks: false,
    replaceLineBreaks: false,
    stripHtmlButIgnoreTags: [],
    stripHtmlAddNewLine: ["br"], // <---
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "abc<br>def", opt).res,
      "abc\ndef",
      JSON.stringify(opt, null, 4)
    );
  });
  mixer({
    stripHtml: true,
    removeLineBreaks: false,
    replaceLineBreaks: true,
    useXHTML: false,
    stripHtmlButIgnoreTags: [],
    stripHtmlAddNewLine: ["br"],
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "abc<br>def", opt).res,
      "abc<br>\ndef",
      JSON.stringify(opt, null, 4)
    );
  });
  mixer({
    stripHtml: true,
    removeLineBreaks: false,
    replaceLineBreaks: true,
    useXHTML: true,
    stripHtmlButIgnoreTags: [],
    stripHtmlAddNewLine: ["br"], // <---
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "abc<br>def", opt).res,
      "abc<br/>\ndef",
      JSON.stringify(opt, null, 4)
    );
  });

  mixer({
    stripHtml: true,
    removeLineBreaks: false,
    replaceLineBreaks: false,
    stripHtmlButIgnoreTags: [],
    stripHtmlAddNewLine: [], // <---
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "abc<br>def", opt).res,
      "abc def",
      JSON.stringify(opt, null, 4)
    );
  });

  mixer({
    stripHtml: false,
    useXHTML: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "abc<br>def", opt).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
  });
  mixer({
    stripHtml: false,
    useXHTML: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "abc<br>def", opt).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
  });
});

test("03", () => {
  equal(
    det1("abc<br/>def", {
      stripHtml: true,
      replaceLineBreaks: false,
      stripHtmlButIgnoreTags: [],
      stripHtmlAddNewLine: ["br"], // <---
    }).res,
    "abc\ndef",
    "03.01"
  );
});

test("04", () => {
  mixer({
    stripHtml: true,
    removeLineBreaks: false,
    replaceLineBreaks: false,
    stripHtmlButIgnoreTags: [],
    stripHtmlAddNewLine: ["br"], // <---
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "abc<br/>def", opt).res,
      "abc\ndef",
      JSON.stringify(opt, null, 4)
    );
  });
  mixer({
    stripHtml: true,
    removeLineBreaks: true,
    replaceLineBreaks: false,
    stripHtmlButIgnoreTags: [],
    stripHtmlAddNewLine: ["br"], // <---
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "abc<br/>def", opt).res,
      "abc def",
      JSON.stringify(opt, null, 4)
    );
  });
  mixer({
    stripHtml: true,
    replaceLineBreaks: false,
    stripHtmlButIgnoreTags: [],
    stripHtmlAddNewLine: [], // <---
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "abc<br/>def", opt).res,
      "abc def",
      JSON.stringify(opt, null, 4)
    );
  });
});

test.run();
