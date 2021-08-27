/* eslint no-template-curly-in-string: 0 */

import tap from "tap";
import { jVar } from "../dist/json-variables.esm.js";

tap.test("01 - UTIL > single markers in the values", (t) => {
  t.doesNotThrow(() => {
    jVar({
      a: "z",
      b: "%%_",
    });
  }, "01.01");
  t.doesNotThrow(() => {
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

  t.throws(() => {
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

  t.doesNotThrow(() => {
    jVar({
      a: "z",
      b: "%%-",
    });
  }, "01.04");
  t.doesNotThrow(() => {
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

  t.throws(() => {
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
  t.end();
});
