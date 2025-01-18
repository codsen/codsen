import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { rEntDecode as decode } from "../dist/ranges-ent-decode.esm.js";

// ==============================
// 00. Throws
// ==============================

test("01 - throws when first input argument is missing", () => {
  throws(
    () => {
      decode();
    },
    /THROW_ID_01/,
    "01.01",
  );
});

test("02 - throws when first input argument is not string", () => {
  throws(
    () => {
      decode(true);
    },
    /THROW_ID_01/,
    "02.01",
  );
});

test("03 - throws when second input argument is not a plain object", () => {
  throws(
    () => {
      decode("zzz", "tralala");
    },
    /THROW_ID_02/,
    "03.01",
  );
});

test("04 - falsey opts does not throw", () => {
  not.throws(() => {
    decode("yyy", undefined);
  }, "04.01");
  not.throws(() => {
    decode("yyy", null);
  }, "04.02");
});

// ==============================
// 01. B.A.U.
// ==============================

test("05 - decodes multiple entities within a string, entities surrounded by other chars", () => {
  equal(
    decode("a &pound; b &lsquo; c"),
    [
      [2, 9, "£"],
      [12, 19, "‘"],
    ],
    "05.01",
  );
});

test("06 - decodes double-encoded entities", () => {
  equal(
    decode("a &amp;pound; b &amp;lsquo; c"),
    [
      [2, 13, "£"],
      [16, 27, "‘"],
    ],
    "06.01",
  );
  equal(
    decode("a &#x26;pound; b &#x26;lsquo; c"),
    [
      [2, 14, "£"],
      [17, 29, "‘"],
    ],
    "06.02",
  );
});

test("07 - decodes triple-encoded entities", () => {
  equal(
    decode("a &amp;amp;pound; b &amp;amp;lsquo; c"),
    [
      [2, 17, "£"],
      [20, 35, "‘"],
    ],
    "07.01",
  );
  equal(
    decode("a &#x26;#x26;pound; b &#x26;#x26;lsquo; c"),
    [
      [2, 19, "£"],
      [22, 39, "‘"],
    ],
    "07.02",
  );
  equal(
    decode("a &#x26;amp;pound; b &#x26;amp;lsquo; c"),
    [
      [2, 18, "£"],
      [21, 37, "‘"],
    ],
    "07.03",
  );
});

test("08 - ampersand entity", () => {
  equal(
    decode("a &#x26; b &amp; c"),
    [
      [2, 8, "&"],
      [11, 16, "&"],
    ],
    "08.01",
  );
  equal(
    decode("a &#x26;amp; b &amp;#x26; c"),
    [
      [2, 12, "&"],
      [15, 25, "&"],
    ],
    "08.02",
  );
  equal(
    decode("a &#x26;amp;#x26; b &amp;#x26;amp; c"),
    [
      [2, 17, "&"],
      [20, 34, "&"],
    ],
    "08.03",
  );
});

test("09 - nothing to find", () => {
  equal(decode("abc"), null, "09.01");
});

test("10 - empty string, early ending", () => {
  equal(decode(""), null, "10.01");
  equal(decode(" "), null, "10.02");
});

test.run();
