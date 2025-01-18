import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { isOpening } from "../dist/is-html-tag-opening.esm.js";

// self-closing tag
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${32}m${"isOpening()"}\u001b[${39}m`} - self-closing tag`, () => {
  let str = "<br/>";
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

test(`02 - ${`\u001b[${32}m${"isOpening()"}\u001b[${39}m`} - self-closing tag`, () => {
  let str = "< br/>";
  ok(isOpening(str), "02.01");
  ok(isOpening(str, 0), "02.02");
  ok(
    isOpening(str, 0, {
      allowCustomTagNames: true,
    }),
    "02.03",
  );

  not.ok(isOpening(str, 2), "02.04");
  ok(
    isOpening(str, 2, {
      skipOpeningBracket: true,
    }),
    "02.04",
  );
});

test(`03 - ${`\u001b[${32}m${"isOpening()"}\u001b[${39}m`} - self-closing tag`, () => {
  let str = "<br />";
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

test(`04 - ${`\u001b[${32}m${"isOpening()"}\u001b[${39}m`} - self-closing tag`, () => {
  let str = "<br/ >";
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

test(`05 - ${`\u001b[${32}m${"isOpening()"}\u001b[${39}m`} - self-closing tag`, () => {
  let str = "<br / >";
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

test(`06 - ${`\u001b[${32}m${"isOpening()"}\u001b[${39}m`} - self-closing tag`, () => {
  let str = "< br / >";
  ok(isOpening(str), "06.01");
  ok(isOpening(str, 0), "06.02");
  ok(
    isOpening(str, 0, {
      allowCustomTagNames: true,
    }),
    "06.03",
  );

  not.ok(isOpening(str, 1), "06.04");
  ok(
    isOpening(str, 1, {
      skipOpeningBracket: true,
    }),
    "06.04",
  );
});

test.run();
