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
 * Extracts CSS class/id names from a string
 */
function extract(str: string): Result {
  // insurance
  // =========
  if (typeof str !== "string") {
    throw new TypeError(
      `string-extract-class-names/extract(): [THROW_ID_01] first str should be string, not ${typeof str}, currently equal to ${JSON.stringify(
        str,
        null,
        4,
      )}`,
    );
  }

  let badChars = selectorBreakCharacters;
  let stateCurrentlyIs: "." | "#" | undefined; // "." or "#"

  // functions
  // =========

  function isLatinLetter(char: string): boolean {
    // we mean Latin letters A-Z, a-z
    return (
      typeof char === "string" &&
      !!char.length &&
      ((char.charCodeAt(0) > 64 && char.charCodeAt(0) < 91) ||
        (char.charCodeAt(0) > 96 && char.charCodeAt(0) < 123))
    );
  }

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
        `63 ${`\u001b[${36}m${`============================`}\u001b[${39}m`} ${`\u001b[${33}m${str[i]}\u001b[${39}m`} (${`\u001b[${31}m${i}\u001b[${39}m`})`,
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
        result.res.push(
          `${stateCurrentlyIs || ""}${str.slice(selectorStartsAt, i)}`,
        );

        if (stateCurrentlyIs) {
          stateCurrentlyIs = undefined;
          DEV &&
            console.log(
              `107 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} stateCurrentlyIs = undefined`,
            );
        }
      }
      selectorStartsAt = null;
      DEV &&
        console.log(
          `114 ${`\u001b[${33}m${`selectorStartsAt`}\u001b[${39}m`} = null`,
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
          `127 SET ${`\u001b[${33}m${`selectorStartsAt`}\u001b[${39}m`} = ${selectorStartsAt}`,
        );
    }

    // catch zzz[class=]
    let temp1 = right(str, i + 4);
    if (
      str.startsWith("class", i) &&
      typeof left(str, i) === "number" &&
      str[left(str, i) as number] === "[" &&
      typeof temp1 === "number" &&
      str[temp1] === "="
    ) {
      DEV && console.log(`140 [class= caught`);
      // if it's zzz[class=something] (without quotes)
      /* c8 ignore next */
      if (
        right(str, temp1) &&
        (isLatinLetter(str[right(str, temp1) as number]) ||
          cssEscapeEndsAt(str, right(str, temp1) as number) !== null)
      ) {
        selectorStartsAt = right(str, temp1);
        DEV && console.log(`149 SET selectorStartsAt = ${selectorStartsAt}`);
      } else if (
        `'"`.includes(str[right(str, temp1) as number]) &&
        (isLatinLetter(str[right(str, right(str, temp1)) as number]) ||
          cssEscapeEndsAt(str, right(str, right(str, temp1)) as number) !==
            null)
      ) {
        selectorStartsAt = right(str, right(str, temp1));
        DEV && console.log(`157 SET selectorStartsAt = ${selectorStartsAt}`);
      }
      stateCurrentlyIs = ".";
    }

    // catch zzz[id=]
    let temp2 = right(str, i + 1);
    if (
      str.startsWith("id", i) &&
      str[left(str, i) as number] === "[" &&
      temp2 !== null &&
      str[temp2] === "="
    ) {
      DEV && console.log(`170 [id= caught`);
      // if it's zzz[id=something] (without quotes)
      if (
        isLatinLetter(str[right(str, temp2) as number]) ||
        cssEscapeEndsAt(str, right(str, temp2) as number) !== null
      ) {
        selectorStartsAt = right(str, temp2);
        DEV && console.log(`177 SET selectorStartsAt = ${selectorStartsAt}`);
      } else if (
        `'"`.includes(str[right(str, temp2) as number]) &&
        (isLatinLetter(str[right(str, right(str, temp2)) as number]) ||
          cssEscapeEndsAt(str, right(str, right(str, temp2)) as number) !==
            null)
      ) {
        selectorStartsAt = right(str, right(str, temp2));
        DEV && console.log(`185 SET selectorStartsAt = ${selectorStartsAt}`);
      }
      stateCurrentlyIs = "#";
    }

    DEV &&
      console.log(
        `192 \u001b[${90}m${`ended with: selectorStartsAt = ${selectorStartsAt}; result = ${JSON.stringify(
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

function selectorCharacterIsBoundary(char: string | undefined): boolean {
  return char === undefined || isCssWhitespace(char);
}

/**
 * Return the first index after a valid CSS escape, including the optional
 * whitespace terminator of a hexadecimal escape.
 */
function cssEscapeEndsAt(str: string, start: number): number | null {
  if (
    str[start] !== "\\" ||
    str[start + 1] === undefined ||
    isCssNewline(str[start + 1])
  ) {
    return null;
  }

  let i = start + 1;
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

  return start + 1 + (Number(str.codePointAt(start + 1)) > 0xffff ? 2 : 1);
}

function markerIsEscaped(str: string, markerAt: number): boolean {
  let backslashes = 0;
  for (let i = markerAt - 1; i >= 0 && str[i] === "\\"; i--) {
    backslashes += 1;
  }
  return backslashes % 2 === 1;
}

function readCssSelectorTokenInternal(
  str: string,
  start: number,
): CssSelectorToken | null {
  if (
    !(str[start] === "." || str[start] === "#") ||
    markerIsEscaped(str, start)
  ) {
    return null;
  }

  let i = start + 1;
  while (i < str.length) {
    if (str[i] === "\\") {
      let escapeEndsAt = cssEscapeEndsAt(str, i);
      if (escapeEndsAt !== null) {
        i = escapeEndsAt;
        continue;
      }
    }
    if (
      selectorCharacterIsBoundary(str[i]) ||
      selectorBreakCharacters.includes(str[i])
    ) {
      break;
    }
    i += 1;
  }

  if (i === start + 1) {
    return null;
  }

  let raw = str.slice(start, i);
  return {
    value: decodeCssSelector(raw),
    raw,
    range: [start, i],
  };
}

/**
 * Decode CSS escapes in one extracted class/id selector while retaining its
 * leading dot or hash.
 */
function decodeCssSelector(selector: string): string {
  if (typeof selector !== "string") {
    throw new TypeError(
      `string-extract-class-names/decodeCssSelector(): [THROW_ID_02] first selector should be string, not ${typeof selector}, currently equal to ${JSON.stringify(
        selector,
        null,
        4,
      )}`,
    );
  }

  let result = "";
  for (let i = 0; i < selector.length; i++) {
    if (selector[i] !== "\\") {
      result += selector[i];
      continue;
    }

    let escapeEndsAt = cssEscapeEndsAt(selector, i);
    if (escapeEndsAt === null) {
      result += selector[i];
      continue;
    }

    if (isCssHexDigit(selector[i + 1])) {
      let hex = selector.slice(i + 1, Math.min(i + 7, escapeEndsAt)).trim();
      let codePoint = Number.parseInt(hex, 16);
      result +=
        codePoint === 0 ||
        codePoint > 0x10ffff ||
        (codePoint >= 0xd800 && codePoint <= 0xdfff)
          ? "\uFFFD"
          : String.fromCodePoint(codePoint);
    } else {
      result += String.fromCodePoint(Number(selector.codePointAt(i + 1)));
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
      `string-extract-class-names/readCssSelectorToken(): [THROW_ID_03] first str should be string, not ${typeof str}, currently equal to ${JSON.stringify(
        str,
        null,
        4,
      )}`,
    );
  }
  if (!Number.isInteger(start)) {
    throw new TypeError(
      `string-extract-class-names/readCssSelectorToken(): [THROW_ID_04] second start should be an integer, not ${typeof start}, currently equal to ${JSON.stringify(
        start,
        null,
        4,
      )}`,
    );
  }

  return readCssSelectorTokenInternal(str, start);
}

export { decodeCssSelector, extract, readCssSelectorToken, version };
