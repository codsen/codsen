/**
 * string-trim-spaces-only
 * Like String.trim() but you can choose granularly what to trim
 * Version: 2.9.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/string-trim-spaces-only/
 */

'use strict';

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
  var opts = _objectSpread2(_objectSpread2({}, defaults), originalOpts);
  function check(char) {
    return opts.classicTrim && !char.trim() || !opts.classicTrim && (opts.space && char === " " || opts.cr && char === "\r" || opts.lf && char === "\n" || opts.tab && char === "\t" || opts.nbsp && char === "\xA0");
  }
  var newStart;
  var newEnd;
  if (s.length) {
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
