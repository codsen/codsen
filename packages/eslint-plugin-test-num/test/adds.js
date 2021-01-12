import tap from "tap";
import { Linter } from "eslint";
import api from "../dist/eslint-plugin-test-num.esm";
import {
  c,
  read,
  // letterC,
  // backtick,
  // dollar,
  // backslash,
} from "./util/util";

const linter = new Linter();

linter.defineRule("test-num/correct-test-num", api.rules["correct-test-num"]);

// test, does it add a message argument!!!
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${33}m${`adds the "message" arg`}\u001b[${39}m`} - adds 3rd arg, one liners`,
  (t) => {
    // ensure "in" is fixed
    const resIn = linter.verifyAndFix(read("07-in"), c);
    t.match(
      resIn,
      {
        fixed: true,
        output: read("07-out"),
      },
      "01.01"
    );

    // ensure no more errors are raised about "out"
    const messages = linter.verify(read("07-out"), c);
    t.strictSame(messages, [], `01.02`);
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${33}m${`adds the "message" arg`}\u001b[${39}m`} - adds 3rd arg, one liners`,
  (t) => {
    // ensure "in" is fixed
    const resIn = linter.verifyAndFix(read("08-in"), c);
    t.is(resIn.output, read("08-out"), "02.01");

    // ensure no more errors are raised about "out"
    const messages = linter.verify(read("08-out"), c);
    t.strictSame(messages, [], `02.02`);
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${33}m${`adds the "message" arg`}\u001b[${39}m`} - adds 3rd arg, ends with array value`,
  (t) => {
    // ensure "in" is fixed
    const resIn = linter.verifyAndFix(read("09-in"), c);
    t.is(resIn.output, read("09-out"), "03.01");

    // ensure no more errors are raised about "out"
    const messages = linter.verify(read("09-out"), c);
    t.strictSame(messages, [], `03.02`);
    t.end();
  }
);
