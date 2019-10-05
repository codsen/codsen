import test from "ava";
import decode from "../dist/ranges-ent-decode.esm";

// ==============================
// 00. Throws
// ==============================

test("00.01 - throws when first input argument is missing", t => {
  const error1 = t.throws(() => {
    decode();
  });
  t.regex(error1.message, /THROW_ID_01/);
});

test("00.02 - throws when first input argument is not string", t => {
  const error1 = t.throws(() => {
    decode(true);
  });
  t.regex(error1.message, /THROW_ID_01/);
});

test("00.03 - throws when second input argument is not a plain object", t => {
  const error1 = t.throws(() => {
    decode("zzz", "tralala");
  });
  t.regex(error1.message, /THROW_ID_02/);
});

test("00.04 - falsey opts does not throw", t => {
  t.notThrows(() => {
    decode("yyy", undefined);
  });
  t.notThrows(() => {
    decode("yyy", null);
  });
});

// ==============================
// 01. B.A.U.
// ==============================

test("01.01 - decodes multiple entities within a string, entities surrounded by other chars", t => {
  t.deepEqual(
    decode("a &pound; b &lsquo; c"),
    [[2, 9, "£"], [12, 19, "‘"]],
    "01.01.01"
  );
});

test("01.02 - decodes double-encoded entities", t => {
  t.deepEqual(
    decode("a &amp;pound; b &amp;lsquo; c"),
    [[2, 13, "£"], [16, 27, "‘"]],
    "01.02"
  );
  t.deepEqual(
    decode("a &#x26;pound; b &#x26;lsquo; c"),
    [[2, 14, "£"], [17, 29, "‘"]],
    "01.02"
  );
});

test("01.03 - decodes triple-encoded entities", t => {
  t.deepEqual(
    decode("a &amp;amp;pound; b &amp;amp;lsquo; c"),
    [[2, 17, "£"], [20, 35, "‘"]],
    "01.03.01"
  );
  t.deepEqual(
    decode("a &#x26;#x26;pound; b &#x26;#x26;lsquo; c"),
    [[2, 19, "£"], [22, 39, "‘"]],
    "01.03.02"
  );
  t.deepEqual(
    decode("a &#x26;amp;pound; b &#x26;amp;lsquo; c"),
    [[2, 18, "£"], [21, 37, "‘"]],
    "01.03.03"
  );
});

test("01.04 - ampersand entity", t => {
  t.deepEqual(
    decode("a &#x26; b &amp; c"),
    [[2, 8, "&"], [11, 16, "&"]],
    "01.04.01"
  );
  t.deepEqual(
    decode("a &#x26;amp; b &amp;#x26; c"),
    [[2, 12, "&"], [15, 25, "&"]],
    "01.04.02"
  );
  t.deepEqual(
    decode("a &#x26;amp;#x26; b &amp;#x26;amp; c"),
    [[2, 17, "&"], [20, 34, "&"]],
    "01.04.03"
  );
});

// MIT Licence - Copyright Mathias Bynens <https://mathiasbynens.be/>
// Tests adapted from https://github.com/mathiasbynens/he/blob/master/tests/tests.js

test("01.05 - ambiguous ampersand", t => {
  t.deepEqual(decode("a&foololthisdoesntexist;b"), [], "01.05.01");
  t.deepEqual(decode("foo &lolwat; bar"), [], "01.05.02");
});

test("01.06 - legacy named references (without a trailing semicolon)", t => {
  t.deepEqual(
    decode("&notin; &noti &notin &copy123"),
    [[0, 7, "\u2209"], [8, 13, "\xACi"], [14, 19, "\xACi"], [21, 27, "\xA91"]],
    "01.06"
  );
});

test("01.07 - hexadecimal escape", t => {
  t.deepEqual(
    decode("a&#x1D306;b&#X0000000000001d306;c"),
    [[1, 10, "\uD834\uDF06"], [11, 32, "\uD834\uDF06"]],
    "01.07"
  );
});

test("01.08 - Decimal escape", t => {
  t.deepEqual(
    decode("a&#119558;b&#169;c&#00000000000000000169;d"),
    [[1, 10, "\uD834\uDF06"], [11, 17, "\xA9"], [18, 41, "\xA9"]],
    "01.08"
  );
});

