/**
 * @fileoverview checks, is each integer within each console.log matching row number, fixes if needed
 * @author Roy Revelt
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/correct-row-num");

const RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

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
  ]
});
