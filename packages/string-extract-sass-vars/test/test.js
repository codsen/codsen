import tap from "tap";
import fs from "fs";
import e from "../dist/string-extract-sass-vars.esm";

// 00. API
// -----------------------------------------------------------------------------

tap.test("01 - api - first arg is not string", (t) => {
  t.same(Object.keys(e(null)).length, 0, "01");
  t.end();
});

tap.test("02 - api - first arg is empty string", (t) => {
  t.same(Object.keys(e("")).length, 0, "02");
  t.end();
});

tap.test("03 - api - opts is wrong", (t) => {
  t.throws(() => {
    e("z", true);
  }, /THROW_ID_01/gm);
  t.end();
});

tap.test("04 - api - opts.cb", (t) => {
  t.throws(() => {
    e("z", {
      cb: true,
    });
  }, /THROW_ID_02/gm);
  t.end();
});

tap.test("05 - api - opts.throwIfEmpty", (t) => {
  t.throws(() => {
    e("z", {
      throwIfEmpty: true,
    });
  }, /THROW_ID_03/gm);
  t.end();
});

// 01. let's do the basics
// -----------------------------------------------------------------------------

tap.test("06 - basics - one pair, value without quotes", (t) => {
  const source = `$blue: #08f0fd;`;
  t.same(
    e(source),
    {
      blue: "#08f0fd",
    },
    "06"
  );
  t.end();
});

tap.test("07 - basics - one pair, value with quotes", (t) => {
  const source = `$blue: "#08f0fd";`;
  t.same(
    e(source),
    {
      blue: "#08f0fd",
    },
    "07"
  );
  t.end();
});

tap.test("08 - basics - two pairs", (t) => {
  const source = `$red: #ff6565;\n$blue: #08f0fd;`;
  t.same(
    e(source),
    {
      red: "#ff6565",
      blue: "#08f0fd",
    },
    "08"
  );
  t.end();
});

tap.test("09 - basics - quoted value with semicolon", (t) => {
  const source = `$red: "a; b";`;
  t.same(
    e(source),
    {
      red: "a; b",
    },
    "09"
  );
  t.end();
});

tap.test("10 - basics - value with colon", (t) => {
  const source = `$red: "a: b";`;
  t.same(
    e(source),
    {
      red: "a: b",
    },
    "10"
  );
  t.end();
});

tap.test("11 - basics - value as positive integer", (t) => {
  const source = `$abc: 9;`;
  t.is(e(source).abc, 9, "11");
  t.end();
});

tap.test("12 - basics - value as positive integer", (t) => {
  const source = `$abc: 0;`;
  t.is(e(source).abc, 0, "12");
  t.end();
});

tap.test("13 - basics - value as negative integer", (t) => {
  const source = `$abc: -9;`;
  t.is(e(source).abc, -9, "13");
  t.end();
});

tap.test("14 - basics - value as positive float", (t) => {
  const source = `$abc: 1.333;`;
  t.is(e(source).abc, 1.333, "14");
  t.end();
});

tap.test("15 - basics - value as negative float", (t) => {
  const source = `$abc: -1.333;`;
  t.is(e(source).abc, -1.333, "15");
  t.end();
});

tap.test("16 - basics - value as digit", (t) => {
  const source = `$a: bcd: ef;`;
  t.same(
    e(source),
    {
      a: "bcd: ef",
    },
    "16"
  );
  t.end();
});

tap.test("17 - basics - value as digit", (t) => {
  const source = `// don't mind this comment about #ff6565;
$customValue4: 10;`;
  t.same(
    e(source),
    {
      customValue4: 10,
    },
    "17"
  );
  t.end();
});

tap.test("18 - basics - slash-asterisk comments", (t) => {
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
    "18"
  );
  t.end();
});

tap.test("19 - basics - slash-excl. mark-asterisk comments", (t) => {
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
    "19"
  );
  t.end();
});

tap.test("20 - basics - nothing", (t) => {
  const source = `   \t\t\t`;
  t.same(Object.keys(e(source)).length, 0, "20");
  t.end();
});

// 02. let's do the fixtures
// -----------------------------------------------------------------------------

tap.test("21 - fixture 01 - a healthy file", (t) => {
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
    "21"
  );
  t.end();
});

tap.test(
  "22 - fixture 02 - lots of comments and some styling unrelated to variables",
  (t) => {
    const f02 = fs.readFileSync("test/fixtures/02.scss", { encoding: "utf8" });
    t.same(
      e(f02),
      {
        me: 0,
        andMe: 999,
      },
      "22"
    );
    t.end();
  }
);

tap.test("23 - fixture 03 - curlies", (t) => {
  const f03 = fs.readFileSync("test/fixtures/03.scss", { encoding: "utf8" });
  t.same(
    e(f03),
    {
      var1: "val1",
      var2: 2,
      var3: ";",
    },
    "23"
  );
  t.end();
});

tap.test("24 - fixture 04 - file of comments only", (t) => {
  const f04 = fs.readFileSync("test/fixtures/04.scss", { encoding: "utf8" });
  t.same(e(f04), {}, "24");
  t.end();
});

tap.test("25 - fixture 05 - inline comments", (t) => {
  const f05 = fs.readFileSync("test/fixtures/05.scss", { encoding: "utf8" });
  t.same(
    e(f05),
    {
      red: "#ff6565",
    },
    "25"
  );
  t.end();
});

// 03. opts.cb
// -----------------------------------------------------------------------------

tap.test("26 - opts.cb - custom override of a value", (t) => {
  t.same(
    e(`$grey: #ccc;`, {
      cb: (val) => {
        if (val === "#ccc") {
          return `#cccccc`;
        }
        return val;
      },
    }),
    {
      grey: "#cccccc",
    },
    "26"
  );
  t.end();
});
