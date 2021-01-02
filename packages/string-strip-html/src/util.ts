/* eslint @typescript-eslint/explicit-module-boundary-types:0 */

interface Obj {
  [key: string]: any;
}

/* istanbul ignore next */
function characterSuitableForNames(char: string): boolean {
  return /[-_A-Za-z0-9]/.test(char);
}

/* istanbul ignore next */
function prepHopefullyAnArray(something: any, name: string): string[] {
  if (!something) {
    return [];
  }
  if (Array.isArray(something)) {
    return something.filter((val) => typeof val === "string" && val.trim());
  }
  if (typeof something === "string") {
    return something.trim() ? [something] : [];
  }
  throw new TypeError(
    `string-strip-html/stripHtml(): [THROW_ID_03] ${name} must be array containing zero or more strings or something falsey. Currently it's equal to: ${something}, that a type of ${typeof something}.`
  );
}

/* istanbul ignore next */
function xBeforeYOnTheRight(
  str: string,
  startingIdx: number,
  x: string,
  y: string
): boolean {
  for (let i = startingIdx, len = str.length; i < len; i++) {
    if (str.startsWith(x, i)) {
      return true;
    }

    if (str.startsWith(y, i)) {
      return false;
    }
  }

  return false;
}

//
// precaution against JSP comparison
// kl <c:when test="${!empty ab.cd && ab.cd > 0.00}"> mn
//                                          ^
//                                        we're here, it's false ending
//
/* istanbul ignore next */
function notWithinAttrQuotes(tag: Obj, str: string, i: number) {
  return (
    !tag ||
    !tag.quotes ||
    !xBeforeYOnTheRight(str, i + 1, tag.quotes.value, ">")
  );
}

/* eslint no-control-regex: 0 */
function trimEnd(str: string): string {
  return str.replace(
    new RegExp(
      `${
        /[\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF]+/
          .source
      }$`,
      "g"
    ),
    ""
  );
}

export {
  characterSuitableForNames,
  prepHopefullyAnArray,
  xBeforeYOnTheRight,
  notWithinAttrQuotes,
  trimEnd,
  Obj,
};
