const t = require("tap");
const is = require("../dist/is-html-tag-opening.cjs");
const BACKSLASH = "\u005C";

// 01. opening tag
// -----------------------------------------------------------------------------

t.test(`01.01 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - tag`, t => {
  const str = `<a>`;
  t.ok(is(str), "01.01.01");
  t.ok(is(str, 0), "01.01.02");
  t.ok(
    is(str, 0, {
      allowCustomTagNames: true
    }),
    "01.01.03"
  );

  t.false(is(str, 1), "01.01.04");
  t.ok(
    is(str, 1, {
      skipOpeningBracket: true
    }),
    "01.01.05"
  );
  t.end();
});

t.test(`01.02 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - tag`, t => {
  const str = `<img>`;
  t.ok(is(str), "01.02.01");
  t.ok(is(str, 0), "01.02.02");
  t.ok(
    is(str, 0, {
      allowCustomTagNames: true
    }),
    "01.02.03"
  );

  t.false(is(str, 1), "01.02.04");
  t.ok(
    is(str, 1, {
      skipOpeningBracket: true
    }),
    "01.02.05"
  );
  t.end();
});

t.test(`01.03 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - tag`, t => {
  const str = `<img alt="">`;
  t.ok(is(str), "01.03.01");
  t.ok(is(str, 0), "01.03.02");
  t.ok(
    is(str, 0, {
      allowCustomTagNames: true
    }),
    "01.03.03"
  );

  t.false(is(str, 1), "01.03.04");
  t.ok(
    is(str, 1, {
      skipOpeningBracket: true
    }),
    "01.03.05"
  );
  t.end();
});

t.test(`01.04 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - tag`, t => {
  const str = `<img alt="zzz">`;
  t.ok(is(str), "01.04.01");
  t.ok(is(str, 0), "01.04.02");
  t.ok(
    is(str, 0, {
      allowCustomTagNames: true
    }),
    "01.04.03"
  );

  t.false(is(str, 1), "01.04.04");
  t.ok(
    is(str, 1, {
      skipOpeningBracket: true
    }),
    "01.04.05"
  );
  t.end();
});

t.test(`01.05 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - tag`, t => {
  const str = `<td nowrap>`;
  t.ok(is(str), "01.05.01"); // <---- true because tag name was recognised
  t.ok(is(str, 0), "01.05.02");
  t.ok(
    is(str, 0, {
      allowCustomTagNames: true
    }),
    "01.05.03"
  );

  t.false(is(str, 1), "01.05.04");
  t.false(
    is(str, 1, {
      skipOpeningBracket: true
    }),
    "01.05.05"
  );
  t.end();
});

t.test(`01.06 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - tag`, t => {
  const str = `<zzz nowrap>`;
  t.false(is(str), "01.06.01"); // <---- false because tag name was not recognised and there were no attrs
  t.false(is(str, 0), "01.06.02");
  t.false(
    is(str, 0, {
      allowCustomTagNames: true
    }),
    "01.06.03"
  );

  t.false(is(str, 1), "01.06.04");
  t.false(
    is(str, 1, {
      skipOpeningBracket: true
    }),
    "01.06.05"
  );
  t.end();
});

t.test(`01.07 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - tag`, t => {
  const str = `<td class="klm" nowrap>`;
  t.ok(is(str), "01.07.01");
  t.ok(is(str, 0), "01.07.02");
  t.ok(
    is(str, 0, {
      allowCustomTagNames: true
    }),
    "01.07.03"
  );

  t.false(is(str, 1), "01.07.04");
  t.ok(
    is(str, 1, {
      skipOpeningBracket: true
    }),
    "01.07.05"
  );
  t.end();
});

t.test(`01.08 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - tag`, t => {
  const str = `<td nowrap class="klm">`;
  t.ok(is(str), "01.08.01");
  t.ok(is(str, 0), "01.08.02");
  t.ok(
    is(str, 0, {
      allowCustomTagNames: true
    }),
    "01.08.03"
  );

  t.false(is(str, 1), "01.08.04");
  t.ok(
    is(str, 1, {
      skipOpeningBracket: true
    }),
    "01.08.05"
  );
  t.end();
});

