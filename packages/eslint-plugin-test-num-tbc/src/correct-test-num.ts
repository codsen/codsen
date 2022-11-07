import op from "object-path";
import { left } from "string-left-right";
import {
  prep,
  stringify,
  getNewValue,
  messageIsSecondArg,
  messageIsThirdArg,
} from "./util";

declare let DEV: boolean;

export interface Obj {
  [key: string]: any;
}

const create = (context: Obj): Obj => {
  DEV &&
    console.log(
      `020 ${`\u001b[${33}m${`███████████████████████████████████████`}\u001b[${39}m`}`
    );

  let counter = 0;

  DEV &&
    console.log(
      `${`\u001b[${33}m${`context`}\u001b[${39}m`} = ${stringify(context)}`
    );

  return {
    ExpressionStatement(node: Obj) {
      DEV && console.log(`032 inside ExpressionStatement`);

      let wholeSourceStr = context.getSourceCode().getText();
      DEV &&
        console.log(
          `037 ${`\u001b[${33}m${`wholeSourceStr`}\u001b[${39}m`} = ${stringify(
            wholeSourceStr
          )}`
        );

      if (
        op.get(node, "expression.type") === "CallExpression" &&
        // uvu: test()
        (op.get(node, "expression.callee.name") === "test" ||
          // tap: tap.test()
          ["test", "only", "skip", "todo"].includes(
            op.get(node, "expression.callee.property.name")
          )) &&
        ["TemplateLiteral", "Literal"].includes(
          op.get(node, "expression.arguments.0.type")
        )
      ) {
        DEV && console.log(" ");
        DEV && console.log("-------------------------------");
        DEV && console.log(" ");
        counter += 1;
        DEV &&
          console.log(
            `${`\u001b[${33}m${`node.expression`}\u001b[${39}m`} #${`${counter}`.padStart(
              2,
              "0"
            )}: ${node.expression.start}-${node.expression.end}`
          );
        let testOrderNumber = `${counter}`.padStart(2, "0");

        // TACKLE THE FIRST ARG
        // ████████████████████

        // for example, the "09" in:
        // t.test("09 - something", (t) => ...)

        // it will be under "TemplateLiteral" node if backticks were used,
        // for example:
        // t.test(`09 - something`, (t) => ...) or "Literal" if quotes were used,
        // for example:
        // t.test("09 - something", (t) => ...)

        let finalDigitChunk: Obj = {};

        // if backticks, like:
        // tap.test(`99`, (t) => {
        //          ^  ^
        if (
          !finalDigitChunk.value &&
          op.get(node, "expression.arguments.0.type") === "TemplateLiteral" &&
          op.has(node, "expression.arguments.0.quasis.0.value.raw")
        ) {
          DEV && console.log(" ");
          DEV && console.log(" ");
          DEV &&
            console.log(
              `093 ${`\u001b[${34}m${`██ TemplateLiteral caught!`}\u001b[${39}m`}`
            );

          DEV &&
            console.log(
              `098 node.expression.arguments[0].quasis[0].value.raw: "${node.expression.arguments[0].quasis[0].value.raw}"`
            );

          DEV &&
            console.log(
              `103 ${`\u001b[${33}m${`op.get(node, "expression.arguments.0.quasis.0.start")`}\u001b[${39}m`} = ${JSON.stringify(
                op.get(node, "expression.arguments.0.quasis.0.start"),
                null,
                4
              )}`
            );

          // default esprima parser
          let offset1 =
            +(op.get(node, "expression.arguments.0.quasis.0.start") || 0) + 1;
          // customised to @typescript-eslint/parser
          let offset2 =
            +(op.get(node, "expression.arguments.0.range.0") || 0) + 1;
          DEV &&
            console.log(
              `118 ${`\u001b[${33}m${`offset1`}\u001b[${39}m`} = ${JSON.stringify(
                offset1,
                null,
                4
              )}; ${`\u001b[${33}m${`offset2`}\u001b[${39}m`} = ${JSON.stringify(
                offset2,
                null,
                4
              )}`
            );

          let source = op.get(
            node,
            "expression.arguments.0.quasis.0.value.raw"
          );
          DEV &&
            console.log(
              `135 ${`\u001b[${33}m${`source`}\u001b[${39}m`} = ${JSON.stringify(
                source,
                null,
                4
              )}`
            );

          DEV && console.log(`142`);
          let { start, end, value } =
            prep(source, {
              offset: Math.max(offset1, offset2),
              returnRangesOnly: true,
            }) || {};
          DEV &&
            console.log(
              `150 ${`\u001b[${31}m${`██`}\u001b[${39}m`} ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`start`}\u001b[${39}m`} = ${start}; ${`\u001b[${33}m${`end`}\u001b[${39}m`} = ${end}; ${`\u001b[${33}m${`value`}\u001b[${39}m`} = ${value} --- ${`\u001b[${33}m${`testOrderNumber`}\u001b[${39}m`} = ${testOrderNumber}`
            );

          if (
            typeof start === "number" &&
            typeof end === "number" &&
            value &&
            value !== testOrderNumber
          ) {
            DEV &&
              console.log(
                `161 ${`\u001b[${33}m${`value`}\u001b[${39}m`} = ${value}`
              );
            DEV && console.log("!==");
            DEV &&
              console.log(
                `166 ${`\u001b[${33}m${`testOrderNumber`}\u001b[${39}m`} = ${testOrderNumber}`
              );

            finalDigitChunk = {
              start,
              end,
              value: testOrderNumber,
              node: op.get(node, "expression.arguments.0.quasis.0"),
            };

            DEV &&
              console.log(
                `178 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`finalDigitChunk`}\u001b[${39}m`} = ${JSON.stringify(
                  {
                    start,
                    end,
                    value: testOrderNumber,
                  },
                  null,
                  4
                )}`
              );
          }
        }

        // if single or double quotes, like:
        // tap.test("99", (t) => {
        //          ^  ^
        if (
          !finalDigitChunk.value &&
          node.expression.arguments[0].type === "Literal" &&
          node.expression.arguments[0].raw
        ) {
          DEV && console.log(" ");
          DEV && console.log(" ");
          DEV &&
            console.log(
              `203 ${`\u001b[${34}m${`██ Literal caught!`}\u001b[${39}m`}`
            );

          // default esprima parser
          let offset1 = op.get(node, "expression.arguments.0.start") || 0;
          // customised to @typescript-eslint/parser
          let offset2 = op.get(node, "expression.arguments.0.range.0") || 0;
          DEV &&
            console.log(
              `212 ${`\u001b[${33}m${`offset1`}\u001b[${39}m`} = ${JSON.stringify(
                offset1,
                null,
                4
              )}; ${`\u001b[${33}m${`offset2`}\u001b[${39}m`} = ${JSON.stringify(
                offset2,
                null,
                4
              )}`
            );

          let { start, end, value } =
            prep(node.expression.arguments[0].raw, {
              offset: Math.max(offset1, offset2),
              returnRangesOnly: true,
            }) || {};

          if (
            typeof start === "number" &&
            typeof end === "number" &&
            value &&
            value !== testOrderNumber
          ) {
            finalDigitChunk = {
              start,
              end,
              value: testOrderNumber,
              node: node.expression.arguments[0],
            };
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
          !finalDigitChunk.value &&
          op.get(node, "expression.arguments.1.type") ===
            "ArrowFunctionExpression" &&
          op.get(node, "expression.arguments.1.body.type") ===
            "BlockStatement" &&
          op.get(node, "expression.arguments.1.body.body").length
        ) {
          DEV && console.log(" ");
          DEV && console.log(" ");
          DEV &&
            console.log(
              `267 ${`\u001b[${34}m${`██ Third arg literal found!`}\u001b[${39}m`}`
            );

          // let's find out, is it a single test clause or there are multiple
          let subTestCount = "multiple";

          let filteredExpressionStatements = [];
          if (
            (filteredExpressionStatements = op
              .get(node, "expression.arguments.1.body.body")
              .filter(
                (nodeObj: Obj) =>
                  nodeObj.type === "ExpressionStatement" &&
                  op.get(nodeObj, "expression.callee.object.name") === "t"
              )).length === 2 &&
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

          let exprStatements = op.get(node, "expression.arguments.1.body.body");
          DEV &&
            console.log(
              `296 ABOUT TO LOOP ${`\u001b[${33}m${`exprStatements`}\u001b[${39}m`} = ${stringify(
                exprStatements
              )}`
            );

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
              DEV &&
                console.log(
                  `329 ${`\u001b[${90}m${`=================================`}\u001b[${39}m`}`
                );
              let assertsName =
                // tap:
                op.get(exprStatements[i], "expression.callee.property.name") ||
                // uvu:
                op.get(exprStatements[i], "expression.callee.name");
              if (!assertsName) {
                DEV &&
                  console.log(
                    `339 ${`\u001b[${31}m${`error - no assert name could be extracted! CONTINUE`}\u001b[${39}m`}`
                  );
                continue;
              }

              DEV &&
                console.log(
                  `346 #${i} - assert: ${`\u001b[${36}m${assertsName}\u001b[${39}m`}, category: ${`\u001b[${36}m${
                    messageIsThirdArg.has(assertsName)
                      ? "III"
                      : messageIsSecondArg.has(assertsName)
                      ? "II"
                      : "n/a"
                  }\u001b[${39}m`}`
                );

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

              if (messageArgsPositionWeWillAimFor) {
                DEV &&
                  console.log(
                    `378 ${`\u001b[${32}m${`message argument missing from assertion!`}\u001b[${39}m`}`
                  );

                DEV &&
                  console.log(
                    `383 ${`\u001b[${90}m${`let's extract the value from "message" arg in assertion`}\u001b[${39}m`}`
                  );

                // the "message" can be Literal (single/double quotes) or
                // TemplateLiteral (backticks)

                let pathToMsgArgValue;
                let rawPathToMsgArgValue = ""; // used later in eslint reporting
                let pathToMsgArgStart;
                /* istanbul ignore else */
                if (
                  op.get(
                    exprStatements[i],
                    `expression.arguments.${messageArgsPositionWeWillAimFor}.type`
                  ) === "TemplateLiteral"
                ) {
                  DEV && console.log(`399 TemplateLiteral`);
                  rawPathToMsgArgValue = `expression.arguments.${messageArgsPositionWeWillAimFor}.quasis.0`;
                  DEV &&
                    console.log(
                      `403 SET ${`\u001b[${33}m${`rawPathToMsgArgValue`}\u001b[${39}m`} = ${JSON.stringify(
                        rawPathToMsgArgValue,
                        null,
                        4
                      )}`
                    );
                  pathToMsgArgValue = op.get(
                    exprStatements[i],
                    `${rawPathToMsgArgValue}.value.raw`
                  );
                  DEV &&
                    console.log(
                      `415  ************************** GETTING: ${stringify(
                        exprStatements[i]
                      )}\n\n\n${`${rawPathToMsgArgValue}.range.0`}`
                    );

                  pathToMsgArgStart =
                    +(
                      op.get(
                        exprStatements[i],
                        `${rawPathToMsgArgValue}.range.0`
                      ) || 0
                    ) + 1;
                  DEV &&
                    console.log(
                      `429 SET ${`\u001b[${31}m${`███████████████████████████████████████`}\u001b[${39}m`} ${`\u001b[${33}m${`pathToMsgArgStart`}\u001b[${39}m`} = ${pathToMsgArgStart}`
                    );
                  counter2 += 1;
                } else if (
                  op.get(
                    exprStatements[i],
                    `expression.arguments.${messageArgsPositionWeWillAimFor}.type`
                  ) === "Literal"
                ) {
                  DEV && console.log(`438 Literal`);
                  rawPathToMsgArgValue = `expression.arguments.${messageArgsPositionWeWillAimFor}`;
                  DEV &&
                    console.log(
                      `442 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`rawPathToMsgArgValue`}\u001b[${39}m`} = ${JSON.stringify(
                        rawPathToMsgArgValue,
                        null,
                        4
                      )}`
                    );
                  pathToMsgArgValue = op.get(
                    exprStatements[i],
                    `${rawPathToMsgArgValue}.raw`
                  );
                  DEV &&
                    console.log(
                      `454 ${`\u001b[${33}m${`rawPathToMsgArgValue`}\u001b[${39}m`} = ${JSON.stringify(
                        rawPathToMsgArgValue,
                        null,
                        4
                      )}`
                    );
                  DEV &&
                    console.log(
                      `462 ███████████████████████████████████████ ${`\u001b[${33}m${`exprStatements[${i}]`}\u001b[${39}m`} = ${stringify(
                        exprStatements[i]
                      )}`
                    );
                  pathToMsgArgStart =
                    // default parser, esprima
                    op.get(
                      exprStatements[i],
                      `${rawPathToMsgArgValue}.start`
                    ) ||
                    // TS parser, @typescript-eslint/parser
                    op.get(
                      exprStatements[i],
                      `${rawPathToMsgArgValue}.range.0`
                    );
                  counter2 += 1;
                }

                DEV &&
                  console.log(
                    `482 FIY, ${`\u001b[${33}m${`pathToMsgArgValue`}\u001b[${39}m`} = ${JSON.stringify(
                      pathToMsgArgValue,
                      null,
                      4
                    )}; ${`\u001b[${33}m${`pathToMsgArgStart`}\u001b[${39}m`} = ${JSON.stringify(
                      pathToMsgArgStart,
                      null,
                      4
                    )}`
                  );

                let { start, end } =
                  prep(pathToMsgArgValue, {
                    offset: pathToMsgArgStart,
                    returnRangesOnly: true,
                  }) || {};

                if (!start || !end) {
                  DEV &&
                    console.log(
                      `502 ${`\u001b[${31}m${`SKIP`}\u001b[${39}m`} - no value extracted`
                    );
                  continue;
                }

                DEV &&
                  console.log(
                    `509 old: ${`\u001b[${35}m${pathToMsgArgValue}\u001b[${39}m`} (pathToMsgArgValue)`
                  );

                let newValue = getNewValue(
                  subTestCount,
                  testOrderNumber,
                  counter2
                );
                DEV &&
                  console.log(
                    `519 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`newValue`}\u001b[${39}m`} = ${JSON.stringify(
                      newValue,
                      null,
                      4
                    )}`
                  );

                if (
                  rawPathToMsgArgValue &&
                  prep(pathToMsgArgValue).value !== newValue
                ) {
                  DEV &&
                    console.log(
                      `532 ${`\u001b[${31}m${`MISMATCH!`}\u001b[${39}m`} reporting range [${start}, ${end}] (${wholeSourceStr.slice(
                        start,
                        end
                      )}) to replace with a new value "${`\u001b[${35}m${newValue}\u001b[${39}m`}"`
                    );
                  context.report({
                    node: op.get(exprStatements[i], rawPathToMsgArgValue),
                    messageId: "correctTestNum",
                    fix: (fixerObj: Obj) => {
                      return fixerObj.replaceTextRange([start, end], newValue);
                    },
                  });
                }
              } else {
                DEV &&
                  console.log(
                    `548 ${`\u001b[${31}m${`message argument missing from assertion!`}\u001b[${39}m`}`
                  );

                // First, find out at which index position should message
                // argument be on this given assertion. Keep in mind, there
                // can be wrong args present at desired argument position or not
                // enough arguments to reach that argument position

                let positionDecided;
                if (
                  // if assert's API takes three input arguments, the last arg
                  // being the message's value
                  messageIsThirdArg.has(assertsName) &&
                  // there are two arguments currently present in this assert
                  Array.isArray(
                    op.get(exprStatements[i], "expression.arguments")
                  ) &&
                  op.get(exprStatements[i], "expression.arguments").length === 2
                ) {
                  positionDecided = 2; // counting from zero, means 3rd in a row
                  DEV &&
                    console.log(
                      `570 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`positionDecided`}\u001b[${39}m`} = ${JSON.stringify(
                        positionDecided,
                        null,
                        4
                      )}`
                    );
                } else if (
                  messageIsSecondArg.has(assertsName) &&
                  Array.isArray(
                    op.get(exprStatements[i], "expression.arguments")
                  ) &&
                  op.get(exprStatements[i], "expression.arguments").length === 1
                ) {
                  positionDecided = 1; // counting from zero, means 2nd in a row
                  DEV &&
                    console.log(
                      `586 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`positionDecided`}\u001b[${39}m`} = ${JSON.stringify(
                        positionDecided,
                        null,
                        4
                      )}`
                    );
                }

                DEV &&
                  console.log(
                    `596 ${`\u001b[${32}m${`FINAL`}\u001b[${39}m`} ${`\u001b[${33}m${`positionDecided`}\u001b[${39}m`} = ${JSON.stringify(
                      positionDecided,
                      null,
                      4
                    )}`
                  );

                if (positionDecided) {
                  DEV &&
                    console.log(
                      `606 ${`\u001b[${32}m${`DECIDED!`}\u001b[${39}m`} We'll insert arg at position: ${`\u001b[${33}m${`positionDecided`}\u001b[${39}m`} = ${positionDecided}`
                    );

                  // insert the value
                  let positionToInsertAt =
                    // default parser, esprima
                    (op.get(exprStatements[i], "expression.end") ||
                      // custom parser for TS, @typescript-eslint/parser
                      op.get(exprStatements[i], "expression.range.1")) - 1;
                  DEV &&
                    console.log(
                      `617 ${`\u001b[${35}m${`██`}\u001b[${39}m`} positionToInsertAt = ${positionToInsertAt}`
                    );

                  let newValue = getNewValue(
                    subTestCount,
                    testOrderNumber,
                    counter2
                  );

                  // there might be whitespace, so comma we're about to add
                  // must sit on a different line!!!
                  let endIdx = positionToInsertAt;

                  // left() finds the index of the first non-whitespace on the
                  // left, then we add +1 to not include it
                  let startIdx = (left(wholeSourceStr, endIdx) || 0) + 1;

                  DEV &&
                    console.log(
                      `636 SET ${`\u001b[${33}m${`startIdx`}\u001b[${39}m`} = ${JSON.stringify(
                        startIdx,
                        null,
                        4
                      )}`
                    );

                  let valueToInsert = `, "${newValue}"`;
                  if (
                    // if there's a line break between closing bracket inside
                    // the assertion and the last expression statement

                    // imagine:

                    // t.match(
                    //   resIn,
                    //   {
                    //     fixed: true,
                    //     output: read("out"),
                    //   },
                    //   "01.01" <----- we're about to add this line and that comma
                    // );

                    wholeSourceStr.slice(startIdx, endIdx).includes(`\n`)
                  ) {
                    DEV && console.log(`661 we've got a multi-line case`);
                    DEV && console.log(`662 slice [${startIdx}, ${endIdx}]`);

                    let frontalIndentation = Array.from(
                      wholeSourceStr.slice(startIdx, endIdx)
                    )
                      .filter((char) => !`\r\n`.includes(char as string))
                      .join("");
                    valueToInsert = `,\n${frontalIndentation}  "${newValue}"\n${frontalIndentation}`;
                  }

                  DEV &&
                    console.log(
                      `674 ${`\u001b[${32}m${`REPORT`}\u001b[${39}m`} ${JSON.stringify(
                        [startIdx, endIdx, valueToInsert],
                        null,
                        4
                      )}`
                    );

                  context.report({
                    node: exprStatements[i],
                    messageId: "correctTestNum",
                    fix: (fixerObj: Obj) => {
                      return fixerObj.replaceTextRange(
                        [startIdx, endIdx],
                        valueToInsert
                      );
                    },
                  });
                } else {
                  DEV &&
                    console.log(
                      `694 ${`\u001b[${31}m${`"positionDecided" not decided, skip!`}\u001b[${39}m`}`
                    );
                }
              }
            }
            DEV &&
              console.log(
                `701 ${`\u001b[${90}m${`=================================`}\u001b[${39}m`}`
              );
          }
        }

        DEV && console.log(" ");

        if (finalDigitChunk.value) {
          DEV &&
            console.log(
              `711 ${`\u001b[${31}m${`MISMATCH!`}\u001b[${39}m`} reporting range [${
                finalDigitChunk.start
              }, ${finalDigitChunk.end}] (${wholeSourceStr.slice(
                finalDigitChunk.start,
                finalDigitChunk.end
              )}) to replace with a new value "${`\u001b[${35}m${
                finalDigitChunk.value
              }\u001b[${39}m`}"`
            );

          /* istanbul ignore next */
          context.report({
            messageId: "correctTestNum",
            node: finalDigitChunk.node || node,
            fix: (fixerObj: Obj) => {
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

export const correctTestNum = {
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
