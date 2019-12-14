/**
 * string-trim-spaces-only
 * Like String.trim() but you can choose granularly what to trim
 * Version: 2.8.9
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-trim-spaces-only
 */

'use strict';

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

function trimSpaces(s, originalOpts) {
  if (typeof s !== "string") {
    throw new Error("string-trim-spaces-only: [THROW_ID_01] input must be string! It was given as ".concat(_typeof(s), ", equal to:\n").concat(JSON.stringify(s, null, 4)));
  }
  var defaults = {
    classicTrim: false,
    cr: false,
    lf: false,
    tab: false,
    space: true,
    nbsp: false
  };
  var opts = Object.assign({}, defaults, originalOpts);
  function check(_char) {
    return opts.classicTrim && _char.trim().length === 0 || !opts.classicTrim && (opts.space && _char === " " || opts.cr && _char === "\r" || opts.lf && _char === "\n" || opts.tab && _char === "\t" || opts.nbsp && _char === "\xA0");
  }
  var newStart;
  var newEnd;
  if (s.length > 0) {
    if (check(s[0])) {
      for (var i = 0, len = s.length; i < len; i++) {
        if (!check(s[i])) {
          newStart = i;
          break;
        }
        if (i === s.length - 1) {
          return {
            res: "",
            ranges: [[0, s.length]]
          };
        }
      }
    }
    if (check(s[s.length - 1])) {
      for (var _i = s.length; _i--;) {
        if (!check(s[_i])) {
          newEnd = _i + 1;
          break;
        }
      }
    }
    if (newStart) {
      if (newEnd) {
        return {
          res: s.slice(newStart, newEnd),
          ranges: [[0, newStart], [newEnd, s.length]]
        };
      }
      return {
        res: s.slice(newStart),
        ranges: [[0, newStart]]
      };
    }
    if (newEnd) {
      return {
        res: s.slice(0, newEnd),
        ranges: [[newEnd, s.length]]
      };
    }
    return {
      res: s,
      ranges: []
    };
  }
  return {
    res: "",
    ranges: []
  };
}

module.exports = trimSpaces;
