import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { remDup as rem } from "../dist/string-remove-duplicate-heads-tails.esm.js";

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

test("01 - wrong/missing input = throw", () => {
  throws(() => {
    rem();
  }, /THROW_ID_01/g);
  not.throws(() => {
    rem(1);
  }, "01.02");
});

test("02 - wrong opts", () => {
  throws(() => {
    rem("a", "a");
  }, /THROW_ID_03/g);
  throws(() => {
    rem("a", 1);
  }, /THROW_ID_03/g);
  throws(() => {
    rem("a {{}} b", {
      heads: ["{{", 1],
      tails: ["}}"],
    });
  }, /THROW_ID_04/g);
  throws(() => {
    rem("a {{}} b", {
      heads: ["{{"],
      tails: ["}}", 1],
    });
  }, /THROW_ID_05/g);
});

test("03 - empty input string", () => {
  equal(
    rem("", {
      heads: "{{",
      tails: "}}",
    }),
    "",
    "03.01"
  );
  equal(rem(""), "", "03.02");
});

test("04 - none of heads or tails found", () => {
  equal(
    rem("aaa {{", {
      heads: "%%",
      tails: "__",
    }),
    "aaa {{",
    "04.01"
  );
});

// -----------------------------------------------------------------------------
// 02. normal use
// -----------------------------------------------------------------------------

test("05 - trims wrapped heads and tails", () => {
  equal(
    rem("{{ hi {{ name }}! }}", {
      heads: "{{",
      tails: "}}",
    }),
    "hi {{ name }}!",
    "05.01"
  );
  equal(
    rem("{{ hi }} name {{! }}", {
      heads: "{{",
      tails: "}}",
    }),
    "{{ hi }} name {{! }}",
    "05.02"
  );
});

test("06 - trims wrapped heads and tails, with space inside heads/tails", () => {
  equal(
    rem("{{ Hi {{ first_name }}! }}", {
      heads: "{{ ",
      tails: " }}",
    }),
    "Hi {{ first_name }}!",
    "06.01 - heads and tails with spaces"
  );
});

test("07 - trimmed heads and tails in the source still get caught", () => {
  equal(
    rem("{{Hi {{ first_name }}!}}", {
      heads: "{{ ",
      tails: " }}",
    }),
    "Hi {{ first_name }}!",
    "07.01 - with spaces, and those spaces are not on str"
  );
});

test("08 - excessive whitespace in opts heads/tails doesn't matter", () => {
  equal(
    rem("{{ Hi {{ first_name }}! }}", {
      heads: "   {{     ",
      tails: "    }}       ",
    }),
    "Hi {{ first_name }}!",
    "08.01 - excessive spaces"
  );
});

test("09 - single curly brace heads/tails", () => {
  equal(
    rem("{ Hi { first_name }! }", {
      heads: "{",
      tails: "}",
    }),
    "Hi { first_name }!",
    "09.01"
  );
});

test("10 - custom heads and tails, whitespace both sides", () => {
  equal(
    rem("{Hi { first_name }!}", {
      heads: " { ",
      tails: " } ",
    }),
    "Hi { first_name }!",
    "10.01"
  );
});

test("11 - ends with tails, doesn't start with heads", () => {
  equal(
    rem("Hi {{ first_name }}", {
      heads: ["%%-", "{{"],
      tails: ["-%%", "}}"],
    }),
    "Hi {{ first_name }}",
    "11.01"
  );
});

test("12 - starts with heads, doesn't end with tails", () => {
  equal(
    rem("  {{ first_name }}!  ", {
      heads: ["%%-", "{{"],
      tails: ["-%%", "}}"],
    }),
    "{{ first_name }}!",
    "12.01"
  );
});

test("13 - properly wrapped, heads/tails in array, matched", () => {
  equal(
    rem("  {{ first_name }}  ", {
      heads: ["%%-", "{{"],
      tails: ["-%%", "}}"],
    }),
    "{{ first_name }}",
    "13.01"
  );
});

test("14 - starts with heads, doesn't end with tails", () => {
  equal(
    rem("   {{ a }}{{ b }}   ", {
      heads: ["%%-", "{{"],
      tails: ["-%%", "}}"],
    }),
    "{{ a }}{{ b }}",
    "14.01"
  );
});

test("15 - unclosed heads", () => {
  equal(
    rem("zzz {{", {
      heads: ["%%-", "{{"],
      tails: ["-%%", "}}"],
    }),
    "zzz {{",
    "15.01"
  );
});

test("16 - unclosed tails", () => {
  equal(
    rem("zzz }}", {
      heads: ["%%-", "{{"],
      tails: ["-%%", "}}"],
    }),
    "zzz }}",
    "16.01"
  );
});

