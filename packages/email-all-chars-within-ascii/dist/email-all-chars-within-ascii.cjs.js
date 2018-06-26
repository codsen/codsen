'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var checkTypes = _interopDefault(require('check-types-mini'));
var isObj = _interopDefault(require('lodash.isplainobject'));

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
function within(str, originalOpts) {
  function existy(x) {
    return x != null;
  }
  if (typeof str !== "string") {
    throw new Error("email-all-chars-within-ascii/within(): [THROW_ID_01] The input is not string but " + (typeof str === "undefined" ? "undefined" : _typeof(str)) + ", equal to: " + JSON.stringify(str, null, 4));
  }
  if (existy(originalOpts) && !isObj(originalOpts)) {
    throw new Error("email-all-chars-within-ascii/within(): [THROW_ID_02] The opts is not a plain object but " + (typeof originalOpts === "undefined" ? "undefined" : _typeof(originalOpts)) + ", equal to:\n" + JSON.stringify(originalOpts, null, 4));
  }
  var defaults = {
    messageOnly: false,
    checkLineLength: true
  };
  var opts = Object.assign({}, defaults, originalOpts);
  checkTypes(opts, defaults, {
    msg: "email-all-chars-within-ascii/within(): [THROW_ID_03*]"
  });
  var counter = 0;
  for (var i = 0, len = str.length; i < len; i++) {
    counter += 1;
    if (str[i].codePointAt(0) > 126 || str[i].codePointAt(0) < 9 || str[i].codePointAt(0) === 11 || str[i].codePointAt(0) === 12 || str[i].codePointAt(0) > 13 && str[i].codePointAt(0) < 32) {
      throw new Error((opts.messageOnly ? "" : "email-all-chars-within-ascii: ") + "Non ascii character found at index " + i + ", equal to: " + str[i] + ", its decimal code point is " + str[i].codePointAt(0) + ".");
    }
    if (counter > 997 && opts.checkLineLength) {
      throw new Error((opts.messageOnly ? "" : "email-all-chars-within-ascii: ") + "Line length is beyond 999 characters!");
    }
    if (str[i] === "\r" || str[i] === "\n") {
      counter = 0;
    }
  }
}

module.exports = within;
