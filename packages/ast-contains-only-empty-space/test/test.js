const t = require("tap");
const empty = require("../dist/ast-contains-only-empty-space.cjs");

function dudFunction() {
  return "dud";
}

// ==============================
// arrays
// ==============================

t.test("01.01 - array containing empty string", t => {
  t.equal(empty([" "]), true, "01.01.01");
  t.equal(empty(["a"]), false, "01.01.02");
  t.end();
});

t.test("01.02 - array containing plain object with empty string", t => {
  t.equal(empty([{ a: " " }]), true, "01.02.01");
  t.equal(empty([{ a: "a" }]), false, "01.02.02");
  t.end();
});

t.test(
  "01.03 - array containing plain obj containing array containing string",
  t => {
    t.equal(empty([{ a: [" "] }]), true, "01.03.01");
    t.equal(empty([{ a: ["a"] }]), false, "01.03.02");
    t.end();
  }
);

t.test("01.04 - ast with multiple objects containing empty space", t => {
  t.equal(
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
  t.equal(
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
  t.end();
});

// ==============================
// objects
// ==============================

t.test("02.01 - object containing empty strings", t => {
  t.equal(
    empty({
      a: "\n\n\n",
      b: "\t\t\t  ",
      c: "\n \n\n",
      d: "\t   "
    }),
    true,
    "02.01.01"
  );
  t.equal(
    empty({
      a: "\n\n\n.",
      b: "\t\t\t  ",
      c: "\n \n\n",
      d: "\t   "
    }),
    false,
    "02.01.02"
  );
  t.end();
});

t.test("02.02 - object containing arrays of empty strings", t => {
  t.equal(
    empty({
      a: ["\n\n\n"],
      b: ["\t\t\t  "],
      c: ["\n \n\n"],
      d: ["\t   "]
    }),
    true,
    "02.02"
  );
  t.end();
});

t.test("02.03 - object containing arrays of empty strings", t => {
  t.equal(
    empty({
      a: ["\n\n\n."],
      b: ["\t\t\t  "],
      c: ["\n \n\n"],
      d: ["\t   "]
    }),
    false,
    "02.03"
  );
  t.end();
});

t.test("02.04 - object containing arrays of empty strings", t => {
  t.equal(
    empty({
      a: ["aaaaaaa"],
      b: ["\t\t\t  "],
      c: ["\n \n\n"],
      d: ["\t   "]
    }),
    false,
    "02.04"
  );
  t.end();
});

t.test("02.05 - object containing arrays of empty strings", t => {
  t.equal(
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
  t.end();
});

t.test("02.06 - object containing arrays of empty strings", t => {
  t.equal(
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
  t.end();
});

t.test("02.07 - object's value is null", t => {
  t.equal(
    empty({
      a: null
    }),
    true,
    "02.07"
  );
  t.end();
});

// ==============================
// strings
// ==============================

t.test("03.01 - object containing empty strings", t => {
  t.equal(empty("\n\n\n"), true, "03.01.01");
  t.equal(empty("\t\t\t"), true, "03.01.02");
  t.equal(empty("   "), true, "03.01.03");
  t.equal(empty("   \n \t \n   "), true, "03.01.04");
  t.equal(empty("a"), false, "03.01.05");
  t.end();
});

t.test("03.02 - true empty string", t => {
  t.equal(empty(""), true);
  t.end();
});

// ==============================
// precautions
// ==============================

t.test("04.01 - function passed", t => {
  t.equal(empty(dudFunction), false, "04.01");
  t.end();
});

t.test("04.02 - bool passed", t => {
  t.equal(empty(true), false, "04.02");
  t.end();
});

t.test("04.03 - null passed", t => {
  t.equal(empty(null), false, "04.03");
  t.end();
});

t.test("04.04 - undefined passed", t => {
  t.equal(empty(undefined), false, "04.04");
  t.end();
});

t.test("04.05 - null deeper in an array", t => {
  t.equal(
    empty([
      {
        a: "zzz",
        b: null
      }
    ]),
    false,
    "04.05"
  );
  t.end();
});
