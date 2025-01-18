import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import {
  nativeToUnicode,
  unicodeToNative,
} from "../dist/string-convert-indexes.esm.js";

// THROW_ID_01 - not a string or empty string in 1st input arg
// -----------------------------------------------------------------------------

test("01 - no 1st arg - unicodeToNative()", () => {
  throws(
    () => {
      unicodeToNative();
    },
    /THROW_ID_01/g,
    "01.01",
  );
  throws(
    () => {
      unicodeToNative(undefined);
    },
    /THROW_ID_01/g,
    "01.02",
  );
});

test("02 - no 1st arg - nativeToUnicode()", () => {
  throws(
    () => {
      nativeToUnicode();
    },
    /THROW_ID_01/g,
    "02.01",
  );
  throws(
    () => {
      nativeToUnicode(undefined);
    },
    /THROW_ID_01/g,
    "02.02",
  );
});

test("03 - empty string - unicodeToNative()", () => {
  throws(
    () => {
      unicodeToNative("", 0);
    },
    /THROW_ID_01/g,
    "03.01",
  );
});

test("04 - empty string - nativeToUnicode()", () => {
  throws(
    () => {
      nativeToUnicode("", 0);
    },
    /THROW_ID_01/g,
    "04.01",
  );
});

// THROW_ID_02 - no AST, indexes is wrong
// -----------------------------------------------------------------------------

test("05 - indexes, 2nd arg. is wrong - nativeToUnicode()", () => {
  throws(
    () => {
      nativeToUnicode("abcde", 1.2);
    },
    /THROW_ID_02/g,
    "05.01",
  );
  throws(
    () => {
      nativeToUnicode("abcde", -2);
    },
    /THROW_ID_02/g,
    "05.02",
  );
  throws(
    () => {
      nativeToUnicode("abcde", "1.2");
    },
    /THROW_ID_02/g,
    "05.03",
  );
});

test("06 - indexes, 2nd arg. is wrong - unicodeToNative()", () => {
  throws(
    () => {
      unicodeToNative("abcde", 1.2);
    },
    /THROW_ID_02/g,
    "06.01",
  );
  throws(
    () => {
      unicodeToNative("abcde", -2);
    },
    /THROW_ID_02/g,
    "06.02",
  );
  throws(
    () => {
      unicodeToNative("abcde", "1.2");
    },
    /THROW_ID_02/g,
    "06.03",
  );
});

test("07 - indexes, 2nd arg. is wrong - nativeToUnicode()", () => {
  throws(
    () => {
      nativeToUnicode("abcde", -2);
    },
    /THROW_ID_02/g,
    "07.01",
  );
  throws(
    () => {
      nativeToUnicode("abcde", "-2");
    },
    /THROW_ID_02/g,
    "07.02",
  );
});

test("08 - indexes, 2nd arg. is wrong - unicodeToNative()", () => {
  throws(
    () => {
      unicodeToNative("abcde", -2);
    },
    /THROW_ID_02/g,
    "08.01",
  );
  throws(
    () => {
      unicodeToNative("abcde", "-2");
    },
    /THROW_ID_02/g,
    "08.02",
  );
});

// THROW_ID_03 - AST, unicodeToNative() encounters a bad value
// -----------------------------------------------------------------------------

test("09 - real number in AST - unicodeToNative()", () => {
  throws(
    () => {
      unicodeToNative("abcdef", [[1.2]]);
    },
    /THROW_ID_03/g,
    "09.01",
  );
  throws(
    () => {
      unicodeToNative("abcdef", { a: 1.2 });
    },
    /THROW_ID_03/g,
    "09.02",
  );
});

// THROW_ID_04 - AST, nativeToUnicode() encounters a bad value
// -----------------------------------------------------------------------------

test("10 - real number in AST - unicodeToNative()", () => {
  throws(
    () => {
      nativeToUnicode("abcdef", [[1.2]]);
    },
    /THROW_ID_04/g,
    "10.01",
  );
  throws(
    () => {
      nativeToUnicode("abcdef", { a: 1.2 });
    },
    /THROW_ID_04/g,
    "10.02",
  );
});

// THROW_ID_05 - oneNativeToUnicode() length exceeded
// -----------------------------------------------------------------------------

test("11 - oneNativeToUnicode() length exceeded", () => {
  throws(
    () => {
      nativeToUnicode("abcdef", 6);
    },
    /THROW_ID_05/g,
    "11.01",
  );
  throws(
    () => {
      nativeToUnicode("abcdef", [[6]]);
    },
    /THROW_ID_05/g,
    "11.02",
  );
  throws(
    () => {
      nativeToUnicode("abcdef", { a: 6 });
    },
    /THROW_ID_05/g,
    "11.03",
  );

  throws(
    () => {
      nativeToUnicode("abcdef", 99);
    },
    /THROW_ID_05/g,
    "11.04",
  );
  throws(
    () => {
      nativeToUnicode("abcdef", [[99]]);
    },
    /THROW_ID_05/g,
    "11.05",
  );
  throws(
    () => {
      nativeToUnicode("abcdef", { a: 99 });
    },
    /THROW_ID_05/g,
    "11.06",
  );
});

// THROW_ID_06 - oneUnicodeToNative() length exceeded
// -----------------------------------------------------------------------------

test("12 - oneUnicodeToNative() length exceeded", () => {
  throws(
    () => {
      unicodeToNative("abcd👍", 5);
    },
    /THROW_ID_06/g,
    "12.01",
  );
  throws(
    () => {
      unicodeToNative("abcd👍", [[5]]);
    },
    /THROW_ID_06/g,
    "12.02",
  );
  throws(
    () => {
      unicodeToNative("abcd👍", { a: 5 });
    },
    /THROW_ID_06/g,
    "12.03",
  );

  throws(
    () => {
      unicodeToNative("abcd👍", 99);
    },
    /THROW_ID_06/g,
    "12.04",
  );
  throws(
    () => {
      unicodeToNative("abcd👍", [[99]]);
    },
    /THROW_ID_06/g,
    "12.05",
  );
  throws(
    () => {
      unicodeToNative("abcd👍", { a: 99 });
    },
    /THROW_ID_06/g,
    "12.06",
  );
});

// THROW_ID_07 - not a string or empty string in 1st input arg
// -----------------------------------------------------------------------------

test("13 - 2nd arg, 'indexes' type is wrong", () => {
  function testFunction() {
    return null;
  }

  throws(
    () => {
      unicodeToNative("abcdef", testFunction);
    },
    /THROW_ID_07/g,
    "13.01",
  );
  throws(
    () => {
      nativeToUnicode("abcdef", testFunction);
    },
    /THROW_ID_07/g,
    "13.02",
  );

  throws(
    () => {
      unicodeToNative("abcdef", null);
    },
    /THROW_ID_07/g,
    "13.03",
  );
  throws(
    () => {
      nativeToUnicode("abcdef", null);
    },
    /THROW_ID_07/g,
    "13.04",
  );
});

test.run();
