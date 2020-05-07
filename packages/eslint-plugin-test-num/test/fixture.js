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
    const resOut = linter.verifyAndFix(read("01-out"), c);
    t.same(resOut.messages, [], `01.04`);
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

    // ensure no more errors are raised about "out"
    const resOut = linter.verifyAndFix(read("02-out"), c);
    t.same(resOut.messages, [], `02.04`);
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

  // ensure no more errors are raised about "out"
  const resOut = linter.verifyAndFix(read("03-out"), c);
  t.same(resOut.messages, [], `03.04`);
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

  // ensure no more errors are raised about "out"
  const resOut = linter.verifyAndFix(read("04-out"), c);
  t.same(resOut.messages, [], `04.04`);
  t.end();
});

tap.only(`05 - ${`\u001b[${33}m${`basic`}\u001b[${39}m`} - edge cases`, (t) => {
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

  // // ensure no more errors are raised about "out"
  // const resOut = linter.verifyAndFix(read("05-out"), c);
  // t.same(resOut.messages, [], `05.04`);
  t.end();
});
