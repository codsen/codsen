import tap from "tap";
import is from "../dist/is-html-tag-opening.esm";

const BACKSLASH = "\u005C";

// ad-hoc
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${36}m${`ad-hoc`}\u001b[${39}m`} - idx on defaults`,
  (t) => {
    t.false(is("a"), "01.01");
    t.false(is("<"), "01.02");
    t.false(is(">"), "01.03");
    t.true(is("<a>"), "01.04");
    t.end();
  }
);

tap.test(`02 - ${`\u001b[${36}m${`ad-hoc`}\u001b[${39}m`} - ad-hoc`, (t) => {
  const s1 = `<a b="ccc"<d>`;
  t.ok(is(s1, 0), "02.01");
  t.false(is(s1, 6), "02.02");
  t.false(is(s1, 10), "02.03");

  t.ok(
    is(s1, 0, {
      allowCustomTagNames: true,
    }),
    "02.04"
  );
  t.false(
    is(s1, 6, {
      allowCustomTagNames: true,
    }),
    "02.05"
  );
  t.ok(
    is(s1, 10, {
      allowCustomTagNames: true,
    }),
    "02.06"
  );
  t.end();
});

tap.test(`03 - ${`\u001b[${36}m${`ad-hoc`}\u001b[${39}m`} - ad-hoc`, (t) => {
  const s1 = `a < b`;
  t.false(is(s1, 2), "03.01");
  t.false(
    is(s1, 2, {
      allowCustomTagNames: true,
    }),
    "03.02"
  );
  t.end();
});

tap.test(`04 - ${`\u001b[${36}m${`ad-hoc`}\u001b[${39}m`} - ad-hoc`, (t) => {
  const s1 = `<span>a < b<span>`;
  t.ok(is(s1, 0), "04.01");
  t.false(is(s1, 8), "04.02");
  t.ok(is(s1, 11), "04.03");

  t.ok(
    is(s1, 0, {
      allowCustomTagNames: true,
    }),
    "04.04"
  );
  t.false(
    is(s1, 8, {
      allowCustomTagNames: true,
    }),
    "04.05"
  );
  t.ok(
    is(s1, 11, {
      allowCustomTagNames: true,
    }),
    "04.06"
  );
  t.end();
});

tap.test(`05 - ${`\u001b[${36}m${`ad-hoc`}\u001b[${39}m`} - ad-hoc`, (t) => {
  const s1 = `\n<table`;
  t.ok(is(s1, 1), "05.01");
  t.ok(
    is(s1, 1, {
      allowCustomTagNames: true,
    }),
    "05.02"
  );
  t.end();
});

tap.test(`06 - ${`\u001b[${36}m${`ad-hoc`}\u001b[${39}m`} - ad-hoc`, (t) => {
  const s1 = `<br${BACKSLASH}>`;
  t.ok(is(s1, 0), "06.01");
  t.ok(
    is(s1, 0, {
      allowCustomTagNames: true,
    }),
    "06.02"
  );
  t.end();
});

tap.test(`07 - ${`\u001b[${36}m${`ad-hoc`}\u001b[${39}m`} - ad-hoc`, (t) => {
  const s1 = `< ${BACKSLASH} br ${BACKSLASH} >`;
  t.ok(is(s1, 0), "07.01");
  t.ok(
    is(s1, 0, {
      allowCustomTagNames: true,
    }),
    "07.02"
  );
  t.end();
});

tap.test(`08 - ${`\u001b[${36}m${`ad-hoc`}\u001b[${39}m`} - ad-hoc`, (t) => {
  const s1 = `<\t${BACKSLASH}///\t${BACKSLASH}${BACKSLASH}${BACKSLASH} br ${BACKSLASH} >`;
  t.ok(is(s1, 0), "08.01");
  t.ok(
    is(s1, 0, {
      allowCustomTagNames: true,
    }),
    "08.02"
  );
  t.end();
});

tap.test(`09 - ${`\u001b[${36}m${`ad-hoc`}\u001b[${39}m`} - ad-hoc`, (t) => {
  const s1 = `let's say that a < b and c > d.`;
  t.false(is(s1, 17), "09.01");
  t.false(
    is(s1, 17, {
      allowCustomTagNames: true,
    }),
    "09.02"
  );
  t.end();
});

tap.test(`10 - ${`\u001b[${36}m${`ad-hoc`}\u001b[${39}m`} - ad-hoc`, (t) => {
  const s1 = `<zzz accept="utf-8" yyy>`;
  // by default, custom tag names are not allowed:
  t.false(is(s1, 0), "10.01");

  // but enabling them result is positive
  t.ok(
    is(s1, 0, {
      allowCustomTagNames: true,
    }),
    "10.02"
  );
  t.end();
});

tap.test(`11 - ${`\u001b[${36}m${`ad-hoc`}\u001b[${39}m`} - ad-hoc`, (t) => {
  const s1 = `<zzz accept-charset="utf-8" yyy>`;
  t.false(is(s1, 0), "11.01");
  t.ok(
    is(s1, 0, {
      allowCustomTagNames: true,
    }),
    "11.02"
  );
  t.end();
});

tap.test(
  `12 - ${`\u001b[${36}m${`ad-hoc`}\u001b[${39}m`} - custom html tags with dashes`,
  (t) => {
    const s1 = `<something-here>`;
    t.false(is(s1, 0), "12.01");
    t.ok(
      is(s1, 0, {
        allowCustomTagNames: true,
      }),
      "12.02"
    );
    t.end();
  }
);

// https://www.fileformat.info/info/unicode/char/1f600/index.htm
tap.test(
  `13 - ${`\u001b[${36}m${`ad-hoc`}\u001b[${39}m`} - custom html tags with dashes`,
  (t) => {
    const s1 = `<emoji-\uD83D\uDE00>`;
    t.false(is(s1, 0), "13.01");
    t.ok(
      is(s1, 0, {
        allowCustomTagNames: true,
      }),
      "13.02"
    );
    t.end();
  }
);
