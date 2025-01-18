import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { removeWidows, version } from "../dist/string-remove-widows.esm.js";
import {
  rawnbsp,
  encodedNbspHtml,
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

test(`01 - ${`\u001b[${36}m${"api bits"}\u001b[${39}m`} - exported removeWidows() is a function`, () => {
  equal(typeof removeWidows, "function", "01.01");
});

test(`02 - ${`\u001b[${36}m${"api bits"}\u001b[${39}m`} - exported version is a semver version`, () => {
  equal(String(version).match(/\d+\.\d+\.\d+/gi).length, 1, "02.01");
});

test(`03 - ${`\u001b[${36}m${"api bits"}\u001b[${39}m`} - sanity check`, () => {
  equal(rawnbsp, "\u00A0", "03.01");
  equal(encodedNbspHtml, `${encodedNbspHtml}`, "03.02");
});

test(`04 - ${`\u001b[${36}m${"api bits"}\u001b[${39}m`} - empty opts obj`, () => {
  equal(removeWidows("aaa bbb ccc", {}).res, "aaa bbb ccc", "04.01");
});

test.run();
