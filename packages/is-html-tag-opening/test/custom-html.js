import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { isOpening } from "../dist/is-html-tag-opening.esm.js";

// custom HTML tag names
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${36}m${"custom"}\u001b[${39}m`} - starts with dash, allowCustomTagNames=off`, () => {
  let s1 = "<-a-b>";
  not.ok(isOpening(s1, 0), "01.01");
});

test(`02 - ${`\u001b[${36}m${"custom"}\u001b[${39}m`} - starts with dash, allowCustomTagNames=on`, () => {
  let s1 = "<-a-b>";
  not.ok(
    isOpening(s1, 0, {
      allowCustomTagNames: true,
    }),
    "02.01"
  );
});

test(`03 - ${`\u001b[${36}m${"custom"}\u001b[${39}m`} - dash between chars`, () => {
  let s1 = "<a-b>";
  ok(isOpening(s1, 0), "03.01");
  ok(
    isOpening(s1, 0, {
      allowCustomTagNames: true,
    }),
    "03.02"
  );
});

test(`04 - ${`\u001b[${32}m${"isOpening()"}\u001b[${39}m`} - one letter tag, allowCustomTagNames=off`, () => {
  let s1 = "<c>";
  not.ok(
    isOpening(s1, 0, {
      allowCustomTagNames: false,
    }),
    "04.01"
  );
});

test(`05 - ${`\u001b[${32}m${"isOpening()"}\u001b[${39}m`} - one letter tag, allowCustomTagNames=on`, () => {
  let s1 = "<c>";
  ok(
    isOpening(s1, 0, {
      allowCustomTagNames: true,
    }),
    "05.01"
  );
});

test.run();
