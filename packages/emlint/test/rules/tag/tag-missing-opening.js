import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { applyFixes, verify } from "../../../t-util/util.js";

// RULE IS TRIGGERED DIRECTLY FROM PARSER!
// IT'S SOURCE IS IN CODSEN-PARSER, NOT IN src/rules/tag/tag-missing-opening.js

// REMEMBER TO UPDATE src/util/nonFileBasedTagRules.json WHEN YOU ADD SIMILAR RULES

// 01. basic
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${33}m${`basic`}\u001b[${39}m`} - off`, () => {
  let str = "z </b>";
  let messages = verify(not, str, {
    rules: {
      "tag-missing-opening": 0,
    },
  });
  equal(applyFixes(str, messages), str, "01.01");
  equal(messages, [], "01.02");
});

test(`02 - ${`\u001b[${33}m${`basic`}\u001b[${39}m`} - warn`, () => {
  let str = "z </b>";
  let messages = verify(not, str, {
    rules: {
      "tag-missing-opening": 1,
    },
  });
  equal(applyFixes(str, messages), str, "02.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "tag-missing-opening",
        severity: 1,
        idxFrom: 2,
        idxTo: 6,
        message: `Opening tag is missing.`,
        fix: null,
      },
    ],
    "02.02"
  );
});

test(`03 - ${`\u001b[${33}m${`basic`}\u001b[${39}m`} - err`, () => {
  let str = "z </b>";
  let messages = verify(not, str, {
    rules: {
      "tag-missing-opening": 2,
    },
  });
  equal(applyFixes(str, messages), str, "03.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "tag-missing-opening",
        severity: 2,
        idxFrom: 2,
        idxTo: 6,
        message: `Opening tag is missing.`,
        fix: null,
      },
    ],
    "03.02"
  );
});

test(`04 - ${`\u001b[${33}m${`basic`}\u001b[${39}m`} - via blanket rule, severity 1`, () => {
  let str = "z </b>";
  let messages = verify(not, str, {
    rules: {
      tag: 1,
    },
  });
  equal(applyFixes(str, messages), str, "04.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "tag-missing-opening",
        severity: 1,
        idxFrom: 2,
        idxTo: 6,
        message: `Opening tag is missing.`,
        fix: null,
      },
    ],
    "04.02"
  );
});

test(`05 - ${`\u001b[${33}m${`basic`}\u001b[${39}m`} - via blanket rule, severity 2`, () => {
  let str = "z </b>";
  let messages = verify(not, str, {
    rules: {
      tag: 2,
    },
  });
  equal(applyFixes(str, messages), str, "05.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "tag-missing-opening",
        severity: 2,
        idxFrom: 2,
        idxTo: 6,
        message: `Opening tag is missing.`,
        fix: null,
      },
    ],
    "05.02"
  );
});

test(`06 - ${`\u001b[${33}m${`basic`}\u001b[${39}m`} - no issue here`, () => {
  let str = "<style>\n\n</style>";
  let messages = verify(not, str, {
    rules: {
      "tag-missing-opening": 2,
    },
  });
  equal(applyFixes(str, messages), str, "06.01");
  equal(messages, [], "06.02");
});

// 02. various
// -----------------------------------------------------------------------------

test(`07 - ${`\u001b[${33}m${`various`}\u001b[${39}m`} - opening and closing void tag`, () => {
  let str = `<br><br>zzz</br></br>`;
  let fixed = `<br /><br />zzz<br /><br />`;
  let messages = verify(not, str, {
    rules: {
      all: 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "07");
});

test(`08 - ${`\u001b[${33}m${`various`}\u001b[${39}m`} - false positive - unclosed void`, () => {
  let str = `<br><br>zzz<br>`;
  let fixed = `<br /><br />zzz<br />`;
  let messages = verify(not, str, {
    rules: {
      all: 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "08");
});

test.run();
