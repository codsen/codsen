import tap from "tap";
import { deepContains } from "ast-deep-contains";
import { applyFixes, verify } from "../../../t-util/util";

const BACKSLASH = "\u005C";

// 1. basic tests
tap.test(`01 - a single tag`, (t) => {
  const str = "< a>";
  const messages = verify(t, str, {
    rules: {
      "tag-space-after-opening-bracket": 2,
    },
  });
  t.match(
    messages,
    [
      {
        ruleId: "tag-space-after-opening-bracket",
        severity: 2,
        idxFrom: 1,
        idxTo: 2,
        message: "Bad whitespace.",
        fix: {
          ranges: [[1, 2]],
        },
      },
    ],
    "01.01"
  );
  t.equal(applyFixes(str, messages), "<a>", "01.02");
  t.end();
});

tap.test(`02 - a single closing tag, space before slash`, (t) => {
  const str = "\n<\t\t/a>";
  const messages = verify(t, str, {
    rules: {
      "tag-space-after-opening-bracket": 2,
    },
  });
  t.match(
    messages,
    [
      {
        ruleId: "tag-space-after-opening-bracket",
        severity: 2,
        idxFrom: 2,
        idxTo: 4,
        message: "Bad whitespace.",
        fix: {
          ranges: [[2, 4]],
        },
      },
    ],
    "02.01"
  );
  t.equal(applyFixes(str, messages), "\n</a>", "02.02");
  t.end();
});

tap.test(`03 - a single closing tag, space after slash`, (t) => {
  const str = "\n</\t\ta>";
  const messages = verify(t, str, {
    rules: {
      "tag-space-after-opening-bracket": 2,
    },
  });
  t.match(
    messages,
    [
      {
        ruleId: "tag-space-after-opening-bracket",
        severity: 2,
        idxFrom: 3,
        idxTo: 5,
        message: "Bad whitespace.",
        fix: {
          ranges: [[3, 5]],
        },
      },
    ],
    "03.01"
  );
  t.equal(applyFixes(str, messages), "\n</a>", "03.02");
  t.end();
});

tap.test(`04 - a single closing tag, space before and after slash`, (t) => {
  const str = "\n<\t/\ta>";
  const messages = verify(t, str, {
    rules: {
      "tag-space-after-opening-bracket": 2,
    },
  });
  t.match(
    messages,
    [
      {
        ruleId: "tag-space-after-opening-bracket",
        severity: 2,
        idxFrom: 2,
        idxTo: 5,
        message: "Bad whitespace.",
        fix: {
          ranges: [
            [2, 3],
            [4, 5],
          ],
        },
      },
    ],
    "04.01"
  );
  t.equal(applyFixes(str, messages), "\n</a>", "04.02");
  t.end();
});

tap.test(`05 - in front of repeated slash`, (t) => {
  const str = "< // a>";
  const messages = verify(t, str, {
    rules: {
      "tag-space-after-opening-bracket": 2,
    },
  });
  t.match(
    messages,
    [
      {
        ruleId: "tag-space-after-opening-bracket",
        severity: 2,
        idxFrom: 1,
        idxTo: 5,
        message: "Bad whitespace.",
        fix: {
          ranges: [
            [1, 2],
            [4, 5],
          ],
        },
      },
    ],
    "05.01"
  );
  t.equal(applyFixes(str, messages), "<//a>", "05.02");
  t.end();
});

tap.test(`06 - in front of backslash`, (t) => {
  const str = `< ${BACKSLASH} a>`;
  const messages = verify(t, str, {
    rules: {
      tag: 2,
    },
  });
  deepContains(
    messages,
    [
      {
        ruleId: "tag-space-after-opening-bracket",
        severity: 2,
        idxFrom: 1,
        idxTo: 4,
        message: "Bad whitespace.",
        fix: {
          ranges: [
            [1, 2],
            [3, 4],
          ],
        },
      },
      {
        ruleId: "tag-closing-backslash",
        severity: 2,
        idxFrom: 2,
        idxTo: 3,
        message: "Wrong slash - backslash.",
        fix: {
          ranges: [[2, 3]],
        },
      },
    ],
    t.is,
    t.fail
  );
  t.equal(applyFixes(str, messages), `<a>`, "06");
  t.end();
});

// 02. XML
// -----------------------------------------------------------------------------

tap.test(`07 - ${`\u001b[${36}m${`XML tags`}\u001b[${39}m`} - basic`, (t) => {
  const str = `< ?xml version="1.0" encoding="UTF-8"?>`;
  const messages = verify(t, str, {
    rules: {
      "tag-space-after-opening-bracket": 2,
    },
  });
  t.match(
    messages,
    [
      {
        ruleId: "tag-space-after-opening-bracket",
        severity: 2,
        idxFrom: 1,
        idxTo: 2,
        message: "Bad whitespace.",
        fix: {
          ranges: [[1, 2]],
        },
      },
    ],
    "07.01"
  );
  t.equal(
    applyFixes(str, messages),
    `<?xml version="1.0" encoding="UTF-8"?>`,
    "07.02"
  );
  t.end();
});
