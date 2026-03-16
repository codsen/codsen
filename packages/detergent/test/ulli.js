// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { det as det1 } from "../dist/detergent.esm.js";
import { det, mixer } from "../t-util/util.js";

test("001 - ul/li tags - minimal case", () => {
  mixer({
    removeLineBreaks: false,
    removeWidows: false,
    replaceLineBreaks: false,
    stripHtml: true,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, "z <ul><li>y", opt).res, "z\ny", "001.01");
  });
});

test("002 - ul/li tags - adds missing spaces, removeLineBreaks=on", () => {
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
      "002.01",
    );
  });
});

test("003 - ul/li tags - adds missing spaces, replaceLineBreaks=off", () => {
  mixer({
    removeLineBreaks: false,
    removeWidows: false,
    replaceLineBreaks: false,
    stripHtml: true,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, "a<li>b", opt).res, "a\nb", "003.01");
  });
});

test("004 - ul/li tags - adds missing spaces, replaceLineBreaks=off", () => {
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
      "004.01",
    );
  });
});

test("005 - ul/li tags - adds missing spaces, replaceLineBreaks=on", () => {
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
      "005.01",
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
    "005.02",
  );
});

test.run();
