/**
 * string-left-right
 * Look what's to the left or the right of a given index within a string
 * Version: 2.1.6
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
  if (something.endsWith("?")) {
    return {
      value: something.slice(0, something.length - 1),
      optional: true
    };
  }
  return {
    value: something,
    optional: false
  };
}
function isNum(something) {
  return typeof something === "number";
}
function isStr(something) {
  return typeof something === "string";
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
function seq(direction, str, idx, opts, args) {
  console.log("150 seq() called:");
  console.log("151 args: ".concat(JSON.stringify(Array.prototype.slice.call(arguments), null, 4)));
  if (typeof str !== "string" || !str.length) {
    return null;
  }
  if (!idx || typeof idx !== "number") {
    idx = 0;
  }
  if (direction === "right" && !str[idx + 1] || direction === "left" && !str[idx - 1]) {
    console.log("163 RETURN null");
    return null;
  }
  var lastFinding = idx;
  console.log("171 Set lastFinding = ".concat(lastFinding, ". Starting the loop."));
  var gaps = [];
  var leftmostChar;
  var rightmostChar;
  for (var i = 0, len = args.length; i < len; i++) {
    if (!isStr(args[i]) || !args[i].length) {
      console.log("181 continue because ".concat(JSON.stringify(args[i], null, 4), " is not a non-empty string"));
      continue;
    }
    console.log("190 ".concat("\x1B[".concat(36, "m", "============= args[".concat(i, "]=").concat(args[i]), "\x1B[", 39, "m")));
    var _x = x(args[i]),
        value = _x.value,
        optional = _x.optional;
    console.log("196 ".concat("\x1B[".concat(33, "m", "value", "\x1B[", 39, "m"), " = ", JSON.stringify(value, null, 4)));
    console.log("203 ".concat("\x1B[".concat(33, "m", "optional", "\x1B[", 39, "m"), " = ", JSON.stringify(optional, null, 4)));
    var whattsOnTheSide = direction === "right" ? right(str, lastFinding) : left(str, lastFinding);
    if (opts.i && str[whattsOnTheSide].toLowerCase() === value.toLowerCase() || !opts.i && str[whattsOnTheSide] === value) {
      console.log("217 SET whattsOnTheSide = ".concat(whattsOnTheSide, " (").concat(str[whattsOnTheSide], ")"));
      if (direction === "right" && whattsOnTheSide > lastFinding + 1) {
        console.log("224 push gap [".concat(lastFinding + 1, ", ").concat(whattsOnTheSide, "]"));
        gaps.push([lastFinding + 1, whattsOnTheSide]);
      } else if (direction === "left" && whattsOnTheSide < lastFinding - 1) {
        console.log("227 unshift gap [".concat(whattsOnTheSide + 1, ", ").concat(lastFinding, "]"));
        gaps.unshift([whattsOnTheSide + 1, lastFinding]);
      }
      console.log("230 ".concat("\x1B[".concat(32, "m", value, " MATCHED!\x1B[", 39, "m")));
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
      console.log("248 SET lastFinding = ".concat(lastFinding));
    } else if (optional) {
      console.log("251 ".concat("\x1B[".concat(32, "m", "CONTINUE", "\x1B[", 39, "m"), " because it was optional"));
      continue;
    } else {
      console.log("255 RETURN null");
      return null;
    }
  }
  console.log("259 FINAL gaps = ".concat(JSON.stringify(gaps, null, 4)));
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
    console.log("297 leftSeq() calling left()");
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
  console.log("310 leftSeq() ".concat("\x1B[".concat(33, "m", "opts", "\x1B[", 39, "m"), " = ", JSON.stringify(opts, null, 4)));
  console.log("317 leftSeq() calling seq()");
  return seq("left", str, idx, opts, Array.from(args).reverse());
}
function rightSeq(str, idx) {
  for (var _len2 = arguments.length, args = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
    args[_key2 - 2] = arguments[_key2];
  }
  if (!args.length) {
    console.log("324 rightSeq() calling right()");
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
  console.log("337 rightSeq() ".concat("\x1B[".concat(33, "m", "opts", "\x1B[", 39, "m"), " = ", JSON.stringify(opts, null, 4)));
  console.log("343 rightSeq() calling seq()");
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
    console.log("391 there's no space to go further in this direction");
    return null;
  }
  console.log("400 ".concat("\x1B[".concat(33, "m", "opts", "\x1B[", 39, "m"), " = ", JSON.stringify(opts, null, 4), "; ", "\x1B[".concat(33, "m", "args", "\x1B[", 39, "m"), " = ").concat(JSON.stringify(args, null, 4)));
  var lastRes;
  var lastIdx;
  do {
    console.log();
    console.log("416 ".concat("\x1B[".concat(90, "m", "\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 v", "\x1B[", 39, "m"), "\n"));
    lastRes = direction === "right" ? rightSeq.apply(void 0, [str, isNum(lastIdx) ? lastIdx : idx].concat(_toConsumableArray(args))) : leftSeq.apply(void 0, [str, isNum(lastIdx) ? lastIdx : idx].concat(_toConsumableArray(args)));
    console.log();
    console.log("433 ".concat("\x1B[".concat(90, "m", "\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 ^", "\x1B[", 39, "m"), "\n"));
    console.log("436 ".concat("\x1B[".concat(36, "m", "lastRes = ".concat(JSON.stringify(lastRes, null, 4)), "\x1B[", 39, "m")));
    if (lastRes) {
      lastIdx = direction === "right" ? lastRes.rightmostChar : lastRes.leftmostChar;
      console.log("446 ".concat("\x1B[".concat(36, "m", "another sequence; confirmed! Now set ", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "lastIdx", "\x1B[", 39, "m"), " = ", JSON.stringify(lastIdx, null, 4), ";"));
    }
  } while (lastRes);
  if (lastIdx != null && direction === "right") {
    lastIdx++;
  }
  console.log();
  console.log("459 ".concat("\x1B[".concat(90, "m", "\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588", "\x1B[", 39, "m"), " fin\n"));
  console.log("461 ".concat("\x1B[".concat(33, "m", "lastIdx", "\x1B[", 39, "m"), " = ", lastIdx));
  if (!lastIdx) {
    return null;
  }
  if (direction === "right") {
    if (str[lastIdx] && str[lastIdx].trim().length) {
      console.log("483 RETURN ".concat(lastIdx));
      return lastIdx;
    }
    var whatsOnTheRight = right(str, lastIdx);
    console.log("490 SET ".concat("\x1B[".concat(33, "m", "whatsOnTheRight", "\x1B[", 39, "m"), " = ", whatsOnTheRight));
    if (opts.mode === 0) {
      if (whatsOnTheRight === lastIdx + 1) {
        console.log("497 ".concat("\x1B[".concat(32, "m", "RETURN", "\x1B[", 39, "m"), " ", lastIdx));
        return lastIdx;
      } else if (str.slice(lastIdx, whatsOnTheRight || str.length).trim().length || str.slice(lastIdx, whatsOnTheRight || str.length).includes("\n") || str.slice(lastIdx, whatsOnTheRight || str.length).includes("\r")) {
        console.log("505 loop");
        for (var y = lastIdx, len = str.length; y < len; y++) {
          if ("\n\r".includes(str[y])) {
            console.log("510 RETURN ".concat(y));
            return y;
          }
        }
      } else {
        console.log("516 ".concat("\x1B[".concat(32, "m", "RETURN", "\x1B[", 39, "m"), " ", whatsOnTheRight ? whatsOnTheRight - 1 : str.length));
        return whatsOnTheRight ? whatsOnTheRight - 1 : str.length;
      }
    } else if (opts.mode === 1) {
      console.log("524 RETURN ".concat(lastIdx));
      return lastIdx;
    } else if (opts.mode === 2) {
      var remainderString = str.slice(lastIdx);
      console.log("530 ".concat("\x1B[".concat(33, "m", "remainderString", "\x1B[", 39, "m"), " = ", JSON.stringify(remainderString, null, 4)));
      if (remainderString.trim().length || remainderString.includes("\n") || remainderString.includes("\r")) {
        for (var _y = lastIdx, _len3 = str.length; _y < _len3; _y++) {
          if (str[_y].trim().length || "\n\r".includes(str[_y])) {
            console.log("544 RETURN ".concat(_y));
            return _y;
          }
        }
      }
      console.log("550 RETURN ".concat(str.length));
      return str.length;
    }
    console.log("556 RETURN ".concat(whatsOnTheRight ? whatsOnTheRight : str.length));
    return whatsOnTheRight ? whatsOnTheRight : str.length;
  }
  if (str[lastIdx] && str[lastIdx - 1].trim().length) {
    console.log("578 RETURN ".concat(lastIdx));
    return lastIdx;
  }
  var whatsOnTheLeft = left(str, lastIdx);
  console.log("586 SET ".concat("\x1B[".concat(33, "m", "whatsOnTheLeft", "\x1B[", 39, "m"), " = ", whatsOnTheLeft));
  if (opts.mode === 0) {
    if (whatsOnTheLeft === lastIdx - 2) {
      console.log("592 ".concat("\x1B[".concat(32, "m", "RETURN", "\x1B[", 39, "m"), " ", lastIdx));
      return lastIdx;
    } else if (str.slice(0, lastIdx).trim().length || str.slice(0, lastIdx).includes("\n") || str.slice(0, lastIdx).includes("\r")) {
      console.log("600 ".concat("\x1B[".concat(36, "m", "loop backwards from ".concat(lastIdx), "\x1B[", 39, "m")));
      for (var _y2 = lastIdx; _y2--;) {
        console.log("606 ".concat("\x1B[".concat(36, "m", "str[".concat(_y2, "] = ").concat(JSON.stringify(str[_y2], null, 0)), "\x1B[", 39, "m")));
        if ("\n\r".includes(str[_y2]) || str[_y2].trim().length) {
          console.log("613 RETURN ".concat(_y2 + 1 + (str[_y2].trim().length ? 1 : 0)));
          return _y2 + 1 + (str[_y2].trim().length ? 1 : 0);
        }
      }
    }
    console.log("619 ".concat("\x1B[".concat(32, "m", "RETURN", "\x1B[", 39, "m"), " 0"));
    return 0;
  } else if (opts.mode === 1) {
    console.log("623 RETURN ".concat(lastIdx));
    return lastIdx;
  } else if (opts.mode === 2) {
    var _remainderString = str.slice(0, lastIdx);
    if (_remainderString.trim().length || _remainderString.includes("\n") || _remainderString.includes("\r")) {
      for (var _y3 = lastIdx; _y3--;) {
        if (str[_y3].trim().length || "\n\r".includes(str[_y3])) {
          console.log("636 RETURN ".concat(_y3 + 1));
          return _y3 + 1;
        }
      }
    }
    console.log("642 RETURN 0");
    return 0;
  }
  console.log("648 RETURN ".concat(whatsOnTheLeft !== null ? whatsOnTheLeft + 1 : 0));
  return whatsOnTheLeft !== null ? whatsOnTheLeft + 1 : 0;
}
function chompLeft(str, idx) {
  for (var _len4 = arguments.length, args = new Array(_len4 > 2 ? _len4 - 2 : 0), _key3 = 2; _key3 < _len4; _key3++) {
    args[_key3 - 2] = arguments[_key3];
  }
  console.log("688 chompLeft(): received ".concat("\x1B[".concat(33, "m", "args", "\x1B[", 39, "m"), " = ", JSON.stringify(args, null, 4)));
  if (!args.length || args.length === 1 && isObj(args[0])) {
    console.log("696 return null because there's nothing to match");
    return null;
  }
  console.log("699 chompLeft()");
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
    console.log("728 FINAL opts = ".concat(JSON.stringify(opts, null, 4)));
    return chomp("left", str, idx, opts, clone(args).slice(1));
  } else if (!isStr(args[0])) {
    console.log("731 FINAL opts = ".concat(JSON.stringify(defaults, null, 4)));
    return chomp("left", str, idx, defaults, clone(args).slice(1));
  }
  console.log("736 FINAL opts = ".concat(JSON.stringify(defaults, null, 4)));
  return chomp("left", str, idx, defaults, clone(args));
}
function chompRight(str, idx) {
  for (var _len5 = arguments.length, args = new Array(_len5 > 2 ? _len5 - 2 : 0), _key4 = 2; _key4 < _len5; _key4++) {
    args[_key4 - 2] = arguments[_key4];
  }
  console.log("768 chompRight(): received ".concat("\x1B[".concat(33, "m", "args", "\x1B[", 39, "m"), " = ", JSON.stringify(args, null, 4)));
  if (!args.length || args.length === 1 && isObj(args[0])) {
    console.log("776 return null because there's nothing to match");
    return null;
  }
  console.log("779 chompRight()");
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
    console.log("808 FINAL opts = ".concat(JSON.stringify(opts, null, 4)));
    return chomp("right", str, idx, opts, clone(args).slice(1));
  } else if (!isStr(args[0])) {
    console.log("811 FINAL opts = ".concat(JSON.stringify(defaults, null, 4)));
    return chomp("right", str, idx, defaults, clone(args).slice(1));
  }
  console.log("816 FINAL opts = ".concat(JSON.stringify(defaults, null, 4)));
  return chomp("right", str, idx, defaults, clone(args));
}

exports.chompLeft = chompLeft;
exports.chompRight = chompRight;
exports.left = left;
exports.leftSeq = leftSeq;
exports.right = right;
exports.rightSeq = rightSeq;
