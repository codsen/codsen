/**
 * string-find-heads-tails
 * Finds where are arbitrary templating marker heads and tails located
 * Version: 4.0.7
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/string-find-heads-tails/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var stringMatchLeftRight = require('string-match-left-right');
var arrayiffyIfString = require('arrayiffy-if-string');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _objectSpread__default = /*#__PURE__*/_interopDefaultLegacy(_objectSpread);

var version$1 = "4.0.7";

var version = version$1;
function isObj(something) {
  return something && typeof something === "object" && !Array.isArray(something);
}
function isStr(something) {
  return typeof something === "string";
}
var defaults = {
  fromIndex: 0,
  throwWhenSomethingWrongIsDetected: true,
  allowWholeValueToBeOnlyHeadsOrTails: true,
  source: "string-find-heads-tails",
  matchHeadsAndTailsStrictlyInPairsByTheirOrder: false,
  relaxedAPI: false
};
function strFindHeadsTails(str, heads, tails, originalOpts) {
  if (originalOpts && !isObj(originalOpts)) {
    throw new TypeError("string-find-heads-tails: [THROW_ID_01] the fourth input argument, an Optional Options Object, must be a plain object! Currently it's equal to: " + originalOpts + " (type: " + typeof originalOpts + ")");
  }
  var opts = _objectSpread__default['default'](_objectSpread__default['default']({}, defaults), originalOpts);
  if (typeof opts.fromIndex === "string" && /^\d*$/.test(opts.fromIndex)) {
    opts.fromIndex = Number(opts.fromIndex);
  } else if (!Number.isInteger(opts.fromIndex) || opts.fromIndex < 0) {
    throw new TypeError(opts.source + " [THROW_ID_18] the fourth input argument must be a natural number or zero! Currently it's: " + opts.fromIndex);
  }
  if (!isStr(str) || str.length === 0) {
    if (opts.relaxedAPI) {
      return [];
    }
    throw new TypeError("string-find-heads-tails: [THROW_ID_02] the first input argument, input string, must be a non-zero-length string! Currently it's: " + typeof str + ", equal to: " + str);
  }
  var culpritsVal;
  var culpritsIndex;
  if (typeof heads !== "string" && !Array.isArray(heads)) {
    if (opts.relaxedAPI) {
      return [];
    }
    throw new TypeError("string-find-heads-tails: [THROW_ID_03] the second input argument, heads, must be either a string or an array of strings! Currently it's: " + typeof heads + ", equal to:\n" + JSON.stringify(heads, null, 4));
  } else if (typeof heads === "string") {
    if (heads.length === 0) {
      if (opts.relaxedAPI) {
        return [];
      }
      throw new TypeError("string-find-heads-tails: [THROW_ID_04] the second input argument, heads, must be a non-empty string! Currently it's empty.");
    } else {
      heads = arrayiffyIfString.arrayiffy(heads);
    }
  } else if (Array.isArray(heads)) {
    if (heads.length === 0) {
      if (opts.relaxedAPI) {
        return [];
      }
      throw new TypeError("string-find-heads-tails: [THROW_ID_05] the second input argument, heads, must be a non-empty array and contain at least one string! Currently it's empty.");
    } else if (!heads.every(function (val, index) {
      culpritsVal = val;
      culpritsIndex = index;
      return isStr(val);
    })) {
      if (opts.relaxedAPI) {
        heads = heads.filter(function (el) {
          return isStr(el) && el.length > 0;
        });
        if (heads.length === 0) {
          return [];
        }
      } else {
        throw new TypeError("string-find-heads-tails: [THROW_ID_06] the second input argument, heads, contains non-string elements! For example, element at " + culpritsIndex + "th index is " + typeof culpritsVal + ", equal to:\n" + JSON.stringify(culpritsVal, null, 4) + ". Whole heads array looks like:\n" + JSON.stringify(heads, null, 4));
      }
    } else if (!heads.every(function (val, index) {
      culpritsIndex = index;
      return isStr(val) && val.length > 0 && val.trim() !== "";
    })) {
      if (opts.relaxedAPI) {
        heads = heads.filter(function (el) {
          return isStr(el) && el.length > 0;
        });
        if (heads.length === 0) {
          return [];
        }
      } else {
        throw new TypeError("string-find-heads-tails: [THROW_ID_07] the second input argument, heads, should not contain empty strings! For example, there's one detected at index " + culpritsIndex + " of heads array:\n" + JSON.stringify(heads, null, 4) + ".");
      }
    }
  }
  if (!isStr(tails) && !Array.isArray(tails)) {
    if (opts.relaxedAPI) {
      return [];
    }
    throw new TypeError("string-find-heads-tails: [THROW_ID_08] the third input argument, tails, must be either a string or an array of strings! Currently it's: " + typeof tails + ", equal to:\n" + JSON.stringify(tails, null, 4));
  } else if (isStr(tails)) {
    if (tails.length === 0) {
      if (opts.relaxedAPI) {
        return [];
      }
      throw new TypeError("string-find-heads-tails: [THROW_ID_09] the third input argument, tails, must be a non-empty string! Currently it's empty.");
    } else {
      tails = arrayiffyIfString.arrayiffy(tails);
    }
  } else if (Array.isArray(tails)) {
    if (tails.length === 0) {
      if (opts.relaxedAPI) {
        return [];
      }
      throw new TypeError("string-find-heads-tails: [THROW_ID_10] the third input argument, tails, must be a non-empty array and contain at least one string! Currently it's empty.");
    } else if (!tails.every(function (val, index) {
      culpritsVal = val;
      culpritsIndex = index;
      return isStr(val);
    })) {
      if (opts.relaxedAPI) {
        tails = tails.filter(function (el) {
          return isStr(el) && el.length > 0;
        });
        if (tails.length === 0) {
          return [];
        }
      } else {
        throw new TypeError("string-find-heads-tails: [THROW_ID_11] the third input argument, tails, contains non-string elements! For example, element at " + culpritsIndex + "th index is " + typeof culpritsVal + ", equal to:\n" + JSON.stringify(culpritsVal, null, 4) + ". Whole tails array is equal to:\n" + JSON.stringify(tails, null, 4));
      }
    } else if (!tails.every(function (val, index) {
      culpritsIndex = index;
      return isStr(val) && val.length > 0 && val.trim() !== "";
    })) {
      if (opts.relaxedAPI) {
        tails = tails.filter(function (el) {
          return isStr(el) && el.length > 0;
        });
        if (tails.length === 0) {
          return [];
        }
      } else {
        throw new TypeError("string-find-heads-tails: [THROW_ID_12] the third input argument, tails, should not contain empty strings! For example, there's one detected at index " + culpritsIndex + ". Whole tails array is equal to:\n" + JSON.stringify(tails, null, 4));
      }
    }
  }
  var s = opts.source === defaults.source;
  if (opts.throwWhenSomethingWrongIsDetected && !opts.allowWholeValueToBeOnlyHeadsOrTails) {
    if (arrayiffyIfString.arrayiffy(heads).includes(str)) {
      throw new Error("" + opts.source + (s ? ": [THROW_ID_16]" : "") + " the whole input string can't be equal to " + (isStr(heads) ? "" : "one of ") + "heads (" + str + ")!");
    } else if (arrayiffyIfString.arrayiffy(tails).includes(str)) {
      throw new Error("" + opts.source + (s ? ": [THROW_ID_17]" : "") + " the whole input string can't be equal to " + (isStr(tails) ? "" : "one of ") + "tails (" + str + ")!");
    }
  }
  var headsAndTailsFirstCharIndexesRange = heads.concat(tails).map(function (value) {
    return value.charAt(0);
  })
  .reduce(function (res, val) {
    if (val.charCodeAt(0) > res[1]) {
      return [res[0], val.charCodeAt(0)];
    }
    if (val.charCodeAt(0) < res[0]) {
      return [val.charCodeAt(0), res[1]];
    }
    return res;
  }, [heads[0].charCodeAt(0), heads[0].charCodeAt(0)]);
  var res = [];
  var oneHeadFound = false;
  var tempResObj = {};
  var tailSuspicionRaised = "";
  var strictMatchingIndex;
  for (var i = opts.fromIndex, len = str.length; i < len; i++) {
    var firstCharsIndex = str[i].charCodeAt(0);
    if (firstCharsIndex <= headsAndTailsFirstCharIndexesRange[1] && firstCharsIndex >= headsAndTailsFirstCharIndexesRange[0]) {
      var matchedHeads = stringMatchLeftRight.matchRightIncl(str, i, heads);
      if (matchedHeads && opts.matchHeadsAndTailsStrictlyInPairsByTheirOrder) {
        for (var z = heads.length; z--;) {
          if (heads[z] === matchedHeads) {
            strictMatchingIndex = z;
            break;
          }
        }
      }
      if (typeof matchedHeads === "string") {
        if (!oneHeadFound) {
          tempResObj = {};
          tempResObj.headsStartAt = i;
          tempResObj.headsEndAt = i + matchedHeads.length;
          oneHeadFound = true;
          i += matchedHeads.length - 1;
          if (tailSuspicionRaised) {
            tailSuspicionRaised = "";
          }
          continue;
        } else if (opts.throwWhenSomethingWrongIsDetected) {
          throw new TypeError("" + opts.source + (s ? ": [THROW_ID_19]" : "") + " When processing \"" + str + "\", we found heads (" + str.slice(i, i + matchedHeads.length) + ") starting at character with index number \"" + i + "\" and there was another set of heads before it! Generally speaking, there should be \"heads-tails-heads-tails\", not \"heads-heads-tails\"!\nWe're talking about the area of the code:\n\n\n--------------------------------------starts\n" + str.slice(Math.max(i - 200, 0), i) + "\n      " + ("\x1B[" + 33 + "m------->\x1B[" + 39 + "m") + " " + ("\x1B[" + 31 + "m" + str.slice(i, i + matchedHeads.length) + "\x1B[" + 39 + "m") + " \x1B[" + 33 + "m" + "<-------" + "\x1B[" + 39 + "m\n" + str.slice(i + matchedHeads.length, Math.min(len, i + 200)) + "\n--------------------------------------ends\n\n\nTo turn off this error being thrown, set opts.throwWhenSomethingWrongIsDetected to Boolean false.");
        }
      }
      var matchedTails = stringMatchLeftRight.matchRightIncl(str, i, tails);
      if (oneHeadFound && matchedTails && opts.matchHeadsAndTailsStrictlyInPairsByTheirOrder && strictMatchingIndex !== undefined && tails[strictMatchingIndex] !== undefined && tails[strictMatchingIndex] !== matchedTails) {
        var temp = void 0;
        for (var _z = tails.length; _z--;) {
          if (tails[_z] === matchedTails) {
            temp = _z;
            break;
          }
        }
        throw new TypeError("" + opts.source + (s ? ": [THROW_ID_20]" : "") + " When processing \"" + str + "\", we had \"opts.matchHeadsAndTailsStrictlyInPairsByTheirOrder\" on. We found heads (" + heads[strictMatchingIndex] + ") but the tails the followed it were not of the same index, " + strictMatchingIndex + " (" + tails[strictMatchingIndex] + ") but " + temp + " (" + matchedTails + ").");
      }
      if (typeof matchedTails === "string") {
        if (oneHeadFound) {
          tempResObj.tailsStartAt = i;
          tempResObj.tailsEndAt = i + matchedTails.length;
          res.push(tempResObj);
          tempResObj = {};
          oneHeadFound = false;
          i += matchedTails.length - 1;
          continue;
        } else if (opts.throwWhenSomethingWrongIsDetected) {
          tailSuspicionRaised = "" + opts.source + (s ? ": [THROW_ID_21]" : "") + " When processing \"" + str + "\", we found tails (" + str.slice(i, i + matchedTails.length) + ") starting at character with index number \"" + i + "\" but there were no heads preceding it. That's very naughty!";
        }
      }
    }
    if (opts.throwWhenSomethingWrongIsDetected && i === len - 1) {
      if (Object.keys(tempResObj).length !== 0) {
        throw new TypeError("" + opts.source + (s ? ": [THROW_ID_22]" : "") + " When processing \"" + str + "\", we reached the end of the string and yet didn't find any tails (" + JSON.stringify(tails, null, 4) + ") to match the last detected heads (" + str.slice(tempResObj.headsStartAt, tempResObj.headsEndAt) + ")!");
      } else if (tailSuspicionRaised) {
        throw new Error(tailSuspicionRaised);
      }
    }
  }
  return res;
}

exports.defaults = defaults;
exports.strFindHeadsTails = strFindHeadsTails;
exports.version = version;
