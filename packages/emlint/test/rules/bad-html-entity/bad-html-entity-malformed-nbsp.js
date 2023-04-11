import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { applyFixes, verify } from "../../../t-util/util.js";

// 01. missing letters
// -----------------------------------------------------------------------------

test("01 - group rule", () => {
  let str = "abc&nsp;def";
  let messages = verify(not, str, {
    rules: {
      "bad-html-entity": 2,
    },
  });
  equal(applyFixes(str, messages), "abc&nbsp;def", "01.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "bad-html-entity-malformed-nbsp",
        severity: 2,
        idxFrom: 3,
        idxTo: 8,
        message: "Malformed nbsp entity.",
        fix: {
          ranges: [[3, 8, "&nbsp;"]],
        },
      },
    ],
    "01.02"
  );
  equal(messages.length, 1, "01.02");
});

test("02 - exact rule", () => {
  let str = "abc&nsp;def";
  let messages = verify(not, str, {
    rules: {
      "bad-html-entity-malformed-nbsp": 2,
    },
  });
  equal(applyFixes(str, messages), "abc&nbsp;def", "02.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "bad-html-entity-malformed-nbsp",
        severity: 2,
        idxFrom: 3,
        idxTo: 8,
        message: "Malformed nbsp entity.",
        fix: {
          ranges: [[3, 8, "&nbsp;"]],
        },
      },
    ],
    "02.02"
  );
  equal(messages.length, 1, "02.02");
});

test("03 - rule by wildcard", () => {
  let str = "abc&nsp;def";
  let messages = verify(not, str, {
    rules: {
      "bad-html-entity-*": 2,
    },
  });
  equal(applyFixes(str, messages), "abc&nbsp;def", "03.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "bad-html-entity-malformed-nbsp",
        severity: 2,
        idxFrom: 3,
        idxTo: 8,
        message: "Malformed nbsp entity.",
        fix: {
          ranges: [[3, 8, "&nbsp;"]],
        },
      },
    ],
    "03.02"
  );
  equal(messages.length, 1, "03.02");
});

test("04 - group rule - off", () => {
  let str = "abc&nsp;def";
  let messages = verify(not, str, {
    rules: {
      "bad-html-entity": 0,
    },
  });
  equal(applyFixes(str, messages), str, "04.01");
  equal(messages, [], "04.02");
});

test("05 - exact rule - off", () => {
  let str = "abc&nsp;def";
  let messages = verify(not, str, {
    rules: {
      "bad-html-entity-malformed-nbsp": 0,
    },
  });
  equal(applyFixes(str, messages), str, "05.01");
  equal(messages, [], "05.02");
});

test("06 - rule by wildcard - off", () => {
  let str = "abc&nsp;def";
  let messages = verify(not, str, {
    rules: {
      "bad-html-entity-*": 0,
    },
  });
  equal(applyFixes(str, messages), str, "06.01");
  equal(messages, [], "06.02");
});

// 02. other malformed entities
// -----------------------------------------------------------------------------

test("07 - rule by wildcard", () => {
  let str = "&pond;1000";
  let messages = verify(not, str, {
    rules: {
      "bad-html-entity-*": 2,
    },
  });
  equal(applyFixes(str, messages), "&pound;1000", "07.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "bad-html-entity-malformed-pound",
        severity: 2,
        idxFrom: 0,
        idxTo: 6,
        message: "Malformed pound entity.",
        fix: {
          ranges: [[0, 6, "&pound;"]],
        },
      },
    ],
    "07.02"
  );
  equal(messages.length, 1, "07.02");
});

test("08 - rule by group rule", () => {
  let str = "&pond;1000";
  let messages = verify(not, str, {
    rules: {
      "bad-html-entity": 2,
    },
  });
  equal(applyFixes(str, messages), "&pound;1000", "08.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "bad-html-entity-malformed-pound",
        severity: 2,
        idxFrom: 0,
        idxTo: 6,
        message: "Malformed pound entity.",
        fix: {
          ranges: [[0, 6, "&pound;"]],
        },
      },
    ],
    "08.02"
  );
  equal(messages.length, 1, "08.02");
});

test("09 - rule by exact rule", () => {
  let str = "&pond;1000";
  let messages = verify(not, str, {
    rules: {
      "bad-html-entity-malformed-pound": 2,
    },
  });
  equal(applyFixes(str, messages), "&pound;1000", "09.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "bad-html-entity-malformed-pound",
        severity: 2,
        idxFrom: 0,
        idxTo: 6,
        message: "Malformed pound entity.",
        fix: {
          ranges: [[0, 6, "&pound;"]],
        },
      },
    ],
    "09.02"
  );
  equal(messages.length, 1, "09.02");
});

test("10 - rule by wildcard - off", () => {
  let str = "&pond;1000";
  let messages = verify(not, str, {
    rules: {
      "bad-html-entity-*": 0,
    },
  });
  equal(applyFixes(str, messages), str, "10.01");
  equal(messages, [], "10.02");
});

test("11 - rule by group rule - off", () => {
  let str = "&pond;1000";
  let messages = verify(not, str, {
    rules: {
      "bad-html-entity": 0,
    },
  });
  equal(applyFixes(str, messages), str, "11.01");
  equal(messages, [], "11.02");
});

test("12 - rule by exact rule - off", () => {
  let str = "&pond;1000";
  let messages = verify(not, str, {
    rules: {
      "bad-html-entity-malformed-pound": 0,
    },
  });
  equal(applyFixes(str, messages), str, "12.01");
  equal(messages, [], "12.02");
});

test.run();
