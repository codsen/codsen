import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { applyFixes, verify } from "../../../t-util/util.js";

// 01. missing letters
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${33}m${`unrecognised entity`}\u001b[${39}m`} - group rule`, () => {
  let str = `abc&yo;def`;
  let messages = verify(not, str, {
    rules: {
      "bad-html-entity": 2,
    },
  });
  equal(applyFixes(str, messages), str, "01.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "bad-html-entity-unrecognised",
        severity: 2,
        idxFrom: 3,
        idxTo: 7,
        message: "Unrecognised named entity.",
        fix: {
          ranges: [],
        },
      },
    ],
    "01.02"
  );
  equal(messages.length, 1, "01.02");
});

test(`02 - ${`\u001b[${33}m${`unrecognised entity`}\u001b[${39}m`} - exact rule, severity level 1`, () => {
  let str = `abc&yo;def`;
  let messages = verify(not, str, {
    rules: {
      "bad-html-entity-unrecognised": 1,
    },
  });
  equal(applyFixes(str, messages), str, "02.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "bad-html-entity-unrecognised",
        severity: 1,
        idxFrom: 3,
        idxTo: 7,
        message: "Unrecognised named entity.",
        fix: {
          ranges: [], // no fixes
        },
      },
    ],
    "02.02"
  );
  equal(messages.length, 1, "02.02");
});

test(`03 - ${`\u001b[${33}m${`unrecognised entity`}\u001b[${39}m`} - exact rule, severity level 2`, () => {
  let str = `abc&yo;def`;
  let messages = verify(not, str, {
    rules: {
      "bad-html-entity-unrecognised": 2,
    },
  });
  equal(applyFixes(str, messages), str, "03.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "bad-html-entity-unrecognised",
        severity: 2,
        idxFrom: 3,
        idxTo: 7,
        message: "Unrecognised named entity.",
        fix: {
          ranges: [], // no fixes
        },
      },
    ],
    "03.02"
  );
  equal(messages.length, 1, "03.02");
});

test(`04 - ${`\u001b[${33}m${`unrecognised entity`}\u001b[${39}m`} - group rule`, () => {
  let str = `abc&yo;def`;
  let messages = verify(not, str, {
    rules: {
      "bad-html-entity": 2,
    },
  });
  equal(applyFixes(str, messages), str, "04.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "bad-html-entity-unrecognised",
        severity: 2,
        idxFrom: 3,
        idxTo: 7,
        message: "Unrecognised named entity.",
        fix: {
          ranges: [], // no fixes
        },
      },
    ],
    "04.02"
  );
  equal(messages.length, 1, "04.02");
});

test(`05 - ${`\u001b[${33}m${`unrecognised entity`}\u001b[${39}m`} - group rule - off`, () => {
  let str = `abc&yo;def`;
  let messages = verify(not, str, {
    rules: {
      "bad-html-entity": 0,
    },
  });
  equal(applyFixes(str, messages), str, "05.01");
  equal(messages, [], "05.02");
});

test(`06 - ${`\u001b[${33}m${`unrecognised entity`}\u001b[${39}m`} - exact rule, severity level 0`, () => {
  let str = `abc&yo;def`;
  let messages = verify(not, str, {
    rules: {
      "bad-html-entity-unrecognised": 0,
    },
  });
  equal(applyFixes(str, messages), str, "06.01");
  equal(messages, [], "06.02");
});

test(`07 - ${`\u001b[${33}m${`unrecognised entity`}\u001b[${39}m`} - rule by wildcard - off`, () => {
  let str = `abc&yo;def`;
  let messages = verify(not, str, {
    rules: {
      "bad-html-entity-*": 0,
    },
  });
  equal(applyFixes(str, messages), str, "07.01");
  equal(messages, [], "07.02");
});

test(`08 - all`, () => {
  let str = `abc&yo;def`;
  let messages = verify(not, str, {
    rules: {
      all: 2,
    },
  });
  equal(applyFixes(str, messages), str, "08.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "bad-html-entity-unrecognised",
        severity: 2,
        idxFrom: 3,
        idxTo: 7,
        message: "Unrecognised named entity.",
        fix: {
          ranges: [], // no fixes
        },
      },
    ],
    "08.02"
  );
});

test.run();
