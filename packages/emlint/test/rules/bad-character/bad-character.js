import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// eslint-disable-next-line no-unused-vars
import { compare } from "../../../../../ops/helpers/shallow-compare.js";

import { Linter, util } from "../../../dist/emlint.esm.js";

// -----------------------------------------------------------------------------

// ensure character-encode and bad-character-* don't clash
test(`01`, () => {
  util.badChars.forEach((ruleName, charCode) => {
    let linter = new Linter();
    let messages = linter.verify(String.fromCharCode(charCode), {
      rules: {
        all: 2,
      },
    });
    compare(
      ok,
      messages,
      [
        {
          ruleId: ruleName,
          severity: 2,
          idxFrom: 0,
          idxTo: 1,
          line: 1,
          column: 1,
          fix: {
            ranges: [[0, 1]],
          },
        },
      ],
      "02.01"
    );
    equal(messages.length, 1);
  });
});

test(`02`, () => {
  util.badChars.forEach((ruleName, charCode) => {
    let linter = new Linter();
    let messages = linter.verify(String.fromCharCode(charCode), {
      rules: {
        "character-encode": 2,
      },
    });
    equal(messages.length, charCode > 127 ? 1 : 0);
  });
});

test(`03`, () => {
  util.badChars.forEach((ruleName, charCode) => {
    let linter = new Linter();
    let messages = linter.verify(String.fromCharCode(charCode), {
      rules: {
        "bad-character": 2,
      },
    });
    equal(messages.length, 1);
  });
});

test(`04`, () => {
  util.badChars.forEach((ruleName, charCode) => {
    let linter = new Linter();
    let messages = linter.verify(String.fromCharCode(charCode), {
      rules: {
        "character-encode": 2,
        "bad-character": 0,
      },
    });
    equal(messages.length, charCode > 127 ? 1 : 0);
  });
});

test(`05`, () => {
  util.badChars.forEach((ruleName, charCode) => {
    let linter = new Linter();
    let messages = linter.verify(String.fromCharCode(charCode), {
      rules: {
        "character-encode": 0,
        "bad-character": 2,
      },
    });
    equal(messages.length, 1);
  });
});

test(`06`, () => {
  util.badChars.forEach((ruleName, charCode) => {
    let linter = new Linter();
    let messages = linter.verify(String.fromCharCode(charCode), {
      rules: {
        "character-encode": 0,
        "bad-character": 0,
      },
    });
    equal(messages.length, 0);
  });
});

test(`07 - single REPLACEMENT CHARACTER`, () => {
  let linter = new Linter();
  let messages = linter.verify(String.fromCharCode(65533), {
    rules: {
      "character-encode": 2,
      "bad-character": 0,
    },
  });
  equal(messages.length, 1, "07");
});

test.run();
