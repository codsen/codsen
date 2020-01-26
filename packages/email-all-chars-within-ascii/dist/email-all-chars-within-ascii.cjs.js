/**
 * email-all-chars-within-ascii
 * Scans all characters within a string and checks are they within ASCII range
 * Version: 2.9.54
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/email-all-chars-within-ascii
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var isObj = _interopDefault(require('lodash.isplainobject'));

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

function within(str, originalOpts) {
  function existy(x) {
    return x != null;
  }
  if (typeof str !== "string") {
    throw new Error("email-all-chars-within-ascii/within(): [THROW_ID_01] The input is not string but ".concat(_typeof(str), ", equal to: ").concat(JSON.stringify(str, null, 4)));
  }
  if (existy(originalOpts) && !isObj(originalOpts)) {
    throw new Error("email-all-chars-within-ascii/within(): [THROW_ID_02] The opts is not a plain object but ".concat(_typeof(originalOpts), ", equal to:\n").concat(JSON.stringify(originalOpts, null, 4)));
  }
  var defaults = {
    messageOnly: false,
    checkLineLength: true
  };
  var opts = Object.assign({}, defaults, originalOpts);
  var counter = 0;
  for (var i = 0, len = str.length; i < len; i++) {
    counter += 1;
    if (str[i].codePointAt(0) > 126 || str[i].codePointAt(0) < 9 || str[i].codePointAt(0) === 11 || str[i].codePointAt(0) === 12 || str[i].codePointAt(0) > 13 && str[i].codePointAt(0) < 32) {
      throw new Error("".concat(opts.messageOnly ? "" : "email-all-chars-within-ascii: ", "Non ascii character found at index ").concat(i, ", equal to: ").concat(JSON.stringify(str[i], null, 4), ", its decimal code point is ").concat(str[i].codePointAt(0), "."));
    }
    if (counter > 997 && opts.checkLineLength) {
      throw new Error("".concat(opts.messageOnly ? "" : "email-all-chars-within-ascii: ", "Line length is beyond 999 characters!"));
    }
    if (str[i] === "\r" || str[i] === "\n") {
      counter = 0;
    }
  }
}

module.exports = within;
