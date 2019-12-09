/**
 * string-overlap-one-on-another
 * Lay one string on top of another, with an optional offset
 * Version: 1.5.50
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-overlap-one-on-another
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var isObj = _interopDefault(require('lodash.isplainobject'));
var isNatNum = _interopDefault(require('is-natural-number'));

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

function overlap(str1, str2, originalOpts) {
  if (typeof str1 !== "string") {
    throw new Error("string-overlap-one-on-another: [THROW_ID_01] The first input argument must be a string but it was given as ".concat(JSON.stringify(str1, null, 4), ", which is type \"").concat(_typeof(str1), "\""));
  }
  if (typeof str2 !== "string") {
    throw new Error("string-overlap-one-on-another: [THROW_ID_02] The second input argument must be a string but it was given as ".concat(JSON.stringify(str2, null, 4), ", which is type \"").concat(_typeof(str2), "\""));
  }
  var opts;
  var defaults = {
    offset: 0,
    offsetFillerCharacter: " "
  };
  if (!originalOpts) {
    opts = defaults;
  } else if (!isObj(originalOpts)) {
    throw new Error("string-overlap-one-on-another: [THROW_ID_03] The third input argument must be a plain object but it was given as ".concat(JSON.stringify(str2, null, 4), ", which is type \"").concat(_typeof(originalOpts), "\""));
  } else {
    opts = Object.assign({}, defaults, originalOpts);
    if (!opts.offset) {
      opts.offset = 0;
    } else if (!isNatNum(Math.abs(opts.offset))) {
      throw new Error("string-overlap-one-on-another: [THROW_ID_04] The second input argument must be a string but it was given as ".concat(JSON.stringify(str2, null, 4), ", which is type \"").concat(_typeof(str2), "\""));
    }
    if (!opts.offsetFillerCharacter && opts.offsetFillerCharacter !== "") {
      opts.offsetFillerCharacter = " ";
    }
  }
  if (str2.length === 0) {
    return str1;
  } else if (str1.length === 0) {
    return str2;
  }
  if (opts.offset < 0) {
    var part2 = Math.abs(opts.offset) > str2.length ? opts.offsetFillerCharacter.repeat(Math.abs(opts.offset) - str2.length) : "";
    var part3 = str1.slice(str2.length - Math.abs(opts.offset) > 0 ? str2.length - Math.abs(opts.offset) : 0);
    return str2 + part2 + part3;
  } else if (opts.offset > 0) {
    var par1 = str1.slice(0, opts.offset) + (opts.offset > str1.length ? opts.offsetFillerCharacter.repeat(Math.abs(opts.offset) - str1.length) : "");
    var _part = str1.length - opts.offset - str2.length > 0 ? str1.slice(str1.length - opts.offset - str2.length + 1) : "";
    return par1 + str2 + _part;
  }
  return str2 + (str1.length > str2.length ? str1.slice(str2.length) : "");
}

module.exports = overlap;
