import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { splitEasy } from "../dist/csv-split-easy.esm.js";

test("01 - wrong input types causes throwing up", () => {
  throws(
    () => {
      splitEasy(null);
    },
    "01.01",
    "01.01",
  );
  throws(
    () => {
      splitEasy(1);
    },
    "01.02",
    "01.02",
  );
  throws(
    () => {
      splitEasy(undefined);
    },
    "01.03",
    "01.03",
  );
  throws(
    () => {
      splitEasy();
    },
    "01.04",
    "01.04",
  );
  throws(
    () => {
      splitEasy(true);
    },
    "01.05",
    "01.05",
  );
  throws(
    () => {
      splitEasy(NaN);
    },
    "01.06",
    "01.06",
  );
  throws(
    () => {
      splitEasy({ a: "a" });
    },
    "01.07",
    "01.07",
  );
  throws(
    () => {
      splitEasy("a", 1); // opts are not object
    },
    "01.08",
    "01.08",
  );
  not.throws(() => {
    splitEasy("a"); // opts missing
  }, "01.09");
  throws(
    () => {
      let f = () => null;
      splitEasy(f);
    },
    "01.10",
    "01.09",
  );
});

test.run();
