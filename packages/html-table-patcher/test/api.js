// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { defaults, patcher, version } from "../dist/html-table-patcher.esm.js";

// checking the API bits
// -----------------------------------------------------------------------------

test(`01 - API bits - defaults`, () => {
  ok(typeof defaults === "object", "01.01");
  ok(Object.keys(defaults).length > 0, "01.02");
});

test(`02 - API bits - version`, () => {
  match(version, /\d*\.\d*\.\d*/, "02.01");
});

test(`03 - API bits - patcher()`, () => {
  is(patcher(1).result, 1, "03.01");
  is(patcher(false).result, false, "03.02");
  is(patcher(null).result, null, "03.03");
});

test(`04 - API bits - opts.opts.cssStylesContent`, () => {
  is(
    patcher("<a>", {
      cssStylesContent: 9,
    }).result,
    "<a>",
    "04.01",
  );
  is(
    patcher(false, {
      cssStylesContent: "",
    }).result,
    false,
    "04.02",
  );
  is(
    patcher(null, {
      cssStylesContent: 9,
    }).result,
    null,
    "04.03",
  );
});

test.run();
