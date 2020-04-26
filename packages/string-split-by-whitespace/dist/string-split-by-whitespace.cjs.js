/**
 * string-split-by-whitespace
 * Split string into array by chunks of whitespace
 * Version: 1.6.62
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-split-by-whitespace
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var within = _interopDefault(require('ranges-is-index-within'));

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

function split(str, originalOpts) {
  if (str === undefined) {
    throw new Error("string-split-by-whitespace: [THROW_ID_01] The input is missing!");
  }
  if (typeof str !== "string") {
    return str;
  }
  if (str.trim() === "") {
    return [];
  }
  var defaults = {
    ignoreRanges: []
  };
  var opts = _objectSpread2({}, defaults, {}, originalOpts);
  if (opts.ignoreRanges.length > 0 && !opts.ignoreRanges.every(function (arr) {
    return Array.isArray(arr);
  })) {
    throw new Error("string-split-by-whitespace: [THROW_ID_03] The opts.ignoreRanges contains elements which are not arrays!");
  }
  var nonWhitespaceSubStringStartsAt = null;
  var res = [];
  for (var i = 0, len = str.length; i < len; i++) {
    if (nonWhitespaceSubStringStartsAt === null && str[i].trim() !== "" && (opts.ignoreRanges.length === 0 || opts.ignoreRanges.length !== 0 && !within(i, opts.ignoreRanges.map(function (arr) {
      return [arr[0], arr[1] - 1];
    }), {
      inclusiveRangeEnds: true
    }))) {
      nonWhitespaceSubStringStartsAt = i;
    }
    if (nonWhitespaceSubStringStartsAt !== null) {
      if (str[i].trim() === "") {
        res.push(str.slice(nonWhitespaceSubStringStartsAt, i));
        nonWhitespaceSubStringStartsAt = null;
      } else if (opts.ignoreRanges.length && within(i, opts.ignoreRanges)) {
        res.push(str.slice(nonWhitespaceSubStringStartsAt, i - 1));
        nonWhitespaceSubStringStartsAt = null;
      } else if (str[i + 1] === undefined) {
        res.push(str.slice(nonWhitespaceSubStringStartsAt, i + 1));
      }
    }
  }
  return res;
}

module.exports = split;