t.test(`01.09 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - tag`, t => {
  const str = `<td nowrap nowrap nowrap nowrap nowrap nowrap nowrap nowrap nowrap nowrap class="klm"`;
  t.ok(is(str), "01.09.01");
  t.ok(is(str, 0), "01.09.02");
  t.ok(
    is(str, 0, {
      allowCustomTagNames: true
    }),
    "01.09.03"
  );

  t.false(is(str, 1), "01.09.04");
  t.ok(
    is(str, 1, {
      skipOpeningBracket: true
    }),
    "01.09.05"
  );
  t.end();
});

// 02. closing tag
// -----------------------------------------------------------------------------

t.test(`02.01 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - closing tag`, t => {
  // closing tag
  const str = `</td>`;
  t.ok(is(str), "02.01.01");
  t.ok(is(str, 0), "02.01.02");
  t.ok(
    is(str, 0, {
      allowCustomTagNames: true
    }),
    "02.01.03"
  );

  t.false(is(str, 1), "02.01.04");
  t.ok(
    is(str, 1, {
      skipOpeningBracket: true
    }),
    "02.01.05"
  );
  t.end();
});

t.test(`02.02 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - closing tag`, t => {
  const str = `</ td>`;
  t.ok(is(str), "02.02.01");
  t.ok(is(str, 0), "02.02.02");
  t.ok(
    is(str, 0, {
      allowCustomTagNames: true
    }),
    "02.02.03"
  );

  t.false(is(str, 1), "02.02.04");
  t.ok(
    is(str, 1, {
      skipOpeningBracket: true
    }),
    "02.02.05"
  );
  t.end();
});

t.test(`02.03 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - closing tag`, t => {
  const str = `< / td>`;
  t.ok(is(str), "02.03.01");
  t.ok(is(str, 0), "02.03.02");
  t.ok(
    is(str, 0, {
      allowCustomTagNames: true
    }),
    "02.03.03"
  );

  t.false(is(str, 1), "02.03.04");
  t.ok(
    is(str, 1, {
      skipOpeningBracket: true
    }),
    "02.03.05"
  );
  t.end();
});

t.test(`02.04 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - closing tag`, t => {
  const str = `</ td >`;
  t.ok(is(str), "02.04.01");
  t.ok(is(str, 0), "02.04.02");
  t.ok(
    is(str, 0, {
      allowCustomTagNames: true
    }),
    "02.04.03"
  );

  t.false(is(str, 1), "02.04.04");
  t.ok(
    is(str, 1, {
      skipOpeningBracket: true
    }),
    "02.04.05"
  );
  t.end();
});

t.test(`02.05 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - closing tag`, t => {
  const str = `< / td >`;
  t.ok(is(str), "02.05.01");
  t.ok(is(str, 0), "02.05.02");
  t.ok(
    is(str, 0, {
      allowCustomTagNames: true
    }),
    "02.05.03"
  );

  t.false(is(str, 1), "02.05.04");
  t.ok(
    is(str, 1, {
      skipOpeningBracket: true
    }),
    "02.05.05"
  );
  t.end();
});

// 03. self-closing tag
// -----------------------------------------------------------------------------

t.test(
  `03.01 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - self-closing tag`,
  t => {
    const str = `<br/>`;
    t.ok(is(str), "03.01.01");
    t.ok(is(str, 0), "03.01.02");
    t.ok(
      is(str, 0, {
        allowCustomTagNames: true
      }),
      "03.01.03"
    );

    t.false(is(str, 1), "03.01.04");
    t.ok(
      is(str, 1, {
        skipOpeningBracket: true
      }),
      "03.01.05"
    );
    t.end();
  }
);

