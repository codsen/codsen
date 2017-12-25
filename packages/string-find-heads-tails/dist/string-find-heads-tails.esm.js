import isInt from 'is-natural-number';
import isNumStr from 'is-natural-number-string';
import ordinal from 'ordinal-number-suffix';
import { matchRightIncl } from 'string-match-left-right';
import arrayiffy from 'arrayiffy-if-string';

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
  var fromIndex = arguments[3];

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
    throw new TypeError('str-find-tails-tails: [THROW_ID_08] the third input argument, tails, must be either a string or an array of strings! Currently it\'s: ' + (typeof tails === 'undefined' ? 'undefined' : _typeof(tails)) + ', equal to:\n' + JSON.stringify(tails, null, 4));
  } else if (isStr(tails)) {
    if (tails.length === 0) {
      throw new TypeError('str-find-tails-tails: [THROW_ID_09] the third input argument, tails, must be a non-empty string! Currently it\'s empty.');
    } else {
      tails = arrayiffy(tails);
    }
  } else if (isArr(tails)) {
    if (tails.length === 0) {
      throw new TypeError('str-find-tails-tails: [THROW_ID_10] the third input argument, tails, must be a non-empty array and contain at least one string! Currently it\'s empty.');
    } else if (!tails.every(function (val, index) {
      culpritsVal = val;
      culpritsIndex = index;
      return isStr(val);
    })) {
      throw new TypeError('str-find-tails-tails: [THROW_ID_11] the third input argument, tails, contains non-string elements! For example, element at ' + ordinal(culpritsIndex) + ' index is ' + (typeof culpritsVal === 'undefined' ? 'undefined' : _typeof(culpritsVal)) + ', equal to:\n' + JSON.stringify(culpritsVal, null, 4));
    } else if (!tails.every(function (val, index) {
      culpritsIndex = index;
      return val.length > 0 && val.trim() !== '';
    })) {
      throw new TypeError('str-find-tails-tails: [THROW_ID_12] the third input argument, tails, should not contain empty strings! For example, there\'s one detected at index ' + culpritsIndex + '.');
    }
  }

  if (existy(fromIndex)) {
    if (!isInt(fromIndex, { includeZero: true }) && !isNumStr(fromIndex, { includeZero: true })) {
      throw new TypeError('string-find-heads-tails: [THROW_ID_13] the fourth input argument must be a natural number! Currently it\'s: ' + fromIndex);
    } else if (isNumStr(fromIndex, { includeZero: true })) {
      fromIndex = Number(fromIndex);
    }
  } else {
    fromIndex = 0;
  }

  //
  // prep
  // ----
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
  // console.log(`headsAndTailsFirstCharIndexesRange = ${JSON.stringify(headsAndTailsFirstCharIndexesRange, null, 4)}`)

  var res = [[], []]; // first sub-array is for found head indexes, second is for tails'
  var oneHeadFound = false;

  for (var i = fromIndex, len = str.length; i < len; i++) {
    var firstCharsIndex = str[i].charCodeAt(0);
    // console.log(`---------------------------------------> ${str[i]} i=${i} (#${firstCharsIndex})`)
    if (firstCharsIndex <= headsAndTailsFirstCharIndexesRange[1] && firstCharsIndex >= headsAndTailsFirstCharIndexesRange[0]) {
      var matchedHeads = matchRightIncl(str, i, heads);
      if (!oneHeadFound && matchedHeads) {
        res[0].push(i);
        oneHeadFound = true;
        // console.log('head pushed')
        // offset the index so the characters of the confirmed heads can't be "reused"
        // again for subsequent, false detections:
        i += matchedHeads.length - 1;
        continue;
      }
      var matchedTails = matchRightIncl(str, i, tails);
      if (oneHeadFound && matchedTails) {
        res[1].push(i);
        oneHeadFound = false;
        // console.log('tail pushed')
        // same for tails, offset the index to prevent partial, erroneous detections:
        i += matchedTails.length - 1;
        continue;
      }
    }
  }
  // console.log(`final res = ${JSON.stringify(res, null, 4)}`)
  return res;
}

export default strFindHeadsTails;
