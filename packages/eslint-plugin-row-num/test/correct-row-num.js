const rule = require("../rules/correct-row-num");
const RuleTester = require("eslint").RuleTester;

const ruleTester = new RuleTester();

// we need to escape to prevent accidental "fixing" of this file through
// build scripts
const letterC = "\x63";

ruleTester.run("correct-row-num", rule, {
  valid: [
    {
      code: `${letterC}onsole.log("001 on the first row")`
    },
    {
      code: `\n\n${letterC}onsole.log("003 on the third row")`
    }
  ],

  invalid: [
    {
      code: `\n\n${letterC}onsole.log("045 this should be 1")`,
      output: `\n\n${letterC}onsole.log("003 this should be 1")`,
      errors: [
        {
          messageId: "correctRowNum"
        }
      ]
    }
    // {
    //   code: `${letterC}onsole.log(\n"9"\n);`,
    //   output: `${letterC}onsole.log(\n"002"\n);`,
    //   errors: [
    //     {
    //       messageId: "correctRowNum"
    //     }
    //   ]
    // }
  ]
});
