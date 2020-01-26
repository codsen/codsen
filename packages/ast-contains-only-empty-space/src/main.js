import traverse from "ast-monkey-traverse";

function containsOnlyEmptySpace(input) {
  if (!input || !["object", "string"].includes(typeof input)) {
    return false;
  } else if (typeof input === "string") {
    return !input.trim().length;
  }
  let found = true;
  input = traverse(input, (key, val, innerObj, stop) => {
    const current = val !== undefined ? val : key;
    if (typeof current === "string" && current.trim().length) {
      found = false;
      stop.now = true;
    }
    return current;
  });

  return found;
}

export default containsOnlyEmptySpace;