t.test(
  `03.02 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - self-closing tag`,
  t => {
    const str = `< br/>`;
    t.ok(is(str), "03.02.01");
    t.ok(is(str, 0), "03.02.02");
    t.ok(
      is(str, 0, {
        allowCustomTagNames: true
      }),
      "03.02.03"
    );

    t.false(is(str, 2), "03.02.04");
    t.ok(
      is(str, 2, {
        skipOpeningBracket: true
      }),
      "03.02.05"
    );
    t.end();
  }
);

t.test(
  `03.03 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - self-closing tag`,
  t => {
    const str = `<br />`;
    t.ok(is(str), "03.03.01");
    t.ok(is(str, 0), "03.03.02");
    t.ok(
      is(str, 0, {
        allowCustomTagNames: true
      }),
      "03.03.03"
    );

    t.false(is(str, 1), "03.03.04");
    t.ok(
      is(str, 1, {
        skipOpeningBracket: true
      }),
      "03.03.05"
    );
    t.end();
  }
);

t.test(
  `03.04 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - self-closing tag`,
  t => {
    const str = `<br/ >`;
    t.ok(is(str), "03.04.01");
    t.ok(is(str, 0), "03.04.02");
    t.ok(
      is(str, 0, {
        allowCustomTagNames: true
      }),
      "03.04.03"
    );

    t.false(is(str, 1), "03.04.04");
    t.ok(
      is(str, 1, {
        skipOpeningBracket: true
      }),
      "03.04.05"
    );
    t.end();
  }
);

t.test(
  `03.05 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - self-closing tag`,
  t => {
    const str = `<br / >`;
    t.ok(is(str), "03.05.01");
    t.ok(is(str, 0), "03.05.02");
    t.ok(
      is(str, 0, {
        allowCustomTagNames: true
      }),
      "03.05.03"
    );

    t.false(is(str, 1), "03.05.04");
    t.ok(
      is(str, 1, {
        skipOpeningBracket: true
      }),
      "03.05.05"
    );
    t.end();
  }
);

t.test(
  `03.06 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - self-closing tag`,
  t => {
    const str = `< br / >`;
    t.ok(is(str), "03.06.01");
    t.ok(is(str, 0), "03.06.02");
    t.ok(
      is(str, 0, {
        allowCustomTagNames: true
      }),
      "03.06.03"
    );

    t.false(is(str, 1), "03.06.04");
    t.ok(
      is(str, 1, {
        skipOpeningBracket: true
      }),
      "03.06.05"
    );
    t.end();
  }
);

// 04. self-closing with attributes
// -----------------------------------------------------------------------------

t.test(
  `04.01 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - self-closing tag with attributes`,
  t => {
    const s1 = `<br class="a"/>`;
    t.ok(is(s1), "04.01.01");
    t.ok(is(s1, 0), "04.01.02");
    t.ok(
      is(s1, 0, {
        allowCustomTagNames: true
      }),
      "04.01.03"
    );
    t.end();
  }
);

t.test(
  `04.02 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - self-closing tag with attributes`,
  t => {
    const s2 = `< br class="a"/>`;
    t.ok(is(s2), "04.02.01");
    t.ok(is(s2, 0), "04.02.02");
    t.ok(
      is(s2, 0, {
        allowCustomTagNames: true
      }),
      "04.02.03"
    );
    t.end();
  }
);

t.test(
  `04.03 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - self-closing tag with attributes`,
  t => {
    const s3 = `<br class="a" />`;
    t.ok(is(s3), "04.03.01");
    t.ok(is(s3, 0), "04.03.02");
    t.ok(
      is(s3, 0, {
        allowCustomTagNames: true
      }),
      "04.03.03"
    );
    t.end();
  }
);

t.test(
  `04.04 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - self-closing tag with attributes`,
  t => {
    const s4 = `<br class="a"/ >`;
    t.ok(is(s4), "04.04.01");
    t.ok(is(s4, 0), "04.04.02");
    t.ok(
      is(s4, 0, {
        allowCustomTagNames: true
      }),
      "04.04.03"
    );
    t.end();
  }
);

