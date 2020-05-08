import tap from "tap";
import is from "../dist/is-html-tag-opening.esm";

const BACKSLASH = "\u005C";

// 01. opening tag
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

// 02. closing tag
// -----------------------------------------------------------------------------

tap.test(`11 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - closing tag`, (t) => {
  // closing tag
  const str = `</td>`;
  t.ok(is(str), "11.01");
  t.ok(is(str, 0), "11.02");
  t.ok(
    is(str, 0, {
      allowCustomTagNames: true,
    }),
    "11.03"
  );

  t.false(is(str, 1), "11.04");
  t.ok(
    is(str, 1, {
      skipOpeningBracket: true,
    }),
    "11.05"
  );
  t.end();
});

tap.test(`12 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - closing tag`, (t) => {
  const str = `</ td>`;
  t.ok(is(str), "12.01");
  t.ok(is(str, 0), "12.02");
  t.ok(
    is(str, 0, {
      allowCustomTagNames: true,
    }),
    "12.03"
  );

  t.false(is(str, 1), "12.04");
  t.ok(
    is(str, 1, {
      skipOpeningBracket: true,
    }),
    "12.05"
  );
  t.end();
});

tap.test(`13 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - closing tag`, (t) => {
  const str = `< / td>`;
  t.ok(is(str), "13.01");
  t.ok(is(str, 0), "13.02");
  t.ok(
    is(str, 0, {
      allowCustomTagNames: true,
    }),
    "13.03"
  );

  t.false(is(str, 1), "13.04");
  t.ok(
    is(str, 1, {
      skipOpeningBracket: true,
    }),
    "13.05"
  );
  t.end();
});

tap.test(`14 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - closing tag`, (t) => {
  const str = `</ td >`;
  t.ok(is(str), "14.01");
  t.ok(is(str, 0), "14.02");
  t.ok(
    is(str, 0, {
      allowCustomTagNames: true,
    }),
    "14.03"
  );

  t.false(is(str, 1), "14.04");
  t.ok(
    is(str, 1, {
      skipOpeningBracket: true,
    }),
    "14.05"
  );
  t.end();
});

tap.test(`15 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - closing tag`, (t) => {
  const str = `< / td >`;
  t.ok(is(str), "15.01");
  t.ok(is(str, 0), "15.02");
  t.ok(
    is(str, 0, {
      allowCustomTagNames: true,
    }),
    "15.03"
  );

  t.false(is(str, 1), "15.04");
  t.ok(
    is(str, 1, {
      skipOpeningBracket: true,
    }),
    "15.05"
  );
  t.end();
});

// 03. self-closing tag
// -----------------------------------------------------------------------------

tap.test(
  `16 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - self-closing tag`,
  (t) => {
    const str = `<br/>`;
    t.ok(is(str), "16.01");
    t.ok(is(str, 0), "16.02");
    t.ok(
      is(str, 0, {
        allowCustomTagNames: true,
      }),
      "16.03"
    );

    t.false(is(str, 1), "16.04");
    t.ok(
      is(str, 1, {
        skipOpeningBracket: true,
      }),
      "16.05"
    );
    t.end();
  }
);

tap.test(
  `17 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - self-closing tag`,
  (t) => {
    const str = `< br/>`;
    t.ok(is(str), "17.01");
    t.ok(is(str, 0), "17.02");
    t.ok(
      is(str, 0, {
        allowCustomTagNames: true,
      }),
      "17.03"
    );

    t.false(is(str, 2), "17.04");
    t.ok(
      is(str, 2, {
        skipOpeningBracket: true,
      }),
      "17.05"
    );
    t.end();
  }
);

tap.test(
  `18 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - self-closing tag`,
  (t) => {
    const str = `<br />`;
    t.ok(is(str), "18.01");
    t.ok(is(str, 0), "18.02");
    t.ok(
      is(str, 0, {
        allowCustomTagNames: true,
      }),
      "18.03"
    );

    t.false(is(str, 1), "18.04");
    t.ok(
      is(str, 1, {
        skipOpeningBracket: true,
      }),
      "18.05"
    );
    t.end();
  }
);

tap.test(
  `19 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - self-closing tag`,
  (t) => {
    const str = `<br/ >`;
    t.ok(is(str), "19.01");
    t.ok(is(str, 0), "19.02");
    t.ok(
      is(str, 0, {
        allowCustomTagNames: true,
      }),
      "19.03"
    );

    t.false(is(str, 1), "19.04");
    t.ok(
      is(str, 1, {
        skipOpeningBracket: true,
      }),
      "19.05"
    );
    t.end();
  }
);

