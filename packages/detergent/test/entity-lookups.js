import { test } from "uvu";
import { equal } from "uvu/assert";
import { det } from "../dist/detergent.esm.js";

test("001 - prefix lookup keeps case-sensitive and overlapping entity names", () => {
  for (const [input, expected] of [
    ["&lt; &LT; &Lt;", "&lt; &lt; &#x226A;"],
    ["&not; &notin; &notinva;", "&not; &notin; &notin;"],
    ["&CounterClockwiseContourIntegral;", "&#x2233;"],
  ]) {
    const result = det(input);
    equal(result.res, expected, "001.01");
    equal(result.applicableOpts.convertEntities, true, "001.02");
    equal(result.applicableOpts.fixBrokenEntities, false, "001.03");
  }
});

test("002 - incomplete, unknown and inherited names preserve their treatment", () => {
  equal(
    det("&a; &a &constructor; &__proto__; &toString;").res,
    "&amp;a; &amp;a &amp;__proto__;",
    "002.01",
  );
  equal(det("&amp; &AMP; &amplitude;").res, "&amp; &amp;", "002.02");
});

test.run();
