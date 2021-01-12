/**
 * eslint-plugin-test-num
 * ESLint plugin to update unit test numbers automatically
 * Version: 1.4.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/eslint-plugin-test-num/
 */

import op from 'object-path';
import { left } from 'string-left-right';

function prep(str, originalOpts) {
  // console.log(
  //   `003 prep(): ${`\u001b[${32}m${`RECEIVED`}\u001b[${39}m`} >>>${str}<<<`
  // );

  /* istanbul ignore if */
  if (typeof str !== "string" || !str.length) {
    return {};
  }

  const defaults = {
    offset: 0
  };
  const opts = { ...defaults,
    ...originalOpts
  }; // console.log(
  //   `015 prep(): final ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
  //     opts,
  //     null,
  //     4
  //   )}`
  // );
  // So it's a non-empty string. Traverse!

  let digitsChunkStartsAt = null;
  let lastDigitAt; // console.log(
  //   `028 prep(): ${`\u001b[${36}m${`traverse starts`}\u001b[${39}m`}`
  // );

  for (let i = 0, len = str.length; i <= len; i++) {
    // console.log(
    //   `032 prep(): ${`\u001b[${36}m${`======================== str[${i}]= ${`\u001b[${35}m${
    //     str[i] && str[i].trim().length
    //       ? str[i]
    //       : JSON.stringify(str[i], null, 4)
    //   }\u001b[${39}m`} ========================`}\u001b[${39}m`}`
    // );
    // catch the end of the digit chunk
    // -------------------------------------------------------------------------
    if ( // if chunk has been recorded as already started
    digitsChunkStartsAt !== null && lastDigitAt && ( // and
    // a) it's not a whitespace
    str[i] && str[i].trim().length && // it's not a number
    !/\d/.test(str[i]) && // and it's not a dot or hyphen
    !["."].includes(str[i]) || // OR
    // b) we reached the end (we traverse up to and including str.length,
    // which is "undefined" character; notice i <= len in the loop above,
    // normally it would be i < len)
    !str[i])) {
      // console.log(
      //   `059 prep(): ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`}: "${JSON.stringify(
      //     {
      //       start: opts.offset + digitsChunkStartsAt,
      //       end: opts.offset + lastDigitAt + 1,
      //       value: str.slice(digitsChunkStartsAt, lastDigitAt + 1),
      //     },
      //     null,
      //     4
      //   )}"`
      // );
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
        digitsChunkStartsAt = i; // console.log(
        //   `089 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`digitsChunkStartsAt`}\u001b[${39}m`} = ${JSON.stringify(
        //     digitsChunkStartsAt,
        //     null,
        //     4
        //   )}`
        // );
      }
    } // catch false scenario cases where letters precede numbers
    // -------------------------------------------------------------------------


    if ( // chunk hasn't been detected yet:
    digitsChunkStartsAt === null && // it's not whitespace:
    str[i] && str[i].trim() && // it's not dot or digit or some kind of quote:
    !/[\d.'"`]/.test(str[i])) {
      // console.log(`109 ${`\u001b[${31}m${`early bail`}\u001b[${39}m`}`);
      return {};
    } // logging
    // -------------------------------------------------------------------------
    // console.log(" ");
    // console.log(
    //   `${`\u001b[${90}m${`██ digitsChunkStartsAt = ${digitsChunkStartsAt}`}\u001b[${39}m`}`
    // );
    // console.log(
    //   `${`\u001b[${90}m${`██ lastDigitAt = ${lastDigitAt}`}\u001b[${39}m`}`
    // );
    // console.log(`${`\u001b[${90}m${`----------------`}\u001b[${39}m`}`);

  }

  return {};
}

const getNewValue = (subTestCount, testOrderNumber, counter2) => subTestCount === "single" ? testOrderNumber : `${testOrderNumber}.${`${counter2}`.padStart(2, "0")}`;

// import stringify from "json-stringify-safe";
// compiled from https://node-tap.org/docs/api/asserts/

const messageIsSecondArg = new Set(["ok", "notOk", "true", "false", "assert", "assertNot", "error", "ifErr", "ifError", "rejects", "resolves", "resolveMatchSnapshot", "throws", "throw", "doesNotThrow", "notThrow", "expectUncaughtException"]); // compiled from https://node-tap.org/docs/api/asserts/

