/**
 * ast-compare
 * Compare anything: AST, objects, arrays, strings and nested thereof
 * Version: 1.13.13
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ast-compare
 */

import typeDetect from 'type-detect';
import empty from 'ast-contains-only-empty-space';
import matcher from 'matcher';

const isArr = Array.isArray;
function existy(x) {
  return x != null;
}
function isObj(something) {
  return (
    something && typeof something === "object" && !Array.isArray(something)
  );
}
function isStr(something) {
  return typeof something === "string";
}
function isNum(something) {
  return typeof something === "number";
}
function isBool(something) {
  return typeof something === "boolean";
}
function isNull(something) {
  return something === null;
}
/* istanbul ignore next */
function isBlank(something) {
  if (isObj(something)) {
    return !Object.keys(something).length;
  }
  if (isArr(something) || isStr(something)) {
    return !something.length;
  }
  return false;
}
function isTheTypeLegit(something) {
  return (
    isObj(something) ||
    isStr(something) ||
    isNum(something) ||
    isBool(something) ||
    isArr(something) ||
    isNull(something)
  );
}
function compare(b, s, originalOpts) {
  if (b === undefined) {
    throw new TypeError(
      "ast-compare/compare(): [THROW_ID_01] first argument is missing!"
    );
  }
  if (s === undefined) {
    throw new TypeError(
      "ast-compare/compare(): [THROW_ID_02] second argument is missing!"
    );
  }
  if (existy(b) && !isTheTypeLegit(b)) {
    throw new TypeError(
      `ast-compare/compare(): [THROW_ID_03] first input argument is of a wrong type, ${typeDetect(
        b
      )}, equal to: ${JSON.stringify(b, null, 4)}`
    );
  }
  if (existy(s) && !isTheTypeLegit(s)) {
    throw new TypeError(
      `ast-compare/compare(): [THROW_ID_04] second input argument is of a wrong type, ${typeDetect(
        s
      )}, equal to: ${JSON.stringify(s, null, 4)}`
    );
  }
  if (existy(originalOpts) && !isObj(originalOpts)) {
    throw new TypeError(
      `ast-compare/compare(): [THROW_ID_05] third argument, options object, must, well, be an object! Currently it's: ${typeDetect(
        originalOpts
      )} and equal to: ${JSON.stringify(originalOpts, null, 4)}`
    );
  }
  let sKeys;
  let bKeys;
  let found;
  let bOffset = 0;
  const defaults = {
    hungryForWhitespace: false,
    matchStrictly: false,
    verboseWhenMismatches: false,
    useWildcards: false,
  };
  const opts = { ...defaults, ...originalOpts };
  if (
    opts.hungryForWhitespace &&
    opts.matchStrictly &&
    isObj(b) &&
    empty(b) &&
    isObj(s) &&
    !Object.keys(s).length
  ) {
    return true;
  }
  if (
    ((!opts.hungryForWhitespace ||
      (opts.hungryForWhitespace && !empty(b) && empty(s))) &&
      isObj(b) &&
      Object.keys(b).length !== 0 &&
      isObj(s) &&
      Object.keys(s).length === 0) ||
    (typeDetect(b) !== typeDetect(s) &&
      (!opts.hungryForWhitespace || (opts.hungryForWhitespace && !empty(b))))
  ) {
    return false;
  }
  if (isStr(b) && isStr(s)) {
    if (opts.hungryForWhitespace && empty(b) && empty(s)) {
      return true;
    }
    if (opts.verboseWhenMismatches) {
      return b === s
        ? true
        : `Given string ${s} is not matched! We have ${b} on the other end.`;
    }
    return opts.useWildcards
      ? matcher.isMatch(b, s, { caseSensitive: true })
      : b === s;
  }
  if (isArr(b) && isArr(s)) {
    if (
      opts.hungryForWhitespace &&
      empty(s) &&
      (!opts.matchStrictly || (opts.matchStrictly && b.length === s.length))
    ) {
      return true;
    }
    if (
      (!opts.hungryForWhitespace && s.length > b.length) ||
      (opts.matchStrictly && s.length !== b.length)
    ) {
      if (!opts.verboseWhenMismatches) {
        return false;
      }
      return `The length of a given array, ${JSON.stringify(s, null, 4)} is ${
        s.length
      } but the length of an array on the other end, ${JSON.stringify(
        b,
        null,
        4
      )} is ${b.length}`;
    }
    if (s.length === 0) {
      if (b.length === 0) {
        return true;
      }
      if (opts.verboseWhenMismatches) {
        return `The given array has no elements, but the array on the other end, ${JSON.stringify(
          b,
          null,
          4
        )} does have some`;
      }
      return false;
    }
    for (let i = 0, sLen = s.length; i < sLen; i++) {
      found = false;
      for (let j = bOffset, bLen = b.length; j < bLen; j++) {
        bOffset += 1;
        if (compare(b[j], s[i], opts) === true) {
          found = true;
          break;
        }
      }
      if (!found) {
        if (!opts.verboseWhenMismatches) {
          return false;
        }
        return `The given array ${JSON.stringify(
          s,
          null,
          4
        )} is not a subset of an array on the other end, ${JSON.stringify(
          b,
          null,
          4
        )}`;
      }
    }
  } else if (isObj(b) && isObj(s)) {
    sKeys = new Set(Object.keys(s));
    bKeys = new Set(Object.keys(b));
    if (opts.matchStrictly && sKeys.size !== bKeys.size) {
      if (!opts.verboseWhenMismatches) {
        return false;
      }
      const uniqueKeysOnS = new Set([...sKeys].filter((x) => !bKeys.has(x)));
      const sMessage = uniqueKeysOnS.size
        ? ` First object has unique keys: ${JSON.stringify(
            uniqueKeysOnS,
            null,
            4
          )}.`
        : "";
      const uniqueKeysOnB = new Set([...bKeys].filter((x) => !sKeys.has(x)));
      const bMessage = uniqueKeysOnB.size
        ? ` Second object has unique keys:
        ${JSON.stringify(uniqueKeysOnB, null, 4)}.`
        : "";
      return `When matching strictly, we found that both objects have different amount of keys.${sMessage}${bMessage}`;
    }
    for (const sKey of sKeys) {
      if (!Object.prototype.hasOwnProperty.call(b, sKey)) {
        if (!opts.useWildcards || (opts.useWildcards && !sKey.includes("*"))) {
          if (!opts.verboseWhenMismatches) {
            return false;
          }
          return `The given object has key "${sKey}" which the other-one does not have.`;
        }
        if (
          Object.keys(b).some((bKey) =>
            matcher.isMatch(bKey, sKey, { caseSensitive: true })
          )
        ) {
          return true;
        }
        if (!opts.verboseWhenMismatches) {
          return false;
        }
        return `The given object has key "${sKey}" which the other-one does not have.`;
      }
      if (existy(b[sKey]) && typeDetect(b[sKey]) !== typeDetect(s[sKey])) {
        if (!(empty(b[sKey]) && empty(s[sKey]) && opts.hungryForWhitespace)) {
          if (!opts.verboseWhenMismatches) {
            return false;
          }
          return `The given key ${sKey} is of a different type on both objects. On the first-one, it's ${typeDetect(
            s[sKey]
          )}, on the second-one, it's ${typeDetect(b[sKey])}`;
        }
      } else if (compare(b[sKey], s[sKey], opts) !== true) {
        if (!opts.verboseWhenMismatches) {
          return false;
        }
        return `The given piece ${JSON.stringify(
          s[sKey],
          null,
          4
        )} and ${JSON.stringify(b[sKey], null, 4)} don't match.`;
      }
    }
  } else {
    if (
      opts.hungryForWhitespace &&
      empty(b) &&
      empty(s) &&
      (!opts.matchStrictly || (opts.matchStrictly && isBlank(s)))
    ) {
      return true;
    }
    return b === s;
  }
  return true;
}

export default compare;