tap.test(
  `20 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - self-closing tag`,
  (t) => {
    const str = `<br / >`;
    t.ok(is(str), "20.01");
    t.ok(is(str, 0), "20.02");
    t.ok(
      is(str, 0, {
        allowCustomTagNames: true,
      }),
      "20.03"
    );

    t.false(is(str, 1), "20.04");
    t.ok(
      is(str, 1, {
        skipOpeningBracket: true,
      }),
      "20.05"
    );
    t.end();
  }
);

tap.test(
  `21 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - self-closing tag`,
  (t) => {
    const str = `< br / >`;
    t.ok(is(str), "21.01");
    t.ok(is(str, 0), "21.02");
    t.ok(
      is(str, 0, {
        allowCustomTagNames: true,
      }),
      "21.03"
    );

    t.false(is(str, 1), "21.04");
    t.ok(
      is(str, 1, {
        skipOpeningBracket: true,
      }),
      "21.05"
    );
    t.end();
  }
);

// 04. self-closing with attributes
// -----------------------------------------------------------------------------

tap.test(
  `22 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - self-closing tag with attributes`,
  (t) => {
    const s1 = `<br class="a"/>`;
    t.ok(is(s1), "22.01");
    t.ok(is(s1, 0), "22.02");
    t.ok(
      is(s1, 0, {
        allowCustomTagNames: true,
      }),
      "22.03"
    );
    t.end();
  }
);

tap.test(
  `23 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - self-closing tag with attributes`,
  (t) => {
    const s2 = `< br class="a"/>`;
    t.ok(is(s2), "23.01");
    t.ok(is(s2, 0), "23.02");
    t.ok(
      is(s2, 0, {
        allowCustomTagNames: true,
      }),
      "23.03"
    );
    t.end();
  }
);

tap.test(
  `24 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - self-closing tag with attributes`,
  (t) => {
    const s3 = `<br class="a" />`;
    t.ok(is(s3), "24.01");
    t.ok(is(s3, 0), "24.02");
    t.ok(
      is(s3, 0, {
        allowCustomTagNames: true,
      }),
      "24.03"
    );
    t.end();
  }
);

tap.test(
  `25 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - self-closing tag with attributes`,
  (t) => {
    const s4 = `<br class="a"/ >`;
    t.ok(is(s4), "25.01");
    t.ok(is(s4, 0), "25.02");
    t.ok(
      is(s4, 0, {
        allowCustomTagNames: true,
      }),
      "25.03"
    );
    t.end();
  }
);

tap.test(
  `26 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - self-closing tag with attributes`,
  (t) => {
    const s5 = `<br class="a" / >`;
    t.ok(is(s5), "26.01");
    t.ok(is(s5, 0), "26.02");
    t.ok(
      is(s5, 0, {
        allowCustomTagNames: true,
      }),
      "26.03"
    );
    t.end();
  }
);

tap.test(
  `27 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - self-closing tag with attributes`,
  (t) => {
    const s6 = `< br class="a" / >`;
    t.ok(is(s6), "27.01");
    t.ok(is(s6, 0), "27.02");
    t.ok(
      is(s6, 0, {
        allowCustomTagNames: true,
      }),
      "27.03"
    );
    t.end();
  }
);

tap.test(
  `28 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - self-closing tag with attributes`,
  (t) => {
    const s7 = `< br class = "a"  id ='z' / >`;
    t.ok(is(s7), "28.01");
    t.ok(is(s7, 0), "28.02");
    t.ok(
      is(s7, 0, {
        allowCustomTagNames: true,
      }),
      "28.03"
    );
    t.end();
  }
);

tap.test(
  `29 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - self-closing tag with attributes`,
  (t) => {
    const s8 = `< br class = "a'  id = "z' / >`;
    t.ok(is(s8), "29.01");
    t.ok(is(s8, 0), "29.02");
    t.ok(
      is(s8, 0, {
        allowCustomTagNames: true,
      }),
      "29.03"
    );
    t.end();
  }
);

// 05. ad-hoc
// -----------------------------------------------------------------------------

