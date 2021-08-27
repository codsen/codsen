/* eslint no-prototype-builtins: 0 */

import tap from "tap";
import { Linter } from "eslint";
import api from "../dist/eslint-plugin-row-num.esm.js";
import * as parser from "@typescript-eslint/parser";

// we need to escape to prevent accidental "fixing" of this file through
// build scripts
const letterC = "\x63";
const backtick = "\x60";

// -----------------------------------------------------------------------------

// setup

function verifyAndFix(t, str, opts) {
  // ensure that TS parser result is the same
  const linter = new Linter();
  // console.log(`linter.version = ${linter.version}`);
  linter.defineRule("row-num/correct-row-num", api.rules["correct-row-num"]);

  const tsLinter = new Linter();
  tsLinter.defineRule("row-num/correct-row-num", api.rules["correct-row-num"]);
  tsLinter.defineParser("@typescript-eslint/parser", parser);
  t.strictSame(
    linter.verifyAndFix(str, opts),
    tsLinter.verifyAndFix(str, opts),
    "the TS parser output is not the same as native esprima's!"
  );

  // now just return the output
  return linter.verifyAndFix(str, opts);
}

// 00. API wirings
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${33}m${`api`}\u001b[${39}m`} - object is exported`,
  (t) => {
    t.is(typeof api, "object", "01");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${33}m${`api`}\u001b[${39}m`} - object is exported`,
  (t) => {
    // eslint-disable-next-line no-prototype-builtins
    t.true(api.hasOwnProperty("rules"), "02");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${33}m${`api`}\u001b[${39}m`} - rule "correct-row-num" is exported`,
  (t) => {
    t.true(api.rules.hasOwnProperty("correct-row-num"), "03.01");
    t.is(typeof api.rules["correct-row-num"], "object", "03.02");
    t.true(api.rules["correct-row-num"].hasOwnProperty("create"), "03.03");
    t.is(typeof api.rules["correct-row-num"].create, "function", "03.04");
    t.end();
  }
);

// 01. basic tests
// -----------------------------------------------------------------------------

tap.test(
  `04 - ${`\u001b[${33}m${`basic`}\u001b[${39}m`} - double quotes`,
  (t) => {
    // default parser, espree
    t.match(
      verifyAndFix(t, `\n${letterC}onsole.log("9 something")`, {
        rules: {
          "row-num/correct-row-num": "error",
        },
      }),
      {
        fixed: true,
        output: `\n${letterC}onsole.log("002 something")`,
        // messages: []
      },
      "04"
    );
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${33}m${`basic`}\u001b[${39}m`} - single quotes`,
  (t) => {
    t.match(
      verifyAndFix(t, `\n${letterC}onsole.log('9 something')`, {
        rules: {
          "row-num/correct-row-num": "error",
        },
      }),
      {
        fixed: true,
        output: `\n${letterC}onsole.log('002 something')`,
        // messages: []
      },
      "05"
    );

    t.end();
  }
);

// Think:
// \nconsole.log('9 something')
tap.test(`06 - ${`\u001b[${33}m${`basic`}\u001b[${39}m`} - backticks`, (t) => {
  t.strictSame(
    verifyAndFix(
      t,
      `\n${letterC}onsole.log(${backtick}9 something${backtick})`,
      {
        parserOptions: { ecmaVersion: 6 },
        rules: {
          "row-num/correct-row-num": "error",
        },
      }
    ),
    {
      fixed: true,
      output: `\n${letterC}onsole.log(${backtick}002 something${backtick})`,
      messages: [],
    },
    "06"
  );

  t.end();
});

tap.test(`07 - ${`\u001b[${33}m${`basic`}\u001b[${39}m`} - backticks`, (t) => {
  t.strictSame(
    verifyAndFix(
      t,
      `\n${letterC}onsole.log(\n${backtick}9 something${backtick}\n)`,
      {
        parserOptions: { ecmaVersion: 6 },
        rules: {
          "row-num/correct-row-num": "error",
        },
      }
    ),
    {
      fixed: true,
      output: `\n${letterC}onsole.log(\n${backtick}003 something${backtick}\n)`,
      messages: [],
    },
    "07"
  );

  t.end();
});

// false positives
// -----------------------------------------------------------------------------

tap.test(`08 - false positives - various tests`, (t) => {
  [
    `const z = "something"`,
    `const z = "something\n01"`,
    `const z = "99 aaaaa"`,
    `const z = "something 01"`,
    `const z = "01 something 01"`,
    `const z = "01 something 01\n"`,
    `const z = "\t01 something 01\n"`,
  ].forEach((testStr) => {
    t.match(
      verifyAndFix(t, testStr, {
        rules: {
          "row-num/correct-row-num": "error",
        },
      }),
      {
        fixed: false,
        output: testStr,
      }
    );
  });
  t.end();
});

// TS parser
// -----------------------------------------------------------------------------

tap.test(`09 - one-off test to 100% ensure TS parser is OK`, (t) => {
  // ?console.log('9 something')

  const tsLinter = new Linter();
  tsLinter.defineRule("row-num/correct-row-num", api.rules["correct-row-num"]);
  tsLinter.defineParser("@typescript-eslint/parser", parser);

  t.strictSame(
    tsLinter.verify(`\n${letterC}onsole.log('9 something')`, {
      parser: "@typescript-eslint/parser",
      rules: {
        "row-num/correct-row-num": "error",
      },
    }),
    [
      {
        ruleId: "row-num/correct-row-num",
        severity: 2,
        message: "Update the row number.",
        line: 2,
        column: 1,
        nodeType: "CallExpression",
        messageId: "correctRowNum",
        endLine: 2,
        endColumn: 27,
        fix: {
          range: [14, 15],
          text: "002",
        },
      },
    ],
    "09"
  );

  t.end();
});

tap.test(`10`, (t) => {
  const tsLinter = new Linter();
  tsLinter.defineRule("row-num/correct-row-num", api.rules["correct-row-num"]);
  tsLinter.defineParser("@typescript-eslint/parser", parser);

  const input = `const trailingSemi = (context, mode) => {
  return {
    tag(node) {
      console.log(${backtick}0 abc${backtick});
    },
  };
};`;

  t.strictSame(
    tsLinter.verify(input, {
      parser: "@typescript-eslint/parser",
      rules: {
        "row-num/correct-row-num": "error",
      },
    }),
    [
      {
        ruleId: "row-num/correct-row-num",
        severity: 2,
        message: "Update the row number.",
        line: 4,
        column: 7,
        nodeType: "CallExpression",
        messageId: "correctRowNum",
        endLine: 4,
        endColumn: 27,
        fix: {
          range: [88, 89],
          text: "004",
        },
      },
    ],
    "10"
  );

  t.end();
});
