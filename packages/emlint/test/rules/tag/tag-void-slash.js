import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { applyFixes, verify } from "../../../t-util/util.js";
// import { deepContains } from "ast-deep-contains");

// 1. no config
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${33}m${"no config"}\u001b[${39}m`} - slash present`, () => {
  let str = "<br/>";
  let messages = verify(not, str, {
    rules: {
      "tag-void-slash": 2,
    },
  });
  equal(messages, [], "01.01");
  equal(applyFixes(str, messages), str, "01.02");
});

test(`02 - ${`\u001b[${33}m${"no config"}\u001b[${39}m`} - slash absent`, () => {
  let str = "<br>";
  let messages = verify(not, str, {
    rules: {
      "tag-void-slash": 2,
    },
  });
  compare(
    ok,
    messages,
    [
      {
        ruleId: "tag-void-slash",
        severity: 2,
        idxFrom: 0,
        idxTo: 4,
        message: "Missing slash.",
        fix: {
          ranges: [[3, 4, "/>"]],
        },
      },
    ],
    "02.01"
  );
  equal(applyFixes(str, messages), "<br/>", "02.01");
});

test(`03 - ${`\u001b[${33}m${"no config"}\u001b[${39}m`} - with "tag-space-before-closing-bracket"`, () => {
  let str = "<br>";
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": 2,
      "tag-void-slash": 2,
    },
  });
  compare(
    ok,
    messages,
    [
      {
        ruleId: "tag-void-slash",
        severity: 2,
        idxFrom: 0,
        idxTo: 4,
        message: "Missing slash.",
        fix: {
          ranges: [[3, 4, "/>"]],
        },
      },
    ],
    "03.01"
  );
  equal(applyFixes(str, messages), "<br/>", "03.01");
});

test(`04 - ${`\u001b[${33}m${"no config"}\u001b[${39}m`} - with grouped rule, "tag"`, () => {
  let str = "<br>";
  let messages = verify(not, str, {
    rules: {
      tag: 2,
    },
  });
  equal(applyFixes(str, messages), "<br/>", "04.01");
});

test(`05 - ${`\u001b[${33}m${"no config"}\u001b[${39}m`} - "tag-space-before-closing-bracket"=always`, () => {
  let str = "<br>";
  let fixed = "<br />";
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "always"],
      "tag-void-slash": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "05.01");
});

test(`06 - ${`\u001b[${33}m${"no config"}\u001b[${39}m`} - "tag-space-before-closing-bracket"=never`, () => {
  let str = "<br>";
  let fixed = "<br/>";
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "never"],
      "tag-void-slash": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "06.01");
});

test(`07 - ${`\u001b[${33}m${"no config"}\u001b[${39}m`} - "tag-space-before-closing-bracket"=never, hardcoded void's default always`, () => {
  let str = "<br>";
  let fixed = "<br/>";
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "never"],
      "tag-void-slash": [2, "always"],
    },
  });
  equal(applyFixes(str, messages), fixed, "07.01");
});

test(`08 - ${`\u001b[${33}m${"no config"}\u001b[${39}m`} - both never`, () => {
  let str = "<br>";
  let messages = verify(not, str, {
    rules: {
      "tag-space-before-closing-bracket": [2, "never"],
      "tag-void-slash": [2, "never"],
    },
  });
  equal(messages, [], "08.01");
  equal(applyFixes(str, messages), str, "08.02");
});

// 02. with config
// -----------------------------------------------------------------------------

test(`09 - ${`\u001b[${32}m${"with config"}\u001b[${39}m`} - slash absent, config=always`, () => {
  let str = "<br>";
  let messages = verify(not, str, {
    rules: {
      "tag-void-slash": [2, "always"],
    },
  });
  compare(
    ok,
    messages,
    [
      {
        ruleId: "tag-void-slash",
        severity: 2,
        idxFrom: 0,
        idxTo: 4,
        message: "Missing slash.",
        fix: {
          ranges: [[3, 4, "/>"]],
        },
      },
    ],
    "09.01"
  );
  equal(applyFixes(str, messages), "<br/>", "09.01");
});

test(`10 - ${`\u001b[${32}m${"with config"}\u001b[${39}m`} - slash absent, config=never`, () => {
  let str = "<br>";
  let messages = verify(not, str, {
    rules: {
      "tag-void-slash": [2, "never"],
    },
  });
  equal(messages, [], "10.01");
  equal(applyFixes(str, messages), str, "10.02");
});

test(`11 - ${`\u001b[${32}m${"with config"}\u001b[${39}m`} - slash present, config=never`, () => {
  let str = "<br/>";
  let messages = verify(not, str, {
    rules: {
      "tag-void-slash": [2, "never"],
    },
  });
  compare(
    ok,
    messages,
    [
      {
        ruleId: "tag-void-slash",
        severity: 2,
        idxFrom: 0,
        idxTo: 5,
        message: "Remove the slash.",
        fix: {
          ranges: [[3, 4]],
        },
      },
    ],
    "11.01"
  );
  equal(applyFixes(str, messages), "<br>", "11.01");
});

test(`12 - ${`\u001b[${32}m${"with config"}\u001b[${39}m`} - slash present, config=always`, () => {
  let str = "<br/>";
  let messages = verify(not, str, {
    rules: {
      "tag-void-slash": [2, "always"],
    },
  });
  equal(messages, [], "12.01");
  equal(applyFixes(str, messages), str, "12.02");
});

test("13 - does not touch the whitespace", () => {
  let str = "<br >";
  let fixed = "<br />";
  let messages = verify(not, str, {
    rules: {
      "tag-void-slash": [2, "always"],
    },
  });
  compare(
    ok,
    messages,
    [
      {
        ruleId: "tag-void-slash",
        severity: 2,
        idxFrom: 0,
        idxTo: 5,
        message: "Missing slash.",
        fix: {
          ranges: [[4, 5, "/>"]],
        },
      },
    ],
    "13.01"
  );
  equal(messages.length, 1, "13.01");
  equal(applyFixes(str, messages), fixed, "13.02");
});

// combo with tag-malformed, missing closing bracket
// -----------------------------------------------------------------------------

test.run();
