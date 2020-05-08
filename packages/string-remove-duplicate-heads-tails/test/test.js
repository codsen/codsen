import tap from "tap";
import rem from "../dist/string-remove-duplicate-heads-tails.esm";

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

tap.test("01 - wrong/missing input = throw", (t) => {
  t.throws(() => {
    rem();
  }, /THROW_ID_01/g);
  t.doesNotThrow(() => {
    rem(1);
  }, "01.02");
  t.end();
});

tap.test("02 - wrong opts", (t) => {
  t.throws(() => {
    rem("a", "a");
  }, /THROW_ID_03/g);
  t.throws(() => {
    rem("a", 1);
  }, /THROW_ID_03/g);
  t.throws(() => {
    rem("a {{}} b", {
      heads: ["{{", 1],
      tails: ["}}"],
    });
  }, /THROW_ID_04/g);
  t.throws(() => {
    rem("a {{}} b", {
      heads: ["{{"],
      tails: ["}}", 1],
    });
  }, /THROW_ID_05/g);
  t.end();
});

tap.test("03 - empty input string", (t) => {
  t.same(
    rem("", {
      heads: "{{",
      tails: "}}",
    }),
    "",
    "03.01"
  );
  t.same(rem(""), "", "03.02");
  t.end();
});

tap.test("04 - none of heads or tails found", (t) => {
  t.same(
    rem("aaa {{", {
      heads: "%%",
      tails: "__",
    }),
    "aaa {{",
    "04"
  );
  t.end();
});

// -----------------------------------------------------------------------------
// 02. normal use
// -----------------------------------------------------------------------------

tap.test("05 - trims wrapped heads and tails", (t) => {
  t.same(
    rem("{{ hi {{ name }}! }}", {
      heads: "{{",
      tails: "}}",
    }),
    "hi {{ name }}!",
    "05.01"
  );
  t.same(
    rem("{{ hi }} name {{! }}", {
      heads: "{{",
      tails: "}}",
    }),
    "{{ hi }} name {{! }}",
    "05.02"
  );
  t.end();
});

tap.test(
  "06 - trims wrapped heads and tails, with space inside heads/tails",
  (t) => {
    t.same(
      rem("{{ Hi {{ first_name }}! }}", {
        heads: "{{ ",
        tails: " }}",
      }),
      "Hi {{ first_name }}!",
      "06 - heads and tails with spaces"
    );
    t.end();
  }
);

tap.test("07 - trimmed heads and tails in the source still get caught", (t) => {
  t.same(
    rem("{{Hi {{ first_name }}!}}", {
      heads: "{{ ",
      tails: " }}",
    }),
    "Hi {{ first_name }}!",
    "07 - with spaces, and those spaces are not on str"
  );
  t.end();
});

tap.test(
  "08 - excessive whitespace in opts heads/tails doesn't matter",
  (t) => {
    t.same(
      rem("{{ Hi {{ first_name }}! }}", {
        heads: "   {{     ",
        tails: "    }}       ",
      }),
      "Hi {{ first_name }}!",
      "08 - excessive spaces"
    );
    t.end();
  }
);

tap.test("09 - single curly brace heads/tails", (t) => {
  t.same(
    rem("{ Hi { first_name }! }", {
      heads: "{",
      tails: "}",
    }),
    "Hi { first_name }!",
    "09"
  );
  t.end();
});

tap.test("10 - custom heads and tails, whitespace both sides", (t) => {
  t.same(
    rem("{Hi { first_name }!}", {
      heads: " { ",
      tails: " } ",
    }),
    "Hi { first_name }!",
    "10"
  );
  t.end();
});

tap.test("11 - ends with tails, doesn't start with heads", (t) => {
  t.same(
    rem("Hi {{ first_name }}", {
      heads: ["%%-", "{{"],
      tails: ["-%%", "}}"],
    }),
    "Hi {{ first_name }}",
    "11"
  );
  t.end();
});

tap.test("12 - starts with heads, doesn't end with tails", (t) => {
  t.same(
    rem("  {{ first_name }}!  ", {
      heads: ["%%-", "{{"],
      tails: ["-%%", "}}"],
    }),
    "{{ first_name }}!",
    "12"
  );
  t.end();
});

tap.test("13 - properly wrapped, heads/tails in array, matched", (t) => {
  t.same(
    rem("  {{ first_name }}  ", {
      heads: ["%%-", "{{"],
      tails: ["-%%", "}}"],
    }),
    "{{ first_name }}",
    "13"
  );
  t.end();
});

tap.test("14 - starts with heads, doesn't end with tails", (t) => {
  t.same(
    rem("   {{ a }}{{ b }}   ", {
      heads: ["%%-", "{{"],
      tails: ["-%%", "}}"],
    }),
    "{{ a }}{{ b }}",
    "14"
  );
  t.end();
});

tap.test("15 - unclosed heads", (t) => {
  t.same(
    rem("zzz {{", {
      heads: ["%%-", "{{"],
      tails: ["-%%", "}}"],
    }),
    "zzz {{",
    "15"
  );
  t.end();
});

