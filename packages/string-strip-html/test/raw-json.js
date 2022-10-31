import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { stripHtml } from "./util/noLog.js";

test("01 - opts.trimOnlySpaces - unencoded non-breaking spaces - no HTML at all", () => {
  is(
    stripHtml(`{"Operator":"<","IsValid":true}`).result,
    `{"Operator":"<","IsValid":true}`,
    "01.01"
  );
});

test("02 - opts.trimOnlySpaces - unencoded non-breaking spaces - no HTML at all", () => {
  is(
    stripHtml(`{"Operator":"a <div>b</div> c","IsValid":true}`).result,
    `{"Operator":"a b c","IsValid":true}`,
    "02.01"
  );
});

test.run();
