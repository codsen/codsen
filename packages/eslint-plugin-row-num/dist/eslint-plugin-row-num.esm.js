/**
 * eslint-plugin-row-num
 * ESLint plugin to update row numbers on each console.log
 * Version: 1.2.10
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/eslint-plugin-row-num/
 */

import fixRowNums from 'js-row-num';

const create = (context) => {
  return {
    CallExpression(node) {
      /* istanbul ignore else */
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
        node.arguments.forEach((arg) => {
          if (
            arg.type === "Literal" &&
            typeof arg.raw === "string" &&
            arg.raw !==
              fixRowNums(arg.raw, {
                overrideRowNum: arg.loc.start.line,
                returnRangesOnly: false,
                extractedLogContentsWereGiven: true,
              })
          ) {
            context.report({
              node,
              messageId: "correctRowNum",
              fix: (fixerObj) => {
                const ranges = fixRowNums(arg.raw, {
                  overrideRowNum: arg.loc.start.line,
                  returnRangesOnly: true,
                  extractedLogContentsWereGiven: true,
                });
                const preppedRanges = [
                  arg.start + ranges[0][0],
                  arg.start + ranges[0][1],
                ];
                return fixerObj.replaceTextRange(preppedRanges, ranges[0][2]);
              },
            });
          } else if (
            arg.type === "TemplateLiteral" &&
            Array.isArray(arg.quasis) &&
            arg.quasis.length &&
            typeof arg.quasis[0] === "object" &&
            arg.quasis[0].value &&
            arg.quasis[0].value.raw &&
            arg.quasis[0].value.raw !==
              fixRowNums(arg.quasis[0].value.raw, {
                overrideRowNum: arg.loc.start.line,
                returnRangesOnly: false,
                extractedLogContentsWereGiven: true,
              })
          ) {
            context.report({
              node,
              messageId: "correctRowNum",
              fix: (fixerObj) => {
                const ranges = fixRowNums(arg.quasis[0].value.raw, {
                  overrideRowNum: arg.loc.start.line,
                  returnRangesOnly: true,
                  extractedLogContentsWereGiven: true,
                });
                const preppedRanges = [
                  arg.start + 1 + ranges[0][0],
                  arg.start + 1 + ranges[0][1],
                ];
                return fixerObj.replaceTextRange(preppedRanges, ranges[0][2]);
              },
            });
          }
        });
      }
    },
  };
};
var correctRowNum = {
  create,
  meta: {
    type: "suggestion",
    messages: {
      correctRowNum: "Update the row number.",
    },
    fixable: "code",
  },
};

var main = {
  configs: {
    recommended: {
      plugins: ["row-num"],
      rules: {
        "no-console": "off",
        "row-num/correct-row-num": "error",
      },
    },
  },
  rules: {
    "correct-row-num": correctRowNum,
  },
};

export default main;
