import { version as v } from "../package.json";

const version: string = v;

declare let DEV: boolean;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value == null || typeof value !== "object") {
    return false;
  }
  let proto = Object.getPrototypeOf(value);
  if (
    proto !== null &&
    proto !== Object.prototype &&
    Object.getPrototypeOf(proto) !== null
  ) {
    return false;
  }
  return !(Symbol.iterator in value) && !(Symbol.toStringTag in value);
}

function containsOnlyWhitespace(value: unknown): boolean {
  if (typeof value === "string") {
    return !value.trim();
  }
  if (Array.isArray(value)) {
    for (let item of value) {
      if (!containsOnlyWhitespace(item)) {
        return false;
      }
    }
  } else if (isPlainObject(value)) {
    for (let key of Object.keys(value)) {
      if (!containsOnlyWhitespace(value[key])) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Does AST contain only empty space?
 */
function empty(input: unknown): boolean {
  if (typeof input === "string") {
    DEV && console.log(`return ${!input.trim()}`);
    return !input.trim();
  }
  if (typeof input !== "object" || !input) {
    DEV && console.log(`return false`);
    return false;
  }
  DEV && console.log(`${`\u001b[${36}m${`AST traversal!`}\u001b[${39}m`}`);
  let result = containsOnlyWhitespace(input);
  DEV && console.log(`return ${result}`);
  return result;
}

export { empty, version };
