/**
 * eslint-plugin-row-num
 * ESLint plugin to update row numbers on each console.log
 * Version: 1.4.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/eslint-plugin-row-num/
 */

'use strict';

var jsRowNum = require('js-row-num');

// import stringify from "json-stringify-safe";

var create = function create(context) {
  // console.log(
  //   `007 ${`\u001b[${33}m${`███████████████████████████████████████`}\u001b[${39}m`}`
  // );
  return {
    CallExpression: function CallExpression(node) {
      // console.log(stringify(node, null, 4));
      // console.log(`012 node.callee.type = ${node.callee.type}`);

      /* istanbul ignore else */
      if (node.callee && node.callee.type === "MemberExpression" && node.callee.object && node.callee.object.type === "Identifier" && node.callee.object.name === "console" && node.callee.property && node.callee.property.type === "Identifier" && node.callee.property.name === "log" && node.arguments && Array.isArray(node.arguments) && node.arguments.length) {
        node.arguments.forEach(function (arg) {
          // console.log(`029 arg.raw: ${arg.raw}`);
          // console.log(
          //   `031 ${`\u001b[${35}m${`██`}\u001b[${39}m`} ${stringify(
          //     arg,
          //     null,
          //     4
          //   )}`
          // );
          // if the updated console.log contents are different from what we
          // have now, latter needs to be updated.
          if (arg.type === "Literal" && typeof arg.raw === "string" && arg.raw !== jsRowNum.fixRowNums(arg.raw, {
            overrideRowNum: arg.loc.start.line,
            returnRangesOnly: false,
            extractedLogContentsWereGiven: true
          })) {
            // console.log(`050 we have console.log with single or double quotes`);
            context.report({
              node: node,
              messageId: "correctRowNum",
              fix: function fix(fixerObj) {
                var ranges = jsRowNum.fixRowNums(arg.raw, {
                  overrideRowNum: arg.loc.start.line,
                  returnRangesOnly: true,
                  extractedLogContentsWereGiven: true
                }); // console.log(
                //   `061 ${`\u001b[${33}m${`ranges`}\u001b[${39}m`} = ${JSON.stringify(
                //     ranges,
                //     null,
                //     4
                //   )}`
                // );
                // console.log(
                //   `068 ${`\u001b[${33}m${`arg.start`}\u001b[${39}m`} = ${JSON.stringify(
                //     arg.start,
                //     null,
                //     4
                //   )} (type ${typeof arg.start})`
                // );
                // console.log(`074 arg.start = ${arg.start}`);

                if (ranges) {
                  var preppedRanges = [arg.start + ranges[0][0], arg.start + ranges[0][1]]; // console.log(
                  //   `080 ${`\u001b[${33}m${`preppedRanges`}\u001b[${39}m`} = ${JSON.stringify(
                  //     preppedRanges,
                  //     null,
                  //     4
                  //   )}`
                  // );

                  return fixerObj.replaceTextRange(preppedRanges, ranges[0][2]);
                }
              }
            });
          } else if (arg.type === "TemplateLiteral" && Array.isArray(arg.quasis) && arg.quasis.length && typeof arg.quasis[0] === "object" && arg.quasis[0].value && arg.quasis[0].value.raw && arg.quasis[0].value.raw !== jsRowNum.fixRowNums(arg.quasis[0].value.raw, {
            overrideRowNum: arg.loc.start.line,
            returnRangesOnly: false,
            extractedLogContentsWereGiven: true
          })) {
            // console.log(`103 we have console.log with backticks`);
            // console.log(`R1: ${arg.quasis[0].value.raw}`);
            // console.log(
            //   `R2: ${fixRowNums(arg.quasis[0].value.raw, {
            //     overrideRowNum: arg.loc.start.line,
            //     returnRangesOnly: true,
            //     extractedLogContentsWereGiven: true
            //   })}`
            // );
            context.report({
              node: node,
              messageId: "correctRowNum",
              fix: function fix(fixerObj) {
                var ranges = jsRowNum.fixRowNums(arg.quasis[0].value.raw, {
                  overrideRowNum: arg.loc.start.line,
                  returnRangesOnly: true,
                  extractedLogContentsWereGiven: true
                });

                if (ranges) {
                  var preppedRanges = [arg.start + 1 + ranges[0][0], arg.start + 1 + ranges[0][1]];
                  return fixerObj.replaceTextRange(preppedRanges, ranges[0][2]);
                }
              }
            });
          }
        });
      }
    }
  };
};

var correctRowNum = {
  create: create,
  meta: {
    // docs: {
    //   url: getDocumentationUrl(__filename),
    // },
    type: "suggestion",
    messages: {
      correctRowNum: "Update the row number."
    },
    fixable: "code"
  }
};

var main = {
  configs: {
    recommended: {
      plugins: ["row-num"],
      rules: {
        "no-console": "off",
        "row-num/correct-row-num": "error"
      }
    }
  },
  rules: {
    "correct-row-num": correctRowNum
  }
};

module.exports = main;
