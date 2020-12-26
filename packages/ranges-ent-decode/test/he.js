import tap from "tap";
import { rEntDecode as decode } from "../dist/ranges-ent-decode.esm";

/**
The following tests were adapted from he.js
https://github.com/mathiasbynens/he/blob/master/tests/tests.js
MIT Licence - Copyright Mathias Bynens <https://mathiasbynens.be/>
*/

tap.test("01 - ambiguous ampersand", (t) => {
  t.strictSame(decode("a&foololthisdoesntexist;b"), null, "01.01");
  t.strictSame(decode("foo &lolwat; bar"), null, "01.02");
  t.end();
});

tap.test("02 - legacy named references (without a trailing semicolon)", (t) => {
  t.strictSame(
    decode("&notin; &noti &notin &copy123"),
    [
      [0, 7, "\u2209"],
      [8, 13, "\xACi"],
      [14, 19, "\xACi"],
      [21, 27, "\xA91"],
    ],
    "02"
  );
  t.end();
});

tap.test("03 - hexadecimal escape", (t) => {
  t.strictSame(
    decode("a&#x1D306;b&#X0000000000001d306;c"),
    [
      [1, 10, "\uD834\uDF06"],
      [11, 32, "\uD834\uDF06"],
    ],
    "03"
  );
  t.end();
});

tap.test("04 - Decimal escape", (t) => {
  t.strictSame(
    decode("a&#119558;b&#169;c&#00000000000000000169;d"),
    [
      [1, 10, "\uD834\uDF06"],
      [11, 17, "\xA9"],
      [18, 41, "\xA9"],
    ],
    "04"
  );
  t.end();
});

tap.test("05 - Special numerical escapes (see he.js issue #4)", (t) => {
  t.strictSame(
    decode("a&#xD834;&#xDF06;b&#55348;&#57094;c a&#x0;b&#0;c"),
    [
      [1, 17, "\uFFFD\uFFFD"],
      [18, 34, "\uFFFD\uFFFD"],
      [37, 42, "\uFFFD"],
      [43, 47, "\uFFFD"],
    ],
    "05"
  );
  t.end();
});

tap.test("06 - special numerical escapes in strict mode", (t) => {
  t.throws(() => {
    decode("a&#xD834;b", { strict: true });
  }, /Parse error/);
  t.end();
});

tap.test("07 - out-of-range hexadecimal escape in error-tolerant mode", (t) => {
  t.strictSame(decode("a&#x9999999999999999;b"), [[1, 21, "\uFFFD"]], "07");
  t.end();
});

tap.test("08 - out-of-range hexadecimal escape in strict mode", (t) => {
  t.throws(() => {
    decode("a&#x9999999999999999;b", { strict: true });
  }, /Parse error/);
  t.end();
});

tap.test("09 - out-of-range hexadecimal escape in error-tolerant mode", (t) => {
  t.strictSame(decode("a&#x110000;b"), [[1, 11, "\uFFFD"]], "09");
  t.end();
});

tap.test("10 - out-of-range hexadecimal escape in strict mode", (t) => {
  t.throws(() => {
    decode("a&#x110000;b", { strict: true });
  }, /Parse error/);
  t.end();
});

tap.test("11 - ambiguous ampersand in text context", (t) => {
  t.strictSame(decode("foo&ampbar"), [[3, 8, "&b"]], "11");
  t.end();
});

tap.test("12 - ambiguous ampersand in text context in strict mode", (t) => {
  t.throws(() => {
    decode("foo&ampbar", { strict: true });
  }, /Parse error/);
  t.end();
});

tap.test(
  "13 - hexadecimal escape without trailing semicolon in error-tolerant mode",
  (t) => {
    t.strictSame(decode("foo&#x1D306qux"), [[3, 11, "\uD834\uDF06"]], "13");
    t.end();
  }
);

tap.test(
  "14 - hexadecimal escape without trailing semicolon in strict mode",
  (t) => {
    t.throws(() => {
      decode("foo&#x1D306qux", { strict: true });
    }, /Parse error/);
    t.end();
  }
);

tap.test(
  "15 - decimal escape without trailing semicolon in error-tolerant mode",
  (t) => {
    t.strictSame(decode("foo&#119558qux"), [[3, 11, "\uD834\uDF06"]], "15");
    t.end();
  }
);

tap.test(
  "16 - decimal escape without trailing semicolon in strict mode",
  (t) => {
    t.throws(() => {
      decode("foo&#119558qux", { strict: true });
    }, /Parse error/g);
    t.end();
  }
);

tap.test(
  "17 - attribute value context - entity without semicolon sandwitched",
  (t) => {
    t.strictSame(
      decode("foo&ampbar", {
        isAttributeValue: true,
      }),
      null,
      "17 - nothing happens"
    );
    t.end();
  }
);

tap.test(
  "18 - attribute value context - entity with semicolon sandwitched with text",
  (t) => {
    t.strictSame(
      decode("foo&amp;bar", {
        isAttributeValue: true,
      }),
      [[3, 8, "&"]],
      "18"
    );
    t.end();
  }
);

tap.test(
  "19 - attribute value context - ends with entity with semicolon",
  (t) => {
    t.strictSame(
      decode("foo&amp;", {
        isAttributeValue: true,
      }),
      [[3, 8, "&"]],
      "19"
    );
    t.end();
  }
);

