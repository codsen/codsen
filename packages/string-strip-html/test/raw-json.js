// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { stripHtml } from "./util/noLog.js";

test("001 - opts.trimOnlySpaces - unencoded non-breaking spaces - no HTML at all", () => {
  is(
    stripHtml('{"Operator":"<","IsValid":true}').result,
    '{"Operator":"<","IsValid":true}',
    "01.01",
  );
});

test("002 - opts.trimOnlySpaces - unencoded non-breaking spaces - no HTML at all", () => {
  is(
    stripHtml('{"Operator":"a <div>b</div> c","IsValid":true}').result,
    '{"Operator":"a b c","IsValid":true}',
    "02.01",
  );
});

test.run();
