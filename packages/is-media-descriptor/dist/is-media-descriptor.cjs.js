/**
 * is-media-descriptor
 * Is given string a valid media descriptor (including media query)?
 * Version: 0.1.0
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

var recognisedMediaTypes = ["all", "aural", "braille", "embossed", "handheld", "print", "projection", "screen", "speech", "tty", "tv"];
function isMediaD(str, originalOpts) {
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
  if (typeof str !== "string") {
    return [];
  } else if (!str.trim().length) {
    return [];
  }
  var mostlyLettersRegex = /^\w+$|^\w*\W\w+$|^\w+\W\w*$/g;
  var res = [];
  var nonWhitespaceStart = 0;
  var nonWhitespaceEnd = str.length;
  var trimmedStr = str.trim();
  if (str !== str.trim()) {
    var ranges = [];
    if (!str[0].trim().length) {
      for (var i = 0, len = str.length; i < len; i++) {
        if (str[i].trim().length) {
          ranges.push([0 + opts.offset, i + opts.offset]);
          nonWhitespaceStart = i;
          break;
        }
      }
    }
    if (!str[str.length - 1].trim().length) {
      for (var _i = str.length; _i--;) {
        if (str[_i].trim().length) {
          ranges.push([_i + 1 + opts.offset, str.length + opts.offset]);
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
  if (recognisedMediaTypes.includes(trimmedStr)) {
    return res;
  } else if (trimmedStr.match(mostlyLettersRegex)) {
    for (var _i2 = 0, _len = recognisedMediaTypes.length; _i2 < _len; _i2++) {
      if (leven(recognisedMediaTypes[_i2], trimmedStr) === 1) {
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
    }
  }
  return res;
}

module.exports = isMediaD;
