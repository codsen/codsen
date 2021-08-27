import tap from "tap";
import { isOpening as is } from "../dist/is-html-tag-opening.esm.js";

// self-closing with attributes
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - self-closing tag with attributes`,
  (t) => {
    const s1 = `<br class="a"/>`;
    t.true(is(s1), "01.01");
    t.true(is(s1, 0), "01.02");
    t.true(
      is(s1, 0, {
        allowCustomTagNames: true,
      }),
      "01.03"
    );
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - self-closing tag with attributes`,
  (t) => {
    const s2 = `< br class="a"/>`;
    t.true(is(s2), "02.01");
    t.true(is(s2, 0), "02.02");
    t.true(
      is(s2, 0, {
        allowCustomTagNames: true,
      }),
      "02.03"
    );
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - self-closing tag with attributes`,
  (t) => {
    const s3 = `<br class="a" />`;
    t.true(is(s3), "03.01");
    t.true(is(s3, 0), "03.02");
    t.true(
      is(s3, 0, {
        allowCustomTagNames: true,
      }),
      "03.03"
    );
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - self-closing tag with attributes`,
  (t) => {
    const s4 = `<br class="a"/ >`;
    t.true(is(s4), "04.01");
    t.true(is(s4, 0), "04.02");
    t.true(
      is(s4, 0, {
        allowCustomTagNames: true,
      }),
      "04.03"
    );
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - self-closing tag with attributes`,
  (t) => {
    const s5 = `<br class="a" / >`;
    t.true(is(s5), "05.01");
    t.true(is(s5, 0), "05.02");
    t.true(
      is(s5, 0, {
        allowCustomTagNames: true,
      }),
      "05.03"
    );
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - self-closing tag with attributes`,
  (t) => {
    const s6 = `< br class="a" / >`;
    t.true(is(s6), "06.01");
    t.true(is(s6, 0), "06.02");
    t.true(
      is(s6, 0, {
        allowCustomTagNames: true,
      }),
      "06.03"
    );
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - self-closing tag with attributes`,
  (t) => {
    const s7 = `< br class = "a"  id ='z' / >`;
    t.true(is(s7), "07.01");
    t.true(is(s7, 0), "07.02");
    t.true(
      is(s7, 0, {
        allowCustomTagNames: true,
      }),
      "07.03"
    );
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - self-closing tag with attributes`,
  (t) => {
    const s8 = `< br class = "a'  id = "z' / >`;
    t.true(is(s8), "08.01");
    t.true(is(s8, 0), "08.02");
    t.true(
      is(s8, 0, {
        allowCustomTagNames: true,
      }),
      "08.03"
    );
    t.end();
  }
);
