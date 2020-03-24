/**
 * string-convert-indexes
 * Convert string character indexes from JS native index-based to Unicode character-count-based and backwards.
 * Version: 1.10.2
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-convert-indexes
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var astMonkey = require('ast-monkey');
var clone = _interopDefault(require('lodash.clonedeep'));

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function existy(x) {
  return x != null;
}
function isStr(something) {
  return typeof something === "string";
}
function isObj(something) {
  return something && _typeof(something) === "object" && !Array.isArray(something);
}
function mandatory(i) {
  throw new Error("string-convert-indexes: [THROW_ID_01*] Missing ".concat(i, "th parameter!"));
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
    throw new TypeError("string-convert-indexes: [THROW_ID_02] the first input argument, input string, must be a non-zero-length string! Currently it's: ".concat(_typeof(str), ", equal to:\n").concat(str));
  }
  if (existy(originalOpts) && !isObj(originalOpts)) {
    throw new TypeError("string-convert-indexes: [THROW_ID_03] the third input argument, Optional Options Object, must be a plain object! Currently it's: ".concat(_typeof(originalOpts), ", equal to:\n").concat(originalOpts));
  }
  var defaults = {
    throwIfAnyOfTheIndexesAreOutsideOfTheReferenceString: true
  };
  var opts = Object.assign({}, defaults, originalOpts);
  var data = {
    id: 0
  };
  var toDoList = [];
  if (Number.isInteger(indexes) && indexes >= 0 || /^\d*$/.test(indexes)) {
    toDoList = [{
      id: 1,
      val: indexes
    }];
  } else {
    indexes = astMonkey.traverse(indexes, function (key, val) {
      data.id += 1;
      data.val = val !== undefined ? val : key;
      if (Number.isInteger(data.val) && data.val >= 0 || /^\d*$/.test(data.val)) {
        toDoList.push(_objectSpread2({}, data));
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
        throw new Error("string-convert-indexes: [THROW_ID_05] the reference string has native JS string indexes going only upto ".concat(i, ", but you are trying to convert an index larger than that, ").concat(prep(toDoList[toDoList.length - 1].val)));
      } else {
        throw new Error("string-convert-indexes: [THROW_ID_06] the reference string has Unicode character count going only upto ".concat(unicodeIndex, ", but you are trying to convert an index larger than that, ").concat(prep(toDoList[toDoList.length - 1].val)));
      }
    }
  }
  if (Number.isInteger(indexes) && indexes >= 0 || /^\d*$/.test(indexes)) {
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
  var opts = arguments.length > 2 ? arguments[2] : undefined;
  return strConvertIndexes("n", str, indexes, opts);
}
function unicodeToNative() {
  var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : mandatory(1);
  var indexes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : mandatory(2);
  var opts = arguments.length > 2 ? arguments[2] : undefined;
  return strConvertIndexes("u", str, indexes, opts);
}

exports.nativeToUnicode = nativeToUnicode;
exports.unicodeToNative = unicodeToNative;