const messageIsThirdArg = new Set(["emits", "rejects", "resolveMatch", "throws", "throw", "expectUncaughtException", "equal", "equals", "isEqual", "is", "strictEqual", "strictEquals", "strictIs", "isStrict", "isStrictly", "notEqual", "inequal", "notEqual", "notEquals", "notStrictEqual", "notStrictEquals", "isNotEqual", "isNot", "doesNotEqual", "isInequal", "same", "equivalent", "looseEqual", "looseEquals", "deepEqual", "deepEquals", "isLoose", "looseIs", "notSame", "inequivalent", "looseInequal", "notDeep", "deepInequal", "notLoose", "looseNot", "strictSame", "strictEquivalent", "strictDeepEqual", "sameStrict", "deepIs", "isDeeply", "isDeep", "strictDeepEquals", "strictNotSame", "strictInequivalent", "strictDeepInequal", "notSameStrict", "deepNot", "notDeeply", "strictDeepInequals", "notStrictSame", "hasStrict", "match", "has", "hasFields", "matches", "similar", "like", "isLike", "includes", "include", "contains", "notMatch", "dissimilar", "unsimilar", "notSimilar", "unlike", "isUnlike", "notLike", "isNotLike", "doesNotHave", "isNotSimilar", "isDissimilar", "type", "isa", "isA"]);

