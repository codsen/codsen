/* eslint no-template-curly-in-string: 0 */

import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

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
      }
    );
  }, "01.02");

  throws(() => {
    jVar(
      {
        a: "z",
        b: "%%_",
      },
      {
        noSingleMarkers: true,
      }
    );
  }, /THROW_ID_16/);

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
      }
    );
  }, "01.05");

  throws(() => {
    jVar(
      {
        a: "z",
        b: "%%-",
      },
      {
        noSingleMarkers: true,
      }
    );
  }, /THROW_ID_16/);
});

test.run();
