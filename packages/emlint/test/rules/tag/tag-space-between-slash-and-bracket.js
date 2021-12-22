import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { applyFixes, verify } from "../../../t-util/util.js";
// import { deepContains } from "ast-deep-contains");

const BACKSLASH = "\u005C";

// 1. no opts
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${33}m${`no opts`}\u001b[${39}m`} - one space`, () => {
  let str = "<br/ >";
  let messages = verify(not, str, {
    rules: {
      "tag-space-between-slash-and-bracket": 2,
    },
  });
  compare(
    ok,
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
  equal(applyFixes(str, messages), "<br/>", "01.02");
});

test(`02 - ${`\u001b[${33}m${`no opts`}\u001b[${39}m`} - one space`, () => {
  let str = "<br/ >";
  let messages = verify(not, str, {
    rules: {
      tag: 2,
    },
  });
  compare(
    ok,
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
  equal(applyFixes(str, messages), "<br/>", "02.02");
});

test(`03 - ${`\u001b[${33}m${`no opts`}\u001b[${39}m`} - one tab`, () => {
  let str = "<br/\t>";
  let messages = verify(not, str, {
    rules: {
      tag: 2,
    },
  });
  compare(
    ok,
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
  equal(applyFixes(str, messages), "<br/>", "03.02");
});

test(`04 - backslash`, () => {
  let str = `<br\t\t${BACKSLASH}\t\t>`;
  let fixed = `<br\t\t${BACKSLASH}>`;
  let messages = verify(not, str, {
    rules: {
      "tag-space-between-slash-and-bracket": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "04");
});

test.run();
