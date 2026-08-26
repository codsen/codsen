// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { runInNewContext } from "node:vm";
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { mixer } from "../dist/test-mixer.esm.js";

test("01 - the reference must be a plain object or undefined", () => {
  class CustomReference {}

  [
    [null, "01.01"],
    [false, "01.02"],
    [true, "01.03"],
    [0, "01.04"],
    [1, "01.05"],
    [NaN, "01.06"],
    [0n, "01.07"],
    ["", "01.08"],
    ["reference", "01.09"],
    [[], "01.10"],
    [new Date(), "01.11"],
    [new Map(), "01.12"],
    [new Set(), "01.13"],
    [/reference/u, "01.14"],
    [() => {}, "01.15"],
    [new CustomReference(), "01.16"],
    [Symbol("reference"), "01.17"],
  ].forEach(([value, label]) => {
    throws(
      () => {
        mixer(value);
      },
      /^test-mixer\/mixer\(\): \[THROW_ID_01\]/u,
      label,
    );
  });
});

test("02 - defaults must be a plain object or undefined", () => {
  class CustomDefaults {}

  [
    [null, "02.01"],
    [false, "02.02"],
    [true, "02.03"],
    [0, "02.04"],
    [1, "02.05"],
    [NaN, "02.06"],
    [0n, "02.07"],
    ["", "02.08"],
    ["defaults", "02.09"],
    [[], "02.10"],
    [new Date(), "02.11"],
    [new Map(), "02.12"],
    [new Set(), "02.13"],
    [/defaults/u, "02.14"],
    [() => {}, "02.15"],
    [new CustomDefaults(), "02.16"],
    [Symbol("defaults"), "02.17"],
  ].forEach(([value, label]) => {
    throws(
      () => {
        mixer({}, value);
      },
      /^test-mixer\/mixer\(\): \[THROW_ID_02\]/u,
      label,
    );
  });
});

test("03", () => {
  throws(
    () => {
      mixer(
        {
          foo: true,
        },
        {
          // <-- bool "foo" missing in defaults, that's wrong
          // if would be OK if it was not a bool (because sometimes
          // defaults don't have some valid options, for example,
          // when those keys are obligatory and can't be defaulted,
          // like is the case in string-apostrophes convertOne()).
          bar: true,
          baz: "zz",
        },
      );
    },
    /THROW_ID_03/g,
    "03.01",
  );
});

test("04", () => {
  equal(
    mixer(
      {
        foo: "yy",
      },
      {
        // <-- foo is missing in defaults, that's ok
        bar: true,
        baz: "zz",
      },
    ),
    [
      {
        foo: "yy", // foo gets copied
        bar: false, // <-- 2^1=2 variations, of "bar" only
        baz: "zz",
      },
      {
        foo: "yy", // foo gets copied
        bar: true,
        baz: "zz",
      },
    ],
    "04.01",
  );
});

test("05", () => {
  equal(mixer({}, {}), [], "05.01");
  equal(mixer(), [], "05.02");
  equal(mixer(undefined, undefined), [], "05.03");
  equal(mixer({}, undefined), [], "05.04");
  equal(mixer(undefined, {}), [], "05.05");

  const nullPrototypeRef = Object.assign(Object.create(null), {
    enabled: true,
  });
  const nullPrototypeDefaults = Object.assign(Object.create(null), {
    enabled: false,
  });
  equal(
    mixer(nullPrototypeRef, nullPrototypeDefaults),
    [{ enabled: true }],
    "05.06",
  );
  equal(mixer(new Object(), new Object()), [], "05.07");
  equal(
    mixer({}, runInNewContext("({ enabled: true })")),
    [{ enabled: false }, { enabled: true }],
    "05.08",
  );
});

test.run();
