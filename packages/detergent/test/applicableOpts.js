// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { det as det1 } from "../dist/detergent.esm.js";

// const { det, mixer } from "../t-util/util.js";

// ================================================
// 01. Only real applicable rules keys are reported
// ================================================

test("001 - rubbish removal - trailing/leading whitespace, convertEntities=on", () => {
  equal(
    Object.keys(
      det1("&nbsp;&nbsp;&nbsp; a &nbsp;&nbsp;&nbsp;", {
        convertEntities: true,
      }).applicableOpts,
    ).sort(),
    [
      "fixBrokenEntities",
      "removeWidows",
      "convertEntities",
      "convertDashes",
      "convertApostrophes",
      "replaceLineBreaks",
      "removeLineBreaks",
      "useXHTML",
      "dontEncodeNonLatin",
      "addMissingSpaces",
      "convertDotsToEllipsis",
      "stripHtml",
      "eol",
    ].sort(),
    "001.01",
  );
});

test("002 - an already-correct widow measure remains applicable", () => {
  equal(
    det1("aaa bbb ccc&nbsp;ddd", {
      convertEntities: true,
      removeWidows: false,
    }).applicableOpts.removeWidows,
    true,
    "002.01",
  );
});

test("003 - widow encoding applicability follows the widow option", () => {
  equal(
    det1("aaa bbb ccc ddd", {
      convertEntities: false,
      removeWidows: false,
    }).applicableOpts,
    {
      fixBrokenEntities: false,
      removeWidows: true,
      convertEntities: false,
      convertDashes: false,
      convertApostrophes: false,
      replaceLineBreaks: false,
      removeLineBreaks: false,
      useXHTML: false,
      dontEncodeNonLatin: false,
      addMissingSpaces: false,
      convertDotsToEllipsis: false,
      stripHtml: false,
      eol: false,
    },
    "003.01",
  );
  equal(
    det1("aaa bbb ccc ddd", {
      convertEntities: false,
      removeWidows: true,
    }).applicableOpts.convertEntities,
    true,
    "003.02",
  );
});

test("004 - widow tag ranges use the current intermediate string", () => {
  equal(
    det1('  one two three four<a title="x y">link</a>', {
      convertEntities: true,
      removeWidows: true,
      stripHtml: false,
    }).res,
    'one two three&nbsp;four<a title="x y">link</a>',
    "004.01",
  );
});

test.run();
