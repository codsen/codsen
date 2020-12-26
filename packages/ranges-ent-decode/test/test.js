import tap from "tap";
import { rEntDecode as decode } from "../dist/ranges-ent-decode.esm";

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
    t.strictSame(
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
  t.strictSame(
    decode("a &amp;pound; b &amp;lsquo; c"),
    [
      [2, 13, "£"],
      [16, 27, "‘"],
    ],
    "06.01"
  );
  t.strictSame(
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
  t.strictSame(
    decode("a &amp;amp;pound; b &amp;amp;lsquo; c"),
    [
      [2, 17, "£"],
      [20, 35, "‘"],
    ],
    "07.01"
  );
  t.strictSame(
    decode("a &#x26;#x26;pound; b &#x26;#x26;lsquo; c"),
    [
      [2, 19, "£"],
      [22, 39, "‘"],
    ],
    "07.02"
  );
  t.strictSame(
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
  t.strictSame(
    decode("a &#x26; b &amp; c"),
    [
      [2, 8, "&"],
      [11, 16, "&"],
    ],
    "08.01"
  );
  t.strictSame(
    decode("a &#x26;amp; b &amp;#x26; c"),
    [
      [2, 12, "&"],
      [15, 25, "&"],
    ],
    "08.02"
  );
  t.strictSame(
    decode("a &#x26;amp;#x26; b &amp;#x26;amp; c"),
    [
      [2, 17, "&"],
      [20, 34, "&"],
    ],
    "08.03"
  );
  t.end();
});

tap.test("09 - nothing to find", (t) => {
  t.strictSame(decode("abc"), null, "09");
  t.end();
});

tap.test("10 - empty string, early ending", (t) => {
  t.strictSame(decode(""), null, "10.01");
  t.strictSame(decode(" "), null, "10.02");
  t.end();
});
