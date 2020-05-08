/* eslint no-prototype-builtins: 0 */

import tap from "tap";
import { Linter } from "eslint";
import api from "../dist/eslint-plugin-row-num.esm";
import rule from "../src/rules/correct-row-num";

const linter = new Linter();
linter.defineRule("row-num/correct-row-num", rule);

// we need to escape to prevent accidental "fixing" of this file through
// build scripts
const letterC = "\x63";
const backtick = "\x60";

console.log(`linter.version = ${linter.version}`);

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
    t.match(
      linter.verifyAndFix(`\n${letterC}onsole.log("9 something")`, {
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
      linter.verifyAndFix(`\n${letterC}onsole.log('9 something')`, {
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
  t.same(
    linter.verifyAndFix(
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
  t.same(
    linter.verifyAndFix(
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

// 02. false positives
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
      linter.verifyAndFix(testStr, {
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
