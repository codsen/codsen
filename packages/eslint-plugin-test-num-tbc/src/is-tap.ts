import op from "object-path";
import {
  // stringify,
  Obj,
} from "./util";

// declare let DEV: boolean;

/**
 * Detects tap expression tap.test() statements, for example
 *
 * tap.test("10 - a", () => {...
 *
 * @param node
 * @returns boolean
 */
export function isTap(node: Obj): boolean {
  /* DEV && console.log(`018 is-tap: ${`\u001b[${33}m${`node`}\u001b[${39}m`} = ${stringify(node)}`) */

  return (
    !!node &&
    op.get(node, "expression.type") === "CallExpression" &&
    op.has(node, "expression.arguments.1.body.body") &&
    // either tap.*(), also likes of test.skip()
    (["tap", "test"].includes(op.get(node, "expression.callee.object.name")) ||
      // or *.test()
      op.get(node, "expression.callee.property.name") === "test")
  );
}
