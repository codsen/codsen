import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { rEntDecode as decode } from "../dist/ranges-ent-decode.esm.js";

/**
The following tests were adapted from he.js
https://github.com/mathiasbynens/he/blob/master/tests/tests.js
MIT Licence - Copyright Mathias Bynens <https://mathiasbynens.be/>
*/

test("01 - ambiguous ampersand", () => {
  equal(decode("a&foololthisdoesntexist;b"), null, "01.01");
  equal(decode("foo &lolwat; bar"), null, "01.02");
});

test("02 - legacy named references (without a trailing semicolon)", () => {
  equal(
    decode("&notin; &noti &notin &copy123"),
    [
      [0, 7, "\u2209"],
      [8, 13, "\xACi"],
      [14, 19, "\xACi"],
      [21, 27, "\xA91"],
    ],
    "02.01"
  );
});

test("03 - hexadecimal escape", () => {
  equal(
    decode("a&#x1D306;b&#X0000000000001d306;c"),
    [
      [1, 10, "\uD834\uDF06"],
      [11, 32, "\uD834\uDF06"],
    ],
    "03.01"
  );
});

test("04 - Decimal escape", () => {
  equal(
    decode("a&#119558;b&#169;c&#00000000000000000169;d"),
    [
      [1, 10, "\uD834\uDF06"],
      [11, 17, "\xA9"],
      [18, 41, "\xA9"],
    ],
    "04.01"
  );
});

test("05 - Special numerical escapes (see he.js issue #4)", () => {
  equal(
    decode("a&#xD834;&#xDF06;b&#55348;&#57094;c a&#x0;b&#0;c"),
    [
      [1, 17, "\uFFFD\uFFFD"],
      [18, 34, "\uFFFD\uFFFD"],
      [37, 42, "\uFFFD"],
      [43, 47, "\uFFFD"],
    ],
    "05.01"
  );
});

test("06 - special numerical escapes in strict mode", () => {
  throws(
    () => {
      decode("a&#xD834;b", { strict: true });
    },
    /Parse error/,
    "06.01"
  );
});

test("07 - out-of-range hexadecimal escape in error-tolerant mode", () => {
  equal(decode("a&#x9999999999999999;b"), [[1, 21, "\uFFFD"]], "07.01");
});

test("08 - out-of-range hexadecimal escape in strict mode", () => {
  throws(
    () => {
      decode("a&#x9999999999999999;b", { strict: true });
    },
    /Parse error/,
    "08.01"
  );
});

test("09 - out-of-range hexadecimal escape in error-tolerant mode", () => {
  equal(decode("a&#x110000;b"), [[1, 11, "\uFFFD"]], "09.01");
});

test("10 - out-of-range hexadecimal escape in strict mode", () => {
  throws(
    () => {
      decode("a&#x110000;b", { strict: true });
    },
    /Parse error/,
    "10.01"
  );
});

test("11 - ambiguous ampersand in text context", () => {
  equal(decode("foo&ampbar"), [[3, 8, "&b"]], "11.01");
});

test("12 - ambiguous ampersand in text context in strict mode", () => {
  throws(
    () => {
      decode("foo&ampbar", { strict: true });
    },
    /Parse error/,
    "12.01"
  );
});

test("13 - hexadecimal escape without trailing semicolon in error-tolerant mode", () => {
  equal(decode("foo&#x1D306qux"), [[3, 11, "\uD834\uDF06"]], "13.01");
});

test("14 - hexadecimal escape without trailing semicolon in strict mode", () => {
  throws(
    () => {
      decode("foo&#x1D306qux", { strict: true });
    },
    /Parse error/,
    "14.01"
  );
});

test("15 - decimal escape without trailing semicolon in error-tolerant mode", () => {
  equal(decode("foo&#119558qux"), [[3, 11, "\uD834\uDF06"]], "15.01");
});

test("16 - decimal escape without trailing semicolon in strict mode", () => {
  throws(
    () => {
      decode("foo&#119558qux", { strict: true });
    },
    /Parse error/g,
    "16.01"
  );
});

test("17 - attribute value context - entity without semicolon sandwitched", () => {
  equal(
    decode("foo&ampbar", {
      isAttributeValue: true,
    }),
    null,
    "17.01"
  );
});

test("18 - attribute value context - entity with semicolon sandwitched with text", () => {
  equal(
    decode("foo&amp;bar", {
      isAttributeValue: true,
    }),
    [[3, 8, "&"]],
    "18.01"
  );
});

test("19 - attribute value context - ends with entity with semicolon", () => {
  equal(
    decode("foo&amp;", {
      isAttributeValue: true,
    }),
    [[3, 8, "&"]],
    "19.01"
  );
});

test("20 - entity ends with equal sign instead of semicolon", () => {
  equal(decode("foo&amp="), [[3, 8, "&="]], "20.01");
});

