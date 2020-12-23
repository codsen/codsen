import tap from "tap";
import { empty } from "../dist/ast-contains-only-empty-space.esm";

function dudFunction() {
  return "dud";
}

// ==============================
// arrays
// ==============================

tap.test("01 - array containing empty string", (t) => {
  t.equal(empty([" "]), true, "01.01");
  t.equal(empty(["a"]), false, "01.02");
  t.end();
});

tap.test("02 - array containing plain object with empty string", (t) => {
  // t.equal(empty([{ a: " " }]), true, "01.02.01");
  t.equal(empty([{ a: "a" }]), false, "02");
  t.end();
});

tap.test(
  "03 - array containing plain obj containing array containing string",
  (t) => {
    t.equal(empty([{ a: [" "] }]), true, "03.01");
    t.equal(empty([{ a: ["a"] }]), false, "03.02");
    t.end();
  }
);

tap.test("04 - ast with multiple objects containing empty space", (t) => {
  t.equal(
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
  t.equal(
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
  t.end();
});

// ==============================
// objects
// ==============================

tap.test("05 - object containing empty strings", (t) => {
  t.equal(
    empty({
      a: "\n\n\n",
      b: "\t\t\t  ",
      c: "\n \n\n",
      d: "\t   ",
    }),
    true,
    "05.01"
  );
  t.equal(
    empty({
      a: "\n\n\n.",
      b: "\t\t\t  ",
      c: "\n \n\n",
      d: "\t   ",
    }),
    false,
    "05.02"
  );
  t.end();
});

tap.test("06 - object containing arrays of empty strings", (t) => {
  t.equal(
    empty({
      a: ["\n\n\n"],
      b: ["\t\t\t  "],
      c: ["\n \n\n"],
      d: ["\t   "],
    }),
    true,
    "06"
  );
  t.end();
});

tap.test("07 - object containing arrays of empty strings", (t) => {
  t.equal(
    empty({
      a: ["\n\n\n."],
      b: ["\t\t\t  "],
      c: ["\n \n\n"],
      d: ["\t   "],
    }),
    false,
    "07"
  );
  t.end();
});

tap.test("08 - object containing arrays of empty strings", (t) => {
  t.equal(
    empty({
      a: ["aaaaaaa"],
      b: ["\t\t\t  "],
      c: ["\n \n\n"],
      d: ["\t   "],
    }),
    false,
    "08"
  );
  t.end();
});

tap.test("09 - object containing arrays of empty strings", (t) => {
  t.equal(
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
  t.end();
});

tap.test("10 - object containing arrays of empty strings", (t) => {
  t.equal(
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
  t.end();
});

tap.test("11 - object's value is null", (t) => {
  t.equal(
    empty({
      a: null,
    }),
    true,
    "11"
  );
  t.end();
});

// ==============================
// strings
// ==============================

tap.test("12 - object containing empty strings", (t) => {
  t.equal(empty("\n\n\n"), true, "12.01");
  t.equal(empty("\t\t\t"), true, "12.02");
  t.equal(empty("   "), true, "12.03");
  t.equal(empty("   \n \t \n   "), true, "12.04");
  t.equal(empty("a"), false, "12.05");
  t.end();
});

tap.test("13 - true empty string", (t) => {
  t.equal(empty(""), true, "13");
  t.end();
});

// ==============================
// precautions
// ==============================

tap.test("14 - function passed", (t) => {
  t.equal(empty(dudFunction), false, "14");
  t.end();
});

tap.test("15 - bool passed", (t) => {
  t.equal(empty(true), false, "15");
  t.end();
});

tap.test("16 - null passed", (t) => {
  t.equal(empty(null), false, "16");
  t.end();
});

tap.test("17 - undefined passed", (t) => {
  t.equal(empty(undefined), false, "17");
  t.end();
});

tap.test("18 - null deeper in an array", (t) => {
  t.equal(
    empty([
      {
        a: "zzz",
        b: null,
      },
    ]),
    false,
    "18"
  );
  t.end();
});
