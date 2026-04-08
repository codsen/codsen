// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { isOpening } from "../dist/is-html-tag-opening.esm.js";

// API
// -----------------------------------------------------------------------------

test(`01 - API - throws`, () => {
  throws(
    () => {
      isOpening();
    },
    /THROW_ID_01/,
    "01.01",
  );
});

test(`02 - API - throws`, () => {
  throws(
    () => {
      isOpening(true);
    },
    /THROW_ID_01/,
    "02.01",
  );
});

test(`03 - API - throws`, () => {
  throws(
    () => {
      isOpening({ a: 1 });
    },
    /THROW_ID_01/,
    "03.01",
  );
});

test(`04 - API - throws`, () => {
  throws(
    () => {
      isOpening("z", true);
    },
    /THROW_ID_02/,
    "04.01",
  );
});

test(`05 - API - throws`, () => {
  throws(
    () => {
      isOpening("z", false);
    },
    /THROW_ID_02/,
    "05.01",
  );
});

test(`06 - API - throws`, () => {
  throws(
    () => {
      isOpening("z", null);
    },
    /THROW_ID_02/,
    "06.01",
  );
});

test.run();
