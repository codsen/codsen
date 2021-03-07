import tap from "tap";
import { applyFixes, verify } from "../../../t-util/util";

// false positives
// -----------------------------------------------------------------------------

tap.test(`01 - one attribute`, (t) => {
  const str = `<br class="h"/>`;
  const messages = verify(t, str, {
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
  const messages = verify(t, str, {
    rules: {
      "attribute-on-closing-tag": 2,
    },
  });
  t.equal(applyFixes(str, messages), str, "02.01");
  t.strictSame(messages, [], "02.02");
  t.end();
});

// the cases
// -----------------------------------------------------------------------------

tap.test(`03 - one attribute`, (t) => {
  const str = `<a>z</a class="y">`;
  const messages = verify(t, str, {
    rules: {
      "attribute-on-closing-tag": 2,
    },
  });
  t.equal(applyFixes(str, messages), str, "03.01");
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
    "03.02"
  );
  t.equal(messages.length, 1, "03.03");
  t.end();
});
