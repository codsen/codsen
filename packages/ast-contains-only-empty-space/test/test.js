import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { empty } from "../dist/ast-contains-only-empty-space.esm.js";

function dudFunction() {
  return "dud";
}

// ==============================
// arrays
// ==============================

test("01 - array containing empty string", () => {
  equal(empty([" "]), true, "01.01");
  equal(empty(["a"]), false, "01.02");
});

test("02 - array containing plain object with empty string", () => {
  // equal(empty([{ a: " " }]), true, "01.02.01");
  equal(empty([{ a: "a" }]), false, "02");
});

test("03 - array containing plain obj containing array containing string", () => {
  equal(empty([{ a: [" "] }]), true, "03.01");
  equal(empty([{ a: ["a"] }]), false, "03.02");
});

test("04 - ast with multiple objects containing empty space", () => {
  equal(
    empty([
      "   ",
      {
        key2: "   ",
        key3: "   \n   ",
        key4: "   \t   ",
      },
      "\n\n\n\n\n\n   \t   ",
    ]),
    true,
    "04.01"
  );
  equal(
    empty([
      "   ",
      {
        key2: "   ",
        key3: "   \n   ",
        key4: "   \t   ",
      },
      "\n\n\n\n\n\n   \t   .",
    ]),
    false,
    "04.02"
  );
});

// ==============================
// objects
// ==============================

test("05 - object containing empty strings", () => {
  equal(
    empty({
      a: "\n\n\n",
      b: "\t\t\t  ",
      c: "\n \n\n",
      d: "\t   ",
    }),
    true,
    "05.01"
  );
  equal(
    empty({
      a: "\n\n\n.",
      b: "\t\t\t  ",
      c: "\n \n\n",
      d: "\t   ",
    }),
    false,
    "05.02"
  );
});

test("06 - object containing arrays of empty strings", () => {
  equal(
    empty({
      a: ["\n\n\n"],
      b: ["\t\t\t  "],
      c: ["\n \n\n"],
      d: ["\t   "],
    }),
    true,
    "06"
  );
});

test("07 - object containing arrays of empty strings", () => {
  equal(
    empty({
      a: ["\n\n\n."],
      b: ["\t\t\t  "],
      c: ["\n \n\n"],
      d: ["\t   "],
    }),
    false,
    "07"
  );
});

test("08 - object containing arrays of empty strings", () => {
  equal(
    empty({
      a: ["aaaaaaa"],
      b: ["\t\t\t  "],
      c: ["\n \n\n"],
      d: ["\t   "],
    }),
    false,
    "08"
  );
});

test("09 - object containing arrays of empty strings", () => {
  equal(
    empty({
      a: [
        {
          x: {
            y: [
              {
                z: ["."],
              },
            ],
          },
        },
      ],
      b: ["\t\t\t  "],
      c: ["\n \n\n"],
      d: ["\t   "],
    }),
    false,
    "09"
  );
});

test("10 - object containing arrays of empty strings", () => {
  equal(
    empty({
      a: [
        {
          x: {
            y: [
              {
                z: ["\n"],
              },
            ],
          },
        },
      ],
      b: ["\t\t\t  "],
      c: ["\n \n\n"],
      d: ["\t   "],
    }),
    true,
    "10"
  );
});

test("11 - object's value is null", () => {
  equal(
    empty({
      a: null,
    }),
    true,
    "11"
  );
});

// ==============================
// strings
// ==============================

test("12 - object containing empty strings", () => {
  equal(empty("\n\n\n"), true, "12.01");
  equal(empty("\t\t\t"), true, "12.02");
  equal(empty("   "), true, "12.03");
  equal(empty("   \n \t \n   "), true, "12.04");
  equal(empty("a"), false, "12.05");
});

test("13 - true empty string", () => {
  equal(empty(""), true, "13");
});

// ==============================
// precautions
// ==============================

test("14 - function passed", () => {
  equal(empty(dudFunction), false, "14");
});

test("15 - bool passed", () => {
  equal(empty(true), false, "15");
});

test("16 - null passed", () => {
  equal(empty(null), false, "16");
});

test("17 - undefined passed", () => {
  equal(empty(undefined), false, "17");
});

test("18 - null deeper in an array", () => {
  equal(
    empty([
      {
        a: "zzz",
        b: null,
      },
    ]),
    false,
    "18"
  );
});

test.run();
