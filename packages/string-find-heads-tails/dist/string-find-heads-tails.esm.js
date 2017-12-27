import isInt from 'is-natural-number';
import isNumStr from 'is-natural-number-string';
import ordinal from 'ordinal-number-suffix';
import { matchRightIncl } from 'string-match-left-right';
import arrayiffy from 'arrayiffy-if-string';
import checkTypes from 'check-types-mini';
import isObj from 'lodash.isplainobject';
import includes from 'lodash.includes';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/* eslint no-param-reassign:0, no-continue:0, max-len:0 */

function existy(x) {
  return x != null;
}
function isStr(something) {
  return typeof something === 'string';
}
var isArr = Array.isArray;

function mandatory(i) {
  throw new Error('string-find-heads-tails: [THROW_ID_01*] Missing ' + ordinal(i) + ' parameter!');
}

function strFindHeadsTails() {
  var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : mandatory(1);
  var heads = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : mandatory(2);
  var tails = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : mandatory(3);
  var opts = arguments[3];

  // const DEBUG = 0
  //
  // insurance
  // ---------
  if (!isStr(str) || str.length === 0) {
    throw new TypeError('string-find-heads-tails: [THROW_ID_02] the first input argument, input string, must be a non-zero-length string! Currently it\'s: ' + (typeof str === 'undefined' ? 'undefined' : _typeof(str)) + ', equal to: ' + str);
  }

  var culpritsVal = void 0;
  var culpritsIndex = void 0;

  // - for heads
  if (!isStr(heads) && !isArr(heads)) {
    throw new TypeError('string-find-heads-tails: [THROW_ID_03] the second input argument, heads, must be either a string or an array of strings! Currently it\'s: ' + (typeof heads === 'undefined' ? 'undefined' : _typeof(heads)) + ', equal to:\n' + JSON.stringify(heads, null, 4));
  } else if (isStr(heads)) {
    if (heads.length === 0) {
      throw new TypeError('string-find-heads-tails: [THROW_ID_04] the second input argument, heads, must be a non-empty string! Currently it\'s empty.');
    } else {
      heads = arrayiffy(heads);
    }
  } else if (isArr(heads)) {
    if (heads.length === 0) {
      throw new TypeError('string-find-heads-tails: [THROW_ID_05] the second input argument, heads, must be a non-empty array and contain at least one string! Currently it\'s empty.');
    } else if (!heads.every(function (val, index) {
      culpritsVal = val;
      culpritsIndex = index;
      return isStr(val);
    })) {
      throw new TypeError('string-find-heads-tails: [THROW_ID_06] the second input argument, heads, contains non-string elements! For example, element at ' + ordinal(culpritsIndex) + ' index is ' + (typeof culpritsVal === 'undefined' ? 'undefined' : _typeof(culpritsVal)) + ', equal to:\n' + JSON.stringify(culpritsVal, null, 4));
    } else if (!heads.every(function (val, index) {
      culpritsIndex = index;
      return val.length > 0 && val.trim() !== '';
    })) {
      throw new TypeError('string-find-heads-tails: [THROW_ID_07] the second input argument, heads, should not contain empty strings! For example, there\'s one detected at index ' + culpritsIndex + '.');
    }
  }

  // - for tails
  if (!isStr(tails) && !isArr(tails)) {
    throw new TypeError('string-find-heads-tails: [THROW_ID_08] the third input argument, tails, must be either a string or an array of strings! Currently it\'s: ' + (typeof tails === 'undefined' ? 'undefined' : _typeof(tails)) + ', equal to:\n' + JSON.stringify(tails, null, 4));
  } else if (isStr(tails)) {
    if (tails.length === 0) {
      throw new TypeError('string-find-heads-tails: [THROW_ID_09] the third input argument, tails, must be a non-empty string! Currently it\'s empty.');
    } else {
      tails = arrayiffy(tails);
    }
  } else if (isArr(tails)) {
    if (tails.length === 0) {
      throw new TypeError('string-find-heads-tails: [THROW_ID_10] the third input argument, tails, must be a non-empty array and contain at least one string! Currently it\'s empty.');
    } else if (!tails.every(function (val, index) {
      culpritsVal = val;
      culpritsIndex = index;
      return isStr(val);
    })) {
      throw new TypeError('string-find-heads-tails: [THROW_ID_11] the third input argument, tails, contains non-string elements! For example, element at ' + ordinal(culpritsIndex) + ' index is ' + (typeof culpritsVal === 'undefined' ? 'undefined' : _typeof(culpritsVal)) + ', equal to:\n' + JSON.stringify(culpritsVal, null, 4));
    } else if (!tails.every(function (val, index) {
      culpritsIndex = index;
      return val.length > 0 && val.trim() !== '';
    })) {
      throw new TypeError('string-find-heads-tails: [THROW_ID_12] the third input argument, tails, should not contain empty strings! For example, there\'s one detected at index ' + culpritsIndex + '.');
    }
  }
  // prep opts
  if (existy(opts)) {
    if (!isObj(opts)) {
      throw new TypeError('string-find-heads-tails: [THROW_ID_13] the fourth input argument, Optional Options Object, must be a plain object! Currently it\'s: ' + (typeof opts === 'undefined' ? 'undefined' : _typeof(opts)) + ', equal to: ' + opts);
    } else if (isNumStr(opts.fromIndex, { includeZero: true })) {
      opts.fromIndex = Number(opts.fromIndex);
    }
  }
  var defaults = {
    fromIndex: 0,
    throwWhenSomethingWrongIsDetected: true,
    allowWholeValueToBeOnlyHeadsOrTails: true,
    source: 'string-find-heads-tails'
  };
  opts = Object.assign({}, defaults, opts);
  checkTypes(opts, defaults, { msg: 'string-find-heads-tails: [THROW_ID_14*]' });
  if (opts.throwWhenSomethingWrongIsDetected && !opts.allowWholeValueToBeOnlyHeadsOrTails) {
    if (includes(arrayiffy(heads), str)) {
      throw new Error(opts.source + ': [THROW_ID_16] the whole input string can\'t be equal to ' + (isStr(heads) ? '' : 'one of ') + 'heads (' + str + ')!');
    } else if (includes(arrayiffy(tails), str)) {
      throw new Error(opts.source + ': [THROW_ID_17] the whole input string can\'t be equal to ' + (isStr(tails) ? '' : 'one of ') + 'tails (' + str + ')!');
    }
  }

  if (!isInt(opts.fromIndex, { includeZero: true }) && !isNumStr(opts.fromIndex, { includeZero: true })) {
    throw new TypeError(opts.source + ': [THROW_ID_18] the fourth input argument must be a natural number! Currently it\'s: ' + opts.fromIndex);
  }

  //
  // prep stage.
  // ----
  // We are going to traverse the input string, checking each character one-by-one,
  // is it a first character of a sub-string, heads or tails.
  // The easy but inefficient algorithm is to traverse the input string, then
  // for each of the character, run another loop, slicing and matching, is there
  // one of heads or tails on the right of it.

  // Let's cut corners a little bit.

  // We know that heads and tails often start with special characters, not letters.
  // For example, "%%-" and "-%%".
  // There might be few types of heads and tails, for example, ones that will be
  // further processed (like wrapped with other strings) and ones that won't.

  // So, you might have two sets of heads and tails:
  // "%%-" and "-%%"; "%%_" and "_%%".

  // Notice they're quite similar and don't contain letters.

  // Imagine we're traversing the string and looking for above set of heads and
  // tails. We're concerned only if the current character is equal to "%", "-" or "_".
  // Practically, that "String.charCodeAt(0)" values:
  // '%'.charCodeAt(0) = 37
  // '-'.charCodeAt(0) = 45
  // '_'.charCodeAt(0) = 95

  // Since we don't know how many head and tail sets there will be nor their values,
  // conceptually, we are going to extract the RANGE OF CHARCODES, in the case above,
  // [37, 95].

  // This means, we traverse the string and check, is its charcode in range [37, 95].
  // If so, then we'll do all slicing/comparing.

  // take array of strings, heads, and extract the upper and lower range of indexes
  // of their first letters using charCodeAt(0)
  var headsAndTailsFirstCharIndexesRange = heads.concat(tails).map(function (value) {
    return value.charAt(0);
  }) // get first letters
  .reduce(function (res, val) {
    if (val.charCodeAt(0) > res[1]) {
      return [res[0], val.charCodeAt(0)]; // find the char index of the max char index out of all
    }
    if (val.charCodeAt(0) < res[0]) {
      return [val.charCodeAt(0), res[1]]; // find the char index of the min char index out of all
    }
    return res;
  }, [heads[0].charCodeAt(0), // base is the 1st char index of 1st el.
  heads[0].charCodeAt(0)]);
  // if (DEBUG) { console.log(`headsAndTailsFirstCharIndexesRange = ${JSON.stringify(headsAndTailsFirstCharIndexesRange, null, 4)}`) }

  var res = [];
  var oneHeadFound = false;
  var tempResObj = {};
  var tailSuspicionRaised = false;

  for (var i = opts.fromIndex, len = str.length; i < len; i++) {
    var firstCharsIndex = str[i].charCodeAt(0);
    // if (DEBUG) { console.log(`---------------------------------------> ${str[i]} i=${i} (#${firstCharsIndex})`) }
    if (firstCharsIndex <= headsAndTailsFirstCharIndexesRange[1] && firstCharsIndex >= headsAndTailsFirstCharIndexesRange[0]) {
      var matchedHeads = matchRightIncl(str, i, heads);
      // if (DEBUG) { console.log(`matchedHeads = ${JSON.stringify(matchedHeads, null, 4)}`) }
      if (matchedHeads) {
        if (!oneHeadFound) {
          // res[0].push(i)
          tempResObj = {};
          tempResObj.headsStartAt = i;
          tempResObj.headsEndAt = i + matchedHeads.length;
          oneHeadFound = true;
          // if (DEBUG) { console.log('head pushed') }
          // offset the index so the characters of the confirmed heads can't be "reused"
          // again for subsequent, false detections:
          i += matchedHeads.length - 1;
          if (tailSuspicionRaised) {
            tailSuspicionRaised = false;
            // if (DEBUG) { console.log(`!!! tailSuspicionRaised = ${!!tailSuspicionRaised}`) }
          }
          continue;
        } else if (opts.throwWhenSomethingWrongIsDetected) {
          throw new TypeError(opts.source + ': [THROW_ID_19] When processing "' + str + '", we found heads (' + str.slice(i, i + matchedHeads.length) + ') but there were no tails preceding it! Instead there was another set of heads before it! That\'s very naughty!');
        }
      }
      var matchedTails = matchRightIncl(str, i, tails);
      // if (DEBUG) { console.log(`matchedTails = ${JSON.stringify(matchedTails, null, 4)}`) }
      if (matchedTails) {
        if (oneHeadFound) {
          tempResObj.tailsStartAt = i;
          tempResObj.tailsEndAt = i + matchedTails.length;
          res.push(tempResObj);
          tempResObj = {};
          oneHeadFound = false;
          // if (DEBUG) { console.log('tail pushed') }
          // same for tails, offset the index to prevent partial, erroneous detections:
          i += matchedTails.length - 1;
          continue;
        } else if (opts.throwWhenSomethingWrongIsDetected) {
          // this means it's tails found, without preceding heads
          tailSuspicionRaised = opts.source + ': [THROW_ID_20] When processing "' + str + '", we found tails (' + str.slice(i, i + matchedTails.length) + ') but there were no heads preceding it. That\'s very naughty!';
          // if (DEBUG) { console.log(`!!! tailSuspicionRaised = ${!!tailSuspicionRaised}`) }
        }
      }
    }

    // closing, global checks:

    // if (DEBUG) { console.log(`tempResObj = ${JSON.stringify(tempResObj, null, 4)}`) }
    // if it's the last character and some heads were found but no tails:
    if (opts.throwWhenSomethingWrongIsDetected && i === len - 1) {
      // if (DEBUG) { console.log('1.') }
      if (Object.keys(tempResObj).length !== 0) {
        // if (DEBUG) { console.log('2.') }
        throw new TypeError(opts.source + ': [THROW_ID_21] When processing "' + str + '", we reached the end of the string and yet didn\'t find any tails (' + JSON.stringify(tails, null, 4) + ') to match the last detected heads (' + str.slice(tempResObj.headsStartAt, tempResObj.headsEndAt) + ')!');
      } else if (tailSuspicionRaised) {
        // if (DEBUG) { console.log('3.') }
        throw new Error(tailSuspicionRaised);
      }
    }
  }
  // if (DEBUG) { console.log(`final res = ${JSON.stringify(res, null, 4)}`) }
  return res;
}

export default strFindHeadsTails;
