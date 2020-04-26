import tap from "tap";
import { Linter } from "eslint";
import correctRowNumRule from "../rules/correct-row-num";

const linter = new Linter();
linter.defineRule("row-num/correct-row-num", correctRowNumRule);

// we need to escape to prevent accidental "fixing" of this file through
// build scripts
const letterC = "\x63";
const backtick = "\x60";

console.log(`linter.version = ${linter.version}`);

// 01. basic tests
// -----------------------------------------------------------------------------

tap.test(
  `01.01 - ${`\u001b[${33}m${`basic`}\u001b[${39}m`} - double quotes`,
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
      }
    );

    t.end();
  }
);

tap.test(
  `01.02 - ${`\u001b[${33}m${`basic`}\u001b[${39}m`} - single quotes`,
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
      }
    );

    t.end();
  }
);

// Think:
// \nconsole.log('9 something')
tap.test(
  `01.03 - ${`\u001b[${33}m${`basic`}\u001b[${39}m`} - backticks`,
  (t) => {
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
      }
    );

    t.end();
  }
);

tap.test(
  `01.04 - ${`\u001b[${33}m${`basic`}\u001b[${39}m`} - backticks`,
  (t) => {
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
      }
    );

    t.end();
  }
);

// 02. false positives
// -----------------------------------------------------------------------------

tap.test(`02.01 - false positives - various tests`, (t) => {
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
