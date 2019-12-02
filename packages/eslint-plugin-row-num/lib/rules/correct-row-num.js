const stringify = require("json-stringify-safe");
const fixRowNums = require("js-row-num");

/**
 * @fileoverview checks, is each integer within each console.log matching row number, fixes if needed
 * @author Roy Revelt
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    messages: {
      correctRowNum: "Update the row num."
    },
    docs: {
      description:
        "checks, is each integer within each console.log matching row number, fixes if needed",
      category: "Fill me in",
      recommended: false
    },
    fixable: "code", // or "code" or "whitespace"
    schema: [
      // fill in your schema
    ]
  },

  create(context) {
    // variables should be defined here
    // const options = context.options[0] || {};

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    // any helper functions should go here or else delete this section

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      CallExpression: function(node) {
        // console.log(stringify(node, null, 4));
        if (
          node.callee &&
          node.callee.type === "MemberExpression" &&
          node.callee.object &&
          node.callee.object.type === "Identifier" &&
          node.callee.object.name === "console" &&
          node.callee.property &&
          node.callee.property.type === "Identifier" &&
          node.callee.property.name === "log" &&
          node.arguments &&
          Array.isArray(node.arguments) &&
          node.arguments.length
        ) {
          node.arguments.forEach(arg => {
            // console.log(
            //   `062 ${`\u001b[${35}m${`██`}\u001b[${39}m`} ${stringify(
            //     arg,
            //     null,
            //     4
            //   )}`
            // );

            // if the updated console.log contents are different from what we
            // have now, latter needs to be updated.
            if (
              arg.value !==
              fixRowNums(arg.value, {
                overrideRowNum: arg.loc.start.line,
                returnRangesOnly: false,
                extractedLogContentsWereGiven: true
              })
            ) {
              // console.log(`073 fix needed!`);
              context.report({
                node,
                messageId: "correctRowNum",
                fix: fixerObj => {
                  const ranges = fixRowNums(arg.value, {
                    overrideRowNum: arg.loc.start.line,
                    returnRangesOnly: true, // <------ now we request ranges
                    extractedLogContentsWereGiven: true
                  });
                  // console.log(
                  //   `090 ${`\u001b[${33}m${`ranges`}\u001b[${39}m`} = ${JSON.stringify(
                  //     ranges,
                  //     null,
                  //     4
                  //   )}`
                  // );
                  // console.log(
                  //   `097 ${`\u001b[${33}m${`arg.start`}\u001b[${39}m`} = ${JSON.stringify(
                  //     arg.start,
                  //     null,
                  //     4
                  //   )} (type ${typeof arg.start})`
                  // );
                  const preppedRanges = [
                    arg.start + 1 + ranges[0][0],
                    arg.start + 1 + ranges[0][1]
                  ];
                  // console.log(
                  //   `108 ${`\u001b[${33}m${`preppedRanges`}\u001b[${39}m`} = ${JSON.stringify(
                  //     preppedRanges,
                  //     null,
                  //     4
                  //   )}`
                  // );
                  return fixerObj.replaceTextRange(preppedRanges, ranges[0][2]);
                }
              });
            }
          });
        }
      }
    };
  }
};
