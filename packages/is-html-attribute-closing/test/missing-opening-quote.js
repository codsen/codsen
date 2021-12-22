import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { isAttrClosing as isCl } from "../dist/is-html-attribute-closing.esm.js";
// const BACKSLASH = "\u005C";

// attribute starts without a quote
// -----------------------------------------------------------------------------
//   LEGEND: S means single, D means double, X means absent

test(`01 - ${`\u001b[${35}m${`opening missing`}\u001b[${39}m`} - one tag pair, one attr`, () => {
  let str = `<a href=z">click here</a>`;

  ok(isCl(str, 8, 9), "01");

  // fin.
});

test(`02 - ${`\u001b[${35}m${`opening missing`}\u001b[${39}m`} - one tag pair, another attr follows`, () => {
  // D-D follows
  let str1 = `<a href=z" class="yo">click here</a>`;

  ok(isCl(str1, 8, 9), "02.01");
  not.ok(isCl(str1, 8, 17), "02.02");
  not.ok(isCl(str1, 8, 20), "02.03");

  // D-S follows
  let str2 = `<a href=z" class="yo'>click here</a>`;

  ok(isCl(str2, 8, 9), "02.04");
  not.ok(isCl(str2, 8, 17), "02.05");
  not.ok(isCl(str2, 8, 20), "02.06");

  //          off-tangent a little bit...
  let str21 = `<a href=z" class="yo' id='ey">click here</a>`;

  ok(isCl(str21, 8, 9), "02.07");
  not.ok(isCl(str21, 8, 17), "02.08");
  not.ok(isCl(str21, 8, 20), "02.09");
  not.ok(isCl(str21, 8, 25), "02.10");
  not.ok(isCl(str21, 8, 28), "02.11");

  let str22 = `<a href=z" class="yo' id='ey>click here</a>`;

  ok(isCl(str22, 8, 9), "02.12");
  not.ok(isCl(str22, 8, 17), "02.13");
  not.ok(isCl(str22, 8, 20), "02.14");
  not.ok(isCl(str22, 8, 25), "02.15");

  // S-D follows
  let str3 = `<a href=z" class='yo">click here</a>`;

  ok(isCl(str3, 8, 9), "02.16");
  not.ok(isCl(str3, 8, 17), "02.17");
  not.ok(isCl(str3, 8, 20), "02.18");

  let str31 = `<a href=z" class='yo" id="ey'>click here</a>`;

  ok(isCl(str31, 8, 9), "02.19");
  not.ok(isCl(str31, 8, 17), "02.20");
  not.ok(isCl(str31, 8, 20), "02.21");
  not.ok(isCl(str31, 8, 25), "02.22");
  not.ok(isCl(str31, 8, 28), "02.23");

  // S-S follows
  let str4 = `<a href=z" class='yo'>click here</a>`;

  ok(isCl(str4, 8, 9), "02.24");
  not.ok(isCl(str4, 8, 17), "02.25");
  not.ok(isCl(str4, 8, 20), "02.26");

  //                a provocation...
  let str41 = `<a href=z" class='yo' id='ey">click here</a>`;

  ok(isCl(str41, 8, 9), "02.27");
  not.ok(isCl(str41, 8, 17), "02.28");
  not.ok(isCl(str41, 8, 20), "02.29");
  not.ok(isCl(str41, 8, 25), "02.30");
  not.ok(isCl(str41, 8, 28), "02.31");

  // fin.
});

test.run();
