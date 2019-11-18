/**
 * string-find-heads-tails
 * Search for string pairs. A special case of string search algorithm.
 * Version: 3.15.5
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-find-heads-tails
 */

import isInt from 'is-natural-number';
import isNumStr from 'is-natural-number-string';
import { matchRightIncl } from 'string-match-left-right';
import arrayiffy from 'arrayiffy-if-string';
import isObj from 'lodash.isplainobject';
import includes from 'lodash.includes';

function existy(x) {
  return x != null;
}
function isStr(something) {
  return typeof something === "string";
}
const isArr = Array.isArray;
function mandatory(i) {
  throw new Error(
    `string-find-heads-tails: [THROW_ID_01*] Missing ${i}th parameter!`
  );
}
function strFindHeadsTails(str, heads, tails, opts) {
  if (existy(opts)) {
    if (!isObj(opts)) {
      throw new TypeError(
        `string-find-heads-tails: [THROW_ID_13] the fourth input argument, Optional Options Object, must be a plain object! Currently it's: ${typeof opts}, equal to: ${opts}`
      );
    } else if (isNumStr(opts.fromIndex, { includeZero: true })) {
      opts.fromIndex = Number(opts.fromIndex);
    }
  }
  const defaults = {
    fromIndex: 0,
    throwWhenSomethingWrongIsDetected: true,
    allowWholeValueToBeOnlyHeadsOrTails: true,
    source: "string-find-heads-tails",
    matchHeadsAndTailsStrictlyInPairsByTheirOrder: false,
    relaxedAPI: false
  };
  opts = Object.assign({}, defaults, opts);
  if (!opts.relaxedAPI) {
    if (str === undefined) {
      mandatory(1);
    }
    if (heads === undefined) {
      mandatory(2);
    }
    if (tails === undefined) {
      mandatory(3);
    }
  }
  if (!isStr(str) || str.length === 0) {
    if (opts.relaxedAPI) {
      return [];
    }
    throw new TypeError(
      `string-find-heads-tails: [THROW_ID_02] the first input argument, input string, must be a non-zero-length string! Currently it's: ${typeof str}, equal to: ${str}`
    );
  }
  let culpritsVal;
  let culpritsIndex;
  if (!isStr(heads) && !isArr(heads)) {
    if (opts.relaxedAPI) {
      return [];
    }
    throw new TypeError(
      `string-find-heads-tails: [THROW_ID_03] the second input argument, heads, must be either a string or an array of strings! Currently it's: ${typeof heads}, equal to:\n${JSON.stringify(
        heads,
        null,
        4
      )}`
    );
  } else if (isStr(heads)) {
    if (heads.length === 0) {
      if (opts.relaxedAPI) {
        return [];
      }
      throw new TypeError(
        "string-find-heads-tails: [THROW_ID_04] the second input argument, heads, must be a non-empty string! Currently it's empty."
      );
    } else {
      heads = arrayiffy(heads);
    }
  } else if (isArr(heads)) {
    if (heads.length === 0) {
      if (opts.relaxedAPI) {
        return [];
      }
      throw new TypeError(
        "string-find-heads-tails: [THROW_ID_05] the second input argument, heads, must be a non-empty array and contain at least one string! Currently it's empty."
      );
    } else if (
      !heads.every((val, index) => {
        culpritsVal = val;
        culpritsIndex = index;
        return isStr(val);
      })
    ) {
      if (opts.relaxedAPI) {
        heads = heads.filter(el => isStr(el) && el.length > 0);
        if (heads.length === 0) {
          return [];
        }
      } else {
        throw new TypeError(
          `string-find-heads-tails: [THROW_ID_06] the second input argument, heads, contains non-string elements! For example, element at ${culpritsIndex}th index is ${typeof culpritsVal}, equal to:\n${JSON.stringify(
            culpritsVal,
            null,
            4
          )}. Whole heads array looks like:\n${JSON.stringify(heads, null, 4)}`
        );
      }
    } else if (
      !heads.every((val, index) => {
        culpritsIndex = index;
        return isStr(val) && val.length > 0 && val.trim() !== "";
      })
    ) {
      if (opts.relaxedAPI) {
        heads = heads.filter(el => isStr(el) && el.length > 0);
        if (heads.length === 0) {
          return [];
        }
      } else {
        throw new TypeError(
          `string-find-heads-tails: [THROW_ID_07] the second input argument, heads, should not contain empty strings! For example, there's one detected at index ${culpritsIndex} of heads array:\n${JSON.stringify(
            heads,
            null,
            4
          )}.`
        );
      }
    }
  }
  if (!isStr(tails) && !isArr(tails)) {
    if (opts.relaxedAPI) {
      return [];
    }
    throw new TypeError(
      `string-find-heads-tails: [THROW_ID_08] the third input argument, tails, must be either a string or an array of strings! Currently it's: ${typeof tails}, equal to:\n${JSON.stringify(
        tails,
        null,
        4
      )}`
    );
  } else if (isStr(tails)) {
    if (tails.length === 0) {
      if (opts.relaxedAPI) {
        return [];
      }
      throw new TypeError(
        "string-find-heads-tails: [THROW_ID_09] the third input argument, tails, must be a non-empty string! Currently it's empty."
      );
    } else {
      tails = arrayiffy(tails);
    }
  } else if (isArr(tails)) {
    if (tails.length === 0) {
      if (opts.relaxedAPI) {
        return [];
      }
      throw new TypeError(
        "string-find-heads-tails: [THROW_ID_10] the third input argument, tails, must be a non-empty array and contain at least one string! Currently it's empty."
      );
    } else if (
      !tails.every((val, index) => {
        culpritsVal = val;
        culpritsIndex = index;
        return isStr(val);
      })
    ) {
      if (opts.relaxedAPI) {
        tails = tails.filter(el => isStr(el) && el.length > 0);
        if (tails.length === 0) {
          return [];
        }
      } else {
        throw new TypeError(
          `string-find-heads-tails: [THROW_ID_11] the third input argument, tails, contains non-string elements! For example, element at ${culpritsIndex}th index is ${typeof culpritsVal}, equal to:\n${JSON.stringify(
            culpritsVal,
            null,
            4
          )}. Whole tails array is equal to:\n${JSON.stringify(tails, null, 4)}`
        );
      }
    } else if (
      !tails.every((val, index) => {
        culpritsIndex = index;
        return isStr(val) && val.length > 0 && val.trim() !== "";
      })
    ) {
      if (opts.relaxedAPI) {
        tails = tails.filter(el => isStr(el) && el.length > 0);
        if (tails.length === 0) {
          return [];
        }
      } else {
        throw new TypeError(
          `string-find-heads-tails: [THROW_ID_12] the third input argument, tails, should not contain empty strings! For example, there's one detected at index ${culpritsIndex}. Whole tails array is equal to:\n${JSON.stringify(
            tails,
            null,
            4
          )}`
        );
      }
    }
  }
  const s = opts.source === defaults.source;
  if (
    opts.throwWhenSomethingWrongIsDetected &&
    !opts.allowWholeValueToBeOnlyHeadsOrTails
  ) {
    if (includes(arrayiffy(heads), str)) {
      throw new Error(
        `${opts.source}${
          s ? ": [THROW_ID_16]" : ""
        } the whole input string can't be equal to ${
          isStr(heads) ? "" : "one of "
        }heads (${str})!`
      );
    } else if (includes(arrayiffy(tails), str)) {
      throw new Error(
        `${opts.source}${
          s ? ": [THROW_ID_17]" : ""
        } the whole input string can't be equal to ${
          isStr(tails) ? "" : "one of "
        }tails (${str})!`
      );
    }
  }
  if (
    !isInt(opts.fromIndex, { includeZero: true }) &&
    !isNumStr(opts.fromIndex, { includeZero: true })
  ) {
    throw new TypeError(
      `${opts.source}${
        s ? ": [THROW_ID_18]" : ""
      } the fourth input argument must be a natural number! Currently it's: ${
        opts.fromIndex
      }`
    );
  }
  const headsAndTailsFirstCharIndexesRange = heads
    .concat(tails)
    .map(value => value.charAt(0))
    .reduce(
      (res, val) => {
        if (val.charCodeAt(0) > res[1]) {
          return [res[0], val.charCodeAt(0)];
        }
        if (val.charCodeAt(0) < res[0]) {
          return [val.charCodeAt(0), res[1]];
        }
        return res;
      },
      [
        heads[0].charCodeAt(0),
        heads[0].charCodeAt(0)
      ]
    );
  const res = [];
  let oneHeadFound = false;
  let tempResObj = {};
  let tailSuspicionRaised = false;
  let strictMatchingIndex;
  for (let i = opts.fromIndex, len = str.length; i < len; i++) {
    const firstCharsIndex = str[i].charCodeAt(0);
    if (
      firstCharsIndex <= headsAndTailsFirstCharIndexesRange[1] &&
      firstCharsIndex >= headsAndTailsFirstCharIndexesRange[0]
    ) {
      const matchedHeads = matchRightIncl(str, i, heads);
      if (matchedHeads && opts.matchHeadsAndTailsStrictlyInPairsByTheirOrder) {
        for (let z = heads.length; z--; ) {
          if (heads[z] === matchedHeads) {
            strictMatchingIndex = z;
            break;
          }
        }
      }
      if (matchedHeads) {
        if (!oneHeadFound) {
          tempResObj = {};
          tempResObj.headsStartAt = i;
          tempResObj.headsEndAt = i + matchedHeads.length;
          oneHeadFound = true;
          i += matchedHeads.length - 1;
          if (tailSuspicionRaised) {
            tailSuspicionRaised = false;
          }
          continue;
        } else if (opts.throwWhenSomethingWrongIsDetected) {
          throw new TypeError(
            `${opts.source}${
              s ? ": [THROW_ID_19]" : ""
            } When processing "${str}", we found heads (${str.slice(
              i,
              i + matchedHeads.length
            )}) starting at character with index number "${i}" and there was another set of heads before it! Generally speaking, there should be "heads-tails-heads-tails", not "heads-heads-tails"!\nWe're talking about the area of the code:\n\n\n--------------------------------------starts\n${str.slice(
              Math.max(i - 200, 0),
              i
            )}\n      ${`\u001b[${33}m------->\u001b[${39}m`} ${`\u001b[${31}m${str.slice(
              i,
              i + matchedHeads.length
            )}\u001b[${39}m`} \u001b[${33}m${"<-------"}\u001b[${39}m\n${str.slice(
              i + matchedHeads.length,
              Math.min(len, i + 200)
            )}\n--------------------------------------ends\n\n\nTo turn off this error being thrown, set opts.throwWhenSomethingWrongIsDetected to Boolean false.`
          );
        }
      }
      const matchedTails = matchRightIncl(str, i, tails);
      if (
        oneHeadFound &&
        matchedTails &&
        opts.matchHeadsAndTailsStrictlyInPairsByTheirOrder &&
        strictMatchingIndex !== undefined &&
        tails[strictMatchingIndex] !== undefined &&
        tails[strictMatchingIndex] !== matchedTails
      ) {
        let temp;
        for (let z = tails.length; z--; ) {
          if (tails[z] === matchedTails) {
            temp = z;
            break;
          }
        }
        throw new TypeError(
          `${opts.source}${
            s ? ": [THROW_ID_20]" : ""
          } When processing "${str}", we had "opts.matchHeadsAndTailsStrictlyInPairsByTheirOrder" on. We found heads (${
            heads[strictMatchingIndex]
          }) but the tails the followed it were not of the same index, ${strictMatchingIndex} (${
            tails[strictMatchingIndex]
          }) but ${temp} (${matchedTails}).`
        );
      }
      if (matchedTails) {
        if (oneHeadFound) {
          tempResObj.tailsStartAt = i;
          tempResObj.tailsEndAt = i + matchedTails.length;
          res.push(tempResObj);
          tempResObj = {};
          oneHeadFound = false;
          i += matchedTails.length - 1;
          continue;
        } else if (opts.throwWhenSomethingWrongIsDetected) {
          tailSuspicionRaised = `${opts.source}${
            s ? ": [THROW_ID_21]" : ""
          } When processing "${str}", we found tails (${str.slice(
            i,
            i + matchedTails.length
          )}) starting at character with index number "${i}" but there were no heads preceding it. That's very naughty!`;
        }
      }
    }
    if (opts.throwWhenSomethingWrongIsDetected && i === len - 1) {
      if (Object.keys(tempResObj).length !== 0) {
        throw new TypeError(
          `${opts.source}${
            s ? ": [THROW_ID_22]" : ""
          } When processing "${str}", we reached the end of the string and yet didn't find any tails (${JSON.stringify(
            tails,
            null,
            4
          )}) to match the last detected heads (${str.slice(
            tempResObj.headsStartAt,
            tempResObj.headsEndAt
          )})!`
        );
      } else if (tailSuspicionRaised) {
        throw new Error(tailSuspicionRaised);
      }
    }
  }
  return res;
}

export default strFindHeadsTails;
