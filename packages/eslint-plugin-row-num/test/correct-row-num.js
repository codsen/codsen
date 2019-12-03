const rule = require("../rules/correct-row-num");
const RuleTester = require("eslint").RuleTester;

const ruleTester = new RuleTester();
ruleTester.run("correct-row-num", rule, {
  valid: [
    {
      code: 'console.log("001 one the first row")'
    },
    {
      code: '\n\nconsole.log("003 one the first row")'
    }
  ],

  invalid: [
    {
      code: '\n\nconsole.log("9 this should be 1")',
      output: '\n\nconsole.log("003 this should be 1")',
      errors: [
        {
          messageId: "correctRowNum"
        }
      ]
    }
    // {
    //   code: `console.log(\n"9"\n);`,
    //   output: `console.log(\n"002"\n);`,
    //   errors: [
    //     {
    //       messageId: "correctRowNum"
    //     }
    //   ]
    // }
  ]
});
