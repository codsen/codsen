import tap from "tap";
import { arrObjOrBoth } from "../dist/util-array-object-or-both.esm";

// ===
// BAU
// ===

tap.test("01 - arrays", (t) => {
  t.strictSame(arrObjOrBoth("array"), "array", "01.01");
  t.strictSame(arrObjOrBoth("Array"), "array", "01.02");
  t.strictSame(arrObjOrBoth("\n\nArray\t \t"), "array", "01.03");
  t.strictSame(arrObjOrBoth("\n\n   a \t"), "array", "01.04");
  t.strictSame(arrObjOrBoth("\n\n   arr \t"), "array", "01.05");
  t.strictSame(arrObjOrBoth("\n\n   ARR \t"), "array", "01.06");
  t.end();
});

tap.test("02 - objects", (t) => {
  t.strictSame(arrObjOrBoth("object"), "object", "02.01");
  t.strictSame(arrObjOrBoth("Object"), "object", "02.02");
  t.strictSame(arrObjOrBoth("obj"), "object", "02.03");
  t.strictSame(arrObjOrBoth("o"), "object", "02.04");
  t.strictSame(arrObjOrBoth("  object"), "object", "02.05");
  t.strictSame(arrObjOrBoth("Object   "), "object", "02.06");
  t.strictSame(arrObjOrBoth("\nobj"), "object", "02.07");
  t.strictSame(arrObjOrBoth("o\n\n "), "object", "02.08");
  t.strictSame(arrObjOrBoth(" OBJ"), "object", "02.09");
  t.end();
});

tap.test("03 - any", (t) => {
  t.strictSame(arrObjOrBoth("any"), "any", "03.01");
  t.strictSame(arrObjOrBoth("all"), "any", "03.02");
  t.strictSame(arrObjOrBoth("Everything"), "any", "03.03");
  t.strictSame(arrObjOrBoth("e"), "any", "03.04");
  t.strictSame(arrObjOrBoth("ANY"), "any", "03.05");
  t.strictSame(arrObjOrBoth("\n\n all"), "any", "03.06");
  t.end();
});

// ====
// opts
// ====

tap.test("04 - opts.msg", (t) => {
  t.strictSame(
    arrObjOrBoth("object", {
      msg: "z",
    }),
    "object",
    "04.01"
  );
  t.throws(() => {
    arrObjOrBoth("aaa", {
      msg: "z",
    });
  }, "z The given variable was customised to an unrecognised value: aaa. Please check it against the API documentation.");
  t.throws(() => {
    arrObjOrBoth("aaa", {
      msg: "some-library/some-function(): [THROW_ID_99]",
    });
  }, "some-library/some-function(): [THROW_ID_99] The given variable was customised to an unrecognised value: aaa. Please check it against the API documentation.");
  t.throws(() => {
    arrObjOrBoth("bbb", {
      msg: "some-library/some-function(): [THROW_ID_99]",
      optsVarName: "only",
    });
  }, 'some-library/some-function(): [THROW_ID_99] The variable "only" was customised to an unrecognised value: bbb. Please check it against the API documentation.');

  t.end();
});
