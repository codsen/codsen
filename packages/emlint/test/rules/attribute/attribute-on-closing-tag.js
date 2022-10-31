import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { applyFixes, verify } from "../../../t-util/util.js";

// false positives
// -----------------------------------------------------------------------------

test(`01 - one attribute`, () => {
  let str = `<br class="h"/>`;
  let messages = verify(not, str, {
    rules: {
      "attribute-on-closing-tag": 2,
    },
  });
  equal(applyFixes(str, messages), str, "01.01");
  equal(messages, [], "01.02");
});

test(`02 - one attribute`, () => {
  let str = `<br class="h">`;
  let messages = verify(not, str, {
    rules: {
      "attribute-on-closing-tag": 2,
    },
  });
  equal(applyFixes(str, messages), str, "02.01");
  equal(messages, [], "02.02");
});

// the cases
// -----------------------------------------------------------------------------

test(`03 - one attribute`, () => {
  let str = `<a>z</a class="y">`;
  let messages = verify(not, str, {
    rules: {
      "attribute-on-closing-tag": 2,
    },
  });
  equal(applyFixes(str, messages), str, "03.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "attribute-on-closing-tag",
        severity: 2,
        idxFrom: 8,
        idxTo: 17,
        message: `Attribute on a closing tag.`,
        fix: null,
      },
    ],
    "03.02"
  );
  equal(messages.length, 1, "03.02");
});

test.run();
