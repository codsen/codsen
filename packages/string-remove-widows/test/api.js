// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { removeWidows, version } from "../dist/string-remove-widows.esm.js";
import {
  encodedNbspHtml,
  rawnbsp,
  // encodedNbspCss,
  // encodedNbspJs,
  // rawNdash,
  // rawMdash,
} from "./util.js";

// const languages = ["html`, `css`, `js"];
// const encodedNbsps = [encodedNbspHtml, encodedNbspCss, encodedNbspJs];
// const eolTypes = ["LF`, `CR`, `CRLF"];

// -----------------------------------------------------------------------------
// api bits
// -----------------------------------------------------------------------------

test(`01 - api bits - exported removeWidows() is a function`, () => {
  equal(typeof removeWidows, "function", "01.01");
});

test(`02 - api bits - exported version is a semver version`, () => {
  equal(String(version).match(/\d+\.\d+\.\d+/gi).length, 1, "02.01");
});

test(`03 - api bits - sanity check`, () => {
  equal(rawnbsp, "\u00A0", "03.01");
  equal(encodedNbspHtml, `${encodedNbspHtml}`, "03.02");
});

test(`04 - api bits - empty opts obj`, () => {
  equal(removeWidows("aaa bbb ccc", {}).res, "aaa bbb ccc", "04.01");
});

test("05 - options must be a plain object", () => {
  throws(
    () => {
      removeWidows("aaa bbb ccc", []);
    },
    /THROW_ID_03/,
    "05.01",
  );
});

test.run();
