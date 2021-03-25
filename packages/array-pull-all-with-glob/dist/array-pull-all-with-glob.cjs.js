/**
 * array-pull-all-with-glob
 * Like _.pullAll but with globs (wildcards)
 * Version: 5.0.10
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/array-pull-all-with-glob/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var matcher = require('matcher');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _objectSpread__default = /*#__PURE__*/_interopDefaultLegacy(_objectSpread);
var matcher__default = /*#__PURE__*/_interopDefaultLegacy(matcher);

var version$1 = "5.0.10";

var version = version$1;
function pull(originalInput, originalToBeRemoved, originalOpts) {
  if (!originalInput.length) {
    return [];
  }
  if (!originalInput.length || !originalToBeRemoved.length) {
    return Array.from(originalInput);
  }
  var toBeRemoved = typeof originalToBeRemoved === "string" ? [originalToBeRemoved] : Array.from(originalToBeRemoved);
  var defaults = {
    caseSensitive: true
  };
  var opts = _objectSpread__default['default'](_objectSpread__default['default']({}, defaults), originalOpts);
  var res = Array.from(originalInput).filter(function (originalVal) {
    return !toBeRemoved.some(function (remVal) {
      return matcher__default['default'].isMatch(originalVal, remVal, {
        caseSensitive: opts.caseSensitive
      });
    });
  });
  return res;
}

exports.pull = pull;
exports.version = version;
