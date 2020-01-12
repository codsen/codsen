/**
 * string-left-right
 * Look what's to the left or the right of a given index within a string
 * Version: 2.3.14
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-left-right
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var isObj = _interopDefault(require('lodash.isplainobject'));
var clone = _interopDefault(require('lodash.clonedeep'));

function _typeof(obj) {
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

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
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
    res.value = res.value.slice(0, res.value.length - 1);
    res.optional = true;
  } else if (res.value.endsWith("*") && res.value.length > 1) {
    res.value = res.value.slice(0, res.value.length - 1);
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
  } else if (str[idx + 1] && (!stopAtNewlines && str[idx + 1].trim().length || stopAtNewlines && (str[idx + 1].trim().length || "\n\r".includes(str[idx + 1])))) {
    return idx + 1;
  } else if (str[idx + 2] && (!stopAtNewlines && str[idx + 2].trim().length || stopAtNewlines && (str[idx + 2].trim().length || "\n\r".includes(str[idx + 2])))) {
    return idx + 2;
  }
  for (var i = idx + 1, len = str.length; i < len; i++) {
    if (str[i] && (!stopAtNewlines && str[i].trim().length || stopAtNewlines && (str[i].trim().length || "\n\r".includes(str[i])))) {
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
  } else if (str[idx - 1] && (!stopAtNewlines && str[idx - 1].trim().length || stopAtNewlines && (str[idx - 1].trim().length || "\n\r".includes(str[idx - 1])))) {
    return idx - 1;
  } else if (str[idx - 2] && (!stopAtNewlines && str[idx - 2].trim().length || stopAtNewlines && (str[idx - 2].trim().length || "\n\r".includes(str[idx - 2])))) {
    return idx - 2;
  }
  for (var i = idx; i--;) {
    if (str[i] && (!stopAtNewlines && str[i].trim().length || stopAtNewlines && (str[i].trim().length || "\n\r".includes(str[i])))) {
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
  if (direction === "right" && !str[idx + 1] || direction === "left" && !str[idx - 1]) {
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
      i++;
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
        i++;
      }
      if (direction === "right" && whattsOnTheSide > lastFinding + 1) {
        gaps.push([lastFinding + 1, whattsOnTheSide]);
      } else if (direction === "left" && whattsOnTheSide < lastFinding - 1) {
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
      i++;
      continue;
    } else if (satiated) {
      i++;
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
  if (isObj(args[0])) {
    opts = Object.assign({}, defaults, args.shift());
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
  if (isObj(args[0])) {
    opts = Object.assign({}, defaults, args.shift());
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
    lastIdx++;
  }
  if (lastIdx === null) {
    return null;
  }
  if (direction === "right") {
    if (str[lastIdx] && str[lastIdx].trim().length) {
      return lastIdx;
    }
    var whatsOnTheRight = right(str, lastIdx);
    if (opts.mode === 0) {
      if (whatsOnTheRight === lastIdx + 1) {
        return lastIdx;
      } else if (str.slice(lastIdx, whatsOnTheRight || str.length).trim().length || str.slice(lastIdx, whatsOnTheRight || str.length).includes("\n") || str.slice(lastIdx, whatsOnTheRight || str.length).includes("\r")) {
        for (var y = lastIdx, len = str.length; y < len; y++) {
          if ("\n\r".includes(str[y])) {
            return y;
          }
        }
      } else {
        return whatsOnTheRight ? whatsOnTheRight - 1 : str.length;
      }
    } else if (opts.mode === 1) {
      return lastIdx;
    } else if (opts.mode === 2) {
      var remainderString = str.slice(lastIdx);
      if (remainderString.trim().length || remainderString.includes("\n") || remainderString.includes("\r")) {
        for (var _y = lastIdx, _len3 = str.length; _y < _len3; _y++) {
          if (str[_y].trim().length || "\n\r".includes(str[_y])) {
            return _y;
          }
        }
      }
      return str.length;
    }
    return whatsOnTheRight ? whatsOnTheRight : str.length;
  }
  if (str[lastIdx] && str[lastIdx - 1] && str[lastIdx - 1].trim().length) {
    return lastIdx;
  }
  var whatsOnTheLeft = left(str, lastIdx);
  if (opts.mode === 0) {
    if (whatsOnTheLeft === lastIdx - 2) {
      return lastIdx;
    } else if (str.slice(0, lastIdx).trim().length || str.slice(0, lastIdx).includes("\n") || str.slice(0, lastIdx).includes("\r")) {
      for (var _y2 = lastIdx; _y2--;) {
        if ("\n\r".includes(str[_y2]) || str[_y2].trim().length) {
          return _y2 + 1 + (str[_y2].trim().length ? 1 : 0);
        }
      }
    }
    return 0;
  } else if (opts.mode === 1) {
    return lastIdx;
  } else if (opts.mode === 2) {
    var _remainderString = str.slice(0, lastIdx);
    if (_remainderString.trim().length || _remainderString.includes("\n") || _remainderString.includes("\r")) {
      for (var _y3 = lastIdx; _y3--;) {
        if (str[_y3].trim().length || "\n\r".includes(str[_y3])) {
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
  if (!args.length || args.length === 1 && isObj(args[0])) {
    return null;
  }
  var defaults = {
    mode: 0
  };
  if (isObj(args[0])) {
    var opts = Object.assign({}, defaults, clone(args[0]));
    if (!opts.mode) {
      opts.mode = 0;
    } else if (isStr(opts.mode) && "0123".includes(opts.mode)) {
      opts.mode = Number.parseInt(opts.mode, 10);
    } else if (!isNum(opts.mode)) {
      throw new Error("string-left-right/chompLeft(): [THROW_ID_01] the opts.mode is wrong! It should be 0, 1, 2 or 3. It was given as ".concat(opts.mode, " (type ").concat(_typeof(opts.mode), ")"));
    }
    return chomp("left", str, idx, opts, clone(args).slice(1));
  } else if (!isStr(args[0])) {
    return chomp("left", str, idx, defaults, clone(args).slice(1));
  }
  return chomp("left", str, idx, defaults, clone(args));
}
function chompRight(str, idx) {
  for (var _len5 = arguments.length, args = new Array(_len5 > 2 ? _len5 - 2 : 0), _key4 = 2; _key4 < _len5; _key4++) {
    args[_key4 - 2] = arguments[_key4];
  }
  if (!args.length || args.length === 1 && isObj(args[0])) {
    return null;
  }
  var defaults = {
    mode: 0
  };
  if (isObj(args[0])) {
    var opts = Object.assign({}, defaults, clone(args[0]));
    if (!opts.mode) {
      opts.mode = 0;
    } else if (isStr(opts.mode) && "0123".includes(opts.mode)) {
      opts.mode = Number.parseInt(opts.mode, 10);
    } else if (!isNum(opts.mode)) {
      throw new Error("string-left-right/chompRight(): [THROW_ID_02] the opts.mode is wrong! It should be 0, 1, 2 or 3. It was given as ".concat(opts.mode, " (type ").concat(_typeof(opts.mode), ")"));
    }
    return chomp("right", str, idx, opts, clone(args).slice(1));
  } else if (!isStr(args[0])) {
    return chomp("right", str, idx, defaults, clone(args).slice(1));
  }
  return chomp("right", str, idx, defaults, clone(args));
}

exports.chompLeft = chompLeft;
exports.chompRight = chompRight;
exports.left = left;
exports.leftSeq = leftSeq;
exports.leftStopAtNewLines = leftStopAtNewLines;
exports.right = right;
exports.rightSeq = rightSeq;
exports.rightStopAtNewLines = rightStopAtNewLines;
