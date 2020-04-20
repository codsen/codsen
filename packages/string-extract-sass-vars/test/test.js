const t = require("tap");
const e = require("../dist/string-extract-sass-vars.cjs");
const fs = require("fs");

// ~!@$%^&*()+=,./';:"?><[]\{}|`# ++++ space char

// 01. let's do the basics
// -----------------------------------------------------------------------------

t.test("01.01 - basics - one pair, value without quotes", (t) => {
  const source = `$blue: #08f0fd;`;
  t.same(
    e(source),
    {
      blue: "#08f0fd",
    },
    "01.01"
  );
  t.end();
});

t.test("01.02 - basics - one pair, value with quotes", (t) => {
  const source = `$blue: "#08f0fd";`;
  t.same(
    e(source),
    {
      blue: "#08f0fd",
    },
    "01.02"
  );
  t.end();
});

t.test("01.03 - basics - two pairs", (t) => {
  const source = `$red: #ff6565;\n$blue: #08f0fd;`;
  t.same(
    e(source),
    {
      red: "#ff6565",
      blue: "#08f0fd",
    },
    "01.03"
  );
  t.end();
});

t.test("01.04 - basics - quoted value with semicolon", (t) => {
  const source = `$red: "a; b";`;
  t.same(
    e(source),
    {
      red: "a; b",
    },
    "01.04"
  );
  t.end();
});

t.test("01.05 - basics - value with colon", (t) => {
  const source = `$red: "a: b";`;
  t.same(
    e(source),
    {
      red: "a: b",
    },
    "01.05"
  );
  t.end();
});

t.test("01.06 - basics - value as positive integer", (t) => {
  const source = `$abc: 9;`;
  t.is(e(source).abc, 9, "01.06");
  t.end();
});

t.test("01.07 - basics - value as positive integer", (t) => {
  const source = `$abc: 0;`;
  t.is(e(source).abc, 0, "01.07");
  t.end();
});

t.test("01.08 - basics - value as negative integer", (t) => {
  const source = `$abc: -9;`;
  t.is(e(source).abc, -9, "01.08");
  t.end();
});

t.test("01.09 - basics - value as positive float", (t) => {
  const source = `$abc: 1.333;`;
  t.is(e(source).abc, 1.333, "01.09");
  t.end();
});

t.test("01.10 - basics - value as negative float", (t) => {
  const source = `$abc: -1.333;`;
  t.is(e(source).abc, -1.333, "01.10");
  t.end();
});

t.test("01.11 - basics - value as digit", (t) => {
  const source = `$a: bcd: ef;`;
  t.same(
    e(source),
    {
      a: "bcd: ef",
    },
    "01.11"
  );
  t.end();
});

t.test("01.12 - basics - value as digit", (t) => {
  const source = `// don't mind this comment about #ff6565;
$customValue4: 10;`;
  t.same(
    e(source),
    {
      customValue4: 10,
    },
    "01.12"
  );
  t.end();
});

t.test("01.13 - basics - slash-asterisk comments", (t) => {
  const source = `$red: #ff6565; /* this is red
  $green: #63ffbd;
  $yellow: #ffff65; */
  $blue: #08f0fd; // this is blue`;
  t.same(
    e(source),
    {
      red: "#ff6565",
      blue: "#08f0fd",
    },
    "01.13"
  );
  t.end();
});

t.test("01.14 - basics - slash-excl. mark-asterisk comments", (t) => {
  const source = `$red: #ff6565; /*! this is red
  $green: #63ffbd;
  $yellow: #ffff65; */
  $blue: #08f0fd; // this is blue`;
  t.same(
    e(source),
    {
      red: "#ff6565",
      blue: "#08f0fd",
    },
    "01.14"
  );
  t.end();
});

t.test("01.15 - basics - nothing", (t) => {
  const source = `   \t\t\t`;
  t.same(Object.keys(e(source)).length, 0, "01.15");
  t.end();
});

// 02. let's do the fixtures
// -----------------------------------------------------------------------------

t.test("02.01 - fixture 01 - a healthy file", (t) => {
  const f01 = fs.readFileSync("test/fixtures/01.scss", { encoding: "utf8" });
  t.same(
    e(f01),
    {
      red: "#ff6565",
      yellow: "#ffff65",
      blue: "#08f0fd",
      fontfamily: "Helvetica, sans-serif",
      border: "1px solid #dedede",
      borderroundedness: "3px",
      customValue1: "trala; la",
      customValue2: "trala: la",
      customValue3: "tralala",
      customValue4: 10,
    },
    "02.01"
  );
  t.end();
});

t.test(
  "02.02 - fixture 02 - lots of comments and some styling unrelated to variables",
  (t) => {
    const f02 = fs.readFileSync("test/fixtures/02.scss", { encoding: "utf8" });
    t.same(
      e(f02),
      {
        me: 0,
        andMe: 999,
      },
      "02.02"
    );
    t.end();
  }
);

t.test("02.03 - fixture 03 - curlies", (t) => {
  const f03 = fs.readFileSync("test/fixtures/03.scss", { encoding: "utf8" });
  t.same(
    e(f03),
    {
      var1: "val1",
      var2: 2,
      var3: ";",
    },
    "02.03"
  );
  t.end();
});

t.test("02.04 - fixture 04 - file of comments only", (t) => {
  const f04 = fs.readFileSync("test/fixtures/04.scss", { encoding: "utf8" });
  t.same(e(f04), {}, "02.04");
  t.end();
});

t.test("02.05 - fixture 05 - inline comments", (t) => {
  const f05 = fs.readFileSync("test/fixtures/05.scss", { encoding: "utf8" });
  t.same(
    e(f05),
    {
      red: "#ff6565",
    },
    "02.05"
  );
  t.end();
});
