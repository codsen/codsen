import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { isAttrClosing as isCl } from "../dist/is-html-attribute-closing.esm.js";
// const BACKSLASH = "\u005C";

// repeated equals
// -----------------------------------------------------------------------------
//   LEGEND: S means single, D means double, X means absent

test(`01 - ${`\u001b[${90}m${"repeated equal"}\u001b[${39}m`} - one tag, one attr`, () => {
  let str = "<a b==\"c\" d=='e'>";

  // b opening at 6
  not.ok(isCl(str, 6, 6), "01.01");
  ok(isCl(str, 6, 8), "01.01"); // <--
  not.ok(isCl(str, 6, 13), "01.03");
  not.ok(isCl(str, 6, 15), "01.04");

  // d opening at 13
  not.ok(isCl(str, 13, 6), "01.05");
  not.ok(isCl(str, 13, 8), "01.06");
  not.ok(isCl(str, 13, 13), "01.07");
  ok(isCl(str, 13, 15), "01.02"); // <--

  // fin.
});

test(`02 - ${`\u001b[${90}m${"repeated equal"}\u001b[${39}m`} - one tag, one attr, three equals`, () => {
  let str = "<a b===\"c\" d==='e'>";

  // b opening at 7
  not.ok(isCl(str, 7, 7), "02.01");
  ok(isCl(str, 7, 9), "02.01"); // <--
  not.ok(isCl(str, 7, 15), "02.03");
  not.ok(isCl(str, 7, 17), "02.04");

  // d opening at 15
  not.ok(isCl(str, 15, 7), "02.05");
  not.ok(isCl(str, 15, 9), "02.06");
  not.ok(isCl(str, 15, 15), "02.07");
  ok(isCl(str, 15, 17), "02.02"); // <--

  // fin.
});

test(`03 - ${`\u001b[${90}m${"repeated equal"}\u001b[${39}m`} - one tag, one attr, three spaced equals`, () => {
  let str = "<a b = = = \"c\" d = = = 'e'>";

  // b opening at 11
  not.ok(isCl(str, 11, 11), "03.01");
  ok(isCl(str, 11, 13), "03.01"); // <--
  not.ok(isCl(str, 11, 23), "03.03");
  not.ok(isCl(str, 11, 25), "03.04");

  // d opening at 23
  not.ok(isCl(str, 23, 11), "03.05");
  not.ok(isCl(str, 23, 13), "03.06");
  not.ok(isCl(str, 23, 23), "03.07");
  ok(isCl(str, 23, 25), "03.02"); // <--

  // fin.
});

test.run();