t.test(
  `04.05 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - self-closing tag with attributes`,
  t => {
    const s5 = `<br class="a" / >`;
    t.ok(is(s5), "04.05.01");
    t.ok(is(s5, 0), "04.05.02");
    t.ok(
      is(s5, 0, {
        allowCustomTagNames: true
      }),
      "04.05.03"
    );
    t.end();
  }
);

t.test(
  `04.06 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - self-closing tag with attributes`,
  t => {
    const s6 = `< br class="a" / >`;
    t.ok(is(s6), "04.06.01");
    t.ok(is(s6, 0), "04.06.02");
    t.ok(
      is(s6, 0, {
        allowCustomTagNames: true
      }),
      "04.06.03"
    );
    t.end();
  }
);

t.test(
  `04.07 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - self-closing tag with attributes`,
  t => {
    const s7 = `< br class = "a"  id ='z' / >`;
    t.ok(is(s7), "04.07.01");
    t.ok(is(s7, 0), "04.07.02");
    t.ok(
      is(s7, 0, {
        allowCustomTagNames: true
      }),
      "04.07.03"
    );
    t.end();
  }
);

t.test(
  `04.08 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - self-closing tag with attributes`,
  t => {
    const s8 = `< br class = "a'  id = "z' / >`;
    t.ok(is(s8), "04.08.01");
    t.ok(is(s8, 0), "04.08.02");
    t.ok(
      is(s8, 0, {
        allowCustomTagNames: true
      }),
      "04.08.03"
    );
    t.end();
  }
);

// 05. ad-hoc
// -----------------------------------------------------------------------------

