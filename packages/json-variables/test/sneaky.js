/* eslint no-template-curly-in-string: 0 */

import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { jVar } from "../dist/json-variables.esm.js";

test("01 - two-level variables resolved", () => {
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
    "01.01",
  );
  equal(
    jVar({
      a: "%%_b.c_key_%%",
      b: { c_key: "%%_c_%%" },
      c: "val",
    }),
    {
      a: "val",
      b: { c_key: "val" },
      c: "val",
    },
    "01.02",
  );
});

test("02 - two-level redirects, backwards order", () => {
  equal(
    jVar({
      x: "val",
      y: "%%_x_%%",
      z: "%%_y_%%",
    }),
    {
      x: "val",
      y: "val",
      z: "val",
    },
    "02.01",
  );
  equal(
    jVar({
      x: { key1: "val" },
      y: { key2: "%%_x.key1_%%" },
      z: "%%_y.key2_%%",
    }),
    {
      x: { key1: "val" },
      y: { key2: "val" },
      z: "val",
    },
    "02.02",
  );
});

test("03 - two-level variables resolved, mixed", () => {
  equal(
    jVar({
      a: "Some text %%_b_%% some more text %%_c_%%",
      b: "Some text %%_c_%%, some more text %%_d_%%",
      c: "val1",
      d: "val2",
    }),
    {
      a: "Some text Some text val1, some more text val2 some more text val1",
      b: "Some text val1, some more text val2",
      c: "val1",
      d: "val2",
    },
    "03.01",
  );
  equal(
    jVar({
      a: "Some text %%_b_%% some more text %%_c.key1_%%",
      b: "Some text %%_c.key1_%%, some more text %%_d.key2_%%",
      c: { key1: "val1" },
      d: { key2: "val2" },
    }),
    {
      a: "Some text Some text val1, some more text val2 some more text val1",
      b: "Some text val1, some more text val2",
      c: { key1: "val1" },
      d: { key2: "val2" },
    },
    "03.02",
  );
});

test("04 - three-level variables resolved", () => {
  equal(
    jVar({
      a: "%%_b_%% %%_d_%%",
      b: "%%_c_%% %%_d_%%",
      c: "%%_d_%%",
      d: "val",
    }),
    {
      a: "val val val",
      b: "val val",
      c: "val",
      d: "val",
    },
    "04.01",
  );
  equal(
    jVar({
      a: "%%_b_%% %%_h_%%",
      b: "%%_c.e.f.g_%% %%_h_%%",
      c: { e: { f: { g: "%%_h_%%" } } },
      h: "val",
    }),
    {
      a: "val val val",
      b: "val val",
      c: { e: { f: { g: "val" } } },
      h: "val",
    },
    "04.02",
  );
});

test("05 - another three-level var resolving", () => {
  equal(
    jVar({
      a: "%%_b_%% %%_c_%%",
      b: "%%_c_%% %%_d_%%",
      c: "%%_d_%%",
      d: "val",
    }),
    {
      a: "val val val",
      b: "val val",
      c: "val",
      d: "val",
    },
    "05.01",
  );
});

test("06 - multiple variables resolved", () => {
  equal(
    jVar({
      a: "%%_e_%% %%_d_%%",
      b: "%%_a_%%",
      c: "c",
      d: "%%_c_%%",
      e: "%%_c_%%",
      f: "%%_b_%%",
    }),
    {
      a: "c c",
      b: "c c",
      c: "c",
      d: "c",
      e: "c",
      f: "c c",
    },
    "06.01",
  );
  throws(
    () => {
      jVar({
        a: "%%_e_%% %%_d_%%",
        b: "%%_a_%%",
        c: "c",
        d: "%%_c_%%",
        e: "%%_b_%%",
        f: "%%_b_%%",
      });
    },
    /THROW_ID_19/,
    "06.02",
  );

  throws(
    () => {
      jVar({
        a: "%%_e_%% %%_d_%%",
        b: "%%_a_%%",
        c: "c",
        d: "%%_f_%%",
        e: "%%_c_%%",
        f: "%%_b_%%",
      });
    },
    /THROW_ID_19/,
    "06.03",
  );
});

test("07 - preventDoubleWrapping: on & off", () => {
  equal(
    jVar(
      {
        a: "%%_b_%%",
        b: "%%_c_%%",
        c: "val",
      },
      { wrapHeadsWith: "{", wrapTailsWith: "}", preventDoubleWrapping: false },
    ),
    {
      a: "{{val}}",
      b: "{val}",
      c: "val",
    },
    "07.01",
  );
  equal(
    jVar(
      {
        a: "%%_b_%%",
        b: "%%_c_%%",
        c: "val",
      },
      { wrapHeadsWith: "{", wrapTailsWith: "}", preventDoubleWrapping: true },
    ),
    {
      a: "{val}",
      b: "{val}",
      c: "val",
    },
    "07.02",
  );

  // here values come already wrapped:

  equal(
    jVar(
      {
        a: "%%_b_%%",
        b: "%%_c_%%",
        c: "{val}",
      },
      { wrapHeadsWith: "{", wrapTailsWith: "}", preventDoubleWrapping: false },
    ),
    {
      a: "{{{val}}}",
      b: "{{val}}",
      c: "{val}",
    },
    "07.03",
  );
  equal(
    jVar(
      {
        a: "%%_b_%%",
        b: "%%_c_%%",
        c: "{val}",
      },
      { wrapHeadsWith: "{", wrapTailsWith: "}", preventDoubleWrapping: true },
    ),
    {
      a: "{val}",
      b: "{val}",
      c: "{val}",
    },
    "07.04",
  );

  equal(
    jVar(
      {
        a: "%%_b_%%",
        b: "%%_c_%%",
        c: "Some text {val} and another {val}",
      },
      { wrapHeadsWith: "{", wrapTailsWith: "}", preventDoubleWrapping: false },
    ),
    {
      a: "{{Some text {val} and another {val}}}",
      b: "{Some text {val} and another {val}}",
      c: "Some text {val} and another {val}",
    },
    "07.05",
  );
  equal(
    jVar(
      {
        a: "%%_b_%%",
        b: "%%_c_%%",
        c: "Some text {val} and another {val}",
      },
      { wrapHeadsWith: "{", wrapTailsWith: "}", preventDoubleWrapping: true },
    ),
    {
      a: "Some text {val} and another {val}",
      b: "Some text {val} and another {val}",
      c: "Some text {val} and another {val}",
    },
    "07.06",
  );

  equal(
    jVar(
      {
        a: "%%_b_%%",
        b: "%%_c.d_%%",
        c: { d: "val" },
      },
      { wrapHeadsWith: "{", wrapTailsWith: "}", preventDoubleWrapping: true },
    ),
    {
      a: "{val}",
      b: "{val}",
      c: { d: "val" },
    },
    "07.07",
  );
});

test("08 - empty variable", () => {
  equal(
    jVar({
      a: "%%__%%",
      b: "bbb",
    }),
    {
      a: "",
      b: "bbb",
    },
    "08.01",
  );
});

test.run();
