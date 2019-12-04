const t = require("tap");
const aoob = require("../dist/util-array-object-or-both.cjs");

// ===========
// precautions
// ===========

t.test("1.1 - wrong/missing inputs - throws", t => {
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
  });
  t.throws(() => {
    aoob("any", 1);
  }, /THROW_ID_03/g);
  t.doesNotThrow(() => {
    aoob("any", null);
  });
  t.end();
});

// ===
// BAU
// ===

t.test("2.1 - arrays", t => {
  t.same(aoob("array"), "array", "2.1.1");
  t.same(aoob("Array"), "array", "2.1.2");
  t.same(aoob("\n\nArray\t \t"), "array", "2.1.3");
  t.same(aoob("\n\n   a \t"), "array", "2.1.4");
  t.same(aoob("\n\n   arr \t"), "array", "2.1.5");
  t.same(aoob("\n\n   ARR \t"), "array", "2.1.6");
  t.end();
});

t.test("2.2 - objects", t => {
  t.same(aoob("object"), "object", "2.2.1");
  t.same(aoob("Object"), "object", "2.2.2");
  t.same(aoob("obj"), "object", "2.2.3");
  t.same(aoob("o"), "object", "2.2.4");
  t.same(aoob("  object"), "object", "2.2.5");
  t.same(aoob("Object   "), "object", "2.2.6");
  t.same(aoob("\nobj"), "object", "2.2.7");
  t.same(aoob("o\n\n "), "object", "2.2.8");
  t.same(aoob(" OBJ"), "object", "2.2.9");
  t.end();
});

t.test("2.3 - any", t => {
  t.same(aoob("any"), "any", "2.3.1");
  t.same(aoob("all"), "any", "2.3.2");
  t.same(aoob("Everything"), "any", "2.3.3");
  t.same(aoob("e"), "any", "2.3.4");
  t.same(aoob("ANY"), "any", "2.3.5");
  t.same(aoob("\n\n all"), "any", "2.3.6");
  t.end();
});

// ====
// opts
// ====

t.test("3.1 - opts.msg", t => {
  t.same(
    aoob("object", {
      msg: "z"
    }),
    "object",
    "2.2.1"
  );
  t.throws(() => {
    aoob("aaa", {
      msg: "z"
    });
  }, "z The given variable was customised to an unrecognised value: aaa. Please check it against the API documentation.");
  t.throws(() => {
    aoob("aaa", {
      msg: "some-library/some-function(): [THROW_ID_99]"
    });
  }, "some-library/some-function(): [THROW_ID_99] The given variable was customised to an unrecognised value: aaa. Please check it against the API documentation.");
  t.throws(() => {
    aoob("bbb", {
      msg: "some-library/some-function(): [THROW_ID_99]",
      optsVarName: "only"
    });
  }, 'some-library/some-function(): [THROW_ID_99] The variable "only" was customised to an unrecognised value: bbb. Please check it against the API documentation.');

  t.end();
});
