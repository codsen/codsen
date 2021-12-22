import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { arrObjOrBoth } from "../dist/util-array-object-or-both.esm.js";

// ===
// BAU
// ===

test("01 - arrays", () => {
  equal(arrObjOrBoth("array"), "array", "01.01");
  equal(arrObjOrBoth("Array"), "array", "01.02");
  equal(arrObjOrBoth("\n\nArray\t \t"), "array", "01.03");
  equal(arrObjOrBoth("\n\n   a \t"), "array", "01.04");
  equal(arrObjOrBoth("\n\n   arr \t"), "array", "01.05");
  equal(arrObjOrBoth("\n\n   ARR \t"), "array", "01.06");
});

test("02 - objects", () => {
  equal(arrObjOrBoth("object"), "object", "02.01");
  equal(arrObjOrBoth("Object"), "object", "02.02");
  equal(arrObjOrBoth("obj"), "object", "02.03");
  equal(arrObjOrBoth("o"), "object", "02.04");
  equal(arrObjOrBoth("  object"), "object", "02.05");
  equal(arrObjOrBoth("Object   "), "object", "02.06");
  equal(arrObjOrBoth("\nobj"), "object", "02.07");
  equal(arrObjOrBoth("o\n\n "), "object", "02.08");
  equal(arrObjOrBoth(" OBJ"), "object", "02.09");
});

test("03 - any", () => {
  equal(arrObjOrBoth("any"), "any", "03.01");
  equal(arrObjOrBoth("all"), "any", "03.02");
  equal(arrObjOrBoth("Everything"), "any", "03.03");
  equal(arrObjOrBoth("e"), "any", "03.04");
  equal(arrObjOrBoth("ANY"), "any", "03.05");
  equal(arrObjOrBoth("\n\n all"), "any", "03.06");
});

// ====
// opts
// ====

test("04 - opts.msg", () => {
  equal(
    arrObjOrBoth("object", {
      msg: "z",
    }),
    "object",
    "04.01"
  );
  throws(() => {
    arrObjOrBoth("aaa", {
      msg: "z",
    });
  }, "z The given variable was customised to an unrecognised value: aaa. Please check it against the API documentation.");
  throws(() => {
    arrObjOrBoth("aaa", {
      msg: "some-library/some-function(): [THROW_ID_99]",
    });
  }, "some-library/some-function(): [THROW_ID_99] The given variable was customised to an unrecognised value: aaa. Please check it against the API documentation.");
  throws(() => {
    arrObjOrBoth("bbb", {
      msg: "some-library/some-function(): [THROW_ID_99]",
      optsVarName: "only",
    });
  }, 'some-library/some-function(): [THROW_ID_99] The variable "only" was customised to an unrecognised value: bbb. Please check it against the API documentation.');
});

test.run();
