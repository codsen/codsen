import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { applyFixes, verify } from "../../../t-util/util.js";

// 00. false positives
// -----------------------------------------------------------------------------

test("01 - not a style, inline", () => {
  let str = '<img alt="color: red">';
  let messages = verify(not, str, {
    rules: {
      "css-trailing-semi": 2,
    },
  });
  equal(applyFixes(str, messages), str, "01.01");
  equal(messages, [], "01.02");
});

test("02 - not a style, head", () => {
  let str = "<span>a{color: red}";
  let messages = verify(not, str, {
    rules: {
      "css-trailing-semi": 2,
    },
  });
  equal(applyFixes(str, messages), str, "02.01");
  equal(messages, [], "02.02");
});

// always
// -----------------------------------------------------------------------------

test("03 - one style, always", () => {
  let str = '<style>.a{color:red}</style><body style="color:red">a</body>';
  let fixed = '<style>.a{color:red;}</style><body style="color:red;">a</body>';
  let messages = verify(not, str, {
    rules: {
      "css-trailing-semi": [2, "always"],
    },
  });
  equal(applyFixes(str, messages), fixed, "03.01");
  compare(
    ok,
    messages,
    [
      {
        severity: 2,
        ruleId: "css-trailing-semi",
        message: "Add a semicolon.",
        idxFrom: 10,
        idxTo: 19,
        fix: {
          ranges: [[19, 19, ";"]],
        },
      },
      {
        severity: 2,
        ruleId: "css-trailing-semi",
        message: "Add a semicolon.",
        idxFrom: 41,
        idxTo: 50,
        fix: {
          ranges: [[50, 50, ";"]],
        },
      },
    ],
    "03.02"
  );
});

test("04 - one style, always, spaced important", () => {
  let str =
    '<style>.a{color: red !important}</style><body style="color: red !important">a</body>';
  let fixed =
    '<style>.a{color: red !important;}</style><body style="color: red !important;">a</body>';
  let messages = verify(not, str, {
    rules: {
      "css-trailing-semi": [2, "always"],
    },
  });
  compare(
    ok,
    messages,
    [
      {
        severity: 2,
        ruleId: "css-trailing-semi",
        message: "Add a semicolon.",
        idxFrom: 10,
        idxTo: 31,
        fix: {
          ranges: [[31, 31, ";"]],
        },
      },
      {
        severity: 2,
        ruleId: "css-trailing-semi",
        message: "Add a semicolon.",
        idxFrom: 53,
        idxTo: 74,
        fix: {
          ranges: [[74, 74, ";"]],
        },
      },
    ],
    "04.01"
  );
  equal(applyFixes(str, messages), fixed, "04.01");
});

test("05 - one style, always, tight important", () => {
  let str =
    '<style>.a{color:red!important}</style><body style="color:red!important">a</body>';
  let fixed =
    '<style>.a{color:red!important;}</style><body style="color:red!important;">a</body>';
  let messages = verify(not, str, {
    rules: {
      "css-trailing-semi": [2, "always"],
    },
  });
  equal(applyFixes(str, messages), fixed, "05.01");
});

test("06 - one style, always, inner whitespace", () => {
  let str = "<style>.a{color:red }</style><body>a</body>";
  let fixed = "<style>.a{color:red; }</style><body>a</body>";
  let messages = verify(not, str, {
    rules: {
      "css-trailing-semi": [1, "always"],
    },
  });
  equal(applyFixes(str, messages), fixed, "06.01");
});

test("07 - two styles, always", () => {
  let str = "<style>.a{text-align:left; color:red}</style><body>a</body>";
  let fixed = "<style>.a{text-align:left; color:red;}</style><body>a</body>";
  let messages = verify(not, str, {
    rules: {
      "css-trailing-semi": [2, "always"],
    },
  });
  equal(applyFixes(str, messages), fixed, "07.01");
});

test("08 - two styles with space, always", () => {
  let str = "<style>.a{text-align:left; color:red }</style><body>a</body>";
  let fixed = "<style>.a{text-align:left; color:red; }</style><body>a</body>";
  let messages = verify(not, str, {
    rules: {
      "css-trailing-semi": [2, "always"],
    },
  });
  equal(applyFixes(str, messages), fixed, "08.01");
});

test("09 - two styles, default=always", () => {
  let str = "<style>.a{text-align:left; color:red\n}</style><body>a</body>";
  let fixed = "<style>.a{text-align:left; color:red;\n}</style><body>a</body>";
  let messages = verify(not, str, {
    rules: {
      "css-trailing-semi": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "09.01");
});

test("10 - nothing to fix", () => {
  let str = "<style>.a{\ntext-align:left;\ncolor:red;\n}</style><body>a</body>";
  let messages = verify(not, str, {
    rules: {
      "css-trailing-semi": [2, "always"],
    },
  });
  equal(applyFixes(str, messages), str, "10.01");
  equal(messages, [], "10.02");
});

// never
// -----------------------------------------------------------------------------

test("11 - one style, never", () => {
  let str = "<style>.a{color:red;}</style><body>a</body>";
  let fixed = "<style>.a{color:red}</style><body>a</body>";
  let messages = verify(not, str, {
    rules: {
      "css-trailing-semi": [2, "never"],
    },
  });
  equal(applyFixes(str, messages), fixed, "11.01");
  compare(
    ok,
    messages,
    [
      {
        severity: 2,
        ruleId: "css-trailing-semi",
        message: "Remove the semicolon.",
        idxFrom: 10,
        idxTo: 20,
        fix: {
          ranges: [[19, 20]],
        },
      },
    ],
    "11.02"
  );
});

test("12 - two styles, never", () => {
  let str = "<style>.a{text-align:left;color:red;}</style><body>a</body>";
  let fixed = "<style>.a{text-align:left;color:red}</style><body>a</body>";
  let messages = verify(not, str, {
    rules: {
      "css-trailing-semi": [2, "never"],
    },
  });
  equal(applyFixes(str, messages), fixed, "12.01");
});

test("13 - two styles, never, trailing whitespace", () => {
  let str = "<style>.a{text-align:left;color:red; }</style><body>a</body>";
  let fixed = "<style>.a{text-align:left;color:red }</style><body>a</body>";
  let messages = verify(not, str, {
    rules: {
      "css-trailing-semi": [2, "never"],
    },
  });
  equal(applyFixes(str, messages), fixed, "13.01");
});

// ESP tags
//
// -----------------------------------------------------------------------------

test("14 - wrapped with Nunjucks IF", () => {
  let str = '<td{% if foo %} style="color:red"{% endif %}>';
  let fixed = '<td{% if foo %} style="color:red;"{% endif %}>';
  let messages = verify(not, str, {
    rules: {
      "css-trailing-semi": [2, "always"],
    },
  });
  equal(applyFixes(str, messages), fixed, "14.01");
});

test("15", () => {
  let str = '<td{% if foo %} style="color:red"{% endif %} align="left">';
  let fixed = '<td{% if foo %} style="color:red;"{% endif %} align="left">';
  let messages = verify(not, str, {
    rules: {
      "css-trailing-semi": [2, "always"],
    },
  });
  equal(applyFixes(str, messages), fixed, "15.01");
});

test.run();
