import tap from "tap";
import is from "../dist/is-html-attribute-closing.esm";
// const BACKSLASH = "\u005C";

// healthy code
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${36}m${`healthy code`}\u001b[${39}m`} - one tag, one attr, double quotes`,
  (t) => {
    const str = `<a href="zzz">`;
    t.true(is(str, 8, 12), "01");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${36}m${`healthy code`}\u001b[${39}m`} - one tag, one attr, single quotes`,
  (t) => {
    const str = `<a href='zzz'>`;
    t.true(is(str, 8, 12), "02");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${36}m${`healthy code`}\u001b[${39}m`} - one tag, few attrs, double quotes`,
  (t) => {
    const str = `<a href="zzz" target="_blank" style="color: black;">`;
    // 1. starting at the opening of "href":
    t.false(is(str, 8, 8), "03.01");
    t.true(is(str, 8, 12), "03.02"); // <--
    t.false(is(str, 8, 21), "03.03");
    t.false(is(str, 8, 28), "03.04");
    t.false(is(str, 8, 36), "03.05");
    t.false(is(str, 8, 50), "03.06");

    // 2. starting at the opening of "target":
    t.false(is(str, 21, 8), "03.07");
    t.false(is(str, 21, 12), "03.08");
    t.false(is(str, 21, 21), "03.09");
    t.true(is(str, 21, 28), "03.10"); // <--
    t.false(is(str, 21, 36), "03.11");
    t.false(is(str, 21, 50), "03.12");

    // 3. starting at the opening of "style":
    t.false(is(str, 36, 8), "03.13");
    t.false(is(str, 36, 12), "03.14");
    t.false(is(str, 36, 21), "03.15");
    t.false(is(str, 36, 28), "03.16");
    t.false(is(str, 36, 36), "03.17");
    t.true(is(str, 36, 50), "03.18"); // <--

    // fin.
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${36}m${`healthy code`}\u001b[${39}m`} - one tag, few attrs, single quotes`,
  (t) => {
    const str = `<a href='zzz' target='_blank' style='color: black;'>`;
    // 1. starting at the opening of "href":
    t.false(is(str, 8, 8), "04.01");
    t.true(is(str, 8, 12), "04.02"); // <--
    t.false(is(str, 8, 21), "04.03");
    t.false(is(str, 8, 28), "04.04");
    t.false(is(str, 8, 36), "04.05");
    t.false(is(str, 8, 50), "04.06");

    // 2. starting at the opening of "target":
    t.false(is(str, 21, 8), "04.07");
    t.false(is(str, 21, 12), "04.08");
    t.false(is(str, 21, 21), "04.09");
    t.true(is(str, 21, 28), "04.10"); // <--
    t.false(is(str, 21, 36), "04.11");
    t.false(is(str, 21, 50), "04.12");

    // 3. starting at the opening of "style":
    t.false(is(str, 36, 8), "04.13");
    t.false(is(str, 36, 12), "04.14");
    t.false(is(str, 36, 21), "04.15");
    t.false(is(str, 36, 28), "04.16");
    t.false(is(str, 36, 36), "04.17");
    t.true(is(str, 36, 50), "04.18"); // <--

    // fin.
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${36}m${`healthy code`}\u001b[${39}m`} - repeated singles inside doubles`,
  (t) => {
    const str = `<img src="spacer.gif" alt="'''''" width="1" height="1" border="0" style="display:block;"/>`;
    // 0. warmup
    t.true(is(str, 9, 20), "05.01");

    // 1. the bizness
    t.false(is(str, 26, 9), "05.02");
    t.false(is(str, 26, 20), "05.03");
    t.false(is(str, 26, 26), "05.04");
    t.false(is(str, 26, 27), "05.05");
    t.false(is(str, 26, 28), "05.06");
    t.false(is(str, 26, 29), "05.07");
    t.false(is(str, 26, 30), "05.08");
    t.false(is(str, 26, 31), "05.09");
    t.true(is(str, 26, 32), "05.10"); // <--
    t.false(is(str, 26, 40), "05.11");

    // fin.
    t.end();
  }
);

tap.test(`06`, (t) => {
  const str = `<body alink="">`;
  t.true(is(str, 12, 13), "06");
  t.end();
});
