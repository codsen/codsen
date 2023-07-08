import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { helga } from "../dist/helga.esm.js";

// 01. normal use
// -----------------------------------------------------------------------------

test("01 - just a single word", () => {
  equal(
    helga("abc"),
    {
      minified: "abc",
      beautified: "abc",
    },
    "01.01",
  );
});

test("02 - converts line breaks - JSON off", () => {
  equal(
    helga("abc\ndef", { targetJSON: false }),
    {
      minified: "abc\ndef",
      beautified: "abc\ndef",
    },
    "02.01",
  );
});

test("03 - converts line breaks - JSON on", () => {
  // beautified as input:
  equal(
    helga("abc\ndef", { targetJSON: true }),
    {
      minified: "abc\\ndef",
      beautified: "abc\ndef",
    },
    "03.01",
  );

  // minified as input:
  equal(
    helga("abc\\ndef", { targetJSON: true }),
    {
      minified: "abc\\ndef",
      beautified: "abc\ndef",
    },
    "03.02",
  );
});

test.run();
