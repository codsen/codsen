/**
 * is-media-descriptor
 * Is given string a valid media descriptor (including media query)?
 * Version: 1.0.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/is-media-descriptor
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var leven = _interopDefault(require('leven'));

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

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
    return;
  }

  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

var recognisedMediaTypes = ["all", "aural", "braille", "embossed", "handheld", "print", "projection", "screen", "speech", "tty", "tv"];
function isMediaD(originalStr, originalOpts) {
  var defaults = {
    offset: 0
  };
  var opts = Object.assign({}, defaults, originalOpts);
  if (opts.offset && !Number.isInteger(opts.offset)) {
    throw new Error("is-media-descriptor: [THROW_ID_01] opts.offset must be an integer, it was given as ".concat(opts.offset, " (type ").concat(_typeof(opts.offset), ")"));
  }
  if (!opts.offset) {
    opts.offset = 0;
  }
  if (typeof originalStr !== "string") {
    return [];
  } else if (!originalStr.trim().length) {
    return [];
  }
  var mostlyLettersRegex = /^\w+$/g;
  var res = [];
  var nonWhitespaceStart = 0;
  var nonWhitespaceEnd = originalStr.length;
  var str = originalStr.trim();
  if (originalStr !== originalStr.trim()) {
    var ranges = [];
    if (!originalStr[0].trim().length) {
      for (var i = 0, len = originalStr.length; i < len; i++) {
        if (originalStr[i].trim().length) {
          ranges.push([0 + opts.offset, i + opts.offset]);
          nonWhitespaceStart = i;
          break;
        }
      }
    }
    if (!originalStr[originalStr.length - 1].trim().length) {
      for (var _i = originalStr.length; _i--;) {
        if (originalStr[_i].trim().length) {
          ranges.push([_i + 1 + opts.offset, originalStr.length + opts.offset]);
          nonWhitespaceEnd = _i + 1;
          break;
        }
      }
    }
    res.push({
      idxFrom: ranges[0][0],
      idxTo: ranges[ranges.length - 1][1],
      message: "Remove whitespace.",
      fix: {
        ranges: ranges
      }
    });
  }
  if (recognisedMediaTypes.includes(str)) {
    return res;
  } else if (["only", "not"].includes(str)) {
    res.push({
      idxFrom: nonWhitespaceStart + opts.offset,
      idxTo: nonWhitespaceEnd + opts.offset,
      message: "Missing media type or condition.",
      fix: null
    });
  } else if (str.match(mostlyLettersRegex) && !str.includes("(") && !str.includes(")")) {
    for (var _i2 = 0, _len = recognisedMediaTypes.length; _i2 < _len; _i2++) {
      if (leven(recognisedMediaTypes[_i2], str) === 1) {
        res.push({
          idxFrom: nonWhitespaceStart + opts.offset,
          idxTo: nonWhitespaceEnd + opts.offset,
          message: "Did you mean \"".concat(recognisedMediaTypes[_i2], "\"?"),
          fix: {
            ranges: [[nonWhitespaceStart + opts.offset, nonWhitespaceEnd + opts.offset, recognisedMediaTypes[_i2]]]
          }
        });
        break;
      }
      if (_i2 === _len - 1) {
        res.push({
          idxFrom: nonWhitespaceStart + opts.offset,
          idxTo: nonWhitespaceEnd + opts.offset,
          message: "Unrecognised media type \"".concat(str, "\"."),
          fix: null
        });
      }
    }
  } else {
    var wrongOrder = false;
    var _Array$from$reduce = Array.from(str).reduce(function (acc, curr) {
      if (curr === ")") {
        if (!wrongOrder && acc[1] + 1 > acc[0]) {
          wrongOrder = true;
        }
        return [acc[0], acc[1] + 1];
      } else if (curr === "(") {
        return [acc[0] + 1, acc[1]];
      }
      return acc;
    }, [0, 0]),
        _Array$from$reduce2 = _slicedToArray(_Array$from$reduce, 2),
        openingBracketCount = _Array$from$reduce2[0],
        closingBracketCount = _Array$from$reduce2[1];
    if (wrongOrder && openingBracketCount === closingBracketCount) {
      res.push({
        idxFrom: nonWhitespaceStart + opts.offset,
        idxTo: nonWhitespaceEnd + opts.offset,
        message: "Some closing brackets are before their opening counterparts.",
        fix: null
      });
    }
    if (openingBracketCount > closingBracketCount) {
      res.push({
        idxFrom: nonWhitespaceStart + opts.offset,
        idxTo: nonWhitespaceEnd + opts.offset,
        message: "More opening brackets than closing.",
        fix: null
      });
    } else if (closingBracketCount > openingBracketCount) {
      res.push({
        idxFrom: nonWhitespaceStart + opts.offset,
        idxTo: nonWhitespaceEnd + opts.offset,
        message: "More closing brackets than opening.",
        fix: null
      });
    }
    if (res.length) {
      return res;
    }
    var chunkStartsAt = null;
    var mediaTypeOrMediaConditionNext = true;
    for (var _i3 = 0, _len2 = str.length; _i3 <= _len2; _i3++) {
      if (chunkStartsAt !== null && (!str[_i3] || !str[_i3].trim().length)) {
        var chunk = str.slice(chunkStartsAt, _i3);
        if (mediaTypeOrMediaConditionNext) {
          if (chunk.startsWith("(")) ; else {
            if (["only", "not"].includes(chunk.toLowerCase())) ; else if (recognisedMediaTypes.includes(chunk.toLowerCase())) {
              mediaTypeOrMediaConditionNext = false;
            } else {
              res.push({
                idxFrom: chunkStartsAt + opts.offset,
                idxTo: _i3 + opts.offset,
                message: "Unrecognised media type \"".concat(str.slice(chunkStartsAt, _i3), "\"."),
                fix: null
              });
              break;
            }
          }
        }
        chunkStartsAt = null;
      }
      if (chunkStartsAt === null && str[_i3] && str[_i3].trim().length) {
        chunkStartsAt = _i3;
      }
    }
  }
  return res;
}

module.exports = isMediaD;
