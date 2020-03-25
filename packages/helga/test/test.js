const t = require("tap");
const { helga } = require("../dist/helga.cjs");

// 01. normal use
// -----------------------------------------------------------------------------

t.test("01.01 - just a single word", (t) => {
  t.same(
    helga("abc"),
    {
      minified: "abc",
      beautified: "abc",
    },
    "01.01"
  );
  t.end();
});

t.test("01.02 - converts line breaks - JSON off", (t) => {
  t.same(
    helga("abc\ndef", { targetJSON: false }),
    {
      minified: "abc\ndef",
      beautified: "abc\ndef",
    },
    "01.02"
  );
  t.end();
});

t.test("01.03 - converts line breaks - JSON on", (t) => {
  // beautified as input:
  t.same(
    helga("abc\ndef", { targetJSON: true }),
    {
      minified: "abc\\ndef",
      beautified: "abc\ndef",
    },
    "01.03.01"
  );

  // minified as input:
  t.same(
    helga("abc\\ndef", { targetJSON: true }),
    {
      minified: "abc\\ndef",
      beautified: "abc\ndef",
    },
    "01.03.02"
  );
  t.end();
});
