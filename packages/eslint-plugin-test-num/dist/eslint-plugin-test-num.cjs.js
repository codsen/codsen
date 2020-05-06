/**
 * eslint-plugin-test-num
 * ESLint plugin to update unit test numbers automatically
 * Version: 1.1.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/eslint-plugin-test-num
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var op = _interopDefault(require('object-path'));

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
      if (op.get(node, "expression.type") === "CallExpression" && ["test", "only"].includes(op.get(node, "expression.callee.property.name")) && ["TemplateLiteral", "Literal"].includes(op.get(node, "expression.arguments.0.type"))) {
        counter += 1;
        var testOrderNumber = "".concat(counter).padStart(2, "0");
        var finalDigitChunk;
        if (!finalDigitChunk && op.get(node, "expression.arguments.0.type") === "TemplateLiteral" && op.has(node, "expression.arguments.0.quasis.0.value.raw")) {
          var _ref = prep(op.get(node, "expression.arguments.0.quasis.0.value.raw"), {
            offset: op.get(node, "expression.arguments.0.quasis.0.start"),
            returnRangesOnly: true
          }) || {},
              start = _ref.start,
              end = _ref.end,
              value = _ref.value;
          if (start && end && value && value !== testOrderNumber) {
            finalDigitChunk = {
              start: start,
              end: end,
              value: testOrderNumber
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
              value: testOrderNumber
            };
          }
        }
        if (!finalDigitChunk && op.get(node, "expression.arguments.1.type") === "ArrowFunctionExpression" && op.get(node, "expression.arguments.1.body.type") === "BlockStatement" && op.get(node, "expression.arguments.1.body.body").length) {
          var subTestCount = "multiple";
          if (op.get(node, "expression.arguments.1.body.body").length === 2 && op.get(node, "expression.arguments.1.body.body.1.type") === "ExpressionStatement" && op.get(node, "expression.arguments.1.body.body.1.expression.callee.property.name") === "end") {
            subTestCount = "single";
          }
          var exprStatements = op.get(node, "expression.arguments.1.body.body");
          /* istanbul ignore else */
          if (Array.isArray(exprStatements)) {
            for (var i = 0, len = exprStatements.length; i < len; i++) {
              var assertsName = op.get(exprStatements[i], "expression.callee.property.name");
              if (!assertsName) {
                continue;
              }
              var messageArgsPositionWeWillAimFor = void 0;
              if (
              messageIsThirdArg.has(assertsName) &&
              op.has(exprStatements[i], "expression.arguments.2")) {
                messageArgsPositionWeWillAimFor = 2;
              } else if (
              messageIsSecondArg.has(assertsName) &&
              op.has(exprStatements[i], "expression.arguments.1")) {
                messageArgsPositionWeWillAimFor = 1;
              }
              if (messageArgsPositionWeWillAimFor) {
                var _ret = function () {
                  var pathToMsgArgValue = void 0;
                  var pathToMsgArgStart = void 0;
                  /* istanbul ignore else */
                  if (op.get(exprStatements[i], "expression.arguments.".concat(messageArgsPositionWeWillAimFor, ".type")) === "TemplateLiteral") {
                    pathToMsgArgValue = op.get(exprStatements[i], "expression.arguments.".concat(messageArgsPositionWeWillAimFor, ".quasis.0.value.raw"));
                    pathToMsgArgStart = op.get(exprStatements[i], "expression.arguments.".concat(messageArgsPositionWeWillAimFor, ".quasis.0.start"));
                  } else if (op.get(exprStatements[i], "expression.arguments.".concat(messageArgsPositionWeWillAimFor, ".type")) === "Literal") {
                    pathToMsgArgValue = op.get(exprStatements[i], "expression.arguments.".concat(messageArgsPositionWeWillAimFor, ".raw"));
                    pathToMsgArgStart = op.get(exprStatements[i], "expression.arguments.".concat(messageArgsPositionWeWillAimFor, ".start"));
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
                  var newValue = subTestCount === "single" ? testOrderNumber : "".concat(testOrderNumber, ".").concat("".concat(i + 1).padStart(2, "0"));
                  if (pathToMsgArgValue !== newValue) {
                    context.report({
                      node: node,
                      messageId: "correctTestNum",
                      fix: function fix(fixerObj) {
                        return fixerObj.replaceTextRange([start, end], newValue);
                      }
                    });
                  }
                }();
                if (_ret === "continue") continue;
              }
            }
          }
        }
        if (finalDigitChunk) {
          context.report({
            node: node,
            messageId: "correctTestNum",
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
