/* eslint no-prototype-builtins: 0 */

import tap from "tap";
import { Linter } from "eslint";
import rule from "../src/rules/correct-test-num";
import {
  c,
  read,
  // letterC,
  // backtick,
  // dollar,
  // backslash,
} from "./util/util";

const linter = new Linter();
linter.defineRule("test-num/correct-test-num", rule);

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
      `01.01`
    );

    // ensure no more errors are raised about "out"
    const messages = linter.verify(read("01-out"), c);
    t.same(messages, [], `01.02`);
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
      `02.01`
    );
    t.same(resIn.messages, [], `02.02`);

    // ensure no more errors are raised about "out"
    const messages = linter.verify(read("02-out"), c);
    t.same(messages, [], `02.03`);
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
    `03.01`
  );
  t.same(resIn.messages, [], `03.02`);

  // ensure no more errors are raised about "out"
  const messages = linter.verify(read("03-out"), c);
  t.same(messages, [], `03.03`);
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
    `04.01`
  );
  t.same(resIn.messages, [], `04.02`);

  // ensure no more errors are raised about "out"
  const messages = linter.verify(read("04-out"), c);
  t.same(messages, [], `04.03`);
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
    `05.01`
  );
  t.same(resIn.messages, [], `05.02`);

  // ensure no more errors are raised about "out"
  const messages = linter.verify(read("05-out"), c);
  t.same(messages, [], `05.03`);
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
    `06.01`
  );

  // ensure no more errors are raised about "out"
  const messages = linter.verify(read("06-out"), c);
  t.same(messages, [], `06.02`);
  t.end();
});

tap.todo(
  `07 - ${`\u001b[${33}m${`basic`}\u001b[${39}m`} - more complex code to be disregarded inside test`,
  (t) => {
    // ensure "in" is fixed
    const resIn = linter.verifyAndFix(read("10-in"), c);
    t.match(
      resIn,
      {
        fixed: true,
        output: read("10-out"),
      },
      `07.01`
    );

    // ensure no more errors are raised about "out"
    const messages = linter.verify(read("10-out"), c);
    t.same(messages, [], `07.02`);
    t.end();
  }
);
