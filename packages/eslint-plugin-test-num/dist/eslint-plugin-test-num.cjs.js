/**
 * eslint-plugin-test-num
 * ESLint plugin to update unit test numbers automatically
 * Version: 1.5.5
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/eslint-plugin-test-num/
 */

'use strict';

var op = require('object-path');
var stringLeftRight = require('string-left-right');
var _objectSpread = require('@babel/runtime/helpers/objectSpread2');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var op__default = /*#__PURE__*/_interopDefaultLegacy(op);
var _objectSpread__default = /*#__PURE__*/_interopDefaultLegacy(_objectSpread);

function prep(str, originalOpts) {
  /* istanbul ignore if */

  if (typeof str !== "string" || !str.length) {
    return {};
  }

  var defaults = {
    offset: 0
  };

  var opts = _objectSpread__default['default'](_objectSpread__default['default']({}, defaults), originalOpts); // So it's a non-empty string. Traverse!

  var digitsChunkStartsAt = null;
  var lastDigitAt = null;

  for (var i = 0, len = str.length; i <= len; i++) { // catch the end of the digit chunk
    // -------------------------------------------------------------------------

    if ( // if chunk has been recorded as already started
    digitsChunkStartsAt !== null && typeof lastDigitAt === "number" && ( // and
    // a) it's not a whitespace
    str[i] && str[i].trim().length && // it's not a number
    !/\d/.test(str[i]) && // and it's not a dot or hyphen
    !["."].includes(str[i]) || // OR
    // b) we reached the end (we traverse up to and including str.length,
    // which is "undefined" character; notice i <= len in the loop above,
    // normally it would be i < len)
    !str[i])) {
      return {
        start: opts.offset + digitsChunkStartsAt,
        end: opts.offset + lastDigitAt + 1,
        value: str.slice(digitsChunkStartsAt, lastDigitAt + 1)
      };
    } // catch digits
    // -------------------------------------------------------------------------


    if (/^\d*$/.test(str[i])) {
      // 1. note that
      lastDigitAt = i; // 2. catch the start of the first digit

      if ( // if chunk hasn't been recorded yet
      digitsChunkStartsAt === null) {
        digitsChunkStartsAt = i;
      }
    } // catch false scenario cases where letters precede numbers
    // -------------------------------------------------------------------------


    if ( // chunk hasn't been detected yet:
    digitsChunkStartsAt === null && // it's not whitespace:
    str[i] && str[i].trim() && // it's not dot or digit or some kind of quote:
    !/[\d.'"`]/.test(str[i])) {
      return {};
    } // logging
    // -------------------------------------------------------------------------
  }

  return {};
}

var getNewValue = function getNewValue(subTestCount, testOrderNumber, counter2) {
  return subTestCount === "single" ? testOrderNumber : testOrderNumber + "." + ("" + counter2).padStart(2, "0");
};

// import stringify from "json-stringify-safe";

var messageIsSecondArg = new Set(["ok", "notOk", "true", "false", "assert", "assertNot", "error", "ifErr", "ifError", "rejects", "resolves", "resolveMatchSnapshot", "throws", "throw", "doesNotThrow", "notThrow", "expectUncaughtException" // "expectUncaughtException" message can be 2nd or 3rd arg!!!
]); // compiled from https://node-tap.org/docs/api/asserts/

var messageIsThirdArg = new Set(["emits", "rejects", "resolveMatch", "throws", "throw", "expectUncaughtException", "equal", "equals", "isEqual", "is", "strictEqual", "strictEquals", "strictIs", "isStrict", "isStrictly", "notEqual", "inequal", "notEqual", "notEquals", "notStrictEqual", "notStrictEquals", "isNotEqual", "isNot", "doesNotEqual", "isInequal", "same", "equivalent", "looseEqual", "looseEquals", "deepEqual", "deepEquals", "isLoose", "looseIs", "notSame", "inequivalent", "looseInequal", "notDeep", "deepInequal", "notLoose", "looseNot", "strictSame", "strictEquivalent", "strictDeepEqual", "sameStrict", "deepIs", "isDeeply", "isDeep", "strictDeepEquals", "strictNotSame", "strictInequivalent", "strictDeepInequal", "notSameStrict", "deepNot", "notDeeply", "strictDeepInequals", "notStrictSame", "hasStrict", "match", "has", "hasFields", "matches", "similar", "like", "isLike", "includes", "include", "contains", "notMatch", "dissimilar", "unsimilar", "notSimilar", "unlike", "isUnlike", "notLike", "isNotLike", "doesNotHave", "isNotSimilar", "isDissimilar", "type", "isa", "isA"]);

var create = function create(context) {
  var counter = 0;
  return {
    ExpressionStatement: function ExpressionStatement(node) {
      if (op__default['default'].get(node, "expression.type") === "CallExpression" && ["test", "only", "skip", "todo"].includes(op__default['default'].get(node, "expression.callee.property.name")) && ["TemplateLiteral", "Literal"].includes(op__default['default'].get(node, "expression.arguments.0.type"))) {
        counter += 1;
        var testOrderNumber = ("" + counter).padStart(2, "0"); // TACKLE THE FIRST ARG
        // ████████████████████
        // for example, the "09" in:
        // t.test("09 - something", (t) => ...)
        // it will be under "TemplateLiteral" node if backticks were used,
        // for example:
        // t.test(`09 - something`, (t) => ...) or "Literal" if quotes were used,
        // for example:
        // t.test("09 - something", (t) => ...)

        var finalDigitChunk = {}; // if backticks, like:
        // tap.test(`99`, (t) => {
        //          ^  ^

        if (!finalDigitChunk.value && op__default['default'].get(node, "expression.arguments.0.type") === "TemplateLiteral" && op__default['default'].has(node, "expression.arguments.0.quasis.0.value.raw")) { // default esprima parser

          var offset1 = op__default['default'].get(node, "expression.arguments.0.quasis.0.start"); // customised to @typescript-eslint/parser

          var offset2 = op__default['default'].get(node, "expression.arguments.0.range.0") + 1;
          var source = op__default['default'].get(node, "expression.arguments.0.quasis.0.value.raw");
          prep(source, {
            offset: offset1 || offset2,
            returnRangesOnly: true
          });

          var _ref = prep(source, {
            offset: offset1 || offset2,
            returnRangesOnly: true
          }) || {},
              start = _ref.start,
              end = _ref.end,
              value = _ref.value;

          if (typeof start === "number" && typeof end === "number" && value && value !== testOrderNumber) {
            finalDigitChunk = {
              start: start,
              end: end,
              value: testOrderNumber,
              node: op__default['default'].get(node, "expression.arguments.0.quasis.0")
            }; // console.log(
            //   `259 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`finalDigitChunk.node.loc`}\u001b[${39}m`} = ${stringify(
            //     finalDigitChunk.node.loc,
            //     null,
            //     4
            //   )}`
            // );
          }
        } // if single or double quotes, like:
        // tap.test("99", (t) => {
        //          ^  ^


        if (!finalDigitChunk.value && node.expression.arguments[0].type === "Literal" && node.expression.arguments[0].raw) { // default esprima parser

          var _offset = op__default['default'].get(node, "expression.arguments.0.start"); // customised to @typescript-eslint/parser


          var _offset2 = op__default['default'].get(node, "expression.arguments.0.range.0");

          var _ref2 = prep(node.expression.arguments[0].raw, {
            offset: _offset || _offset2,
            returnRangesOnly: true
          }) || {},
              _start = _ref2.start,
              _end = _ref2.end,
              _value = _ref2.value;

          if (typeof _start === "number" && typeof _end === "number" && _value && _value !== testOrderNumber) {
            finalDigitChunk = {
              start: _start,
              end: _end,
              value: testOrderNumber,
              node: node.expression.arguments[0]
            }; // console.log(
            //   `317 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`finalDigitChunk`}\u001b[${39}m`} = ${stringify(
            //     finalDigitChunk,
            //     null,
            //     4
            //   )}`
            // );
          }
        } // TACKLE THE THIRD ARG
        // ████████████████████
        // for example, the "09" in:
        // t.test(
        //   "some name",
        //   (t) => {
        //     t.same(fix("z &angst; y"), [], "09");
        //     t.end();
        //   }
        // );


        if (!finalDigitChunk.value && op__default['default'].get(node, "expression.arguments.1.type") === "ArrowFunctionExpression" && op__default['default'].get(node, "expression.arguments.1.body.type") === "BlockStatement" && op__default['default'].get(node, "expression.arguments.1.body.body").length) { // let's find out, is it a single test clause or there are multiple

          var subTestCount = "multiple";
          var filteredExpressionStatements = [];

          if ((filteredExpressionStatements = op__default['default'].get(node, "expression.arguments.1.body.body").filter(function (nodeObj) {
            return nodeObj.type === "ExpressionStatement" && op__default['default'].get(nodeObj, "expression.callee.object.name") === "t";
          })).length === 2 && // ensure last expression is t.end:
          op__default['default'].get(filteredExpressionStatements[filteredExpressionStatements.length - 1], "expression.callee.property.name") === "end") {
            subTestCount = "single";
          } // console.log(
          //   `374 ${`\u001b[${33}m${`subTestCount`}\u001b[${39}m`} = ${stringify(
          //     subTestCount,
          //     null,
          //     4
          //   )}`
          // );


          var exprStatements = op__default['default'].get(node, "expression.arguments.1.body.body");
          /* istanbul ignore else */

          if (Array.isArray(exprStatements)) {
            // loop through expression statements, t.* calls inside the (t) => {...}
            // this counter is to count expression statements and whatnot
            // within the "expression.arguments.1.body.body" path (array).
            //
            // For example, within:
            // tap.test(`01 - a`, (t) => {
            //
            // one might have many bits:
            // 1. const k = ...
            // 2. t.match(... <----- true index - #1
            // 3. const l = ...
            // 4. t.match(... <----- true index - #2
            // 5. const m = ...
            // 6. t.match(... <----- true index - #3
            //
            // but this index system above is wrong, we count only assertions -
            // only *.only, *.test and *.skip
            //
            // this counter below will be that index counter
            //
            var counter2 = 0;

            for (var i = 0, len = exprStatements.length; i < len; i++) {
              var assertsName = op__default['default'].get(exprStatements[i], "expression.callee.property.name");

              if (!assertsName) {
                continue;
              } // "message" argument's position is variable, sometimes it can be
              // either 2nd or 3rd

              var messageArgsPositionWeWillAimFor = void 0;

              if ( // assertion's name is known to contain "message" as third arg
              messageIsThirdArg.has(assertsName) && // and there is an argument present at that position
              op__default['default'].has(exprStatements[i], "expression.arguments.2")) {
                messageArgsPositionWeWillAimFor = 2; // zero-based count
              } else if ( // assertion's name is known to contain "message" as second arg
              messageIsSecondArg.has(assertsName) && // and there is an argument present at that position
              op__default['default'].has(exprStatements[i], "expression.arguments.1")) {
                messageArgsPositionWeWillAimFor = 1; // zero-based count
              } // console.log(
              //   `456 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`messageArgsPositionWeWillAimFor`}\u001b[${39}m`} = ${stringify(
              //     messageArgsPositionWeWillAimFor,
              //     null,
              //     4
              //   )}`
              // );


              if (messageArgsPositionWeWillAimFor) {
                var _ret = function () { // the "message" can be Literal (single/double quotes) or
                  // TemplateLiteral (backticks)

                  var pathToMsgArgValue = void 0;
                  var rawPathToMsgArgValue = ""; // used later in eslint reporting

                  var pathToMsgArgStart = void 0;
                  /* istanbul ignore else */

                  if (op__default['default'].get(exprStatements[i], "expression.arguments." + messageArgsPositionWeWillAimFor + ".type") === "TemplateLiteral") {
                    rawPathToMsgArgValue = "expression.arguments." + messageArgsPositionWeWillAimFor + ".quasis.0";
                    pathToMsgArgValue = op__default['default'].get(exprStatements[i], rawPathToMsgArgValue + ".value.raw");
                    pathToMsgArgStart = op__default['default'].get(exprStatements[i], rawPathToMsgArgValue + ".start");
                    counter2 += 1;
                  } else if (op__default['default'].get(exprStatements[i], "expression.arguments." + messageArgsPositionWeWillAimFor + ".type") === "Literal") {
                    rawPathToMsgArgValue = "expression.arguments." + messageArgsPositionWeWillAimFor;
                    pathToMsgArgValue = op__default['default'].get(exprStatements[i], rawPathToMsgArgValue + ".raw"); // console.log(
                    //   `523 ███████████████████████████████████████ ${`\u001b[${33}m${`exprStatements[i]`}\u001b[${39}m`} = ${stringify(
                    //     exprStatements[i],
                    //     null,
                    //     4
                    //   )}`
                    // );

                    pathToMsgArgStart = // default parser, esprima
                    op__default['default'].get(exprStatements[i], rawPathToMsgArgValue + ".start") || // TS parser, @typescript-eslint/parser
                    op__default['default'].get(exprStatements[i], rawPathToMsgArgValue + ".range.0");
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
                  var newValue = getNewValue(subTestCount, testOrderNumber, counter2); // console.log(
                  //   `584 newValue: ${`\u001b[${35}m${newValue}\u001b[${39}m`};\nrange: ${`\u001b[${35}m${`[${start}, ${end}]`}\u001b[${39}m`};\nrawPathToMsgArgValue: ${`\u001b[${35}m${rawPathToMsgArgValue}\u001b[${39}m`};\nprep(pathToMsgArgValue): ${`\u001b[${35}m${stringify(
                  //     prep(pathToMsgArgValue)
                  //   )}\u001b[${39}m`};\nstringify(prep(pathToMsgArgValue).value): ${`\u001b[${35}m${stringify(
                  //     prep(pathToMsgArgValue).value
                  //   )}\u001b[${39}m`};`
                  // );

                  if (rawPathToMsgArgValue && prep(pathToMsgArgValue).value !== newValue) {
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
              } else { // First, find out at which index position should message
                // argument be on this given assertion. Keep in mind, there
                // can be wrong args present at desired argument position or not
                // enough arguments to reach that argument position
                // console.log(
                //   `617 FIY, ${`\u001b[${33}m${`exprStatements[i]`}\u001b[${39}m`} = ${stringify(
                //     exprStatements[i],
                //     null,
                //     4
                //   )}; messageIsThirdArg.has(${assertsName}) = ${messageIsThirdArg.has(
                //     assertsName
                //   )}`
                // );

                var positionDecided = void 0;

                if ( // if assert's API takes three input arguments, the last arg
                // being the message's value
                messageIsThirdArg.has(assertsName) && // there are two arguments currently present in this assert
                Array.isArray(op__default['default'].get(exprStatements[i], "expression.arguments")) && op__default['default'].get(exprStatements[i], "expression.arguments").length === 2) {
                  positionDecided = 2; // counting from zero, means 3rd in a row
                } else if (messageIsSecondArg.has(assertsName) && Array.isArray(op__default['default'].get(exprStatements[i], "expression.arguments")) && op__default['default'].get(exprStatements[i], "expression.arguments").length === 1) {
                  positionDecided = 1; // counting from zero, means 2nd in a row
                }

                if (positionDecided) {
                  (function () { // insert the value

                    var positionToInsertAt = // default parser, esprima
                    (op__default['default'].get(exprStatements[i], "expression.end") || // custom parser for TS, @typescript-eslint/parser
                    op__default['default'].get(exprStatements[i], "expression.range.1")) - 1;
                    var newValue = getNewValue(subTestCount, testOrderNumber, counter2); // there might be whitespace, so comma we're about to add
                    // must sit on a different line!!!

                    var wholeSourceStr = context.getSourceCode().getText();
                    var endIdx = positionToInsertAt; // left() finds the index of the first non-whitespace on the
                    // left, then we add +1 to not include it

                    var startIdx = (stringLeftRight.left(wholeSourceStr, endIdx) || 0) + 1;
                    var valueToInsert = ", \"" + newValue + "\"";

                    if ( // if there's a linebreak between closing bracket inside
                    // the assetion and the last expression statement
                    // imagine:
                    // t.match(
                    //   resIn,
                    //   {
                    //     fixed: true,
                    //     output: read("out"),
                    //   },
                    //   "01.01" <----- we're about to add this line and that comma
                    // );
                    wholeSourceStr.slice(startIdx, endIdx).includes("\n")) {
                      var frontalIndentation = Array.from(wholeSourceStr.slice(startIdx, endIdx)).filter(function (char) {
                        return !"\r\n".includes(char);
                      }).join("");
                      valueToInsert = ",\n" + frontalIndentation + "  \"" + newValue + "\"\n" + frontalIndentation;
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

        if (finalDigitChunk.value) {
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
    // docs: {
    //   url: getDocumentationUrl(__filename),
    // },
    type: "suggestion",
    messages: {
      correctTestNum: "Update the test number."
    },
    fixable: "code" // or "code" or "whitespace"

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
