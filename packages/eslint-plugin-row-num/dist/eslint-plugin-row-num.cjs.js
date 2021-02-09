/**
 * eslint-plugin-row-num
 * ESLint plugin to update row numbers on each console.log
 * Version: 1.4.3
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/eslint-plugin-row-num/
 */

'use strict';

require('json-stringify-safe');
var jsRowNum = require('js-row-num');

var create = function create(context) {
  return {
    CallExpression: function CallExpression(node) {
      /* istanbul ignore else */

      if (node.callee && node.callee.type === "MemberExpression" && node.callee.object && node.callee.object.type === "Identifier" && node.callee.object.name === "console" && node.callee.property && node.callee.property.type === "Identifier" && node.callee.property.name === "log" && node.arguments && Array.isArray(node.arguments) && node.arguments.length) {
        node.arguments.forEach(function (arg) { // if the updated console.log contents are different from what we
          // have now, latter needs to be updated.

          if (arg.type === "Literal" && typeof arg.raw === "string" && arg.raw !== jsRowNum.fixRowNums(arg.raw, {
            overrideRowNum: arg.loc.start.line,
            returnRangesOnly: false,
            extractedLogContentsWereGiven: true
          })) {
            context.report({
              node: node,
              messageId: "correctRowNum",
              fix: function fix(fixerObj) {
                var ranges = jsRowNum.fixRowNums(arg.raw, {
                  overrideRowNum: arg.loc.start.line,
                  returnRangesOnly: true,
                  extractedLogContentsWereGiven: true
                });

                if (ranges) {
                  var offset = arg.start;

                  if (!offset && arg.range && typeof arg.range[0] === "number") {
                    offset = arg.range[0];
                  }

                  var preppedRanges = [offset + ranges[0][0], offset + ranges[0][1]];
                  return fixerObj.replaceTextRange(preppedRanges, ranges[0][2]);
                }
              }
            });
          } else if (arg.type === "TemplateLiteral" && Array.isArray(arg.quasis) && arg.quasis.length && typeof arg.quasis[0] === "object" && arg.quasis[0].value && arg.quasis[0].value.raw && arg.quasis[0].value.raw !== jsRowNum.fixRowNums(arg.quasis[0].value.raw, {
            overrideRowNum: arg.loc.start.line,
            returnRangesOnly: false,
            extractedLogContentsWereGiven: true
          })) {
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
