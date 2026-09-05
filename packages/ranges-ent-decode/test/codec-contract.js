import { test } from "uvu";
import { equal, throws } from "uvu/assert";
import { rEntDecode } from "../dist/ranges-ent-decode.esm.js";

test("01 - keeps the wrapper's distinct repeated encoding policy", () => {
  equal(rEntDecode("&amp;pound;"), [[0, 11, "£"]], "01.01");
  equal(rEntDecode("&amp;#38;lt;"), [[0, 12, "&lt;"]], "01.02");
  equal(rEntDecode("&#x26;amp;#x26;"), [[0, 15, "&"]], "01.03");
});

test("02 - keeps original consumed spans including legacy lookahead", () => {
  equal(
    rEntDecode("&notit; &copy=1 &amp;amp;"),
    [
      [0, 7, "¬it;"],
      [8, 14, "©="],
      [16, 25, "&"],
    ],
    "02.01",
  );
  equal(
    rEntDecode("&notit; &copy=1", { isAttributeValue: true }),
    null,
    "02.02",
  );
  equal(rEntDecode("&unknown; &nbsq;"), null, "02.03");
});

test("03 - retains strict errors separately from attribute ambiguity", () => {
  throws(() => rEntDecode("&#x;", { strict: true }), /THROW_ID_03/, "03.01");
  throws(() => rEntDecode("&#0;", { strict: true }), /Parse error/, "03.02");
  throws(
    () => rEntDecode("&copy=1", { strict: true, isAttributeValue: true }),
    /Parse error/,
    "03.03",
  );
  equal(
    rEntDecode("&copyx", { strict: true, isAttributeValue: true }),
    null,
    "03.04",
  );
});

test("04 - preserves strict errors after removing encoded ampersand layers", () => {
  throws(
    () => rEntDecode("&amp;xamp;", { strict: true }),
    /Parse error/,
    "04.01",
  );
  throws(() => rEntDecode("&itamp;", { strict: true }), /Parse error/, "04.02");
  throws(
    () => rEntDecode("&amp;xamp;", { strict: true, isAttributeValue: true }),
    /Parse error/,
    "04.03",
  );
  equal(rEntDecode("&amp;#xamp;", { strict: true }), null, "04.04");
  equal(rEntDecode("&#xamp;", { strict: true }), null, "04.05");
  equal(
    rEntDecode("&amp;#Xamp;", { strict: true, isAttributeValue: true }),
    null,
    "04.06",
  );
  equal(rEntDecode("&amp;#amp;", { strict: true }), null, "04.07");
  equal(rEntDecode("&madeup", { strict: true }), null, "04.08");
});

test.run();