t.test(`05.01 - ${`\u001b[${36}m${`ad-hoc`}\u001b[${39}m`} - ad-hoc`, t => {
  const s1 = `<a b="ccc"<d>`;
  t.ok(is(s1, 0), "05.01.01");
  t.false(is(s1, 6), "05.01.02");
  t.ok(is(s1, 10), "05.01.03");

  t.ok(
    is(s1, 0, {
      allowCustomTagNames: true
    }),
    "05.01.04"
  );
  t.false(
    is(s1, 6, {
      allowCustomTagNames: true
    }),
    "05.01.05"
  );
  t.ok(
    is(s1, 10, {
      allowCustomTagNames: true
    }),
    "05.01.06"
  );
  t.end();
});

t.test(`05.02 - ${`\u001b[${36}m${`ad-hoc`}\u001b[${39}m`} - ad-hoc`, t => {
  const s1 = `a < b`;
  t.false(is(s1, 2), "05.02.01");
  t.false(
    is(s1, 2, {
      allowCustomTagNames: true
    }),
    "05.02.02"
  );
  t.end();
});

t.test(`05.03 - ${`\u001b[${36}m${`ad-hoc`}\u001b[${39}m`} - ad-hoc`, t => {
  const s1 = `<span>a < b<span>`;
  t.ok(is(s1, 0), "05.03.01");
  t.false(is(s1, 8), "05.03.02");
  t.ok(is(s1, 11), "05.03.03");

  t.ok(
    is(s1, 0, {
      allowCustomTagNames: true
    }),
    "05.03.04"
  );
  t.false(
    is(s1, 8, {
      allowCustomTagNames: true
    }),
    "05.03.05"
  );
  t.ok(
    is(s1, 11, {
      allowCustomTagNames: true
    }),
    "05.03.06"
  );
  t.end();
});

t.test(`05.04 - ${`\u001b[${36}m${`ad-hoc`}\u001b[${39}m`} - ad-hoc`, t => {
  const s1 = `\n<table`;
  t.ok(is(s1, 1), "05.04.01");
  t.ok(
    is(s1, 1, {
      allowCustomTagNames: true
    }),
    "05.04.02"
  );
  t.end();
});

t.test(`05.05 - ${`\u001b[${36}m${`ad-hoc`}\u001b[${39}m`} - ad-hoc`, t => {
  const s1 = `<br${BACKSLASH}>`;
  t.ok(is(s1, 0), "05.05.01");
  t.ok(
    is(s1, 0, {
      allowCustomTagNames: true
    }),
    "05.05.02"
  );
  t.end();
});

t.test(`05.06 - ${`\u001b[${36}m${`ad-hoc`}\u001b[${39}m`} - ad-hoc`, t => {
  const s1 = `< ${BACKSLASH} br ${BACKSLASH} >`;
  t.ok(is(s1, 0), "05.06.01");
  t.ok(
    is(s1, 0, {
      allowCustomTagNames: true
    }),
    "05.06.02"
  );
  t.end();
});

t.test(`05.07 - ${`\u001b[${36}m${`ad-hoc`}\u001b[${39}m`} - ad-hoc`, t => {
  const s1 = `<\t${BACKSLASH}///\t${BACKSLASH}${BACKSLASH}${BACKSLASH} br ${BACKSLASH} >`;
  t.ok(is(s1, 0), "05.07.01");
  t.ok(
    is(s1, 0, {
      allowCustomTagNames: true
    }),
    "05.07.02"
  );
  t.end();
});

t.test(`05.08 - ${`\u001b[${36}m${`ad-hoc`}\u001b[${39}m`} - ad-hoc`, t => {
  const s1 = `let's say that a < b and c > d.`;
  t.false(is(s1, 17), "05.08.01");
  t.false(
    is(s1, 17, {
      allowCustomTagNames: true
    }),
    "05.08.02"
  );
  t.end();
});

t.test(`05.09 - ${`\u001b[${36}m${`ad-hoc`}\u001b[${39}m`} - ad-hoc`, t => {
  const s1 = `<zzz accept="utf-8" yyy>`;
  t.ok(is(s1, 0), "05.09.01");
  t.ok(
    is(s1, 0, {
      allowCustomTagNames: true
    }),
    "05.09.02"
  );
  t.end();
});

t.test(`05.10 - ${`\u001b[${36}m${`ad-hoc`}\u001b[${39}m`} - ad-hoc`, t => {
  const s1 = `<zzz accept-charset="utf-8" yyy>`;
  t.ok(is(s1, 0), "05.10.01");
  t.ok(
    is(s1, 0, {
      allowCustomTagNames: true
    }),
    "05.10.02"
  );
  t.end();
});

t.test(
  `05.11 - ${`\u001b[${36}m${`ad-hoc`}\u001b[${39}m`} - custom html tags with dashes`,
  t => {
    const s1 = `<something-here>`;
    t.false(is(s1, 0), "05.11.01");
    t.ok(
      is(s1, 0, {
        allowCustomTagNames: true
      }),
      "05.11.02"
    );
    t.end();
  }
);

// https://www.fileformat.info/info/unicode/char/1f600/index.htm
t.test(
  `05.12 - ${`\u001b[${36}m${`ad-hoc`}\u001b[${39}m`} - custom html tags with dashes`,
  t => {
    const s1 = `<emoji-\uD83D\uDE00>`;
    t.false(is(s1, 0), "05.12.01");
    t.ok(
      is(s1, 0, {
        allowCustomTagNames: true
      }),
      "05.12.02"
    );
    t.end();
  }
);

// 06. broken code
// -----------------------------------------------------------------------------

// rogue space cases

t.test(
  `06.01 - ${`\u001b[${36}m${`broken code`}\u001b[${39}m`} - spaces around`,
  t => {
    const s1 = `< p >`;
    t.ok(is(s1, 0), "06.01.01");
    t.ok(
      is(s1, 0, {
        allowCustomTagNames: true
      }),
      "06.01.02"
    );
    t.end();
  }
);

t.test(
  `06.02 - ${`\u001b[${36}m${`broken code`}\u001b[${39}m`} - spaces around`,
  t => {
    const s1 = `< / p >`;
    t.ok(is(s1, 0), "06.02.01");
    t.ok(
      is(s1, 0, {
        allowCustomTagNames: true
      }),
      "06.02.02"
    );
    t.end();
  }
);

t.test(
  `06.03 - ${`\u001b[${36}m${`broken code`}\u001b[${39}m`} - spaces around`,
  t => {
    const s1 = `< b / >`;
    t.ok(is(s1, 0), "06.03.01");
    t.ok(
      is(s1, 0, {
        allowCustomTagNames: true
      }),
      "06.03.02"
    );
    t.end();
  }
);

t.test(
  `06.04 - ${`\u001b[${36}m${`broken code`}\u001b[${39}m`} - spaces around`,
  t => {
    const s1 = `< ${BACKSLASH} b / >`;
    t.ok(is(s1, 0), "06.04.01");
    t.ok(
      is(s1, 0, {
        allowCustomTagNames: true
      }),
      "06.04.02"
    );
    t.end();
  }
);

t.test(
  `06.05 - ${`\u001b[${36}m${`broken code`}\u001b[${39}m`} - spaces around`,
  t => {
    const s1 = `</td nowrap yo yo/>`;
    t.ok(is(s1, 0), "06.05.01");
    t.ok(
      is(s1, 0, {
        allowCustomTagNames: true
      }),
      "06.05.02"
    );
    t.end();
  }
);

// missing bits cases

t.test(
  `06.06 - ${`\u001b[${36}m${`broken code`}\u001b[${39}m`} - quotes missing`,
  t => {
    const s1 = `<abc de=fg hi="jkl">`;
    t.ok(is(s1, 0), "06.06.01");
    t.ok(
      is(s1, 0, {
        allowCustomTagNames: true
      }),
      "06.06.02"
    );
    t.end();
  }
);

// 07. custom HTML tag names
// -----------------------------------------------------------------------------

t.test(
  `07.01 - ${`\u001b[${36}m${`custom`}\u001b[${39}m`} - starts with dash, allowCustomTagNames=off`,
  t => {
    const s1 = `<-a-b>`;
    t.false(is(s1, 0), "07.01");
    t.end();
  }
);

t.test(
  `07.02 - ${`\u001b[${36}m${`custom`}\u001b[${39}m`} - starts with dash, allowCustomTagNames=on`,
  t => {
    const s1 = `<-a-b>`;
    t.false(
      is(s1, 0, {
        allowCustomTagNames: true
      }),
      "07.02"
    );
    t.end();
  }
);

t.test(
  `07.03 - ${`\u001b[${36}m${`custom`}\u001b[${39}m`} - dash between chars`,
  t => {
    const s1 = `<a-b>`;
    t.ok(is(s1, 0), "07.03.01");
    t.ok(
      is(s1, 0, {
        allowCustomTagNames: true
      }),
      "07.03.02"
    );
    t.end();
  }
);

t.test(
  `07.04 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - one letter tag, allowCustomTagNames=off`,
  t => {
    const s1 = `<c>`;
    t.ok(
      is(s1, 0, {
        allowCustomTagNames: false
      }),
      "07.04"
    );
    t.end();
  }
);

t.test(
  `07.05 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - one letter tag, allowCustomTagNames=on`,
  t => {
    const s1 = `<c>`;
    t.ok(
      is(s1, 0, {
        allowCustomTagNames: true
      }),
      "07.05"
    );
    t.end();
  }
);

// 08. false positives
// -----------------------------------------------------------------------------

t.test(
  `08.01 - ${`\u001b[${32}m${`false positives`}\u001b[${39}m`} - last letter`,
  t => {
    const str = `> b`;
    t.false(is(str, 2), "08.01");
    t.end();
  }
);

t.test(
  `08.02 - ${`\u001b[${32}m${`false positives`}\u001b[${39}m`} - last letter`,
  t => {
    const str = `> b`;
    t.false(
      is(str, 2, {
        skipOpeningBracket: true
      }),
      "08.02"
    );
    t.end();
  }
);
