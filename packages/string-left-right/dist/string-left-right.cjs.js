/**
 * string-left-right
 * Looks up the first non-whitespace character to the left/right of a given index
 * Version: 2.3.32
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/string-left-right/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var isObj = require('lodash.isplainobject');
var clone = require('lodash.clonedeep');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var isObj__default = /*#__PURE__*/_interopDefaultLegacy(isObj);
var clone__default = /*#__PURE__*/_interopDefaultLegacy(clone);

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

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function x(something) {
  var res = {
    value: something,
    hungry: false,
    optional: false
  };
  if ((res.value.endsWith("?*") || res.value.endsWith("*?")) && res.value.length > 2) {
    res.value = res.value.slice(0, res.value.length - 2);
    res.optional = true;
    res.hungry = true;
  } else if (res.value.endsWith("?") && res.value.length > 1) {
    res.value = res.value.slice(0, ~-res.value.length);
    res.optional = true;
  } else if (res.value.endsWith("*") && res.value.length > 1) {
    res.value = res.value.slice(0, ~-res.value.length);
    res.hungry = true;
  }
  return res;
}
function isNum(something) {
  return typeof something === "number";
}
function isStr(something) {
  return typeof something === "string";
}
function rightMain(str, idx, stopAtNewlines) {
  if (typeof str !== "string" || !str.length) {
    return null;
  }
  if (!idx || typeof idx !== "number") {
    idx = 0;
  }
  if (!str[idx + 1]) {
    return null;
  }
  if (str[idx + 1] && (!stopAtNewlines && str[idx + 1].trim() || stopAtNewlines && (str[idx + 1].trim() || "\n\r".includes(str[idx + 1])))) {
    return idx + 1;
  }
  if (str[idx + 2] && (!stopAtNewlines && str[idx + 2].trim() || stopAtNewlines && (str[idx + 2].trim() || "\n\r".includes(str[idx + 2])))) {
    return idx + 2;
  }
  for (var i = idx + 1, len = str.length; i < len; i++) {
    if (str[i] && (!stopAtNewlines && str[i].trim() || stopAtNewlines && (str[i].trim() || "\n\r".includes(str[i])))) {
      return i;
    }
  }
  return null;
}
function right(str, idx) {
  return rightMain(str, idx, false);
}
function rightStopAtNewLines(str, idx) {
  return rightMain(str, idx, true);
}
function leftMain(str, idx, stopAtNewlines) {
  if (typeof str !== "string" || !str.length) {
    return null;
  }
  if (!idx || typeof idx !== "number") {
    idx = 0;
  }
  if (idx < 1) {
    return null;
  }
  if (
  str[~-idx] && (!stopAtNewlines && str[~-idx].trim() || stopAtNewlines && (str[~-idx].trim() || "\n\r".includes(str[~-idx])))) {
    return ~-idx;
  }
  if (str[idx - 2] && (!stopAtNewlines && str[idx - 2].trim() || stopAtNewlines && (str[idx - 2].trim() || "\n\r".includes(str[idx - 2])))) {
    return idx - 2;
  }
  for (var i = idx; i--;) {
    if (str[i] && (!stopAtNewlines && str[i].trim() || stopAtNewlines && (str[i].trim() || "\n\r".includes(str[i])))) {
      return i;
    }
  }
  return null;
}
function left(str, idx) {
  return leftMain(str, idx, false);
}
function leftStopAtNewLines(str, idx) {
  return leftMain(str, idx, true);
}
function seq(direction, str, idx, opts, args) {
  if (typeof str !== "string" || !str.length) {
    return null;
  }
  if (!idx || typeof idx !== "number") {
    idx = 0;
  }
  if (direction === "right" && !str[idx + 1] || direction === "left" && !str[~-idx]) {
    return null;
  }
  var lastFinding = idx;
  var gaps = [];
  var leftmostChar;
  var rightmostChar;
  var satiated;
  var i = 0;
  while (i < args.length) {
    if (!isStr(args[i]) || !args[i].length) {
      i += 1;
      continue;
    }
    var _x = x(args[i]),
        value = _x.value,
        optional = _x.optional,
        hungry = _x.hungry;
    var whattsOnTheSide = direction === "right" ? right(str, lastFinding) : left(str, lastFinding);
    if (opts.i && str[whattsOnTheSide].toLowerCase() === value.toLowerCase() || !opts.i && str[whattsOnTheSide] === value) {
      var temp = direction === "right" ? right(str, whattsOnTheSide) : left(str, whattsOnTheSide);
      if (hungry && (opts.i && str[temp].toLowerCase() === value.toLowerCase() || !opts.i && str[temp] === value)) {
        satiated = true;
      } else {
        i += 1;
      }
      if (direction === "right" && whattsOnTheSide > lastFinding + 1) {
        gaps.push([lastFinding + 1, whattsOnTheSide]);
      } else if (direction === "left" && whattsOnTheSide < ~-lastFinding) {
        gaps.unshift([whattsOnTheSide + 1, lastFinding]);
      }
      lastFinding = whattsOnTheSide;
      if (direction === "right") {
        if (leftmostChar === undefined) {
          leftmostChar = whattsOnTheSide;
        }
        rightmostChar = whattsOnTheSide;
      } else {
        if (rightmostChar === undefined) {
          rightmostChar = whattsOnTheSide;
        }
        leftmostChar = whattsOnTheSide;
      }
    } else if (optional) {
      i += 1;
      continue;
    } else if (satiated) {
      i += 1;
      satiated = undefined;
      continue;
    } else {
      return null;
    }
  }
  if (leftmostChar === undefined) {
    return null;
  }
  return {
    gaps: gaps,
    leftmostChar: leftmostChar,
    rightmostChar: rightmostChar
  };
}
function leftSeq(str, idx) {
  for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }
  if (!args.length) {
    return left(str, idx);
  }
  var defaults = {
    i: false
  };
  var opts;
  if (isObj__default['default'](args[0])) {
    opts = _objectSpread2(_objectSpread2({}, defaults), args.shift());
  } else {
    opts = defaults;
  }
  return seq("left", str, idx, opts, Array.from(args).reverse());
}
function rightSeq(str, idx) {
  for (var _len2 = arguments.length, args = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
    args[_key2 - 2] = arguments[_key2];
  }
  if (!args.length) {
    return right(str, idx);
  }
  var defaults = {
    i: false
  };
  var opts;
  if (isObj__default['default'](args[0])) {
    opts = _objectSpread2(_objectSpread2({}, defaults), args.shift());
  } else {
    opts = defaults;
  }
  return seq("right", str, idx, opts, args);
}
function chomp(direction, str, idx, opts, args) {
  if (typeof str !== "string" || !str.length) {
    return null;
  }
  if (!idx || typeof idx !== "number") {
    idx = 0;
  }
  if (direction === "right" && !str[idx + 1] || direction === "left" && (isNum(idx) && idx < 1 || idx === "0")) {
    return null;
  }
  var lastRes = null;
  var lastIdx = null;
  do {
    lastRes = direction === "right" ? rightSeq.apply(void 0, [str, isNum(lastIdx) ? lastIdx : idx].concat(_toConsumableArray(args))) : leftSeq.apply(void 0, [str, isNum(lastIdx) ? lastIdx : idx].concat(_toConsumableArray(args)));
    if (lastRes !== null) {
      lastIdx = direction === "right" ? lastRes.rightmostChar : lastRes.leftmostChar;
    }
  } while (lastRes);
  if (lastIdx != null && direction === "right") {
    lastIdx += 1;
  }
  if (lastIdx === null) {
    return null;
  }
  if (direction === "right") {
    if (str[lastIdx] && str[lastIdx].trim()) {
      return lastIdx;
    }
    var whatsOnTheRight = right(str, lastIdx);
    if (opts.mode === 0) {
      if (whatsOnTheRight === lastIdx + 1) {
        return lastIdx;
      }
      if (str.slice(lastIdx, whatsOnTheRight || str.length).trim() || str.slice(lastIdx, whatsOnTheRight || str.length).includes("\n") || str.slice(lastIdx, whatsOnTheRight || str.length).includes("\r")) {
        for (var y = lastIdx, len = str.length; y < len; y++) {
          if ("\n\r".includes(str[y])) {
            return y;
          }
        }
      } else {
        return whatsOnTheRight ? ~-whatsOnTheRight : str.length;
      }
    } else if (opts.mode === 1) {
      return lastIdx;
    } else if (opts.mode === 2) {
      var remainderString = str.slice(lastIdx);
      if (remainderString.trim() || remainderString.includes("\n") || remainderString.includes("\r")) {
        for (var _y = lastIdx, _len3 = str.length; _y < _len3; _y++) {
          if (str[_y].trim() || "\n\r".includes(str[_y])) {
            return _y;
          }
        }
      }
      return str.length;
    }
    return whatsOnTheRight || str.length;
  }
  if (str[lastIdx] && str[~-lastIdx] && str[~-lastIdx].trim()) {
    return lastIdx;
  }
  var whatsOnTheLeft = left(str, lastIdx);
  if (opts.mode === 0) {
    if (whatsOnTheLeft === lastIdx - 2) {
      return lastIdx;
    }
    if (str.slice(0, lastIdx).trim() || str.slice(0, lastIdx).includes("\n") || str.slice(0, lastIdx).includes("\r")) {
      for (var _y2 = lastIdx; _y2--;) {
        if ("\n\r".includes(str[_y2]) || str[_y2].trim()) {
          return _y2 + 1 + (str[_y2].trim() ? 1 : 0);
        }
      }
    }
    return 0;
  }
  if (opts.mode === 1) {
    return lastIdx;
  }
  if (opts.mode === 2) {
    var _remainderString = str.slice(0, lastIdx);
    if (_remainderString.trim() || _remainderString.includes("\n") || _remainderString.includes("\r")) {
      for (var _y3 = lastIdx; _y3--;) {
        if (str[_y3].trim() || "\n\r".includes(str[_y3])) {
          return _y3 + 1;
        }
      }
    }
    return 0;
  }
  return whatsOnTheLeft !== null ? whatsOnTheLeft + 1 : 0;
}
function chompLeft(str, idx) {
  for (var _len4 = arguments.length, args = new Array(_len4 > 2 ? _len4 - 2 : 0), _key3 = 2; _key3 < _len4; _key3++) {
    args[_key3 - 2] = arguments[_key3];
  }
  if (!args.length || args.length === 1 && isObj__default['default'](args[0])) {
    return null;
  }
  var defaults = {
    mode: 0
  };
  if (isObj__default['default'](args[0])) {
    var opts = _objectSpread2(_objectSpread2({}, defaults), clone__default['default'](args[0]));
    if (!opts.mode) {
      opts.mode = 0;
    } else if (isStr(opts.mode) && "0123".includes(opts.mode)) {
      opts.mode = Number.parseInt(opts.mode, 10);
    } else if (!isNum(opts.mode)) {
      throw new Error("string-left-right/chompLeft(): [THROW_ID_01] the opts.mode is wrong! It should be 0, 1, 2 or 3. It was given as ".concat(opts.mode, " (type ").concat(_typeof(opts.mode), ")"));
    }
    return chomp("left", str, idx, opts, clone__default['default'](args).slice(1));
  }
  if (!isStr(args[0])) {
    return chomp("left", str, idx, defaults, clone__default['default'](args).slice(1));
  }
  return chomp("left", str, idx, defaults, clone__default['default'](args));
}
function chompRight(str, idx) {
  for (var _len5 = arguments.length, args = new Array(_len5 > 2 ? _len5 - 2 : 0), _key4 = 2; _key4 < _len5; _key4++) {
    args[_key4 - 2] = arguments[_key4];
  }
  if (!args.length || args.length === 1 && isObj__default['default'](args[0])) {
    return null;
  }
  var defaults = {
    mode: 0
  };
  if (isObj__default['default'](args[0])) {
    var opts = _objectSpread2(_objectSpread2({}, defaults), clone__default['default'](args[0]));
    if (!opts.mode) {
      opts.mode = 0;
    } else if (isStr(opts.mode) && "0123".includes(opts.mode)) {
      opts.mode = Number.parseInt(opts.mode, 10);
    } else if (!isNum(opts.mode)) {
      throw new Error("string-left-right/chompRight(): [THROW_ID_02] the opts.mode is wrong! It should be 0, 1, 2 or 3. It was given as ".concat(opts.mode, " (type ").concat(_typeof(opts.mode), ")"));
    }
    return chomp("right", str, idx, opts, clone__default['default'](args).slice(1));
  }
  if (!isStr(args[0])) {
    return chomp("right", str, idx, defaults, clone__default['default'](args).slice(1));
  }
  return chomp("right", str, idx, defaults, clone__default['default'](args));
}

exports.chompLeft = chompLeft;
exports.chompRight = chompRight;
exports.left = left;
exports.leftSeq = leftSeq;
exports.leftStopAtNewLines = leftStopAtNewLines;
exports.right = right;
exports.rightSeq = rightSeq;
exports.rightStopAtNewLines = rightStopAtNewLines;
