import tap from "tap";
import compare from "../dist/ast-compare.esm";

// nested
// -----------------------------------------------------------------------------

tap.test("01 - simple nested plain objects", (t) => {
  t.same(
    compare({ a: { d: "4" }, b: "2", c: "3" }, { a: { d: "4" }, b: "2" }),
    true,
    "01"
  );
  t.end();
});

tap.test("02 - simple nested plain objects + array wrapper", (t) => {
  t.same(
    compare({ a: [{ d: "4" }], b: "2", c: "3" }, { a: [{ d: "4" }], b: "2" }),
    true,
    "02"
  );
  t.end();
});

tap.test("03 - simple nested plain objects, won't find", (t) => {
  t.same(
    compare({ a: { d: "4" }, b: "2" }, { a: { d: "4" }, b: "2", c: "3" }),
    false,
    "03"
  );
  t.end();
});

tap.test(
  "04 - simple nested plain objects + array wrapper, won't find",
  (t) => {
    t.same(
      compare({ a: [{ d: "4" }], b: "2" }, { a: [{ d: "4" }], b: "2", c: "3" }),
      false,
      "04"
    );
    t.end();
  }
);

tap.test("05 - obj, multiple nested levels, bigObj has more", (t) => {
  t.same(
    compare(
      { a: { b: { c: { d: [{ e: "1" }, { f: "2" }] } } } },
      { a: { b: { c: { d: [{ e: "1" }] } } } }
    ),
    true,
    "05"
  );
  t.end();
});

tap.test("06 - obj, multiple nested levels, equal", (t) => {
  t.same(
    compare(
      { a: { b: { c: { d: [{ e: "1" }, { f: "2" }] } } } },
      { a: { b: { c: { d: [{ e: "1" }, { f: "2" }] } } } }
    ),
    true,
    "06"
  );
  t.end();
});

tap.test("07 - obj, multiple nested levels, smallObj has more", (t) => {
  t.same(
    compare(
      { a: { b: { c: { d: [{ e: "1" }] } } } },
      { a: { b: { c: { d: [{ e: "1" }, { f: "2" }] } } } }
    ),
    false,
    "07"
  );
  t.end();
});

tap.test("08 - obj, deeper level doesn't match", (t) => {
  t.same(compare({ a: { b: "c" } }, { a: { b: "d" } }), false, "08");
  t.end();
});

tap.test("09 - empty string and empty nested object - defaults", (t) => {
  t.same(
    compare("", {
      key2: [],
      key3: [""],
    }),
    false,
    "09"
  );
  t.end();
});

tap.test(
  "10 - empty string and empty nested object - hungryForWhitespace",
  (t) => {
    t.same(
      compare(
        "",
        {
          key2: [],
          key3: [""],
        },
        {
          hungryForWhitespace: true,
        }
      ),
      true,
      "10"
    );
    t.end();
  }
);

tap.test("11 - empty string and empty nested object - matchStrictly", (t) => {
  t.same(
    compare(
      "",
      {
        key2: [],
        key3: [""],
      },
      {
        matchStrictly: true,
      }
    ),
    false,
    "11"
  );
  t.end();
});

tap.test(
  "12 - empty string and empty nested object - hungryForWhitespace + matchStrictly",
  (t) => {
    t.same(
      compare(
        "",
        {
          key2: [],
          key3: [""],
        },
        {
          hungryForWhitespace: true,
          matchStrictly: true,
        }
      ),
      false,
      "12"
    );
    t.end();
  }
);

tap.test(
  "13 - empty string and empty nested object - hungryForWhitespace + matchStrictly",
  (t) => {
    t.same(
      compare(
        "",
        {},
        {
          hungryForWhitespace: true,
          matchStrictly: true,
        }
      ),
      true,
      "13"
    );
    t.end();
  }
);

tap.test("14 - multiple keys", (t) => {
  t.same(
    compare(
      {
        key2: "\n\n \t \n \n    ",
        key3: "val3",
        key4: "val4",
      },
      {
        key2: [],
        key3: [],
      }
    ),
    false,
    "14"
  );
  t.end();
});

tap.test("15 - multiple keys", (t) => {
  t.same(
    compare(
      {
        key2: "\n\n \t \n \n    ",
        key3: "val3",
        key4: "val4",
      },
      {
        key2: [],
        key3: [],
      },
      {
        hungryForWhitespace: true,
      }
    ),
    false,
    "15"
  );
  t.end();
});
