/* eslint no-template-curly-in-string: 0 */

import tap from "tap";
import jv from "../dist/json-variables.esm";

tap.test("01 - UTIL > single markers in the values", (t) => {
  t.doesNotThrow(() => {
    jv({
      a: "z",
      b: "%%_",
    });
  }, "01.01");
  t.doesNotThrow(() => {
    jv(
      {
        a: "z",
        b: "%%_",
      },
      {
        noSingleMarkers: false,
      }
    );
  }, "01.02");

  const err1 = t.throws(() => {
    jv(
      {
        a: "z",
        b: "%%_",
      },
      {
        noSingleMarkers: true,
      }
    );
  });
  t.match(err1.message, /THROW_ID_16/, "01.03");

  t.doesNotThrow(() => {
    jv({
      a: "z",
      b: "%%-",
    });
  }, "01.04");
  t.doesNotThrow(() => {
    jv(
      {
        a: "z",
        b: "%%-",
      },
      {
        noSingleMarkers: false,
      }
    );
  }, "01.05");

  const err2 = t.throws(() => {
    jv(
      {
        a: "z",
        b: "%%-",
      },
      {
        noSingleMarkers: true,
      }
    );
  });
  t.match(err2.message, /THROW_ID_16/, "01.06");
  t.end();
});
