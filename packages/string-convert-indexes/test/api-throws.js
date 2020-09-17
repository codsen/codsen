import tap from "tap";
import {
  nativeToUnicode,
  unicodeToNative,
} from "../dist/string-convert-indexes.esm";

// THROW_ID_01 - not a string or empty string in 1st input arg
// -----------------------------------------------------------------------------

tap.test("01 - no 1st arg - unicodeToNative()", (t) => {
  t.throws(() => {
    unicodeToNative();
  }, /THROW_ID_01/g);
  t.throws(() => {
    unicodeToNative(undefined);
  }, /THROW_ID_01/g);
  t.end();
});

tap.test("02 - no 1st arg - nativeToUnicode()", (t) => {
  t.throws(() => {
    nativeToUnicode();
  }, /THROW_ID_01/g);
  t.throws(() => {
    nativeToUnicode(undefined);
  }, /THROW_ID_01/g);
  t.end();
});

tap.test("03 - empty string - unicodeToNative()", (t) => {
  t.throws(() => {
    unicodeToNative("", 0);
  }, /THROW_ID_01/g);
  t.end();
});

tap.test("04 - empty string - nativeToUnicode()", (t) => {
  t.throws(() => {
    nativeToUnicode("", 0);
  }, /THROW_ID_01/g);
  t.end();
});

// THROW_ID_02 - no AST, indexes is wrong
// -----------------------------------------------------------------------------

tap.test("05 - indexes, 2nd arg. is wrong - nativeToUnicode()", (t) => {
  t.throws(() => {
    nativeToUnicode("abcde", 1.2);
  }, /THROW_ID_02/g);
  t.throws(() => {
    nativeToUnicode("abcde", -2);
  }, /THROW_ID_02/g);
  t.throws(() => {
    nativeToUnicode("abcde", "1.2");
  }, /THROW_ID_02/g);
  t.end();
});

tap.test("06 - indexes, 2nd arg. is wrong - unicodeToNative()", (t) => {
  t.throws(() => {
    unicodeToNative("abcde", 1.2);
  }, /THROW_ID_02/g);
  t.throws(() => {
    unicodeToNative("abcde", -2);
  }, /THROW_ID_02/g);
  t.throws(() => {
    unicodeToNative("abcde", "1.2");
  }, /THROW_ID_02/g);
  t.end();
});

tap.test("07 - indexes, 2nd arg. is wrong - nativeToUnicode()", (t) => {
  t.throws(() => {
    nativeToUnicode("abcde", -2);
  }, /THROW_ID_02/g);
  t.throws(() => {
    nativeToUnicode("abcde", "-2");
  }, /THROW_ID_02/g);
  t.end();
});

tap.test("08 - indexes, 2nd arg. is wrong - unicodeToNative()", (t) => {
  t.throws(() => {
    unicodeToNative("abcde", -2);
  }, /THROW_ID_02/g);
  t.throws(() => {
    unicodeToNative("abcde", "-2");
  }, /THROW_ID_02/g);
  t.end();
});

// THROW_ID_03 - AST, unicodeToNative() encounters a bad value
// -----------------------------------------------------------------------------

tap.test("09 - real number in AST - unicodeToNative()", (t) => {
  t.throws(() => {
    unicodeToNative("abcdef", [[1.2]]);
  }, /THROW_ID_03/g);
  t.throws(() => {
    unicodeToNative("abcdef", { a: 1.2 });
  }, /THROW_ID_03/g);
  t.end();
});

// THROW_ID_04 - AST, nativeToUnicode() encounters a bad value
// -----------------------------------------------------------------------------

tap.test("10 - real number in AST - unicodeToNative()", (t) => {
  t.throws(() => {
    nativeToUnicode("abcdef", [[1.2]]);
  }, /THROW_ID_04/g);
  t.throws(() => {
    nativeToUnicode("abcdef", { a: 1.2 });
  }, /THROW_ID_04/g);
  t.end();
});

// THROW_ID_05 - oneNativeToUnicode() length exceeded
// -----------------------------------------------------------------------------

tap.test("11 - oneNativeToUnicode() length exceeded", (t) => {
  t.throws(() => {
    nativeToUnicode("abcdef", 6);
  }, /THROW_ID_05/g);
  t.throws(() => {
    nativeToUnicode("abcdef", [[6]]);
  }, /THROW_ID_05/g);
  t.throws(() => {
    nativeToUnicode("abcdef", { a: 6 });
  }, /THROW_ID_05/g);

  t.throws(() => {
    nativeToUnicode("abcdef", 99);
  }, /THROW_ID_05/g);
  t.throws(() => {
    nativeToUnicode("abcdef", [[99]]);
  }, /THROW_ID_05/g);
  t.throws(() => {
    nativeToUnicode("abcdef", { a: 99 });
  }, /THROW_ID_05/g);
  t.end();
});

// THROW_ID_06 - oneUnicodeToNative() length exceeded
// -----------------------------------------------------------------------------

tap.test("12 - oneUnicodeToNative() length exceeded", (t) => {
  t.throws(() => {
    unicodeToNative("abcd👍", 5);
  }, /THROW_ID_06/g);
  t.throws(() => {
    unicodeToNative("abcd👍", [[5]]);
  }, /THROW_ID_06/g);
  t.throws(() => {
    unicodeToNative("abcd👍", { a: 5 });
  }, /THROW_ID_06/g);

  t.throws(() => {
    unicodeToNative("abcd👍", 99);
  }, /THROW_ID_06/g);
  t.throws(() => {
    unicodeToNative("abcd👍", [[99]]);
  }, /THROW_ID_06/g);
  t.throws(() => {
    unicodeToNative("abcd👍", { a: 99 });
  }, /THROW_ID_06/g);
  t.end();
});

// THROW_ID_07 - not a string or empty string in 1st input arg
// -----------------------------------------------------------------------------

tap.test("13 - 2nd arg, 'indexes' type is wrong", (t) => {
  function testFunction() {
    return null;
  }

  t.throws(() => {
    unicodeToNative("abcdef", testFunction);
  }, /THROW_ID_07/g);
  t.throws(() => {
    nativeToUnicode("abcdef", testFunction);
  }, /THROW_ID_07/g);

  t.throws(() => {
    unicodeToNative("abcdef", null);
  }, /THROW_ID_07/g);
  t.throws(() => {
    nativeToUnicode("abcdef", null);
  }, /THROW_ID_07/g);

  t.end();
});
