import tap from "tap";
import { Linter } from "../../../dist/emlint.esm";
import { applyFixes } from "../../../t-util/util";

// RULE IS TRIGGERED DIRECTLY FROM PARSER!
// IT'S SOURCE IS IN CODSEN-PARSER, NOT IN src/rules/tag/tag-missing-closing.js

// REMEMBER TO UPDATE src/util/nonFileBasedTagRules.json WHEN YOU ADD SIMILAR RULES

// 01. basic
// -----------------------------------------------------------------------------

tap.todo(`01 - ${`\u001b[${33}m${`basic`}\u001b[${39}m`} - off`, (t) => {
  const str = "z <div>";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-missing-opening": 0,
    },
  });
  t.equal(applyFixes(str, messages), str, "01.01");
  t.strictSame(messages, [], "01.02");
  t.end();
});

tap.todo(`02 - ${`\u001b[${33}m${`basic`}\u001b[${39}m`} - warn`, (t) => {
  const str = "z <div>";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-missing-opening": 1,
    },
  });
  t.equal(applyFixes(str, messages), str, "02.01");
  t.match(
    messages,
    [
      {
        ruleId: "tag-missing-opening",
        severity: 1,
        idxFrom: 2,
        idxTo: 7,
        message: `Closing tag is missing.`,
        fix: null,
      },
    ],
    "02.02"
  );
  t.end();
});

tap.todo(`03 - ${`\u001b[${33}m${`basic`}\u001b[${39}m`} - err`, (t) => {
  const str = "z <div>";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-missing-opening": 2,
    },
  });
  t.equal(applyFixes(str, messages), str, "03.01");
  t.match(
    messages,
    [
      {
        ruleId: "tag-missing-opening",
        severity: 2,
        idxFrom: 2,
        idxTo: 7,
        message: `Closing tag is missing.`,
        fix: null,
      },
    ],
    "03.02"
  );
  t.end();
});

tap.todo(
  `04 - ${`\u001b[${33}m${`basic`}\u001b[${39}m`} - via blanket rule, severity 1`,
  (t) => {
    const str = "z <div>";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        tag: 1,
      },
    });
    t.equal(applyFixes(str, messages), str, "04.01");
    t.match(
      messages,
      [
        {
          ruleId: "tag-missing-opening",
          severity: 1,
          idxFrom: 2,
          idxTo: 7,
          message: `Closing tag is missing.`,
          fix: null,
        },
      ],
      "04.02"
    );
    t.end();
  }
);

tap.todo(
  `05 - ${`\u001b[${33}m${`basic`}\u001b[${39}m`} - via blanket rule, severity 2`,
  (t) => {
    const str = "z <div>";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        tag: 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "05.01");
    t.match(
      messages,
      [
        {
          ruleId: "tag-missing-opening",
          severity: 2,
          idxFrom: 2,
          idxTo: 7,
          message: `Closing tag is missing.`,
          fix: null,
        },
      ],
      "05.02"
    );
    t.end();
  }
);

tap.todo(
  `06 - ${`\u001b[${33}m${`basic`}\u001b[${39}m`} - no issue here`,
  (t) => {
    const str = "<style>\n\n</style>";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-missing-opening": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "06.01");
    t.strictSame(messages, [], "06.02");
    t.end();
  }
);

tap.todo(`07 - ${`\u001b[${33}m${`basic`}\u001b[${39}m`} - TD missing`, (t) => {
  const str = `<table>
  <tr>
    <td>
      z
  </tr>
</table>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-missing-opening": 2,
    },
  });
  t.equal(applyFixes(str, messages), str, "07.01");
  t.strictSame(messages, [], "07.02");
  t.end();
});

tap.todo(`08 - ${`\u001b[${33}m${`basic`}\u001b[${39}m`} - TR missing`, (t) => {
  const str = `<table width="1" border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td>
      z
    </td>
</table>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-missing-opening": 2,
    },
  });
  t.equal(applyFixes(str, messages), str, "08.01");
  t.strictSame(messages, [], "08.02");
  t.end();
});

tap.todo(
  `09 - ${`\u001b[${33}m${`basic`}\u001b[${39}m`} - TABLE missing`,
  (t) => {
    const str = `<table width="1" border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td>
      z
    </td>
  </tr>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-missing-opening": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "09.01");
    t.strictSame(messages, [], "09.02");
    t.end();
  }
);

tap.todo(
  `10 - ${`\u001b[${33}m${`basic`}\u001b[${39}m`} - TR+TD missing`,
  (t) => {
    const str = `<table width="1" border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td>
      z
</table>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-missing-opening": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "10.01");
    t.strictSame(messages, [], "10.02");
    t.end();
  }
);

// 02. various
// -----------------------------------------------------------------------------

tap.todo(
  `11 - ${`\u001b[${33}m${`various`}\u001b[${39}m`} - opening and closing void tag`,
  (t) => {
    const str = `<br><br>zzz</br></br>`;
    const fixed = `<br/><br/>zzz<br/><br/>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        all: 2,
      },
    });
    t.equal(applyFixes(str, messages), fixed, "11");
    t.end();
  }
);

tap.todo(
  `12 - ${`\u001b[${33}m${`various`}\u001b[${39}m`} - false positive - unclosed void`,
  (t) => {
    const str = `<br><br>zzz<br>`;
    const fixed = `<br/><br/>zzz<br/>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        all: 2,
      },
    });
    t.equal(applyFixes(str, messages), fixed, "12.01");
    t.match(
      messages,
      [
        {
          severity: 2,
          ruleId: "tag-void-slash",
          message: "Missing slash.",
          idxFrom: 3,
          idxTo: 3,
          fix: {
            ranges: [[3, 3, "/"]],
          },
        },
        {
          severity: 2,
          ruleId: "tag-void-slash",
          message: "Missing slash.",
          idxFrom: 7,
          idxTo: 7,
          fix: {
            ranges: [[7, 7, "/"]],
          },
        },
        {
          severity: 2,
          ruleId: "tag-void-slash",
          message: "Missing slash.",
          idxFrom: 14,
          idxTo: 14,
          fix: {
            ranges: [[14, 14, "/"]],
          },
        },
      ],
      "12.02"
    );
    t.is(messages.length, 3, "12.03");
    t.end();
  }
);
