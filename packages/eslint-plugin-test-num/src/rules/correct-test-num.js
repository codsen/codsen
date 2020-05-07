/* eslint no-cond-assign: 0 */

// import stringify from "json-stringify-safe";
import op from "object-path";
import prep from "../util/prep";

// console.log(`\n\n\n005 ███████████████████████████████████████`);

// compiled from https://node-tap.org/docs/api/asserts/
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
  "rejects", // "rejects" message can be 2nd or 3rd arg!!!
  "resolves",
  "resolveMatchSnapshot",
  "throws", // "throws" message can be 2nd or 3rd arg!!!
  "throw", // "throw" message can be 2nd or 3rd arg!!!
  "doesNotThrow",
  "notThrow",
  "expectUncaughtException", // "expectUncaughtException" message can be 2nd or 3rd arg!!!
]);

// compiled from https://node-tap.org/docs/api/asserts/
const messageIsThirdArg = new Set([
  "emits",
  "rejects", // "rejects" message can be 2nd or 3rd arg!!!
  "resolveMatch",
  "throws", // "throws" message can be 2nd or 3rd arg!!!
  "throw", // "throw" message can be 2nd or 3rd arg!!!
  "expectUncaughtException", // "expectUncaughtException" message can be 2nd or 3rd arg!!!
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
  // console.log(
  //   `117 ${`\u001b[${33}m${`███████████████████████████████████████`}\u001b[${39}m`}`
  // );

  let counter = 0;

  return {
    ExpressionStatement(node) {
      if (
        op.get(node, "expression.type") === "CallExpression" &&
        ["test", "only"].includes(
          op.get(node, "expression.callee.property.name")
        ) &&
        ["TemplateLiteral", "Literal"].includes(
          op.get(node, "expression.arguments.0.type")
        )
      ) {
        // console.log(" ");
        // console.log("-------------------------------");
        // console.log(" ");
        counter += 1;
        // console.log(
        //   `${`\u001b[${33}m${`node.expression`}\u001b[${39}m`} #${`${counter}`.padStart(
        //     2,
        //     "0"
        //   )}: ${node.expression.start}-${node.expression.end}`
        // );
        const testOrderNumber = `${counter}`.padStart(2, "0");

        // TACKLE THE FIRST ARG
        // ████████████████████

        // for example, the "09" in:
        // t.test("09 - something", (t) => ...)

        // it will be under "TemplateLiteral" node if backticks were used,
        // for example:
        // t.test(`09 - something`, (t) => ...) or "Literal" if quotes were used,
        // for example:
        // t.test("09 - something", (t) => ...)

        let finalDigitChunk;

        if (
          !finalDigitChunk &&
          op.get(node, "expression.arguments.0.type") === "TemplateLiteral" &&
          op.has(node, "expression.arguments.0.quasis.0.value.raw")
        ) {
          // console.log(" ");
          // console.log(" ");
          // console.log(
          //   `167 ${`\u001b[${34}m${`██ TemplateLiteral caught!`}\u001b[${39}m`}`
          // );
          //
          // console.log(
          //   `171 node.expression.arguments[0].quasis[0].value.raw: "${node.expression.arguments[0].quasis[0].value.raw}"`
          // );

          const { start, end, value } =
            prep(op.get(node, "expression.arguments.0.quasis.0.value.raw"), {
              offset: op.get(node, "expression.arguments.0.quasis.0.start"),
              returnRangesOnly: true,
            }) || {};

          if (start && end && value && value !== testOrderNumber) {
            // console.log(
            //   `182 ${`\u001b[${33}m${`value`}\u001b[${39}m`} = ${JSON.stringify(
            //     value,
            //     null,
            //     4
            //   )}`
            // );
            // console.log("!==");
            // console.log(
            //   `190 ${`\u001b[${33}m${`testOrderNumber`}\u001b[${39}m`} = ${JSON.stringify(
            //     testOrderNumber,
            //     null,
            //     4
            //   )}`
            // );

            finalDigitChunk = { start, end, value: testOrderNumber };
            // console.log(
            //   `199 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`finalDigitChunk`}\u001b[${39}m`} = ${JSON.stringify(
            //     finalDigitChunk,
            //     null,
            //     4
            //   )}`
            // );
          }
        }

        if (
          !finalDigitChunk &&
          node.expression.arguments[0].type === "Literal" &&
          node.expression.arguments[0].raw
        ) {
          // console.log(" ");
          // console.log(" ");
          // console.log(
          //   `216 ${`\u001b[${34}m${`██ Literal caught!`}\u001b[${39}m`}`
          // );

          const { start, end, value } =
            prep(node.expression.arguments[0].raw, {
              offset: node.expression.arguments[0].start,
              returnRangesOnly: true,
            }) || {};

          if (start && end && value && value !== testOrderNumber) {
            finalDigitChunk = { start, end, value: testOrderNumber };
            // console.log(
            //   `228 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`finalDigitChunk`}\u001b[${39}m`} = ${JSON.stringify(
            //     finalDigitChunk,
            //     null,
            //     4
            //   )}`
            // );
          }
        }

        // TACKLE THE THIRD ARG
        // ████████████████████
        // for example, the "09" in:
        // t.test(
        //   "some name",
        //   (t) => {
        //     t.same(fix("z &angst; y"), [], "09");
        //     t.end();
        //   }
        // );

        if (
          !finalDigitChunk &&
          op.get(node, "expression.arguments.1.type") ===
            "ArrowFunctionExpression" &&
          op.get(node, "expression.arguments.1.body.type") ===
            "BlockStatement" &&
          op.get(node, "expression.arguments.1.body.body").length
        ) {
          // console.log(" ");
          // console.log(" ");
          // console.log(
          //   `259 ${`\u001b[${34}m${`██ Third arg literal found!`}\u001b[${39}m`}`
          // );

          // let's find out, is it a single test clause or there are multiple
          let subTestCount = "multiple";

          let filteredExpressionStatements = {};
          if (
            (filteredExpressionStatements = op
              .get(node, "expression.arguments.1.body.body")
              .filter((nodeObj) => nodeObj.type === "ExpressionStatement"))
              .length === 2 &&
            // ensure last expression is t.end:
            op.get(
              filteredExpressionStatements[
                filteredExpressionStatements.length - 1
              ],
              "expression.callee.property.name"
            ) === "end"
          ) {
            subTestCount = "single";
          }
          // console.log(
          //   `282 ${`\u001b[${33}m${`subTestCount`}\u001b[${39}m`} = ${JSON.stringify(
          //     subTestCount,
          //     null,
          //     4
          //   )}`
          // );

          const exprStatements = op.get(
            node,
            "expression.arguments.1.body.body"
          );

          /* istanbul ignore else */
          if (Array.isArray(exprStatements)) {
            // loop through expression statements, t.* calls inside the (t) => {...}
            for (let i = 0, len = exprStatements.length; i < len; i++) {
              // console.log(
              //   `299 ${`\u001b[${90}m${`=================================`}\u001b[${39}m`}`
              // );
              const assertsName = op.get(
                exprStatements[i],
                "expression.callee.property.name"
              );
              if (!assertsName) {
                // console.log(
                //   `307 ${`\u001b[${31}m${`error - no assert name could be extracted! CONTINUE`}\u001b[${39}m`}`
                // );
                continue;
              }

              // console.log(
              //   `313 #${i} - assert: ${`\u001b[${36}m${assertsName}\u001b[${39}m`}, category: ${`\u001b[${36}m${
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
              if (
                // assertion's name is known to contain "message" as third arg
                messageIsThirdArg.has(assertsName) &&
                // and there is an argument present at that position
                op.has(exprStatements[i], "expression.arguments.2")
              ) {
                messageArgsPositionWeWillAimFor = 2; // zero-based count
              } else if (
                // assertion's name is known to contain "message" as second arg
                messageIsSecondArg.has(assertsName) &&
                // and there is an argument present at that position
                op.has(exprStatements[i], "expression.arguments.1")
              ) {
                messageArgsPositionWeWillAimFor = 1; // zero-based count
              }
              // console.log(
              //   `342 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`messageArgsPositionWeWillAimFor`}\u001b[${39}m`} = ${JSON.stringify(
              //     messageArgsPositionWeWillAimFor,
              //     null,
              //     4
              //   )}`
              // );

              if (messageArgsPositionWeWillAimFor) {
                // console.log(
                //   `351 ${`\u001b[${90}m${`let's extract the value from "message" arg in assertion`}\u001b[${39}m`}`
                // );

                // the "message" can be Literal (single/double quotes) or
                // TemplateLiteral (backticks)

                let pathToMsgArgValue;
                let pathToMsgArgStart;
                /* istanbul ignore else */
                if (
                  op.get(
                    exprStatements[i],
                    `expression.arguments.${messageArgsPositionWeWillAimFor}.type`
                  ) === "TemplateLiteral"
                ) {
                  pathToMsgArgValue = op.get(
                    exprStatements[i],
                    `expression.arguments.${messageArgsPositionWeWillAimFor}.quasis.0.value.raw`
                  );
                  pathToMsgArgStart = op.get(
                    exprStatements[i],
                    `expression.arguments.${messageArgsPositionWeWillAimFor}.quasis.0.start`
                  );
                } else if (
                  op.get(
                    exprStatements[i],
                    `expression.arguments.${messageArgsPositionWeWillAimFor}.type`
                  ) === "Literal"
                ) {
                  pathToMsgArgValue = op.get(
                    exprStatements[i],
                    `expression.arguments.${messageArgsPositionWeWillAimFor}.raw`
                  );
                  pathToMsgArgStart = op.get(
                    exprStatements[i],
                    `expression.arguments.${messageArgsPositionWeWillAimFor}.start`
                  );
                }

                const { start, end } =
                  prep(pathToMsgArgValue, {
                    offset: pathToMsgArgStart,
                    returnRangesOnly: true,
                  }) || {};

                if (!start || !end) {
                  // console.log(
                  //   `398 ${`\u001b[${31}m${`SKIP`}\u001b[${39}m`} - no value extracted`
                  // );
                  continue;
                }

                // console.log(
                //   `404 old: ${`\u001b[${35}m${pathToMsgArgValue}\u001b[${39}m`} (pathToMsgArgValue)`
                // );
                // console.log(
                //   `407 old prepped value: ${`\u001b[${35}m${
                //     prep(pathToMsgArgValue).value
                //   }\u001b[${39}m`}`
                // );

                const newValue =
                  subTestCount === "single"
                    ? testOrderNumber
                    : `${testOrderNumber}.${`${i + 1}`.padStart(2, "0")}`;

                // console.log(
                //   `418 new: ${`\u001b[${35}m${newValue}\u001b[${39}m`}  range: ${`\u001b[${35}m${`[${start}, ${end}]`}\u001b[${39}m`}`
                // );

                if (prep(pathToMsgArgValue).value !== newValue) {
                  // console.log(
                  //   `423 ${`\u001b[${31}m${`MISMATCH!`}\u001b[${39}m`} reporting range [${start}, ${end}] to replace with a new value "${`\u001b[${35}m${newValue}\u001b[${39}m`}"`
                  // );
                  context.report({
                    node,
                    messageId: "correctTestNum",
                    fix: (fixerObj) => {
                      return fixerObj.replaceTextRange([start, end], newValue);
                    },
                  });
                }
              }
            }
            // console.log(
            //   `436 ${`\u001b[${90}m${`=================================`}\u001b[${39}m`}`
            // );
          }
        }

        // console.log(" ");
        // console.log(
        //   `443 ${`\u001b[${32}m${`finally`}\u001b[${39}m`}, ${`\u001b[${33}m${`finalDigitChunk`}\u001b[${39}m`} = ${JSON.stringify(
        //     finalDigitChunk,
        //     null,
        //     4
        //   )}`
        // );

        if (finalDigitChunk) {
          // console.log(
          //   `452 ${`\u001b[${31}m${`MISMATCH!`}\u001b[${39}m`} reporting range [${
          //     finalDigitChunk.start
          //   }, ${
          //     finalDigitChunk.end
          //   }] to replace with a new value "${`\u001b[${35}m${
          //     finalDigitChunk.value
          //   }\u001b[${39}m`}"`
          // );
          context.report({
            node,
            messageId: "correctTestNum",
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

export default {
  create,
  meta: {
    // docs: {
    //   url: getDocumentationUrl(__filename),
    // },
    type: "suggestion",
    messages: {
      correctTestNum: "Update the test number.",
    },
    fixable: "code", // or "code" or "whitespace"
  },
};
