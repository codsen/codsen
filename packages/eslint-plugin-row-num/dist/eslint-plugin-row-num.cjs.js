/**
 * eslint-plugin-row-num
 * ESLint plugin to update row numbers on each console.log
 * Version: 1.2.4
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/eslint-plugin-row-num
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var fixRowNums = _interopDefault(require('js-row-num'));

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

var create = function create(context) {
  return {
    CallExpression: function CallExpression(node) {
      /* istanbul ignore else */
      if (node.callee && node.callee.type === "MemberExpression" && node.callee.object && node.callee.object.type === "Identifier" && node.callee.object.name === "console" && node.callee.property && node.callee.property.type === "Identifier" && node.callee.property.name === "log" && node.arguments && Array.isArray(node.arguments) && node.arguments.length) {
        node.arguments.forEach(function (arg) {
          if (arg.type === "Literal" && typeof arg.raw === "string" && arg.raw !== fixRowNums(arg.raw, {
            overrideRowNum: arg.loc.start.line,
            returnRangesOnly: false,
            extractedLogContentsWereGiven: true
          })) {
            context.report({
              node: node,
              messageId: "correctRowNum",
              fix: function fix(fixerObj) {
                var ranges = fixRowNums(arg.raw, {
                  overrideRowNum: arg.loc.start.line,
                  returnRangesOnly: true,
                  extractedLogContentsWereGiven: true
                });
                var preppedRanges = [arg.start + ranges[0][0], arg.start + ranges[0][1]];
                return fixerObj.replaceTextRange(preppedRanges, ranges[0][2]);
              }
            });
          } else if (arg.type === "TemplateLiteral" && Array.isArray(arg.quasis) && arg.quasis.length && _typeof(arg.quasis[0]) === "object" && arg.quasis[0].value && arg.quasis[0].value.raw && arg.quasis[0].value.raw !== fixRowNums(arg.quasis[0].value.raw, {
            overrideRowNum: arg.loc.start.line,
            returnRangesOnly: false,
            extractedLogContentsWereGiven: true
          })) {
            context.report({
              node: node,
              messageId: "correctRowNum",
              fix: function fix(fixerObj) {
                var ranges = fixRowNums(arg.quasis[0].value.raw, {
                  overrideRowNum: arg.loc.start.line,
                  returnRangesOnly: true,
                  extractedLogContentsWereGiven: true
                });
                var preppedRanges = [arg.start + 1 + ranges[0][0], arg.start + 1 + ranges[0][1]];
                return fixerObj.replaceTextRange(preppedRanges, ranges[0][2]);
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
