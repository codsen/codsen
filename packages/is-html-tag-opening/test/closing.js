import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { isOpening } from "../dist/is-html-tag-opening.esm.js";

// closing tag
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${32}m${"isOpening()"}\u001b[${39}m`} - closing tag`, () => {
  // closing tag
  let str = "</td>";
  ok(isOpening(str), "01.01");
  ok(isOpening(str, 0), "01.02");
  ok(
    isOpening(str, 0, {
      allowCustomTagNames: true,
    }),
    "01.03"
  );

  not.ok(isOpening(str, 1), "01.04");
  ok(
    isOpening(str, 1, {
      skipOpeningBracket: true,
    }),
    "01.04"
  );
});

test(`02 - ${`\u001b[${32}m${"isOpening()"}\u001b[${39}m`} - closing tag`, () => {
  let str = "</ td>";
  ok(isOpening(str), "02.01");
  ok(isOpening(str, 0), "02.02");
  ok(
    isOpening(str, 0, {
      allowCustomTagNames: true,
    }),
    "02.03"
  );

  not.ok(isOpening(str, 1), "02.04");
  ok(
    isOpening(str, 1, {
      skipOpeningBracket: true,
    }),
    "02.04"
  );
});

test(`03 - ${`\u001b[${32}m${"isOpening()"}\u001b[${39}m`} - closing tag`, () => {
  let str = "< / td>";
  ok(isOpening(str), "03.01");
  ok(isOpening(str, 0), "03.02");
  ok(
    isOpening(str, 0, {
      allowCustomTagNames: true,
    }),
    "03.03"
  );

  not.ok(isOpening(str, 1), "03.04");
  ok(
    isOpening(str, 1, {
      skipOpeningBracket: true,
    }),
    "03.04"
  );
});

test(`04 - ${`\u001b[${32}m${"isOpening()"}\u001b[${39}m`} - closing tag`, () => {
  let str = "</ td >";
  ok(isOpening(str), "04.01");
  ok(isOpening(str, 0), "04.02");
  ok(
    isOpening(str, 0, {
      allowCustomTagNames: true,
    }),
    "04.03"
  );

  not.ok(isOpening(str, 1), "04.04");
  ok(
    isOpening(str, 1, {
      skipOpeningBracket: true,
    }),
    "04.04"
  );
});

test(`05 - ${`\u001b[${32}m${"isOpening()"}\u001b[${39}m`} - closing tag`, () => {
  let str = "< / td >";
  ok(isOpening(str), "05.01");
  ok(isOpening(str, 0), "05.02");
  ok(
    isOpening(str, 0, {
      allowCustomTagNames: true,
    }),
    "05.03"
  );

  not.ok(isOpening(str, 1), "05.04");
  ok(
    isOpening(str, 1, {
      skipOpeningBracket: true,
    }),
    "05.04"
  );
});

test(`06 - ${`\u001b[${32}m${"isOpening()"}\u001b[${39}m`} - closing tag`, () => {
  let str = "<div>some text /div>";
  ok(
    isOpening(str, 15, {
      allowCustomTagNames: false,
      skipOpeningBracket: true,
    }),
    "06.01"
  );
  not.ok(
    isOpening(str, 16, {
      allowCustomTagNames: false,
      skipOpeningBracket: true,
    }),
    "06.02"
  );
});

test(`07 - ${`\u001b[${32}m${"isOpening()"}\u001b[${39}m`} - closing tag`, () => {
  let str = "<div>some text /div>";
  ok(
    isOpening(str, 15, {
      allowCustomTagNames: true,
      skipOpeningBracket: true,
    }),
    "07.01"
  );
  not.ok(
    isOpening(str, 16, {
      allowCustomTagNames: true,
      skipOpeningBracket: true,
    }),
    "07.02"
  );
  ok(
    isOpening(str, 15, {
      allowCustomTagNames: false,
      skipOpeningBracket: true,
    }),
    "07.02"
  );
  not.ok(
    isOpening(str, 16, {
      allowCustomTagNames: false,
      skipOpeningBracket: true,
    }),
    "07.04"
  );
});

test(`08 - ${`\u001b[${32}m${"isOpening()"}\u001b[${39}m`} - closing tag, unrecognised`, () => {
  let str = "<div>some text /yo>";
  ok(
    isOpening(str, 15, {
      allowCustomTagNames: true,
      skipOpeningBracket: true,
    }),
    "08.01"
  );
  not.ok(
    isOpening(str, 16, {
      allowCustomTagNames: true,
      skipOpeningBracket: true,
    }),
    "08.02"
  );
  not.ok(
    isOpening(str, 15, {
      allowCustomTagNames: false,
      skipOpeningBracket: true,
    }),
    "08.03"
  );
  not.ok(
    isOpening(str, 16, {
      allowCustomTagNames: false,
      skipOpeningBracket: true,
    }),
    "08.04"
  );
});

test.run();
