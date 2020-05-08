import tap from "tap";
import aoob from "../dist/util-array-object-or-both.esm";

// ===========
// precautions
// ===========

tap.test("01 - wrong/missing inputs - throws", (t) => {
  t.throws(() => {
    aoob();
  }, /THROW_ID_01/g);
  t.throws(() => {
    aoob(1);
  }, /THROW_ID_02/g);
  t.throws(() => {
    aoob(["a"]);
  }, /THROW_ID_02/g);
  t.doesNotThrow(() => {
    aoob("any");
  }, "01.04");
  t.throws(() => {
    aoob("any", 1);
  }, /THROW_ID_03/g);
  t.doesNotThrow(() => {
    aoob("any", null);
  }, "01.06");
  t.end();
});

// ===
// BAU
// ===

tap.test("02 - arrays", (t) => {
  t.same(aoob("array"), "array", "02.01");
  t.same(aoob("Array"), "array", "02.02");
  t.same(aoob("\n\nArray\t \t"), "array", "02.03");
  t.same(aoob("\n\n   a \t"), "array", "02.04");
  t.same(aoob("\n\n   arr \t"), "array", "02.05");
  t.same(aoob("\n\n   ARR \t"), "array", "02.06");
  t.end();
});

tap.test("03 - objects", (t) => {
  t.same(aoob("object"), "object", "03.01");
  t.same(aoob("Object"), "object", "03.02");
  t.same(aoob("obj"), "object", "03.03");
  t.same(aoob("o"), "object", "03.04");
  t.same(aoob("  object"), "object", "03.05");
  t.same(aoob("Object   "), "object", "03.06");
  t.same(aoob("\nobj"), "object", "03.07");
  t.same(aoob("o\n\n "), "object", "03.08");
  t.same(aoob(" OBJ"), "object", "03.09");
  t.end();
});

tap.test("04 - any", (t) => {
  t.same(aoob("any"), "any", "04.01");
  t.same(aoob("all"), "any", "04.02");
  t.same(aoob("Everything"), "any", "04.03");
  t.same(aoob("e"), "any", "04.04");
  t.same(aoob("ANY"), "any", "04.05");
  t.same(aoob("\n\n all"), "any", "04.06");
  t.end();
});

// ====
// opts
// ====

tap.test("05 - opts.msg", (t) => {
  t.same(
    aoob("object", {
      msg: "z",
    }),
    "object",
    "05.01"
  );
  t.throws(() => {
    aoob("aaa", {
      msg: "z",
    });
  }, "z The given variable was customised to an unrecognised value: aaa. Please check it against the API documentation.");
  t.throws(() => {
    aoob("aaa", {
      msg: "some-library/some-function(): [THROW_ID_99]",
    });
  }, "some-library/some-function(): [THROW_ID_99] The given variable was customised to an unrecognised value: aaa. Please check it against the API documentation.");
  t.throws(() => {
    aoob("bbb", {
      msg: "some-library/some-function(): [THROW_ID_99]",
      optsVarName: "only",
    });
  }, 'some-library/some-function(): [THROW_ID_99] The variable "only" was customised to an unrecognised value: bbb. Please check it against the API documentation.');

  t.end();
});
