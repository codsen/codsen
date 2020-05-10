import tap from "tap";
import { Linter } from "../../../dist/emlint.esm";
import { applyFixes } from "../../../t-util/util";
// import astDeepContains from "ast-deep-contains");

// 01. no config
// -----------------------------------------------------------------------------

tap.test(`01 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - off`, (t) => {
  const str = "<bold>z</bold>";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-bold": 0,
    },
  });
  t.equal(applyFixes(str, messages), str, "01.01");
  t.same(messages, [], "01.02");
  t.end();
});

tap.test(`02 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - warn`, (t) => {
  const str = "<bold>z</bold>";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-bold": 1,
    },
  });
  t.equal(applyFixes(str, messages), "<strong>z</strong>", "02.01");
  t.match(
    messages,
    [
      {
        ruleId: "tag-bold",
        severity: 1,
        idxFrom: 0,
        idxTo: 6,
        message: `Tag "bold" does not exist in HTML.`,
        fix: {
          ranges: [[1, 5, "strong"]],
        },
      },
      {
        ruleId: "tag-bold",
        severity: 1,
        idxFrom: 7,
        idxTo: 14,
        message: `Tag "bold" does not exist in HTML.`,
        fix: {
          ranges: [[9, 13, "strong"]],
        },
      },
    ],
    "02.02"
  );
  t.end();
});

tap.test(`03 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - err`, (t) => {
  const str = "<bold>z</bold>";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-bold": 2,
    },
  });
  t.equal(applyFixes(str, messages), "<strong>z</strong>", "03.01");
  t.match(
    messages,
    [
      {
        ruleId: "tag-bold",
        severity: 2,
        idxFrom: 0,
        idxTo: 6,
        message: `Tag "bold" does not exist in HTML.`,
        fix: {
          ranges: [[1, 5, "strong"]],
        },
      },
      {
        ruleId: "tag-bold",
        severity: 2,
        idxFrom: 7,
        idxTo: 14,
        message: `Tag "bold" does not exist in HTML.`,
        fix: {
          ranges: [[9, 13, "strong"]],
        },
      },
    ],
    "03.02"
  );
  t.end();
});

// 02. config
// -----------------------------------------------------------------------------

tap.test(
  `04 - ${`\u001b[${32}m${`config`}\u001b[${39}m`} - config is arr`,
  (t) => {
    const str = "<bold>z</bold>";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-bold": [2],
      },
    });
    t.equal(applyFixes(str, messages), "<strong>z</strong>", "04.01");
    t.match(
      messages,
      [
        {
          ruleId: "tag-bold",
          severity: 2,
          idxFrom: 0,
          idxTo: 6,
          message: `Tag "bold" does not exist in HTML.`,
          fix: {
            ranges: [[1, 5, "strong"]],
          },
        },
        {
          ruleId: "tag-bold",
          severity: 2,
          idxFrom: 7,
          idxTo: 14,
          message: `Tag "bold" does not exist in HTML.`,
          fix: {
            ranges: [[9, 13, "strong"]],
          },
        },
      ],
      "04.02"
    );
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${32}m${`config`}\u001b[${39}m`} - strong is suggested`,
  (t) => {
    const str = "<bold>z</bold>";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-bold": [2, "strong"],
      },
    });
    t.equal(applyFixes(str, messages), "<strong>z</strong>", "05.01");
    t.match(
      messages,
      [
        {
          ruleId: "tag-bold",
          severity: 2,
          idxFrom: 0,
          idxTo: 6,
          message: `Tag "bold" does not exist in HTML.`,
          fix: {
            ranges: [[1, 5, "strong"]],
          },
        },
        {
          ruleId: "tag-bold",
          severity: 2,
          idxFrom: 7,
          idxTo: 14,
          message: `Tag "bold" does not exist in HTML.`,
          fix: {
            ranges: [[9, 13, "strong"]],
          },
        },
      ],
      "05.02"
    );
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${32}m${`config`}\u001b[${39}m`} - b is suggested`,
  (t) => {
    const str = "<bold>z</bold>";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-bold": [2, "b"],
      },
    });
    t.equal(applyFixes(str, messages), "<b>z</b>", "06.01");
    t.match(
      messages,
      [
        {
          ruleId: "tag-bold",
          severity: 2,
          idxFrom: 0,
          idxTo: 6,
          message: `Tag "bold" does not exist in HTML.`,
          fix: {
            ranges: [[1, 5, "b"]],
          },
        },
        {
          ruleId: "tag-bold",
          severity: 2,
          idxFrom: 7,
          idxTo: 14,
          message: `Tag "bold" does not exist in HTML.`,
          fix: {
            ranges: [[9, 13, "b"]],
          },
        },
      ],
      "06.02"
    );
    t.end();
  }
);
