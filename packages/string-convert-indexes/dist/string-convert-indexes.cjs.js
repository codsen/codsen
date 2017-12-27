'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var astMonkey = require('ast-monkey');
var isInt = _interopDefault(require('is-natural-number'));
var isNumStr = _interopDefault(require('is-natural-number-string'));
var ordinal = _interopDefault(require('ordinal-number-suffix'));
var checkTypes = _interopDefault(require('check-types-mini'));
var isObj = _interopDefault(require('lodash.isplainobject'));
var clone = _interopDefault(require('lodash.clonedeep'));

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/* eslint no-param-reassign:0, max-len:0 */

function existy(x) {
  return x != null;
}
function isStr(something) {
  return typeof something === 'string';
}
function mandatory(i) {
  throw new Error('string-convert-indexes: [THROW_ID_01*] Missing ' + ordinal(i) + ' parameter!');
}

function prep(something) {
  if (typeof something === 'string') {
    return parseInt(something, 10);
  }
  return something;
}
function customSort(arr) {
  return arr.sort(function (a, b) {
    if (prep(a.val) < prep(b.val)) {
      return -1;
    }
    if (prep(a.val) > prep(b.val)) {
      return 1;
    }
    // val's must be equal
    return 0;
  });
}

// inner function, common for both external API's methods that does the job:
function strConvertIndexes(mode, str, indexes, originalOpts) {
  // const DEBUG = 1
  //
  // insurance
  // ---------
  if (!isStr(str) || str.length === 0) {
    throw new TypeError('string-convert-indexes: [THROW_ID_02] the first input argument, input string, must be a non-zero-length string! Currently it\'s: ' + (typeof str === 'undefined' ? 'undefined' : _typeof(str)) + ', equal to:\n' + str);
  }
  if (existy(originalOpts) && !isObj(originalOpts)) {
    throw new TypeError('string-convert-indexes: [THROW_ID_03] the third input argument, Optional Options Object, must be a plain object! Currently it\'s: ' + (typeof originalOpts === 'undefined' ? 'undefined' : _typeof(originalOpts)) + ', equal to:\n' + originalOpts);
  }
  // prep the opts
  var defaults = {
    throwIfAnyOfTheIndexesAreOutsideOfTheReferenceString: true
  };
  var opts = Object.assign({}, defaults, originalOpts);
  checkTypes(opts, defaults, { msg: 'string-convert-indexes: [THROW_ID_04*]' });

  // this simple counter will later act as the "address" to each finding and will
  // be used in set() method to convert the value at this "address" within tree:
  var data = { id: 0

    // during the first traversal we'll gather the list of natural number values
    // and their "addresses", id numbers used internally within ast-monkey.
  };var toDoList = [];

  // STEP 1.
  // ---------------------------------------------------------------------------

  // if it's a number, there's no need to traverse:
  if (isInt(indexes, { includeZero: true }) || isNumStr(indexes, { includeZero: true })) {
    toDoList = [{
      id: 1,
      val: indexes
    }];
  } else {
    // traverse the indexes and compile the sorted list of them, along with their "addresses",
    // or id numbers, by which they can later be called using "ast-monkey":
    indexes = astMonkey.traverse(indexes, function (key, val) {
      data.id += 1;
      data.val = val !== undefined ? val : key;
      if (isInt(data.val, { includeZero: true }) || isNumStr(data.val, { includeZero: true })) {
        toDoList.push(clone(data));
      }
      return data.val;
    });
  }

  // STEP 2.
  // ---------------------------------------------------------------------------
  // sort the toDoList by string indexes, that is, toDoList[?].val, and account
  // for cases when the value is numeric string:

  // if there's nothing to work upon, bail:
  if (toDoList.length === 0) {
    return indexes;
  }
  toDoList = customSort(toDoList);
  // if (DEBUG) { console.log(`STEP 2. FINAL toDoList = ${JSON.stringify(toDoList, null, 4)}`) }

  // STEP 3.
  // ---------------------------------------------------------------------------
  // traverse the input string and covert all indexes:
  //
  // astral chars have first character: from 55296 to 56319
  // and second character: from 56320 to 57343

  var unicodeIndex = -1;
  var surrogateDetected = false;
  for (var i = 0, len = str.length; i <= len; i++) {
    // if (DEBUG) { console.log(`---------------------------------------- ${str[i]}  (${i})`) }
    // if (DEBUG) { console.log(`* surrogateDetected was ${JSON.stringify(surrogateDetected, null, 4)}`) }
    // if (DEBUG) { console.log(`* unicodeIndex was ${JSON.stringify(unicodeIndex, null, 4)}`) }
    //
    //    PART 1. Bean-counting
    //    =====================
    //
    // so the JS native index is "i"
    // we just need to keep track of Unicode character count

    if (str[i] === undefined) {
      // this means it's the first character outside of the input characters.
      // we can convert it nonetheless.
      unicodeIndex += 1;
    } else if (str[i].charCodeAt(0) >= 55296 && str[i].charCodeAt(0) <= 57343) {
      // if it's one of surrogate pair characters:

      // if there is no preceding surrogate:
      if (surrogateDetected !== true) {
        unicodeIndex += 1;
        // if (DEBUG) { console.log(`! unicodeIndex now ${JSON.stringify(unicodeIndex, null, 4)}`) }
        surrogateDetected = true;
        // if (DEBUG) { console.log(`! surrogateDetected now ${JSON.stringify(surrogateDetected, null, 4)}`) }
      } else {
        // if there is preceding surrogate - don't bump the Unicode char counter

        // but reset the flag, because astral symbols come in pairs
        surrogateDetected = false;
        // if (DEBUG) { console.log(`! surrogateDetected now ${JSON.stringify(surrogateDetected, null, 4)}`) }
      }
    } else {
      // not surrogate:

      // bump the counter:
      unicodeIndex += 1;
      // if (DEBUG) { console.log(`! unicodeIndex now ${JSON.stringify(unicodeIndex, null, 4)}`) }
      // reset the flag:
      if (surrogateDetected === true) {
        surrogateDetected = false;
        // if (DEBUG) { console.log(`! surrogateDetected now ${JSON.stringify(surrogateDetected, null, 4)}`) }
      }
    }

    // if (DEBUG) { console.log(`\n---> unicodeIndex:      ${unicodeIndex}`) }
    // if (DEBUG) { console.log(`---> surrogateDetected: ${surrogateDetected}\n`) }

    //       PART 2. Action
    //       ==============
    //
    // take the first object from toDoList and convert its index
    if (mode === 'n') {
      // native to Unicode conversion

      // there can be multiple values in the toDoList with the same index that
      // needs to be converting, thus we need to loop the toDoList
      for (var y = 0, leny = toDoList.length; y < leny; y++) {
        if (prep(toDoList[y].val) === i) {
          toDoList[y].res = isStr(toDoList[y].val) ? String(unicodeIndex) : unicodeIndex;
        } else if (prep(toDoList[y].val) > i) {
          break; // since toDoList is sorted, all other values will be not smaller too
        }
      }
    } else {
      // Unicode to native conversion

      // same start, loop the toDoList
      for (var _y = 0, _leny = toDoList.length; _y < _leny; _y++) {
        // this second condition prevents from the event happening twice, on
        // each of the surrogates, and on that second occurence overwriting the
        // index "i" with "i+1" which leads to an error. Astral character at
        // zero index position would get converted to index native index one.
        if (prep(toDoList[_y].val) === unicodeIndex && toDoList[_y].res === undefined) {
          toDoList[_y].res = isStr(toDoList[_y].val) ? String(i) : i;
        } else if (prep(toDoList[_y].val) > unicodeIndex) {
          break; // since toDoList is sorted, all other values will be not smaller too
        }
      }
    }

    // if it's the reference string's last character being traversed, check,
    // does its index cover the largest of the toDoList index (last element),
    // because if it does not, this means somebody is trying to convert the index
    // without giving enough characters in the reference string to calculate the
    // conversion:
    if (opts.throwIfAnyOfTheIndexesAreOutsideOfTheReferenceString && i === len - 1 && (mode === 'n' && prep(toDoList[toDoList.length - 1].val) > len || mode === 'u' && prep(toDoList[toDoList.length - 1].val) > unicodeIndex + 1)) {
      if (mode === 'n') {
        throw new Error('string-convert-indexes: [THROW_ID_05] the reference string has native JS string indexes going only upto ' + i + ', but you are trying to convert an index larger than that, ' + prep(toDoList[toDoList.length - 1].val));
      } else {
        throw new Error('string-convert-indexes: [THROW_ID_06] the reference string has Unicode character count going only upto ' + unicodeIndex + ', but you are trying to convert an index larger than that, ' + prep(toDoList[toDoList.length - 1].val));
      }
    }
  }

  //       PART 3. Result
  //       ==============

  // if (DEBUG) { console.log(`\n\n\nFINAL toDoList = ${JSON.stringify(toDoList, null, 4)}`) }

  if (isInt(indexes, { includeZero: true }) || isNumStr(indexes, { includeZero: true })) {
    return toDoList[0].res !== undefined ? toDoList[0].res : toDoList[0].val;
  }

  // The result's base is original indexes from the input. Clone it.
  var res = clone(indexes);

  // backwards-loop the toDoList for efficiency, mutate the res on each step:
  for (var z = toDoList.length; z--;) {
    // we will use the "set" method from ast-monkey, which sets the value by id number:
    res = astMonkey.set(res, { index: toDoList[z].id, val: toDoList[z].res !== undefined ? toDoList[z].res : toDoList[z].val });
  }

  return res;
}

function nativeToUnicode() {
  var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : mandatory(1);
  var indexes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : mandatory(2);
  var opts = arguments[2];

  return strConvertIndexes('n', str, indexes, opts);
}

function unicodeToNative() {
  var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : mandatory(1);
  var indexes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : mandatory(2);
  var opts = arguments[2];

  return strConvertIndexes('u', str, indexes, opts);
}

exports.nativeToUnicode = nativeToUnicode;
exports.unicodeToNative = unicodeToNative;
