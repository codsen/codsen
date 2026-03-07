// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { sort } from "../dist/csv-sort.esm.js";
import compare from "./util.js";

// -------------------------------------------------------------------

test("01 - throws when it can't detect Balance column (one field is empty in this case)", () => {
  compare(equal, "throws-no-balance", "01", throws);
});

test("02 - throws when all exclusively-numeric columns contain same values per-column", () => {
  compare(equal, "throws-identical-numeric-cols", "02", throws);
});

test("03 - offset columns - will throw", () => {
  compare(equal, "offset-column", "03", throws);
});

test("04 - throws when input types are wrong", () => {
  throws(
    () => {
      sort(true);
    },
    /THROW_ID_01/g,
    "04.01",
  );
  throws(
    () => {
      sort(null);
    },
    /THROW_ID_01/g,
    "04.02",
  );
  throws(
    () => {
      sort(1);
    },
    /THROW_ID_01/g,
    "04.03",
  );
  throws(
    () => {
      sort(undefined);
    },
    /THROW_ID_01/g,
    "04.04",
  );
  throws(
    () => {
      sort({ a: "b" });
    },
    /THROW_ID_01/g,
    "04.05",
  );
});

test("05 - throws because there are no numeric-only columns", () => {
  compare(equal, "throws-when-no-numeric-columns", "05", throws);
});

test.run();
