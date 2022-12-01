import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { applyFixes, verify } from "../../../t-util/util.js";

// 01. basic
// -----------------------------------------------------------------------------

test(`01 - don't raise on void tags`, () => {
  let str = "</br>";
  let fixed = "<br>";
  let messages = verify(not, str, {
    rules: {
      "tag-void-frontal-slash": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "01.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "tag-void-frontal-slash",
        severity: 2,
        idxFrom: 0,
        idxTo: 5,
        message: `Remove frontal slash.`,
        fix: { ranges: [[1, 2]] },
      },
    ],
    "01.02"
  );
  is(messages.length, 1, "01.02");
});

test(`02 - fixed completely, severity 1`, () => {
  let str = "</br>";
  let fixed = "<br/>";
  let messages = verify(not, str, {
    rules: {
      tag: 1,
    },
  });
  equal(applyFixes(str, messages), fixed, "02.01");
  compare(
    ok,
    messages,
    [
      {
        severity: 1,
        message: "Remove frontal slash.",
        fix: {
          ranges: [[1, 2]],
        },
        ruleId: "tag-void-frontal-slash",
        idxFrom: 0,
        idxTo: 5,
      },
      {
        severity: 1,
        ruleId: "tag-void-slash",
        message: "Missing slash.",
        idxFrom: 0,
        idxTo: 5,
        fix: {
          ranges: [[4, 5, "/>"]],
        },
      },
    ],
    "02.02"
  );
  equal(messages.length, 2, "02.02");
});

test(`03 - fixed completely, severity 2`, () => {
  let str = "</br>";
  let fixed = "<br/>";
  let messages = verify(not, str, {
    rules: {
      tag: 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "03.01");
  compare(
    ok,
    messages,
    [
      {
        severity: 2,
        message: "Remove frontal slash.",
        fix: {
          ranges: [[1, 2]],
        },
        ruleId: "tag-void-frontal-slash",
        idxFrom: 0,
        idxTo: 5,
      },
      {
        severity: 2,
        ruleId: "tag-void-slash",
        message: "Missing slash.",
        idxFrom: 0,
        idxTo: 5,
        fix: {
          ranges: [[4, 5, "/>"]],
        },
      },
    ],
    "03.02"
  );
  equal(messages.length, 2, "03.02");
});

test.run();