test("21 - throws in strict mode when entity ends with equal sign instead of semicol", () => {
  throws(
    () => {
      decode("foo&amp=", {
        strict: true,
        isAttributeValue: true,
      });
    },
    /Parse error/,
    "21.01"
  );
});

test("22 - unclosed HTML entity ends the input string", () => {
  equal(
    decode("foo&amp", {
      isAttributeValue: true,
    }),
    [[3, 7, "&"]],
    "22.01"
  );
});

test("23 - false positive, not a parsing error", () => {
  equal(
    decode("foo&amplol", {
      isAttributeValue: true,
      strict: true,
    }),
    null,
    "23.01"
  );
});

test("24 - foo&amplol in strict mode throws in text context", () => {
  throws(
    () => {
      decode("foo&amplol", {
        isAttributeValue: false,
        strict: true,
      });
    },
    /Parse error/g,
    "24.01"
  );
});

test("25 - throws when strict mode is on isAttributeValue is false", () => {
  throws(
    () => {
      decode("I'm &notit; I tell you", {
        strict: true,
        isAttributeValue: false,
      });
    },
    /Parse error/,
    "25.01"
  );
});

test("26 - attribute value in error-tolerant mode, non-strict", () => {
  equal(
    decode("I'm &notit; I tell you", {
      strict: false,
      isAttributeValue: true,
    }),
    null,
    "26.01"
  );
});

test("27 - attribute value in error-tolerant mode, strict", () => {
  equal(
    decode("I'm &notin; I tell you", {
      strict: true,
    }),
    [[4, 11, "\u2209"]],
    "27.01"
  );
});

test("28 - decoding `&#x8D;` in error-tolerant mode", () => {
  equal(decode("&#x8D;"), [[0, 6, "\x8D"]], "28.01");
});

test("29 - decoding `&#x8D;` in strict mode", () => {
  throws(
    () => {
      decode("&#x8D;", {
        strict: true,
      });
    },
    /Parse error/,
    "29.01"
  );
});

test("30 - decoding `&#xD;` in error-tolerant mode", () => {
  equal(decode("&#xD;"), [[0, 5, "\x0D"]], "30.01");
});

test("31 - decoding `&#xD;` in strict mode", () => {
  throws(
    () => {
      decode("&#xD;", {
        strict: true,
      });
    },
    /Parse error/g,
    "31.01"
  );
});

test("32 - decoding `&#x94;` in error-tolerant mode", () => {
  equal(decode("&#x94;"), [[0, 6, "\u201D"]], "32.01");
});

test("33 - decoding `&#x94;` in strict mode", () => {
  throws(
    () => {
      decode("&#x94;", {
        strict: true,
      });
    },
    /Parse error/,
    "33.01"
  );
});

test("34 - decoding `&#x1;` in error-tolerant mode", () => {
  equal(decode("&#x1;"), [[0, 5, "\x01"]], "34.01");
});

test("35 - decoding `&#x1;` in strict mode", () => {
  throws(
    () => {
      decode("&#x1;", { strict: true });
    },
    /Parse error/g,
    "35.01"
  );
});

test("36 - decoding `&#x10FFFF;` in error-tolerant mode", () => {
  equal(decode("&#x10FFFF;"), [[0, 10, "\uDBFF\uDFFF"]], "36.01");
});

test("37 - decoding `&#x10FFFF;` in strict mode", () => {
  throws(
    () => {
      decode("&#x10FFFF;", { strict: true });
    },
    /Parse error/,
    "37.01"
  );
});

test("38 - decoding `&#196605;` (valid code point) in strict mode", () => {
  equal(
    decode("&#196605;", { strict: true }),
    [[0, 9, "\uD87F\uDFFD"]],
    "38.01"
  );
});

test("39 - throws when decoding `&#196607;` in strict mode", () => {
  throws(
    () => {
      decode("&#196607;", { strict: true });
    },
    /Parse error/,
    "39.01"
  );
});

test("40 - decoding &#xZ in error-tolerant mode", () => {
  equal(decode("&#xZ", { strict: false }), null, "40.01");
});

test("41 - decoding &#xZ in strict mode", () => {
  throws(
    () => {
      decode("&#xZ", { strict: true });
    },
    "41.01",
    "41.01"
  );
});

test("42 - decoding &#Z in error-tolerant mode", () => {
  equal(decode("&#Z", { strict: false }), null, "42.01");
});

test("43 - decoding &#Z in strict mode", () => {
  throws(
    () => {
      decode("&#Z", { strict: true });
    },
    /Parse error/,
    "43.01"
  );
});

test("44 - decoding `&#00` numeric character reference (see issue #43)", () => {
  equal(decode("&#00"), [[0, 4, "\uFFFD"]], "44.01");
});

test("45 - decoding `0`-prefixed numeric character referencs", () => {
  equal(decode("&#0128;"), [[0, 7, "\u20AC"]], "45.01");
});

test.run();
