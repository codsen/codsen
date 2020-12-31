import tap from "tap";
import { isAttrClosing as is } from "../dist/is-html-attribute-closing.esm";
// const BACKSLASH = "\u005C";

// starting index is not on a quote
// -----------------------------------------------------------------------------
//   LEGEND: S means single, D means double, X means absent

tap.test(
  `01 - ${`\u001b[${36}m${`starting quote missing`}\u001b[${39}m`} - control`,
  (t) => {
    const str = `<a href="www" class=e'>`;

    // href opening at 8
    t.true(is(str, 8, 12), "01.01"); // <--
    t.false(is(str, 8, 21), "01.02");

    // class opening at 20
    t.false(is(str, 20, 12), "01.03");
    t.true(is(str, 20, 21), "01.04"); // <--

    // fin.
    t.end();
  }
);

//              finally, the bizness

tap.test(
  `02 - ${`\u001b[${36}m${`starting quote missing`}\u001b[${39}m`} - one tag, two attrs`,
  (t) => {
    // D-D
    const str1 = `<a href=www" class=e">`;

    // href opening at 8
    t.true(is(str1, 8, 11), "02.01"); // <--
    t.false(is(str1, 8, 20), "02.02");

    // class opening at 19
    t.false(is(str1, 19, 11), "02.03");
    t.true(is(str1, 19, 20), "02.04"); // <--

    // D-S
    const str2 = `<a href=www" class=e'>`;

    // href opening at 8
    t.true(is(str2, 8, 11), "02.05"); // <--
    t.false(is(str2, 8, 20), "02.06");

    // class opening at 19
    t.false(is(str2, 19, 11), "02.07");
    t.true(is(str2, 19, 20), "02.08"); // <--

    // S-D
    const str3 = `<a href=www' class=e">`;

    // href opening at 8
    t.true(is(str3, 8, 11), "02.09"); // <--
    t.false(is(str3, 8, 20), "02.10");

    // class opening at 19
    t.false(is(str3, 19, 11), "02.11");
    t.true(is(str3, 19, 20), "02.12"); // <--

    // S-S
    const str4 = `<a href=www' class=e'>`;

    // href opening at 8
    t.true(is(str4, 8, 11), "02.13"); // <--
    t.false(is(str4, 8, 20), "02.14");

    // class opening at 19
    t.false(is(str4, 19, 11), "02.15");
    t.true(is(str4, 19, 20), "02.16"); // <--

    // fin.
    t.end();
  }
);

// "X" meaning absent
tap.test(
  `03 - ${`\u001b[${36}m${`starting quote missing`}\u001b[${39}m`} - one tag, three attrs - \u001b[${90}m${`X`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m + \u001b[${90}m${`X`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    // X-D + X-D + D-D
    const str1 = `<a href=www" class=e" id="f">`;

    // href opening at 8
    t.true(is(str1, 8, 11), "03.01"); // <--
    t.false(is(str1, 8, 20), "03.02");
    t.false(is(str1, 8, 25), "03.03");
    t.false(is(str1, 8, 27), "03.04");

    // class opening at 19
    t.false(is(str1, 19, 11), "03.05");
    t.true(is(str1, 19, 20), "03.06"); // <--
    t.false(is(str1, 19, 25), "03.07");
    t.false(is(str1, 19, 27), "03.08");

    // X-D + X-D + D-S
    const str2 = `<a href=www" class=e" id="f'>`;

    // href opening at 8
    t.true(is(str2, 8, 11), "03.09"); // <--
    t.false(is(str2, 8, 20), "03.10");
    t.false(is(str2, 8, 25), "03.11");
    t.false(is(str2, 8, 27), "03.12");

    // class opening at 19
    t.false(is(str2, 19, 11), "03.13");
    t.true(is(str2, 19, 20), "03.14"); // <--
    t.false(is(str2, 19, 25), "03.15");
    t.false(is(str2, 19, 27), "03.16");

    // X-D + X-D + S-D
    const str3 = `<a href=www" class=e" id='f">`;

    // href opening at 8
    t.true(is(str3, 8, 11), "03.17"); // <--
    t.false(is(str3, 8, 20), "03.18");
    t.false(is(str3, 8, 25), "03.19");
    t.false(is(str3, 8, 27), "03.20");

    // class opening at 19
    t.false(is(str3, 19, 11), "03.21");
    t.true(is(str3, 19, 20), "03.22"); // <--
    t.false(is(str3, 19, 25), "03.23");
    t.false(is(str3, 19, 27), "03.24");

    // X-D + X-D + S-S
    const str4 = `<a href=www" class=e" id='f'>`;

    // href opening at 8
    t.true(is(str4, 8, 11), "03.25"); // <--
    t.false(is(str4, 8, 20), "03.26");
    t.false(is(str4, 8, 25), "03.27");
    t.false(is(str4, 8, 27), "03.28");

    // class opening at 19
    t.false(is(str4, 19, 11), "03.29");
    t.true(is(str4, 19, 20), "03.30"); // <--
    t.false(is(str4, 19, 25), "03.31");
    t.false(is(str4, 19, 27), "03.32");

    // X-D + X-D + S-X
    const str5 = `<a href=www" class=e" id='f>`;

    // href opening at 8
    t.true(is(str5, 8, 11), "03.33"); // <--
    t.false(is(str5, 8, 20), "03.34");
    t.false(is(str5, 8, 25), "03.35");

    // class opening at 19
    t.false(is(str5, 19, 11), "03.36");
    t.true(is(str5, 19, 20), "03.37"); // <--
    t.false(is(str5, 19, 25), "03.38");

    // X-D + X-D + D-X
    const str6 = `<a href=www" class=e" id="f>`;

    // href opening at 8
    t.true(is(str6, 8, 11), "03.39"); // <--
    t.false(is(str6, 8, 20), "03.40");
    t.false(is(str6, 8, 25), "03.41");

    // class opening at 19
    t.false(is(str6, 19, 11), "03.42");
    t.true(is(str6, 19, 20), "03.43"); // <--
    t.false(is(str6, 19, 25), "03.44");

    // X-D + X-D + X-S
    const str7 = `<a href=www" class=e" id=f'>`;

    // href opening at 8
    t.true(is(str7, 8, 11), "03.45"); // <--
    t.false(is(str7, 8, 20), "03.46");
    t.false(is(str7, 8, 26), "03.47");

    // class opening at 19
    t.false(is(str7, 19, 11), "03.48");
    t.true(is(str7, 19, 20), "03.49"); // <--
    t.false(is(str7, 19, 26), "03.50");

    // X-D + X-D + X-D
    const str8 = `<a href=www" class=e" id=f">`;

    // href opening at 8
    t.true(is(str8, 8, 11), "03.51"); // <--
    t.false(is(str8, 8, 20), "03.52");
    t.false(is(str8, 8, 26), "03.53");

    // class opening at 19
    t.false(is(str8, 19, 11), "03.54");
    t.true(is(str8, 19, 20), "03.55"); // <--
    t.false(is(str8, 19, 26), "03.56");

    // fin.
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${36}m${`starting quote missing`}\u001b[${39}m`} - one tag, three attrs - \u001b[${90}m${`X`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m + \u001b[${90}m${`X`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    // X-D + X-S + D-D
    const str1 = `<a href=www" class=e' id="f">`;

    // href opening at 8
    t.true(is(str1, 8, 11), "04.01"); // <--
    t.false(is(str1, 8, 20), "04.02");
    t.false(is(str1, 8, 25), "04.03");
    t.false(is(str1, 8, 27), "04.04");

    // class opening at 19
    t.false(is(str1, 19, 11), "04.05");
    t.true(is(str1, 19, 20), "04.06"); // <--
    t.false(is(str1, 19, 25), "04.07");
    t.false(is(str1, 19, 27), "04.08");

    // X-D + X-S + D-S
    const str2 = `<a href=www" class=e' id="f'>`;

    // href opening at 8
    t.true(is(str2, 8, 11), "04.09"); // <--
    t.false(is(str2, 8, 20), "04.10");
    t.false(is(str2, 8, 25), "04.11");
    t.false(is(str2, 8, 27), "04.12");

    // class opening at 19
    t.false(is(str2, 19, 11), "04.13");
    t.true(is(str2, 19, 20), "04.14"); // <--
    t.false(is(str2, 19, 25), "04.15");
    t.false(is(str2, 19, 27), "04.16");

    // X-D + X-S + S-D
    const str3 = `<a href=www" class=e' id='f">`;

    // href opening at 8
    t.true(is(str3, 8, 11), "04.17"); // <--
    t.false(is(str3, 8, 20), "04.18");
    t.false(is(str3, 8, 25), "04.19");
    t.false(is(str3, 8, 27), "04.20");

    // class opening at 19
    t.false(is(str3, 19, 11), "04.21");
    t.true(is(str3, 19, 20), "04.22"); // <--
    t.false(is(str3, 19, 25), "04.23");
    t.false(is(str3, 19, 27), "04.24");

    // X-D + X-S + S-S
    const str4 = `<a href=www" class=e' id='f'>`;

    // href opening at 8
    t.true(is(str4, 8, 11), "04.25"); // <--
    t.false(is(str4, 8, 20), "04.26");
    t.false(is(str4, 8, 25), "04.27");
    t.false(is(str4, 8, 27), "04.28");

    // class opening at 19
    t.false(is(str4, 19, 11), "04.29");
    t.true(is(str4, 19, 20), "04.30"); // <--
    t.false(is(str4, 19, 25), "04.31");
    t.false(is(str4, 19, 27), "04.32");

    // X-D + X-S + S-X
    const str5 = `<a href=www" class=e' id='f>`;

    // href opening at 8
    t.true(is(str5, 8, 11), "04.33"); // <--
    t.false(is(str5, 8, 20), "04.34");
    t.false(is(str5, 8, 25), "04.35");

    // class opening at 19
    t.false(is(str5, 19, 11), "04.36");
    t.true(is(str5, 19, 20), "04.37"); // <--
    t.false(is(str5, 19, 25), "04.38");

    // X-D + X-S + D-X
    const str6 = `<a href=www" class=e' id="f>`;

    // href opening at 8
    t.true(is(str6, 8, 11), "04.39"); // <--
    t.false(is(str6, 8, 20), "04.40");
    t.false(is(str6, 8, 25), "04.41");

    // class opening at 19
    t.false(is(str6, 19, 11), "04.42");
    t.true(is(str6, 19, 20), "04.43"); // <--
    t.false(is(str6, 19, 25), "04.44");

    // X-D + X-S + X-S
    const str7 = `<a href=www" class=e' id=f'>`;

    // href opening at 8
    t.true(is(str7, 8, 11), "04.45"); // <--
    t.false(is(str7, 8, 20), "04.46");
    t.false(is(str7, 8, 26), "04.47");

    // class opening at 19
    t.false(is(str7, 19, 11), "04.48");
    t.true(is(str7, 19, 20), "04.49"); // <--
    t.false(is(str7, 19, 26), "04.50");

    // X-D + X-S + X-D
    const str8 = `<a href=www" class=e' id=f">`;

    // href opening at 8
    t.true(is(str8, 8, 11), "04.51"); // <--
    t.false(is(str8, 8, 20), "04.52");
    t.false(is(str8, 8, 26), "04.53");

    // class opening at 19
    t.false(is(str8, 19, 11), "04.54");
    t.true(is(str8, 19, 20), "04.55"); // <--
    t.false(is(str8, 19, 26), "04.56");

    // fin.
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${36}m${`starting quote missing`}\u001b[${39}m`} - one tag, three attrs - \u001b[${90}m${`X`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m + \u001b[${90}m${`X`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    // X-S + X-D + D-D
    const str1 = `<a href=www' class=e" id="f">`;

    // href opening at 8
    t.true(is(str1, 8, 11), "05.01"); // <--
    t.false(is(str1, 8, 20), "05.02");
    t.false(is(str1, 8, 25), "05.03");
    t.false(is(str1, 8, 27), "05.04");

    // class opening at 19
    t.false(is(str1, 19, 11), "05.05");
    t.true(is(str1, 19, 20), "05.06"); // <--
    t.false(is(str1, 19, 25), "05.07");
    t.false(is(str1, 19, 27), "05.08");

    // X-S + X-D + D-S
    const str2 = `<a href=www' class=e" id="f'>`;

    // href opening at 8
    t.true(is(str2, 8, 11), "05.09"); // <--
    t.false(is(str2, 8, 20), "05.10");
    t.false(is(str2, 8, 25), "05.11");
    t.false(is(str2, 8, 27), "05.12");

    // class opening at 19
    t.false(is(str2, 19, 11), "05.13");
    t.true(is(str2, 19, 20), "05.14"); // <--
    t.false(is(str2, 19, 25), "05.15");
    t.false(is(str2, 19, 27), "05.16");

    // X-S + X-D + S-D
    const str3 = `<a href=www' class=e" id='f">`;

    // href opening at 8
    t.true(is(str3, 8, 11), "05.17"); // <--
    t.false(is(str3, 8, 20), "05.18");
    t.false(is(str3, 8, 25), "05.19");
    t.false(is(str3, 8, 27), "05.20");

    // class opening at 19
    t.false(is(str3, 19, 11), "05.21");
    t.true(is(str3, 19, 20), "05.22"); // <--
    t.false(is(str3, 19, 25), "05.23");
    t.false(is(str3, 19, 27), "05.24");

    // X-S + X-D + S-S
    const str4 = `<a href=www' class=e" id='f'>`;

    // href opening at 8
    t.true(is(str4, 8, 11), "05.25"); // <--
    t.false(is(str4, 8, 20), "05.26");
    t.false(is(str4, 8, 25), "05.27");
    t.false(is(str4, 8, 27), "05.28");

    // class opening at 19
    t.false(is(str4, 19, 11), "05.29");
    t.true(is(str4, 19, 20), "05.30"); // <--
    t.false(is(str4, 19, 25), "05.31");
    t.false(is(str4, 19, 27), "05.32");

    // X-S + X-D + S-X
    const str5 = `<a href=www' class=e" id='f>`;

    // href opening at 8
    t.true(is(str5, 8, 11), "05.33"); // <--
    t.false(is(str5, 8, 20), "05.34");
    t.false(is(str5, 8, 25), "05.35");

    // class opening at 19
    t.false(is(str5, 19, 11), "05.36");
    t.true(is(str5, 19, 20), "05.37"); // <--
    t.false(is(str5, 19, 25), "05.38");

    // X-S + X-D + D-X
    const str6 = `<a href=www' class=e" id="f>`;

    // href opening at 8
    t.true(is(str6, 8, 11), "05.39"); // <--
    t.false(is(str6, 8, 20), "05.40");
    t.false(is(str6, 8, 25), "05.41");

    // class opening at 19
    t.false(is(str6, 19, 11), "05.42");
    t.true(is(str6, 19, 20), "05.43"); // <--
    t.false(is(str6, 19, 25), "05.44");

    // X-S + X-D + X-S
    const str7 = `<a href=www' class=e" id=f'>`;

    // href opening at 8
    t.true(is(str7, 8, 11), "05.45"); // <--
    t.false(is(str7, 8, 20), "05.46");
    t.false(is(str7, 8, 26), "05.47");

    // class opening at 19
    t.false(is(str7, 19, 11), "05.48");
    t.true(is(str7, 19, 20), "05.49"); // <--
    t.false(is(str7, 19, 26), "05.50");

    // X-S + X-D + X-D
    const str8 = `<a href=www' class=e" id=f">`;

    // href opening at 8
    t.true(is(str8, 8, 11), "05.51"); // <--
    t.false(is(str8, 8, 20), "05.52");
    t.false(is(str8, 8, 26), "05.53");

    // class opening at 19
    t.false(is(str8, 19, 11), "05.54");
    t.true(is(str8, 19, 20), "05.55"); // <--
    t.false(is(str8, 19, 26), "05.56");

    // fin.
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${36}m${`starting quote missing`}\u001b[${39}m`} - one tag, three attrs - \u001b[${90}m${`X`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m + \u001b[${90}m${`X`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    // X-S + X-S + D-D
    const str1 = `<a href=www' class=e' id="f">`;

    // href opening at 8
    t.true(is(str1, 8, 11), "06.01"); // <--
    t.false(is(str1, 8, 20), "06.02");
    t.false(is(str1, 8, 25), "06.03");
    t.false(is(str1, 8, 27), "06.04");

    // class opening at 19
    t.false(is(str1, 19, 11), "06.05");
    t.true(is(str1, 19, 20), "06.06"); // <--
    t.false(is(str1, 19, 25), "06.07");
    t.false(is(str1, 19, 27), "06.08");

    // X-S + X-S + D-S
    const str2 = `<a href=www' class=e' id="f'>`;

    // href opening at 8
    t.true(is(str2, 8, 11), "06.09"); // <--
    t.false(is(str2, 8, 20), "06.10");
    t.false(is(str2, 8, 25), "06.11");
    t.false(is(str2, 8, 27), "06.12");

    // class opening at 19
    t.false(is(str2, 19, 11), "06.13");
    t.true(is(str2, 19, 20), "06.14"); // <--
    t.false(is(str2, 19, 25), "06.15");
    t.false(is(str2, 19, 27), "06.16");

    // X-S + X-S + S-D
    const str3 = `<a href=www' class=e' id='f">`;

    // href opening at 8
    t.true(is(str3, 8, 11), "06.17"); // <--
    t.false(is(str3, 8, 20), "06.18");
    t.false(is(str3, 8, 25), "06.19");
    t.false(is(str3, 8, 27), "06.20");

    // class opening at 19
    t.false(is(str3, 19, 11), "06.21");
    t.true(is(str3, 19, 20), "06.22"); // <--
    t.false(is(str3, 19, 25), "06.23");
    t.false(is(str3, 19, 27), "06.24");

    // X-S + X-S + S-S
    const str4 = `<a href=www' class=e' id='f'>`;

    // href opening at 8
    t.true(is(str4, 8, 11), "06.25"); // <--
    t.false(is(str4, 8, 20), "06.26");
    t.false(is(str4, 8, 25), "06.27");
    t.false(is(str4, 8, 27), "06.28");

    // class opening at 19
    t.false(is(str4, 19, 11), "06.29");
    t.true(is(str4, 19, 20), "06.30"); // <--
    t.false(is(str4, 19, 25), "06.31");
    t.false(is(str4, 19, 27), "06.32");

    // X-S + X-S + S-X
    const str5 = `<a href=www' class=e' id='f>`;

    // href opening at 8
    t.true(is(str5, 8, 11), "06.33"); // <--
    t.false(is(str5, 8, 20), "06.34");
    t.false(is(str5, 8, 25), "06.35");

    // class opening at 19
    t.false(is(str5, 19, 11), "06.36");
    t.true(is(str5, 19, 20), "06.37"); // <--
    t.false(is(str5, 19, 25), "06.38");

    // X-S + X-S + D-X
    const str6 = `<a href=www' class=e' id="f>`;

    // href opening at 8
    t.true(is(str6, 8, 11), "06.39"); // <--
    t.false(is(str6, 8, 20), "06.40");
    t.false(is(str6, 8, 25), "06.41");

    // class opening at 19
    t.false(is(str6, 19, 11), "06.42");
    t.true(is(str6, 19, 20), "06.43"); // <--
    t.false(is(str6, 19, 25), "06.44");

    // X-S + X-S + X-S
    const str7 = `<a href=www' class=e' id=f'>`;

    // href opening at 8
    t.true(is(str7, 8, 11), "06.45"); // <--
    t.false(is(str7, 8, 20), "06.46");
    t.false(is(str7, 8, 26), "06.47");

    // class opening at 19
    t.false(is(str7, 19, 11), "06.48");
    t.true(is(str7, 19, 20), "06.49"); // <--
    t.false(is(str7, 19, 26), "06.50");

    // X-S + X-S + X-D
    const str8 = `<a href=www' class=e' id=f">`;

    // href opening at 8
    t.true(is(str8, 8, 11), "06.51"); // <--
    t.false(is(str8, 8, 20), "06.52");
    t.false(is(str8, 8, 26), "06.53");

    // class opening at 19
    t.false(is(str8, 19, 11), "06.54");
    t.true(is(str8, 19, 20), "06.55"); // <--
    t.false(is(str8, 19, 26), "06.56");
    // fin.
    t.end();
  }
);
