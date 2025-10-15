/* eslint no-template-curly-in-string: 0 */

import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { jVar } from "../dist/json-variables.esm.js";

test("01 - a control case, resolves string", () => {
  equal(
    jVar({
      a: "%%_b_%%",
      b: "123",
    }),
    {
      a: "123",
      b: "123",
    },
    "01.01",
  );
});

test("02 - redirects the string value", () => {
  equal(
    jVar({
      a: "%%_b_%%",
      b: "foo",
      c: "bar",
    }),
    {
      a: "foo",
      b: "foo",
      c: "bar",
    },
    "02.01",
  );
  equal(
    jVar({
      a: "%%_b_%%",
      a_data: { b: "foo" },
      c: "bar",
    }),
    {
      a: "foo",
      a_data: { b: "foo" },
      c: "bar",
    },
    "02.02",
  );
});

test("03 - redirects the numeric value", () => {
  equal(
    jVar({
      a: "%%_b_%%",
      b: 123,
    }),
    {
      a: 123,
      b: 123,
    },
    "03.01",
  );
  equal(
    jVar({
      a: "%%_b_%%",
      a_data: { b: 123 },
    }),
    {
      a: 123,
      a_data: { b: 123 },
    },
    "03.02",
  );
});

test("04 - two side by side", () => {
  equal(
    jVar({
      a: "%%_b_%%%%_b_%%",
      b: 123,
    }),
    {
      a: "123123",
      b: 123,
    },
    "04.01",
  );
  equal(
    jVar({
      a: "%%_b_%%%%_b_%%",
      a_data: { b: 123 },
    }),
    {
      a: "123123",
      a_data: { b: 123 },
    },
    "04.02",
  );
});

test("05 - mixed, redirects the numeric string value", () => {
  equal(
    jVar({
      a: "%%_b_%%",
      b: "123",
      c: "%%_d_%%",
      d: 456,
      e: "%%_f_%%",
      f: "789",
      g: "%%_h_%%",
      h: 321,
    }),
    {
      a: "123",
      b: "123",
      c: 456,
      d: 456,
      e: "789",
      f: "789",
      g: 321,
      h: 321,
    },
    "05.01",
  );
});

test("06 - redirects the numeric value", () => {
  equal(
    jVar({
      a: "%%_b_%%",
      b: 123,
      c: 456,
      d: "%%_b_%%",
      e: "%%_b_%%z",
    }),
    {
      a: 123,
      b: 123,
      c: 456,
      d: 123,
      e: "123z",
    },
    "06.01",
  );
});

test("07 - number value into string", () => {
  equal(
    jVar({
      a: "some %%_b_%% text",
      b: 123,
    }),
    {
      a: "some 123 text",
      b: 123,
    },
    "07.01",
  );
});

test("08 - number value into string, edge case 1, trailing", () => {
  equal(
    jVar({
      a: "%%_b_%%\t",
      b: 123,
    }),
    {
      a: 123,
      b: 123,
    },
    "08.01",
  );
  equal(
    jVar({
      a: "\t%%_b_%%",
      b: 123,
    }),
    {
      a: 123,
      b: 123,
    },
    "08.02",
  );
});

test("09 - nothing to do", () => {
  equal(
    jVar({
      a: 1,
      b: 2,
      c: 3,
    }),
    {
      a: 1,
      b: 2,
      c: 3,
    },
    "09.01",
  );
});

test("10 - two-level variables, string", () => {
  equal(
    jVar({
      a: "%%_b_%%",
      b: "%%_c_%%",
      c: "val",
    }),
    {
      a: "val",
      b: "val",
      c: "val",
    },
    "10.01",
  );
  equal(
    jVar({
      a: "foo %%_b_%% bar %%_c_%% baz",
      b: "foo %%_c_%% bar %%_c_%% baz",
      c: "zzz",
    }),
    {
      a: "foo foo zzz bar zzz baz bar zzz baz",
      b: "foo zzz bar zzz baz",
      c: "zzz",
    },
    "10.02",
  );
});

test("11 - two-level variables, number", () => {
  equal(
    jVar({
      a: "%%_b_%%",
      b: "%%_c_%%",
      c: 2,
    }),
    {
      a: 2,
      b: 2,
      c: 2,
    },
    "11.01",
  );
});

test("12 - two-level variables, number, data stash", () => {
  equal(
    jVar({
      a: "%%_b_%%",
      a_data: { b: "%%_c_%%" },
      c: 2,
    }),
    {
      a: 2,
      a_data: { b: 2 },
      c: 2,
    },
    "12.01",
  );
});

test.run();
