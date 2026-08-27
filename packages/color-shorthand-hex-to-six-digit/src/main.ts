/* eslint @typescript-eslint/explicit-module-boundary-types: 0 */

import { isPlainObject } from "codsen-utils";
import { version as v } from "../package.json";

const version: string = v;
const hexColorRegex = /#(?:[a-f0-9]{3}|[a-f0-9]{4}(?:[a-f0-9]{2}){0,2})\b/gi;

export type Converted<Input> = Input extends string
  ? string
  : Input extends (...arguments_: never[]) => unknown
    ? Input
    : Input extends abstract new (
          ...arguments_: never[]
        ) => unknown
      ? Input
      : Input extends readonly unknown[]
        ? { [Key in keyof Input]: Converted<Input[Key]> }
        : Input extends object
          ? {
              [Key in keyof Input]: Converted<Input[Key]>;
            }
          : Input;

function isCssIdentifierContinuation(input: string, index: number): boolean {
  const character = input[index];
  const code = input.charCodeAt(index);
  return (
    character === "-" ||
    character === "_" ||
    character === "\\" ||
    (code >= 48 && code <= 57) ||
    (code >= 65 && code <= 90) ||
    (code >= 97 && code <= 122) ||
    code >= 0x80
  );
}

function isCssResourceContext(input: string, offset: number): boolean {
  const functionStack: string[] = [];
  let index = 0;
  let quote = "";
  while (index < offset) {
    const character = input[index];
    if (quote) {
      if (character === "\\") {
        index += 2;
        continue;
      }
      if (character === quote) {
        quote = "";
      }
      index += 1;
      continue;
    }
    if (character === '"' || character === "'") {
      quote = character;
      index += 1;
      continue;
    }
    if (character === "/" && input[index + 1] === "*") {
      const commentEnds = input.indexOf("*/", index + 2);
      if (commentEnds === -1 || commentEnds >= offset) {
        break;
      }
      index = commentEnds + 2;
      continue;
    }
    if (character === "\\") {
      index += 2;
      continue;
    }
    if (character === "(") {
      let functionStarts = index;
      while (
        functionStarts > 0 &&
        isCssIdentifierContinuation(input, functionStarts - 1)
      ) {
        functionStarts -= 1;
      }
      functionStack.push(input.slice(functionStarts, index).toLowerCase());
    } else if (character === ")") {
      functionStack.pop();
    }
    index += 1;
  }

  return functionStack.some((name) => name === "url" || name === "src");
}

function isHtmlReferenceContext(input: string, offset: number): boolean {
  const tagStarts = input.lastIndexOf("<", offset);
  if (tagStarts <= input.lastIndexOf(">", offset)) {
    return false;
  }
  const tagPrefix = input.slice(tagStarts + 1, offset);
  return (
    /(?:^|\s)(?:href|xlink:href)\s*=\s*"[^"]*$/i.test(tagPrefix) ||
    /(?:^|\s)(?:href|xlink:href)\s*=\s*'[^']*$/i.test(tagPrefix) ||
    /(?:^|\s)(?:href|xlink:href)\s*=\s*[^\s"'=<>`]*$/i.test(tagPrefix)
  );
}

function isReferenceContext(input: string, offset: number): boolean {
  return (
    isCssResourceContext(input, offset) || isHtmlReferenceContext(input, offset)
  );
}

function isLikelySelector(input: string, index: number): boolean {
  let quote = "";
  let prefixIndex = 0;
  while (prefixIndex < index) {
    const character = input[prefixIndex];
    if (quote) {
      if (character === "\\") {
        prefixIndex += 2;
        continue;
      }
      if (character === quote) {
        quote = "";
      }
      prefixIndex += 1;
      continue;
    }
    if (character === '"' || character === "'") {
      quote = character;
      prefixIndex += 1;
      continue;
    }
    if (character === "/" && input[prefixIndex + 1] === "*") {
      const commentEnds = input.indexOf("*/", prefixIndex + 2);
      if (commentEnds === -1 || commentEnds >= index) {
        return false;
      }
      prefixIndex = commentEnds + 2;
      continue;
    }
    prefixIndex += 1;
  }
  while (index < input.length) {
    const character = input[index];
    if (quote) {
      if (character === "\\") {
        index += 2;
        continue;
      }
      if (character === quote) {
        quote = "";
      }
      index += 1;
      continue;
    }
    if (character === '"' || character === "'") {
      quote = character;
      index += 1;
      continue;
    }
    if (character === "/" && input[index + 1] === "*") {
      const commentEnds = input.indexOf("*/", index + 2);
      if (commentEnds === -1) {
        return false;
      }
      index = commentEnds + 2;
      continue;
    }
    if (character === "{" || character === "}" || character === ";") {
      return character === "{";
    }
    index += 1;
  }
  return false;
}

function toFullHex(hex: string, offset: number, string: string): string {
  const matchEnds = offset + hex.length;
  const previous = string[offset - 1];
  if (
    previous === "&" || // consider false positives like &#124;
    isCssIdentifierContinuation(string, matchEnds) ||
    isReferenceContext(string, offset) ||
    isLikelySelector(string, matchEnds)
  ) {
    return hex;
  }
  if (hex.length === 4) {
    const red = hex[1].toLowerCase();
    const green = hex[2].toLowerCase();
    const blue = hex[3].toLowerCase();
    return `#${red}${red}${green}${green}${blue}${blue}`;
  }
  return hex.toLowerCase();
}

function setOwnEnumerableValue(
  target: Record<PropertyKey, unknown>,
  key: PropertyKey,
  value: unknown,
): void {
  if (key === "__proto__") {
    Object.defineProperty(target, key, {
      configurable: true,
      enumerable: true,
      value,
      writable: true,
    });
  } else {
    target[key] = value;
  }
}

function convertValue(
  input: unknown,
  converted: WeakMap<object, object>,
): unknown {
  if (typeof input === "string") {
    return input.replace(hexColorRegex, toFullHex);
  }
  if (Array.isArray(input)) {
    const existingResult = converted.get(input);
    if (existingResult !== undefined) {
      return existingResult;
    }
    const result: unknown[] = new Array(input.length);
    converted.set(input, result);
    for (let index = 0; index < input.length; index += 1) {
      if (index in input) {
        result[index] = convertValue(input[index], converted);
      }
    }
    return result;
  }
  if (isPlainObject(input)) {
    const existingResult = converted.get(input);
    if (existingResult !== undefined) {
      return existingResult;
    }
    const result: Record<PropertyKey, unknown> = Object.create(
      Object.getPrototypeOf(input),
    );
    converted.set(input, result);
    for (const key of Reflect.ownKeys(input)) {
      if (Object.prototype.propertyIsEnumerable.call(input, key)) {
        setOwnEnumerableValue(result, key, convertValue(input[key], converted));
      }
    }
    return result;
  }
  return input;
}

/**
 * Convert shorthand hex color codes into full
 */
function conv(): undefined;
function conv<Input>(input: Input): Converted<Input>;
function conv(input?: unknown): unknown {
  return convertValue(input, new WeakMap<object, object>());
}

export { conv, version };
