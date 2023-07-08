import op from "object-path";
import { processBlockStatement } from "./process-block-statement";
import { processTestsFirstArg } from "./process-tests-first-arg";
import { extractTestNum } from "./extract-test-num";
import {
  //   stringify,
  Obj,
} from "./util";
import { isUvu } from "./is-uvu";
import { isTap } from "./is-tap";

export type TestType = "uvu" | "tap";

declare let DEV: boolean;

const create = (context: Obj): Obj => {
  DEV && console.log(`\n`.repeat(20));
  DEV &&
    console.log(
      `020 correct-test-num.ts: ${`\u001b[${33}m${`████████████████████ create() start`}\u001b[${39}m`}`,
    );

  let counter = 0;

  // DEV &&
  //   console.log(
  //     `${`\u001b[${33}m${`context`}\u001b[${39}m`} = ${stringify(context)}`
  //   );

  return {
    ExpressionStatement(node: Obj) {
      let isUvuTest = isUvu(node);
      let isTapTest = isTap(node);
      DEV &&
        console.log(
          `036 correct-test-num: ${`\u001b[${33}m${`isUvuTest`}\u001b[${39}m`} = ${JSON.stringify(
            isUvuTest,
            null,
            4,
          )}; ${`\u001b[${33}m${`isTapTest`}\u001b[${39}m`} = ${JSON.stringify(
            isTapTest,
            null,
            4,
          )}`,
        );

      // Asserts within test would also trigger this, so we need
      // to ensure to "listen" to only top-level "test" function
      // nodes (esprima AST's expression statements)
      if (!isUvuTest && !isTapTest) {
        DEV &&
          console.log(
            `053 correct-test-num.ts: ${`\u001b[${31}m${`early return`}\u001b[${39}m`}`,
          );
        return;
      }

      DEV &&
        console.log(
          `060 correct-test-num.ts: ${`\u001b[${33}m${`██`}\u001b[${39}m`} ExpressionStatement() start`,
        );

      /* DEV &&
        console.log(
          `043 correct-test-num.ts: ${`\u001b[${33}m${`node`}\u001b[${39}m`} = ${stringify(
            node
          )}`
        ); */

      // let wholeSourceStr = context.getSourceCode().getText();
      // DEV &&
      //   console.log(
      //     `030 ${`\u001b[${33}m${`wholeSourceStr`}\u001b[${39}m`} = ${stringify(
      //       wholeSourceStr
      //     )}`
      //   );

      /*if (
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
        processExpression(context, node, ++counter);
      }*/

      // 0 - increment test number counter
      // ----------------------------------------------------

      counter++;
      DEV &&
        console.log(
          `099 correct-test-num.ts: ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`counter`}\u001b[${39}m`} = ${JSON.stringify(
            counter,
            null,
            4,
          )}`,
        );

      // 1 - check the number in front of the test name
      // ----------------------------------------------------

      // 1.1 uvu
      //
      // test("10 - a", () => {
      //       ^^
      //      this
      //
      if (isUvuTest) {
        processTestsFirstArg(
          context,
          node,
          extractTestNum(node, "uvu"),
          counter,
        );
      } else if (isTapTest) {
        processTestsFirstArg(
          context,
          node,
          extractTestNum(node, "tap"),
          counter,
        );
      }

      // 2. check each assert's message argument (typically 3rd)
      // ----------------------------------------------------

      // 2.1. uvu
      //
      // test("10 - a", () => {
      //   equal(
      //     extract({}),
      //     {},
      //     "01.01"
      //      ^^^^^
      //      this
      //   );
      // });
      //
      if (isUvuTest) {
        processBlockStatement(
          context,
          op.get(node, "expression.arguments.1.body.body"),
          counter,
          "uvu",
        );
      } else if (isTapTest) {
        processBlockStatement(
          context,
          op.get(node, "expression.arguments.1.body.body"),
          counter,
          "tap",
        );
      }

      // ----------------------------------------------------

      DEV &&
        console.log(
          `166 correct-test-num.ts: ${`\u001b[${33}m${`██`}\u001b[${39}m`} ExpressionStatement() end`,
        );
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
