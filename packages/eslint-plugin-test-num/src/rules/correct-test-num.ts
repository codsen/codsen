// import stringify from "json-stringify-safe";
import op from "object-path";
import { left } from "string-left-right";
import prep from "../util/prep";
import getNewValue from "../util/getNewValue";

export interface Obj {
  [key: string]: any;
}

console.log(`\n\n\n005 ███████████████████████████████████████`);

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

const create = (context: Obj): Obj => {
  console.log(
    `121 ${`\u001b[${33}m${`███████████████████████████████████████`}\u001b[${39}m`}`
  );

  let counter = 0;

  return {
    ExpressionStatement(node: Obj) {
      if (
        op.get(node, "expression.type") === "CallExpression" &&
        ["test", "only", "skip", "todo"].includes(
          op.get(node, "expression.callee.property.name")
        ) &&
        ["TemplateLiteral", "Literal"].includes(
          op.get(node, "expression.arguments.0.type")
        )
      ) {
        console.log(" ");
        console.log("-------------------------------");
        console.log(" ");
        counter += 1;
        console.log(
          `${`\u001b[${33}m${`node.expression`}\u001b[${39}m`} #${`${counter}`.padStart(
            2,
            "0"
          )}: ${node.expression.start}-${node.expression.end}`
        );
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

        let finalDigitChunk: Obj = {};

        // if backticks, like:
        // tap.test(`99`, (t) => {
        //          ^  ^
        if (
          !finalDigitChunk.value &&
          op.get(node, "expression.arguments.0.type") === "TemplateLiteral" &&
          op.has(node, "expression.arguments.0.quasis.0.value.raw")
        ) {
          console.log(" ");
          console.log(" ");
          console.log(
            `174 ${`\u001b[${34}m${`██ TemplateLiteral caught!`}\u001b[${39}m`}`
          );

          console.log(
            `178 node.expression.arguments[0].quasis[0].value.raw: "${node.expression.arguments[0].quasis[0].value.raw}"`
          );

          console.log(
            `182 ${`\u001b[${33}m${`op.get(node, "expression.arguments.0.quasis.0.start")`}\u001b[${39}m`} = ${JSON.stringify(
              op.get(node, "expression.arguments.0.quasis.0.start"),
              null,
              4
            )}`
          );

          // default esprima parser
          const offset1 = op.get(node, "expression.arguments.0.quasis.0.start");
          // customised to @typescript-eslint/parser
          const offset2 = op.get(node, "expression.arguments.0.range.0") + 1;
          console.log(
            `194 ${`\u001b[${33}m${`offset1`}\u001b[${39}m`} = ${JSON.stringify(
              offset1,
              null,
              4
            )}; ${`\u001b[${33}m${`offset2`}\u001b[${39}m`} = ${JSON.stringify(
              offset2,
              null,
              4
            )}`
          );

          const source = op.get(
            node,
            "expression.arguments.0.quasis.0.value.raw"
          );
          console.log(
            `210 ${`\u001b[${33}m${`source`}\u001b[${39}m`} = ${JSON.stringify(
              source,
              null,
              4
            )}`
          );

          const temp = prep(source, {
            offset: offset1 || offset2,
            returnRangesOnly: true,
          });
          console.log(
            `222 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`temp`}\u001b[${39}m`} = ${JSON.stringify(
              temp,
              null,
              4
            )}`
          );

          const { start, end, value } =
            prep(source, {
              offset: offset1 || offset2,
              returnRangesOnly: true,
            }) || {};
          console.log(
            `235 ${`\u001b[${31}m${`██`}\u001b[${39}m`} ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`start`}\u001b[${39}m`} = ${start}; ${`\u001b[${33}m${`end`}\u001b[${39}m`} = ${end}; ${`\u001b[${33}m${`value`}\u001b[${39}m`} = ${value} --- ${`\u001b[${33}m${`testOrderNumber`}\u001b[${39}m`} = ${testOrderNumber}`
          );

          if (
            typeof start === "number" &&
            typeof end === "number" &&
            value &&
            value !== testOrderNumber
          ) {
            console.log(
              `245 ${`\u001b[${33}m${`value`}\u001b[${39}m`} = ${value}`
            );
            console.log("!==");
            console.log(
              `249 ${`\u001b[${33}m${`testOrderNumber`}\u001b[${39}m`} = ${testOrderNumber}`
            );

            finalDigitChunk = {
              start,
              end,
              value: testOrderNumber,
              node: op.get(node, "expression.arguments.0.quasis.0"),
            };
            // console.log(
            //   `259 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`finalDigitChunk.node.loc`}\u001b[${39}m`} = ${stringify(
            //     finalDigitChunk.node.loc,
            //     null,
            //     4
            //   )}`
            // );
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
          console.log(" ");
          console.log(" ");
          console.log(
            `279 ${`\u001b[${34}m${`██ Literal caught!`}\u001b[${39}m`}`
          );

          // default esprima parser
          const offset1 = op.get(node, "expression.arguments.0.start");
          // customised to @typescript-eslint/parser
          const offset2 = op.get(node, "expression.arguments.0.range.0");
          console.log(
            `287 ${`\u001b[${33}m${`offset1`}\u001b[${39}m`} = ${JSON.stringify(
              offset1,
              null,
              4
            )}; ${`\u001b[${33}m${`offset2`}\u001b[${39}m`} = ${JSON.stringify(
              offset2,
              null,
              4
            )}`
          );

          const { start, end, value } =
            prep(node.expression.arguments[0].raw, {
              offset: offset1 || offset2,
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
            // console.log(
            //   `317 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`finalDigitChunk`}\u001b[${39}m`} = ${stringify(
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
          !finalDigitChunk.value &&
          op.get(node, "expression.arguments.1.type") ===
            "ArrowFunctionExpression" &&
          op.get(node, "expression.arguments.1.body.type") ===
            "BlockStatement" &&
          op.get(node, "expression.arguments.1.body.body").length
        ) {
          console.log(" ");
          console.log(" ");
          console.log(
            `348 ${`\u001b[${34}m${`██ Third arg literal found!`}\u001b[${39}m`}`
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
          // console.log(
          //   `374 ${`\u001b[${33}m${`subTestCount`}\u001b[${39}m`} = ${stringify(
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
              console.log(
                `413 ${`\u001b[${90}m${`=================================`}\u001b[${39}m`}`
              );
              const assertsName = op.get(
                exprStatements[i],
                "expression.callee.property.name"
              );
              if (!assertsName) {
                console.log(
                  `421 ${`\u001b[${31}m${`error - no assert name could be extracted! CONTINUE`}\u001b[${39}m`}`
                );
                continue;
              }

              console.log(
                `427 #${i} - assert: ${`\u001b[${36}m${assertsName}\u001b[${39}m`}, category: ${`\u001b[${36}m${
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
              // console.log(
              //   `456 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`messageArgsPositionWeWillAimFor`}\u001b[${39}m`} = ${stringify(
              //     messageArgsPositionWeWillAimFor,
              //     null,
              //     4
              //   )}`
              // );

              if (messageArgsPositionWeWillAimFor) {
                console.log(
                  `465 ${`\u001b[${32}m${`message argument missing from assertion!`}\u001b[${39}m`}`
                );

                console.log(
                  `469 ${`\u001b[${90}m${`let's extract the value from "message" arg in assertion`}\u001b[${39}m`}`
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
                  console.log(`485 TemplateLiteral`);
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
                  console.log(`502 Literal`);
                  rawPathToMsgArgValue = `expression.arguments.${messageArgsPositionWeWillAimFor}`;
                  console.log(
                    `505 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`rawPathToMsgArgValue`}\u001b[${39}m`} = ${JSON.stringify(
                      rawPathToMsgArgValue,
                      null,
                      4
                    )}`
                  );
                  pathToMsgArgValue = op.get(
                    exprStatements[i],
                    `${rawPathToMsgArgValue}.raw`
                  );
                  console.log(
                    `516 ${`\u001b[${33}m${`rawPathToMsgArgValue`}\u001b[${39}m`} = ${JSON.stringify(
                      rawPathToMsgArgValue,
                      null,
                      4
                    )}`
                  );
                  // console.log(
                  //   `523 ███████████████████████████████████████ ${`\u001b[${33}m${`exprStatements[i]`}\u001b[${39}m`} = ${stringify(
                  //     exprStatements[i],
                  //     null,
                  //     4
                  //   )}`
                  // );
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

                console.log(
                  `544 FIY, ${`\u001b[${33}m${`pathToMsgArgValue`}\u001b[${39}m`} = ${JSON.stringify(
                    pathToMsgArgValue,
                    null,
                    4
                  )}; ${`\u001b[${33}m${`pathToMsgArgStart`}\u001b[${39}m`} = ${JSON.stringify(
                    pathToMsgArgStart,
                    null,
                    4
                  )}`
                );

                const { start, end } =
                  prep(pathToMsgArgValue, {
                    offset: pathToMsgArgStart,
                    returnRangesOnly: true,
                  }) || {};

                if (!start || !end) {
                  console.log(
                    `563 ${`\u001b[${31}m${`SKIP`}\u001b[${39}m`} - no value extracted`
                  );
                  continue;
                }

                console.log(
                  `569 old: ${`\u001b[${35}m${pathToMsgArgValue}\u001b[${39}m`} (pathToMsgArgValue)`
                );
                console.log(
                  `572 old prepped value: ${`\u001b[${35}m${
                    prep(pathToMsgArgValue).value
                  }\u001b[${39}m`}`
                );

                const newValue = getNewValue(
                  subTestCount,
                  testOrderNumber,
                  counter2
                );

                // console.log(
                //   `584 newValue: ${`\u001b[${35}m${newValue}\u001b[${39}m`};\nrange: ${`\u001b[${35}m${`[${start}, ${end}]`}\u001b[${39}m`};\nrawPathToMsgArgValue: ${`\u001b[${35}m${rawPathToMsgArgValue}\u001b[${39}m`};\nprep(pathToMsgArgValue): ${`\u001b[${35}m${stringify(
                //     prep(pathToMsgArgValue)
                //   )}\u001b[${39}m`};\nstringify(prep(pathToMsgArgValue).value): ${`\u001b[${35}m${stringify(
                //     prep(pathToMsgArgValue).value
                //   )}\u001b[${39}m`};`
                // );

                if (
                  rawPathToMsgArgValue &&
                  prep(pathToMsgArgValue).value !== newValue
                ) {
                  console.log(
                    `596 ${`\u001b[${31}m${`MISMATCH!`}\u001b[${39}m`} reporting range [${start}, ${end}] to replace with a new value "${`\u001b[${35}m${newValue}\u001b[${39}m`}"`
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
                console.log(
                  `608 ${`\u001b[${31}m${`message argument missing from assertion!`}\u001b[${39}m`}`
                );

                // First, find out at which index position should message
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
                  console.log(
                    `639 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`positionDecided`}\u001b[${39}m`} = ${JSON.stringify(
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
                  console.log(
                    `654 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`positionDecided`}\u001b[${39}m`} = ${JSON.stringify(
                      positionDecided,
                      null,
                      4
                    )}`
                  );
                }

                console.log(
                  `663 ${`\u001b[${32}m${`FINAL`}\u001b[${39}m`} ${`\u001b[${33}m${`positionDecided`}\u001b[${39}m`} = ${JSON.stringify(
                    positionDecided,
                    null,
                    4
                  )}`
                );

                if (positionDecided) {
                  console.log(
                    `672 ${`\u001b[${32}m${`DECIDED!`}\u001b[${39}m`} We'll insert arg at position: ${`\u001b[${33}m${`positionDecided`}\u001b[${39}m`} = ${positionDecided}`
                  );

                  // insert the value
                  const positionToInsertAt =
                    // default parser, esprima
                    (op.get(exprStatements[i], "expression.end") ||
                      // custom parser for TS, @typescript-eslint/parser
                      op.get(exprStatements[i], "expression.range.1")) - 1;
                  console.log(
                    `682 ${`\u001b[${35}m${`██`}\u001b[${39}m`} positionToInsertAt = ${positionToInsertAt}`
                  );

                  const newValue = getNewValue(
                    subTestCount,
                    testOrderNumber,
                    counter2
                  );

                  // there might be whitespace, so comma we're about to add
                  // must sit on a different line!!!
                  const wholeSourceStr = context.getSourceCode().getText();
                  const endIdx = positionToInsertAt;

                  // left() finds the index of the first non-whitespace on the
                  // left, then we add +1 to not include it
                  const startIdx = (left(wholeSourceStr, endIdx) || 0) + 1;

                  console.log(
                    `701 SET ${`\u001b[${33}m${`startIdx`}\u001b[${39}m`} = ${JSON.stringify(
                      startIdx,
                      null,
                      4
                    )}`
                  );

                  let valueToInsert = `, "${newValue}"`;
                  if (
                    // if there's a linebreak between closing bracket inside
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

                    wholeSourceStr.slice(startIdx, endIdx).includes(`\n`)
                  ) {
                    console.log(`726 we've got a multi-line case`);
                    console.log(`727 slice [${startIdx}, ${endIdx}]`);

                    const frontalIndentation = Array.from(
                      wholeSourceStr.slice(startIdx, endIdx)
                    )
                      .filter((char) => !`\r\n`.includes(char as string))
                      .join("");
                    valueToInsert = `,\n${frontalIndentation}  "${newValue}"\n${frontalIndentation}`;
                  }

                  console.log(
                    `738 ${`\u001b[${32}m${`REPORT`}\u001b[${39}m`} ${JSON.stringify(
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
                  console.log(
                    `757 ${`\u001b[${31}m${`"positionDecided" not decided, skip!`}\u001b[${39}m`}`
                  );
                }
              }
            }
            console.log(
              `763 ${`\u001b[${90}m${`=================================`}\u001b[${39}m`}`
            );
          }
        }

        console.log(" ");

        if (finalDigitChunk.value) {
          console.log(
            `772 ${`\u001b[${31}m${`MISMATCH!`}\u001b[${39}m`} reporting range [${
              finalDigitChunk.start
            }, ${
              finalDigitChunk.end
            }] to replace with a new value "${`\u001b[${35}m${
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