const create = context => {
  let counter = 0;
  return {
    ExpressionStatement(node) {
      if (op.get(node, "expression.type") === "CallExpression" && ["test", "only", "skip", "todo"].includes(op.get(node, "expression.callee.property.name")) && ["TemplateLiteral", "Literal"].includes(op.get(node, "expression.arguments.0.type"))) {
        counter += 1;
        const testOrderNumber = `${counter}`.padStart(2, "0"); // TACKLE THE FIRST ARG
        // ████████████████████
        // for example, the "09" in:
        // t.test("09 - something", (t) => ...)
        // it will be under "TemplateLiteral" node if backticks were used,
        // for example:
        // t.test(`09 - something`, (t) => ...) or "Literal" if quotes were used,
        // for example:
        // t.test("09 - something", (t) => ...)

        let finalDigitChunk = {};

        if (!finalDigitChunk.value && op.get(node, "expression.arguments.0.type") === "TemplateLiteral" && op.has(node, "expression.arguments.0.quasis.0.value.raw")) {
          const {
            start,
            end,
            value
          } = prep(op.get(node, "expression.arguments.0.quasis.0.value.raw"), {
            offset: op.get(node, "expression.arguments.0.quasis.0.start"),
            returnRangesOnly: true
          }) || {};

          if (start && end && value && value !== testOrderNumber) {
            finalDigitChunk = {
              start,
              end,
              value: testOrderNumber,
              node: op.get(node, "expression.arguments.0.quasis.0")
            }; // console.log(
            //   `206 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`finalDigitChunk.node.loc`}\u001b[${39}m`} = ${stringify(
            //     finalDigitChunk.node.loc,
            //     null,
            //     4
            //   )}`
            // );
          }
        }

        if (!finalDigitChunk.value && node.expression.arguments[0].type === "Literal" && node.expression.arguments[0].raw) {
          const {
            start,
            end,
            value
          } = prep(node.expression.arguments[0].raw, {
            offset: node.expression.arguments[0].start,
            returnRangesOnly: true
          }) || {};

          if (start && end && value && value !== testOrderNumber) {
            finalDigitChunk = {
              start,
              end,
              value: testOrderNumber,
              node: node.expression.arguments[0]
            }; // console.log(
            //   `240 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`finalDigitChunk.node.loc`}\u001b[${39}m`} = ${stringify(
            //     finalDigitChunk.node.loc,
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


        if (!finalDigitChunk.value && op.get(node, "expression.arguments.1.type") === "ArrowFunctionExpression" && op.get(node, "expression.arguments.1.body.type") === "BlockStatement" && op.get(node, "expression.arguments.1.body.body").length) { // let's find out, is it a single test clause or there are multiple

          let subTestCount = "multiple";
          let filteredExpressionStatements = [];

          if ((filteredExpressionStatements = op.get(node, "expression.arguments.1.body.body").filter(nodeObj => nodeObj.type === "ExpressionStatement" && op.get(nodeObj, "expression.callee.object.name") === "t")).length === 2 && // ensure last expression is t.end:
          op.get(filteredExpressionStatements[filteredExpressionStatements.length - 1], "expression.callee.property.name") === "end") {
            subTestCount = "single";
          } // console.log(
          //   `297 ${`\u001b[${33}m${`subTestCount`}\u001b[${39}m`} = ${stringify(
          //     subTestCount,
          //     null,
          //     4
          //   )}`
          // );


          const exprStatements = op.get(node, "expression.arguments.1.body.body");
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
            let counter2 = 0;

            for (let i = 0, len = exprStatements.length; i < len; i++) {
              // console.log(
              //   `336 ${`\u001b[${90}m${`=================================`}\u001b[${39}m`}`
              // );
              const assertsName = op.get(exprStatements[i], "expression.callee.property.name");

              if (!assertsName) {
                // console.log(
                //   `344 ${`\u001b[${31}m${`error - no assert name could be extracted! CONTINUE`}\u001b[${39}m`}`
                // );
                continue;
              } // console.log(
              //   `350 #${i} - assert: ${`\u001b[${36}m${assertsName}\u001b[${39}m`}, category: ${`\u001b[${36}m${
              //     messageIsThirdArg.has(assertsName)
              //       ? "III"
              //       : messageIsSecondArg.has(assertsName)
              //       ? "II"
              //       : "n/a"
              //   }\u001b[${39}m`}`
              // );
              // "message" argument's position is variable, sometimes it can be
              // either 2nd or 3rd


              let messageArgsPositionWeWillAimFor;

              if ( // assertion's name is known to contain "message" as third arg
              messageIsThirdArg.has(assertsName) && // and there is an argument present at that position
              op.has(exprStatements[i], "expression.arguments.2")) {
                messageArgsPositionWeWillAimFor = 2; // zero-based count
              } else if ( // assertion's name is known to contain "message" as second arg
              messageIsSecondArg.has(assertsName) && // and there is an argument present at that position
              op.has(exprStatements[i], "expression.arguments.1")) {
                messageArgsPositionWeWillAimFor = 1; // zero-based count
              } // console.log(
              //   `379 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`messageArgsPositionWeWillAimFor`}\u001b[${39}m`} = ${stringify(
              //     messageArgsPositionWeWillAimFor,
              //     null,
              //     4
              //   )}`
              // );


              if (messageArgsPositionWeWillAimFor) {
                // console.log(
                //   `388 ${`\u001b[${32}m${`message argument missing from assertion!`}\u001b[${39}m`}`
                // );
                //
                // console.log(
                //   `392 ${`\u001b[${90}m${`let's extract the value from "message" arg in assertion`}\u001b[${39}m`}`
                // );
                // the "message" can be Literal (single/double quotes) or
                // TemplateLiteral (backticks)
                let pathToMsgArgValue;
                let rawPathToMsgArgValue = ""; // used later in eslint reporting

                let pathToMsgArgStart;
                /* istanbul ignore else */

                if (op.get(exprStatements[i], `expression.arguments.${messageArgsPositionWeWillAimFor}.type`) === "TemplateLiteral") {
                  rawPathToMsgArgValue = `expression.arguments.${messageArgsPositionWeWillAimFor}.quasis.0`;
                  pathToMsgArgValue = op.get(exprStatements[i], `${rawPathToMsgArgValue}.value.raw`);
                  pathToMsgArgStart = op.get(exprStatements[i], `${rawPathToMsgArgValue}.start`);
                  counter2 += 1;
                } else if (op.get(exprStatements[i], `expression.arguments.${messageArgsPositionWeWillAimFor}.type`) === "Literal") {
                  rawPathToMsgArgValue = `expression.arguments.${messageArgsPositionWeWillAimFor}`;
                  pathToMsgArgValue = op.get(exprStatements[i], `${rawPathToMsgArgValue}.raw`);
                  pathToMsgArgStart = op.get(exprStatements[i], `${rawPathToMsgArgValue}.start`);
                  counter2 += 1;
                }

                const {
                  start,
                  end
                } = prep(pathToMsgArgValue, {
                  offset: pathToMsgArgStart,
                  returnRangesOnly: true
                }) || {};

                if (!start || !end) {
                  // console.log(
                  //   `444 ${`\u001b[${31}m${`SKIP`}\u001b[${39}m`} - no value extracted`
                  // );
                  continue;
                } // console.log(
                //   `450 old: ${`\u001b[${35}m${pathToMsgArgValue}\u001b[${39}m`} (pathToMsgArgValue)`
                // );
                // console.log(
                //   `453 old prepped value: ${`\u001b[${35}m${
                //     prep(pathToMsgArgValue).value
                //   }\u001b[${39}m`}`
                // );


                const newValue = getNewValue(subTestCount, testOrderNumber, counter2); // console.log(
                //   `465 new: ${`\u001b[${35}m${newValue}\u001b[${39}m`}  range: ${`\u001b[${35}m${`[${start}, ${end}]`}\u001b[${39}m`}`
                // );

                if (rawPathToMsgArgValue && prep(pathToMsgArgValue).value !== newValue) {
                  // console.log(
                  //   `470 ${`\u001b[${31}m${`MISMATCH!`}\u001b[${39}m`} reporting range [${start}, ${end}] to replace with a new value "${`\u001b[${35}m${newValue}\u001b[${39}m`}"`
                  // );
                  context.report({
                    node: op.get(exprStatements[i], rawPathToMsgArgValue),
                    messageId: "correctTestNum",
                    fix: fixerObj => {
                      return fixerObj.replaceTextRange([start, end], newValue);
                    }
                  });
                }
              } else {
                // console.log(
                //   `482 ${`\u001b[${31}m${`message argument missing from assertion!`}\u001b[${39}m`}`
                // );
                // First, find out at which index position should message
                // argument be on this given assertion. Keep in mind, there
                // can be wrong args present at desired argument position or not
                // enough arguments to reach that argument position
                let positionDecided;

                if ( // if assert's API takes three input arguments, the last arg
                // being the message's value
                messageIsThirdArg.has(assertsName) && // there are two arguments currently present in this assert
                Array.isArray(op.get(exprStatements[i], "expression.arguments")) && op.get(exprStatements[i], "expression.arguments").length === 2) {
                  positionDecided = 2; // counting from zero, means 3rd in a row
                } else if (messageIsSecondArg.has(assertsName) && Array.isArray(op.get(exprStatements[i], "expression.arguments")) && op.get(exprStatements[i], "expression.arguments").length === 1) {
                  positionDecided = 1; // counting from zero, means 2nd in a row
                }

                if (positionDecided) {
                  // console.log(
                  //   `514 ${`\u001b[${32}m${`DECIDED!`}\u001b[${39}m`} We'll insert arg at position: ${`\u001b[${33}m${`positionDecided`}\u001b[${39}m`} = ${stringify(
                  //     positionDecided,
                  //     null,
                  //     4
                  //   )}`
                  // );
                  // insert the value
                  const positionToInsertAt = op.get(exprStatements[i], "expression.end") - 1; // console.log(
                  //   `525 ${`\u001b[${35}m${`██`}\u001b[${39}m`} positionToInsertAt = ${positionToInsertAt}`
                  // );

                  const newValue = getNewValue(subTestCount, testOrderNumber, counter2); // there might be whitespace, so comma we're about to add
                  // must sit on a different line!!!

                  const wholeSourceStr = context.getSourceCode().getText();
                  const endIdx = positionToInsertAt; // left() finds the index of the first non-whitespace on the
                  // left, then we add +1 to not include it

                  const startIdx = (left(wholeSourceStr, endIdx) || 0) + 1; // console.log(
                  //   `544 SET ${`\u001b[${33}m${`startIdx`}\u001b[${39}m`} = ${JSON.stringify(
                  //     startIdx,
                  //     null,
                  //     4
                  //   )}`
                  // );

                  let valueToInsert = `, "${newValue}"`;

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
                  wholeSourceStr.slice(startIdx, endIdx).includes(`\n`)) {
                    // console.log(`569 we've got a multi-line case`);
                    // console.log(`570 slice [${startIdx}, ${endIdx}]`);
                    const frontalIndentation = Array.from(wholeSourceStr.slice(startIdx, endIdx)).filter(char => !`\r\n`.includes(char)).join("");
                    valueToInsert = `,\n${frontalIndentation}  "${newValue}"\n${frontalIndentation}`;
                  } // console.log(
                  //   `581 ${`\u001b[${32}m${`REPORT`}\u001b[${39}m`} ${JSON.stringify(
                  //     [startIdx, endIdx, valueToInsert],
                  //     null,
                  //     4
                  //   )}`
                  // );


                  context.report({
                    node: exprStatements[i],
                    messageId: "correctTestNum",
                    fix: fixerObj => {
                      return fixerObj.replaceTextRange([startIdx, endIdx], valueToInsert);
                    }
                  });
                }
              }
            } // console.log(
            //   `606 ${`\u001b[${90}m${`=================================`}\u001b[${39}m`}`
            // );

          }
        } // console.log(" ");


        if (finalDigitChunk.value) {
          /* istanbul ignore next */

          context.report({
            messageId: "correctTestNum",
            node: finalDigitChunk.node || node,
            fix: fixerObj => {
              return fixerObj.replaceTextRange([finalDigitChunk.start, finalDigitChunk.end], finalDigitChunk.value);
            }
          });
        }
      }
    }

  };
};

var correctTestNum = {
  create,
  meta: {
    // docs: {
    //   url: getDocumentationUrl(__filename),
    // },
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

export default main;
