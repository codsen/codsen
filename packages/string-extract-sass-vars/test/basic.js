import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { extractVars as e } from "../dist/string-extract-sass-vars.esm.js";

// 00. API
// -----------------------------------------------------------------------------

test("01 - api - first arg is not string", () => {
  equal(Object.keys(e(null)).length, 0, "01.01");
});

test("02 - api - first arg is empty string", () => {
  equal(Object.keys(e("")).length, 0, "02.01");
});

test("03 - api - opts is wrong", () => {
  throws(
    () => {
      e("z", true);
    },
    /THROW_ID_01/gm,
    "03.01",
  );
});

test("04 - api - opts.cb", () => {
  throws(
    () => {
      e("z", {
        cb: true,
      });
    },
    /THROW_ID_02/gm,
    "04.01",
  );
});

test("05 - api - opts.throwIfEmpty", () => {
  throws(
    () => {
      e("z", {
        throwIfEmpty: true,
      });
    },
    /THROW_ID_03/gm,
    "05.01",
  );
});

// 01. let's do the basics
// -----------------------------------------------------------------------------

test("06 - basics - one pair, value without quotes", () => {
  let source = "$blue: #08f0fd;";
  equal(
    e(source),
    {
      blue: "#08f0fd",
    },
    "06.01",
  );
});

test("07 - basics - one pair, value with quotes", () => {
  let source = '$blue: "#08f0fd";';
  equal(
    e(source),
    {
      blue: "#08f0fd",
    },
    "07.01",
  );
});

test("08 - basics - two pairs", () => {
  let source = "$red: #ff6565;\n$blue: #08f0fd;";
  equal(
    e(source),
    {
      red: "#ff6565",
      blue: "#08f0fd",
    },
    "08.01",
  );
});

test("09 - basics - quoted value with semicolon", () => {
  let source = '$red: "a; b";';
  equal(
    e(source),
    {
      red: "a; b",
    },
    "09.01",
  );
});

test("10 - basics - value with colon", () => {
  let source = '$red: "a: b";';
  equal(
    e(source),
    {
      red: "a: b",
    },
    "10.01",
  );
});

test("11 - basics - value as positive integer", () => {
  let source = "$abc: 9;";
  is(e(source).abc, 9, "11.01");
});

test("12 - basics - value as positive integer", () => {
  let source = "$abc: 0;";
  is(e(source).abc, 0, "12.01");
});

test("13 - basics - value as negative integer", () => {
  let source = "$abc: -9;";
  is(e(source).abc, -9, "13.01");
});

test("14 - basics - value as positive float", () => {
  let source = "$abc: 1.333;";
  is(e(source).abc, 1.333, "14.01");
});

test("15 - basics - value as negative float", () => {
  let source = "$abc: -1.333;";
  is(e(source).abc, -1.333, "15.01");
});

test("16 - basics - value as digit", () => {
  let source = "$a: bcd: ef;";
  equal(
    e(source),
    {
      a: "bcd: ef",
    },
    "16.01",
  );
});

test("17 - basics - value as digit", () => {
  let source = `// don't mind this comment about #ff6565;
$customValue4: 10;`;
  equal(
    e(source),
    {
      customValue4: 10,
    },
    "17.01",
  );
});

test("18 - basics - slash-asterisk comments", () => {
  let source = `$red: #ff6565; /* this is red
  $green: #63ffbd;
  $yellow: #ffff65; */
  $blue: #08f0fd; // this is blue`;
  equal(
    e(source),
    {
      red: "#ff6565",
      blue: "#08f0fd",
    },
    "18.01",
  );
});

test("19 - basics - slash-excl. mark-asterisk comments", () => {
  let source = `$red: #ff6565; /*! this is red
  $green: #63ffbd;
  $yellow: #ffff65; */
  $blue: #08f0fd; // this is blue`;
  equal(
    e(source),
    {
      red: "#ff6565",
      blue: "#08f0fd",
    },
    "19.01",
  );
});

test("20 - basics - nothing", () => {
  let source = "   \t\t\t";
  equal(Object.keys(e(source)).length, 0, "20.01");
});

test.run();
