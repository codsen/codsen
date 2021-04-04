/**
 * @name string-overlap-one-on-another
 * @fileoverview Lay one string on top of another, with an optional offset
 * @version 2.0.14
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/string-overlap-one-on-another/}
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var _typeof = require('@babel/runtime/helpers/typeof');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _objectSpread__default = /*#__PURE__*/_interopDefaultLegacy(_objectSpread);
var _typeof__default = /*#__PURE__*/_interopDefaultLegacy(_typeof);

var version$1 = "2.0.14";

var version = version$1;
var defaults = {
  offset: 0,
  offsetFillerCharacter: " "
};
function overlap(str1, str2, originalOpts) {
  if (typeof str1 !== "string") {
    throw new Error("string-overlap-one-on-another: [THROW_ID_01] The first input argument must be a string but it was given as ".concat(JSON.stringify(str1, null, 4), ", which is type \"").concat(_typeof__default['default'](str1), "\""));
  }
  if (typeof str2 !== "string") {
    throw new Error("string-overlap-one-on-another: [THROW_ID_02] The second input argument must be a string but it was given as ".concat(JSON.stringify(str2, null, 4), ", which is type \"").concat(_typeof__default['default'](str2), "\""));
  }
  var opts;
  if (!originalOpts) {
    opts = defaults;
  } else if (_typeof__default['default'](originalOpts) !== "object") {
    throw new Error("string-overlap-one-on-another: [THROW_ID_03] The third input argument must be a plain object but it was given as ".concat(JSON.stringify(str2, null, 4), ", which is type \"").concat(_typeof__default['default'](originalOpts), "\""));
  } else {
    opts = _objectSpread__default['default'](_objectSpread__default['default']({}, defaults), originalOpts);
    if (!opts.offset) {
      opts.offset = 0;
    } else if (!Number.isInteger(Math.abs(opts.offset))) {
      throw new Error("string-overlap-one-on-another: [THROW_ID_04] The second input argument must be a string but it was given as ".concat(JSON.stringify(str2, null, 4), ", which is type \"").concat(_typeof__default['default'](str2), "\""));
    }
    if (!opts.offsetFillerCharacter && opts.offsetFillerCharacter !== "") {
      opts.offsetFillerCharacter = " ";
    }
  }
  if (str2.length === 0) {
    return str1;
  }
  if (str1.length === 0) {
    return str2;
  }
  if (opts.offset < 0) {
    var part2 = Math.abs(opts.offset) > str2.length ? opts.offsetFillerCharacter.repeat(Math.abs(opts.offset) - str2.length) : "";
    var part3 = str1.slice(str2.length - Math.abs(opts.offset) > 0 ? str2.length - Math.abs(opts.offset) : 0);
    return str2 + part2 + part3;
  }
  if (opts.offset > 0) {
    var par1 = str1.slice(0, opts.offset) + (opts.offset > str1.length ? opts.offsetFillerCharacter.repeat(Math.abs(opts.offset) - str1.length) : "");
    var _part = str1.length - opts.offset - str2.length > 0 ? str1.slice(str1.length - opts.offset - str2.length + 1) : "";
    return par1 + str2 + _part;
  }
  return str2 + (str1.length > str2.length ? str1.slice(str2.length) : "");
}

exports.overlap = overlap;
exports.version = version;
