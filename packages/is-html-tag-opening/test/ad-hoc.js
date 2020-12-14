import tap from "tap";
import is from "../dist/is-html-tag-opening.esm";
import { mixer } from "./util/util";

const BACKSLASH = "\u005C";

// ad-hoc
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${36}m${`ad-hoc`}\u001b[${39}m`} - idx on defaults`,
  (t) => {
    mixer().forEach((opt) => {
      t.false(is("a", 0, opt), opt);
    });
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${36}m${`ad-hoc`}\u001b[${39}m`} - idx on defaults`,
  (t) => {
    mixer().forEach((opt) => {
      t.false(is("<", 0, opt), opt);
    });
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${36}m${`ad-hoc`}\u001b[${39}m`} - idx on defaults`,
  (t) => {
    mixer().forEach((opt) => {
      t.false(is(">", 0, opt), opt);
    });
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${36}m${`ad-hoc`}\u001b[${39}m`} - unrecognised tag`,
  (t) => {
    const str = `<a b="ccc"<xyz>`;
    mixer().forEach((opt) => {
      t.true(
        is(str, 0, opt),
        `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 0`
      );
      t.false(
        is(str, 6, opt),
        `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 6`
      );
    });

    mixer({
      allowCustomTagNames: false,
    }).forEach((opt) => {
      t.false(
        is(str, 10, opt),
        `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 10`
      );
    });

    mixer({
      allowCustomTagNames: true,
    }).forEach((opt) => {
      t.true(
        is(str, 10, opt),
        `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 10`
      );
    });

    mixer({
      allowCustomTagNames: true,
      skipOpeningBracket: true,
    }).forEach((opt) => {
      t.true(
        is(str, 11, opt),
        `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 10`
      );
    });
    mixer({
      allowCustomTagNames: false,
    }).forEach((opt) => {
      t.false(
        is(str, 11, opt),
        `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 10`
      );
    });
    mixer({
      skipOpeningBracket: false,
    }).forEach((opt) => {
      t.false(
        is(str, 11, opt),
        `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 10`
      );
    });

    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${36}m${`ad-hoc`}\u001b[${39}m`} - recognised tag`,
  (t) => {
    const str = `<a b="ccc"<div>`;
    mixer().forEach((opt) => {
      t.true(
        is(str, 0, opt),
        `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 0`
      );
      t.false(
        is(str, 6, opt),
        `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 6`
      );
      t.true(
        is(str, 10, opt),
        `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 10`
      );
    });

    mixer({
      skipOpeningBracket: false,
    }).forEach((opt) => {
      t.false(
        is(str, 11, opt),
        `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 11`
      );
    });
    mixer({
      skipOpeningBracket: true,
    }).forEach((opt) => {
      t.true(
        is(str, 11, opt),
        `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 11`
      );
    });

    t.end();
  }
);

tap.test(`06 - ${`\u001b[${36}m${`ad-hoc`}\u001b[${39}m`} - ad-hoc`, (t) => {
  mixer().forEach((opt) => {
    t.false(is(`a < b`, 2, opt), opt);
  });
  t.end();
});

tap.test(`07 - ${`\u001b[${36}m${`ad-hoc`}\u001b[${39}m`} - ad-hoc`, (t) => {
  const str = `<span>a < b<span>`;
  mixer().forEach((opt) => {
    t.true(
      is(str, 0, opt),
      `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 0`
    );
    t.false(
      is(str, 8, opt),
      `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 8`
    );
    t.true(
      is(str, 11, opt),
      `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 11`
    );
  });
  t.end();
});

tap.test(`08 - ${`\u001b[${36}m${`ad-hoc`}\u001b[${39}m`} - ad-hoc`, (t) => {
  const str = `\n<table`;
  mixer().forEach((opt) => {
    t.true(
      is(str, 1, opt),
      `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 1`
    );
  });
  t.end();
});

tap.test(`09 - ${`\u001b[${36}m${`ad-hoc`}\u001b[${39}m`} - ad-hoc`, (t) => {
  const str = `<br${BACKSLASH}>`;
  mixer().forEach((opt) => {
    t.true(
      is(str, 0, opt),
      `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 0`
    );
  });
  t.end();
});

tap.test(`10 - ${`\u001b[${36}m${`ad-hoc`}\u001b[${39}m`} - ad-hoc`, (t) => {
  const str = `< ${BACKSLASH} br ${BACKSLASH} >`;
  mixer().forEach((opt) => {
    t.true(
      is(str, 0, opt),
      `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 0`
    );
  });
  t.end();
});

tap.test(`11 - ${`\u001b[${36}m${`ad-hoc`}\u001b[${39}m`} - ad-hoc`, (t) => {
  const str = `<\t${BACKSLASH}///\t${BACKSLASH}${BACKSLASH}${BACKSLASH} br ${BACKSLASH} >`;
  mixer().forEach((opt) => {
    t.true(
      is(str, 0, opt),
      `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 0`
    );
  });
  t.end();
});

tap.test(`12 - ${`\u001b[${36}m${`ad-hoc`}\u001b[${39}m`} - ad-hoc`, (t) => {
  const str = `let's say that a < b and c > d.`;
  mixer().forEach((opt) => {
    t.false(
      is(str, 17, opt),
      `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 17`
    );
  });
  mixer().forEach((opt) => {
    t.false(
      is(str, 19, opt),
      `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 19`
    );
  });
  mixer().forEach((opt) => {
    t.false(
      is(str, 27, opt),
      `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 27`
    );
  });
  t.end();
});

tap.test(`13 - ${`\u001b[${36}m${`ad-hoc`}\u001b[${39}m`} - ad-hoc`, (t) => {
  const str = `<zzz accept="utf-8" yyy>`;
  // by default, custom tag names are not allowed:
  mixer({ allowCustomTagNames: false }).forEach((opt) => {
    t.false(
      is(str, 0, opt),
      `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 0`
    );
  });

  // but enabling them result is positive
  mixer({ allowCustomTagNames: true }).forEach((opt) => {
    t.true(
      is(str, 0, opt),
      `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 0`
    );
  });

  t.end();
});

tap.test(`14 - ${`\u001b[${36}m${`ad-hoc`}\u001b[${39}m`} - ad-hoc`, (t) => {
  const str = `<zzz accept-charset="utf-8" yyy>`;
  mixer({ allowCustomTagNames: false }).forEach((opt) => {
    t.false(
      is(str, 0, opt),
      `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 0`
    );
  });
  mixer({ allowCustomTagNames: true }).forEach((opt) => {
    t.true(
      is(str, 0, opt),
      `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 0`
    );
  });

  t.end();
});

tap.test(
  `15 - ${`\u001b[${36}m${`ad-hoc`}\u001b[${39}m`} - custom html tags with dashes`,
  (t) => {
    const str = `<something-here>`;
    mixer({ allowCustomTagNames: false }).forEach((opt) => {
      t.false(
        is(str, 0, opt),
        `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 0`
      );
    });
    mixer({ allowCustomTagNames: true }).forEach((opt) => {
      t.true(
        is(str, 0, opt),
        `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 0`
      );
    });

    t.end();
  }
);

// https://www.fileformat.info/info/unicode/char/1f600/index.htm
tap.test(
  `16 - ${`\u001b[${36}m${`ad-hoc`}\u001b[${39}m`} - custom html tags with dashes`,
  (t) => {
    const str = `<emoji-\uD83D\uDE00>`;
    mixer({ allowCustomTagNames: false }).forEach((opt) => {
      t.false(
        is(str, 0, opt),
        `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 0`
      );
    });
    mixer({ allowCustomTagNames: true }).forEach((opt) => {
      t.true(
        is(str, 0, opt),
        `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 0`
      );
    });

    t.end();
  }
);

tap.test(`17 - perf test`, (t) => {
  t.false(
    is("<div>Script says hello world and sky and sea</div>", 5, {
      allowCustomTagNames: false,
      skipOpeningBracket: true,
    }),
    "17"
  );

  t.end();
});
