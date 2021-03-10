import tap from "tap";
import { applyFixes, verify } from "../../../t-util/util";
// import { deepContains } from "ast-deep-contains");

// 1. no config
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - slash present`,
  (t) => {
    const str = "<br/>";
    const messages = verify(t, str, {
      rules: {
        "tag-void-slash": 2,
      },
    });
    t.strictSame(messages, [], "01.01");
    t.equal(applyFixes(str, messages), str, "01.02");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - slash absent`,
  (t) => {
    const str = "<br>";
    const messages = verify(t, str, {
      rules: {
        "tag-void-slash": 2,
      },
    });
    t.match(
      messages,
      [
        {
          ruleId: "tag-void-slash",
          severity: 2,
          idxFrom: 0,
          idxTo: 4,
          message: "Missing slash.",
          fix: {
            ranges: [[3, 4, "/>"]],
          },
        },
      ],
      "02.01"
    );
    t.equal(applyFixes(str, messages), "<br/>", "02.02");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - with "tag-space-before-closing-bracket"`,
  (t) => {
    const str = "<br>";
    const messages = verify(t, str, {
      rules: {
        "tag-space-before-closing-bracket": 2,
        "tag-void-slash": 2,
      },
    });
    t.match(
      messages,
      [
        {
          ruleId: "tag-void-slash",
          severity: 2,
          idxFrom: 0,
          idxTo: 4,
          message: "Missing slash.",
          fix: {
            ranges: [[3, 4, "/>"]],
          },
        },
      ],
      "03.01"
    );
    t.equal(applyFixes(str, messages), "<br/>", "03.02");
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - with grouped rule, "tag"`,
  (t) => {
    const str = "<br>";
    const messages = verify(t, str, {
      rules: {
        tag: 2,
      },
    });
    t.equal(applyFixes(str, messages), "<br/>", "04");
    t.end();
  }
);

tap.only(
  `05 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - "tag-space-before-closing-bracket"=always`,
  (t) => {
    const str = "<br>";
    const fixed = "<br />";
    const messages = verify(t, str, {
      rules: {
        "tag-space-before-closing-bracket": [2, "always"],
        "tag-void-slash": 2,
      },
    });
    t.equal(applyFixes(str, messages), fixed, "05");
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - "tag-space-before-closing-bracket"=never`,
  (t) => {
    const str = "<br>";
    const fixed = "<br/>";
    const messages = verify(t, str, {
      rules: {
        "tag-space-before-closing-bracket": [2, "never"],
        "tag-void-slash": 2,
      },
    });
    t.equal(applyFixes(str, messages), fixed, "06");
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - "tag-space-before-closing-bracket"=never, hardcoded void's default always`,
  (t) => {
    const str = "<br>";
    const fixed = "<br/>";
    const messages = verify(t, str, {
      rules: {
        "tag-space-before-closing-bracket": [2, "never"],
        "tag-void-slash": [2, "always"],
      },
    });
    t.equal(applyFixes(str, messages), fixed, "07");
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - both never`,
  (t) => {
    const str = "<br>";
    const messages = verify(t, str, {
      rules: {
        "tag-space-before-closing-bracket": [2, "never"],
        "tag-void-slash": [2, "never"],
      },
    });
    t.strictSame(messages, [], "08.01");
    t.equal(applyFixes(str, messages), str, "08.02");
    t.end();
  }
);

// 02. with config
// -----------------------------------------------------------------------------

tap.test(
  `09 - ${`\u001b[${32}m${`with config`}\u001b[${39}m`} - slash absent, config=always`,
  (t) => {
    const str = "<br>";
    const messages = verify(t, str, {
      rules: {
        "tag-void-slash": [2, "always"],
      },
    });
    t.match(
      messages,
      [
        {
          ruleId: "tag-void-slash",
          severity: 2,
          idxFrom: 0,
          idxTo: 4,
          message: "Missing slash.",
          fix: {
            ranges: [[3, 4, "/>"]],
          },
        },
      ],
      "09.01"
    );
    t.equal(applyFixes(str, messages), "<br/>", "09.02");
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${32}m${`with config`}\u001b[${39}m`} - slash absent, config=never`,
  (t) => {
    const str = "<br>";
    const messages = verify(t, str, {
      rules: {
        "tag-void-slash": [2, "never"],
      },
    });
    t.strictSame(messages, [], "10.01");
    t.equal(applyFixes(str, messages), str, "10.02");
    t.end();
  }
);

tap.test(
  `11 - ${`\u001b[${32}m${`with config`}\u001b[${39}m`} - slash present, config=never`,
  (t) => {
    const str = "<br/>";
    const messages = verify(t, str, {
      rules: {
        "tag-void-slash": [2, "never"],
      },
    });
    t.match(
      messages,
      [
        {
          ruleId: "tag-void-slash",
          severity: 2,
          idxFrom: 0,
          idxTo: 5,
          message: "Remove the slash.",
          fix: {
            ranges: [[3, 4]],
          },
        },
      ],
      "11.01"
    );
    t.equal(applyFixes(str, messages), "<br>", "11.02");
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${32}m${`with config`}\u001b[${39}m`} - slash present, config=always`,
  (t) => {
    const str = "<br/>";
    const messages = verify(t, str, {
      rules: {
        "tag-void-slash": [2, "always"],
      },
    });
    t.strictSame(messages, [], "12.01");
    t.equal(applyFixes(str, messages), str, "12.02");
    t.end();
  }
);

tap.test(`13 - does not touch the whitespace`, (t) => {
  const str = "<br >";
  const fixed = "<br />";
  const messages = verify(t, str, {
    rules: {
      "tag-void-slash": [2, "always"],
    },
  });
  t.match(
    messages,
    [
      {
        ruleId: "tag-void-slash",
        severity: 2,
        idxFrom: 0,
        idxTo: 5,
        message: "Missing slash.",
        fix: {
          ranges: [[4, 5, "/>"]],
        },
      },
    ],
    "13.01"
  );
  t.equal(messages.length, 1, "13.02");
  t.equal(applyFixes(str, messages), fixed, "13.03");
  t.end();
});
