import tap from "tap";
import { applyFixes, verify } from "../../../t-util/util";
// import { deepContains } from "ast-deep-contains");

const BACKSLASH = "\u005C";

// 1. no opts
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${33}m${`no opts`}\u001b[${39}m`} - one space`,
  (t) => {
    const str = "<br/ >";
    const messages = verify(t, str, {
      rules: {
        "tag-space-between-slash-and-bracket": 2,
      },
    });
    t.match(
      messages,
      [
        {
          ruleId: "tag-space-between-slash-and-bracket",
          severity: 2,
          idxFrom: 4,
          idxTo: 5,
          line: 1,
          column: 5,
          message: "Bad whitespace.",
          fix: {
            ranges: [[4, 5]],
          },
        },
      ],
      "01.01"
    );
    t.equal(applyFixes(str, messages), "<br/>", "01.02");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${33}m${`no opts`}\u001b[${39}m`} - one space`,
  (t) => {
    const str = "<br/ >";
    const messages = verify(t, str, {
      rules: {
        tag: 2,
      },
    });
    t.match(
      messages,
      [
        {
          ruleId: "tag-space-between-slash-and-bracket",
          severity: 2,
          idxFrom: 4,
          idxTo: 5,
          line: 1,
          column: 5,
          message: "Bad whitespace.",
          fix: {
            ranges: [[4, 5]],
          },
        },
      ],
      "02.01"
    );
    t.equal(applyFixes(str, messages), "<br/>", "02.02");
    t.end();
  }
);

tap.test(`03 - ${`\u001b[${33}m${`no opts`}\u001b[${39}m`} - one tab`, (t) => {
  const str = "<br/\t>";
  const messages = verify(t, str, {
    rules: {
      tag: 2,
    },
  });
  t.match(
    messages,
    [
      {
        ruleId: "tag-space-between-slash-and-bracket",
        severity: 2,
        idxFrom: 4,
        idxTo: 5,
        line: 1,
        column: 5,
        message: "Bad whitespace.",
        fix: {
          ranges: [[4, 5]],
        },
      },
    ],
    "03.01"
  );
  t.equal(applyFixes(str, messages), "<br/>", "03.02");
  t.end();
});

tap.test(`04 - backslash`, (t) => {
  const str = `<br\t\t${BACKSLASH}\t\t>`;
  const fixed = `<br\t\t${BACKSLASH}>`;
  const messages = verify(t, str, {
    rules: {
      "tag-space-between-slash-and-bracket": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "04");
  t.end();
});
