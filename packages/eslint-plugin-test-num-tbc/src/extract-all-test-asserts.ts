import op from "object-path";
import { TestType } from "./correct-test-num";
import { stringify, Obj, uvuAsserts } from "./util";

declare let DEV: boolean;

/**
 * Extracts all asserts, for example, takes this chunk, curly-to-curly:
 *
  ...{
    mixer({}).forEach((opt, n) => {
      equal(
        a(),
        `b`,
        "88.88"
      );
    });
    mixer({}).forEach((opt, n) => {
      equal(
        a(),
        `b`,
        "99.99"
      );
    });
  }
 *
 * and produces an array with those two equal() expression statement nodes
 * @param node parent expression
 * @returns array of zero or more extracted unit test assertion expression statements
 */
export function extractAllTestAsserts(nodes: Obj[], type: TestType): Obj[] {
  DEV &&
    console.log(
      `034 ${`\u001b[${32}m${`████████████████████ extractAllTestAsserts() start`}\u001b[${39}m`}`
    );

  DEV &&
    console.log(
      `${`\u001b[${33}m${`nodes`}\u001b[${39}m`} = ${stringify(nodes)}`
    );

  return nodes.reduce<Obj[]>((acc, curr) => {
    // DEV &&
    //   console.log(
    //     `${`\u001b[${33}m${`curr`}\u001b[${39}m`} = ${stringify(curr)}`
    //   );

    // 1. if it's a test mixer(), for example,
    //
    // mixer({}).forEach((opt, n) => {
    //   equal(
    //     a(),
    //     `b`,
    //     "88.88"
    //   );
    // });
    //
    // then recursively process all its children expressions
    // (code between curly braces)
    if (
      op.get(curr, "expression.callee.object.callee.name") === "mixer" &&
      Array.isArray(op.get(curr, "expression.arguments.0.body.body"))
    ) {
      DEV && console.log(`064 extract-all-test-asserts.ts: recursion`);
      return acc.concat(
        extractAllTestAsserts(
          op.get(curr, "expression.arguments.0.body.body"),
          type
        )
      );
    }

    // 2. if it's equal(), for example,
    //
    // equal(
    //   a(),
    //   `b`,
    //   "88.88"
    // );
    //
    // then grab it

    DEV &&
      console.log(
        `${`\u001b[${33}m${`type`}\u001b[${39}m`} = ${JSON.stringify(
          type,
          null,
          4
        )}`
      );

    DEV &&
      console.log(
        `${`\u001b[${33}m${`op.get(curr, "expression.callee.name")`}\u001b[${39}m`} = ${JSON.stringify(
          op.get(curr, "expression.callee.name"),
          null,
          4
        )}`
      );

    if (
      (type === "uvu" &&
        curr.type === "ExpressionStatement" &&
        uvuAsserts.has(op.get(curr, "expression.callee.name"))) ||
      (type === "tap" &&
        curr.type === "ExpressionStatement" &&
        op.get(curr, "expression.callee.object.name") === "t")
    ) {
      DEV && console.log(`109 extract-all-test-asserts.ts: uvu assert caught`);
      return acc.concat([curr]);
    }
    return acc;
  }, []);
}
