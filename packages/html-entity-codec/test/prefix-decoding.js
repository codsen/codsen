import { test } from "uvu";
import { equal, throws } from "uvu/assert";
import { decode, scanReference } from "../dist/html-entity-codec.esm.js";

test("01 - canonical-only prefixes still decode complete references", () => {
  equal(decode("&acE; &acE &acEx;"), "\u223e\u0333 &acE &acEx;", "01.01");
  equal(
    scanReference("x&acE;y", 1),
    { end: 6, value: "\u223e\u0333" },
    "01.02",
  );
});

test("02 - an incomplete longer name can consume only the permitted legacy prefix", () => {
  equal(decode("&notinva; &notinva &notin;"), "∉ ¬inva ∉", "02.01");
  equal(
    decode("&notinva; &notinva &notin;", { context: "attribute" }),
    "∉ &notinva ∉",
    "02.02",
  );
  equal(scanReference("x&notinva!", 1), { end: 5, value: "¬" }, "02.03");
});

test("03 - an unknown prefix preserves forgiving and strict parsing rules", () => {
  equal(
    decode("&unrecognized; &unrecognized"),
    "&unrecognized; &unrecognized",
    "03.01",
  );
  equal(decode("&unrecognized", { strict: true }), "&unrecognized", "03.02");
  throws(
    () => decode("&unrecognized;", { strict: true }),
    /Parse error/,
    "03.03",
  );
});

test.run();
