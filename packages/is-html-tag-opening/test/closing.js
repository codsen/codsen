// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { isOpening } from "../dist/is-html-tag-opening.esm.js";

// closing tag
// -----------------------------------------------------------------------------

test(`01 - isOpening() - closing tag`, () => {
  // closing tag
  let str = "</td>";
  ok(isOpening(str), "01.01");
  ok(isOpening(str, 0), "01.02");
  ok(
    isOpening(str, 0, {
      allowCustomTagNames: true,
    }),
    "01.03",
  );

  not.ok(isOpening(str, 1), "01.04");
  ok(
    isOpening(str, 1, {
      skipOpeningBracket: true,
    }),
    "01.04",
  );
});

test(`02 - isOpening() - closing tag`, () => {
  let str = "</ td>";
  ok(isOpening(str), "02.01");
  ok(isOpening(str, 0), "02.02");
  ok(
    isOpening(str, 0, {
      allowCustomTagNames: true,
    }),
    "02.03",
  );

  not.ok(isOpening(str, 1), "02.04");
  ok(
    isOpening(str, 1, {
      skipOpeningBracket: true,
    }),
    "02.04",
  );
});

test(`03 - isOpening() - closing tag`, () => {
  let str = "< / td>";
  ok(isOpening(str), "03.01");
  ok(isOpening(str, 0), "03.02");
  ok(
    isOpening(str, 0, {
      allowCustomTagNames: true,
    }),
    "03.03",
  );

  not.ok(isOpening(str, 1), "03.04");
  ok(
    isOpening(str, 1, {
      skipOpeningBracket: true,
    }),
    "03.04",
  );
});

test(`04 - isOpening() - closing tag`, () => {
  let str = "</ td >";
  ok(isOpening(str), "04.01");
  ok(isOpening(str, 0), "04.02");
  ok(
    isOpening(str, 0, {
      allowCustomTagNames: true,
    }),
    "04.03",
  );

  not.ok(isOpening(str, 1), "04.04");
  ok(
    isOpening(str, 1, {
      skipOpeningBracket: true,
    }),
    "04.04",
  );
});

test(`05 - isOpening() - closing tag`, () => {
  let str = "< / td >";
  ok(isOpening(str), "05.01");
  ok(isOpening(str, 0), "05.02");
  ok(
    isOpening(str, 0, {
      allowCustomTagNames: true,
    }),
    "05.03",
  );

  not.ok(isOpening(str, 1), "05.04");
  ok(
    isOpening(str, 1, {
      skipOpeningBracket: true,
    }),
    "05.04",
  );
});

test(`06 - isOpening() - closing tag`, () => {
  let str = "<div>some text /div>";
  ok(
    isOpening(str, 15, {
      allowCustomTagNames: false,
      skipOpeningBracket: true,
    }),
    "06.01",
  );
  not.ok(
    isOpening(str, 16, {
      allowCustomTagNames: false,
      skipOpeningBracket: true,
    }),
    "06.02",
  );
});

test(`07 - isOpening() - closing tag`, () => {
  let str = "<div>some text /div>";
  ok(
    isOpening(str, 15, {
      allowCustomTagNames: true,
      skipOpeningBracket: true,
    }),
    "07.01",
  );
  not.ok(
    isOpening(str, 16, {
      allowCustomTagNames: true,
      skipOpeningBracket: true,
    }),
    "07.02",
  );
  ok(
    isOpening(str, 15, {
      allowCustomTagNames: false,
      skipOpeningBracket: true,
    }),
    "07.02",
  );
  not.ok(
    isOpening(str, 16, {
      allowCustomTagNames: false,
      skipOpeningBracket: true,
    }),
    "07.04",
  );
});

test(`08 - isOpening() - closing tag, unrecognised`, () => {
  let str = "<div>some text /yo>";
  ok(
    isOpening(str, 15, {
      allowCustomTagNames: true,
      skipOpeningBracket: true,
    }),
    "08.01",
  );
  not.ok(
    isOpening(str, 16, {
      allowCustomTagNames: true,
      skipOpeningBracket: true,
    }),
    "08.02",
  );
  not.ok(
    isOpening(str, 15, {
      allowCustomTagNames: false,
      skipOpeningBracket: true,
    }),
    "08.03",
  );
  not.ok(
    isOpening(str, 16, {
      allowCustomTagNames: false,
      skipOpeningBracket: true,
    }),
    "08.04",
  );
});

test.run();
