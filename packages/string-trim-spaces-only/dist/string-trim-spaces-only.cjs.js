/**
 * @name string-trim-spaces-only
 * @fileoverview Like String.trim() but you can choose granularly what to trim
 * @version 3.1.0
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/string-trim-spaces-only/}
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var _typeof = require('@babel/runtime/helpers/typeof');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _objectSpread__default = /*#__PURE__*/_interopDefaultLegacy(_objectSpread);
var _typeof__default = /*#__PURE__*/_interopDefaultLegacy(_typeof);

var version$1 = "3.1.0";

var version = version$1;
var defaults = {
  classicTrim: false,
  cr: false,
  lf: false,
  tab: false,
  space: true,
  nbsp: false
};
function trimSpaces(str, originalOpts) {
  if (typeof str !== "string") {
    throw new Error("string-trim-spaces-only: [THROW_ID_01] input must be string! It was given as ".concat(_typeof__default['default'](str), ", equal to:\n").concat(JSON.stringify(str, null, 4)));
  }
  var opts = _objectSpread__default['default'](_objectSpread__default['default']({}, defaults), originalOpts);
  function check(_char) {
    return opts.classicTrim && !_char.trim() || !opts.classicTrim && (opts.space && _char === " " || opts.cr && _char === "\r" || opts.lf && _char === "\n" || opts.tab && _char === "\t" || opts.nbsp && _char === "\xA0");
  }
  var newStart;
  var newEnd;
  if (str.length) {
    if (check(str[0])) {
      for (var i = 0, len = str.length; i < len; i++) {
        if (!check(str[i])) {
          newStart = i;
          break;
        }
        if (i === str.length - 1) {
          return {
            res: "",
            ranges: [[0, str.length]]
          };
        }
      }
    }
    if (check(str[str.length - 1])) {
      for (var _i = str.length; _i--;) {
        if (!check(str[_i])) {
          newEnd = _i + 1;
          break;
        }
      }
    }
    if (newStart) {
      if (newEnd) {
        return {
          res: str.slice(newStart, newEnd),
          ranges: [[0, newStart], [newEnd, str.length]]
        };
      }
      return {
        res: str.slice(newStart),
        ranges: [[0, newStart]]
      };
    }
    if (newEnd) {
      return {
        res: str.slice(0, newEnd),
        ranges: [[newEnd, str.length]]
      };
    }
    return {
      res: str,
      ranges: []
    };
  }
  return {
    res: "",
    ranges: []
  };
}

exports.defaults = defaults;
exports.trimSpaces = trimSpaces;
exports.version = version;
