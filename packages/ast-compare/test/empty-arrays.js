import tap from "tap";
import compare from "../dist/ast-compare.esm";

// matching empty arrays
// -----------------------------------------------------------------------------

tap.test("01 - matching empty arrays - blank vs. normal - defaults", (t) => {
  t.same(compare({ a: "1", b: "2", c: 3 }, {}), false, "01");
  t.end();
});

tap.test("02 - matching empty arrays - blank vs. empty - defaults", (t) => {
  t.same(compare({ a: "\n\n", b: "\t", c: "   " }, {}), false, "02");
  t.end();
});

tap.test(
  "03 - matching empty arrays - blank vs. normal - opts.hungryForWhitespace",
  (t) => {
    t.same(
      compare({ a: "1", b: "2", c: 3 }, {}, { hungryForWhitespace: true }),
      false,
      "03"
    );
    t.end();
  }
);

tap.test(
  "04 - matching empty arrays - blank vs. empty - opts.hungryForWhitespace",
  (t) => {
    t.same(
      compare(
        { a: "\n\n", b: "\t", c: "   " },
        {},
        { hungryForWhitespace: true }
      ),
      true,
      "04"
    );
    t.end();
  }
);

tap.test(
  "05 - matching empty arrays - blank vs. normal - opts.matchStrictly",
  (t) => {
    t.same(
      compare({ a: "1", b: "2", c: 3 }, {}, { matchStrictly: true }),
      false,
      "05"
    );
    t.end();
  }
);

tap.test(
  "06 - matching empty arrays - blank vs. empty - opts.matchStrictly",
  (t) => {
    t.same(
      compare({ a: "\n\n", b: "\t", c: "   " }, {}, { matchStrictly: true }),
      false,
      "06"
    );
    t.end();
  }
);

tap.test("07 - matching empty arrays - blank vs. normal - both opts", (t) => {
  t.same(
    compare(
      { a: "1", b: "2", c: 3 },
      {},
      { hungryForWhitespace: true, matchStrictly: true }
    ),
    false,
    "07"
  );
  t.end();
});

tap.test("08 - matching empty arrays - blank vs. empty - both opts", (t) => {
  t.same(
    compare(
      { a: "\n\n", b: "\t", c: "   " },
      {},
      { hungryForWhitespace: true, matchStrictly: true }
    ),
    true,
    "08"
  );
  t.end();
});
