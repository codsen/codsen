import tap from "tap";
import { Linter } from "../../../dist/emlint.esm";
import { applyFixes } from "../../../t-util/util";

// 00. false positives
// -----------------------------------------------------------------------------

tap.todo(`01 - not style`, (t) => {
  const str = `<img alt="color: red">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "trailing-semi": 2,
    },
  });
  t.equal(applyFixes(str, messages), str, "01.01");
  t.strictSame(messages, [], "01.02");
  t.end();
});

// always
// -----------------------------------------------------------------------------

tap.todo(`02 - one style, always`, (t) => {
  const str = `<td style="color: red">z</td>`;
  const fixed = `<td style="color: red;">z</td>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "trailing-semi": [2, "always"],
    },
  });
  t.equal(applyFixes(str, messages), fixed, "02.01");
  t.strictSame(messages, [], "02.02");
  t.end();
});

tap.todo(`03 - two styles, always`, (t) => {
  const str = `<td style="text-align:left; color: red">z</td>`;
  const fixed = `<td style="text-align:left; color: red;">z</td>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "trailing-semi": [2, "always"],
    },
  });
  t.equal(applyFixes(str, messages), fixed, "03.01");
  t.strictSame(messages, [], "03.02");
  t.end();
});

tap.todo(`04 - two styles with space, always`, (t) => {
  const str = `<td style="text-align:left; color: red ">z</td>`;
  const fixed = `<td style="text-align:left; color: red;">z</td>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "trailing-semi": [2, "always"],
    },
  });
  t.equal(applyFixes(str, messages), fixed, "04.01");
  t.strictSame(messages, [], "04.02");
  t.end();
});

tap.todo(`05 - two styles, default=always`, (t) => {
  const str = `<td style="text-align:left; color: red">z</td>`;
  const fixed = `<td style="text-align:left; color: red;">z</td>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "trailing-semi": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "05.01");
  t.strictSame(messages, [], "05.02");
  t.end();
});

tap.todo(`06 - one style, always, nothing to fix`, (t) => {
  const str = `<td style="color: red;">z</td>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "trailing-semi": [2, "always"],
    },
  });
  t.equal(applyFixes(str, messages), str, "06.01");
  t.strictSame(messages, [], "06.02");
  t.end();
});

// never
// -----------------------------------------------------------------------------

tap.todo(`07 - one style, never`, (t) => {
  const str = `<td style="color: red;">z</td>`;
  const fixed = `<td style="color: red">z</td>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "trailing-semi": [2, "never"],
    },
  });
  t.equal(applyFixes(str, messages), fixed, "07.01");
  t.strictSame(messages, [], "07.02");
  t.end();
});
