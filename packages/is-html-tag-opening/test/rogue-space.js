import tap from "tap";
import is from "../dist/is-html-tag-opening.esm";

const BACKSLASH = "\u005C";

// rogue space cases
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${36}m${`broken code`}\u001b[${39}m`} - spaces around`,
  (t) => {
    const s1 = `< p >`;
    t.true(is(s1, 0), "01.01");
    t.true(
      is(s1, 0, {
        allowCustomTagNames: true,
      }),
      "01.02"
    );
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${36}m${`broken code`}\u001b[${39}m`} - spaces around`,
  (t) => {
    const s1 = `< / p >`;
    t.true(is(s1, 0), "02.01");
    t.true(
      is(s1, 0, {
        allowCustomTagNames: true,
      }),
      "02.02"
    );
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${36}m${`broken code`}\u001b[${39}m`} - spaces around`,
  (t) => {
    const s1 = `< b / >`;
    t.true(is(s1, 0), "03.01");
    t.true(
      is(s1, 0, {
        allowCustomTagNames: true,
      }),
      "03.02"
    );
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${36}m${`broken code`}\u001b[${39}m`} - spaces around`,
  (t) => {
    const s1 = `< ${BACKSLASH} b / >`;
    t.true(is(s1, 0), "04.01");
    t.true(
      is(s1, 0, {
        allowCustomTagNames: true,
      }),
      "04.02"
    );
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${36}m${`broken code`}\u001b[${39}m`} - spaces around`,
  (t) => {
    const s1 = `</td nowrap yo yo/>`;
    t.true(is(s1, 0), "05.01");
    t.true(
      is(s1, 0, {
        allowCustomTagNames: true,
      }),
      "05.02"
    );
    t.end();
  }
);
