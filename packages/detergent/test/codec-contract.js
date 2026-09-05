import { test } from "uvu";
import { equal } from "uvu/assert";
import { det } from "../dist/detergent.esm.js";

test("001 - preserves text decoding, repeated cleanup and output spelling", () => {
  equal(det("&amp;#38;lt;").res, "&lt;", "001.01");
  equal(
    det("&notit; &copy=1 &amp;amp;").res,
    "&not;it; &copy;=1 &amp;",
    "001.02",
  );
  equal(det("&lt; &LT; &Lt;").res, "&lt; &lt; &#x226A;", "001.03");
});

test("002 - applicability remains independent of entity conversion setting", () => {
  const encoded = det("&amp;amp;copy;", { convertEntities: true });
  const decoded = det("&amp;amp;copy;", { convertEntities: false });
  equal(encoded.res, "&copy;", "002.01");
  equal(decoded.res, "©", "002.02");
  equal(encoded.applicableOpts, decoded.applicableOpts, "002.03");
  equal(JSON.parse(JSON.stringify(encoded)), encoded, "002.04");
});

test.run();
