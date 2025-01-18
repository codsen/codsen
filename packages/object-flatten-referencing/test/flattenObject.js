/* eslint-disable no-template-curly-in-string */
import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { flattenObject } from "../dist/object-flatten-referencing.esm.js";

test("01 - util.flattenObject > empty input", () => {
  equal(flattenObject(), [], "01.01");
  equal(flattenObject({}), [], "01.02");
});

test("02 - util.flattenObject > simple object", () => {
  equal(
    flattenObject(
      {
        a: "b",
        c: "d",
      },
      {
        wrapHeadsWith: "%%_",
        wrapTailsWith: "_%%",
        dontWrapKeys: "",
        xhtml: true,
        preventDoubleWrapping: true,
        objectKeyAndValueJoinChar: ".",
      },
    ),
    ["a.b", "c.d"],
    "02.01",
  );
});

test("03 - util.flattenObject > nested objects", () => {
  equal(
    flattenObject(
      {
        a: { b: "c", d: "e" },
        f: { g: "h", e: "j" },
      },
      {
        wrapHeadsWith: "%%_",
        wrapTailsWith: "_%%",
        dontWrapKeys: [],
        xhtml: true,
        preventDoubleWrapping: true,
        objectKeyAndValueJoinChar: ".",
      },
    ),
    ["a.b.c", "a.d.e", "f.g.h", "f.e.j"],
    "03.01",
  );
});

test.run();
