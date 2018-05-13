import test from "ava";
import empty from "../dist/ast-contains-only-empty-space.esm";

function dudFunction() {
  return "dud";
}

// ==============================
// arrays
// ==============================

test("01.01 - array containing empty string", t => {
  t.is(empty([" "]), true, "01.01.01");
  t.is(empty(["a"]), false, "01.01.02");
});

test("01.02 - array containing plain object with empty string", t => {
  t.is(empty([{ a: " " }]), true, "01.02.01");
  t.is(empty([{ a: "a" }]), false, "01.02.02");
});

test("01.03 - array containing plain obj containing array containing string", t => {
  t.is(empty([{ a: [" "] }]), true, "01.03.01");
  t.is(empty([{ a: ["a"] }]), false, "01.03.02");
});

test("01.04 - ast with multiple objects containing empty space", t => {
  t.is(
    empty([
      "   ",
      {
        key2: "   ",
        key3: "   \n   ",
        key4: "   \t   "
      },
      "\n\n\n\n\n\n   \t   "
    ]),
    true,
    "01.04.01"
  );
  t.is(
    empty([
      "   ",
      {
        key2: "   ",
        key3: "   \n   ",
        key4: "   \t   "
      },
      "\n\n\n\n\n\n   \t   ."
    ]),
    false,
    "01.04.02"
  );
});

// ==============================
// objects
// ==============================

test("02.01 - object containing empty strings", t => {
  t.is(
    empty({
      a: "\n\n\n",
      b: "\t\t\t  ",
      c: "\n \n\n",
      d: "\t   "
    }),
    true,
    "02.01.01"
  );
  t.is(
    empty({
      a: "\n\n\n.",
      b: "\t\t\t  ",
      c: "\n \n\n",
      d: "\t   "
    }),
    false,
    "02.01.02"
  );
});

test("02.02 - object containing arrays of empty strings", t => {
  t.is(
    empty({
      a: ["\n\n\n"],
      b: ["\t\t\t  "],
      c: ["\n \n\n"],
      d: ["\t   "]
    }),
    true,
    "02.02"
  );
});

test("02.03 - object containing arrays of empty strings", t => {
  t.is(
    empty({
      a: ["\n\n\n."],
      b: ["\t\t\t  "],
      c: ["\n \n\n"],
      d: ["\t   "]
    }),
    false,
    "02.03"
  );
});

test("02.04 - object containing arrays of empty strings", t => {
  t.is(
    empty({
      a: ["aaaaaaa"],
      b: ["\t\t\t  "],
      c: ["\n \n\n"],
      d: ["\t   "]
    }),
    false,
    "02.04"
  );
});

test("02.05 - object containing arrays of empty strings", t => {
  t.is(
    empty({
      a: [
        {
          x: {
            y: [
              {
                z: ["."]
              }
            ]
          }
        }
      ],
      b: ["\t\t\t  "],
      c: ["\n \n\n"],
      d: ["\t   "]
    }),
    false,
    "02.05"
  );
});

test("02.06 - object containing arrays of empty strings", t => {
  t.is(
    empty({
      a: [
        {
          x: {
            y: [
              {
                z: ["\n"]
              }
            ]
          }
        }
      ],
      b: ["\t\t\t  "],
      c: ["\n \n\n"],
      d: ["\t   "]
    }),
    true,
    "02.06"
  );
});

test("02.07 - object's value is null", t => {
  t.is(
    empty({
      a: null
    }),
    true,
    "02.07"
  );
});

// ==============================
// strings
// ==============================

test("03.01 - object containing empty strings", t => {
  t.is(empty("\n\n\n"), true, "03.01.01");
  t.is(empty("\t\t\t"), true, "03.01.02");
  t.is(empty("   "), true, "03.01.03");
  t.is(empty("   \n \t \n   "), true, "03.01.04");
  t.is(empty("a"), false, "03.01.05");
});

// ==============================
// precautions
// ==============================

test("04.01 - function passed", t => {
  t.is(empty(dudFunction), false, "04.01");
});

test("04.02 - bool passed", t => {
  t.is(empty(true), false, "04.02");
});

test("04.03 - null passed", t => {
  t.is(empty(null), false, "04.03");
});

test("04.04 - undefined passed", t => {
  t.is(empty(undefined), false, "04.04");
});

test("04.05 - null deeper in an array", t => {
  t.is(
    empty([
      {
        a: "zzz",
        b: null
      }
    ]),
    false,
    "04.05"
  );
});
