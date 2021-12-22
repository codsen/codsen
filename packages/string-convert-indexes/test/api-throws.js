import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import {
  nativeToUnicode,
  unicodeToNative,
} from "../dist/string-convert-indexes.esm.js";

// THROW_ID_01 - not a string or empty string in 1st input arg
// -----------------------------------------------------------------------------

test("01 - no 1st arg - unicodeToNative()", () => {
  throws(() => {
    unicodeToNative();
  }, /THROW_ID_01/g);
  throws(() => {
    unicodeToNative(undefined);
  }, /THROW_ID_01/g);
});

test("02 - no 1st arg - nativeToUnicode()", () => {
  throws(() => {
    nativeToUnicode();
  }, /THROW_ID_01/g);
  throws(() => {
    nativeToUnicode(undefined);
  }, /THROW_ID_01/g);
});

test("03 - empty string - unicodeToNative()", () => {
  throws(() => {
    unicodeToNative("", 0);
  }, /THROW_ID_01/g);
});

test("04 - empty string - nativeToUnicode()", () => {
  throws(() => {
    nativeToUnicode("", 0);
  }, /THROW_ID_01/g);
});

// THROW_ID_02 - no AST, indexes is wrong
// -----------------------------------------------------------------------------

test("05 - indexes, 2nd arg. is wrong - nativeToUnicode()", () => {
  throws(() => {
    nativeToUnicode("abcde", 1.2);
  }, /THROW_ID_02/g);
  throws(() => {
    nativeToUnicode("abcde", -2);
  }, /THROW_ID_02/g);
  throws(() => {
    nativeToUnicode("abcde", "1.2");
  }, /THROW_ID_02/g);
});

test("06 - indexes, 2nd arg. is wrong - unicodeToNative()", () => {
  throws(() => {
    unicodeToNative("abcde", 1.2);
  }, /THROW_ID_02/g);
  throws(() => {
    unicodeToNative("abcde", -2);
  }, /THROW_ID_02/g);
  throws(() => {
    unicodeToNative("abcde", "1.2");
  }, /THROW_ID_02/g);
});

test("07 - indexes, 2nd arg. is wrong - nativeToUnicode()", () => {
  throws(() => {
    nativeToUnicode("abcde", -2);
  }, /THROW_ID_02/g);
  throws(() => {
    nativeToUnicode("abcde", "-2");
  }, /THROW_ID_02/g);
});

test("08 - indexes, 2nd arg. is wrong - unicodeToNative()", () => {
  throws(() => {
    unicodeToNative("abcde", -2);
  }, /THROW_ID_02/g);
  throws(() => {
    unicodeToNative("abcde", "-2");
  }, /THROW_ID_02/g);
});

// THROW_ID_03 - AST, unicodeToNative() encounters a bad value
// -----------------------------------------------------------------------------

test("09 - real number in AST - unicodeToNative()", () => {
  throws(() => {
    unicodeToNative("abcdef", [[1.2]]);
  }, /THROW_ID_03/g);
  throws(() => {
    unicodeToNative("abcdef", { a: 1.2 });
  }, /THROW_ID_03/g);
});

// THROW_ID_04 - AST, nativeToUnicode() encounters a bad value
// -----------------------------------------------------------------------------

test("10 - real number in AST - unicodeToNative()", () => {
  throws(() => {
    nativeToUnicode("abcdef", [[1.2]]);
  }, /THROW_ID_04/g);
  throws(() => {
    nativeToUnicode("abcdef", { a: 1.2 });
  }, /THROW_ID_04/g);
});

// THROW_ID_05 - oneNativeToUnicode() length exceeded
// -----------------------------------------------------------------------------

test("11 - oneNativeToUnicode() length exceeded", () => {
  throws(() => {
    nativeToUnicode("abcdef", 6);
  }, /THROW_ID_05/g);
  throws(() => {
    nativeToUnicode("abcdef", [[6]]);
  }, /THROW_ID_05/g);
  throws(() => {
    nativeToUnicode("abcdef", { a: 6 });
  }, /THROW_ID_05/g);

  throws(() => {
    nativeToUnicode("abcdef", 99);
  }, /THROW_ID_05/g);
  throws(() => {
    nativeToUnicode("abcdef", [[99]]);
  }, /THROW_ID_05/g);
  throws(() => {
    nativeToUnicode("abcdef", { a: 99 });
  }, /THROW_ID_05/g);
});

// THROW_ID_06 - oneUnicodeToNative() length exceeded
// -----------------------------------------------------------------------------

test("12 - oneUnicodeToNative() length exceeded", () => {
  throws(() => {
    unicodeToNative("abcd👍", 5);
  }, /THROW_ID_06/g);
  throws(() => {
    unicodeToNative("abcd👍", [[5]]);
  }, /THROW_ID_06/g);
  throws(() => {
    unicodeToNative("abcd👍", { a: 5 });
  }, /THROW_ID_06/g);

  throws(() => {
    unicodeToNative("abcd👍", 99);
  }, /THROW_ID_06/g);
  throws(() => {
    unicodeToNative("abcd👍", [[99]]);
  }, /THROW_ID_06/g);
  throws(() => {
    unicodeToNative("abcd👍", { a: 99 });
  }, /THROW_ID_06/g);
});

// THROW_ID_07 - not a string or empty string in 1st input arg
// -----------------------------------------------------------------------------

test("13 - 2nd arg, 'indexes' type is wrong", () => {
  function testFunction() {
    return null;
  }

  throws(() => {
    unicodeToNative("abcdef", testFunction);
  }, /THROW_ID_07/g);
  throws(() => {
    nativeToUnicode("abcdef", testFunction);
  }, /THROW_ID_07/g);

  throws(() => {
    unicodeToNative("abcdef", null);
  }, /THROW_ID_07/g);
  throws(() => {
    nativeToUnicode("abcdef", null);
  }, /THROW_ID_07/g);
});

test.run();
