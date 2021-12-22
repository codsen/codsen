import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { applyFixes, verify } from "../../../t-util/util.js";
// import { deepContains } from "ast-deep-contains");

// 1. no config - nothing happens
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${31}m${`no config`}\u001b[${39}m`} - off`, () => {
  let str = "<h1><div><zzz><yo><a></a><script></yo></h1>";
  let messages = verify(not, str, {
    rules: {
      "tag-is-present": 0,
    },
  });
  equal(messages, [], "01.01");
  equal(applyFixes(str, messages), str, "01.02");
});

test(`02 - ${`\u001b[${31}m${`no config`}\u001b[${39}m`} - warn`, () => {
  let str = "<h1><div><zzz><yo><a></a><script></yo></h1>";
  let messages = verify(not, str, {
    rules: {
      "tag-is-present": 1,
    },
  });
  equal(messages, [], "02.01");
  equal(applyFixes(str, messages), str, "02.02");
});

test(`03 - ${`\u001b[${31}m${`no config`}\u001b[${39}m`} - err`, () => {
  let str = "<h1><div><zzz><yo><a></a><script></yo></h1>";
  let messages = verify(not, str, {
    rules: {
      "tag-is-present": 2,
    },
  });
  equal(messages, [], "03.01");
  equal(applyFixes(str, messages), str, "03.02");
});

// 02. flagging up tags by their names
// -----------------------------------------------------------------------------

test(`04 - ${`\u001b[${32}m${`config`}\u001b[${39}m`} - flags one, exact match`, () => {
  let str = "<h1><div><zzz><yo><br/><a></a><script></yo></h1>";
  let messages = verify(not, str, {
    rules: {
      "tag-is-present": [2, "h1"],
    },
  });
  compare(
    ok,
    messages,
    [
      {
        ruleId: "tag-is-present",
        severity: 2,
        idxFrom: 0,
        idxTo: 4,
        message: "h1 is not allowed.",
        fix: {
          ranges: [[0, 4]],
        },
      },
      {
        ruleId: "tag-is-present",
        severity: 2,
        idxFrom: 43,
        idxTo: 48,
        message: "h1 is not allowed.",
        fix: {
          ranges: [[43, 48]],
        },
      },
    ],
    "04.01"
  );
  equal(
    applyFixes(str, messages),
    "<div><zzz><yo><br/><a></a><script></yo>",
    "04.02"
  );
});

test(`05 - ${`\u001b[${32}m${`config`}\u001b[${39}m`} - flags one, match by wildcard`, () => {
  let str = "<h1><div><zzz><yo><br/><a></a><script></yo></h1>";
  let messages = verify(not, str, {
    rules: {
      "tag-is-present": [2, "h*"],
    },
  });
  compare(
    ok,
    messages,
    [
      {
        ruleId: "tag-is-present",
        severity: 2,
        idxFrom: 0,
        idxTo: 4,
        message: "h1 is not allowed.",
        fix: {
          ranges: [[0, 4]],
        },
      },
      {
        ruleId: "tag-is-present",
        severity: 2,
        idxFrom: 43,
        idxTo: 48,
        message: "h1 is not allowed.",
        fix: {
          ranges: [[43, 48]],
        },
      },
    ],
    "05.01"
  );
  equal(
    applyFixes(str, messages),
    "<div><zzz><yo><br/><a></a><script></yo>",
    "05.02"
  );
});

test.run();
