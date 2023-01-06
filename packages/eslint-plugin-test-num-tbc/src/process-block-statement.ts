import { Obj } from "./util";
import { extractAllTestAsserts } from "./extract-all-test-asserts";
import { processAssertion } from "./process-assertion";
import { TestType } from "./correct-test-num";

declare let DEV: boolean;

/**
 * Processes each test(`??`, () => {...}) expression's block statement,
 * test(`??`, () => {...})
 *                  ^^^^^
 *                 from curly to curly brace
 *
 * @param node AST node from eslint
 * @param testNumber the correct frontal part of each test description
 * * numeric parameters use one-based numbering system
 */
export function processBlockStatement(
  context: Obj,
  nodes: Obj[],
  testNumber: number,
  type: TestType
) {
  DEV &&
    console.log(
      `026 ${`\u001b[${34}m${`████████████████████ processBlockStatement() start - testNumber ${testNumber}`}\u001b[${39}m`}`
    );

  // 1. check the presence (and correctness) of each assert's message,
  //
  // equal(
  //   foo(),
  //   "bar",
  //   "01" // <--- this
  // );
  //
  extractAllTestAsserts(nodes, type).forEach(
    (testAssert: Obj, testAssertIdx: number) => {
      processAssertion(
        context,
        testAssert,
        testNumber,
        testAssertIdx + 1,
        type
      );
    }
  );

  DEV &&
    console.log(
      `051 ${`\u001b[${32}m${`████████████████████ extractAllTestAsserts() end`}\u001b[${39}m`}`
    );

  DEV &&
    console.log(
      `056 ${`\u001b[${34}m${`████████████████████ processBlockStatement() end`}\u001b[${39}m`}`
    );
}
