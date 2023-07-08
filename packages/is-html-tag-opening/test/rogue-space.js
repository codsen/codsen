import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { isOpening } from "../dist/is-html-tag-opening.esm.js";

const BACKSLASH = "\u005C";

// rogue space cases
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${36}m${"broken code"}\u001b[${39}m`} - spaces around`, () => {
  let s1 = "< p >";
  ok(isOpening(s1, 0), "01.01");
  ok(
    isOpening(s1, 0, {
      allowCustomTagNames: true,
    }),
    "01.02",
  );
});

test(`02 - ${`\u001b[${36}m${"broken code"}\u001b[${39}m`} - spaces around`, () => {
  let s1 = "< / p >";
  ok(isOpening(s1, 0), "02.01");
  ok(
    isOpening(s1, 0, {
      allowCustomTagNames: true,
    }),
    "02.02",
  );
});

test(`03 - ${`\u001b[${36}m${"broken code"}\u001b[${39}m`} - spaces around`, () => {
  let s1 = "< b / >";
  ok(isOpening(s1, 0), "03.01");
  ok(
    isOpening(s1, 0, {
      allowCustomTagNames: true,
    }),
    "03.02",
  );
});

test(`04 - ${`\u001b[${36}m${"broken code"}\u001b[${39}m`} - spaces around`, () => {
  let s1 = `< ${BACKSLASH} b / >`;
  ok(isOpening(s1, 0), "04.01");
  ok(
    isOpening(s1, 0, {
      allowCustomTagNames: true,
    }),
    "04.02",
  );
});

test(`05 - ${`\u001b[${36}m${"broken code"}\u001b[${39}m`} - spaces around`, () => {
  let s1 = "</td nowrap yo yo/>";
  ok(isOpening(s1, 0), "05.01");
  ok(
    isOpening(s1, 0, {
      allowCustomTagNames: true,
    }),
    "05.02",
  );
});

test.run();
