/* eslint @typescript-eslint/explicit-module-boundary-types: 0 */

import { isPlainObject } from "codsen-utils";
import { version as v } from "../package.json";

const version: string = v;
const hexColorRegex = /#(?:[a-f0-9]{3}|[a-f0-9]{4}(?:[a-f0-9]{2}){0,2})\b/gi;

function isWhitespace(input: string, index: number): boolean {
  const code = input.charCodeAt(index);
  if (code === 32 || (code >= 9 && code <= 13)) {
    return true;
  }
  return code > 127 && !input[index].trim();
}

function canBeAttributeNameCharacter(character: string): boolean {
  const code = character.charCodeAt(0);
  return (
    character === "-" ||
    character === ":" ||
    (code >= 65 && code <= 90) ||
    (code >= 97 && code <= 122)
  );
}

function isReferenceContext(input: string, offset: number): boolean {
  let index = offset - 1;

  while (isWhitespace(input, index)) {
    index -= 1;
  }
  if (input[index] === '"' || input[index] === "'") {
    index -= 1;
    while (isWhitespace(input, index)) {
      index -= 1;
    }
  }

  if (input[index] === "(") {
    index -= 1;
    while (isWhitespace(input, index)) {
      index -= 1;
    }
    return (
      input.slice(Math.max(0, index - 2), index + 1).toLowerCase() === "url"
    );
  }

  if (input[index] === "=") {
    index -= 1;
    while (isWhitespace(input, index)) {
      index -= 1;
    }
    const attributeEnds = index + 1;
    while (index >= 0 && canBeAttributeNameCharacter(input[index])) {
      index -= 1;
    }
    const attribute = input.slice(index + 1, attributeEnds).toLowerCase();
    return attribute === "href" || attribute === "xlink:href";
  }

  return false;
}

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

function isLikelySelector(input: string, index: number): boolean {
  let quote = "";
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
    ((previous === '"' ||
      previous === "'" ||
      previous === "(" ||
      previous === "=" ||
      isWhitespace(string, offset - 1)) &&
      isReferenceContext(string, offset)) ||
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

/**
 * Convert shorthand hex color codes into full
 */
function conv(input: any): any {
  if (
    typeof input !== "string" &&
    !Array.isArray(input) &&
    !isPlainObject(input)
  ) {
    return input;
  }

  // action
  // ====================

  if (typeof input === "string") {
    return input.replace(hexColorRegex, toFullHex);
  }
  if (Array.isArray(input)) {
    return input.map(conv);
  }
  if (isPlainObject(input)) {
    let result: Record<string, any> = {};
    for (const key of Object.keys(input)) {
      result[key] = conv(input[key]);
    }
    return result;
  }
  return input;
}

export { conv, version };
