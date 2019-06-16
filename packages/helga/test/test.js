import test from "ava";
import { helga } from "../dist/helga.esm";

// 01. normal use
// -----------------------------------------------------------------------------

test("01.01 - just a single word", t => {
  t.deepEqual(
    helga("abc"),
    {
      minified: "abc",
      beautified: "abc"
    },
    "01.01"
  );
});

test("01.02 - converts line breaks - JSON off", t => {
  t.deepEqual(
    helga("abc\ndef", { targetJSON: false }),
    {
      minified: "abc\ndef",
      beautified: "abc\ndef"
    },
    "01.02"
  );
});

test("01.03 - converts line breaks - JSON on", t => {
  // beautified as input:
  t.deepEqual(
    helga("abc\ndef", { targetJSON: true }),
    {
      minified: "abc\\ndef",
      beautified: "abc\ndef"
    },
    "01.03.01"
  );

  // minified as input:
  t.deepEqual(
    helga("abc\\ndef", { targetJSON: true }),
    {
      minified: "abc\\ndef",
      beautified: "abc\ndef"
    },
    "01.03.02"
  );
});