test("01.09 - Special numerical escapes (see he.js issue #4)", t => {
  t.deepEqual(
    decode("a&#xD834;&#xDF06;b&#55348;&#57094;c a&#x0;b&#0;c"),
    [
      [1, 17, "\uFFFD\uFFFD"],
      [18, 34, "\uFFFD\uFFFD"],
      [37, 42, "\uFFFD"],
      [43, 47, "\uFFFD"]
    ],
    "01.09"
  );
});

test("01.10 - special numerical escapes in strict mode", t => {
  const error1 = t.throws(() => {
    decode("a&#xD834;b", { strict: true });
  });
  t.regex(error1.message, /Parse error/);
});

test("01.11 - out-of-range hexadecimal escape in error-tolerant mode", t => {
  t.deepEqual(decode("a&#x9999999999999999;b"), [[1, 21, "\uFFFD"]], "01.11");
});

test("01.12 - out-of-range hexadecimal escape in strict mode", t => {
  const error1 = t.throws(() => {
    decode("a&#x9999999999999999;b", { strict: true });
  });
  t.regex(error1.message, /Parse error/);
});

test("01.13 - out-of-range hexadecimal escape in error-tolerant mode", t => {
  t.deepEqual(decode("a&#x110000;b"), [[1, 11, "\uFFFD"]], "01.13");
});

test("01.14 - out-of-range hexadecimal escape in strict mode", t => {
  const error1 = t.throws(() => {
    decode("a&#x110000;b", { strict: true });
  });
  t.regex(error1.message, /Parse error/);
});

test("01.15 - ambiguous ampersand in text context", t => {
  t.deepEqual(decode("foo&ampbar"), [[3, 8, "&b"]], "01.15");
});

test("01.16 - ambiguous ampersand in text context in strict mode", t => {
  const error1 = t.throws(() => {
    decode("foo&ampbar", { strict: true });
  });
  t.regex(error1.message, /Parse error/);
});

test("01.17 - hexadecimal escape without trailing semicolon in error-tolerant mode", t => {
  t.deepEqual(decode("foo&#x1D306qux"), [[3, 11, "\uD834\uDF06"]], "01.17");
});

test("01.18 - hexadecimal escape without trailing semicolon in strict mode", t => {
  const error1 = t.throws(() => {
    decode("foo&#x1D306qux", { strict: true });
  });
  t.regex(error1.message, /Parse error/);
});

test("01.19 - decimal escape without trailing semicolon in error-tolerant mode", t => {
  t.deepEqual(decode("foo&#119558qux"), [[3, 11, "\uD834\uDF06"]], "01.19");
});

test("01.20 - decimal escape without trailing semicolon in strict mode", t => {
  const error1 = t.throws(() => {
    decode("foo&#119558qux", { strict: true });
  });
  t.regex(error1.message, /Parse error/);
});

test("01.21 - attribute value context - entity without semicolon sandwitched", t => {
  t.deepEqual(
    decode("foo&ampbar", {
      isAttributeValue: true
    }),
    [],
    "01.21 - nothing happens"
  );
});

test("01.22 - attribute value context - entity with semicolon sandwitched with text", t => {
  t.deepEqual(
    decode("foo&amp;bar", {
      isAttributeValue: true
    }),
    [[3, 8, "&"]],
    "01.22"
  );
});

test("01.23 - attribute value context - ends with entity with semicolon", t => {
  t.deepEqual(
    decode("foo&amp;", {
      isAttributeValue: true
    }),
    [[3, 8, "&"]],
    "01.23"
  );
});

test("01.24 - entity ends with equal sign instead of semicolon", t => {
  t.deepEqual(decode("foo&amp="), [[3, 8, "&="]], "01.24");
});

test("01.25 - throws in strict mode when entity ends with equal sign instead of semicol", t => {
  const error1 = t.throws(() => {
    decode("foo&amp=", {
      strict: true,
      isAttributeValue: true
    });
  });
  t.regex(error1.message, /Parse error/);
});

test("01.26 - unclosed HTML entity ends the input string", t => {
  t.deepEqual(
    decode("foo&amp", {
      isAttributeValue: true
    }),
    [[3, 7, "&"]],
    "01.26"
  );
});

test("01.27 - false positive, not a parsing error", t => {
  t.deepEqual(
    decode("foo&amplol", {
      isAttributeValue: true,
      strict: true
    }),
    [],
    "01.27"
  );
});

test("01.28 - foo&amplol in strict mode throws in text context", t => {
  const error1 = t.throws(() => {
    decode("foo&amplol", {
      isAttributeValue: false,
      strict: true
    });
  });
  t.regex(error1.message, /Parse error/);
});

