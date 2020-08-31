import tap from "tap";
import is from "../dist/is-html-tag-opening.esm";

// opening tag
// -----------------------------------------------------------------------------

tap.test(`01 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - tag`, (t) => {
  const str = `<a>`;
  t.ok(is(str), "01.01");
  t.ok(is(str, 0), "01.02");
  t.ok(
    is(str, 0, {
      allowCustomTagNames: true,
    }),
    "01.03"
  );

  t.false(is(str, 1), "01.04");
  t.ok(
    is(str, 1, {
      skipOpeningBracket: true,
    }),
    "01.05"
  );
  t.end();
});

tap.test(`02 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - tag`, (t) => {
  const str = `<img>`;
  t.ok(is(str), "02.01");
  t.ok(is(str, 0), "02.02");
  t.ok(
    is(str, 0, {
      allowCustomTagNames: true,
    }),
    "02.03"
  );

  t.false(is(str, 1), "02.04");
  t.ok(
    is(str, 1, {
      skipOpeningBracket: true,
    }),
    "02.05"
  );
  t.end();
});

tap.test(`03 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - tag`, (t) => {
  const str = `<img alt="">`;
  t.ok(is(str), "03.01");
  t.ok(is(str, 0), "03.02");
  t.ok(
    is(str, 0, {
      allowCustomTagNames: true,
    }),
    "03.03"
  );

  t.false(is(str, 1), "03.04");
  t.ok(
    is(str, 1, {
      skipOpeningBracket: true,
    }),
    "03.05"
  );
  t.end();
});

tap.test(`04 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - tag`, (t) => {
  const str = `<img alt="zzz">`;
  t.ok(is(str), "04.01");
  t.ok(is(str, 0), "04.02");
  t.ok(
    is(str, 0, {
      allowCustomTagNames: true,
    }),
    "04.03"
  );

  t.false(is(str, 1), "04.04");
  t.ok(
    is(str, 1, {
      skipOpeningBracket: true,
    }),
    "04.05"
  );
  t.end();
});

tap.test(`05 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - tag`, (t) => {
  const str = `<td nowrap>`;
  t.ok(is(str), "05.01"); // <---- true because tag name was recognised
  t.ok(is(str, 0), "05.02");
  t.ok(
    is(str, 0, {
      allowCustomTagNames: true,
    }),
    "05.03"
  );

  t.false(is(str, 1), "05.04");
  t.false(
    is(str, 1, {
      skipOpeningBracket: true,
    }),
    "05.05"
  );
  t.end();
});

tap.test(`06 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - tag`, (t) => {
  const str = `<zzz nowrap>`;
  t.false(is(str), "06.01"); // <---- false because tag name was not recognised and there were no attrs
  t.false(is(str, 0), "06.02");
  t.false(
    is(str, 0, {
      allowCustomTagNames: true,
    }),
    "06.03"
  );

  t.false(is(str, 1), "06.04");
  t.false(
    is(str, 1, {
      skipOpeningBracket: true,
    }),
    "06.05"
  );
  t.end();
});

tap.test(`07 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - tag`, (t) => {
  const str = `<td class="klm" nowrap>`;
  t.ok(is(str), "07.01");
  t.ok(is(str, 0), "07.02");
  t.ok(
    is(str, 0, {
      allowCustomTagNames: true,
    }),
    "07.03"
  );

  t.false(is(str, 1), "07.04");
  t.ok(
    is(str, 1, {
      skipOpeningBracket: true,
    }),
    "07.05"
  );
  t.end();
});

tap.test(`08 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - tag`, (t) => {
  const str = `<td nowrap class="klm">`;
  t.ok(is(str), "08.01");
  t.ok(is(str, 0), "08.02");
  t.ok(
    is(str, 0, {
      allowCustomTagNames: true,
    }),
    "08.03"
  );

  t.false(is(str, 1), "08.04");
  t.ok(
    is(str, 1, {
      skipOpeningBracket: true,
    }),
    "08.05"
  );
  t.end();
});

tap.test(`09 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - tag`, (t) => {
  const str = `<td nowrap nowrap nowrap nowrap nowrap nowrap nowrap nowrap nowrap nowrap class="klm"`;
  t.ok(is(str), "09.01");
  t.ok(is(str, 0), "09.02");
  t.ok(
    is(str, 0, {
      allowCustomTagNames: true,
    }),
    "09.03"
  );

  t.false(is(str, 1), "09.04");
  t.ok(
    is(str, 1, {
      skipOpeningBracket: true,
    }),
    "09.05"
  );
  t.end();
});

tap.test(`10 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - tag`, (t) => {
  const str = `<html dir="ltr">`;
  t.false(is(str, 6), "10.01");
  t.false(
    is(str, 6, {
      allowCustomTagNames: true,
    }),
    "10.02"
  );
  t.false(
    is(str, 6, {
      skipOpeningBracket: true,
    }),
    "10.03"
  );
  t.end();
});
