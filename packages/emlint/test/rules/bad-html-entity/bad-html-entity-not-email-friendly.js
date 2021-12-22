import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { applyFixes, verify } from "../../../t-util/util.js";

// 01. one entity of the list
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - group rule`, () => {
  let str = `abc&Intersection;def`;
  let messages = verify(not, str, {
    rules: {
      "bad-html-entity": 2,
    },
  });
  equal(applyFixes(str, messages), "abc&#x22C2;def", "01.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "bad-html-entity-not-email-friendly",
        severity: 2,
        idxFrom: 3,
        idxTo: 17,
        message: "Email-unfriendly named HTML entity.",
        fix: {
          ranges: [[3, 17, "&#x22C2;"]],
        },
      },
    ],
    "01.02"
  );
  equal(messages.length, 1, "01.03");
});

test(`02 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - exact rule`, () => {
  let str = `abc&Intersection;def`;
  let messages = verify(not, str, {
    rules: {
      "bad-html-entity-not-email-friendly": 1,
    },
  });
  equal(applyFixes(str, messages), "abc&#x22C2;def", "02.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "bad-html-entity-not-email-friendly",
        severity: 1,
        idxFrom: 3,
        idxTo: 17,
        message: "Email-unfriendly named HTML entity.",
        fix: {
          ranges: [[3, 17, "&#x22C2;"]],
        },
      },
    ],
    "02.02"
  );
  equal(messages.length, 1, "02.03");
});

test(`03 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - through wildcard`, () => {
  let str = `abc&Intersection;def`;
  let messages = verify(not, str, {
    rules: {
      all: 1,
    },
  });
  equal(applyFixes(str, messages), "abc&#x22C2;def", "03.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "bad-html-entity-not-email-friendly",
        severity: 1,
        idxFrom: 3,
        idxTo: 17,
        message: "Email-unfriendly named HTML entity.",
        fix: {
          ranges: [[3, 17, "&#x22C2;"]],
        },
      },
    ],
    "03.02"
  );
  equal(messages.length, 1, "03.03");
});

test(`04 - all`, () => {
  let str = `abc&Intersection;def`;
  let messages = verify(not, str, {
    rules: {
      all: 2,
    },
  });
  equal(applyFixes(str, messages), "abc&#x22C2;def", "04.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "bad-html-entity-not-email-friendly",
        severity: 2,
        idxFrom: 3,
        idxTo: 17,
        message: "Email-unfriendly named HTML entity.",
        fix: {
          ranges: [[3, 17, "&#x22C2;"]],
        },
      },
    ],
    "04.02"
  );
  equal(messages.length, 1, "04.03");
});

test.run();
