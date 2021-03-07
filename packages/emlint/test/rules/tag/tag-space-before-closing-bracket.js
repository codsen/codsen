import tap from "tap";
import { applyFixes, verify } from "../../../t-util/util";

const BACKSLASH = "\u005C";

// 1. basic tests
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${33}m${`basic`}\u001b[${39}m`} - a single tag`,
  (t) => {
    const str = "<a >";
    const messages = verify(t, str, {
      rules: {
        "tag-space-before-closing-bracket": 2,
      },
    });
    t.match(
      messages,
      [
        {
          ruleId: "tag-space-before-closing-bracket",
          severity: 2,
          idxFrom: 2,
          idxTo: 3,
          message: "Bad whitespace.",
          fix: {
            ranges: [[2, 3]],
          },
        },
      ],
      "01.01"
    );
    t.equal(messages.length, 1, "01.02");
    t.equal(applyFixes(str, messages), "<a>", "01.03");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${33}m${`basic`}\u001b[${39}m`} - a single closing tag, space before slash`,
  (t) => {
    const str = "\n</a\t\t>";
    const messages = verify(t, str, {
      rules: {
        "tag-space-before-closing-bracket": 2,
      },
    });
    t.match(
      messages,
      [
        {
          ruleId: "tag-space-before-closing-bracket",
          severity: 2,
          idxFrom: 4,
          idxTo: 6,
          message: "Bad whitespace.",
          fix: {
            ranges: [[4, 6]],
          },
        },
      ],
      "02.01"
    );
    t.equal(messages.length, 1, "02.02");
    t.equal(applyFixes(str, messages), "\n</a>", "02.03");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${33}m${`basic`}\u001b[${39}m`} - works with attributes, double quotes`,
  (t) => {
    const str = `<div class="zz yy" >`;
    const messages = verify(t, str, {
      rules: {
        "tag-space-before-closing-bracket": 2,
      },
    });
    t.match(
      messages,
      [
        {
          ruleId: "tag-space-before-closing-bracket",
          severity: 2,
          idxFrom: 18,
          idxTo: 19,
          message: "Bad whitespace.",
          fix: {
            ranges: [[18, 19]],
          },
        },
      ],
      "03.01"
    );
    t.equal(messages.length, 1, "03.02");
    t.equal(applyFixes(str, messages), `<div class="zz yy">`, "03.03");
    t.end();
  }
);

// 02. XML
// -----------------------------------------------------------------------------

tap.test(`04 - ${`\u001b[${36}m${`XML tags`}\u001b[${39}m`} - basic`, (t) => {
  const str = `<?xml version="1.0" encoding="UTF-8"?   >`;
  const messages = verify(t, str, {
    rules: {
      "tag-space-before-closing-bracket": 2,
    },
  });
  t.match(
    messages,
    [
      {
        ruleId: "tag-space-before-closing-bracket",
        severity: 2,
        idxFrom: 37,
        idxTo: 40,
        message: "Bad whitespace.",
        fix: {
          ranges: [[37, 40]],
        },
      },
    ],
    "04.01"
  );
  t.equal(messages.length, 1, "04.02");
  t.equal(
    applyFixes(str, messages),
    `<?xml version="1.0" encoding="UTF-8"?>`,
    "04.03"
  );
  t.end();
});

// 03. doesn't raise errors
// -----------------------------------------------------------------------------

tap.test(
  `05 - ${`\u001b[${33}m${`no error`}\u001b[${39}m`} - does not touch tags with closing slash`,
  (t) => {
    const str = "<br\t\t/\t\t>";
    const messages = verify(t, str, {
      rules: {
        "tag-space-before-closing-bracket": 2,
      },
    });
    t.strictSame(messages, [], "05.01");
    t.equal(applyFixes(str, messages), str, "05.02");
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${33}m${`no error`}\u001b[${39}m`} - because of a backslash`,
  (t) => {
    const str = `<br\t\t${BACKSLASH}\t\t>`;
    const messages = verify(t, str, {
      rules: {
        "tag-space-before-closing-bracket": 2,
      },
    });
    t.strictSame(messages, [], "06.01");
    t.equal(applyFixes(str, messages), str, "06.02");
    t.end();
  }
);
