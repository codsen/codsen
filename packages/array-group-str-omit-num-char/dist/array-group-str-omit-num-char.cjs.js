/**
 * @name array-group-str-omit-num-char
 * @fileoverview Groups array of strings by omitting number characters
 * @version 4.1.0
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/array-group-str-omit-num-char/}
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var uniq = require('lodash.uniq');
var rangesApply = require('ranges-apply');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _objectSpread__default = /*#__PURE__*/_interopDefaultLegacy(_objectSpread);
var uniq__default = /*#__PURE__*/_interopDefaultLegacy(uniq);

var version$1 = "4.1.0";

var version = version$1;
var defaults = {
  wildcard: "*",
  dedupePlease: true
};
function groupStr(originalArr, originalOpts) {
  if (!Array.isArray(originalArr)) {
    return originalArr;
  }
  if (!originalArr.length) {
    return {};
  }
  var opts = _objectSpread__default['default'](_objectSpread__default['default']({}, defaults), originalOpts);
  var arr = opts.dedupePlease ? uniq__default['default'](originalArr) : Array.from(originalArr);
  var compiledObj = {};
  for (var i = 0, len = arr.length; i < len; i++) {
    var digitChunks = arr[i].match(/\d+/gm);
    if (!digitChunks) {
      compiledObj[arr[i]] = {
        count: 1
      };
    } else {
      (function () {
        var wildcarded = arr[i].replace(/\d+/gm, opts.wildcard);
        if (Object.prototype.hasOwnProperty.call(compiledObj, wildcarded)) {
          digitChunks.forEach(function (digitsChunkStr, i2) {
            if (compiledObj[wildcarded].elementsWhichWeCanReplaceWithWildcards[i2] && digitsChunkStr !== compiledObj[wildcarded].elementsWhichWeCanReplaceWithWildcards[i2]) {
              compiledObj[wildcarded].elementsWhichWeCanReplaceWithWildcards[i2] = false;
            }
          });
          compiledObj[wildcarded].count += 1;
        } else {
          compiledObj[wildcarded] = {
            count: 1,
            elementsWhichWeCanReplaceWithWildcards: Array.from(digitChunks)
          };
        }
      })();
    }
  }
  var resObj = {};
  Object.keys(compiledObj).forEach(function (key) {
    var newKey = key;
    if (Array.isArray(compiledObj[key].elementsWhichWeCanReplaceWithWildcards) && compiledObj[key].elementsWhichWeCanReplaceWithWildcards.some(function (val) {
      return val !== false;
    })) {
      var rangesArr = [];
      var nThIndex = 0;
      for (var z = 0; z < compiledObj[key].elementsWhichWeCanReplaceWithWildcards.length; z++) {
        nThIndex = newKey.indexOf("".concat(opts.wildcard || ""), nThIndex + (opts.wildcard || "").length);
        if (compiledObj[key].elementsWhichWeCanReplaceWithWildcards[z] !== false) {
          rangesArr.push([nThIndex, nThIndex + (opts.wildcard || "").length, compiledObj[key].elementsWhichWeCanReplaceWithWildcards[z]]);
        }
      }
      newKey = rangesApply.rApply(newKey, rangesArr);
    }
    resObj[newKey] = compiledObj[key].count;
  });
  return resObj;
}

exports.groupStr = groupStr;
exports.version = version;
