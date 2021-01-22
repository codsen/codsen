import { traverse } from "ast-monkey-traverse";

/**
 * Does AST contain only empty space?
 */
function empty(input: unknown): boolean {
  if (typeof input === "string") {
    console.log(`005 return ${!input.trim()}`);
    return !input.trim();
  }
  if (!["object", "string"].includes(typeof input) || !input) {
    console.log(`009 return false`);
    return false;
  }
  let found = true;
  console.log(`013 ${`\u001b[${36}m${`AST traversal!`}\u001b[${39}m`}`);
  input = traverse(input, (key, val, innerObj, stop) => {
    console.log(" ");
    console.log(
      `${`\u001b[${33}m${`innerObj`}\u001b[${39}m`} = ${JSON.stringify(
        innerObj,
        null,
        4
      )}`
    );
    console.log(
      `024 -------------------------------------- path: ${innerObj.path}`
    );
    const current = val !== undefined ? val : key;
    console.log(
      `${`\u001b[${33}m${`current`}\u001b[${39}m`} = ${JSON.stringify(
        current,
        null,
        4
      )}`
    );
    if (typeof current === "string" && current.trim()) {
      found = false;
      console.log(
        `037 found = false, ${`\u001b[${31}m${`stopping`}\u001b[${39}m`}`
      );
      stop.now = true;
    }
    return current;
  });
  console.log(`043 -------------------------------------- fin.`);

  console.log(`045 return ${found}`);
  return found;
}

export { empty };
