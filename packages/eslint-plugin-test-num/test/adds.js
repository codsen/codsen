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

tap.test(`04 - testing TS parser directly`, (t) => {
  const tsLinter = new Linter();
  tsLinter.defineRule(
    "test-num/correct-test-num",
    api.rules["correct-test-num"]
  );
  tsLinter.defineParser("@typescript-eslint/parser", parser);

  const input = `tap.test(
  \`05.00 - zzz\`,
  (t) => {
    t.strictSame(fix("z &ang; y"), [], "01");
    t.end();
  }
);`;

  t.strictSame(
    tsLinter.verify(input, {
      parser: "@typescript-eslint/parser",
      // parserOptions: { ecmaVersion: 11 },
      rules: {
        "test-num/correct-test-num": "error",
      },
    }),
    [
      {
        ruleId: "test-num/correct-test-num",
        severity: 2,
        message: "Update the test number.",
        line: 2,
        column: 3,
        nodeType: "TemplateElement",
        messageId: "correctTestNum",
        endLine: 2,
        endColumn: 16,
        fix: {
          range: [13, 18],
          text: "01",
        },
      },
    ],
    "04"
  );

  t.end();
});

tap.test(`05 - testing TS parser directly`, (t) => {
  const tsLinter = new Linter();
  tsLinter.defineRule(
    "test-num/correct-test-num",
    api.rules["correct-test-num"]
  );
  tsLinter.defineParser("@typescript-eslint/parser", parser);

  const input = `tap.test(
  \`01 - zzz\`,
  (t) => {
    t.strictSame(fix("z &ang; y"), [], "05");
    t.end();
  }
);`;

  t.strictSame(
    tsLinter.verify(input, {
      parser: "@typescript-eslint/parser",
      // parserOptions: { ecmaVersion: 11 },
      rules: {
        "test-num/correct-test-num": "error",
      },
    }),
    [
      {
        ruleId: "test-num/correct-test-num",
        severity: 2,
        message: "Update the test number.",
        line: 4,
        endLine: 4,
        column: 40,
        endColumn: 44,
        nodeType: "Literal",
        messageId: "correctTestNum",
        fix: {
          range: [75, 77],
          text: "01",
        },
      },
    ],
    "05"
  );

  t.end();
});

tap.test(`06 - testing TS parser directly`, (t) => {
  const tsLinter = new Linter();
  tsLinter.defineRule(
    "test-num/correct-test-num",
    api.rules["correct-test-num"]
  );
  tsLinter.defineParser("@typescript-eslint/parser", parser);

  const input = `tap.test(
  \`01 - zzz\`,
  (t) => {
    t.strictSame(fix("z &ang; y"), []);
    t.end();
  }
);`;

  t.strictSame(
    tsLinter.verify(input, {
      parser: "@typescript-eslint/parser",
      // parserOptions: { ecmaVersion: 11 },
      rules: {
        "test-num/correct-test-num": "error",
      },
    }),
    [
      {
        ruleId: "test-num/correct-test-num",
        severity: 2,
        message: "Update the test number.",
        line: 4,
        endLine: 4,
        column: 5,
        endColumn: 40,
        nodeType: "ExpressionStatement",
        messageId: "correctTestNum",
        fix: {
          range: [72, 72],
          text: ', "01"',
        },
      },
    ],
    "06"
  );

  t.end();
});

tap.test(`07 - testing TS parser directly`, (t) => {
  const tsLinter = new Linter();
  tsLinter.defineRule(
    "test-num/correct-test-num",
    api.rules["correct-test-num"]
  );
  tsLinter.defineParser("@typescript-eslint/parser", parser);

  const input = `tap.test("99", (t) => {
  t.is("ok", "ok", "01");
  t.end();
});`;

  t.strictSame(
    tsLinter.verify(input, {
      parser: "@typescript-eslint/parser",
      // parserOptions: { ecmaVersion: 11 },
      rules: {
        "test-num/correct-test-num": "error",
      },
    }),
    [
      {
        ruleId: "test-num/correct-test-num",
        severity: 2,
        message: "Update the test number.",
        line: 1,
        endLine: 1,
        column: 10,
        endColumn: 14,
        nodeType: "Literal",
        messageId: "correctTestNum",
        fix: {
          range: [10, 12],
          text: "01",
        },
      },
    ],
    "07"
  );

  t.end();
});

tap.test(`08 - testing TS parser directly`, (t) => {
  const tsLinter = new Linter();
  tsLinter.defineRule(
    "test-num/correct-test-num",
    api.rules["correct-test-num"]
  );
  tsLinter.defineParser("@typescript-eslint/parser", parser);

  const input = `tap.test("01", (t) => {
  t.is("ok", "ok", "99");
  t.end();
});`;

  t.strictSame(
    tsLinter.verify(input, {
      parser: "@typescript-eslint/parser",
      // parserOptions: { ecmaVersion: 11 },
      rules: {
        "test-num/correct-test-num": "error",
      },
    }),
    [
      {
        ruleId: "test-num/correct-test-num",
        severity: 2,
        message: "Update the test number.",
        line: 2,
        endLine: 2,
        column: 20,
        endColumn: 24,
        nodeType: "Literal",
        messageId: "correctTestNum",
        fix: {
          range: [44, 46],
          text: "01",
        },
      },
    ],
    "08"
  );

  t.end();
});

tap.test(`09 - testing TS parser directly - baseline`, (t) => {
  const linter = new Linter();
  linter.defineRule("test-num/correct-test-num", api.rules["correct-test-num"]);
  // linter.defineParser("@typescript-eslint/parser", parser);

  const input = `tap.test(\`9 - a\`, (t) => {
  t.is("ok", "ok", "01");
  t.end();
});`;

  t.strictSame(
    linter.verify(input, {
      // parser: "@typescript-eslint/parser",
      parserOptions: { ecmaVersion: 11 },
      rules: {
        "test-num/correct-test-num": "error",
      },
    }),
    [
      {
        ruleId: "test-num/correct-test-num",
        severity: 2,
        message: "Update the test number.",
        line: 1,
        endLine: 1,
        column: 10,
        endColumn: 17,
        nodeType: "TemplateElement",
        messageId: "correctTestNum",
        fix: {
          range: [10, 11],
          text: "01",
        },
      },
    ],
    "09"
  );

  t.end();
});

tap.test(`10 - testing TS parser directly - TS`, (t) => {
  const tsLinter = new Linter();
  tsLinter.defineRule(
    "test-num/correct-test-num",
    api.rules["correct-test-num"]
  );
  tsLinter.defineParser("@typescript-eslint/parser", parser);

  const input = `tap.test(\`9 - a\`, (t) => {
  t.is("ok", "ok", "01");
  t.end();
});`;

  t.strictSame(
    tsLinter.verify(input, {
      parser: "@typescript-eslint/parser",
      // parserOptions: { ecmaVersion: 11 },
      rules: {
        "test-num/correct-test-num": "error",
      },
    }),
    [
      {
        ruleId: "test-num/correct-test-num",
        severity: 2,
        message: "Update the test number.",
        line: 1,
        endLine: 1,
        column: 10,
        endColumn: 17,
        nodeType: "TemplateElement",
        messageId: "correctTestNum",
        fix: {
          range: [10, 11],
          text: "01",
        },
      },
    ],
    "10"
  );

  t.end();
});
