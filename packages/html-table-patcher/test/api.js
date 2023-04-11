import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { patcher, defaults, version } from "../dist/html-table-patcher.esm.js";

// checking the API bits
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${34}m${"API bits"}\u001b[${39}m`} - defaults`, () => {
  ok(typeof defaults === "object", "01.01");
  ok(Object.keys(defaults).length > 0, "01.02");
});

test(`02 - ${`\u001b[${34}m${"API bits"}\u001b[${39}m`} - version`, () => {
  match(version, /\d*\.\d*\.\d*/, "02.01");
});

test(`03 - ${`\u001b[${34}m${"API bits"}\u001b[${39}m`} - patcher()`, () => {
  is(patcher(1).result, 1, "03.01");
  is(patcher(false).result, false, "03.02");
  is(patcher(null).result, null, "03.03");
});

test(`04 - ${`\u001b[${34}m${"API bits"}\u001b[${39}m`} - opts.opts.cssStylesContent`, () => {
  is(
    patcher("<a>", {
      cssStylesContent: 9,
    }).result,
    "<a>",
    "04.01"
  );
  is(
    patcher(false, {
      cssStylesContent: "",
    }).result,
    false,
    "04.02"
  );
  is(
    patcher(null, {
      cssStylesContent: 9,
    }).result,
    null,
    "04.03"
  );
});

test.run();
