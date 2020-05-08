import tap from "tap";
import decode from "../dist/ranges-ent-decode.esm";

// ==============================
// 00. Throws
// ==============================

tap.test("01 - throws when first input argument is missing", (t) => {
  t.throws(() => {
    decode();
  }, /THROW_ID_01/);
  t.end();
});

tap.test("02 - throws when first input argument is not string", (t) => {
  t.throws(() => {
    decode(true);
  }, /THROW_ID_01/);
  t.end();
});

tap.test(
  "03 - throws when second input argument is not a plain object",
  (t) => {
    t.throws(() => {
      decode("zzz", "tralala");
    }, /THROW_ID_02/);
    t.end();
  }
);

tap.test("04 - falsey opts does not throw", (t) => {
  t.doesNotThrow(() => {
    decode("yyy", undefined);
  }, "04.01");
  t.doesNotThrow(() => {
    decode("yyy", null);
  }, "04.02");
  t.end();
});

// ==============================
// 01. B.A.U.
// ==============================

tap.test(
  "05 - decodes multiple entities within a string, entities surrounded by other chars",
  (t) => {
    t.same(
      decode("a &pound; b &lsquo; c"),
      [
        [2, 9, "£"],
        [12, 19, "‘"],
      ],
      "05"
    );
    t.end();
  }
);

tap.test("06 - decodes double-encoded entities", (t) => {
  t.same(
    decode("a &amp;pound; b &amp;lsquo; c"),
    [
      [2, 13, "£"],
      [16, 27, "‘"],
    ],
    "06.01"
  );
  t.same(
    decode("a &#x26;pound; b &#x26;lsquo; c"),
    [
      [2, 14, "£"],
      [17, 29, "‘"],
    ],
    "06.02"
  );
  t.end();
});

tap.test("07 - decodes triple-encoded entities", (t) => {
  t.same(
    decode("a &amp;amp;pound; b &amp;amp;lsquo; c"),
    [
      [2, 17, "£"],
      [20, 35, "‘"],
    ],
    "07.01"
  );
  t.same(
    decode("a &#x26;#x26;pound; b &#x26;#x26;lsquo; c"),
    [
      [2, 19, "£"],
      [22, 39, "‘"],
    ],
    "07.02"
  );
  t.same(
    decode("a &#x26;amp;pound; b &#x26;amp;lsquo; c"),
    [
      [2, 18, "£"],
      [21, 37, "‘"],
    ],
    "07.03"
  );
  t.end();
});

tap.test("08 - ampersand entity", (t) => {
  t.same(
    decode("a &#x26; b &amp; c"),
    [
      [2, 8, "&"],
      [11, 16, "&"],
    ],
    "08.01"
  );
  t.same(
    decode("a &#x26;amp; b &amp;#x26; c"),
    [
      [2, 12, "&"],
      [15, 25, "&"],
    ],
    "08.02"
  );
  t.same(
    decode("a &#x26;amp;#x26; b &amp;#x26;amp; c"),
    [
      [2, 17, "&"],
      [20, 34, "&"],
    ],
    "08.03"
  );
  t.end();
});

// MIT Licence - Copyright Mathias Bynens <https://mathiasbynens.be/>
// Tests adapted from https://github.com/mathiasbynens/he/blob/master/tests/tests.js

tap.test("09 - ambiguous ampersand", (t) => {
  t.same(decode("a&foololthisdoesntexist;b"), [], "09.01");
  t.same(decode("foo &lolwat; bar"), [], "09.02");
  t.end();
});

tap.test("10 - legacy named references (without a trailing semicolon)", (t) => {
  t.same(
    decode("&notin; &noti &notin &copy123"),
    [
      [0, 7, "\u2209"],
      [8, 13, "\xACi"],
      [14, 19, "\xACi"],
      [21, 27, "\xA91"],
    ],
    "10"
  );
  t.end();
});

tap.test("11 - hexadecimal escape", (t) => {
  t.same(
    decode("a&#x1D306;b&#X0000000000001d306;c"),
    [
      [1, 10, "\uD834\uDF06"],
      [11, 32, "\uD834\uDF06"],
    ],
    "11"
  );
  t.end();
});

tap.test("12 - Decimal escape", (t) => {
  t.same(
    decode("a&#119558;b&#169;c&#00000000000000000169;d"),
    [
      [1, 10, "\uD834\uDF06"],
      [11, 17, "\xA9"],
      [18, 41, "\xA9"],
    ],
    "12"
  );
  t.end();
});

