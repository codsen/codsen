import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";
import { deepContains } from "ast-deep-contains";

import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { applyFixes, verify } from "../../../t-util/util.js";

// substitute for tap t.fail - here is a function which just throws
function fail(s) {
  throw new Error(s);
}

// missing semi on a non-last rule
// -----------------------------------------------------------------------------

test("01 - 1/2", () => {
  let str = "<style>.a{color:red\ntext-align:left;}</style><body>a</body>";
  let fixed = "<style>.a{color:red;\ntext-align:left;}</style><body>a</body>";
  let messages = verify(not, str, {
    rules: {
      "css-rule-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "01.01");
  compare(
    ok,
    messages,
    [
      {
        severity: 2,
        ruleId: "css-rule-malformed",
        message: "Add a semicolon.",
        idxFrom: 10,
        idxTo: 19,
        fix: {
          ranges: [[19, 19, ";"]],
        },
      },
    ],
    "01.02"
  );
});

test("02 - 1/3, 2/3", () => {
  let str =
    "<style>.a{color:red\n\ntext-align:left\n\nfloat:right}</style><body>a</body>";
  let fixed =
    "<style>.a{color:red;\n\ntext-align:left;\n\nfloat:right}</style><body>a</body>";
  let messages = verify(not, str, {
    rules: {
      "css-rule-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "02.01");
  deepContains(
    messages,
    [
      {
        severity: 2,
        ruleId: "css-rule-malformed",
        message: "Add a semicolon.",
        idxFrom: 21,
        idxTo: 36,
        fix: {
          ranges: [[36, 36, ";"]],
        },
      },
      {
        severity: 2,
        ruleId: "css-rule-malformed",
        message: "Add a semicolon.",
        idxFrom: 10,
        idxTo: 19,
        fix: {
          ranges: [[19, 19, ";"]],
        },
      },
    ],
    equal,
    fail
  );
  equal(messages.length, 2, "02.02");
});

test("03 - 1/3, 2/3", () => {
  let str =
    "<style>.a{color:red;\n\ntext-align:left\n\nfloat:right}</style><body>a</body>";
  let fixed =
    "<style>.a{color:red;\n\ntext-align:left;\n\nfloat:right}</style><body>a</body>";
  let messages = verify(not, str, {
    rules: {
      "css-rule-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "03.01");
  compare(
    ok,
    messages,
    [
      {
        severity: 2,
        ruleId: "css-rule-malformed",
        message: "Add a semicolon.",
        idxFrom: 22,
        idxTo: 37,
        fix: {
          ranges: [[37, 37, ";"]],
        },
      },
    ],
    "03.02"
  );
  equal(messages.length, 1, "03.02");
});

// semi only
// -----------------------------------------------------------------------------

test("04 - one semi, tight", () => {
  let str = "<style>.a{;}</style><body>a</body>";
  let fixed = "<style>.a{}</style><body>a</body>";
  let messages = verify(not, str, {
    rules: {
      // "css-rule-malformed": 2,
      all: 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "04.01");
  compare(
    ok,
    messages,
    [
      {
        severity: 2,
        ruleId: "css-rule-malformed",
        message: "Rogue semicolon.",
        idxFrom: 10,
        idxTo: 11,
        fix: {
          ranges: [[10, 11]],
        },
      },
    ],
    "04.02"
  );
});

test("05 - two semis, tight", () => {
  let str = "<style>.a{;;}</style><body>a</body>";
  let fixed = "<style>.a{}</style><body>a</body>";
  let messages = verify(not, str, {
    rules: {
      // "css-rule-malformed": 2,
      all: 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "05.01");
  compare(
    ok,
    messages,
    [
      {
        severity: 2,
        ruleId: "css-rule-malformed",
        idxFrom: 10,
        idxTo: 11,
        message: "Rogue semicolon.",
        fix: {
          ranges: [[10, 11]],
        },
      },
      {
        severity: 2,
        ruleId: "css-rule-malformed",
        idxFrom: 11,
        idxTo: 12,
        message: "Rogue semicolon.",
        fix: {
          ranges: [[11, 12]],
        },
      },
    ],
    "05.02"
  );
});

// value missing
// -----------------------------------------------------------------------------

test("06 - nothing after semi", () => {
  let str = "<style>.a{color:}</style><body>a</body>";
  let messages = verify(not, str, {
    rules: {
      "css-rule-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), str, "06.01");
  compare(
    ok,
    messages,
    [
      {
        severity: 2,
        ruleId: "css-rule-malformed",
        message: "Missing value.",
        idxFrom: 10,
        idxTo: 16,
        fix: null,
      },
    ],
    "06.02"
  );
});

test("07 - value and semi missing, followed by correct rule", () => {
  let str = "<style>.a{ color \n\ntext-align:left;}</style><body>a</body>";
  let messages = verify(not, str, {
    rules: {
      "css-rule-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), str, "07.01");
  compare(
    ok,
    messages,
    [
      {
        severity: 2,
        ruleId: "css-rule-malformed",
        message: "Missing value.",
        idxFrom: 11,
        idxTo: 16,
        fix: null,
      },
    ],
    "07.02"
  );
});

test("08", () => {
  let str = "<style>.a{color: red !important float: left}</style>";
  let fixed = "<style>.a{color: red !important; float: left;}</style>";
  let messages = verify(not, str, {
    rules: {
      "css-rule-malformed": 2,
      "css-trailing-semi": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "08.01");
  deepContains(
    messages,
    [
      {
        severity: 2,
        ruleId: "css-rule-malformed",
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
        idxFrom: 32,
        idxTo: 43,
        fix: {
          ranges: [[43, 43, ";"]],
        },
      },
    ],
    equal,
    fail
  );
});

// rogue semi in front of important
// -----------------------------------------------------------------------------

test("09", () => {
  let str = "<style>.a{color:red; !important;}</style>";
  let fixed = "<style>.a{color:red !important;}</style>";
  let messages = verify(not, str, {
    rules: {
      "css-rule-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "09.01");
  compare(
    ok,
    messages,
    [
      {
        severity: 2,
        ruleId: "css-rule-malformed",
        message: "Delete the semicolon.",
        idxFrom: 19,
        idxTo: 20,
        fix: {
          ranges: [[19, 20]],
        },
      },
    ],
    "09.02"
  );
});

test("10 - impotant [sic]", () => {
  let str = "<style>.a{color:red;!impotant;}</style>";
  let fixed = "<style>.a{color:red !important;}</style>";
  let messages = verify(not, str, {
    rules: {
      "css-rule-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "10.01");
  deepContains(
    messages,
    [
      {
        severity: 2,
        ruleId: "css-rule-malformed",
        message: "Delete the semicolon.",
        idxFrom: 19,
        idxTo: 20,
        fix: {
          ranges: [[19, 20, " "]],
        },
      },
      {
        severity: 2,
        ruleId: "css-rule-malformed",
        message: "Malformed !important.",
        idxFrom: 20,
        idxTo: 29,
        fix: {
          ranges: [[20, 29, "!important"]],
        },
      },
    ],
    equal,
    fail
  );
});

// mis-spelled !important
// -----------------------------------------------------------------------------

test("11 - impotant [sic] - with space in front", () => {
  let str = "<style>.a{color:red !impotant;}</style>";
  let fixed = "<style>.a{color:red !important;}</style>";
  let messages = verify(not, str, {
    rules: {
      "css-rule-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "11.01");
});

test("12 - impotant [sic] - without space in front", () => {
  let str = "<style>.a{color:red!impotant}</style>";
  let fixed = "<style>.a{color:red!important}</style>";
  let messages = verify(not, str, {
    rules: {
      "css-rule-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "12.01");
});

test("13 - important without excl mark", () => {
  let str = "<style>.a{color:red important}</style>";
  let fixed = "<style>.a{color:red !important}</style>";
  let messages = verify(not, str, {
    rules: {
      "css-rule-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "13.01");
});

test("14 - important with number one instead of excl mark", () => {
  let str = "<style>.a{color:red 1important}</style>";
  let fixed = "<style>.a{color:red !important}</style>";
  let messages = verify(not, str, {
    rules: {
      "css-rule-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "14.01");
});

// whitespace in front of colon/semi
// -----------------------------------------------------------------------------

test("15 - space after colon/semi", () => {
  let str = "<style>.a{ color : red ; }</style>";
  let fixed = "<style>.a{ color: red; }</style>";
  let messages = verify(not, str, {
    rules: {
      "css-rule-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "15.01");
});

test("16 - no space after colon/semi", () => {
  let str = "<style>.a{color :red ;}</style>";
  let fixed = "<style>.a{color:red;}</style>";
  let messages = verify(not, str, {
    rules: {
      "css-rule-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "16.01");
});

test("17", () => {
  let str = "<style>.a{color : red;}</style>";
  let fixed = "<style>.a{color: red;}</style>";
  let messages = verify(not, str, {
    rules: {
      "css-rule-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "17.01");
});

test("18", () => {
  let str = "<style>.a{color : red ; text-align : left ;}</style>";
  let fixed = "<style>.a{color: red; text-align: left;}</style>";
  let messages = verify(not, str, {
    rules: {
      "css-rule-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "18.01");
});

// some other character is in place of a colon
// -----------------------------------------------------------------------------

test("19", () => {
  let str = "<style>.a{color/red;}</style>";
  let fixed = "<style>.a{color:red;}</style>";
  let messages = verify(not, str, {
    rules: {
      "css-rule-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "19.01");
});

// repeated semi after a property
// -----------------------------------------------------------------------------

test("20", () => {
  let str = "<style>.a{color: red;;}</style>";
  let fixed = "<style>.a{color: red;}</style>";
  let messages = verify(not, str, {
    rules: {
      "css-rule-malformed": 2,
    },
  });
  compare(
    ok,
    messages,
    [
      {
        fix: {
          ranges: [[21, 22]],
        },
        severity: 2,
        ruleId: "css-rule-malformed",
        idxFrom: 21,
        idxTo: 22,
        message: "Rogue semicolon.",
      },
    ],
    "20.01"
  );
  equal(applyFixes(str, messages), fixed, "20.01");
});

test.run();
