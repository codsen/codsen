import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { applyFixes, verify } from "../../../t-util/util.js";

// 01. double encoding on nbsp
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${33}m${"malformed numeric"}\u001b[${39}m`} - numeric entity outside of the range - group rule`, () => {
  let str = "a&#99999999999999999;z";
  let messages = verify(not, str, {
    rules: {
      "bad-html-entity": 2,
    },
  });
  equal(applyFixes(str, messages), "az", "01.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "bad-html-entity-malformed-numeric",
        severity: 2,
        idxFrom: 1,
        idxTo: 21,
        message: "Malformed numeric entity.",
        fix: {
          ranges: [[1, 21]],
        },
      },
    ],
    "01.02"
  );
  equal(messages.length, 1, "01.02");
});

test(`02 - ${`\u001b[${33}m${"malformed numeric"}\u001b[${39}m`} - numeric entity outside of the range - exact rule, 1`, () => {
  let str = "a&#99999999999999999;z";
  let messages = verify(not, str, {
    rules: {
      "bad-html-entity-malformed-numeric": 1,
    },
  });
  equal(applyFixes(str, messages), "az", "02.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "bad-html-entity-malformed-numeric",
        severity: 1,
        idxFrom: 1,
        idxTo: 21,
        message: "Malformed numeric entity.",
        fix: {
          ranges: [[1, 21]],
        },
      },
    ],
    "02.02"
  );
  equal(messages.length, 1, "02.02");
});

test(`03 - ${`\u001b[${33}m${"malformed numeric"}\u001b[${39}m`} - numeric entity outside of the range - exact rule, 2`, () => {
  let str = "a&#99999999999999999;z";
  let messages = verify(not, str, {
    rules: {
      "bad-html-entity-malformed-numeric": 2,
    },
  });
  equal(applyFixes(str, messages), "az", "03.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "bad-html-entity-malformed-numeric",
        severity: 2,
        idxFrom: 1,
        idxTo: 21,
        message: "Malformed numeric entity.",
        fix: {
          ranges: [[1, 21]],
        },
      },
    ],
    "03.02"
  );
  equal(messages.length, 1, "03.02");
});

// 02. dollar instead of a hash
// -----------------------------------------------------------------------------

test(`04 - ${`\u001b[${32}m${"malformed numeric"}\u001b[${39}m`} - dollar instead of hash - rule by wildcard`, () => {
  let str = "_&$65;_";
  let messages = verify(not, str, {
    rules: {
      "bad-html-entity-malformed-*": 2,
    },
  });
  equal(applyFixes(str, messages), "__", "04.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "bad-html-entity-malformed-numeric",
        severity: 2,
        idxFrom: 1,
        idxTo: 6,
        message: "Malformed numeric entity.",
        fix: {
          ranges: [[1, 6]],
        },
      },
    ],
    "04.02"
  );
  equal(messages.length, 1, "04.02");
});

// 03. disabled rule
// -----------------------------------------------------------------------------

test(`05 - ${`\u001b[${33}m${"disabled rule"}\u001b[${39}m`} - numeric entity outside of the range - group rule`, () => {
  let str = "a&#99999999999999999;z";
  let messages = verify(not, str, {
    rules: {
      "bad-html-entity": 0,
    },
  });
  equal(applyFixes(str, messages), str, "05.01");
  equal(messages, [], "05.02");
});

test(`06 - ${`\u001b[${33}m${"disabled rule"}\u001b[${39}m`} - numeric entity outside of the range - exact rule, 0`, () => {
  let str = "a&#99999999999999999;z";
  let messages = verify(not, str, {
    rules: {
      "bad-html-entity-malformed-numeric": [0],
    },
  });
  equal(applyFixes(str, messages), str, "06.01");
  equal(messages, [], "06.02");
});

test(`07 - ${`\u001b[${33}m${"disabled rule"}\u001b[${39}m`} - numeric entity outside of the range - exact rule, with other rules`, () => {
  let str = "a&#99999999999999999;z<br>";
  let messages = verify(not, str, {
    rules: {
      "bad-html-entity-malformed-numeric": [0],
      "tag-void-slash": [1],
    },
  });
  equal(applyFixes(str, messages), "a&#99999999999999999;z<br/>", "07.01");
});

test.run();