tap.test("16 - unclosed tails", (t) => {
  t.same(
    rem("zzz }}", {
      heads: ["%%-", "{{"],
      tails: ["-%%", "}}"],
    }),
    "zzz }}",
    "16"
  );
  t.end();
});

tap.test("17 - ends with empty variable", (t) => {
  t.same(
    rem("zzz {{}}", {
      heads: ["%%-", "{{"],
      tails: ["-%%", "}}"],
    }),
    "zzz",
    "17"
  );
  t.end();
});

tap.test("18 - empty variable with text both sides", (t) => {
  t.same(
    rem("zzz {{}} yyy", {
      heads: ["%%-", "{{"],
      tails: ["-%%", "}}"],
    }),
    "zzz {{}} yyy",
    "18"
  );
  t.end();
});

tap.test("19 - heads/tails in opposite order", (t) => {
  t.same(
    rem(" zzz }}{{ yyy", {
      heads: ["%%-", "{{"],
      tails: ["-%%", "}}"],
    }),
    "zzz }}{{ yyy",
    "19"
  );
  t.end();
});

tap.test("20 - tails with text on both sides", (t) => {
  t.same(
    rem("zzz }} yyy", {
      heads: ["%%-", "{{"],
      tails: ["-%%", "}}"],
    }),
    "zzz }} yyy",
    "20"
  );
  t.end();
});

tap.test("21 - heads with text on both sides", (t) => {
  t.same(
    rem("zzz {{ yyy", {
      heads: ["%%-", "{{"],
      tails: ["-%%", "}}"],
    }),
    "zzz {{ yyy",
    "21"
  );
  t.end();
});

tap.test("22 - multiple heads, single tails", (t) => {
  t.same(
    rem("{{{{ first_name }}!", {
      heads: ["%%-", "{{"],
      tails: ["-%%", "}}"],
    }),
    "{{{{ first_name }}!",
    "22"
  );
  t.end();
});

tap.test("23 - one set of custom heads and tails, single char string", (t) => {
  t.same(
    rem("??z!!", {
      heads: "??",
      tails: "!!",
    }),
    "??z!!",
    "23.01"
  );
  t.same(
    rem("??!! ??z!!", {
      heads: "??",
      tails: "!!",
    }),
    "??z!!",
    "23.02"
  );
  t.same(
    rem("??z!! ??!!", {
      heads: "??",
      tails: "!!",
    }),
    "??z!!",
    "23.03"
  );
  t.same(
    rem("??!! ??z!! ??!!", {
      heads: "??",
      tails: "!!",
    }),
    "??z!!",
    "23.04"
  );
  t.same(
    rem("\t??z!!", {
      heads: "??",
      tails: "!!",
    }),
    "??z!!",
    "23.05"
  );
  t.same(
    rem("??!!\t??z!!", {
      heads: "??",
      tails: "!!",
    }),
    "??z!!",
    "23.06"
  );
  t.same(
    rem("??z!! ??!! ", {
      heads: "??",
      tails: "!!",
    }),
    "??z!!",
    "23.07"
  );
  t.same(
    rem("\t??!! ??z!! ??!!", {
      heads: "??",
      tails: "!!",
    }),
    "??z!!",
    "23.08"
  );
  t.same(
    rem("{{ z }}", {
      heads: "??",
      tails: "!!",
    }),
    "{{ z }}",
    "23.09 - checking are defaults not leaking #1"
  );
  t.same(
    rem("{{{{ z }}}}", {
      heads: "??",
      tails: "!!",
    }),
    "{{{{ z }}}}",
    "23.10 - checking are defaults not leaking #2"
  );
  t.end();
});

tap.test("24 - two sets of custom heads and tails, single char string", (t) => {
  // recursively:
  t.same(
    rem("????z!!!!", {
      heads: "??",
      tails: "!!",
    }),
    "??z!!",
    "24"
  );
  t.end();
});

tap.test("25 - words with space, single set of custom heads and tails", (t) => {
  t.same(
    rem("??tralalala!lalala!!", {
      heads: "??",
      tails: "!!",
    }),
    "??tralalala!lalala!!",
    "25"
  );
  t.end();
});

tap.test(
  "26 - double wrapped with custom heads and tails, with whitespace",
  (t) => {
    // recursively with spaces
    t.same(
      rem("?? ?? x y !! !!", {
        heads: "??",
        tails: "!!",
      }),
      "?? x y !!",
      "26"
    );
    t.end();
  }
);

tap.test("27 - mixed sets of heads and tails #1", (t) => {
  // peels off two outer layers but doesn't touch separate var wrappers
  t.same(
    rem("?? ((( ?? x !! ?? y !! ))) !!", {
      heads: ["??", "((("],
      tails: ["!!", ")))"],
    }),
    "?? x !! ?? y !!",
    "27.01 - input with spaces"
  );
  t.same(
    rem("?? ((( ?? x !! ?? y !! ))) !!", {
      heads: ["?? ", "((( "],
      tails: [" !!", " )))"],
    }),
    "?? x !! ?? y !!",
    "27.02 - both input and head/tail references with spaces"
  );
  t.same(
    rem("??(((??x!!??y!!)))!!", {
      heads: ["?? ", "((( "],
      tails: [" !!", " )))"],
    }),
    "??x!!??y!!",
    "27.03 - both input and head/tail references with spaces"
  );
  t.end();
});