tap.test("13 - Special numerical escapes (see he.js issue #4)", (t) => {
  t.same(
    decode("a&#xD834;&#xDF06;b&#55348;&#57094;c a&#x0;b&#0;c"),
    [
      [1, 17, "\uFFFD\uFFFD"],
      [18, 34, "\uFFFD\uFFFD"],
      [37, 42, "\uFFFD"],
      [43, 47, "\uFFFD"],
    ],
    "13"
  );
  t.end();
});

tap.test("14 - special numerical escapes in strict mode", (t) => {
  t.throws(() => {
    decode("a&#xD834;b", { strict: true });
  }, /Parse error/);
  t.end();
});

tap.test("15 - out-of-range hexadecimal escape in error-tolerant mode", (t) => {
  t.same(decode("a&#x9999999999999999;b"), [[1, 21, "\uFFFD"]], "15");
  t.end();
});

tap.test("16 - out-of-range hexadecimal escape in strict mode", (t) => {
  t.throws(() => {
    decode("a&#x9999999999999999;b", { strict: true });
  }, /Parse error/);
  t.end();
});

tap.test("17 - out-of-range hexadecimal escape in error-tolerant mode", (t) => {
  t.same(decode("a&#x110000;b"), [[1, 11, "\uFFFD"]], "17");
  t.end();
});

tap.test("18 - out-of-range hexadecimal escape in strict mode", (t) => {
  t.throws(() => {
    decode("a&#x110000;b", { strict: true });
  }, /Parse error/);
  t.end();
});

tap.test("19 - ambiguous ampersand in text context", (t) => {
  t.same(decode("foo&ampbar"), [[3, 8, "&b"]], "19");
  t.end();
});

tap.test("20 - ambiguous ampersand in text context in strict mode", (t) => {
  t.throws(() => {
    decode("foo&ampbar", { strict: true });
  }, /Parse error/);
  t.end();
});

tap.test(
  "21 - hexadecimal escape without trailing semicolon in error-tolerant mode",
  (t) => {
    t.same(decode("foo&#x1D306qux"), [[3, 11, "\uD834\uDF06"]], "21");
    t.end();
  }
);

tap.test(
  "22 - hexadecimal escape without trailing semicolon in strict mode",
  (t) => {
    t.throws(() => {
      decode("foo&#x1D306qux", { strict: true });
    }, /Parse error/);
    t.end();
  }
);

tap.test(
  "23 - decimal escape without trailing semicolon in error-tolerant mode",
  (t) => {
    t.same(decode("foo&#119558qux"), [[3, 11, "\uD834\uDF06"]], "23");
    t.end();
  }
);

tap.test(
  "24 - decimal escape without trailing semicolon in strict mode",
  (t) => {
    t.throws(() => {
      decode("foo&#119558qux", { strict: true });
    }, /Parse error/g);
    t.end();
  }
);

tap.test(
  "25 - attribute value context - entity without semicolon sandwitched",
  (t) => {
    t.same(
      decode("foo&ampbar", {
        isAttributeValue: true,
      }),
      [],
      "25 - nothing happens"
    );
    t.end();
  }
);

tap.test(
  "26 - attribute value context - entity with semicolon sandwitched with text",
  (t) => {
    t.same(
      decode("foo&amp;bar", {
        isAttributeValue: true,
      }),
      [[3, 8, "&"]],
      "26"
    );
    t.end();
  }
);

tap.test(
  "27 - attribute value context - ends with entity with semicolon",
  (t) => {
    t.same(
      decode("foo&amp;", {
        isAttributeValue: true,
      }),
      [[3, 8, "&"]],
      "27"
    );
    t.end();
  }
);

tap.test("28 - entity ends with equal sign instead of semicolon", (t) => {
  t.same(decode("foo&amp="), [[3, 8, "&="]], "28");
  t.end();
});

tap.test(
  "29 - throws in strict mode when entity ends with equal sign instead of semicol",
  (t) => {
    t.throws(() => {
      decode("foo&amp=", {
        strict: true,
        isAttributeValue: true,
      });
    }, /Parse error/);
    t.end();
  }
);

tap.test("30 - unclosed HTML entity ends the input string", (t) => {
  t.same(
    decode("foo&amp", {
      isAttributeValue: true,
    }),
    [[3, 7, "&"]],
    "30"
  );
  t.end();
});

tap.test("31 - false positive, not a parsing error", (t) => {
  t.same(
    decode("foo&amplol", {
      isAttributeValue: true,
      strict: true,
    }),
    [],
    "31"
  );
  t.end();
});