test("01.29 - throws when strict mode is on isAttributeValue is false", t => {
  const error1 = t.throws(() => {
    decode("I'm &notit; I tell you", {
      strict: true,
      isAttributeValue: false
    });
  });
  t.regex(error1.message, /Parse error/);
});

test("01.30 - attribute value in error-tolerant mode, non-strict", t => {
  t.deepEqual(
    decode("I'm &notit; I tell you", {
      strict: false,
      isAttributeValue: true
    }),
    [],
    "01.30"
  );
});

test("01.31 - attribute value in error-tolerant mode, strict", t => {
  t.deepEqual(
    decode("I'm &notin; I tell you", {
      strict: true
    }),
    [[4, 11, "\u2209"]],
    "01.31"
  );
});

test("01.32 - decoding `&#x8D;` in error-tolerant mode", t => {
  t.deepEqual(decode("&#x8D;"), [[0, 6, "\x8D"]], "01.32");
});

test("01.33 - decoding `&#x8D;` in strict mode", t => {
  const error1 = t.throws(() => {
    decode("&#x8D;", {
      strict: true
    });
  });
  t.regex(error1.message, /Parse error/);
});

test("01.34 - decoding `&#xD;` in error-tolerant mode", t => {
  t.deepEqual(decode("&#xD;"), [[0, 5, "\x0D"]], "01.34");
});

test("01.35 - decoding `&#xD;` in strict mode", t => {
  const error1 = t.throws(() => {
    decode("&#xD;", {
      strict: true
    });
  });
  t.regex(error1.message, /Parse error/);
});

test("01.36 - decoding `&#x94;` in error-tolerant mode", t => {
  t.deepEqual(decode("&#x94;"), [[0, 6, "\u201D"]], "01.36");
});

test("01.37 - decoding `&#x94;` in strict mode", t => {
  const error1 = t.throws(() => {
    decode("&#x94;", {
      strict: true
    });
  });
  t.regex(error1.message, /Parse error/);
});

test("01.38 - decoding `&#x1;` in error-tolerant mode", t => {
  t.deepEqual(decode("&#x1;"), [[0, 5, "\x01"]], "01.38");
});

test("01.39 - decoding `&#x1;` in strict mode", t => {
  const error1 = t.throws(() => {
    decode("&#x1;", { strict: true });
  });
  t.regex(error1.message, /Parse error/);
});

test("01.40 - decoding `&#x10FFFF;` in error-tolerant mode", t => {
  t.deepEqual(decode("&#x10FFFF;"), [[0, 10, "\uDBFF\uDFFF"]], "01.40");
});

test("01.41 - decoding `&#x10FFFF;` in strict mode", t => {
  const error1 = t.throws(() => {
    decode("&#x10FFFF;", { strict: true });
  });
  t.regex(error1.message, /Parse error/);
});

test("01.42 - decoding `&#196605;` (valid code point) in strict mode", t => {
  t.deepEqual(
    decode("&#196605;", { strict: true }),
    [[0, 9, "\uD87F\uDFFD"]],
    "01.42"
  );
});

test("01.43 - throws when decoding `&#196607;` in strict mode", t => {
  const error1 = t.throws(() => {
    decode("&#196607;", { strict: true });
  });
  t.regex(error1.message, /Parse error/);
});

test("01.44 - decoding &#xZ in error-tolerant mode", t => {
  t.deepEqual(decode("&#xZ", { strict: false }), [], "01.44");
});

test("01.45 - decoding &#xZ in strict mode", t => {
  t.throws(() => {
    decode("&#xZ", { strict: true });
  });
});

test("01.46 - decoding &#Z in error-tolerant mode", t => {
  t.deepEqual(decode("&#Z", { strict: false }), [], "01.46");
});

test("01.47 - decoding &#Z in strict mode", t => {
  const error1 = t.throws(() => {
    decode("&#Z", { strict: true });
  });
  t.regex(error1.message, /Parse error/);
});

test("01.48 - decoding `&#00` numeric character reference (see issue #43)", t => {
  t.deepEqual(decode("&#00"), [[0, 4, "\uFFFD"]], "01.48");
});

test("01.49 - decoding `0`-prefixed numeric character referencs", t => {
  t.deepEqual(decode("&#0128;"), [[0, 7, "\u20AC"]], "01.49");
});
