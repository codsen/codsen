import tap from "tap";
import { det as det1 } from "../dist/detergent.esm";
import { det, mixer } from "../t-util/util";

// task is to ensure HTML and XHTML-style (self-closing) br tags are
// stripped, ignored and/or replaced with line breaks
// correctly, across all combinations of possible settings

tap.test(`01`, (t) => {
  // replaceLineBreaks=false
  t.equal(
    det1(`abc<br>def`, {
      stripHtml: true,
      replaceLineBreaks: false,
      stripHtmlButIgnoreTags: [],
      stripHtmlAddNewLine: ["br"], // <---
    }).res,
    "abc\ndef",
    "01.01"
  );
  t.equal(
    det1(`abc<br>def`, {
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
  t.equal(
    det1(`abc<br>def`, {
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
  t.equal(
    det1(`abc<br>def`, {
      stripHtml: true,
      replaceLineBreaks: true,
      useXHTML: false,
      stripHtmlButIgnoreTags: [],
      stripHtmlAddNewLine: ["br"], // <---
    }).res,
    "abc<br>\ndef",
    "01.04"
  );

  t.equal(
    det1(`abc<br>def`, {
      stripHtml: true,
      stripHtmlButIgnoreTags: [],
      stripHtmlAddNewLine: [], // <---
    }).res,
    "abc def",
    "01.05"
  );
  t.end();
});

tap.test(`02`, (t) => {
  mixer({
    stripHtml: true,
    removeLineBreaks: false,
    replaceLineBreaks: false,
    stripHtmlButIgnoreTags: [],
    stripHtmlAddNewLine: ["br"], // <---
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, `abc<br>def`, opt).res,
      `abc\ndef`,
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
    t.equal(
      det(t, n, `abc<br>def`, opt).res,
      `abc<br>\ndef`,
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
    t.equal(
      det(t, n, `abc<br>def`, opt).res,
      `abc<br/>\ndef`,
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
    t.equal(
      det(t, n, `abc<br>def`, opt).res,
      `abc def`,
      JSON.stringify(opt, null, 4)
    );
  });

  mixer({
    stripHtml: false,
    useXHTML: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, `abc<br>def`, opt).res,
      `abc<br>def`,
      JSON.stringify(opt, null, 4)
    );
  });
  mixer({
    stripHtml: false,
    useXHTML: true,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, `abc<br>def`, opt).res,
      `abc<br/>def`,
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`03`, (t) => {
  t.equal(
    det1(`abc<br/>def`, {
      stripHtml: true,
      replaceLineBreaks: false,
      stripHtmlButIgnoreTags: [],
      stripHtmlAddNewLine: ["br"], // <---
    }).res,
    "abc\ndef",
    "03"
  );
  t.end();
});

tap.test(`04`, (t) => {
  mixer({
    stripHtml: true,
    removeLineBreaks: false,
    replaceLineBreaks: false,
    stripHtmlButIgnoreTags: [],
    stripHtmlAddNewLine: ["br"], // <---
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, `abc<br/>def`, opt).res,
      `abc\ndef`,
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
    t.equal(
      det(t, n, `abc<br/>def`, opt).res,
      `abc def`,
      JSON.stringify(opt, null, 4)
    );
  });
  mixer({
    stripHtml: true,
    replaceLineBreaks: false,
    stripHtmlButIgnoreTags: [],
    stripHtmlAddNewLine: [], // <---
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, `abc<br/>def`, opt).res,
      `abc def`,
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});