tap.test("32 - foo&amplol in strict mode throws in text context", (t) => {
  t.throws(() => {
    decode("foo&amplol", {
      isAttributeValue: false,
      strict: true,
    });
  }, /Parse error/g);
  t.end();
});

tap.test(
  "33 - throws when strict mode is on isAttributeValue is false",
  (t) => {
    t.throws(() => {
      decode("I'm &notit; I tell you", {
        strict: true,
        isAttributeValue: false,
      });
    }, /Parse error/);
    t.end();
  }
);

tap.test("34 - attribute value in error-tolerant mode, non-strict", (t) => {
  t.same(
    decode("I'm &notit; I tell you", {
      strict: false,
      isAttributeValue: true,
    }),
    [],
    "34"
  );
  t.end();
});

tap.test("35 - attribute value in error-tolerant mode, strict", (t) => {
  t.same(
    decode("I'm &notin; I tell you", {
      strict: true,
    }),
    [[4, 11, "\u2209"]],
    "35"
  );
  t.end();
});

tap.test("36 - decoding `&#x8D;` in error-tolerant mode", (t) => {
  t.same(decode("&#x8D;"), [[0, 6, "\x8D"]], "36");
  t.end();
});

tap.test("37 - decoding `&#x8D;` in strict mode", (t) => {
  t.throws(() => {
    decode("&#x8D;", {
      strict: true,
    });
  }, /Parse error/);
  t.end();
});

tap.test("38 - decoding `&#xD;` in error-tolerant mode", (t) => {
  t.same(decode("&#xD;"), [[0, 5, "\x0D"]], "38");
  t.end();
});

tap.test("39 - decoding `&#xD;` in strict mode", (t) => {
  t.throws(() => {
    decode("&#xD;", {
      strict: true,
    });
  }, /Parse error/g);
  t.end();
});

tap.test("40 - decoding `&#x94;` in error-tolerant mode", (t) => {
  t.same(decode("&#x94;"), [[0, 6, "\u201D"]], "40");
  t.end();
});

tap.test("41 - decoding `&#x94;` in strict mode", (t) => {
  t.throws(() => {
    decode("&#x94;", {
      strict: true,
    });
  }, /Parse error/);
  t.end();
});

tap.test("42 - decoding `&#x1;` in error-tolerant mode", (t) => {
  t.same(decode("&#x1;"), [[0, 5, "\x01"]], "42");
  t.end();
});

tap.test("43 - decoding `&#x1;` in strict mode", (t) => {
  t.throws(() => {
    decode("&#x1;", { strict: true });
  }, /Parse error/g);
  t.end();
});

tap.test("44 - decoding `&#x10FFFF;` in error-tolerant mode", (t) => {
  t.same(decode("&#x10FFFF;"), [[0, 10, "\uDBFF\uDFFF"]], "44");
  t.end();
});

tap.test("45 - decoding `&#x10FFFF;` in strict mode", (t) => {
  t.throws(() => {
    decode("&#x10FFFF;", { strict: true });
  }, /Parse error/);
  t.end();
});

tap.test("46 - decoding `&#196605;` (valid code point) in strict mode", (t) => {
  t.same(decode("&#196605;", { strict: true }), [[0, 9, "\uD87F\uDFFD"]], "46");
  t.end();
});

tap.test("47 - throws when decoding `&#196607;` in strict mode", (t) => {
  t.throws(() => {
    decode("&#196607;", { strict: true });
  }, /Parse error/);
  t.end();
});

tap.test("48 - decoding &#xZ in error-tolerant mode", (t) => {
  t.same(decode("&#xZ", { strict: false }), [], "48");
  t.end();
});

tap.test("49 - decoding &#xZ in strict mode", (t) => {
  t.throws(() => {
    decode("&#xZ", { strict: true });
  }, "49");
  t.end();
});

tap.test("50 - decoding &#Z in error-tolerant mode", (t) => {
  t.same(decode("&#Z", { strict: false }), [], "50");
  t.end();
});

tap.test("51 - decoding &#Z in strict mode", (t) => {
  t.throws(() => {
    decode("&#Z", { strict: true });
  }, /Parse error/);
  t.end();
});

tap.test(
  "52 - decoding `&#00` numeric character reference (see issue #43)",
  (t) => {
    t.same(decode("&#00"), [[0, 4, "\uFFFD"]], "52");
    t.end();
  }
);

tap.test("53 - decoding `0`-prefixed numeric character referencs", (t) => {
  t.same(decode("&#0128;"), [[0, 7, "\u20AC"]], "53");
  t.end();
});
