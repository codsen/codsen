// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { det as det1 } from "../dist/detergent.esm.js";
import { det, mixer } from "../t-util/util.js";

// task is to ensure HTML and XHTML-style (self-closing) br tags are
// stripped, ignored and/or replaced with line breaks
// correctly, across all combinations of possible settings

test("001", () => {
  // replaceLineBreaks=false
  equal(
    det1("abc<br>def", {
      stripHtml: true,
      replaceLineBreaks: false,
      stripHtmlButIgnoreTags: [],
      stripHtmlAddNewLine: ["br"], // <---
    }).res,
    "abc\ndef",
    "001.01",
  );
  equal(
    det1("abc<br>def", {
      stripHtml: true,
      replaceLineBreaks: false,
      stripHtmlButIgnoreTags: [],
      stripHtmlAddNewLine: [], // <---
    }).res,
    "abc def",
    "001.02",
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
    "001.03",
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
    "001.04",
  );

  equal(
    det1("abc<br>def", {
      stripHtml: true,
      stripHtmlButIgnoreTags: [],
      stripHtmlAddNewLine: [], // <---
    }).res,
    "abc def",
    "001.05",
  );
});

test("002", () => {
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
      `002.01 - ${JSON.stringify(opt, null, 4)}`,
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
      `002.02 - ${JSON.stringify(opt, null, 4)}`,
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
      `002.03 - ${JSON.stringify(opt, null, 4)}`,
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
      `002.04 - ${JSON.stringify(opt, null, 4)}`,
    );
  });

  mixer({
    stripHtml: false,
    useXHTML: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "abc<br>def", opt).res,
      "abc<br>def",
      `002.05 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
  mixer({
    stripHtml: false,
    useXHTML: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "abc<br>def", opt).res,
      "abc<br/>def",
      `002.06 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("003", () => {
  equal(
    det1("abc<br/>def", {
      stripHtml: true,
      replaceLineBreaks: false,
      stripHtmlButIgnoreTags: [],
      stripHtmlAddNewLine: ["br"], // <---
    }).res,
    "abc\ndef",
    "003.01",
  );
});

test("004", () => {
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
      `004.01 - ${JSON.stringify(opt, null, 4)}`,
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
      `004.02 - ${JSON.stringify(opt, null, 4)}`,
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
      `004.03 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test.run();
