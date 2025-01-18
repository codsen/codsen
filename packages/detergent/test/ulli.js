import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { det as det1 } from "../dist/detergent.esm.js";
import { det, mixer } from "../t-util/util.js";

test(`01 - ${`\u001b[${31}m${"ul/li tags"}\u001b[${39}m`} - minimal case`, () => {
  mixer({
    removeLineBreaks: false,
    removeWidows: false,
    replaceLineBreaks: false,
    stripHtml: true,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, "z <ul><li>y", opt).res, "z\ny", "01.01");
  });
});

test(`02 - ${`\u001b[${31}m${"ul/li tags"}\u001b[${39}m`} - adds missing spaces, removeLineBreaks=on`, () => {
  mixer({
    removeLineBreaks: true,
    removeWidows: false,
    stripHtml: true,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        "Text <ul><li>First point</li><li>Second point</li><li>Third point</li></ul>Text straight after",
        opt,
      ).res,
      "Text First point Second point Third point Text straight after",
      "02.01",
    );
  });
});

test(`03 - ${`\u001b[${31}m${"ul/li tags"}\u001b[${39}m`} - adds missing spaces, replaceLineBreaks=off`, () => {
  mixer({
    removeLineBreaks: false,
    removeWidows: false,
    replaceLineBreaks: false,
    stripHtml: true,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, "a<li>b", opt).res, "a\nb", "03.01");
  });
});

test(`04 - ${`\u001b[${31}m${"ul/li tags"}\u001b[${39}m`} - adds missing spaces, replaceLineBreaks=off`, () => {
  mixer({
    removeLineBreaks: false,
    removeWidows: false,
    replaceLineBreaks: false,
    stripHtml: true,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        "Text <ul><li>First point</li><li>Second point</li><li>Third point</li></ul>Text straight after",
        opt,
      ).res,
      "Text\nFirst point\nSecond point\nThird point\nText straight after",
      "04.01",
    );
  });
});

test(`05 - ${`\u001b[${31}m${"ul/li tags"}\u001b[${39}m`} - adds missing spaces, replaceLineBreaks=on`, () => {
  mixer({
    removeLineBreaks: false,
    removeWidows: false,
    replaceLineBreaks: true,
    useXHTML: true,
    stripHtml: true,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        "Text <ul><li>First point</li><li>Second point</li><li>Third point</li></ul>Text straight after",
        opt,
      ).res,
      "Text<br/>\nFirst point<br/>\nSecond point<br/>\nThird point<br/>\nText straight after",
      "05.01",
    );
  });

  equal(
    det1(
      "Text <ul><li>First point</li><li>Second point</li><li>Third point</li></ul>Text straight after",
      {
        removeLineBreaks: false,
        removeWidows: false,
        replaceLineBreaks: true,
        useXHTML: true,
        stripHtml: true,
      },
    ).res,
    "Text<br/>\nFirst point<br/>\nSecond point<br/>\nThird point<br/>\nText straight after",
    "05.02",
  );
});

test.run();
