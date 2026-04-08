// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { isOpening } from "../dist/is-html-tag-opening.esm.js";

// custom HTML tag names
// -----------------------------------------------------------------------------

test(`01 - custom - starts with dash, allowCustomTagNames=off`, () => {
  let s1 = "<-a-b>";
  not.ok(isOpening(s1, 0), "01.01");
});

test(`02 - custom - starts with dash, allowCustomTagNames=on`, () => {
  let s1 = "<-a-b>";
  not.ok(
    isOpening(s1, 0, {
      allowCustomTagNames: true,
    }),
    "02.01",
  );
});

test(`03 - custom - dash between chars`, () => {
  let s1 = "<a-b>";
  ok(isOpening(s1, 0), "03.01");
  ok(
    isOpening(s1, 0, {
      allowCustomTagNames: true,
    }),
    "03.02",
  );
});

test(`04 - isOpening() - one letter tag, allowCustomTagNames=off`, () => {
  let s1 = "<c>";
  not.ok(
    isOpening(s1, 0, {
      allowCustomTagNames: false,
    }),
    "04.01",
  );
});

test(`05 - isOpening() - one letter tag, allowCustomTagNames=on`, () => {
  let s1 = "<c>";
  ok(
    isOpening(s1, 0, {
      allowCustomTagNames: true,
    }),
    "05.01",
  );
});

test.run();
