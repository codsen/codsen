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
function existy(x) {
  return x != null;
}
function isStr(something) {
  return typeof something === "string";
}
function mandatory(i) {
  throw new Error("string-convert-indexes: [THROW_ID_01*] Missing " + ordinal(i) + " parameter!");
}
function prep(something) {
  if (typeof something === "string") {
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
    return 0;
  });
}
function strConvertIndexes(mode, str, indexes, originalOpts) {
  if (!isStr(str) || str.length === 0) {
    throw new TypeError("string-convert-indexes: [THROW_ID_02] the first input argument, input string, must be a non-zero-length string! Currently it's: " + (typeof str === "undefined" ? "undefined" : _typeof(str)) + ", equal to:\n" + str);
  }
  if (existy(originalOpts) && !isObj(originalOpts)) {
    throw new TypeError("string-convert-indexes: [THROW_ID_03] the third input argument, Optional Options Object, must be a plain object! Currently it's: " + (typeof originalOpts === "undefined" ? "undefined" : _typeof(originalOpts)) + ", equal to:\n" + originalOpts);
  }
  var defaults = {
    throwIfAnyOfTheIndexesAreOutsideOfTheReferenceString: true
  };
  var opts = Object.assign({}, defaults, originalOpts);
  checkTypes(opts, defaults, { msg: "string-convert-indexes: [THROW_ID_04*]" });
  var data = { id: 0 };
  var toDoList = [];
  if (isInt(indexes, { includeZero: true }) || isNumStr(indexes, { includeZero: true })) {
    toDoList = [{
      id: 1,
      val: indexes
    }];
  } else {
    indexes = astMonkey.traverse(indexes, function (key, val) {
      data.id += 1;
      data.val = val !== undefined ? val : key;
      if (isInt(data.val, { includeZero: true }) || isNumStr(data.val, { includeZero: true })) {
        toDoList.push(clone(data));
      }
      return data.val;
    });
  }
  if (toDoList.length === 0) {
    return indexes;
  }
  toDoList = customSort(toDoList);
  var unicodeIndex = -1;
  var surrogateDetected = false;
  for (var i = 0, len = str.length; i <= len; i++) {
    if (str[i] === undefined) {
      unicodeIndex += 1;
    } else if (str[i].charCodeAt(0) >= 55296 && str[i].charCodeAt(0) <= 57343) {
      if (surrogateDetected !== true) {
        unicodeIndex += 1;
        surrogateDetected = true;
      } else {
        surrogateDetected = false;
      }
    } else {
      unicodeIndex += 1;
      if (surrogateDetected === true) {
        surrogateDetected = false;
      }
    }
    if (mode === "n") {
      for (var y = 0, leny = toDoList.length; y < leny; y++) {
        if (prep(toDoList[y].val) === i) {
          toDoList[y].res = isStr(toDoList[y].val) ? String(unicodeIndex) : unicodeIndex;
        } else if (prep(toDoList[y].val) > i) {
          break;
        }
      }
    } else {
      for (var _y = 0, _leny = toDoList.length; _y < _leny; _y++) {
        if (prep(toDoList[_y].val) === unicodeIndex && toDoList[_y].res === undefined) {
          toDoList[_y].res = isStr(toDoList[_y].val) ? String(i) : i;
        } else if (prep(toDoList[_y].val) > unicodeIndex) {
          break;
        }
      }
    }
    if (opts.throwIfAnyOfTheIndexesAreOutsideOfTheReferenceString && i === len - 1 && (mode === "n" && prep(toDoList[toDoList.length - 1].val) > len || mode === "u" && prep(toDoList[toDoList.length - 1].val) > unicodeIndex + 1)) {
      if (mode === "n") {
        throw new Error("string-convert-indexes: [THROW_ID_05] the reference string has native JS string indexes going only upto " + i + ", but you are trying to convert an index larger than that, " + prep(toDoList[toDoList.length - 1].val));
      } else {
        throw new Error("string-convert-indexes: [THROW_ID_06] the reference string has Unicode character count going only upto " + unicodeIndex + ", but you are trying to convert an index larger than that, " + prep(toDoList[toDoList.length - 1].val));
      }
    }
  }
  if (isInt(indexes, { includeZero: true }) || isNumStr(indexes, { includeZero: true })) {
    return toDoList[0].res !== undefined ? toDoList[0].res : toDoList[0].val;
  }
  var res = clone(indexes);
  for (var z = toDoList.length; z--;) {
    res = astMonkey.set(res, {
      index: toDoList[z].id,
      val: toDoList[z].res !== undefined ? toDoList[z].res : toDoList[z].val
    });
  }
  return res;
}
function nativeToUnicode() {
  var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : mandatory(1);
  var indexes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : mandatory(2);
  var opts = arguments[2];
  return strConvertIndexes("n", str, indexes, opts);
}
function unicodeToNative() {
  var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : mandatory(1);
  var indexes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : mandatory(2);
  var opts = arguments[2];
  return strConvertIndexes("u", str, indexes, opts);
}

exports.nativeToUnicode = nativeToUnicode;
exports.unicodeToNative = unicodeToNative;
