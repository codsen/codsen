import op from "object-path";
import {
  //   stringify,
  Obj,
} from "./util";
import { extractNumPos, ExtractNumPosRes } from "./extract-num-positions";
import { TestType } from "./correct-test-num";

declare let DEV: boolean;

export interface ExtractTestNumRes {
  from: number;
  to: number;
  extracted: string;
  full: string;
}
export function extractTestNum(
  node: Obj,
  testType: TestType
): ExtractTestNumRes | null {
  DEV &&
    console.log(
      `023 ${`\u001b[${36}m${`████████████████████ extractTestNum() start`}\u001b[${39}m`}`
    );

  /* DEV &&
    console.log(
      `024 extract-test-num:  ███████████████████████████████████████ ${`\u001b[${33}m${`node`}\u001b[${39}m`} = ${stringify(
        node
      )}`
    ); */

  let full;
  let nodeFromPosition;

  if (testType === "uvu") {
    // if backticks, like:
    // test(`99`, (t) => {
    //      ^  ^

    if (
      op.get(node, "expression.arguments.0.type") === "TemplateLiteral" &&
      op.has(node, "expression.arguments.0.quasis.0.value.raw")
    ) {
      full = op.get(node, "expression.arguments.0.quasis.0.value.raw");

      nodeFromPosition = op.get(
        node,
        "expression.arguments.0.quasis.0.range.0"
      ) as number;
    }

    // if single or double quotes, like:
    // test("99", (t) => {
    //      ^  ^
    if (
      op.get(node, "expression.arguments.0.type") === "Literal" &&
      op.has(node, "expression.arguments.0.value") &&
      op.has(node, "expression.arguments.0.range.0")
    ) {
      full = op.get(node, "expression.arguments.0.value");

      // starting and ending position of the AST node of the first arg,
      // test("10 - a", () => {
      //      ^^^^^^^^
      // PS. position indexes will include quotes!
      nodeFromPosition = op.get(
        node,
        "expression.arguments.0.range.0"
      ) as number;
    }
  } else if (testType === "tap") {
    // if backticks, like:
    // tap.test(`99`, (t) => {
    //          ^  ^

    if (
      op.get(node, "expression.arguments.0.type") === "TemplateLiteral" &&
      op.has(node, "expression.arguments.0.quasis.0.value.raw") &&
      op.has(node, "expression.arguments.0.quasis.0.range.0")
    ) {
      full = op.get(node, "expression.arguments.0.quasis.0.value.raw");

      nodeFromPosition = op.get(
        node,
        "expression.arguments.0.quasis.0.range.0"
      ) as number;
    }

    // if single or double quotes, like:
    // tap.test("99", (t) => {
    //          ^  ^
    if (
      op.get(node, "expression.arguments.0.type") === "Literal" &&
      op.has(node, "expression.arguments.0.value") &&
      op.has(node, "expression.arguments.0.range.0")
    ) {
      full = op.get(node, "expression.arguments.0.value");

      // starting and ending position of the AST node of the first arg,
      // test("10 - a", () => {
      //      ^^^^^^^^
      // PS. position indexes will include quotes!
      nodeFromPosition = op.get(
        node,
        "expression.arguments.0.range.0"
      ) as number;
    }
  }

  // ---------------------------------------------------------------------------

  // The universal logic part:
  if (full && nodeFromPosition) {
    let extractedNumberPositions: ExtractNumPosRes | null = extractNumPos(
      full,
      nodeFromPosition + 1
    );
    if (!extractedNumberPositions) {
      DEV &&
        console.log(
          `122 extract-test-num: ${`\u001b[${31}m${`early exit`}\u001b[${39}m`}`
        );
      return null;
    }

    let { from, to, extracted } = extractedNumberPositions;

    DEV &&
      console.log(
        `131 extract-test-num: ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} ${JSON.stringify(
          {
            from,
            to,
            extracted,
            full,
          },
          null,
          4
        )}`
      );
    return {
      from,
      to,
      extracted,
      full,
    };
  }

  return null;
}
