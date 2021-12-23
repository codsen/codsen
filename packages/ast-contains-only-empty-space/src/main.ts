import { traverse } from "ast-monkey-traverse";

declare let DEV: boolean;

/**
 * Does AST contain only empty space?
 */
function empty(input: unknown): boolean {
  if (typeof input === "string") {
    DEV && console.log(`010 return ${!input.trim()}`);
    return !input.trim();
  }
  if (!["object", "string"].includes(typeof input) || !input) {
    DEV && console.log(`014 return false`);
    return false;
  }
  let found = true;
  DEV && console.log(`018 ${`\u001b[${36}m${`AST traversal!`}\u001b[${39}m`}`);
  input = traverse(input, (key, val, innerObj, stop) => {
    DEV && console.log(" ");
    DEV &&
      console.log(
        `${`\u001b[${33}m${`innerObj`}\u001b[${39}m`} = ${JSON.stringify(
          innerObj,
          null,
          4
        )}`
      );
    DEV &&
      console.log(
        `031 -------------------------------------- path: ${innerObj.path}`
      );
    let current = val !== undefined ? val : key;
    DEV &&
      console.log(
        `${`\u001b[${33}m${`current`}\u001b[${39}m`} = ${JSON.stringify(
          current,
          null,
          4
        )}`
      );
    if (typeof current === "string" && current.trim()) {
      found = false;
      DEV &&
        console.log(
          `046 found = false, ${`\u001b[${31}m${`stopping`}\u001b[${39}m`}`
        );
      stop.now = true;
    }
    return current;
  });
  DEV && console.log(`052 -------------------------------------- fin.`);

  DEV && console.log(`054 return ${found}`);
  return found;
}

export { empty };