tap.test(`30 - ${`\u001b[${36}m${`ad-hoc`}\u001b[${39}m`} - ad-hoc`, (t) => {
  const s1 = `<a b="ccc"<d>`;
  t.ok(is(s1, 0), "30.01");
  t.false(is(s1, 6), "30.02");
  t.false(is(s1, 10), "30.03");

  t.ok(
    is(s1, 0, {
      allowCustomTagNames: true,
    }),
    "30.04"
  );
  t.false(
    is(s1, 6, {
      allowCustomTagNames: true,
    }),
    "30.05"
  );
  t.ok(
    is(s1, 10, {
      allowCustomTagNames: true,
    }),
    "30.06"
  );
  t.end();
});

tap.test(`31 - ${`\u001b[${36}m${`ad-hoc`}\u001b[${39}m`} - ad-hoc`, (t) => {
  const s1 = `a < b`;
  t.false(is(s1, 2), "31.01");
  t.false(
    is(s1, 2, {
      allowCustomTagNames: true,
    }),
    "31.02"
  );
  t.end();
});

tap.test(`32 - ${`\u001b[${36}m${`ad-hoc`}\u001b[${39}m`} - ad-hoc`, (t) => {
  const s1 = `<span>a < b<span>`;
  t.ok(is(s1, 0), "32.01");
  t.false(is(s1, 8), "32.02");
  t.ok(is(s1, 11), "32.03");

  t.ok(
    is(s1, 0, {
      allowCustomTagNames: true,
    }),
    "32.04"
  );
  t.false(
    is(s1, 8, {
      allowCustomTagNames: true,
    }),
    "32.05"
  );
  t.ok(
    is(s1, 11, {
      allowCustomTagNames: true,
    }),
    "32.06"
  );
  t.end();
});

tap.test(`33 - ${`\u001b[${36}m${`ad-hoc`}\u001b[${39}m`} - ad-hoc`, (t) => {
  const s1 = `\n<table`;
  t.ok(is(s1, 1), "33.01");
  t.ok(
    is(s1, 1, {
      allowCustomTagNames: true,
    }),
    "33.02"
  );
  t.end();
});

tap.test(`34 - ${`\u001b[${36}m${`ad-hoc`}\u001b[${39}m`} - ad-hoc`, (t) => {
  const s1 = `<br${BACKSLASH}>`;
  t.ok(is(s1, 0), "34.01");
  t.ok(
    is(s1, 0, {
      allowCustomTagNames: true,
    }),
    "34.02"
  );
  t.end();
});

tap.test(`35 - ${`\u001b[${36}m${`ad-hoc`}\u001b[${39}m`} - ad-hoc`, (t) => {
  const s1 = `< ${BACKSLASH} br ${BACKSLASH} >`;
  t.ok(is(s1, 0), "35.01");
  t.ok(
    is(s1, 0, {
      allowCustomTagNames: true,
    }),
    "35.02"
  );
  t.end();
});

tap.test(`36 - ${`\u001b[${36}m${`ad-hoc`}\u001b[${39}m`} - ad-hoc`, (t) => {
  const s1 = `<\t${BACKSLASH}///\t${BACKSLASH}${BACKSLASH}${BACKSLASH} br ${BACKSLASH} >`;
  t.ok(is(s1, 0), "36.01");
  t.ok(
    is(s1, 0, {
      allowCustomTagNames: true,
    }),
    "36.02"
  );
  t.end();
});

tap.test(`37 - ${`\u001b[${36}m${`ad-hoc`}\u001b[${39}m`} - ad-hoc`, (t) => {
  const s1 = `let's say that a < b and c > d.`;
  t.false(is(s1, 17), "37.01");
  t.false(
    is(s1, 17, {
      allowCustomTagNames: true,
    }),
    "37.02"
  );
  t.end();
});

tap.test(`38 - ${`\u001b[${36}m${`ad-hoc`}\u001b[${39}m`} - ad-hoc`, (t) => {
  const s1 = `<zzz accept="utf-8" yyy>`;
  // by default, custom tag names are not allowed:
  t.false(is(s1, 0), "38.01");

  // but enabling them result is positive
  t.ok(
    is(s1, 0, {
      allowCustomTagNames: true,
    }),
    "38.02"
  );
  t.end();
});

tap.test(`39 - ${`\u001b[${36}m${`ad-hoc`}\u001b[${39}m`} - ad-hoc`, (t) => {
  const s1 = `<zzz accept-charset="utf-8" yyy>`;
  t.false(is(s1, 0), "39.01");
  t.ok(
    is(s1, 0, {
      allowCustomTagNames: true,
    }),
    "39.02"
  );
  t.end();
});

tap.test(
  `40 - ${`\u001b[${36}m${`ad-hoc`}\u001b[${39}m`} - custom html tags with dashes`,
  (t) => {
    const s1 = `<something-here>`;
    t.false(is(s1, 0), "40.01");
    t.ok(
      is(s1, 0, {
        allowCustomTagNames: true,
      }),
      "40.02"
    );
    t.end();
  }
);

// https://www.fileformat.info/info/unicode/char/1f600/index.htm
tap.test(
  `41 - ${`\u001b[${36}m${`ad-hoc`}\u001b[${39}m`} - custom html tags with dashes`,
  (t) => {
    const s1 = `<emoji-\uD83D\uDE00>`;
    t.false(is(s1, 0), "41.01");
    t.ok(
      is(s1, 0, {
        allowCustomTagNames: true,
      }),
      "41.02"
    );
    t.end();
  }
);

// 06. broken code
// -----------------------------------------------------------------------------

// rogue space cases

tap.test(
  `42 - ${`\u001b[${36}m${`broken code`}\u001b[${39}m`} - spaces around`,
  (t) => {
    const s1 = `< p >`;
    t.ok(is(s1, 0), "42.01");
    t.ok(
      is(s1, 0, {
        allowCustomTagNames: true,
      }),
      "42.02"
    );
    t.end();
  }
);

tap.test(
  `43 - ${`\u001b[${36}m${`broken code`}\u001b[${39}m`} - spaces around`,
  (t) => {
    const s1 = `< / p >`;
    t.ok(is(s1, 0), "43.01");
    t.ok(
      is(s1, 0, {
        allowCustomTagNames: true,
      }),
      "43.02"
    );
    t.end();
  }
);

tap.test(
  `44 - ${`\u001b[${36}m${`broken code`}\u001b[${39}m`} - spaces around`,
  (t) => {
    const s1 = `< b / >`;
    t.ok(is(s1, 0), "44.01");
    t.ok(
      is(s1, 0, {
        allowCustomTagNames: true,
      }),
      "44.02"
    );
    t.end();
  }
);

tap.test(
  `45 - ${`\u001b[${36}m${`broken code`}\u001b[${39}m`} - spaces around`,
  (t) => {
    const s1 = `< ${BACKSLASH} b / >`;
    t.ok(is(s1, 0), "45.01");
    t.ok(
      is(s1, 0, {
        allowCustomTagNames: true,
      }),
      "45.02"
    );
    t.end();
  }
);

tap.test(
  `46 - ${`\u001b[${36}m${`broken code`}\u001b[${39}m`} - spaces around`,
  (t) => {
    const s1 = `</td nowrap yo yo/>`;
    t.ok(is(s1, 0), "46.01");
    t.ok(
      is(s1, 0, {
        allowCustomTagNames: true,
      }),
      "46.02"
    );
    t.end();
  }
);

// missing bits cases

tap.test(
  `47 - ${`\u001b[${36}m${`broken code`}\u001b[${39}m`} - quotes missing`,
  (t) => {
    const s1 = `<abc de=fg hi="jkl">`;
    t.false(is(s1, 0), "47.01");
    t.ok(
      is(s1, 0, {
        allowCustomTagNames: true,
      }),
      "47.02"
    );
    t.end();
  }
);

// 07. custom HTML tag names
// -----------------------------------------------------------------------------

tap.test(
  `48 - ${`\u001b[${36}m${`custom`}\u001b[${39}m`} - starts with dash, allowCustomTagNames=off`,
  (t) => {
    const s1 = `<-a-b>`;
    t.false(is(s1, 0), "48");
    t.end();
  }
);

tap.test(
  `49 - ${`\u001b[${36}m${`custom`}\u001b[${39}m`} - starts with dash, allowCustomTagNames=on`,
  (t) => {
    const s1 = `<-a-b>`;
    t.false(
      is(s1, 0, {
        allowCustomTagNames: true,
      }),
      "49"
    );
    t.end();
  }
);

tap.test(
  `50 - ${`\u001b[${36}m${`custom`}\u001b[${39}m`} - dash between chars`,
  (t) => {
    const s1 = `<a-b>`;
    t.ok(is(s1, 0), "50.01");
    t.ok(
      is(s1, 0, {
        allowCustomTagNames: true,
      }),
      "50.02"
    );
    t.end();
  }
);

tap.test(
  `51 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - one letter tag, allowCustomTagNames=off`,
  (t) => {
    const s1 = `<c>`;
    t.false(
      is(s1, 0, {
        allowCustomTagNames: false,
      }),
      "51"
    );
    t.end();
  }
);

tap.test(
  `52 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - one letter tag, allowCustomTagNames=on`,
  (t) => {
    const s1 = `<c>`;
    t.ok(
      is(s1, 0, {
        allowCustomTagNames: true,
      }),
      "52"
    );
    t.end();
  }
);

// 08. false positives
// -----------------------------------------------------------------------------

tap.test(
  `53 - ${`\u001b[${32}m${`false positives`}\u001b[${39}m`} - last letter`,
  (t) => {
    const str = `> b`;
    t.false(is(str, 2), "53");
    t.end();
  }
);

tap.test(
  `54 - ${`\u001b[${32}m${`false positives`}\u001b[${39}m`} - last letter`,
  (t) => {
    const str = `> b`;
    t.false(
      is(str, 2, {
        skipOpeningBracket: true,
      }),
      "54"
    );
    t.end();
  }
);

tap.test(
  `55 - ${`\u001b[${32}m${`false positives`}\u001b[${39}m`} - last letter`,
  (t) => {
    const str = `bc img src="z"/>`;
    t.false(
      is(str, 0, {
        allowCustomTagNames: false,
        skipOpeningBracket: true,
      }),
      "55"
    );
    t.end();
  }
);
