/**
 * string-left-right
 * Look what's to the left or the right of a given index within a string
 * Version: 2.0.3
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-left-right
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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

function isNum(something) {
  return typeof something === "number";
}
function right(str, idx) {
  if (typeof str !== "string" || !str.length) {
    return null;
  }
  if (!idx || typeof idx !== "number") {
    idx = 0;
  }
  if (!str[idx + 1]) {
    return null;
  } else if (str[idx + 1] && str[idx + 1].trim().length) {
    return idx + 1;
  } else if (str[idx + 2] && str[idx + 2].trim().length) {
    return idx + 2;
  }
  for (var i = idx + 1, len = str.length; i < len; i++) {
    if (str[i].trim().length) {
      return i;
    }
  }
  return null;
}
function left(str, idx) {
  if (typeof str !== "string" || !str.length) {
    return null;
  }
  if (!idx || typeof idx !== "number") {
    idx = 0;
  }
  if (idx < 1) {
    return null;
  } else if (str[idx - 1] && str[idx - 1].trim().length) {
    return idx - 1;
  } else if (str[idx - 2] && str[idx - 2].trim().length) {
    return idx - 2;
  }
  for (var i = idx; i--;) {
    if (str[i] && str[i].trim().length) {
      return i;
    }
  }
  return null;
}
function seq(direction, str, idx, args) {
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
  for (var i = 0, len = args.length; i < len; i++) {
    if (!args[i].length) {
      continue;
    }
    var whattsOnTheSide = direction === "right" ? right(str, lastFinding) : left(str, lastFinding);
    if (direction === "right" && whattsOnTheSide > lastFinding + 1) {
      gaps.push([lastFinding + 1, whattsOnTheSide]);
    } else if (direction === "left" && whattsOnTheSide < lastFinding - 1) {
      gaps.unshift([whattsOnTheSide + 1, lastFinding]);
    }
    if (str[whattsOnTheSide] === args[i]) {
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
  return seq("left", str, idx, Array.from(args).reverse());
}
function rightSeq(str, idx) {
  for (var _len2 = arguments.length, args = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
    args[_key2 - 2] = arguments[_key2];
  }
  if (!args.length) {
    return right(str, idx);
  }
  return seq("right", str, idx, args);
}
function chompRight(str, idx) {
  if (typeof str !== "string" || !str.length) {
    return null;
  }
  if (!idx || typeof idx !== "number") {
    idx = 0;
  }
  if (!str[idx + 1]) {
    return null;
  }
  var defaults = {
    mode: 0
  };
  var opts;
  for (var _len3 = arguments.length, args = new Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
    args[_key3 - 2] = arguments[_key3];
  }
  if (_typeof(args[0]) === "object") {
    opts = Object.assign({}, defaults, args.shift());
  } else {
    opts = defaults;
  }
  if (!args.length) {
    return null;
  }
  var lastRes;
  var lastIdx;
  do {
    lastRes = rightSeq.apply(void 0, [str, isNum(lastIdx) ? lastIdx : idx].concat(args));
    if (lastRes) {
      lastIdx = lastRes.rightmostChar + 1;
    }
  } while (lastRes);
  if (!lastIdx) {
    return null;
  }
  if (str[lastIdx] && str[lastIdx].trim().length) {
    return lastIdx;
  }
  var whatsOnTheRight = right(str, lastIdx);
  if (opts.mode === 0) {
    if (!whatsOnTheRight) {
      return str.length;
    }
    if (whatsOnTheRight === lastIdx + 1) {
      return lastIdx;
    } else if (str.slice(lastIdx, whatsOnTheRight).includes("\n") || str.slice(lastIdx, whatsOnTheRight).includes("\r")) {
      for (var y = lastIdx, len = str.length; y < len; y++) {
        if ("\n\r".includes(str[y])) {
          return y;
        }
      }
    } else {
      return whatsOnTheRight - 1;
    }
  } else if (opts.mode === 1) {
    return lastIdx;
  } else if (opts.mode === 2) {
    var remainderString = str.slice(lastIdx, whatsOnTheRight ? whatsOnTheRight : str.length);
    if (remainderString.includes("\n") || remainderString.includes("\r")) {
      for (var _y = lastIdx, _len4 = str.length; _y < _len4; _y++) {
        if (str[_y].trim().length || "\n\r".includes(str[_y])) {
          return _y;
        }
      }
    } else if (whatsOnTheRight) {
      return whatsOnTheRight;
    }
    return str.length;
  } else if (opts.mode === 3) {
    return whatsOnTheRight ? whatsOnTheRight : str.length;
  }
  return null;
}

exports.left = left;
exports.right = right;
exports.rightSeq = rightSeq;
exports.leftSeq = leftSeq;
exports.chompRight = chompRight;
