/* eslint no-template-curly-in-string: 0 */

import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { jVar } from "../dist/json-variables.esm.js";

test("01 - surrounding underscores - sneaky similarity with wrong side brackets #1", () => {
  equal(
    jVar({
      a: "joined with an underscores: %%_var1_%%_%%_var2_%%",
      b: "something",
      var1: "value1",
      var2: "value2",
    }),
    {
      a: "joined with an underscores: value1_value2",
      b: "something",
      var1: "value1",
      var2: "value2",
    },
    "01"
  );
});

test("02 - surrounding underscores - sneaky similarity with wrong side brackets #2", () => {
  equal(
    jVar({
      a: "joined with an dashes: %%-var1-%%-%%-var2-%%",
      b: "something",
      var1: "value1",
      var2: "value2",
    }),
    {
      a: "joined with an dashes: value1-value2",
      b: "something",
      var1: "value1",
      var2: "value2",
    },
    "02"
  );
});

test("03 - surrounding underscores - sneaky similarity with wrong side brackets #3", () => {
  equal(
    jVar({
      a: "zzz_%%-var1-%%_%%-var2-%%_yyy",
      b: "something",
      var1: "value1",
      var2: "value2",
    }),
    {
      a: "zzz_value1_value2_yyy",
      b: "something",
      var1: "value1",
      var2: "value2",
    },
    "03"
  );
});

test("04 - surrounding underscores - sneaky similarity with wrong side brackets #4", () => {
  equal(
    jVar({
      a: "zzz_%%-var1-%%_%%-var2-%%",
      b: "something",
      var1: "value1",
      var2: "value2",
    }),
    {
      a: "zzz_value1_value2",
      b: "something",
      var1: "value1",
      var2: "value2",
    },
    "04"
  );
});

test("05 - surrounding dashes - sneaky similarity with wrong side brackets #1", () => {
  equal(
    jVar({
      a: "zzz-%%_var1_%%-%%_var2_%%-yyy",
      b: "something",
      var1: "value1",
      var2: "value2",
    }),
    {
      a: "zzz-value1-value2-yyy",
      b: "something",
      var1: "value1",
      var2: "value2",
    },
    "05"
  );
});

test("06 - surrounding dashes - sneaky similarity with wrong side brackets #2", () => {
  equal(
    jVar({
      a: "zzz-%%_var1_%%-%%_var2_%%",
      b: "something",
      var1: "value1",
      var2: "value2",
    }),
    {
      a: "zzz-value1-value2",
      b: "something",
      var1: "value1",
      var2: "value2",
    },
    "06"
  );
});

test.run();
