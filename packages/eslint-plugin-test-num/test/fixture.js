/* eslint no-prototype-builtins: 0 */

import fs from "fs";
import tap from "tap";
import { Linter } from "eslint";
import rule from "../src/rules/correct-test-num";

const linter = new Linter();
linter.defineRule("test-num/correct-test-num", rule);

// we need to escape to prevent accidental "fixing" of this file through
// build scripts
// const letterC = "\x63";
// const backtick = "\x60";
// const dollar = "\x24";
// const backslash = "\x24";

// a common config for linter.verifyAndFix()
const c = {
  parserOptions: { ecmaVersion: 11 },
  rules: {
    "test-num/correct-test-num": "error",
  },
};

const read = (what) => {
  return fs.readFileSync(`test/fixtures/${what}.zz`, "utf8");
};

// 01. fixture tests
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${33}m${`basic`}\u001b[${39}m`} - replaces first and third arg digit chunks`,
  (t) => {
    // ensure "in" is fixed
    const resIn = linter.verifyAndFix(read("01-in"), c);
    t.match(
      resIn,
      {
        fixed: true,
        output: read("01-out"),
      },
      `01.02`
    );

    // ensure no more errors are raised about "out"
    const messages = linter.verify(read("01-out"), c);
    t.same(messages, [], `01.04`);
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${33}m${`basic`}\u001b[${39}m`} - grouped asserts`,
  (t) => {
    // ensure "in" is fixed
    const resIn = linter.verifyAndFix(read("02-in"), c);
    t.match(
      resIn,
      {
        fixed: true,
        output: read("02-out"),
      },
      `02.02`
    );
    t.same(resIn.messages, [], `02.03`);

    // ensure no more errors are raised about "out"
    const messages = linter.verify(read("02-out"), c);
    t.same(messages, [], `02.05`);
    t.end();
  }
);

tap.test(`03 - ${`\u001b[${33}m${`basic`}\u001b[${39}m`} - edge cases`, (t) => {
  // ensure "in" is fixed
  const resIn = linter.verifyAndFix(read("03-in"), c);
  t.match(
    resIn,
    {
      fixed: true,
      output: read("03-out"),
    },
    `03.02`
  );
  t.same(resIn.messages, [], `03.03`);

  // ensure no more errors are raised about "out"
  const messages = linter.verify(read("03-out"), c);
  t.same(messages, [], `03.05`);
  t.end();
});

tap.test(`04 - ${`\u001b[${33}m${`basic`}\u001b[${39}m`} - edge cases`, (t) => {
  // ensure "in" is fixed
  const resIn = linter.verifyAndFix(read("04-in"), c);
  t.match(
    resIn,
    {
      fixed: true,
      output: read("04-out"),
    },
    `04.02`
  );
  t.same(resIn.messages, [], `04.03`);

  // ensure no more errors are raised about "out"
  const messages = linter.verify(read("04-out"), c);
  t.same(messages, [], `04.05`);
  t.end();
});

tap.test(`05 - ${`\u001b[${33}m${`basic`}\u001b[${39}m`} - edge cases`, (t) => {
  // ensure "in" is fixed
  const resIn = linter.verifyAndFix(read("05-in"), c);
  t.match(
    resIn,
    {
      fixed: true,
      output: read("05-out"),
    },
    `05.02`
  );
  t.same(resIn.messages, [], `05.03`);

  // ensure no more errors are raised about "out"
  const messages = linter.verify(read("05-out"), c);
  t.same(messages, [], `05.05`);
  t.end();
});

tap.test(`06 - ${`\u001b[${33}m${`basic`}\u001b[${39}m`} - edge cases`, (t) => {
  // ensure "in" is fixed
  const resIn = linter.verifyAndFix(read("06-in"), c);
  t.match(
    resIn,
    {
      fixed: true,
      output: read("06-out"),
    },
    `06.02`
  );

  // ensure no more errors are raised about "out"
  const messages = linter.verify(read("06-out"), c);
  t.same(messages, [], `06.04`);
  t.end();
});