test("17 - ends with empty variable", () => {
  equal(
    rem("zzz {{}}", {
      heads: ["%%-", "{{"],
      tails: ["-%%", "}}"],
    }),
    "zzz",
    "17.01"
  );
});

test("18 - empty variable with text both sides", () => {
  equal(
    rem("zzz {{}} yyy", {
      heads: ["%%-", "{{"],
      tails: ["-%%", "}}"],
    }),
    "zzz {{}} yyy",
    "18.01"
  );
});

test("19 - heads/tails in opposite order", () => {
  equal(
    rem(" zzz }}{{ yyy", {
      heads: ["%%-", "{{"],
      tails: ["-%%", "}}"],
    }),
    "zzz }}{{ yyy",
    "19.01"
  );
});

test("20 - tails with text on both sides", () => {
  equal(
    rem("zzz }} yyy", {
      heads: ["%%-", "{{"],
      tails: ["-%%", "}}"],
    }),
    "zzz }} yyy",
    "20.01"
  );
});

test("21 - heads with text on both sides", () => {
  equal(
    rem("zzz {{ yyy", {
      heads: ["%%-", "{{"],
      tails: ["-%%", "}}"],
    }),
    "zzz {{ yyy",
    "21.01"
  );
});

test("22 - multiple heads, single tails", () => {
  equal(
    rem("{{{{ first_name }}!", {
      heads: ["%%-", "{{"],
      tails: ["-%%", "}}"],
    }),
    "{{{{ first_name }}!",
    "22.01"
  );
});

test("23 - one set of custom heads and tails, single char string", () => {
  equal(
    rem("??z!!", {
      heads: "??",
      tails: "!!",
    }),
    "??z!!",
    "23.01"
  );
  equal(
    rem("??!! ??z!!", {
      heads: "??",
      tails: "!!",
    }),
    "??z!!",
    "23.02"
  );
  equal(
    rem("??z!! ??!!", {
      heads: "??",
      tails: "!!",
    }),
    "??z!!",
    "23.03"
  );
  equal(
    rem("??!! ??z!! ??!!", {
      heads: "??",
      tails: "!!",
    }),
    "??z!!",
    "23.04"
  );
  equal(
    rem("\t??z!!", {
      heads: "??",
      tails: "!!",
    }),
    "??z!!",
    "23.05"
  );
  equal(
    rem("??!!\t??z!!", {
      heads: "??",
      tails: "!!",
    }),
    "??z!!",
    "23.06"
  );
  equal(
    rem("??z!! ??!! ", {
      heads: "??",
      tails: "!!",
    }),
    "??z!!",
    "23.07"
  );
  equal(
    rem("\t??!! ??z!! ??!!", {
      heads: "??",
      tails: "!!",
    }),
    "??z!!",
    "23.08"
  );
  equal(
    rem("{{ z }}", {
      heads: "??",
      tails: "!!",
    }),
    "{{ z }}",
    "23.09 - checking are defaults not leaking #1"
  );
  equal(
    rem("{{{{ z }}}}", {
      heads: "??",
      tails: "!!",
    }),
    "{{{{ z }}}}",
    "23.10 - checking are defaults not leaking #2"
  );
});

test("24 - two sets of custom heads and tails, single char string", () => {
  // recursively:
  equal(
    rem("????z!!!!", {
      heads: "??",
      tails: "!!",
    }),
    "??z!!",
    "24.01"
  );
});

test("25 - words with space, single set of custom heads and tails", () => {
  equal(
    rem("??tralalala!lalala!!", {
      heads: "??",
      tails: "!!",
    }),
    "??tralalala!lalala!!",
    "25.01"
  );
});

test("26 - double wrapped with custom heads and tails, with whitespace", () => {
  // recursively with spaces
  equal(
    rem("?? ?? x y !! !!", {
      heads: "??",
      tails: "!!",
    }),
    "?? x y !!",
    "26.01"
  );
});

test("27 - mixed sets of heads and tails #1", () => {
  // peels off two outer layers but doesn't touch separate var wrappers
  equal(
    rem("?? ((( ?? x !! ?? y !! ))) !!", {
      heads: ["??", "((("],
      tails: ["!!", ")))"],
    }),
    "?? x !! ?? y !!",
    "27.01 - input with spaces"
  );
  equal(
    rem("?? ((( ?? x !! ?? y !! ))) !!", {
      heads: ["?? ", "((( "],
      tails: [" !!", " )))"],
    }),
    "?? x !! ?? y !!",
    "27.02 - both input and head/tail references with spaces"
  );
  equal(
    rem("??(((??x!!??y!!)))!!", {
      heads: ["?? ", "((( "],
      tails: [" !!", " )))"],
    }),
    "??x!!??y!!",
    "27.03 - both input and head/tail references with spaces"
  );
});

