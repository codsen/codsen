import tap from "tap";
import { isOpening as is } from "../dist/is-html-tag-opening.esm";

// closing tag
// -----------------------------------------------------------------------------

tap.test(`01 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - closing tag`, (t) => {
  // closing tag
  const str = `</td>`;
  t.true(is(str), "01.01");
  t.true(is(str, 0), "01.02");
  t.true(
    is(str, 0, {
      allowCustomTagNames: true,
    }),
    "01.03"
  );

  t.false(is(str, 1), "01.04");
  t.true(
    is(str, 1, {
      skipOpeningBracket: true,
    }),
    "01.05"
  );
  t.end();
});

tap.test(`02 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - closing tag`, (t) => {
  const str = `</ td>`;
  t.true(is(str), "02.01");
  t.true(is(str, 0), "02.02");
  t.true(
    is(str, 0, {
      allowCustomTagNames: true,
    }),
    "02.03"
  );

  t.false(is(str, 1), "02.04");
  t.true(
    is(str, 1, {
      skipOpeningBracket: true,
    }),
    "02.05"
  );
  t.end();
});

tap.test(`03 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - closing tag`, (t) => {
  const str = `< / td>`;
  t.true(is(str), "03.01");
  t.true(is(str, 0), "03.02");
  t.true(
    is(str, 0, {
      allowCustomTagNames: true,
    }),
    "03.03"
  );

  t.false(is(str, 1), "03.04");
  t.true(
    is(str, 1, {
      skipOpeningBracket: true,
    }),
    "03.05"
  );
  t.end();
});

tap.test(`04 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - closing tag`, (t) => {
  const str = `</ td >`;
  t.true(is(str), "04.01");
  t.true(is(str, 0), "04.02");
  t.true(
    is(str, 0, {
      allowCustomTagNames: true,
    }),
    "04.03"
  );

  t.false(is(str, 1), "04.04");
  t.true(
    is(str, 1, {
      skipOpeningBracket: true,
    }),
    "04.05"
  );
  t.end();
});

tap.test(`05 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - closing tag`, (t) => {
  const str = `< / td >`;
  t.true(is(str), "05.01");
  t.true(is(str, 0), "05.02");
  t.true(
    is(str, 0, {
      allowCustomTagNames: true,
    }),
    "05.03"
  );

  t.false(is(str, 1), "05.04");
  t.true(
    is(str, 1, {
      skipOpeningBracket: true,
    }),
    "05.05"
  );
  t.end();
});
