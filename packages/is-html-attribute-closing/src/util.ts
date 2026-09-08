import { isAttrNameChar } from "is-char-suitable-for-html-attr-name";
import { left } from "string-left-right";

declare let DEV: boolean;

// Indices remain UTF-16 offsets. Looking left can land on the second code
// unit of a supplementary character; classify the complete pair either way.
function isAttrNameCharAt(str: string, index: number): boolean {
  if (typeof index !== "number") {
    return false;
  }
  let code = str.charCodeAt(index);
  if (code >= 0xdc00 && code <= 0xdfff) {
    let previous = str.charCodeAt(index - 1);
    if (previous >= 0xd800 && previous <= 0xdbff) {
      return isAttrNameChar(str.slice(index - 1, index + 1));
    }
  }
  return isAttrNameChar(
    code >= 0xd800 && code <= 0xdbff ? str.slice(index, index + 2) : str[index],
  );
}

// Missing-equals recovery gives word-like chunks more weight than punctuation
// in a broken value, as in `alt !'`. This is a recovery heuristic, not the HTML
// attribute-name grammar used for names followed by an equals sign.
function isRecoveryNameCharAt(str: string, index: number): boolean {
  let code = str.charCodeAt(index);
  return (
    (code > 127 ||
      (code >= 48 && code <= 57) ||
      (code >= 65 && code <= 90) ||
      (code >= 97 && code <= 122) ||
      "-:_.".includes(str[index])) &&
    isAttrNameCharAt(str, index)
  );
}

function attrNameEndsAt(str: string, start: number): number {
  let end = start;
  while (end < str.length && isAttrNameCharAt(str, end)) {
    end += (str.codePointAt(end) as number) > 0xffff ? 2 : 1;
  }
  return end;
}

function makeTheQuoteOpposite(quoteChar: string): string {
  return quoteChar === `'` ? `"` : `'`;
}

function ensureXIsNotPresentBeforeOneOfY(
  str: string,
  startingIdx: number,
  x: string,
  y: string[] = [],
): boolean {
  DEV && console.log(`014e ensureXIsNotPresentBeforeOneOfY() called`);
  for (let i = startingIdx, len = str.length; i < len; i++) {
    DEV && console.log(`016e str[i] = ${str[i]}`);
    if (y.some((oneOfStr) => str.startsWith(oneOfStr, i))) {
      // it's escape clause, bracket or whatever was reached and yet,
      // "x" hasn't been encountered yet
      DEV && console.log(`020e return true`);
      return true;
    }
    if (str[i] === x) {
      // if "x" was found, that's it - falsy result
      DEV && console.log(`025e return false`);
      return false;
    }
  }
  // default result
  DEV && console.log(`030e return true`);
  return true;
}

// Tells, if substring x goes before substring y on the right
// side of "str", starting at index "startingIdx".
// Used to troubleshoot dirty broken code.
function xBeforeYOnTheRight(
  str: string,
  startingIdx: number,
  x: string,
  y: string,
): boolean {
  for (let i = startingIdx, len = str.length; i < len; i++) {
    if (str.startsWith(x, i)) {
      // if x was first, Bob's your uncle, that's truthy result
      return true;
    }
    if (str.startsWith(y, i)) {
      // since we're in this clause, x failed, so if y matched,
      // this means y precedes x
      return false;
    }
  }
  // default result
  return false;
}

// Tells, is this a clean plausible attribute starting at given index
// <img alt="so-called "artists"class='yo'/>
//                              ^
//                            start
function plausibleAttrStartsAtX(str: string, start: number): boolean {
  DEV &&
    console.log(
      `${`\u001b[${35}m${`plausibleAttrStartsAtX()`}\u001b[${39}m`} called, start = ${start}`,
    );
  if (!isAttrNameCharAt(str, start) || !start) {
    return false;
  }
  let nameEndsAt = attrNameEndsAt(str, start);
  let equalsAt = nameEndsAt;
  while (str[equalsAt] && " \t\n\f\r".includes(str[equalsAt])) {
    equalsAt++;
  }
  if (str[equalsAt] !== "=" && !isRecoveryNameCharAt(str, start)) {
    return false;
  }
  return (
    /^\s*=?\s*(?:'[^']*'|"[^"]*")/.test(str.slice(nameEndsAt)) ||
    // Retain the existing loose recovery for missing equals and closing quotes.
    / [^/>'"=]*['"]/.test(str.slice(start))
  );
}

// difference is equal is required
function guaranteedAttrStartsAtX(str: string, start: number): boolean {
  DEV &&
    console.log(
      `${`\u001b[${35}m${`guaranteedAttrStartsAtX()`}\u001b[${39}m`} called, start = ${start}`,
    );
  if (!start || !isAttrNameCharAt(str, start)) {
    DEV && console.log(`083g return false`);
    return false;
  }
  // either quotes match or does not match but tag closing follows
  return /^=(?:'[^']*'|"[^"]*"|['"][^'"]*['"]\s*\/?>)/.test(
    str.slice(attrNameEndsAt(str, start)),
  );
}

function findAttrNameCharsChunkOnTheLeft(
  str: string,
  i: number,
): undefined | string {
  if (!isAttrNameCharAt(str, left(str, i) as number)) {
    return;
  }
  for (let y = i; y--; ) {
    DEV &&
      console.log(
        `${`\u001b[${36}m${`str[y]`}\u001b[${39}m`} = ${JSON.stringify(
          str[y],
          null,
          4,
        )}`,
      );
    if (str[y].trim().length && !isAttrNameCharAt(str, y)) {
      return str.slice(y + 1, i);
    }
  }
}

export {
  ensureXIsNotPresentBeforeOneOfY,
  findAttrNameCharsChunkOnTheLeft,
  guaranteedAttrStartsAtX,
  isAttrNameCharAt,
  isRecoveryNameCharAt,
  makeTheQuoteOpposite,
  plausibleAttrStartsAtX,
  xBeforeYOnTheRight,
};
