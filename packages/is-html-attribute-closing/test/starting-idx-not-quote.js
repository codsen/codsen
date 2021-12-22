import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { isAttrClosing as isCl } from "../dist/is-html-attribute-closing.esm.js";
// const BACKSLASH = "\u005C";

// starting index is not on a quote
// -----------------------------------------------------------------------------
//   LEGEND: S means single, D means double, X means absent

test(`01 - ${`\u001b[${36}m${`starting quote missing`}\u001b[${39}m`} - control`, () => {
  let str = `<a href="www" class=e'>`;

  // href opening at 8
  ok(isCl(str, 8, 12), "01.01"); // <--
  not.ok(isCl(str, 8, 21), "01.02");

  // class opening at 20
  not.ok(isCl(str, 20, 12), "01.03");
  ok(isCl(str, 20, 21), "01.04"); // <--

  // fin.
});

//              finally, the bizness

test(`02 - ${`\u001b[${36}m${`starting quote missing`}\u001b[${39}m`} - one tag, two attrs`, () => {
  // D-D
  let str1 = `<a href=www" class=e">`;

  // href opening at 8
  ok(isCl(str1, 8, 11), "02.01"); // <--
  not.ok(isCl(str1, 8, 20), "02.02");

  // class opening at 19
  not.ok(isCl(str1, 19, 11), "02.03");
  ok(isCl(str1, 19, 20), "02.04"); // <--

  // D-S
  let str2 = `<a href=www" class=e'>`;

  // href opening at 8
  ok(isCl(str2, 8, 11), "02.05"); // <--
  not.ok(isCl(str2, 8, 20), "02.06");

  // class opening at 19
  not.ok(isCl(str2, 19, 11), "02.07");
  ok(isCl(str2, 19, 20), "02.08"); // <--

  // S-D
  let str3 = `<a href=www' class=e">`;

  // href opening at 8
  ok(isCl(str3, 8, 11), "02.09"); // <--
  not.ok(isCl(str3, 8, 20), "02.10");

  // class opening at 19
  not.ok(isCl(str3, 19, 11), "02.11");
  ok(isCl(str3, 19, 20), "02.12"); // <--

  // S-S
  let str4 = `<a href=www' class=e'>`;

  // href opening at 8
  ok(isCl(str4, 8, 11), "02.13"); // <--
  not.ok(isCl(str4, 8, 20), "02.14");

  // class opening at 19
  not.ok(isCl(str4, 19, 11), "02.15");
  ok(isCl(str4, 19, 20), "02.16"); // <--

  // fin.
});

// "X" meaning absent
test(`03 - ${`\u001b[${36}m${`starting quote missing`}\u001b[${39}m`} - one tag, three attrs - \u001b[${90}m${`X`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m + \u001b[${90}m${`X`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`, () => {
  // X-D + X-D + D-D
  let str1 = `<a href=www" class=e" id="f">`;

  // href opening at 8
  ok(isCl(str1, 8, 11), "03.01"); // <--
  not.ok(isCl(str1, 8, 20), "03.02");
  not.ok(isCl(str1, 8, 25), "03.03");
  not.ok(isCl(str1, 8, 27), "03.04");

  // class opening at 19
  not.ok(isCl(str1, 19, 11), "03.05");
  ok(isCl(str1, 19, 20), "03.06"); // <--
  not.ok(isCl(str1, 19, 25), "03.07");
  not.ok(isCl(str1, 19, 27), "03.08");

  // X-D + X-D + D-S
  let str2 = `<a href=www" class=e" id="f'>`;

  // href opening at 8
  ok(isCl(str2, 8, 11), "03.09"); // <--
  not.ok(isCl(str2, 8, 20), "03.10");
  not.ok(isCl(str2, 8, 25), "03.11");
  not.ok(isCl(str2, 8, 27), "03.12");

  // class opening at 19
  not.ok(isCl(str2, 19, 11), "03.13");
  ok(isCl(str2, 19, 20), "03.14"); // <--
  not.ok(isCl(str2, 19, 25), "03.15");
  not.ok(isCl(str2, 19, 27), "03.16");

  // X-D + X-D + S-D
  let str3 = `<a href=www" class=e" id='f">`;

  // href opening at 8
  ok(isCl(str3, 8, 11), "03.17"); // <--
  not.ok(isCl(str3, 8, 20), "03.18");
  not.ok(isCl(str3, 8, 25), "03.19");
  not.ok(isCl(str3, 8, 27), "03.20");

  // class opening at 19
  not.ok(isCl(str3, 19, 11), "03.21");
  ok(isCl(str3, 19, 20), "03.22"); // <--
  not.ok(isCl(str3, 19, 25), "03.23");
  not.ok(isCl(str3, 19, 27), "03.24");

  // X-D + X-D + S-S
  let str4 = `<a href=www" class=e" id='f'>`;

  // href opening at 8
  ok(isCl(str4, 8, 11), "03.25"); // <--
  not.ok(isCl(str4, 8, 20), "03.26");
  not.ok(isCl(str4, 8, 25), "03.27");
  not.ok(isCl(str4, 8, 27), "03.28");

  // class opening at 19
  not.ok(isCl(str4, 19, 11), "03.29");
  ok(isCl(str4, 19, 20), "03.30"); // <--
  not.ok(isCl(str4, 19, 25), "03.31");
  not.ok(isCl(str4, 19, 27), "03.32");

  // X-D + X-D + S-X
  let str5 = `<a href=www" class=e" id='f>`;

  // href opening at 8
  ok(isCl(str5, 8, 11), "03.33"); // <--
  not.ok(isCl(str5, 8, 20), "03.34");
  not.ok(isCl(str5, 8, 25), "03.35");

  // class opening at 19
  not.ok(isCl(str5, 19, 11), "03.36");
  ok(isCl(str5, 19, 20), "03.37"); // <--
  not.ok(isCl(str5, 19, 25), "03.38");

  // X-D + X-D + D-X
  let str6 = `<a href=www" class=e" id="f>`;

  // href opening at 8
  ok(isCl(str6, 8, 11), "03.39"); // <--
  not.ok(isCl(str6, 8, 20), "03.40");
  not.ok(isCl(str6, 8, 25), "03.41");

  // class opening at 19
  not.ok(isCl(str6, 19, 11), "03.42");
  ok(isCl(str6, 19, 20), "03.43"); // <--
  not.ok(isCl(str6, 19, 25), "03.44");

  // X-D + X-D + X-S
  let str7 = `<a href=www" class=e" id=f'>`;

  // href opening at 8
  ok(isCl(str7, 8, 11), "03.45"); // <--
  not.ok(isCl(str7, 8, 20), "03.46");
  not.ok(isCl(str7, 8, 26), "03.47");

  // class opening at 19
  not.ok(isCl(str7, 19, 11), "03.48");
  ok(isCl(str7, 19, 20), "03.49"); // <--
  not.ok(isCl(str7, 19, 26), "03.50");

  // X-D + X-D + X-D
  let str8 = `<a href=www" class=e" id=f">`;

  // href opening at 8
  ok(isCl(str8, 8, 11), "03.51"); // <--
  not.ok(isCl(str8, 8, 20), "03.52");
  not.ok(isCl(str8, 8, 26), "03.53");

  // class opening at 19
  not.ok(isCl(str8, 19, 11), "03.54");
  ok(isCl(str8, 19, 20), "03.55"); // <--
  not.ok(isCl(str8, 19, 26), "03.56");

  // fin.
});

test(`04 - ${`\u001b[${36}m${`starting quote missing`}\u001b[${39}m`} - one tag, three attrs - \u001b[${90}m${`X`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m + \u001b[${90}m${`X`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`, () => {
  // X-D + X-S + D-D
  let str1 = `<a href=www" class=e' id="f">`;

  // href opening at 8
  ok(isCl(str1, 8, 11), "04.01"); // <--
  not.ok(isCl(str1, 8, 20), "04.02");
  not.ok(isCl(str1, 8, 25), "04.03");
  not.ok(isCl(str1, 8, 27), "04.04");

  // class opening at 19
  not.ok(isCl(str1, 19, 11), "04.05");
  ok(isCl(str1, 19, 20), "04.06"); // <--
  not.ok(isCl(str1, 19, 25), "04.07");
  not.ok(isCl(str1, 19, 27), "04.08");

  // X-D + X-S + D-S
  let str2 = `<a href=www" class=e' id="f'>`;

  // href opening at 8
  ok(isCl(str2, 8, 11), "04.09"); // <--
  not.ok(isCl(str2, 8, 20), "04.10");
  not.ok(isCl(str2, 8, 25), "04.11");
  not.ok(isCl(str2, 8, 27), "04.12");

  // class opening at 19
  not.ok(isCl(str2, 19, 11), "04.13");
  ok(isCl(str2, 19, 20), "04.14"); // <--
  not.ok(isCl(str2, 19, 25), "04.15");
  not.ok(isCl(str2, 19, 27), "04.16");

  // X-D + X-S + S-D
  let str3 = `<a href=www" class=e' id='f">`;

  // href opening at 8
  ok(isCl(str3, 8, 11), "04.17"); // <--
  not.ok(isCl(str3, 8, 20), "04.18");
  not.ok(isCl(str3, 8, 25), "04.19");
  not.ok(isCl(str3, 8, 27), "04.20");

  // class opening at 19
  not.ok(isCl(str3, 19, 11), "04.21");
  ok(isCl(str3, 19, 20), "04.22"); // <--
  not.ok(isCl(str3, 19, 25), "04.23");
  not.ok(isCl(str3, 19, 27), "04.24");

  // X-D + X-S + S-S
  let str4 = `<a href=www" class=e' id='f'>`;

  // href opening at 8
  ok(isCl(str4, 8, 11), "04.25"); // <--
  not.ok(isCl(str4, 8, 20), "04.26");
  not.ok(isCl(str4, 8, 25), "04.27");
  not.ok(isCl(str4, 8, 27), "04.28");

  // class opening at 19
  not.ok(isCl(str4, 19, 11), "04.29");
  ok(isCl(str4, 19, 20), "04.30"); // <--
  not.ok(isCl(str4, 19, 25), "04.31");
  not.ok(isCl(str4, 19, 27), "04.32");

  // X-D + X-S + S-X
  let str5 = `<a href=www" class=e' id='f>`;

  // href opening at 8
  ok(isCl(str5, 8, 11), "04.33"); // <--
  not.ok(isCl(str5, 8, 20), "04.34");
  not.ok(isCl(str5, 8, 25), "04.35");

  // class opening at 19
  not.ok(isCl(str5, 19, 11), "04.36");
  ok(isCl(str5, 19, 20), "04.37"); // <--
  not.ok(isCl(str5, 19, 25), "04.38");

  // X-D + X-S + D-X
  let str6 = `<a href=www" class=e' id="f>`;

  // href opening at 8
  ok(isCl(str6, 8, 11), "04.39"); // <--
  not.ok(isCl(str6, 8, 20), "04.40");
  not.ok(isCl(str6, 8, 25), "04.41");

  // class opening at 19
  not.ok(isCl(str6, 19, 11), "04.42");
  ok(isCl(str6, 19, 20), "04.43"); // <--
  not.ok(isCl(str6, 19, 25), "04.44");

  // X-D + X-S + X-S
  let str7 = `<a href=www" class=e' id=f'>`;

  // href opening at 8
  ok(isCl(str7, 8, 11), "04.45"); // <--
  not.ok(isCl(str7, 8, 20), "04.46");
  not.ok(isCl(str7, 8, 26), "04.47");

  // class opening at 19
  not.ok(isCl(str7, 19, 11), "04.48");
  ok(isCl(str7, 19, 20), "04.49"); // <--
  not.ok(isCl(str7, 19, 26), "04.50");

  // X-D + X-S + X-D
  let str8 = `<a href=www" class=e' id=f">`;

  // href opening at 8
  ok(isCl(str8, 8, 11), "04.51"); // <--
  not.ok(isCl(str8, 8, 20), "04.52");
  not.ok(isCl(str8, 8, 26), "04.53");

  // class opening at 19
  not.ok(isCl(str8, 19, 11), "04.54");
  ok(isCl(str8, 19, 20), "04.55"); // <--
  not.ok(isCl(str8, 19, 26), "04.56");

  // fin.
});

test(`05 - ${`\u001b[${36}m${`starting quote missing`}\u001b[${39}m`} - one tag, three attrs - \u001b[${90}m${`X`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m + \u001b[${90}m${`X`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`, () => {
  // X-S + X-D + D-D
  let str1 = `<a href=www' class=e" id="f">`;

  // href opening at 8
  ok(isCl(str1, 8, 11), "05.01"); // <--
  not.ok(isCl(str1, 8, 20), "05.02");
  not.ok(isCl(str1, 8, 25), "05.03");
  not.ok(isCl(str1, 8, 27), "05.04");

  // class opening at 19
  not.ok(isCl(str1, 19, 11), "05.05");
  ok(isCl(str1, 19, 20), "05.06"); // <--
  not.ok(isCl(str1, 19, 25), "05.07");
  not.ok(isCl(str1, 19, 27), "05.08");

  // X-S + X-D + D-S
  let str2 = `<a href=www' class=e" id="f'>`;

  // href opening at 8
  ok(isCl(str2, 8, 11), "05.09"); // <--
  not.ok(isCl(str2, 8, 20), "05.10");
  not.ok(isCl(str2, 8, 25), "05.11");
  not.ok(isCl(str2, 8, 27), "05.12");

  // class opening at 19
  not.ok(isCl(str2, 19, 11), "05.13");
  ok(isCl(str2, 19, 20), "05.14"); // <--
  not.ok(isCl(str2, 19, 25), "05.15");
  not.ok(isCl(str2, 19, 27), "05.16");

  // X-S + X-D + S-D
  let str3 = `<a href=www' class=e" id='f">`;

  // href opening at 8
  ok(isCl(str3, 8, 11), "05.17"); // <--
  not.ok(isCl(str3, 8, 20), "05.18");
  not.ok(isCl(str3, 8, 25), "05.19");
  not.ok(isCl(str3, 8, 27), "05.20");

  // class opening at 19
  not.ok(isCl(str3, 19, 11), "05.21");
  ok(isCl(str3, 19, 20), "05.22"); // <--
  not.ok(isCl(str3, 19, 25), "05.23");
  not.ok(isCl(str3, 19, 27), "05.24");

  // X-S + X-D + S-S
  let str4 = `<a href=www' class=e" id='f'>`;

  // href opening at 8
  ok(isCl(str4, 8, 11), "05.25"); // <--
  not.ok(isCl(str4, 8, 20), "05.26");
  not.ok(isCl(str4, 8, 25), "05.27");
  not.ok(isCl(str4, 8, 27), "05.28");

  // class opening at 19
  not.ok(isCl(str4, 19, 11), "05.29");
  ok(isCl(str4, 19, 20), "05.30"); // <--
  not.ok(isCl(str4, 19, 25), "05.31");
  not.ok(isCl(str4, 19, 27), "05.32");

  // X-S + X-D + S-X
  let str5 = `<a href=www' class=e" id='f>`;

  // href opening at 8
  ok(isCl(str5, 8, 11), "05.33"); // <--
  not.ok(isCl(str5, 8, 20), "05.34");
  not.ok(isCl(str5, 8, 25), "05.35");

  // class opening at 19
  not.ok(isCl(str5, 19, 11), "05.36");
  ok(isCl(str5, 19, 20), "05.37"); // <--
  not.ok(isCl(str5, 19, 25), "05.38");

  // X-S + X-D + D-X
  let str6 = `<a href=www' class=e" id="f>`;

  // href opening at 8
  ok(isCl(str6, 8, 11), "05.39"); // <--
  not.ok(isCl(str6, 8, 20), "05.40");
  not.ok(isCl(str6, 8, 25), "05.41");

  // class opening at 19
  not.ok(isCl(str6, 19, 11), "05.42");
  ok(isCl(str6, 19, 20), "05.43"); // <--
  not.ok(isCl(str6, 19, 25), "05.44");

  // X-S + X-D + X-S
  let str7 = `<a href=www' class=e" id=f'>`;

  // href opening at 8
  ok(isCl(str7, 8, 11), "05.45"); // <--
  not.ok(isCl(str7, 8, 20), "05.46");
  not.ok(isCl(str7, 8, 26), "05.47");

  // class opening at 19
  not.ok(isCl(str7, 19, 11), "05.48");
  ok(isCl(str7, 19, 20), "05.49"); // <--
  not.ok(isCl(str7, 19, 26), "05.50");

  // X-S + X-D + X-D
  let str8 = `<a href=www' class=e" id=f">`;

  // href opening at 8
  ok(isCl(str8, 8, 11), "05.51"); // <--
  not.ok(isCl(str8, 8, 20), "05.52");
  not.ok(isCl(str8, 8, 26), "05.53");

  // class opening at 19
  not.ok(isCl(str8, 19, 11), "05.54");
  ok(isCl(str8, 19, 20), "05.55"); // <--
  not.ok(isCl(str8, 19, 26), "05.56");

  // fin.
});

test(`06 - ${`\u001b[${36}m${`starting quote missing`}\u001b[${39}m`} - one tag, three attrs - \u001b[${90}m${`X`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m + \u001b[${90}m${`X`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`, () => {
  // X-S + X-S + D-D
  let str1 = `<a href=www' class=e' id="f">`;

  // href opening at 8
  ok(isCl(str1, 8, 11), "06.01"); // <--
  not.ok(isCl(str1, 8, 20), "06.02");
  not.ok(isCl(str1, 8, 25), "06.03");
  not.ok(isCl(str1, 8, 27), "06.04");

  // class opening at 19
  not.ok(isCl(str1, 19, 11), "06.05");
  ok(isCl(str1, 19, 20), "06.06"); // <--
  not.ok(isCl(str1, 19, 25), "06.07");
  not.ok(isCl(str1, 19, 27), "06.08");

  // X-S + X-S + D-S
  let str2 = `<a href=www' class=e' id="f'>`;

  // href opening at 8
  ok(isCl(str2, 8, 11), "06.09"); // <--
  not.ok(isCl(str2, 8, 20), "06.10");
  not.ok(isCl(str2, 8, 25), "06.11");
  not.ok(isCl(str2, 8, 27), "06.12");

  // class opening at 19
  not.ok(isCl(str2, 19, 11), "06.13");
  ok(isCl(str2, 19, 20), "06.14"); // <--
  not.ok(isCl(str2, 19, 25), "06.15");
  not.ok(isCl(str2, 19, 27), "06.16");

  // X-S + X-S + S-D
  let str3 = `<a href=www' class=e' id='f">`;

  // href opening at 8
  ok(isCl(str3, 8, 11), "06.17"); // <--
  not.ok(isCl(str3, 8, 20), "06.18");
  not.ok(isCl(str3, 8, 25), "06.19");
  not.ok(isCl(str3, 8, 27), "06.20");

  // class opening at 19
  not.ok(isCl(str3, 19, 11), "06.21");
  ok(isCl(str3, 19, 20), "06.22"); // <--
  not.ok(isCl(str3, 19, 25), "06.23");
  not.ok(isCl(str3, 19, 27), "06.24");

  // X-S + X-S + S-S
  let str4 = `<a href=www' class=e' id='f'>`;

  // href opening at 8
  ok(isCl(str4, 8, 11), "06.25"); // <--
  not.ok(isCl(str4, 8, 20), "06.26");
  not.ok(isCl(str4, 8, 25), "06.27");
  not.ok(isCl(str4, 8, 27), "06.28");

  // class opening at 19
  not.ok(isCl(str4, 19, 11), "06.29");
  ok(isCl(str4, 19, 20), "06.30"); // <--
  not.ok(isCl(str4, 19, 25), "06.31");
  not.ok(isCl(str4, 19, 27), "06.32");

  // X-S + X-S + S-X
  let str5 = `<a href=www' class=e' id='f>`;

  // href opening at 8
  ok(isCl(str5, 8, 11), "06.33"); // <--
  not.ok(isCl(str5, 8, 20), "06.34");
  not.ok(isCl(str5, 8, 25), "06.35");

  // class opening at 19
  not.ok(isCl(str5, 19, 11), "06.36");
  ok(isCl(str5, 19, 20), "06.37"); // <--
  not.ok(isCl(str5, 19, 25), "06.38");

  // X-S + X-S + D-X
  let str6 = `<a href=www' class=e' id="f>`;

  // href opening at 8
  ok(isCl(str6, 8, 11), "06.39"); // <--
  not.ok(isCl(str6, 8, 20), "06.40");
  not.ok(isCl(str6, 8, 25), "06.41");

  // class opening at 19
  not.ok(isCl(str6, 19, 11), "06.42");
  ok(isCl(str6, 19, 20), "06.43"); // <--
  not.ok(isCl(str6, 19, 25), "06.44");

  // X-S + X-S + X-S
  let str7 = `<a href=www' class=e' id=f'>`;

  // href opening at 8
  ok(isCl(str7, 8, 11), "06.45"); // <--
  not.ok(isCl(str7, 8, 20), "06.46");
  not.ok(isCl(str7, 8, 26), "06.47");

  // class opening at 19
  not.ok(isCl(str7, 19, 11), "06.48");
  ok(isCl(str7, 19, 20), "06.49"); // <--
  not.ok(isCl(str7, 19, 26), "06.50");

  // X-S + X-S + X-D
  let str8 = `<a href=www' class=e' id=f">`;

  // href opening at 8
  ok(isCl(str8, 8, 11), "06.51"); // <--
  not.ok(isCl(str8, 8, 20), "06.52");
  not.ok(isCl(str8, 8, 26), "06.53");

  // class opening at 19
  not.ok(isCl(str8, 19, 11), "06.54");
  ok(isCl(str8, 19, 20), "06.55"); // <--
  not.ok(isCl(str8, 19, 26), "06.56");
  // fin.
});

test.run();