test("28 - mixed sets of heads and tails #2", () => {
  equal(
    rem("??(((??tralalala!!(((lalala))))))!!", {
      heads: ["??", "((("],
      tails: ["!!", ")))"],
    }),
    "??tralalala!!(((lalala)))",
    "28.01"
  );
});

test("29 - blank heads and tails within second level being removed", () => {
  equal(
    rem("??((())) ((( ?? a !! ((( b ))) )))!!", {
      heads: ["??", "((("],
      tails: ["!!", ")))"],
    }),
    "?? a !! ((( b )))",
    "29.01"
  );
  equal(
    rem("?? (((  \n  )))   \t\t\t ((( ?? a !! ((( b )))\n ))) !!", {
      heads: ["??", "((("],
      tails: ["!!", ")))"],
    }),
    "?? a !! ((( b )))",
    "29.02"
  );
  equal(
    rem("?? (((  \n  )))   \t\t\t ((( ??  !! (((  )))\n ))) !!", {
      heads: ["??", "((("],
      tails: ["!!", ")))"],
    }),
    "",
    "29.03"
  );
});

test("30 - removing empty head/tail chunks from around the text #1", () => {
  equal(
    rem("((())) a ((()))", {
      heads: ["??", "((("],
      tails: ["!!", ")))"],
    }),
    "a",
    "30.01"
  );
  equal(
    rem("((())) a ((())) b ((()))", {
      heads: ["??", "((("],
      tails: ["!!", ")))"],
    }),
    "a ((())) b",
    "30.02"
  );
  equal(
    rem("((()))((())) a ((()))((()))", {
      heads: ["??", "((("],
      tails: ["!!", ")))"],
    }),
    "a",
    "30.03"
  );
  equal(
    rem("a((()))((()))b((()))((()))((()))", {
      heads: ["??", "((("],
      tails: ["!!", ")))"],
    }),
    "a((()))((()))b",
    "30.04"
  );
  equal(
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
  equal(
    rem("((()))((()))((()))a((()))((()))b((()))((()))((()))", {
      heads: ["??", "((("],
      tails: ["!!", ")))"],
    }),
    "a((()))((()))b",
    "30.06"
  );
});

test("31 - removing empty head/tail chunks from around the text #2 (touches end)", () => {
  equal(
    rem("((())) some (((text))) ((()))", {
      heads: ["??", "((("],
      tails: ["!!", ")))"],
    }),
    "some (((text)))",
    "31.01"
  );
});

test("32 - removing empty head/tail chunks from around the text #3 (touches beginning)", () => {
  equal(
    rem("((())) (((some))) text ((()))", {
      heads: ["??", "((("],
      tails: ["!!", ")))"],
    }),
    "(((some))) text",
    "32.01"
  );
  equal(
    rem("\t((())) (((some))) text ((()))", {
      heads: ["??", "((("],
      tails: ["!!", ")))"],
    }),
    "(((some))) text",
    "32.02 - tab would not get trimmed, but since it was standing in the way of empty heads/tails, it was removed"
  );
});

test("33 - leading letter ruins the removal from the front", () => {
  equal(
    rem("\ta ((())) (((some))) text ((()))", {
      heads: ["??", "((("],
      tails: ["!!", ")))"],
    }),
    "\ta ((())) (((some))) text",
    '33.01 - because of the "a" the removal is terminated until trailing chunks met'
  );
  equal(
    rem(" a ((())) (((some))) text ((()))", {
      heads: ["??", "((("],
      tails: ["!!", ")))"],
    }),
    "a ((())) (((some))) text",
    "33.02"
  );
});

test("34 - leading line break", () => {
  equal(
    rem("aaa\n", {
      heads: ["??", "((("],
      tails: ["!!", ")))"],
    }),
    "aaa\n",
    "34.01"
  );
});

test("35", () => {
  equal(
    rem("{{ items[0].abc }}", {
      heads: ["{{"],
      tails: ["}}"],
    }),
    "{{ items[0].abc }}",
    "35.01"
  );
});

test("36 - opts are not mutated", () => {
  let opts = {
    heads: "{{",
    tails: "}}",
  };
  // 1. run the function, hopefully it won't mutate the opts,
  // arrayiffying the "heads" and "tails" keys
  equal(rem("{{ hi {{ name }}! }}", opts), "hi {{ name }}!", "36.01");
  // 2. assert that opts keys were not arrayiffied
  equal(
    opts,
    {
      heads: "{{",
      tails: "}}",
    },
    "36.02 - opts were mutated!"
  );
});

test.run();
