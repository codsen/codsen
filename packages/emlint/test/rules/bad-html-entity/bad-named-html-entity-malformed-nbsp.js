// rule: bad-named-html-entity-malformed-nbsp
// -----------------------------------------------------------------------------

import tap from "tap";
import { Linter } from "../../../dist/emlint.esm";

import { applyFixes } from "../../../t-util/util";

// 01. missing letters
// -----------------------------------------------------------------------------

tap.test(`01 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - group rule`, (t) => {
  const str = `abc&nsp;def`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "bad-html-entity": 2,
    },
  });
  t.equal(applyFixes(str, messages), "abc&nbsp;def", "01.01");
  t.match(
    messages,
    [
      {
        ruleId: "bad-named-html-entity-malformed-nbsp",
        severity: 2,
        idxFrom: 3,
        idxTo: 8,
        message: "Malformed NBSP entity.",
        fix: {
          ranges: [[3, 8, "&nbsp;"]],
        },
      },
    ],
    "01.02"
  );
  t.end();
});

tap.test(`02 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - exact rule`, (t) => {
  const str = `abc&nsp;def`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "bad-named-html-entity-malformed-nbsp": 2,
    },
  });
  t.equal(applyFixes(str, messages), "abc&nbsp;def", "02.01");
  t.match(
    messages,
    [
      {
        ruleId: "bad-named-html-entity-malformed-nbsp",
        severity: 2,
        idxFrom: 3,
        idxTo: 8,
        message: "Malformed NBSP entity.",
        fix: {
          ranges: [[3, 8, "&nbsp;"]],
        },
      },
    ],
    "02.02"
  );
  t.end();
});

tap.test(
  `03 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - rule by wildcard`,
  (t) => {
    const str = `abc&nsp;def`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "bad-named-html-entity-*": 2,
      },
    });
    t.equal(applyFixes(str, messages), "abc&nbsp;def", "03.01");
    t.match(
      messages,
      [
        {
          ruleId: "bad-named-html-entity-malformed-nbsp",
          severity: 2,
          idxFrom: 3,
          idxTo: 8,
          message: "Malformed NBSP entity.",
          fix: {
            ranges: [[3, 8, "&nbsp;"]],
          },
        },
      ],
      "03.02"
    );
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - group rule - off`,
  (t) => {
    const str = `abc&nsp;def`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "bad-html-entity": 0,
      },
    });
    t.equal(applyFixes(str, messages), str, "04.01");
    t.same(messages, [], "04.02");
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - exact rule - off`,
  (t) => {
    const str = `abc&nsp;def`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "bad-named-html-entity-malformed-nbsp": 0,
      },
    });
    t.equal(applyFixes(str, messages), str, "05.01");
    t.same(messages, [], "05.02");
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - rule by wildcard - off`,
  (t) => {
    const str = `abc&nsp;def`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "bad-named-html-entity-*": 0,
      },
    });
    t.equal(applyFixes(str, messages), str, "06.01");
    t.same(messages, [], "06.02");
    t.end();
  }
);

// 02. other malformed entities
// -----------------------------------------------------------------------------

tap.test(
  `07 - ${`\u001b[${33}m${`pound`}\u001b[${39}m`} - rule by wildcard`,
  (t) => {
    const str = `&pond;1000`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "bad-named-html-entity-*": 2,
      },
    });
    t.equal(applyFixes(str, messages), "&pound;1000", "07.01");
    t.match(
      messages,
      [
        {
          ruleId: "bad-named-html-entity-malformed-pound",
          severity: 2,
          idxFrom: 0,
          idxTo: 6,
          message: "Malformed pound entity.",
          fix: {
            ranges: [[0, 6, "&pound;"]],
          },
        },
      ],
      "07.02"
    );
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${33}m${`pound`}\u001b[${39}m`} - rule by group rule`,
  (t) => {
    const str = `&pond;1000`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "bad-html-entity": 2,
      },
    });
    t.equal(applyFixes(str, messages), "&pound;1000", "08.01");
    t.match(
      messages,
      [
        {
          ruleId: "bad-named-html-entity-malformed-pound",
          severity: 2,
          idxFrom: 0,
          idxTo: 6,
          message: "Malformed pound entity.",
          fix: {
            ranges: [[0, 6, "&pound;"]],
          },
        },
      ],
      "08.02"
    );
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${33}m${`pound`}\u001b[${39}m`} - rule by exact rule`,
  (t) => {
    const str = `&pond;1000`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "bad-named-html-entity-malformed-pound": 2,
      },
    });
    t.equal(applyFixes(str, messages), "&pound;1000", "09.01");
    t.match(
      messages,
      [
        {
          ruleId: "bad-named-html-entity-malformed-pound",
          severity: 2,
          idxFrom: 0,
          idxTo: 6,
          message: "Malformed pound entity.",
          fix: {
            ranges: [[0, 6, "&pound;"]],
          },
        },
      ],
      "09.02"
    );
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${33}m${`pound`}\u001b[${39}m`} - rule by wildcard - off`,
  (t) => {
    const str = `&pond;1000`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "bad-named-html-entity-*": 0,
      },
    });
    t.equal(applyFixes(str, messages), str, "10.01");
    t.same(messages, [], "10.02");
    t.end();
  }
);

tap.test(
  `11 - ${`\u001b[${33}m${`pound`}\u001b[${39}m`} - rule by group rule - off`,
  (t) => {
    const str = `&pond;1000`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "bad-html-entity": 0,
      },
    });
    t.equal(applyFixes(str, messages), str, "11.01");
    t.same(messages, [], "11.02");
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${33}m${`pound`}\u001b[${39}m`} - rule by exact rule - off`,
  (t) => {
    const str = `&pond;1000`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "bad-named-html-entity-malformed-pound": 0,
      },
    });
    t.equal(applyFixes(str, messages), str, "12.01");
    t.same(messages, [], "12.02");
    t.end();
  }
);
