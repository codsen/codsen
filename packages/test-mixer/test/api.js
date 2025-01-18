import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { mixer } from "../dist/test-mixer.esm.js";

test("01", () => {
  throws(
    () => {
      mixer("z");
    },
    /THROW_ID_01/g,
    "01.01",
  );
});

test("02", () => {
  throws(
    () => {
      mixer(
        {
          foo: true,
        },
        "z",
      );
    },
    /THROW_ID_02/g,
    "02.01",
  );
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
});

test.run();
