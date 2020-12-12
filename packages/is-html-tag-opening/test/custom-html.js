import tap from "tap";
import is from "../dist/is-html-tag-opening.esm";

// custom HTML tag names
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${36}m${`custom`}\u001b[${39}m`} - starts with dash, allowCustomTagNames=off`,
  (t) => {
    const s1 = `<-a-b>`;
    t.false(is(s1, 0), "01");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${36}m${`custom`}\u001b[${39}m`} - starts with dash, allowCustomTagNames=on`,
  (t) => {
    const s1 = `<-a-b>`;
    t.false(
      is(s1, 0, {
        allowCustomTagNames: true,
      }),
      "02"
    );
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${36}m${`custom`}\u001b[${39}m`} - dash between chars`,
  (t) => {
    const s1 = `<a-b>`;
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
  `04 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - one letter tag, allowCustomTagNames=off`,
  (t) => {
    const s1 = `<c>`;
    t.false(
      is(s1, 0, {
        allowCustomTagNames: false,
      }),
      "04"
    );
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - one letter tag, allowCustomTagNames=on`,
  (t) => {
    const s1 = `<c>`;
    t.true(
      is(s1, 0, {
        allowCustomTagNames: true,
      }),
      "05"
    );
    t.end();
  }
);
