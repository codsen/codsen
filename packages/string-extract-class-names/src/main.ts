import { formatDiagnosticValue } from "codsen-utils";
import { left, right } from "string-left-right";
import type { Ranges } from "../../../ops/typedefs/common";

import { version as v } from "../package.json";

const version: string = v;

declare let DEV: boolean;

export interface Result {
  res: string[];
  ranges: Ranges;
}

/**
 * Extract raw CSS class and ID selector spellings from a selector fragment.
 *
 * In addition to dot and hash selectors, this function recognises HTML-style
 * `[class=...]`, `[class~=...]`, and `[id=...]` attribute selectors. Attribute
 * names are ASCII-case-insensitive. Values can use CSS identifier or string
 * syntax, and an exact class string can contain multiple HTML class tokens.
 * Partial-match attribute operators do not produce selectors.
 */
function extract(str: string): Result {
  // insurance
  // =========
  if (typeof str !== "string") {
    throw new TypeError(
      `string-extract-class-names/extract(): [THROW_ID_01] first str should be string, not ${typeof str}, currently equal to ${formatDiagnosticValue(str, 4)}`,
    );
  }

  let badChars = selectorBreakCharacters;

  // action
  // ======

  let selectorStartsAt = null;
  let result: Result = {
    res: [],
    ranges: [],
  };

  // we iterate upto and including str.length - last element will be undefined
  // at cost of extra protective clauses (if not undefined) we simplify the
  // algorithm ending clauses - things' ending at string's end can now be
  // tackled in the same logic as things' that end in the middle of the string
  for (let i = 0, len = str.length; i <= len; i++) {
    DEV &&
      console.log(
        `${`\u001b[${36}m${`============================`}\u001b[${39}m`} ${`\u001b[${33}m${str[i]}\u001b[${39}m`} (${`\u001b[${31}m${i}\u001b[${39}m`})`,
      );

    // A CSS escape is part of the current identifier. Skipping its complete
    // raw spelling also prevents an escaped dot or hash from being mistaken
    // for the beginning of another selector.
    if (str[i] === "\\") {
      let escapeEndsAt = cssEscapeEndsAt(str, i);
      if (escapeEndsAt !== null) {
        i = escapeEndsAt - 1;
        continue;
      }
    }

    // catch the ending of a selector's name:

    if (
      selectorStartsAt !== null &&
      i >= selectorStartsAt &&
      // and...
      // either the end of string has been reached
      // or it's CSS whitespace
      (selectorCharacterIsBoundary(str[i]) ||
        // or it's a character, unsuitable for class/id names; kept separate
        // to preserve the original extraction rules
        badChars.includes(str[i]))
    ) {
      // if selector is more than dot or hash:
      if (i > selectorStartsAt + 1) {
        // If we reached the last character and selector's beginning has not been
        // interrupted, extend the slice's ending by 1 character. If we terminate
        // the selector because of illegal character, slice right here, at index "i".
        (result.ranges as [from: number, to: number][]).push([
          selectorStartsAt,
          i,
        ]);
        result.res.push(str.slice(selectorStartsAt, i));
      }
      selectorStartsAt = null;
      DEV &&
        console.log(
          `${`\u001b[${33}m${`selectorStartsAt`}\u001b[${39}m`} = null`,
        );
    }

    // catch dot or hash:
    if (
      str[i] &&
      selectorStartsAt === null &&
      (str[i] === "." || str[i] === "#")
    ) {
      selectorStartsAt = i;
      DEV &&
        console.log(
          `SET ${`\u001b[${33}m${`selectorStartsAt`}\u001b[${39}m`} = ${selectorStartsAt}`,
        );
    }

    // catch zzz[class=]
    let temp1 = right(str, i + 4);
    if (
      str.slice(i, i + 5).toLowerCase() === "class" &&
      attributeNameCanEnd(str[i + 5]) &&
      typeof left(str, i) === "number" &&
      str[left(str, i) as number] === "["
    ) {
      let attribute = readAttributeSelector(str, i, ".", temp1);
      if (attribute !== null) {
        for (let selector of attribute.selectors) {
          result.res.push(`.${selector.raw}`);
          (result.ranges as [from: number, to: number][]).push(selector.range);
        }
        i = attribute.closeAt;
        continue;
      }
    }

    // catch zzz[id=]
    let temp2 = right(str, i + 1);
    if (
      str.slice(i, i + 2).toLowerCase() === "id" &&
      attributeNameCanEnd(str[i + 2]) &&
      str[left(str, i) as number] === "["
    ) {
      let attribute = readAttributeSelector(str, i, "#", temp2);
      if (attribute !== null) {
        for (let selector of attribute.selectors) {
          result.res.push(`#${selector.raw}`);
          (result.ranges as [from: number, to: number][]).push(selector.range);
        }
        i = attribute.closeAt;
        continue;
      }
    }

    DEV &&
      console.log(
        `\u001b[${90}m${`ended with: selectorStartsAt = ${selectorStartsAt}; result = ${JSON.stringify(
          result,
          null,
          0,
        )}`}\u001b[${39}m`,
      );
  }

  // absence of ranges is falsy "null", not truthy empty array, so
  // if nothing was extracted and empty array is in result.ranges,
  // overwrite it to falsy "null"
  if (!(result.ranges as any[]).length) {
    result.ranges = null;
  }

  return result;
}

export interface CssSelectorToken {
  value: string;
  raw: string;
  range: [from: number, to: number];
}

const selectorBreakCharacters = `.# ~\\!@$%^&*()+=,/';:"?><[]{}|\``;

function isCssHexDigit(char: string | undefined): boolean {
  return char !== undefined && /^[\dA-Fa-f]$/.test(char);
}

function isCssWhitespace(char: string | undefined): boolean {
  return char !== undefined && " \n\r\t\f".includes(char);
}

function isCssNewline(char: string | undefined): boolean {
  return char !== undefined && "\n\r\f".includes(char);
}

interface CssCodePoint {
  codePoint: number;
  rawLength: number;
  value: string;
}

function cssCodePointAt(str: string, start: number): CssCodePoint | null {
  let first = str.charCodeAt(start);
  if (Number.isNaN(first)) {
    return null;
  }

  if (first === 0 || (first >= 0xdc00 && first <= 0xdfff)) {
    return { codePoint: 0xfffd, rawLength: 1, value: "\uFFFD" };
  }

  if (first >= 0xd800 && first <= 0xdbff) {
    let second = str.charCodeAt(start + 1);
    if (second >= 0xdc00 && second <= 0xdfff) {
      return {
        codePoint: Number(str.codePointAt(start)),
        rawLength: 2,
        value: str.slice(start, start + 2),
      };
    }
    return { codePoint: 0xfffd, rawLength: 1, value: "\uFFFD" };
  }

  return { codePoint: first, rawLength: 1, value: str[start] };
}

function isCssNameStartCodePoint(codePoint: number): boolean {
  return (
    codePoint === 0x5f ||
    (codePoint >= 0x41 && codePoint <= 0x5a) ||
    (codePoint >= 0x61 && codePoint <= 0x7a) ||
    codePoint >= 0x80
  );
}

function isCssNameCodePoint(codePoint: number): boolean {
  return (
    isCssNameStartCodePoint(codePoint) ||
    codePoint === 0x2d ||
    (codePoint >= 0x30 && codePoint <= 0x39)
  );
}

function startsValidCssEscape(str: string, start: number): boolean {
  return str[start] === "\\" && !isCssNewline(str[start + 1]);
}

function wouldStartCssIdentSequence(str: string, start: number): boolean {
  let first = cssCodePointAt(str, start);
  if (first === null) {
    return false;
  }

  if (first.codePoint === 0x2d) {
    let secondAt = start + first.rawLength;
    let second = cssCodePointAt(str, secondAt);
    return (
      (second !== null &&
        (isCssNameStartCodePoint(second.codePoint) ||
          second.codePoint === 0x2d)) ||
      startsValidCssEscape(str, secondAt)
    );
  }

  return (
    isCssNameStartCodePoint(first.codePoint) || startsValidCssEscape(str, start)
  );
}

function selectorCharacterIsBoundary(char: string | undefined): boolean {
  return char === undefined || isCssWhitespace(char);
}

/**
 * Return the first index after a valid CSS escape, including the optional
 * whitespace terminator of a hexadecimal escape.
 */
function cssEscapeEndsAt(str: string, start: number): number | null {
  if (!startsValidCssEscape(str, start)) {
    return null;
  }

  let i = start + 1;
  if (str[i] === undefined) {
    return i;
  }
  if (isCssHexDigit(str[i])) {
    let hexDigits = 0;
    while (hexDigits < 6 && isCssHexDigit(str[i])) {
      i += 1;
      hexDigits += 1;
    }
    if (isCssWhitespace(str[i])) {
      if (str[i] === "\r" && str[i + 1] === "\n") {
        return i + 2;
      }
      return i + 1;
    }
    return i;
  }

  return start + 1 + (cssCodePointAt(str, start + 1) as CssCodePoint).rawLength;
}

function markerIsEscaped(str: string, markerAt: number): boolean {
  let backslashes = 0;
  for (let i = markerAt - 1; i >= 0 && str[i] === "\\"; i--) {
    backslashes += 1;
  }
  return backslashes % 2 === 1;
}

interface CssIdentifierValue {
  value: string;
  raw: string;
  range: [from: number, to: number];
}

interface CssDecodedUnit {
  value: string;
  range: [from: number, to: number];
}

interface CssStringValue {
  endsAt: number;
  units: CssDecodedUnit[];
}

interface AttributeSelectorValue {
  raw: string;
  range: [from: number, to: number];
}

interface AttributeSelectorRead {
  closeAt: number;
  selectors: AttributeSelectorValue[];
}

function attributeNameCanEnd(char: string | undefined): boolean {
  return (
    char === "=" ||
    char === "~" ||
    char === "^" ||
    char === "$" ||
    char === "*" ||
    char === "|" ||
    char === "]" ||
    isCssWhitespace(char)
  );
}

function readCssIdentifierValue(
  str: string,
  start: number,
): CssIdentifierValue | null {
  if (!wouldStartCssIdentSequence(str, start)) {
    return null;
  }

  let i = start;
  while (i < str.length) {
    if (str[i] === "\\") {
      let escapeEndsAt = cssEscapeEndsAt(str, i);
      if (escapeEndsAt !== null) {
        i = escapeEndsAt;
        continue;
      }
    }
    let current = cssCodePointAt(str, i);
    if (current === null || !isCssNameCodePoint(current.codePoint)) {
      break;
    }
    i += current.rawLength;
  }

  let raw = str.slice(start, i);
  return {
    value: decodeCssSelector(raw),
    raw,
    range: [start, i],
  };
}

function findCssAttributeEnd(str: string, start: number): number | null {
  let quote: '"' | "'" | undefined;

  for (let i = start; i < str.length; i++) {
    if (quote) {
      if (str[i] === "\\") {
        if (isCssNewline(str[i + 1])) {
          i += str[i + 1] === "\r" && str[i + 2] === "\n" ? 2 : 1;
          continue;
        }
        let escapeEndsAt = cssEscapeEndsAt(str, i);
        if (escapeEndsAt !== null) {
          i = escapeEndsAt - 1;
          continue;
        }
      } else if (str[i] === quote) {
        quote = undefined;
      }
      continue;
    }

    if (str[i] === '"' || str[i] === "'") {
      quote = str[i] as '"' | "'";
    } else if (str[i] === "\\") {
      let escapeEndsAt = cssEscapeEndsAt(str, i);
      if (escapeEndsAt !== null) {
        i = escapeEndsAt - 1;
      }
    } else if (str[i] === "]") {
      return i;
    }
  }

  return null;
}

function readCssStringValue(
  str: string,
  quoteAt: number,
): CssStringValue | null {
  let quote = str[quoteAt];
  let units: CssDecodedUnit[] = [];

  for (let i = quoteAt + 1; ; ) {
    if (str[i] === quote) {
      return { endsAt: i + 1, units };
    }
    if (isCssNewline(str[i])) {
      return null;
    }
    if (str[i] === "\\") {
      if (isCssNewline(str[i + 1])) {
        i += str[i + 1] === "\r" && str[i + 2] === "\n" ? 3 : 2;
        continue;
      }
      let escapeEndsAt = cssEscapeEndsAt(str, i) as number;
      units.push({
        value: decodeCssSelector(str.slice(i, escapeEndsAt)),
        range: [i, escapeEndsAt],
      });
      i = escapeEndsAt;
      continue;
    }
    let current = cssCodePointAt(str, i) as CssCodePoint;
    units.push({
      value: current.value,
      range: [i, i + current.rawLength],
    });
    i += current.rawLength;
  }
}

function decodeCssIdentifierUnits(
  str: string,
  from: number,
  to: number,
): CssDecodedUnit[] {
  let units: CssDecodedUnit[] = [];
  for (let i = from; i < to; ) {
    if (str[i] === "\\") {
      let escapeEndsAt = cssEscapeEndsAt(str, i) as number;
      units.push({
        value: decodeCssSelector(str.slice(i, escapeEndsAt)),
        range: [i, escapeEndsAt],
      });
      i = escapeEndsAt;
      continue;
    }
    let current = cssCodePointAt(str, i) as CssCodePoint;
    units.push({
      value: current.value,
      range: [i, i + current.rawLength],
    });
    i += current.rawLength;
  }
  return units;
}

function isHtmlAsciiWhitespace(char: string): boolean {
  return (
    char === " " ||
    char === "\n" ||
    char === "\r" ||
    char === "\t" ||
    char === "\f"
  );
}

function splitHtmlClassTokens(
  str: string,
  units: CssDecodedUnit[],
): AttributeSelectorValue[] {
  let tokens: AttributeSelectorValue[] = [];
  let tokenStartsAt: number | null = null;
  let tokenEndsAt = 0;

  function commit(): void {
    if (tokenStartsAt !== null) {
      tokens.push({
        raw: str.slice(tokenStartsAt, tokenEndsAt),
        range: [tokenStartsAt, tokenEndsAt],
      });
      tokenStartsAt = null;
    }
  }

  for (let unit of units) {
    if (isHtmlAsciiWhitespace(unit.value)) {
      commit();
    } else {
      if (tokenStartsAt === null) {
        tokenStartsAt = unit.range[0];
      }
      tokenEndsAt = unit.range[1];
    }
  }
  commit();

  return tokens;
}

function rawSpellsCssIdentifier(
  str: string,
  selector: AttributeSelectorValue,
): boolean {
  let raw = str.slice(selector.range[0], selector.range[1]);
  let identifier = readCssIdentifierValue(raw, 0);
  return identifier !== null && identifier.range[1] === raw.length;
}

function readAttributeSelector(
  str: string,
  nameStartsAt: number,
  marker: "." | "#",
  operatorAt: number | null,
): AttributeSelectorRead | null {
  let closeAt = findCssAttributeEnd(str, nameStartsAt);
  if (closeAt === null) {
    return null;
  }

  let membership =
    marker === "." &&
    operatorAt !== null &&
    str[operatorAt] === "~" &&
    str[operatorAt + 1] === "=";
  let equalsAt = membership ? (operatorAt as number) + 1 : operatorAt;
  if (equalsAt === null || str[equalsAt] !== "=") {
    return { closeAt, selectors: [] };
  }

  let valueStartsAt = right(str, equalsAt);
  if (valueStartsAt === null || valueStartsAt >= closeAt) {
    return { closeAt, selectors: [] };
  }

  let units: CssDecodedUnit[];
  if (str[valueStartsAt] === '"' || str[valueStartsAt] === "'") {
    let value = readCssStringValue(str, valueStartsAt);
    if (value === null || right(str, value.endsAt - 1) !== closeAt) {
      return { closeAt, selectors: [] };
    }
    units = value.units;
  } else {
    let value = readCssIdentifierValue(str, valueStartsAt);
    if (
      value === null ||
      value.range[1] > closeAt ||
      right(str, value.range[1] - 1) !== closeAt
    ) {
      return { closeAt, selectors: [] };
    }
    units = decodeCssIdentifierUnits(str, value.range[0], value.range[1]);
  }

  let selectors = splitHtmlClassTokens(str, units);
  if (
    (membership && units.some((unit) => isHtmlAsciiWhitespace(unit.value))) ||
    (marker === "#" && selectors.length !== 1)
  ) {
    return { closeAt, selectors: [] };
  }

  return {
    closeAt,
    selectors: selectors.filter((selector) =>
      rawSpellsCssIdentifier(str, selector),
    ),
  };
}

function readCssSelectorTokenInternal(
  str: string,
  start: number,
): CssSelectorToken | null {
  if (
    !(str[start] === "." || str[start] === "#") ||
    markerIsEscaped(str, start) ||
    !wouldStartCssIdentSequence(str, start + 1)
  ) {
    return null;
  }

  let identifier = readCssIdentifierValue(str, start + 1) as CssIdentifierValue;
  return {
    value: `${str[start]}${identifier.value}`,
    raw: `${str[start]}${identifier.raw}`,
    range: [start, identifier.range[1]],
  };
}

/**
 * Decode CSS escapes in one extracted class/id selector while retaining its
 * leading dot or hash.
 */
function decodeCssSelector(selector: string): string {
  if (typeof selector !== "string") {
    throw new TypeError(
      `string-extract-class-names/decodeCssSelector(): [THROW_ID_02] first selector should be string, not ${typeof selector}, currently equal to ${formatDiagnosticValue(selector, 4)}`,
    );
  }

  let result = "";
  for (let i = 0; i < selector.length; i++) {
    if (selector[i] !== "\\") {
      let current = cssCodePointAt(selector, i);
      if (current !== null) {
        result += current.value;
        i += current.rawLength - 1;
      }
      continue;
    }

    let escapeEndsAt = cssEscapeEndsAt(selector, i);
    if (escapeEndsAt === null) {
      result += selector[i];
      continue;
    }

    if (isCssHexDigit(selector[i + 1])) {
      let hexEndsAt = i + 1;
      while (hexEndsAt < i + 7 && isCssHexDigit(selector[hexEndsAt])) {
        hexEndsAt += 1;
      }
      let hex = selector.slice(i + 1, hexEndsAt);
      let codePoint = Number.parseInt(hex, 16);
      result +=
        codePoint === 0 ||
        codePoint > 0x10ffff ||
        (codePoint >= 0xd800 && codePoint <= 0xdfff)
          ? "\uFFFD"
          : String.fromCodePoint(codePoint);
    } else {
      result += cssCodePointAt(selector, i + 1)?.value || "\uFFFD";
    }
    i = escapeEndsAt - 1;
  }

  return result;
}

/**
 * Read one raw class/id selector token from an exact dot/hash index.
 */
function readCssSelectorToken(
  str: string,
  start: number,
): CssSelectorToken | null {
  if (typeof str !== "string") {
    throw new TypeError(
      `string-extract-class-names/readCssSelectorToken(): [THROW_ID_03] first str should be string, not ${typeof str}, currently equal to ${formatDiagnosticValue(str, 4)}`,
    );
  }
  if (!Number.isInteger(start)) {
    throw new TypeError(
      `string-extract-class-names/readCssSelectorToken(): [THROW_ID_04] second start should be an integer, not ${typeof start}, currently equal to ${formatDiagnosticValue(start, 4)}`,
    );
  }

  return readCssSelectorTokenInternal(str, start);
}

export { decodeCssSelector, extract, readCssSelectorToken, version };
