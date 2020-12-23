/**
 * array-pull-all-with-glob
 * PullAllWithGlob - like _.pullAll but pulling stronger, with globs
 * Version: 4.13.0
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

var version = "4.13.0";

function pull(originalInput, originalToBeRemoved, originalOpts) {
  // insurance
  if (!originalInput.length) {
    return [];
  }

  if (!originalInput.length || !originalToBeRemoved.length) {
    return Array.from(originalInput);
  }

  var toBeRemoved = typeof originalToBeRemoved === "string" ? [originalToBeRemoved] : Array.from(originalToBeRemoved); // opts are mirroring matcher's at the moment, can't promise that for the future

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
