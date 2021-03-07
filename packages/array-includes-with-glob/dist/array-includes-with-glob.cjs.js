/**
 * array-includes-with-glob
 * Like _.includes but with wildcards
 * Version: 3.0.7
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/array-includes-with-glob/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var matcher = require('matcher');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _objectSpread__default = /*#__PURE__*/_interopDefaultLegacy(_objectSpread);
var matcher__default = /*#__PURE__*/_interopDefaultLegacy(matcher);

var version$1 = "3.0.7";

var version = version$1;
var defaults = {
  arrayVsArrayAllMustBeFound: "any",
  caseSensitive: true
};
function includesWithGlob(originalInput, stringToFind, originalOpts) {
  if (!originalInput.length || !stringToFind.length) {
    return false;
  }
  var opts = _objectSpread__default['default'](_objectSpread__default['default']({}, defaults), originalOpts);
  var input = typeof originalInput === "string" ? [originalInput] : Array.from(originalInput);
  if (typeof stringToFind === "string") {
    return input.some(function (val) {
      return matcher__default['default'].isMatch(val, stringToFind, {
        caseSensitive: opts.caseSensitive
      });
    });
  }
  if (opts.arrayVsArrayAllMustBeFound === "any") {
    return stringToFind.some(function (stringToFindVal) {
      return input.some(function (val) {
        return matcher__default['default'].isMatch(val, stringToFindVal, {
          caseSensitive: opts.caseSensitive
        });
      });
    });
  }
  return stringToFind.every(function (stringToFindVal) {
    return input.some(function (val) {
      return matcher__default['default'].isMatch(val, stringToFindVal, {
        caseSensitive: opts.caseSensitive
      });
    });
  });
}

exports.defaults = defaults;
exports.includesWithGlob = includesWithGlob;
exports.version = version;
