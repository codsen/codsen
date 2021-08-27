import tap from "tap";
import { applyFixes, verify } from "../../../t-util/util.js";

// 01. double encoding on nbsp
// -----------------------------------------------------------------------------

tap.test(`01 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - group rule`, (t) => {
  const str = `abc&amp;nbsp;def`;
  const messages = verify(t, str, {
    rules: {
      "bad-html-entity": 2,
    },
  });
  t.equal(applyFixes(str, messages), "abc&nbsp;def", "01.01");
  t.match(
    messages,
    [
      {
        ruleId: "bad-html-entity-multiple-encoding",
        severity: 2,
        idxFrom: 3,
        idxTo: 13,
        message: "HTML entity encoding over and over.",
        fix: {
          ranges: [[3, 13, "&nbsp;"]],
        },
      },
    ],
    "01.02"
  );
  t.equal(messages.length, 1, "01.03");
  t.end();
});

tap.test(
  `02 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - exact rule, severity level 1`,
  (t) => {
    const str = `abc&amp;nbsp;def`;
    const messages = verify(t, str, {
      rules: {
        "bad-html-entity-multiple-encoding": 1,
      },
    });
    t.equal(applyFixes(str, messages), "abc&nbsp;def", "02.01");
    t.match(
      messages,
      [
        {
          ruleId: "bad-html-entity-multiple-encoding",
          severity: 1,
          idxFrom: 3,
          idxTo: 13,
          message: "HTML entity encoding over and over.",
          fix: {
            ranges: [[3, 13, "&nbsp;"]],
          },
        },
      ],
      "02.02"
    );
    t.equal(messages.length, 1, "02.03");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - exact rule, severity level 2`,
  (t) => {
    const str = `abc&amp;nbsp;def`;
    const messages = verify(t, str, {
      rules: {
        "bad-html-entity-multiple-encoding": 2,
      },
    });
    t.equal(applyFixes(str, messages), "abc&nbsp;def", "03.01");
    t.match(
      messages,
      [
        {
          ruleId: "bad-html-entity-multiple-encoding",
          severity: 2,
          idxFrom: 3,
          idxTo: 13,
          message: "HTML entity encoding over and over.",
          fix: {
            ranges: [[3, 13, "&nbsp;"]],
          },
        },
      ],
      "03.02"
    );
    t.equal(messages.length, 1, "03.03");
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - rule by wildcard`,
  (t) => {
    const str = `abc&amp;nbsp;def`;
    const messages = verify(t, str, {
      rules: {
        "bad-html-entity-*": 2,
      },
    });
    t.equal(applyFixes(str, messages), "abc&nbsp;def", "04.01");
    t.match(
      messages,
      [
        {
          ruleId: "bad-html-entity-multiple-encoding",
          severity: 2,
          idxFrom: 3,
          idxTo: 13,
          message: "HTML entity encoding over and over.",
          fix: {
            ranges: [[3, 13, "&nbsp;"]],
          },
        },
      ],
      "04.02"
    );
    t.equal(messages.length, 1, "04.03");
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - group rule - off`,
  (t) => {
    const str = `abc&amp;nbsp;def`;
    const messages = verify(t, str, {
      rules: {
        "bad-html-entity": 0,
      },
    });
    t.equal(applyFixes(str, messages), str, "05.01");
    t.strictSame(messages, [], "05.02");
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - exact rule, severity level 0 - off`,
  (t) => {
    const str = `abc&amp;nbsp;def`;
    const messages = verify(t, str, {
      rules: {
        "bad-html-entity-multiple-encoding": 0,
      },
    });
    t.equal(applyFixes(str, messages), str, "06.01");
    t.strictSame(messages, [], "06.02");
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - rule by wildcard - off`,
  (t) => {
    const str = `abc&amp;nbsp;def`;
    const messages = verify(t, str, {
      rules: {
        "bad-html-entity-*": 0,
      },
    });
    t.equal(applyFixes(str, messages), str, "07.01");
    t.strictSame(messages, [], "07.02");
    t.end();
  }
);

tap.test(`08 - all`, (t) => {
  const str = `abc&amp;nbsp;def`;
  const messages = verify(t, str, {
    rules: {
      all: 2,
    },
  });
  t.equal(applyFixes(str, messages), "abc&nbsp;def", "08.01");
  t.match(
    messages,
    [
      {
        ruleId: "bad-html-entity-multiple-encoding",
        severity: 2,
        idxFrom: 3,
        idxTo: 13,
        message: "HTML entity encoding over and over.",
        fix: {
          ranges: [[3, 13, "&nbsp;"]],
        },
      },
    ],
    "08.02"
  );
  t.equal(messages.length, 1, "08.03");
  t.end();
});
