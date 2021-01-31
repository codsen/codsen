import tap from "tap";
import { Linter } from "../../../dist/emlint.esm";
import { applyFixes } from "../../../t-util/util";

// false positives
// -----------------------------------------------------------------------------

tap.test(`01 - one attribute`, (t) => {
  const str = `<br class="h"/>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-on-closing-tag": 2,
    },
  });
  t.equal(applyFixes(str, messages), str, "01.01");
  t.strictSame(messages, [], "01.02");
  t.end();
});

tap.test(`02 - one attribute`, (t) => {
  const str = `<br class="h">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-on-closing-tag": 2,
    },
  });
  t.equal(applyFixes(str, messages), str, "01.01");
  t.strictSame(messages, [], "01.02");
  t.end();
});

// the cases
// -----------------------------------------------------------------------------

tap.test(`03 - one attribute`, (t) => {
  const str = `<a>z</a class="y">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-on-closing-tag": 2,
    },
  });
  t.equal(applyFixes(str, messages), str, "02.01");
  t.match(
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
    "02.02"
  );
  t.equal(messages.length, 1, "02.03");
  t.end();
});
