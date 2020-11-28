/**
 * string-collapse-white-space
 * Replace chunks of whitespace with a single spaces
 * Version: 8.0.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/string-collapse-white-space/
 */

'use strict';

var apply = require('ranges-apply');
var Ranges = require('ranges-push');
var stringLeftRight = require('string-left-right');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var apply__default = /*#__PURE__*/_interopDefaultLegacy(apply);
var Ranges__default = /*#__PURE__*/_interopDefaultLegacy(Ranges);

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

var cb = function cb(_ref) {
  var suggested = _ref.suggested;
  return suggested;
};
var defaultOpts = {
  trimStart: true,
  trimEnd: true,
  trimLines: false,
  trimnbsp: false,
  removeEmptyLines: false,
  limitConsecutiveEmptyLinesTo: 0,
  enforceSpacesOnly: false,
  cb: cb
};

function collapse(str, originalOpts) {
  if (typeof str !== "string") {
    throw new Error("string-collapse-white-space/collapse(): [THROW_ID_01] The input is not string but ".concat(_typeof(str), ", equal to: ").concat(JSON.stringify(str, null, 4)));
  }
  if (originalOpts && _typeof(originalOpts) !== "object") {
    throw new Error("string-collapse-white-space/collapse(): [THROW_ID_02] The opts is not a plain object but ".concat(_typeof(originalOpts), ", equal to:\n").concat(JSON.stringify(originalOpts, null, 4)));
  }
  if (!str.length) {
    return {
      result: "",
      ranges: null
    };
  }
  var finalIndexesToDelete = new Ranges__default['default']();
  var NBSP = "\xA0";
  var opts = _objectSpread2(_objectSpread2({}, defaultOpts), originalOpts);
  function push(something) {
    var final = opts.cb(_objectSpread2({
      suggested: something
    }, arguments.length <= 1 ? undefined : arguments[1]));
    if (Array.isArray(final)) {
      finalIndexesToDelete.push.apply(finalIndexesToDelete, _toConsumableArray(final));
    }
  }
  var spacesStartAt = null;
  var whiteSpaceStartsAt = null;
  var lineWhiteSpaceStartsAt = null;
  var linebreaksStartAt = null;
  var linebreaksEndAt = null;
  var nbspPresent = false;
  var staging = [];
  var consecutiveLineBreakCount = 0;
  for (var i = 0, len = str.length; i <= len; i++) {
    if (str[i] === "\r" || str[i] === "\n" && str[i - 1] !== "\r") {
      consecutiveLineBreakCount += 1;
      if (linebreaksStartAt === null) {
        linebreaksStartAt = i;
      }
      linebreaksEndAt = str[i] === "\r" && str[i + 1] === "\n" ? i + 2 : i + 1;
    }
    if (!opts.trimnbsp && str[i] === NBSP && !nbspPresent) {
      nbspPresent = true;
    }
    if (
    spacesStartAt !== null &&
    str[i] !== " ") {
      var a1 =
      spacesStartAt && whiteSpaceStartsAt ||
      !whiteSpaceStartsAt && (!opts.trimStart || !opts.trimnbsp && (
      str[i] === NBSP || str[spacesStartAt - 1] === NBSP));
      var a2 =
      str[i] || !opts.trimEnd || !opts.trimnbsp && (
      str[i] === NBSP || str[spacesStartAt - 1] === NBSP);
      var a3 =
      !opts.enforceSpacesOnly ||
      (!str[spacesStartAt - 1] ||
      str[spacesStartAt - 1].trim()) && (
      !str[i] ||
      str[i].trim());
      if (
      spacesStartAt < i - 1 && a1 && a2 && a3) {
        var startIdx = spacesStartAt;
        var endIdx = i;
        var whatToAdd = " ";
        if (opts.trimLines && (
        !spacesStartAt ||
        !str[i] ||
        str[spacesStartAt - 1] && "\r\n".includes(str[spacesStartAt - 1]) ||
        str[i] && "\r\n".includes(str[i]))) {
          whatToAdd = null;
        }
        if (whatToAdd && str[spacesStartAt] === " ") {
          endIdx -= 1;
          whatToAdd = null;
        }
        if (!spacesStartAt && opts.trimStart) {
          endIdx = i;
        } else if (!str[i] && opts.trimEnd) {
          endIdx = i;
        }
        staging.push([
        /* istanbul ignore next */
        whatToAdd ? [startIdx, endIdx, whatToAdd] : [startIdx, endIdx], {
          whiteSpaceStartsAt: whiteSpaceStartsAt,
          whiteSpaceEndsAt: stringLeftRight.right(i - 1) || i,
          str: str
        }]);
      }
    }
    if (
    spacesStartAt === null &&
    str[i] === " ") {
      spacesStartAt = i;
    }
    if (
    whiteSpaceStartsAt === null &&
    str[i] && !str[i].trim()) {
      whiteSpaceStartsAt = i;
    }
    if (
    lineWhiteSpaceStartsAt !== null && (
    "\n\r".includes(str[i]) ||
    !str[i] || str[i].trim() ||
    !(opts.trimnbsp || opts.enforceSpacesOnly) &&
    str[i] === NBSP) && (
    lineWhiteSpaceStartsAt || !opts.trimStart || opts.enforceSpacesOnly && nbspPresent) && (
    str[i] || !opts.trimEnd || opts.enforceSpacesOnly && nbspPresent)) {
      if (
      opts.enforceSpacesOnly && (
      i > lineWhiteSpaceStartsAt + 1 ||
      str[lineWhiteSpaceStartsAt] !== " ")) {
        var _startIdx = lineWhiteSpaceStartsAt;
        var _endIdx = i;
        var _whatToAdd = " ";
        if (str[_endIdx - 1] === " ") {
          _endIdx -= 1;
          _whatToAdd = null;
        } else if (str[lineWhiteSpaceStartsAt] === " ") {
          _startIdx += 1;
          _whatToAdd = null;
        }
        if ((opts.trimStart || opts.trimLines) && !lineWhiteSpaceStartsAt || (opts.trimEnd || opts.trimLines) && !str[i]) {
          _whatToAdd = null;
        }
        push(_whatToAdd ? [_startIdx, _endIdx, _whatToAdd] : [_startIdx, _endIdx], {
          whiteSpaceStartsAt: whiteSpaceStartsAt,
          whiteSpaceEndsAt: i,
          str: str
        });
      }
      if (
      opts.trimLines && (
      !lineWhiteSpaceStartsAt || "\r\n".includes(str[lineWhiteSpaceStartsAt - 1]) || !str[i] || "\r\n".includes(str[i])) && (
      opts.trimnbsp ||
      !nbspPresent)) {
        push([lineWhiteSpaceStartsAt, i], {
          whiteSpaceStartsAt: whiteSpaceStartsAt,
          whiteSpaceEndsAt: stringLeftRight.right(str, i - 1) || i,
          str: str
        });
      }
      lineWhiteSpaceStartsAt = null;
    }
    if (
    lineWhiteSpaceStartsAt === null &&
    !"\r\n".includes(str[i]) &&
    str[i] && !str[i].trim() && (
    opts.trimnbsp || str[i] !== NBSP || opts.enforceSpacesOnly)) {
      lineWhiteSpaceStartsAt = i;
    }
    if (
    whiteSpaceStartsAt !== null && (
    !str[i] ||
    str[i].trim())) {
      if (
      (!whiteSpaceStartsAt && (
      opts.trimStart ||
      opts.trimLines &&
      linebreaksStartAt === null) ||
      !str[i] && (
      opts.trimEnd ||
      opts.trimLines &&
      linebreaksStartAt === null)) && (
      opts.trimnbsp ||
      !nbspPresent ||
      opts.enforceSpacesOnly)) {
        push([whiteSpaceStartsAt, i], {
          whiteSpaceStartsAt: whiteSpaceStartsAt,
          whiteSpaceEndsAt: i,
          str: str
        });
      } else {
        var somethingPushed = false;
        if (opts.removeEmptyLines &&
        linebreaksStartAt !== null &&
        consecutiveLineBreakCount > opts.limitConsecutiveEmptyLinesTo + 1) {
          somethingPushed = true;
          var _startIdx2 = linebreaksStartAt;
          var _endIdx2 = linebreaksEndAt;
          var _whatToAdd2 = "".concat(str[linebreaksStartAt] === "\r" && str[linebreaksStartAt + 1] === "\n" ? "\r\n" : str[linebreaksStartAt]).repeat(opts.limitConsecutiveEmptyLinesTo + 1);
          /* istanbul ignore else */
          if (str.endsWith(_whatToAdd2, linebreaksEndAt)) {
            _endIdx2 -= _whatToAdd2.length;
            _whatToAdd2 = null;
          } else if (str.startsWith(_whatToAdd2, linebreaksStartAt)) {
            _startIdx2 += _whatToAdd2.length;
            _whatToAdd2 = null;
          }
          /* istanbul ignore next */
          push(_whatToAdd2 ? [_startIdx2, _endIdx2, _whatToAdd2] : [_startIdx2, _endIdx2], {
            whiteSpaceStartsAt: whiteSpaceStartsAt,
            whiteSpaceEndsAt: i,
            str: str
          });
        }
        if (staging.length) {
          while (staging.length) {
            push.apply(void 0, _toConsumableArray(staging.shift()).concat([{
              whiteSpaceStartsAt: whiteSpaceStartsAt,
              whiteSpaceEndsAt: i,
              str: str
            }]));
          }
          somethingPushed = true;
        }
        if (!somethingPushed) {
          push(null, {
            whiteSpaceStartsAt: whiteSpaceStartsAt,
            whiteSpaceEndsAt: i,
            str: str
          });
        }
      }
      whiteSpaceStartsAt = null;
      lineWhiteSpaceStartsAt = null;
      nbspPresent = false;
      if (consecutiveLineBreakCount) {
        consecutiveLineBreakCount = 0;
        linebreaksStartAt = null;
        linebreaksEndAt = null;
      }
    }
    if (spacesStartAt !== null && str[i] !== " ") {
      spacesStartAt = null;
    }
  }
  return {
    result: apply__default['default'](str, finalIndexesToDelete.current()),
    ranges: finalIndexesToDelete.current()
  };
}

module.exports = collapse;
