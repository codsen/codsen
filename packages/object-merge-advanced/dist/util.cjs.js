'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var includesAll = _interopDefault(require('array-includes-all'));
var typeDetect = _interopDefault(require('type-detect'));

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// ===================================
// V A R S

// ===================================
// F U N C T I O N S

function existy(x) {
  return x != null;
}

function isObj(something) {
  return typeDetect(something) === 'Object';
}

function isArr(something) {
  return Array.isArray(something);
}

function isBool(bool) {
  return typeof bool === 'boolean';
}

function equalOrSubsetKeys(obj1, obj2) {
  if (!isObj(obj1)) {
    throw new TypeError('object-merge-advanced/util.js/equalOrSubsetKeys(): [THROW_ID_03] First input is not an object, it\'s ' + (typeof obj1 === 'undefined' ? 'undefined' : _typeof(obj1)));
  }
  if (!isObj(obj2)) {
    throw new TypeError('object-merge-advanced/util.js/equalOrSubsetKeys(): [THROW_ID_04] Second input is not an object, it\'s ' + (typeof obj2 === 'undefined' ? 'undefined' : _typeof(obj2)));
  }
  if (Object.keys(obj1).length === 0 || Object.keys(obj2).length === 0) {
    return true;
  }
  return includesAll(Object.keys(obj1), Object.keys(obj2)) || includesAll(Object.keys(obj2), Object.keys(obj1));
}

function arrayContainsStr(arr) {
  if (arguments.length === 0) {
    return false;
  }
  if (!isArr(arr)) {
    throw new TypeError('object-merge-advanced/util.js/arrayContainsStr(): [THROW_ID_05] input must be array');
  }
  return arr.some(function (val) {
    return typeof val === 'string';
  });
}

exports.existy = existy;
exports.isBool = isBool;
exports.equalOrSubsetKeys = equalOrSubsetKeys;
exports.arrayContainsStr = arrayContainsStr;
