import tap from "tap";
import is from "../dist/is-html-attribute-closing.esm";
// const BACKSLASH = "\u005C";

// unclosed tags
// -----------------------------------------------------------------------------
//   LEGEND: S means single, D means double, X means absent

tap.test(
  `01 - ${`\u001b[${31}m${`unclosed tags`}\u001b[${39}m`} - missing tag ending follows - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    const str = `<a href="z" click here</a>`;
    t.true(is(str, 8, 10), "01");

    // fin.
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${31}m${`unclosed tags`}\u001b[${39}m`} - missing tag ending follows - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    const str = `<a href="z' click here</a>`;
    t.true(is(str, 8, 10), "02");

    // fin.
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${31}m${`unclosed tags`}\u001b[${39}m`} - missing tag ending follows - \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    const str = `<a href='z" click here</a>`;
    t.true(is(str, 8, 10), "03");

    // fin.
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${31}m${`unclosed tags`}\u001b[${39}m`} - missing tag ending follows - \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    const str = `<a href='z' click here</a>`;
    t.true(is(str, 8, 10), "04");

    // fin.
    t.end();
  }
);

// -----------------------------------------------------------------------------

tap.test(
  `05 - ${`\u001b[${31}m${`unclosed tags`}\u001b[${39}m`} - attr + missing tag ending follows - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    // D-D follows
    const str1 = `<a href="z" class="yo" click here</a>`;
    t.true(is(str1, 8, 10), "05.01");
    t.false(is(str1, 8, 18), "05.02");
    t.false(is(str1, 8, 21), "05.03");

    // D-S follows
    const str2 = `<a href="z" class="yo' click here</a>`;
    t.true(is(str2, 8, 10), "05.04");
    t.false(is(str2, 8, 18), "05.05");
    t.false(is(str2, 8, 21), "05.06");

    // S-D follows
    const str3 = `<a href="z" class='yo" click here</a>`;
    t.true(is(str3, 8, 10), "05.07");
    t.false(is(str3, 8, 18), "05.08");
    t.false(is(str3, 8, 21), "05.09");

    // S-S follows
    const str4 = `<a href="z" class='yo' click here</a>`;
    t.true(is(str4, 8, 10), "05.10");
    t.false(is(str4, 8, 18), "05.11");
    t.false(is(str4, 8, 21), "05.12");

    // fin.
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${31}m${`unclosed tags`}\u001b[${39}m`} - attr + missing tag ending follows - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    // D-D follows
    const str1 = `<a href="z' class="yo" click here</a>`;
    t.true(is(str1, 8, 10), "06.01");
    t.false(is(str1, 8, 18), "06.02");
    t.false(is(str1, 8, 21), "06.03");

    // D-S follows
    const str2 = `<a href="z' class="yo' click here</a>`;
    t.true(is(str2, 8, 10), "06.04");
    t.false(is(str2, 8, 18), "06.05");
    t.false(is(str2, 8, 21), "06.06");

    // S-D follows
    const str3 = `<a href="z' class='yo" click here</a>`;
    t.true(is(str3, 8, 10), "06.07");
    t.false(is(str3, 8, 18), "06.08");
    t.false(is(str3, 8, 21), "06.09");

    // S-S follows
    const str4 = `<a href="z' class='yo' click here</a>`;
    t.true(is(str4, 8, 10), "06.10");
    t.false(is(str4, 8, 18), "06.11");
    t.false(is(str4, 8, 21), "06.12");

    // fin.
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${31}m${`unclosed tags`}\u001b[${39}m`} - attr + missing tag ending follows - \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    // D-D follows
    const str1 = `<a href='z" class="yo" click here</a>`;
    t.true(is(str1, 8, 10), "07.01");
    t.false(is(str1, 8, 18), "07.02");
    t.false(is(str1, 8, 21), "07.03");

    // D-S follows
    const str2 = `<a href='z" class="yo' click here</a>`;
    t.true(is(str2, 8, 10), "07.04");
    t.false(is(str2, 8, 18), "07.05");
    t.false(is(str2, 8, 21), "07.06");

    // S-D follows
    const str3 = `<a href='z" class='yo" click here</a>`;
    t.true(is(str3, 8, 10), "07.07");
    t.false(is(str3, 8, 18), "07.08");
    t.false(is(str3, 8, 21), "07.09");

    // S-S follows
    const str4 = `<a href='z" class='yo' click here</a>`;
    t.true(is(str4, 8, 10), "07.10");
    t.false(is(str4, 8, 18), "07.11");
    t.false(is(str4, 8, 21), "07.12");

    // fin.
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${31}m${`unclosed tags`}\u001b[${39}m`} - attr + missing tag ending follows - \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    // D-D follows
    const str1 = `<a href='z' class="yo" click here</a>`;
    t.true(is(str1, 8, 10), "08.01");
    t.false(is(str1, 8, 18), "08.02");
    t.false(is(str1, 8, 21), "08.03");

    // D-S follows
    const str2 = `<a href='z' class="yo' click here</a>`;
    t.true(is(str2, 8, 10), "08.04");
    t.false(is(str2, 8, 18), "08.05");
    t.false(is(str2, 8, 21), "08.06");

    // S-D follows
    const str3 = `<a href='z' class='yo" click here</a>`;
    t.true(is(str3, 8, 10), "08.07");
    t.false(is(str3, 8, 18), "08.08");
    t.false(is(str3, 8, 21), "08.09");

    // S-S follows
    const str4 = `<a href='z' class='yo' click here</a>`;
    t.true(is(str4, 8, 10), "08.10");
    t.false(is(str4, 8, 18), "08.11");
    t.false(is(str4, 8, 21), "08.12");

    // fin.
    t.end();
  }
);

// -----------------------------------------------------------------------------

tap.test(
  `09 - ${`\u001b[${31}m${`unclosed tags`}\u001b[${39}m`} - tight - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    const str = `<a href="z"</a>`;
    t.true(is(str, 8, 10), "09");

    // fin.
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${31}m${`unclosed tags`}\u001b[${39}m`} - tight - \u001b[${31}m${`D`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    const str = `<a href="z'</a>`;
    t.true(is(str, 8, 10), "10");

    // fin.
    t.end();
  }
);

tap.test(
  `11 - ${`\u001b[${31}m${`unclosed tags`}\u001b[${39}m`} - tight - \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${31}m${`D`}\u001b[${39}m`,
  (t) => {
    const str = `<a href='z"</a>`;
    t.true(is(str, 8, 10), "11");

    // fin.
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${31}m${`unclosed tags`}\u001b[${39}m`} - tight - \u001b[${33}m${`S`}\u001b[${39}m-\u001b[${33}m${`S`}\u001b[${39}m`,
  (t) => {
    const str = `<a href='z'</a>`;
    t.true(is(str, 8, 10), "12");

    // fin.
    t.end();
  }
);
