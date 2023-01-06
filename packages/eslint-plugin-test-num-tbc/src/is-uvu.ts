import op from "object-path";
import { stringify, Obj } from "./util";

declare let DEV: boolean;

/**
 * Detects uvu expression test() statements, for example
 *
 * test("10 - a", () => {...
 *
 * @param node
 * @returns boolean
 */
export function isUvu(node: Obj): boolean {
  DEV &&
    console.log(
      `017 is-uvu.ts: ${`\u001b[${33}m${`isUvu()`}\u001b[${39}m`} called`
    );

  DEV &&
    console.log(
      `${`\u001b[${33}m${`node`}\u001b[${39}m`} = ${stringify(node)}`
    );

  return (
    !!node &&
    op.get(node, "expression.type") === "CallExpression" &&
    // test()
    (op.get(node, "expression.callee.name") === "test" ||
      // or test.skip() or test.only()
      (op.get(node, "expression.callee.type") === "MemberExpression" &&
        op.get(node, "expression.callee.object.name") === "test")) &&
    op.has(node, "expression.arguments.1.body.body")
  );
}
