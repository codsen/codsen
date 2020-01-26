import traverse from "ast-monkey-traverse";

function containsOnlyEmptySpace(input) {
  if (typeof input === "string") {
    console.log(`005 return ${!input.trim().length}`);
    return !input.trim().length;
  } else if (!["object", "string"].includes(typeof input) || !input) {
    console.log(`008 return false`);
    return false;
  }
  let found = true;
  console.log(`012 ${`\u001b[${36}m${`AST traversal!`}\u001b[${39}m`}`);
  input = traverse(input, (key, val, innerObj, stop) => {
    const current = val !== undefined ? val : key;
    if (typeof current === "string" && current.trim().length) {
      found = false;
      console.log(
        `018 found = false, ${`\u001b[${31}m${`stopping`}\u001b[${39}m`}`
      );
      stop.now = true;
    }
    return current;
  });

  console.log(`025 return ${found}`);
  return found;
}

export default containsOnlyEmptySpace;