tap.test("20 - entity ends with equal sign instead of semicolon", (t) => {
  t.strictSame(decode("foo&amp="), [[3, 8, "&="]], "20");
  t.end();
});

tap.test(
  "21 - throws in strict mode when entity ends with equal sign instead of semicol",
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

tap.test("22 - unclosed HTML entity ends the input string", (t) => {
  t.strictSame(
    decode("foo&amp", {
      isAttributeValue: true,
    }),
    [[3, 7, "&"]],
    "22"
  );
  t.end();
});

tap.test("23 - false positive, not a parsing error", (t) => {
  t.strictSame(
    decode("foo&amplol", {
      isAttributeValue: true,
      strict: true,
    }),
    null,
    "23"
  );
  t.end();
});

tap.test("24 - foo&amplol in strict mode throws in text context", (t) => {
  t.throws(() => {
    decode("foo&amplol", {
      isAttributeValue: false,
      strict: true,
    });
  }, /Parse error/g);
  t.end();
});

tap.test(
  "25 - throws when strict mode is on isAttributeValue is false",
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

tap.test("26 - attribute value in error-tolerant mode, non-strict", (t) => {
  t.strictSame(
    decode("I'm &notit; I tell you", {
      strict: false,
      isAttributeValue: true,
    }),
    null,
    "26"
  );
  t.end();
});

tap.test("27 - attribute value in error-tolerant mode, strict", (t) => {
  t.strictSame(
    decode("I'm &notin; I tell you", {
      strict: true,
    }),
    [[4, 11, "\u2209"]],
    "27"
  );
  t.end();
});

tap.test("28 - decoding `&#x8D;` in error-tolerant mode", (t) => {
  t.strictSame(decode("&#x8D;"), [[0, 6, "\x8D"]], "28");
  t.end();
});

tap.test("29 - decoding `&#x8D;` in strict mode", (t) => {
  t.throws(() => {
    decode("&#x8D;", {
      strict: true,
    });
  }, /Parse error/);
  t.end();
});

tap.test("30 - decoding `&#xD;` in error-tolerant mode", (t) => {
  t.strictSame(decode("&#xD;"), [[0, 5, "\x0D"]], "30");
  t.end();
});

tap.test("31 - decoding `&#xD;` in strict mode", (t) => {
  t.throws(() => {
    decode("&#xD;", {
      strict: true,
    });
  }, /Parse error/g);
  t.end();
});

tap.test("32 - decoding `&#x94;` in error-tolerant mode", (t) => {
  t.strictSame(decode("&#x94;"), [[0, 6, "\u201D"]], "32");
  t.end();
});

tap.test("33 - decoding `&#x94;` in strict mode", (t) => {
  t.throws(() => {
    decode("&#x94;", {
      strict: true,
    });
  }, /Parse error/);
  t.end();
});

tap.test("34 - decoding `&#x1;` in error-tolerant mode", (t) => {
  t.strictSame(decode("&#x1;"), [[0, 5, "\x01"]], "34");
  t.end();
});

tap.test("35 - decoding `&#x1;` in strict mode", (t) => {
  t.throws(() => {
    decode("&#x1;", { strict: true });
  }, /Parse error/g);
  t.end();
});

tap.test("36 - decoding `&#x10FFFF;` in error-tolerant mode", (t) => {
  t.strictSame(decode("&#x10FFFF;"), [[0, 10, "\uDBFF\uDFFF"]], "36");
  t.end();
});

tap.test("37 - decoding `&#x10FFFF;` in strict mode", (t) => {
  t.throws(() => {
    decode("&#x10FFFF;", { strict: true });
  }, /Parse error/);
  t.end();
});

tap.test("38 - decoding `&#196605;` (valid code point) in strict mode", (t) => {
  t.strictSame(
    decode("&#196605;", { strict: true }),
    [[0, 9, "\uD87F\uDFFD"]],
    "38"
  );
  t.end();
});

tap.test("39 - throws when decoding `&#196607;` in strict mode", (t) => {
  t.throws(() => {
    decode("&#196607;", { strict: true });
  }, /Parse error/);
  t.end();
});

tap.test("40 - decoding &#xZ in error-tolerant mode", (t) => {
  t.strictSame(decode("&#xZ", { strict: false }), null, "40");
  t.end();
});

tap.test("41 - decoding &#xZ in strict mode", (t) => {
  t.throws(() => {
    decode("&#xZ", { strict: true });
  }, "41");
  t.end();
});

tap.test("42 - decoding &#Z in error-tolerant mode", (t) => {
  t.strictSame(decode("&#Z", { strict: false }), null, "42");
  t.end();
});

tap.test("43 - decoding &#Z in strict mode", (t) => {
  t.throws(() => {
    decode("&#Z", { strict: true });
  }, /Parse error/);
  t.end();
});

tap.test(
  "44 - decoding `&#00` numeric character reference (see issue #43)",
  (t) => {
    t.strictSame(decode("&#00"), [[0, 4, "\uFFFD"]], "44");
    t.end();
  }
);

tap.test("45 - decoding `0`-prefixed numeric character referencs", (t) => {
  t.strictSame(decode("&#0128;"), [[0, 7, "\u20AC"]], "45");
  t.end();
});
