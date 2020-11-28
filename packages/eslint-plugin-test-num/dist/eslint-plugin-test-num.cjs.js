/**
 * eslint-plugin-test-num
 * ESLint plugin to update unit test numbers automatically
 * Version: 1.4.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/eslint-plugin-test-num/
 */

'use strict';

var op = require('object-path');
var stringLeftRight = require('string-left-right');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var op__default = /*#__PURE__*/_interopDefaultLegacy(op);

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function prep(str, originalOpts) {
  /* istanbul ignore if */
  if (typeof str !== "string" || !str.length) {
    return;
  }
  var defaults = {
    offset: 0
  };
  var opts = _objectSpread2(_objectSpread2({}, defaults), originalOpts);
  var digitsChunkStartsAt = null;
  var lastDigitAt;
  for (var i = 0, len = str.length; i <= len; i++) {
    if (
    digitsChunkStartsAt !== null && (
    str[i] && str[i].trim().length &&
    !/\d/.test(str[i]) &&
    !["."].includes(str[i]) ||
    !str[i])) {
      return {
        start: opts.offset + digitsChunkStartsAt,
        end: opts.offset + lastDigitAt + 1,
        value: str.slice(digitsChunkStartsAt, lastDigitAt + 1)
      };
    }
    if (/^\d*$/.test(str[i])) {
      lastDigitAt = i;
      if (
      digitsChunkStartsAt === null) {
        digitsChunkStartsAt = i;
      }
    }
    if (
    digitsChunkStartsAt === null &&
    str[i] && str[i].trim().length &&
    !/[\d.'"`]/.test(str[i])) {
      return;
    }
  }
}

var getNewValue = function getNewValue(subTestCount, testOrderNumber, counter2) {
  return subTestCount === "single" ? testOrderNumber : "".concat(testOrderNumber, ".").concat("".concat(counter2).padStart(2, "0"));
};

var messageIsSecondArg = new Set(["ok", "notOk", "true", "false", "assert", "assertNot", "error", "ifErr", "ifError", "rejects",
"resolves", "resolveMatchSnapshot", "throws",
"throw",
"doesNotThrow", "notThrow", "expectUncaughtException"
]);
var messageIsThirdArg = new Set(["emits", "rejects",
"resolveMatch", "throws",
"throw",
"expectUncaughtException",
"equal", "equals", "isEqual", "is", "strictEqual", "strictEquals", "strictIs", "isStrict", "isStrictly", "notEqual", "inequal", "notEqual", "notEquals", "notStrictEqual", "notStrictEquals", "isNotEqual", "isNot", "doesNotEqual", "isInequal", "same", "equivalent", "looseEqual", "looseEquals", "deepEqual", "deepEquals", "isLoose", "looseIs", "notSame", "inequivalent", "looseInequal", "notDeep", "deepInequal", "notLoose", "looseNot", "strictSame", "strictEquivalent", "strictDeepEqual", "sameStrict", "deepIs", "isDeeply", "isDeep", "strictDeepEquals", "strictNotSame", "strictInequivalent", "strictDeepInequal", "notSameStrict", "deepNot", "notDeeply", "strictDeepInequals", "notStrictSame", "hasStrict", "match", "has", "hasFields", "matches", "similar", "like", "isLike", "includes", "include", "contains", "notMatch", "dissimilar", "unsimilar", "notSimilar", "unlike", "isUnlike", "notLike", "isNotLike", "doesNotHave", "isNotSimilar", "isDissimilar", "type", "isa", "isA"]);
var create = function create(context) {
  var counter = 0;
  return {
    ExpressionStatement: function ExpressionStatement(node) {
      if (op__default['default'].get(node, "expression.type") === "CallExpression" && ["test", "only", "skip", "todo"].includes(op__default['default'].get(node, "expression.callee.property.name")) && ["TemplateLiteral", "Literal"].includes(op__default['default'].get(node, "expression.arguments.0.type"))) {
        counter += 1;
        var testOrderNumber = "".concat(counter).padStart(2, "0");
        var finalDigitChunk;
        if (!finalDigitChunk && op__default['default'].get(node, "expression.arguments.0.type") === "TemplateLiteral" && op__default['default'].has(node, "expression.arguments.0.quasis.0.value.raw")) {
          var _ref = prep(op__default['default'].get(node, "expression.arguments.0.quasis.0.value.raw"), {
            offset: op__default['default'].get(node, "expression.arguments.0.quasis.0.start"),
            returnRangesOnly: true
          }) || {},
              start = _ref.start,
              end = _ref.end,
              value = _ref.value;
          if (start && end && value && value !== testOrderNumber) {
            finalDigitChunk = {
              start: start,
              end: end,
              value: testOrderNumber,
              node: op__default['default'].get(node, "expression.arguments.0.quasis.0")
            };
          }
        }
        if (!finalDigitChunk && node.expression.arguments[0].type === "Literal" && node.expression.arguments[0].raw) {
          var _ref2 = prep(node.expression.arguments[0].raw, {
            offset: node.expression.arguments[0].start,
            returnRangesOnly: true
          }) || {},
              _start = _ref2.start,
              _end = _ref2.end,
              _value = _ref2.value;
          if (_start && _end && _value && _value !== testOrderNumber) {
            finalDigitChunk = {
              start: _start,
              end: _end,
              value: testOrderNumber,
              node: node.expression.arguments[0]
            };
          }
        }
        if (!finalDigitChunk && op__default['default'].get(node, "expression.arguments.1.type") === "ArrowFunctionExpression" && op__default['default'].get(node, "expression.arguments.1.body.type") === "BlockStatement" && op__default['default'].get(node, "expression.arguments.1.body.body").length) {
          var subTestCount = "multiple";
          var filteredExpressionStatements = {};
          if ((filteredExpressionStatements = op__default['default'].get(node, "expression.arguments.1.body.body").filter(function (nodeObj) {
            return nodeObj.type === "ExpressionStatement" && op__default['default'].get(nodeObj, "expression.callee.object.name") === "t";
          })).length === 2 &&
          op__default['default'].get(filteredExpressionStatements[filteredExpressionStatements.length - 1], "expression.callee.property.name") === "end") {
            subTestCount = "single";
          }
          var exprStatements = op__default['default'].get(node, "expression.arguments.1.body.body");
          /* istanbul ignore else */
          if (Array.isArray(exprStatements)) {
            var counter2 = 0;
            for (var i = 0, len = exprStatements.length; i < len; i++) {
              var assertsName = op__default['default'].get(exprStatements[i], "expression.callee.property.name");
              if (!assertsName) {
                continue;
              }
              var messageArgsPositionWeWillAimFor = void 0;
              if (
              messageIsThirdArg.has(assertsName) &&
              op__default['default'].has(exprStatements[i], "expression.arguments.2")) {
                messageArgsPositionWeWillAimFor = 2;
              } else if (
              messageIsSecondArg.has(assertsName) &&
              op__default['default'].has(exprStatements[i], "expression.arguments.1")) {
                messageArgsPositionWeWillAimFor = 1;
              }
              if (messageArgsPositionWeWillAimFor) {
                var _ret = function () {
                  var pathToMsgArgValue = void 0;
                  var rawPathToMsgArgValue = void 0;
                  var pathToMsgArgStart = void 0;
                  /* istanbul ignore else */
                  if (op__default['default'].get(exprStatements[i], "expression.arguments.".concat(messageArgsPositionWeWillAimFor, ".type")) === "TemplateLiteral") {
                    rawPathToMsgArgValue = "expression.arguments.".concat(messageArgsPositionWeWillAimFor, ".quasis.0");
                    pathToMsgArgValue = op__default['default'].get(exprStatements[i], "".concat(rawPathToMsgArgValue, ".value.raw"));
                    pathToMsgArgStart = op__default['default'].get(exprStatements[i], "".concat(rawPathToMsgArgValue, ".start"));
                    counter2 += 1;
                  } else if (op__default['default'].get(exprStatements[i], "expression.arguments.".concat(messageArgsPositionWeWillAimFor, ".type")) === "Literal") {
                    rawPathToMsgArgValue = "expression.arguments.".concat(messageArgsPositionWeWillAimFor);
                    pathToMsgArgValue = op__default['default'].get(exprStatements[i], "".concat(rawPathToMsgArgValue, ".raw"));
                    pathToMsgArgStart = op__default['default'].get(exprStatements[i], "".concat(rawPathToMsgArgValue, ".start"));
                    counter2 += 1;
                  }
                  var _ref3 = prep(pathToMsgArgValue, {
                    offset: pathToMsgArgStart,
                    returnRangesOnly: true
                  }) || {},
                      start = _ref3.start,
                      end = _ref3.end;
                  if (!start || !end) {
                    return "continue";
                  }
                  var newValue = getNewValue(subTestCount, testOrderNumber, counter2);
                  if (prep(pathToMsgArgValue).value !== newValue) {
                    context.report({
                      node: op__default['default'].get(exprStatements[i], rawPathToMsgArgValue),
                      messageId: "correctTestNum",
                      fix: function fix(fixerObj) {
                        return fixerObj.replaceTextRange([start, end], newValue);
                      }
                    });
                  }
                }();
                if (_ret === "continue") continue;
              } else {
                var positionDecided = void 0;
                if (
                messageIsThirdArg.has(assertsName) &&
                Array.isArray(op__default['default'].get(exprStatements[i], "expression.arguments")) && op__default['default'].get(exprStatements[i], "expression.arguments").length === 2) {
                  positionDecided = 2;
                } else if (messageIsSecondArg.has(assertsName) && Array.isArray(op__default['default'].get(exprStatements[i], "expression.arguments")) && op__default['default'].get(exprStatements[i], "expression.arguments").length === 1) {
                  positionDecided = 1;
                }
                if (positionDecided) {
                  (function () {
                    var positionToInsertAt = op__default['default'].get(exprStatements[i], "expression.end") - 1;
                    var newValue = getNewValue(subTestCount, testOrderNumber, counter2);
                    var wholeSourceStr = context.getSourceCode().getText();
                    var endIdx = positionToInsertAt;
                    var startIdx = stringLeftRight.left(wholeSourceStr, endIdx) + 1;
                    var valueToInsert = ", \"".concat(newValue, "\"");
                    if (
                    wholeSourceStr.slice(startIdx, endIdx).includes("\n")) {
                      var frontalIndentation = Array.from(wholeSourceStr.slice(startIdx, endIdx)).filter(function (char) {
                        return !"\r\n".includes(char);
                      }).join("");
                      valueToInsert = ",\n".concat(frontalIndentation, "  \"").concat(newValue, "\"\n").concat(frontalIndentation);
                    }
                    context.report({
                      node: exprStatements[i],
                      messageId: "correctTestNum",
                      fix: function fix(fixerObj) {
                        return fixerObj.replaceTextRange([startIdx, endIdx], valueToInsert);
                      }
                    });
                  })();
                }
              }
            }
          }
        }
        if (finalDigitChunk) {
          /* istanbul ignore next */
          context.report({
            messageId: "correctTestNum",
            node: finalDigitChunk.node || node,
            fix: function fix(fixerObj) {
              return fixerObj.replaceTextRange([finalDigitChunk.start, finalDigitChunk.end], finalDigitChunk.value);
            }
          });
        }
      }
    }
  };
};
var correctTestNum = {
  create: create,
  meta: {
    type: "suggestion",
    messages: {
      correctTestNum: "Update the test number."
    },
    fixable: "code"
  }
};

var main = {
  configs: {
    recommended: {
      plugins: ["test-num"],
      rules: {
        "no-console": "off",
        "test-num/correct-test-num": "error"
      }
    }
  },
  rules: {
    "correct-test-num": correctTestNum
  }
};

module.exports = main;
