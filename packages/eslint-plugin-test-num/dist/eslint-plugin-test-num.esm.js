/**
 * eslint-plugin-test-num
 * ESLint plugin to update unit test numbers automatically
 * Version: 1.3.11
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/eslint-plugin-test-num/
 */

import op from 'object-path';
import { left } from 'string-left-right';

function prep(str, originalOpts) {
  /* istanbul ignore if */
  if (typeof str !== "string" || !str.length) {
    return;
  }
  const defaults = {
    offset: 0,
  };
  const opts = { ...defaults, ...originalOpts };
  let digitsChunkStartsAt = null;
  let lastDigitAt;
  for (let i = 0, len = str.length; i <= len; i++) {
    if (
      digitsChunkStartsAt !== null &&
      ((str[i] &&
        str[i].trim().length &&
        !/\d/.test(str[i]) &&
        !["."].includes(str[i])) ||
        !str[i])
    ) {
      return {
        start: opts.offset + digitsChunkStartsAt,
        end: opts.offset + lastDigitAt + 1,
        value: str.slice(digitsChunkStartsAt, lastDigitAt + 1),
      };
    }
    if (/^\d*$/.test(str[i])) {
      lastDigitAt = i;
      if (
        digitsChunkStartsAt === null
      ) {
        digitsChunkStartsAt = i;
      }
    }
    if (
      digitsChunkStartsAt === null &&
      str[i] &&
      str[i].trim().length &&
      !/[\d.'"`]/.test(str[i])
    ) {
      return;
    }
  }
}

const getNewValue = (subTestCount, testOrderNumber, counter2) =>
  subTestCount === "single"
    ? testOrderNumber
    : `${testOrderNumber}.${`${counter2}`.padStart(2, "0")}`;

const messageIsSecondArg = new Set([
  "ok",
  "notOk",
  "true",
  "false",
  "assert",
  "assertNot",
  "error",
  "ifErr",
  "ifError",
  "rejects",
  "resolves",
  "resolveMatchSnapshot",
  "throws",
  "throw",
  "doesNotThrow",
  "notThrow",
  "expectUncaughtException",
]);
const messageIsThirdArg = new Set([
  "emits",
  "rejects",
  "resolveMatch",
  "throws",
  "throw",
  "expectUncaughtException",
  "equal",
  "equals",
  "isEqual",
  "is",
  "strictEqual",
  "strictEquals",
  "strictIs",
  "isStrict",
  "isStrictly",
  "notEqual",
  "inequal",
  "notEqual",
  "notEquals",
  "notStrictEqual",
  "notStrictEquals",
  "isNotEqual",
  "isNot",
  "doesNotEqual",
  "isInequal",
  "same",
  "equivalent",
  "looseEqual",
  "looseEquals",
  "deepEqual",
  "deepEquals",
  "isLoose",
  "looseIs",
  "notSame",
  "inequivalent",
  "looseInequal",
  "notDeep",
  "deepInequal",
  "notLoose",
  "looseNot",
  "strictSame",
  "strictEquivalent",
  "strictDeepEqual",
  "sameStrict",
  "deepIs",
  "isDeeply",
  "isDeep",
  "strictDeepEquals",
  "strictNotSame",
  "strictInequivalent",
  "strictDeepInequal",
  "notSameStrict",
  "deepNot",
  "notDeeply",
  "strictDeepInequals",
  "notStrictSame",
  "hasStrict",
  "match",
  "has",
  "hasFields",
  "matches",
  "similar",
  "like",
  "isLike",
  "includes",
  "include",
  "contains",
  "notMatch",
  "dissimilar",
  "unsimilar",
  "notSimilar",
  "unlike",
  "isUnlike",
  "notLike",
  "isNotLike",
  "doesNotHave",
  "isNotSimilar",
  "isDissimilar",
  "type",
  "isa",
  "isA",
]);
const create = (context) => {
  let counter = 0;
  return {
    ExpressionStatement(node) {
      if (
        op.get(node, "expression.type") === "CallExpression" &&
        ["test", "only", "skip", "todo"].includes(
          op.get(node, "expression.callee.property.name")
        ) &&
        ["TemplateLiteral", "Literal"].includes(
          op.get(node, "expression.arguments.0.type")
        )
      ) {
        counter += 1;
        const testOrderNumber = `${counter}`.padStart(2, "0");
        let finalDigitChunk;
        if (
          !finalDigitChunk &&
          op.get(node, "expression.arguments.0.type") === "TemplateLiteral" &&
          op.has(node, "expression.arguments.0.quasis.0.value.raw")
        ) {
          const { start, end, value } =
            prep(op.get(node, "expression.arguments.0.quasis.0.value.raw"), {
              offset: op.get(node, "expression.arguments.0.quasis.0.start"),
              returnRangesOnly: true,
            }) || {};
          if (start && end && value && value !== testOrderNumber) {
            finalDigitChunk = {
              start,
              end,
              value: testOrderNumber,
              node: op.get(node, "expression.arguments.0.quasis.0"),
            };
          }
        }
        if (
          !finalDigitChunk &&
          node.expression.arguments[0].type === "Literal" &&
          node.expression.arguments[0].raw
        ) {
          const { start, end, value } =
            prep(node.expression.arguments[0].raw, {
              offset: node.expression.arguments[0].start,
              returnRangesOnly: true,
            }) || {};
          if (start && end && value && value !== testOrderNumber) {
            finalDigitChunk = {
              start,
              end,
              value: testOrderNumber,
              node: node.expression.arguments[0],
            };
          }
        }
        if (
          !finalDigitChunk &&
          op.get(node, "expression.arguments.1.type") ===
            "ArrowFunctionExpression" &&
          op.get(node, "expression.arguments.1.body.type") ===
            "BlockStatement" &&
          op.get(node, "expression.arguments.1.body.body").length
        ) {
          let subTestCount = "multiple";
          let filteredExpressionStatements = {};
          if (
            (filteredExpressionStatements = op
              .get(node, "expression.arguments.1.body.body")
              .filter(
                (nodeObj) =>
                  nodeObj.type === "ExpressionStatement" &&
                  op.get(nodeObj, "expression.callee.object.name") === "t"
              )).length === 2 &&
            op.get(
              filteredExpressionStatements[
                filteredExpressionStatements.length - 1
              ],
              "expression.callee.property.name"
            ) === "end"
          ) {
            subTestCount = "single";
          }
          const exprStatements = op.get(
            node,
            "expression.arguments.1.body.body"
          );
          /* istanbul ignore else */
          if (Array.isArray(exprStatements)) {
            let counter2 = 0;
            for (let i = 0, len = exprStatements.length; i < len; i++) {
              const assertsName = op.get(
                exprStatements[i],
                "expression.callee.property.name"
              );
              if (!assertsName) {
                continue;
              }
              let messageArgsPositionWeWillAimFor;
              if (
                messageIsThirdArg.has(assertsName) &&
                op.has(exprStatements[i], "expression.arguments.2")
              ) {
                messageArgsPositionWeWillAimFor = 2;
              } else if (
                messageIsSecondArg.has(assertsName) &&
                op.has(exprStatements[i], "expression.arguments.1")
              ) {
                messageArgsPositionWeWillAimFor = 1;
              }
              if (messageArgsPositionWeWillAimFor) {
                let pathToMsgArgValue;
                let rawPathToMsgArgValue;
                let pathToMsgArgStart;
                /* istanbul ignore else */
                if (
                  op.get(
                    exprStatements[i],
                    `expression.arguments.${messageArgsPositionWeWillAimFor}.type`
                  ) === "TemplateLiteral"
                ) {
                  rawPathToMsgArgValue = `expression.arguments.${messageArgsPositionWeWillAimFor}.quasis.0`;
                  pathToMsgArgValue = op.get(
                    exprStatements[i],
                    `${rawPathToMsgArgValue}.value.raw`
                  );
                  pathToMsgArgStart = op.get(
                    exprStatements[i],
                    `${rawPathToMsgArgValue}.start`
                  );
                  counter2 += 1;
                } else if (
                  op.get(
                    exprStatements[i],
                    `expression.arguments.${messageArgsPositionWeWillAimFor}.type`
                  ) === "Literal"
                ) {
                  rawPathToMsgArgValue = `expression.arguments.${messageArgsPositionWeWillAimFor}`;
                  pathToMsgArgValue = op.get(
                    exprStatements[i],
                    `${rawPathToMsgArgValue}.raw`
                  );
                  pathToMsgArgStart = op.get(
                    exprStatements[i],
                    `${rawPathToMsgArgValue}.start`
                  );
                  counter2 += 1;
                }
                const { start, end } =
                  prep(pathToMsgArgValue, {
                    offset: pathToMsgArgStart,
                    returnRangesOnly: true,
                  }) || {};
                if (!start || !end) {
                  continue;
                }
                const newValue = getNewValue(
                  subTestCount,
                  testOrderNumber,
                  counter2
                );
                if (prep(pathToMsgArgValue).value !== newValue) {
                  context.report({
                    node: op.get(exprStatements[i], rawPathToMsgArgValue),
                    messageId: "correctTestNum",
                    fix: (fixerObj) => {
                      return fixerObj.replaceTextRange([start, end], newValue);
                    },
                  });
                }
              } else {
                let positionDecided;
                if (
                  messageIsThirdArg.has(assertsName) &&
                  Array.isArray(
                    op.get(exprStatements[i], "expression.arguments")
                  ) &&
                  op.get(exprStatements[i], "expression.arguments").length === 2
                ) {
                  positionDecided = 2;
                } else if (
                  messageIsSecondArg.has(assertsName) &&
                  Array.isArray(
                    op.get(exprStatements[i], "expression.arguments")
                  ) &&
                  op.get(exprStatements[i], "expression.arguments").length === 1
                ) {
                  positionDecided = 1;
                }
                if (positionDecided) {
                  const positionToInsertAt =
                    op.get(exprStatements[i], "expression.end") - 1;
                  const newValue = getNewValue(
                    subTestCount,
                    testOrderNumber,
                    counter2
                  );
                  const wholeSourceStr = context.getSourceCode().getText();
                  const endIdx = positionToInsertAt;
                  const startIdx = left(wholeSourceStr, endIdx) + 1;
                  let valueToInsert = `, "${newValue}"`;
                  if (
                    wholeSourceStr.slice(startIdx, endIdx).includes(`\n`)
                  ) {
                    const frontalIndentation = Array.from(
                      wholeSourceStr.slice(startIdx, endIdx)
                    )
                      .filter((char) => !`\r\n`.includes(char))
                      .join("");
                    valueToInsert = `,\n${frontalIndentation}  "${newValue}"\n${frontalIndentation}`;
                  }
                  context.report({
                    node: exprStatements[i],
                    messageId: "correctTestNum",
                    fix: (fixerObj) => {
                      return fixerObj.replaceTextRange(
                        [startIdx, endIdx],
                        valueToInsert
                      );
                    },
                  });
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
            fix: (fixerObj) => {
              return fixerObj.replaceTextRange(
                [finalDigitChunk.start, finalDigitChunk.end],
                finalDigitChunk.value
              );
            },
          });
        }
      }
    },
  };
};
var correctTestNum = {
  create,
  meta: {
    type: "suggestion",
    messages: {
      correctTestNum: "Update the test number.",
    },
    fixable: "code",
  },
};

var main = {
  configs: {
    recommended: {
      plugins: ["test-num"],
      rules: {
        "no-console": "off",
        "test-num/correct-test-num": "error",
      },
    },
  },
  rules: {
    "correct-test-num": correctTestNum,
  },
};

export default main;
