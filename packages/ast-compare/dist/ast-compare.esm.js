/**
 * ast-compare
 * Compare anything: AST, objects, arrays, strings and nested thereof
 * Version: 1.12.30
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ast-compare
 */

import clone from 'lodash.clonedeep';
import pullAll from 'lodash.pullall';
import typeDetect from 'type-detect';
import empty from 'ast-contains-only-empty-space';
import matcher from 'matcher';

const isArr = Array.isArray;
function existy(x) {
  return x != null;
}
function isObj(something) {
  return typeDetect(something) === "Object";
}
function isStr(something) {
  return typeDetect(something) === "string";
}
function isNum(something) {
  return typeDetect(something) === "number";
}
function isBool(something) {
  return typeDetect(something) === "boolean";
}
function isNull(something) {
  return something === null;
}
function isBlank(something) {
  if (isObj(something)) {
    return Object.keys(something).length === 0;
  } else if (isArr(something) || isStr(something)) {
    return something.length === 0;
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
function compare(bo, so, originalOpts) {
  if (bo === undefined) {
    throw new TypeError(
      "ast-compare/compare(): [THROW_ID_01] first argument is missing!"
    );
  }
  if (so === undefined) {
    throw new TypeError(
      "ast-compare/compare(): [THROW_ID_02] second argument is missing!"
    );
  }
  if (existy(bo) && !isTheTypeLegit(bo)) {
    throw new TypeError(
      `ast-compare/compare(): [THROW_ID_03] first input argument is of a wrong type, ${typeDetect(
        bo
      )}, equal to: ${JSON.stringify(bo, null, 4)}`
    );
  }
  if (existy(so) && !isTheTypeLegit(so)) {
    throw new TypeError(
      `ast-compare/compare(): [THROW_ID_04] second input argument is of a wrong type, ${typeDetect(
        so
      )}, equal to: ${JSON.stringify(so, null, 4)}`
    );
  }
  if (existy(originalOpts) && !isObj(originalOpts)) {
    throw new TypeError(
      `ast-compare/compare(): [THROW_ID_05] third argument, options object, must, well, be an object! Currently it's: ${typeDetect(
        originalOpts
      )} and equal to: ${JSON.stringify(originalOpts, null, 4)}`
    );
  }
  const s = clone(so);
  const b = clone(bo);
  let sKeys;
  let bKeys;
  let found;
  let bOffset = 0;
  const defaults = {
    hungryForWhitespace: false,
    matchStrictly: false,
    verboseWhenMismatches: false,
    useWildcards: false
  };
  const opts = Object.assign({}, defaults, originalOpts);
  if (
    opts.hungryForWhitespace &&
    opts.matchStrictly &&
    isObj(bo) &&
    empty(bo) &&
    isObj(so) &&
    Object.keys(so).length === 0
  ) {
    return true;
  }
  if (
    ((!opts.hungryForWhitespace ||
      (opts.hungryForWhitespace && !empty(bo) && empty(so))) &&
      isObj(bo) &&
      Object.keys(bo).length !== 0 &&
      isObj(so) &&
      Object.keys(so).length === 0) ||
    (typeDetect(bo) !== typeDetect(so) &&
      (!opts.hungryForWhitespace || (opts.hungryForWhitespace && !empty(bo))))
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
  } else if (isArr(b) && isArr(s)) {
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
    sKeys = Object.keys(s);
    bKeys = Object.keys(b);
    if (opts.matchStrictly && sKeys.length !== bKeys.length) {
      if (!opts.verboseWhenMismatches) {
        return false;
      }
      const uniqueKeysOnS = pullAll(clone(sKeys), clone(bKeys));
      const sMessage =
        uniqueKeysOnS.length > 0
          ? `First object has unique keys: ${JSON.stringify(
              uniqueKeysOnS,
              null,
              4
            )}.`
          : "";
      const uniqueKeysOnB = pullAll(clone(bKeys), clone(sKeys));
      const bMessage =
        uniqueKeysOnB.length > 0
          ? `Second object has unique keys:
        ${JSON.stringify(uniqueKeysOnB, null, 4)}.`
          : "";
      return `When matching strictly, we found that both objects have different amount of keys. ${sMessage} ${bMessage}`;
    }
    for (let i = 0, len = sKeys.length; i < len; i++) {
      if (!existy(b[sKeys[i]])) {
        if (
          !opts.useWildcards ||
          (opts.useWildcards && !sKeys[i].includes("*"))
        ) {
          if (!opts.verboseWhenMismatches) {
            return false;
          }
          return `The given object has key ${sKeys[i]} which the other-one does not have.`;
        }
        else if (
          Object.keys(b).some(bKey =>
            matcher.isMatch(bKey, sKeys[i], { caseSensitive: true })
          )
        ) {
          return true;
        }
        if (!opts.verboseWhenMismatches) {
          return false;
        }
        return `The given object has key ${sKeys[i]} which the other-one does not have.`;
      }
      if (b[sKeys[i]] !== undefined && !isTheTypeLegit(b[sKeys[i]])) {
        throw new TypeError(
          `ast-compare/compare(): [THROW_ID_07] The input ${JSON.stringify(
            b,
            null,
            4
          )} contains a value of a wrong type, ${typeDetect(
            b[sKeys[i]]
          )} at index ${i}, equal to: ${JSON.stringify(b[sKeys[i]], null, 4)}`
        );
      } else if (!isTheTypeLegit(s[sKeys[i]])) {
        throw new TypeError(
          `ast-compare/compare(): [THROW_ID_08] The input ${JSON.stringify(
            s,
            null,
            4
          )} contains a value of a wrong type, ${typeDetect(
            s[sKeys[i]]
          )} at index ${i}, equal to: ${JSON.stringify(s[sKeys[i]], null, 4)}`
        );
      } else if (
        existy(b[sKeys[i]]) &&
        typeDetect(b[sKeys[i]]) !== typeDetect(s[sKeys[i]])
      ) {
        if (
          !(
            empty(b[sKeys[i]]) &&
            empty(s[sKeys[i]]) &&
            opts.hungryForWhitespace
          )
        ) {
          if (!opts.verboseWhenMismatches) {
            return false;
          }
          return `The given key ${
            sKeys[i]
          } is of a different type on both objects. On the first-one, it's ${typeDetect(
            s[sKeys[i]]
          )}, on the second-one, it's ${typeDetect(b[sKeys[i]])}`;
        }
      }
      else if (compare(b[sKeys[i]], s[sKeys[i]], opts) !== true) {
        if (!opts.verboseWhenMismatches) {
          return false;
        }
        return `The given piece ${JSON.stringify(
          s[sKeys[i]],
          null,
          4
        )} and ${JSON.stringify(b[sKeys[i]], null, 4)} don't match.`;
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
