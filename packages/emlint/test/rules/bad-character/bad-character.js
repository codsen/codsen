import tap from "tap";
import { Linter, util } from "../../../dist/emlint.esm.js";

// -----------------------------------------------------------------------------

// ensure character-encode and bad-character-* don't clash
tap.test(`01`, (t) => {
  util.badChars.forEach((ruleName, charCode) => {
    const linter = new Linter();
    const messages = linter.verify(String.fromCharCode(charCode), {
      rules: {
        all: 2,
      },
    });
    t.match(
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
    t.equal(messages.length, 1);
  });
  t.end();
});

tap.test(`02`, (t) => {
  util.badChars.forEach((ruleName, charCode) => {
    const linter = new Linter();
    const messages = linter.verify(String.fromCharCode(charCode), {
      rules: {
        "character-encode": 2,
      },
    });
    t.equal(messages.length, charCode > 127 ? 1 : 0);
  });
  t.end();
});

tap.test(`03`, (t) => {
  util.badChars.forEach((ruleName, charCode) => {
    const linter = new Linter();
    const messages = linter.verify(String.fromCharCode(charCode), {
      rules: {
        "bad-character": 2,
      },
    });
    t.equal(messages.length, 1);
  });
  t.end();
});

tap.test(`04`, (t) => {
  util.badChars.forEach((ruleName, charCode) => {
    const linter = new Linter();
    const messages = linter.verify(String.fromCharCode(charCode), {
      rules: {
        "character-encode": 2,
        "bad-character": 0,
      },
    });
    t.equal(messages.length, charCode > 127 ? 1 : 0);
  });
  t.end();
});

tap.test(`05`, (t) => {
  util.badChars.forEach((ruleName, charCode) => {
    const linter = new Linter();
    const messages = linter.verify(String.fromCharCode(charCode), {
      rules: {
        "character-encode": 0,
        "bad-character": 2,
      },
    });
    t.equal(messages.length, 1);
  });
  t.end();
});

tap.test(`06`, (t) => {
  util.badChars.forEach((ruleName, charCode) => {
    const linter = new Linter();
    const messages = linter.verify(String.fromCharCode(charCode), {
      rules: {
        "character-encode": 0,
        "bad-character": 0,
      },
    });
    t.equal(messages.length, 0);
  });
  t.end();
});

tap.test(`07 - single REPLACEMENT CHARACTER`, (t) => {
  const linter = new Linter();
  const messages = linter.verify(String.fromCharCode(65533), {
    rules: {
      "character-encode": 2,
      "bad-character": 0,
    },
  });
  t.equal(messages.length, 1, "07");
  t.end();
});
