import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { isAttrClosing as isCl } from "../dist/is-html-attribute-closing.esm.js";
// const BACKSLASH = "\u005C";

// unclosed tags
// -----------------------------------------------------------------------------
//   LEGEND: S means single, D means double, X means absent

test(`01 - ${`\u001b[${31}m${`unclosed tags`}\u001b[${39}m`} - missing tag ending follows - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`, () => {
  let str = `<a href="z" click here</a>`;
  ok(isCl(str, 8, 10), "01.01");

  // fin.
});

test(`02 - ${`\u001b[${31}m${`unclosed tags`}\u001b[${39}m`} - missing tag ending follows - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`, () => {
  let str = `<a href="z' click here</a>`;
  ok(isCl(str, 8, 10), "02.01");

  // fin.
});

test(`03 - ${`\u001b[${31}m${`unclosed tags`}\u001b[${39}m`} - missing tag ending follows - \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`, () => {
  let str = `<a href='z" click here</a>`;
  ok(isCl(str, 8, 10), "03.01");

  // fin.
});

test(`04 - ${`\u001b[${31}m${`unclosed tags`}\u001b[${39}m`} - missing tag ending follows - \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`, () => {
  let str = `<a href='z' click here</a>`;
  ok(isCl(str, 8, 10), "04.01");

  // fin.
});

// -----------------------------------------------------------------------------

test(`05 - ${`\u001b[${31}m${`unclosed tags`}\u001b[${39}m`} - attr + missing tag ending follows - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`, () => {
  // D-D follows
  let str1 = `<a href="z" class="yo" click here</a>`;
  ok(isCl(str1, 8, 10), "05.01");
  not.ok(isCl(str1, 8, 18), "05.02");
  not.ok(isCl(str1, 8, 21), "05.03");

  // D-S follows
  let str2 = `<a href="z" class="yo' click here</a>`;
  ok(isCl(str2, 8, 10), "05.04");
  not.ok(isCl(str2, 8, 18), "05.05");
  not.ok(isCl(str2, 8, 21), "05.06");

  // S-D follows
  let str3 = `<a href="z" class='yo" click here</a>`;
  ok(isCl(str3, 8, 10), "05.07");
  not.ok(isCl(str3, 8, 18), "05.08");
  not.ok(isCl(str3, 8, 21), "05.09");

  // S-S follows
  let str4 = `<a href="z" class='yo' click here</a>`;
  ok(isCl(str4, 8, 10), "05.10");
  not.ok(isCl(str4, 8, 18), "05.11");
  not.ok(isCl(str4, 8, 21), "05.12");

  // fin.
});

test(`06 - ${`\u001b[${31}m${`unclosed tags`}\u001b[${39}m`} - attr + missing tag ending follows - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`, () => {
  // D-D follows
  let str1 = `<a href="z' class="yo" click here</a>`;
  ok(isCl(str1, 8, 10), "06.01");
  not.ok(isCl(str1, 8, 18), "06.02");
  not.ok(isCl(str1, 8, 21), "06.03");

  // D-S follows
  let str2 = `<a href="z' class="yo' click here</a>`;
  ok(isCl(str2, 8, 10), "06.04");
  not.ok(isCl(str2, 8, 18), "06.05");
  not.ok(isCl(str2, 8, 21), "06.06");

  // S-D follows
  let str3 = `<a href="z' class='yo" click here</a>`;
  ok(isCl(str3, 8, 10), "06.07");
  not.ok(isCl(str3, 8, 18), "06.08");
  not.ok(isCl(str3, 8, 21), "06.09");

  // S-S follows
  let str4 = `<a href="z' class='yo' click here</a>`;
  ok(isCl(str4, 8, 10), "06.10");
  not.ok(isCl(str4, 8, 18), "06.11");
  not.ok(isCl(str4, 8, 21), "06.12");

  // fin.
});

test(`07 - ${`\u001b[${31}m${`unclosed tags`}\u001b[${39}m`} - attr + missing tag ending follows - \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`, () => {
  // D-D follows
  let str1 = `<a href='z" class="yo" click here</a>`;
  ok(isCl(str1, 8, 10), "07.01");
  not.ok(isCl(str1, 8, 18), "07.02");
  not.ok(isCl(str1, 8, 21), "07.03");

  // D-S follows
  let str2 = `<a href='z" class="yo' click here</a>`;
  ok(isCl(str2, 8, 10), "07.04");
  not.ok(isCl(str2, 8, 18), "07.05");
  not.ok(isCl(str2, 8, 21), "07.06");

  // S-D follows
  let str3 = `<a href='z" class='yo" click here</a>`;
  ok(isCl(str3, 8, 10), "07.07");
  not.ok(isCl(str3, 8, 18), "07.08");
  not.ok(isCl(str3, 8, 21), "07.09");

  // S-S follows
  let str4 = `<a href='z" class='yo' click here</a>`;
  ok(isCl(str4, 8, 10), "07.10");
  not.ok(isCl(str4, 8, 18), "07.11");
  not.ok(isCl(str4, 8, 21), "07.12");

  // fin.
});

test(`08 - ${`\u001b[${31}m${`unclosed tags`}\u001b[${39}m`} - attr + missing tag ending follows - \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`, () => {
  // D-D follows
  let str1 = `<a href='z' class="yo" click here</a>`;
  ok(isCl(str1, 8, 10), "08.01");
  not.ok(isCl(str1, 8, 18), "08.02");
  not.ok(isCl(str1, 8, 21), "08.03");

  // D-S follows
  let str2 = `<a href='z' class="yo' click here</a>`;
  ok(isCl(str2, 8, 10), "08.04");
  not.ok(isCl(str2, 8, 18), "08.05");
  not.ok(isCl(str2, 8, 21), "08.06");

  // S-D follows
  let str3 = `<a href='z' class='yo" click here</a>`;
  ok(isCl(str3, 8, 10), "08.07");
  not.ok(isCl(str3, 8, 18), "08.08");
  not.ok(isCl(str3, 8, 21), "08.09");

  // S-S follows
  let str4 = `<a href='z' class='yo' click here</a>`;
  ok(isCl(str4, 8, 10), "08.10");
  not.ok(isCl(str4, 8, 18), "08.11");
  not.ok(isCl(str4, 8, 21), "08.12");

  // fin.
});

// -----------------------------------------------------------------------------

test(`09 - ${`\u001b[${31}m${`unclosed tags`}\u001b[${39}m`} - tight - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`, () => {
  let str = `<a href="z"</a>`;
  ok(isCl(str, 8, 10), "09.01");

  // fin.
});

test(`10 - ${`\u001b[${31}m${`unclosed tags`}\u001b[${39}m`} - tight - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`, () => {
  let str = `<a href="z'</a>`;
  ok(isCl(str, 8, 10), "10.01");

  // fin.
});

test(`11 - ${`\u001b[${31}m${`unclosed tags`}\u001b[${39}m`} - tight - \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`, () => {
  let str = `<a href='z"</a>`;
  ok(isCl(str, 8, 10), "11.01");

  // fin.
});

test(`12 - ${`\u001b[${31}m${`unclosed tags`}\u001b[${39}m`} - tight - \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`, () => {
  let str = `<a href='z'</a>`;
  ok(isCl(str, 8, 10), "12.01");

  // fin.
});

test.run();
