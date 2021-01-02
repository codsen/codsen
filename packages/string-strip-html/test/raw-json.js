import tap from "tap";
import { stripHtml } from "../dist/string-strip-html.esm";

tap.test(
  "01 - opts.trimOnlySpaces - unencoded non-breaking spaces - no HTML at all",
  (t) => {
    t.is(
      stripHtml(`{"Operator":"<","IsValid":true}`).result,
      `{"Operator":"<","IsValid":true}`,
      "01"
    );
    t.end();
  }
);

tap.test(
  "02 - opts.trimOnlySpaces - unencoded non-breaking spaces - no HTML at all",
  (t) => {
    t.is(
      stripHtml(`{"Operator":"a <div>b</div> c","IsValid":true}`).result,
      `{"Operator":"a b c","IsValid":true}`,
      "02"
    );
    t.end();
  }
);