tap.test("28 - mixed sets of heads and tails #2", (t) => {
  t.same(
    rem("??(((??tralalala!!(((lalala))))))!!", {
      heads: ["??", "((("],
      tails: ["!!", ")))"],
    }),
    "??tralalala!!(((lalala)))",
    "28"
  );
  t.end();
});

tap.test(
  "29 - blank heads and tails within second level being removed",
  (t) => {
    t.same(
      rem("??((())) ((( ?? a !! ((( b ))) )))!!", {
        heads: ["??", "((("],
        tails: ["!!", ")))"],
      }),
      "?? a !! ((( b )))",
      "29.01"
    );
    t.same(
      rem("?? (((  \n  )))   \t\t\t ((( ?? a !! ((( b )))\n ))) !!", {
        heads: ["??", "((("],
        tails: ["!!", ")))"],
      }),
      "?? a !! ((( b )))",
      "29.02"
    );
    t.same(
      rem("?? (((  \n  )))   \t\t\t ((( ??  !! (((  )))\n ))) !!", {
        heads: ["??", "((("],
        tails: ["!!", ")))"],
      }),
      "",
      "29.03"
    );
    t.end();
  }
);

tap.test(
  "30 - removing empty head/tail chunks from around the text #1",
  (t) => {
    t.same(
      rem("((())) a ((()))", {
        heads: ["??", "((("],
        tails: ["!!", ")))"],
      }),
      "a",
      "30.01"
    );
    t.same(
      rem("((())) a ((())) b ((()))", {
        heads: ["??", "((("],
        tails: ["!!", ")))"],
      }),
      "a ((())) b",
      "30.02"
    );
    t.same(
      rem("((()))((())) a ((()))((()))", {
        heads: ["??", "((("],
        tails: ["!!", ")))"],
      }),
      "a",
      "30.03"
    );
    t.same(
      rem("a((()))((()))b((()))((()))((()))", {
        heads: ["??", "((("],
        tails: ["!!", ")))"],
      }),
      "a((()))((()))b",
      "30.04"
    );
    t.same(
      rem(
        " ((( )))     (((    )))     (((  )))    a((()))((()))b     (((   )))  (((  )))     (((     )))  ",
        {
          heads: ["??", "((("],
          tails: ["!!", ")))"],
        }
      ),
      "a((()))((()))b",
      "30.05"
    );
    t.same(
      rem("((()))((()))((()))a((()))((()))b((()))((()))((()))", {
        heads: ["??", "((("],
        tails: ["!!", ")))"],
      }),
      "a((()))((()))b",
      "30.06"
    );
    t.end();
  }
);

tap.test(
  "31 - removing empty head/tail chunks from around the text #2 (touches end)",
  (t) => {
    t.same(
      rem("((())) some (((text))) ((()))", {
        heads: ["??", "((("],
        tails: ["!!", ")))"],
      }),
      "some (((text)))",
      "31"
    );
    t.end();
  }
);

tap.test(
  "32 - removing empty head/tail chunks from around the text #3 (touches beginning)",
  (t) => {
    t.same(
      rem("((())) (((some))) text ((()))", {
        heads: ["??", "((("],
        tails: ["!!", ")))"],
      }),
      "(((some))) text",
      "32.01"
    );
    t.same(
      rem("\t((())) (((some))) text ((()))", {
        heads: ["??", "((("],
        tails: ["!!", ")))"],
      }),
      "(((some))) text",
      "32.02 - tab would not get trimmed, but since it was standing in the way of empty heads/tails, it was removed"
    );
    t.end();
  }
);

tap.test("33 - leading letter ruins the removal from the front", (t) => {
  t.same(
    rem("\ta ((())) (((some))) text ((()))", {
      heads: ["??", "((("],
      tails: ["!!", ")))"],
    }),
    "\ta ((())) (((some))) text",
    '33.01 - because of the "a" the removal is terminated until trailing chunks met'
  );
  t.same(
    rem(" a ((())) (((some))) text ((()))", {
      heads: ["??", "((("],
      tails: ["!!", ")))"],
    }),
    "a ((())) (((some))) text",
    "33.02"
  );
  t.end();
});

tap.test("34 - leading line break", (t) => {
  t.same(
    rem("aaa\n", {
      heads: ["??", "((("],
      tails: ["!!", ")))"],
    }),
    "aaa\n",
    "34"
  );
  t.end();
});

tap.test("35 - leading line break", (t) => {
  t.same(
    rem("{{ items[0].prepayPin }}", {
      heads: ["{{"],
      tails: ["}}"],
    }),
    "{{ items[0].prepayPin }}",
    "35"
  );
  t.end();
});
