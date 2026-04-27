// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
/* eslint no-template-curly-in-string: 0 */

import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { jVar } from "../dist/json-variables.esm.js";

test("01 - UTIL > single markers in the values", () => {
  not.throws(() => {
    jVar({
      a: "z",
      b: "%%_",
    });
  }, "01.01");
  not.throws(() => {
    jVar(
      {
        a: "z",
        b: "%%_",
      },
      {
        noSingleMarkers: false,
      },
    );
  }, "01.02");

  throws(
    () => {
      jVar(
        {
          a: "z",
          b: "%%_",
        },
        {
          noSingleMarkers: true,
        },
      );
    },
    /THROW_ID_21/,
    "01.01",
  );

  not.throws(() => {
    jVar({
      a: "z",
      b: "%%-",
    });
  }, "01.04");
  not.throws(() => {
    jVar(
      {
        a: "z",
        b: "%%-",
      },
      {
        noSingleMarkers: false,
      },
    );
  }, "01.05");

  throws(
    () => {
      jVar(
        {
          a: "z",
          b: "%%-",
        },
        {
          noSingleMarkers: true,
        },
      );
    },
    /THROW_ID_21/,
    "01.02",
  );
});

test.run();
