/**
 * object-flatten-all-arrays
 * Merge and flatten any arrays found in all values within plain objects
 * Version: 4.9.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/object-flatten-all-arrays/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var merge = require('lodash.merge');
var clone = require('lodash.clonedeep');
var isObj = require('lodash.isplainobject');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _objectSpread__default = /*#__PURE__*/_interopDefaultLegacy(_objectSpread);
var merge__default = /*#__PURE__*/_interopDefaultLegacy(merge);
var clone__default = /*#__PURE__*/_interopDefaultLegacy(clone);
var isObj__default = /*#__PURE__*/_interopDefaultLegacy(isObj);

var version = "4.9.1";

var version$1 = version;

function flattenAllArrays(originalIncommingObj, originalOpts) {
  //
  // internal functions
  // ==================
  function arrayContainsStr(arr) {
    return arr.some(function (val) {
      return typeof val === "string";
    });
  } // setup
  // =====


  var defaults = {
    flattenArraysContainingStringsToBeEmpty: false
  };

  var opts = _objectSpread__default['default'](_objectSpread__default['default']({}, defaults), originalOpts);

  var incommingObj = clone__default['default'](originalIncommingObj);
  var isFirstObj;
  var combinedObj;
  var firstObjIndex; // action
  // ======
  // 1. check current

  if (Array.isArray(incommingObj)) {
    if (opts.flattenArraysContainingStringsToBeEmpty && arrayContainsStr(incommingObj)) {
      return [];
    }

    isFirstObj = null;
    combinedObj = {};
    firstObjIndex = 0;

    for (var i = 0, len = incommingObj.length; i < len; i++) {
      if (isObj__default['default'](incommingObj[i])) {
        combinedObj = merge__default['default'](combinedObj, incommingObj[i]);

        if (isFirstObj === null) {
          isFirstObj = true;
          firstObjIndex = i;
        } else {
          incommingObj.splice(i, 1);
          i -= 1;
        }
      }
    }

    if (isFirstObj !== null) {
      incommingObj[firstObjIndex] = clone__default['default'](combinedObj);
    }
  } // 2. traverse deeper


  if (isObj__default['default'](incommingObj)) {
    Object.keys(incommingObj).forEach(function (key) {
      if (isObj__default['default'](incommingObj[key]) || Array.isArray(incommingObj[key])) {
        incommingObj[key] = flattenAllArrays(incommingObj[key], opts);
      }
    });
  } else if (Array.isArray(incommingObj)) {
    incommingObj.forEach(function (_el, i) {
      if (isObj__default['default'](incommingObj[i]) || Array.isArray(incommingObj[i])) {
        incommingObj[i] = flattenAllArrays(incommingObj[i], opts);
      }
    });
  }

  return incommingObj;
}

exports.flattenAllArrays = flattenAllArrays;
exports.version = version$1;
