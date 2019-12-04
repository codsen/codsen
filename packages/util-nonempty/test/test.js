const t = require("tap");
const nonEmpty = require("../dist/util-nonempty.cjs");

// ==============================
// Precautions
// ==============================

t.test("1.1 - inputs missing - returns false", t => {
  t.equal(nonEmpty(), false, "1.1");
  t.end();
});

// ==============================
// Normal use
// ==============================

t.test("2.1 - Array", t => {
  t.equal(nonEmpty(["a"]), true, "2.1.1");
  t.equal(nonEmpty([]), false, "2.1.2");
  t.end();
});

t.test("2.2 - Plain object", t => {
  t.equal(nonEmpty({ a: "a" }), true, "2.2.1");
  t.equal(nonEmpty({}), false, "2.2.2");
  t.end();
});

t.test("2.3 - String", t => {
  t.equal(nonEmpty("a"), true, "2.3.1");
  t.equal(nonEmpty(""), false, "2.3.2");
  t.end();
});

t.test("2.4 - null", t => {
  t.equal(nonEmpty(null), false, "2.4");
  t.end();
});

t.test('2.5 - hardcoded "undefined" - same as missing input', t => {
  t.equal(nonEmpty(undefined), false, "2.5");
  t.end();
});

t.test("2.5 - boolean - still empty (!)", t => {
  t.equal(nonEmpty(true), false, "2.5.1");
  t.equal(nonEmpty(false), false, "2.5.2");
  t.end();
});

t.test("2.6 - function - still empty, no matter what's returned (!)", t => {
  const f = function dummy() {
    return "a";
  };
  t.equal(nonEmpty(f), false, "2.6");
  t.end();
});

t.test("2.7 - Number", t => {
  t.equal(nonEmpty(10), true, "2.7.1");
  t.equal(nonEmpty(0), true, "2.7.2");
  t.end();
});
