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

export {
  characterSuitableForNames,
  prepHopefullyAnArray,
  xBeforeYOnTheRight,
  notWithinAttrQuotes,
  Obj,
};
