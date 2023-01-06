import op from "object-path";
import {
  stringify,
  containsNumber,
  pad,
  identifyAssertsMessageArgPos,
  Obj,
} from "./util";
import { TestType } from "./correct-test-num";

declare let DEV: boolean;

/**
 * Processes each assertion, for example:
 *
 *  equal(
      a(),
      `b`,
      "01.02"
    );
 *
 * @param node
 * @param testNumber correct test number for this assert (as global scope sees it)
 * @param assertionNumber assertion's order number (as global scope sees it)
 * * parameters use one-based numbering system
 */
export function processAssertion(
  context: Obj,
  node: Obj,
  testNumber: number,
  assertionNumber: number,
  type: TestType
) {
  DEV &&
    console.log(
      `036 ${`\u001b[${35}m${`████████████████████ processAssertion() start - ${testNumber}/${assertionNumber}`}\u001b[${39}m`}`
    );

  DEV &&
    console.log(
      `041 ${`\u001b[${32}m${`PROCESS`}\u001b[${39}m`} ${`\u001b[${33}m${`node`}\u001b[${39}m`} = ${stringify(
        node
      )}`
    );

  // ---------------------------------------------------------------------------

  // Task: we need to extract the "message" argument, string value,
  // plus its position indexes, for example:
  // t.is(a, "b", "00.09");
  //              ^^^^^^^
  //                this
  //
  // Challenge #1: we target multiple unit test runners (uvu and tap) where
  // both tests and asserts are different - uvu uses destructured asserts
  // like:
  // equal(a, "b", "00.09");
  // tap and ava uses "t" sub-methods:
  // t.is(a, "b", "00.09");
  //
  // we want to prevent false positives, other unrelated functions within
  // unit test's body, so it's imperative to check is it a real assert
  // function or not.

  // Challenge #2: the "message" argument string can be a string literal,
  // use straight quotes (double or single):
  //
  // equal(a, "b", "00.09");
  //               ^     ^
  //
  // but it can be a template literal, it can use backticks:
  //
  // equal(a, "b", `00.09`);
  //               ^     ^
  //
  // the AST is slightly different for each.

  let thirdArgVal: string | null = null;
  let rangePos: number[] | null = null;

  // for example, "is" from tap's "t.is" or "ok" from uvu's "ok":
  let extractedAssertsName = "";

  if (
    type === "tap" &&
    op.get(node, "expression.callee.object.name") === "t" &&
    op.has(node, "expression.callee.property.name")
  ) {
    extractedAssertsName = op.get(node, "expression.callee.property.name");
    DEV &&
      console.log(
        `092 process-assertion.ts: ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`extractedAssertsName`}\u001b[${39}m`} = ${JSON.stringify(
          extractedAssertsName,
          null,
          4
        )}`
      );
  }
  if (type === "uvu" && op.has(node, "expression.callee.name")) {
    extractedAssertsName = op.get(node, "expression.callee.name");
    DEV &&
      console.log(
        `103 process-assertion.ts: ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`extractedAssertsName`}\u001b[${39}m`} = ${JSON.stringify(
          extractedAssertsName,
          null,
          4
        )}`
      );
  }

  let correctAssertsMessageArgPos = "";

  if (extractedAssertsName) {
    correctAssertsMessageArgPos =
      identifyAssertsMessageArgPos(extractedAssertsName);
    DEV &&
      console.log(
        `118 process-assertion.ts: ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`correctAssertsMessageArgPos`}\u001b[${39}m`} = ${JSON.stringify(
          correctAssertsMessageArgPos,
          null,
          4
        )}`
      );
  }

  if (extractedAssertsName && correctAssertsMessageArgPos) {
    // finally, it depends, is this second/third "message" argument being of type "Literal"
    // (string wrapped straight quotes) or of a type "TemplateElement" (string wrapped with backticks)
    let msgArgVal = "";
    let msgArgRange = "";
    if (
      // if it's Literal
      op.get(
        node,
        `expression.arguments.${identifyAssertsMessageArgPos(
          extractedAssertsName
        )}.type`
      ) === "Literal"
    ) {
      // then grab the sibling path keys:
      msgArgVal = "value";
      msgArgRange = "range";
    } else if (
      // if it's template string, backticks
      op.get(
        node,
        `expression.arguments.${identifyAssertsMessageArgPos(
          extractedAssertsName
        )}.type`
      ) === "TemplateLiteral"
    ) {
      // then grab the sibling path keys:
      msgArgVal = "quasis.0.value.raw";
      msgArgRange = "quasis.0.range";
    }

    thirdArgVal = op.get(
      node,
      `expression.arguments.${identifyAssertsMessageArgPos(
        extractedAssertsName
      )}.${msgArgVal}`
    );
    rangePos = op.get(
      node,
      `expression.arguments.${identifyAssertsMessageArgPos(
        extractedAssertsName
      )}.${msgArgRange}`
    ) as number[];
  }

  // 1. if "message" arg is found but is incorrect,
  // for example, it's test with order number #1, but we have:
  // tap.test(
  //   `01 - k`,
  //   (t) => {
  //     t.is(a, "b", "00.09");
  //                   ^^^^^
  //                   should be "01.01"
  //     t.is(a, "b", `00.10`);
  //                   ^^^^^
  //                   should be "01.02"
  //   }
  // );

  if (
    typeof thirdArgVal === "string" &&
    Array.isArray(rangePos) &&
    // the first character is number
    containsNumber(thirdArgVal.trim()[0])
  ) {
    DEV && console.log(`191 process-assertion.ts:`);
    DEV &&
      console.log(
        `194 process-assertion.ts: ${`\u001b[${33}m${`thirdArgVal`}\u001b[${39}m`} = ${JSON.stringify(
          thirdArgVal,
          null,
          4
        )}; ${`\u001b[${33}m${`rangePos`}\u001b[${39}m`} = ${JSON.stringify(
          rangePos,
          null,
          0
        )}`
      );

    // distinguish cases:
    // equal(a(), "b", `61.${pad(n)}`);
    // from second-iteration (post-fix)
    // equal(a(), "b", `01.02.${pad(n)}`);
    // from
    // equal(a(), "b", "61.01");
    if (
      // checks for cases where straight single/double quotes
      // contain templating literal - in such case, value would
      // be inside one node, as opposed to usual backtick
      // templating literals which are split and "quasis" contain
      // their "heads" and "tails", where "heads" value would be
      // "61.", not followed by dollar and curly!
      !thirdArgVal.includes(".${") &&
      // test against templating literal with "quasis" containing
      // heads, "61."
      !/^\d+\.$/.test(thirdArgVal) &&
      // also, the post-fix, "01.02."
      !/^\d+\.\d+\.$/.test(thirdArgVal) &&
      // finally, the evaluation of the correctness:
      thirdArgVal !== `${pad(testNumber)}.${pad(assertionNumber)}`
    ) {
      DEV &&
        console.log(
          `229 process-assertion.ts: WRONG THIRD ARG ${thirdArgVal}! SHOULD BE ${`${pad(
            testNumber
          )}.${pad(assertionNumber)}`}`
        );

      DEV &&
        console.log(
          `236 process-assertion.ts: ${`\u001b[${32}m${`REPORT`}\u001b[${39}m`}`
        );

      let from = rangePos[0] + 1;
      let to = rangePos[1] - 1;

      context.report({
        messageId: "correctTestNum",
        node,
        fix: (fixerObj: Obj) => {
          return fixerObj.replaceTextRange(
            [from, to],
            `${pad(testNumber)}.${pad(assertionNumber)}`
          );
        },
      });
    } else if (
      // backtick test "message" argument:
      /^\d+\.$/.test(thirdArgVal) ||
      /^\d+\.\d+\.$/.test(thirdArgVal) ||
      // straight quotes "message" argument:
      thirdArgVal.includes(".${")
    ) {
      // used in looped asserts, for example,
      // equal(convertOne(``, opt), [[4, 5, "&rsquo;"]], "09.${pad(n)}");
      //                                                    ^^^^^^^^^^
      DEV &&
        console.log(
          `264 process-assertion.ts: ${`\u001b[${33}m${`thirdArgVal`}\u001b[${39}m`} = ${JSON.stringify(
            thirdArgVal,
            null,
            4
          )}`
        );

      let firstDotPosition = -1;

      if (thirdArgVal.includes(".${")) {
        // cut-off is where templating literal starts
        firstDotPosition = thirdArgVal.indexOf(".${");
        DEV &&
          console.log(
            `278 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`firstDotPosition`}\u001b[${39}m`} = ${JSON.stringify(
              firstDotPosition,
              null,
              4
            )}`
          );
      } else if (/^\d+\.$/.test(thirdArgVal)) {
        // cut-off at the first dot
        firstDotPosition = thirdArgVal.indexOf(".");
        DEV &&
          console.log(
            `289 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`firstDotPosition`}\u001b[${39}m`} = ${JSON.stringify(
              firstDotPosition,
              null,
              4
            )}`
          );
      }

      if (
        firstDotPosition !== -1 &&
        thirdArgVal.slice(0, firstDotPosition) !== pad(testNumber)
      ) {
        DEV &&
          console.log(
            `303 process-assertion.ts: ${thirdArgVal.slice(
              0,
              firstDotPosition
            )} !== ${pad(testNumber)}`
          );

        let from = rangePos[0] + 1;
        let to = from + firstDotPosition; // not "rangePos[1] - 1"
        let replacement = `${pad(testNumber)}.${pad(assertionNumber)}`;

        DEV &&
          console.log(
            `315 process-assertion.ts: ${`\u001b[${32}m${`REPORT`}\u001b[${39}m`} [${from}, ${to}], replacement: "${replacement}"`
          );

        context.report({
          messageId: "correctTestNum",
          node,
          fix: (fixerObj: Obj) => {
            return fixerObj.replaceTextRange([from, to], replacement);
          },
        });
      }
    }
  }
  // 2. if "message" arg is found but is incorrect,
  // for example, tap's t.is() message should go as 3rd arg
  // but it's missing:
  //
  // tap.test(
  //   `01 - k`,
  //   (t) => {
  //     t.is(a, "b");
  //                ^
  //     t.is(a, "b");
  //                ^
  //   }
  // );
  else if (
    // nothing was extracted:
    thirdArgVal === undefined &&
    // but we know what position the message should be in
    correctAssertsMessageArgPos &&
    // currently there are exactly "n-1" amount of args in
    // the expression (our assert, for example, "equal()"):
    op.get(node, "expression.arguments.length") === +correctAssertsMessageArgPos
  ) {
    DEV &&
      console.log(
        `352 process-assertion.ts: let's add a missing assert's "message" arg`
      );

    let positionToInsertMsg = op.get(
      node,
      `expression.arguments.${+correctAssertsMessageArgPos - 1}.range.1`
    );

    DEV &&
      console.log(
        `362 process-assertion.ts: ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`positionToInsertMsg`}\u001b[${39}m`} = ${JSON.stringify(
          positionToInsertMsg,
          null,
          4
        )}`
      );

    let replacement = `, "${pad(testNumber)}.${pad(assertionNumber)}"`;

    DEV &&
      console.log(
        `373 process-assertion.ts: ${`\u001b[${32}m${`REPORT`}\u001b[${39}m`} [${positionToInsertMsg}, ${positionToInsertMsg}], replacement: "${replacement}"`
      );

    context.report({
      messageId: "correctTestNum",
      node,
      fix: (fixerObj: Obj) => {
        return fixerObj.replaceTextRange(
          [positionToInsertMsg, positionToInsertMsg],
          replacement
        );
      },
    });
  }

  DEV &&
    console.log(
      `390 process-assertion.ts: ${`\u001b[${35}m${`████████████████████ processAssertion() end`}\u001b[${39}m`}`
    );
}
