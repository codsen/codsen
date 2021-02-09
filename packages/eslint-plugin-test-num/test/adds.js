import tap from "tap";
import { Linter } from "eslint";
import * as parser from "@typescript-eslint/parser";
import api from "../dist/eslint-plugin-test-num.esm";
import {
  c,
  read,
  // letterC,
  // backtick,
  // dollar,
  // backslash,
} from "./util/util";

function verifyAndFix(t, str, opts) {
  // ensure that TS parser result is the same
  const linter = new Linter();
  // console.log(`linter.version = ${linter.version}`);
  linter.defineRule("test-num/correct-test-num", api.rules["correct-test-num"]);

  const tsLinter = new Linter();
  tsLinter.defineRule(
    "test-num/correct-test-num",
    api.rules["correct-test-num"]
  );
  tsLinter.defineParser("@typescript-eslint/parser", parser);
  t.match(
    linter.verifyAndFix(str, opts),
    tsLinter.verifyAndFix(str, opts),
    "the TS parser output is not the same as native esprima's!"
  );

  // now just return the output
  return linter.verifyAndFix(str, opts);
}

function verify(t, str, opts) {
  // ensure that TS parser result is the same
  const linter = new Linter();
  // console.log(`linter.version = ${linter.version}`);
  linter.defineRule("test-num/correct-test-num", api.rules["correct-test-num"]);

  const tsLinter = new Linter();
  tsLinter.defineRule(
    "test-num/correct-test-num",
    api.rules["correct-test-num"]
  );
  tsLinter.defineParser("@typescript-eslint/parser", parser);
  t.match(
    linter.verify(str, opts),
    tsLinter.verify(str, opts),
    "the TS parser output is not the same as native esprima's!"
  );

  // now just return the output
  return linter.verify(str, opts);
}

// test, does it add a message argument!!!
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${33}m${`adds the "message" arg`}\u001b[${39}m`} - adds 3rd arg, one liners`,
  (t) => {
    // ensure "in" is fixed
    const resIn = verifyAndFix(t, read("07-in"), c);
    t.match(
      resIn,
      {
        fixed: true,
        output: read("07-out"),
      },
      "01.01"
    );

    // ensure no more errors are raised about "out"
    const messages = verify(t, read("07-out"), c);
    t.strictSame(messages, [], `01.02`);
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${33}m${`adds the "message" arg`}\u001b[${39}m`} - adds 3rd arg, one liners`,
  (t) => {
    // ensure "in" is fixed
    const resIn = verifyAndFix(t, read("08-in"), c);
    t.is(resIn.output, read("08-out"), "02.01");

    // ensure no more errors are raised about "out"
    const messages = verify(t, read("08-out"), c);
    t.strictSame(messages, [], `02.02`);
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${33}m${`adds the "message" arg`}\u001b[${39}m`} - adds 3rd arg, ends with array value`,
  (t) => {
    // ensure "in" is fixed
    const resIn = verifyAndFix(t, read("09-in"), c);
    t.is(resIn.output, read("09-out"), "03.01");

    // ensure no more errors are raised about "out"
    const messages = verify(t, read("09-out"), c);
    t.strictSame(messages, [], `03.02`);
    t.end();
  }
);
