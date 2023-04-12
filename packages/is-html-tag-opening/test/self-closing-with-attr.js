import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { isOpening } from "../dist/is-html-tag-opening.esm.js";

// self-closing with attributes
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${32}m${"isOpening()"}\u001b[${39}m`} - self-closing tag with attributes`, () => {
  let s1 = '<br class="a"/>';
  ok(isOpening(s1), "01.01");
  ok(isOpening(s1, 0), "01.02");
  ok(
    isOpening(s1, 0, {
      allowCustomTagNames: true,
    }),
    "01.03"
  );
});

test(`02 - ${`\u001b[${32}m${"isOpening()"}\u001b[${39}m`} - self-closing tag with attributes`, () => {
  let s2 = '< br class="a"/>';
  ok(isOpening(s2), "02.01");
  ok(isOpening(s2, 0), "02.02");
  ok(
    isOpening(s2, 0, {
      allowCustomTagNames: true,
    }),
    "02.03"
  );
});

test(`03 - ${`\u001b[${32}m${"isOpening()"}\u001b[${39}m`} - self-closing tag with attributes`, () => {
  let s3 = '<br class="a" />';
  ok(isOpening(s3), "03.01");
  ok(isOpening(s3, 0), "03.02");
  ok(
    isOpening(s3, 0, {
      allowCustomTagNames: true,
    }),
    "03.03"
  );
});

test(`04 - ${`\u001b[${32}m${"isOpening()"}\u001b[${39}m`} - self-closing tag with attributes`, () => {
  let s4 = '<br class="a"/ >';
  ok(isOpening(s4), "04.01");
  ok(isOpening(s4, 0), "04.02");
  ok(
    isOpening(s4, 0, {
      allowCustomTagNames: true,
    }),
    "04.03"
  );
});

test(`05 - ${`\u001b[${32}m${"isOpening()"}\u001b[${39}m`} - self-closing tag with attributes`, () => {
  let s5 = '<br class="a" / >';
  ok(isOpening(s5), "05.01");
  ok(isOpening(s5, 0), "05.02");
  ok(
    isOpening(s5, 0, {
      allowCustomTagNames: true,
    }),
    "05.03"
  );
});

test(`06 - ${`\u001b[${32}m${"isOpening()"}\u001b[${39}m`} - self-closing tag with attributes`, () => {
  let s6 = '< br class="a" / >';
  ok(isOpening(s6), "06.01");
  ok(isOpening(s6, 0), "06.02");
  ok(
    isOpening(s6, 0, {
      allowCustomTagNames: true,
    }),
    "06.03"
  );
});

test(`07 - ${`\u001b[${32}m${"isOpening()"}\u001b[${39}m`} - self-closing tag with attributes`, () => {
  let s7 = "< br class = \"a\"  id ='z' / >";
  ok(isOpening(s7), "07.01");
  ok(isOpening(s7, 0), "07.02");
  ok(
    isOpening(s7, 0, {
      allowCustomTagNames: true,
    }),
    "07.03"
  );
});

test(`08 - ${`\u001b[${32}m${"isOpening()"}\u001b[${39}m`} - self-closing tag with attributes`, () => {
  let s8 = "< br class = \"a'  id = \"z' / >";
  ok(isOpening(s8), "08.01");
  ok(isOpening(s8, 0), "08.02");
  ok(
    isOpening(s8, 0, {
      allowCustomTagNames: true,
    }),
    "08.03"
  );
});

test.run();
