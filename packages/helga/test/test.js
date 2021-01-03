import tap from "tap";
import { helga } from "../dist/helga.esm";

// 01. normal use
// -----------------------------------------------------------------------------

tap.test("01 - just a single word", (t) => {
  t.strictSame(
    helga("abc"),
    {
      minified: "abc",
      beautified: "abc",
    },
    "01"
  );
  t.end();
});

tap.test("02 - converts line breaks - JSON off", (t) => {
  t.strictSame(
    helga("abc\ndef", { targetJSON: false }),
    {
      minified: "abc\ndef",
      beautified: "abc\ndef",
    },
    "02"
  );
  t.end();
});

tap.only("03 - converts line breaks - JSON on", (t) => {
  // beautified as input:
  // t.strictSame(
  //   helga("abc\ndef", { targetJSON: true }),
  //   {
  //     minified: "abc\\ndef",
  //     beautified: "abc\ndef",
  //   },
  //   "03.01"
  // );

  // minified as input:
  t.strictSame(
    helga("abc\\ndef", { targetJSON: true }),
    {
      minified: "abc\\ndef",
      beautified: "abc\ndef",
    },
    "03.02"
  );
  t.end();
});
