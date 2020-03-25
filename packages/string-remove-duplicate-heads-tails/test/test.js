const t = require("tap");
const rem = require("../dist/string-remove-duplicate-heads-tails.cjs");

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

t.test("01.01 - wrong/missing input = throw", (t) => {
  t.throws(() => {
    rem();
  }, /THROW_ID_01/g);
  t.doesNotThrow(() => {
    rem(1);
  });
  t.end();
});

t.test("01.02 - wrong opts", (t) => {
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

t.test("01.03 - empty input string", (t) => {
  t.same(
    rem("", {
      heads: "{{",
      tails: "}}",
    }),
    "",
    "01.03.01"
  );
  t.same(rem(""), "", "01.03.02");
  t.end();
});

t.test("01.04 - none of heads or tails found", (t) => {
  t.same(
    rem("aaa {{", {
      heads: "%%",
      tails: "__",
    }),
    "aaa {{",
    "01.04.01"
  );
  t.end();
});

// -----------------------------------------------------------------------------
// 02. normal use
// -----------------------------------------------------------------------------

t.test("02.01 - trims wrapped heads and tails", (t) => {
  t.same(
    rem("{{ hi {{ name }}! }}", {
      heads: "{{",
      tails: "}}",
    }),
    "hi {{ name }}!",
    "02.01.01"
  );
  t.same(
    rem("{{ hi }} name {{! }}", {
      heads: "{{",
      tails: "}}",
    }),
    "{{ hi }} name {{! }}",
    "02.01.02"
  );
  t.end();
});

t.test(
  "02.02 - trims wrapped heads and tails, with space inside heads/tails",
  (t) => {
    t.same(
      rem("{{ Hi {{ first_name }}! }}", {
        heads: "{{ ",
        tails: " }}",
      }),
      "Hi {{ first_name }}!",
      "02.02 - heads and tails with spaces"
    );
    t.end();
  }
);

t.test(
  "02.03 - trimmed heads and tails in the source still get caught",
  (t) => {
    t.same(
      rem("{{Hi {{ first_name }}!}}", {
        heads: "{{ ",
        tails: " }}",
      }),
      "Hi {{ first_name }}!",
      "02.03 - with spaces, and those spaces are not on str"
    );
    t.end();
  }
);

t.test(
  "02.04 - excessive whitespace in opts heads/tails doesn't matter",
  (t) => {
    t.same(
      rem("{{ Hi {{ first_name }}! }}", {
        heads: "   {{     ",
        tails: "    }}       ",
      }),
      "Hi {{ first_name }}!",
      "02.04 - excessive spaces"
    );
    t.end();
  }
);

t.test("02.05 - single curly brace heads/tails", (t) => {
  t.same(
    rem("{ Hi { first_name }! }", {
      heads: "{",
      tails: "}",
    }),
    "Hi { first_name }!",
    "02.05"
  );
  t.end();
});

t.test("02.06 - custom heads and tails, whitespace both sides", (t) => {
  t.same(
    rem("{Hi { first_name }!}", {
      heads: " { ",
      tails: " } ",
    }),
    "Hi { first_name }!",
    "02.06"
  );
  t.end();
});

t.test("02.07 - ends with tails, doesn't start with heads", (t) => {
  t.same(
    rem("Hi {{ first_name }}", {
      heads: ["%%-", "{{"],
      tails: ["-%%", "}}"],
    }),
    "Hi {{ first_name }}",
    "02.07"
  );
  t.end();
});

t.test("02.08 - starts with heads, doesn't end with tails", (t) => {
  t.same(
    rem("  {{ first_name }}!  ", {
      heads: ["%%-", "{{"],
      tails: ["-%%", "}}"],
    }),
    "{{ first_name }}!",
    "02.08"
  );
  t.end();
});

t.test("02.09 - properly wrapped, heads/tails in array, matched", (t) => {
  t.same(
    rem("  {{ first_name }}  ", {
      heads: ["%%-", "{{"],
      tails: ["-%%", "}}"],
    }),
    "{{ first_name }}",
    "02.09"
  );
  t.end();
});

t.test("02.10 - starts with heads, doesn't end with tails", (t) => {
  t.same(
    rem("   {{ a }}{{ b }}   ", {
      heads: ["%%-", "{{"],
      tails: ["-%%", "}}"],
    }),
    "{{ a }}{{ b }}",
    "02.10"
  );
  t.end();
});

t.test("02.11 - unclosed heads", (t) => {
  t.same(
    rem("zzz {{", {
      heads: ["%%-", "{{"],
      tails: ["-%%", "}}"],
    }),
    "zzz {{",
    "02.11"
  );
  t.end();
});

t.test("02.12 - unclosed tails", (t) => {
  t.same(
    rem("zzz }}", {
      heads: ["%%-", "{{"],
      tails: ["-%%", "}}"],
    }),
    "zzz }}",
    "02.12"
  );
  t.end();
});

t.test("02.13 - ends with empty variable", (t) => {
  t.same(
    rem("zzz {{}}", {
      heads: ["%%-", "{{"],
      tails: ["-%%", "}}"],
    }),
    "zzz",
    "02.13"
  );
  t.end();
});

t.test("02.14 - empty variable with text both sides", (t) => {
  t.same(
    rem("zzz {{}} yyy", {
      heads: ["%%-", "{{"],
      tails: ["-%%", "}}"],
    }),
    "zzz {{}} yyy",
    "02.14"
  );
  t.end();
});

t.test("02.15 - heads/tails in opposite order", (t) => {
  t.same(
    rem(" zzz }}{{ yyy", {
      heads: ["%%-", "{{"],
      tails: ["-%%", "}}"],
    }),
    "zzz }}{{ yyy",
    "02.15"
  );
  t.end();
});

t.test("02.16 - tails with text on both sides", (t) => {
  t.same(
    rem("zzz }} yyy", {
      heads: ["%%-", "{{"],
      tails: ["-%%", "}}"],
    }),
    "zzz }} yyy",
    "02.16"
  );
  t.end();
});

t.test("02.17 - heads with text on both sides", (t) => {
  t.same(
    rem("zzz {{ yyy", {
      heads: ["%%-", "{{"],
      tails: ["-%%", "}}"],
    }),
    "zzz {{ yyy",
    "02.17"
  );
  t.end();
});

t.test("02.18 - multiple heads, single tails", (t) => {
  t.same(
    rem("{{{{ first_name }}!", {
      heads: ["%%-", "{{"],
      tails: ["-%%", "}}"],
    }),
    "{{{{ first_name }}!",
    "02.18"
  );
  t.end();
});

t.test("02.19 - one set of custom heads and tails, single char string", (t) => {
  t.same(
    rem("??z!!", {
      heads: "??",
      tails: "!!",
    }),
    "??z!!",
    "02.19.01"
  );
  t.same(
    rem("??!! ??z!!", {
      heads: "??",
      tails: "!!",
    }),
    "??z!!",
    "02.19.02"
  );
  t.same(
    rem("??z!! ??!!", {
      heads: "??",
      tails: "!!",
    }),
    "??z!!",
    "02.19.03"
  );
  t.same(
    rem("??!! ??z!! ??!!", {
      heads: "??",
      tails: "!!",
    }),
    "??z!!",
    "02.19.04"
  );
  t.same(
    rem("\t??z!!", {
      heads: "??",
      tails: "!!",
    }),
    "??z!!",
    "02.19.05"
  );
  t.same(
    rem("??!!\t??z!!", {
      heads: "??",
      tails: "!!",
    }),
    "??z!!",
    "02.19.06"
  );
  t.same(
    rem("??z!! ??!! ", {
      heads: "??",
      tails: "!!",
    }),
    "??z!!",
    "02.19.07"
  );
  t.same(
    rem("\t??!! ??z!! ??!!", {
      heads: "??",
      tails: "!!",
    }),
    "??z!!",
    "02.19.08"
  );
  t.same(
    rem("{{ z }}", {
      heads: "??",
      tails: "!!",
    }),
    "{{ z }}",
    "02.19.09 - checking are defaults not leaking #1"
  );
  t.same(
    rem("{{{{ z }}}}", {
      heads: "??",
      tails: "!!",
    }),
    "{{{{ z }}}}",
    "02.19.10 - checking are defaults not leaking #2"
  );
  t.end();
});

t.test(
  "02.20 - two sets of custom heads and tails, single char string",
  (t) => {
    // recursively:
    t.same(
      rem("????z!!!!", {
        heads: "??",
        tails: "!!",
      }),
      "??z!!",
      "02.20"
    );
    t.end();
  }
);

t.test(
  "02.21 - words with space, single set of custom heads and tails",
  (t) => {
    t.same(
      rem("??tralalala!lalala!!", {
        heads: "??",
        tails: "!!",
      }),
      "??tralalala!lalala!!",
      "02.21"
    );
    t.end();
  }
);

t.test(
  "02.22 - double wrapped with custom heads and tails, with whitespace",
  (t) => {
    // recursively with spaces
    t.same(
      rem("?? ?? x y !! !!", {
        heads: "??",
        tails: "!!",
      }),
      "?? x y !!",
      "02.22"
    );
    t.end();
  }
);

t.test("02.23 - mixed sets of heads and tails #1", (t) => {
  // peels off two outer layers but doesn't touch separate var wrappers
  t.same(
    rem("?? ((( ?? x !! ?? y !! ))) !!", {
      heads: ["??", "((("],
      tails: ["!!", ")))"],
    }),
    "?? x !! ?? y !!",
    "02.23.01 - input with spaces"
  );
  t.same(
    rem("?? ((( ?? x !! ?? y !! ))) !!", {
      heads: ["?? ", "((( "],
      tails: [" !!", " )))"],
    }),
    "?? x !! ?? y !!",
    "02.23.02 - both input and head/tail references with spaces"
  );
  t.same(
    rem("??(((??x!!??y!!)))!!", {
      heads: ["?? ", "((( "],
      tails: [" !!", " )))"],
    }),
    "??x!!??y!!",
    "02.23.03 - both input and head/tail references with spaces"
  );
  t.end();
});

t.test("02.24 - mixed sets of heads and tails #2", (t) => {
  t.same(
    rem("??(((??tralalala!!(((lalala))))))!!", {
      heads: ["??", "((("],
      tails: ["!!", ")))"],
    }),
    "??tralalala!!(((lalala)))",
    "02.24"
  );
  t.end();
});

t.test(
  "02.25 - blank heads and tails within second level being removed",
  (t) => {
    t.same(
      rem("??((())) ((( ?? a !! ((( b ))) )))!!", {
        heads: ["??", "((("],
        tails: ["!!", ")))"],
      }),
      "?? a !! ((( b )))",
      "02.25.01"
    );
    t.same(
      rem("?? (((  \n  )))   \t\t\t ((( ?? a !! ((( b )))\n ))) !!", {
        heads: ["??", "((("],
        tails: ["!!", ")))"],
      }),
      "?? a !! ((( b )))",
      "02.25.02"
    );
    t.same(
      rem("?? (((  \n  )))   \t\t\t ((( ??  !! (((  )))\n ))) !!", {
        heads: ["??", "((("],
        tails: ["!!", ")))"],
      }),
      "",
      "02.25.03"
    );
    t.end();
  }
);

t.test(
  "02.26 - removing empty head/tail chunks from around the text #1",
  (t) => {
    t.same(
      rem("((())) a ((()))", {
        heads: ["??", "((("],
        tails: ["!!", ")))"],
      }),
      "a",
      "02.26.01"
    );
    t.same(
      rem("((())) a ((())) b ((()))", {
        heads: ["??", "((("],
        tails: ["!!", ")))"],
      }),
      "a ((())) b",
      "02.26.02"
    );
    t.same(
      rem("((()))((())) a ((()))((()))", {
        heads: ["??", "((("],
        tails: ["!!", ")))"],
      }),
      "a",
      "02.26.03"
    );
    t.same(
      rem("a((()))((()))b((()))((()))((()))", {
        heads: ["??", "((("],
        tails: ["!!", ")))"],
      }),
      "a((()))((()))b",
      "02.26.04"
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
      "02.26.05"
    );
    t.same(
      rem("((()))((()))((()))a((()))((()))b((()))((()))((()))", {
        heads: ["??", "((("],
        tails: ["!!", ")))"],
      }),
      "a((()))((()))b",
      "02.26.06"
    );
    t.end();
  }
);

t.test(
  "02.27 - removing empty head/tail chunks from around the text #2 (touches end)",
  (t) => {
    t.same(
      rem("((())) some (((text))) ((()))", {
        heads: ["??", "((("],
        tails: ["!!", ")))"],
      }),
      "some (((text)))",
      "02.27"
    );
    t.end();
  }
);

t.test(
  "02.28 - removing empty head/tail chunks from around the text #3 (touches beginning)",
  (t) => {
    t.same(
      rem("((())) (((some))) text ((()))", {
        heads: ["??", "((("],
        tails: ["!!", ")))"],
      }),
      "(((some))) text",
      "02.28.01"
    );
    t.same(
      rem("\t((())) (((some))) text ((()))", {
        heads: ["??", "((("],
        tails: ["!!", ")))"],
      }),
      "(((some))) text",
      "02.28.02 - tab would not get trimmed, but since it was standing in the way of empty heads/tails, it was removed"
    );
    t.end();
  }
);

t.test("02.29 - leading letter ruins the removal from the front", (t) => {
  t.same(
    rem("\ta ((())) (((some))) text ((()))", {
      heads: ["??", "((("],
      tails: ["!!", ")))"],
    }),
    "\ta ((())) (((some))) text",
    '02.29 - because of the "a" the removal is terminated until trailing chunks met'
  );
  t.same(
    rem(" a ((())) (((some))) text ((()))", {
      heads: ["??", "((("],
      tails: ["!!", ")))"],
    }),
    "a ((())) (((some))) text",
    "02.29.02"
  );
  t.end();
});

t.test("02.30 - leading line break", (t) => {
  t.same(
    rem("aaa\n", {
      heads: ["??", "((("],
      tails: ["!!", ")))"],
    }),
    "aaa\n",
    "02.30"
  );
  t.end();
});

t.test("02.31 - leading line break", (t) => {
  t.same(
    rem("{{ items[0].prepayPin }}", {
      heads: ["{{"],
      tails: ["}}"],
    }),
    "{{ items[0].prepayPin }}",
    "02.31"
  );
  t.end();
});
