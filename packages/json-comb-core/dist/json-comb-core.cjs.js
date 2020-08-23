/**
 * json-comb-core
 * The inner core of json-comb
 * Version: 6.6.29
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/json-comb-core
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var flattenAllArrays = require('object-flatten-all-arrays');
var fillMissingKeys = require('object-fill-missing-keys');
var setAllValuesTo = require('object-set-all-values-to');
var mergeAdvanced = require('object-merge-advanced');
var compareVersions = require('compare-versions');
var includes = require('lodash.includes');
var nnk = require('object-no-new-keys');
var clone = require('lodash.clonedeep');
var sortKeys = require('sort-keys');
var pReduce = require('p-reduce');
var typ = require('type-detect');
var pOne = require('p-one');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var flattenAllArrays__default = /*#__PURE__*/_interopDefaultLegacy(flattenAllArrays);
var fillMissingKeys__default = /*#__PURE__*/_interopDefaultLegacy(fillMissingKeys);
var setAllValuesTo__default = /*#__PURE__*/_interopDefaultLegacy(setAllValuesTo);
var mergeAdvanced__default = /*#__PURE__*/_interopDefaultLegacy(mergeAdvanced);
var compareVersions__default = /*#__PURE__*/_interopDefaultLegacy(compareVersions);
var includes__default = /*#__PURE__*/_interopDefaultLegacy(includes);
var nnk__default = /*#__PURE__*/_interopDefaultLegacy(nnk);
var clone__default = /*#__PURE__*/_interopDefaultLegacy(clone);
var sortKeys__default = /*#__PURE__*/_interopDefaultLegacy(sortKeys);
var pReduce__default = /*#__PURE__*/_interopDefaultLegacy(pReduce);
var typ__default = /*#__PURE__*/_interopDefaultLegacy(typ);
var pOne__default = /*#__PURE__*/_interopDefaultLegacy(pOne);

function _typeof(obj) {
  "@babel/helpers - typeof";

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

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function existy(x) {
  return x != null;
}
function truthy(x) {
  return x !== false && existy(x);
}
function isObj(something) {
  return typ__default['default'](something) === "Object";
}
function isStr(something) {
  return typeof something === "string";
}
var isArr = Array.isArray;
function toString(obj) {
  if (obj === null) {
    return "null";
  }
  if (typeof obj === "boolean" || typeof obj === "number") {
    return obj.toString();
  }
  if (typeof obj === "string") {
    return obj;
  }
  if (_typeof(obj) === "symbol") {
    throw new TypeError();
  }
  return obj.toString();
}
function defaultCompare(x, y) {
  if (x === undefined && y === undefined) {
    return 0;
  }
  if (x === undefined) {
    return 1;
  }
  if (y === undefined) {
    return -1;
  }
  var xString = toString(x);
  var yString = toString(y);
  if (xString < yString) {
    return -1;
  }
  if (xString > yString) {
    return 1;
  }
  return 0;
}
function compare(firstEl, secondEl) {
  var semverRegex = /^\d+\.\d+\.\d+$/g;
  if (firstEl.match(semverRegex) && secondEl.match(semverRegex)) {
    return compareVersions__default['default'](firstEl, secondEl);
  }
  return defaultCompare(firstEl, secondEl);
}
function sortAllObjectsSync(input) {
  if (isObj(input) || isArr(input)) {
    return sortKeys__default['default'](input, {
      deep: true,
      compare: compare
    });
  }
  return input;
}
function getKeyset(arrOfPromises, originalOpts) {
  if (arguments.length === 0) {
    throw new Error("json-comb-core/getKeyset(): [THROW_ID_11] Inputs missing!");
  }
  if (existy(originalOpts) && !isObj(originalOpts)) {
    throw new TypeError("json-comb-core/getKeysetSync(): [THROW_ID_12] Options object must be a plain object! Currently it's: ".concat(_typeof(originalOpts), ", equal to: ").concat(JSON.stringify(originalOpts, null, 4)));
  }
  var defaults = {
    placeholder: false
  };
  var opts = _objectSpread2(_objectSpread2({}, defaults), originalOpts);
  var culpritIndex;
  var culpritVal;
  return new Promise(function (resolve, reject) {
    pOne__default['default'](arrOfPromises, function (element, index) {
      if (!isObj(element)) {
        culpritIndex = index;
        culpritVal = element;
        return true;
      }
      return false;
    }).then(function (res) {
      if (res) {
        return reject(Error("json-comb-core/getKeyset(): [THROW_ID_13] Oops! ".concat(culpritIndex, "th element resolved not to a plain object but to a ").concat(_typeof(culpritVal), "\n").concat(JSON.stringify(culpritVal, null, 4))));
      }
      return pReduce__default['default'](arrOfPromises,
      function (previousValue, currentValue) {
        return mergeAdvanced__default['default'](flattenAllArrays__default['default'](previousValue, {
          flattenArraysContainingStringsToBeEmpty: true
        }), flattenAllArrays__default['default'](currentValue, {
          flattenArraysContainingStringsToBeEmpty: true
        }), {
          mergeArraysContainingStringsToBeEmpty: true
        });
      },
      {}
      ).then(function (res2) {
        resolve(setAllValuesTo__default['default'](res2, opts.placeholder));
      });
    });
  });
}
function getKeysetSync(arrOriginal, originalOpts) {
  if (arguments.length === 0) {
    throw new Error("json-comb-core/getKeysetSync(): [THROW_ID_21] Inputs missing!");
  }
  if (!isArr(arrOriginal)) {
    throw new Error("json-comb-core/getKeysetSync(): [THROW_ID_22] Input must be array! Currently it's: ".concat(_typeof(arrOriginal)));
  }
  if (arrOriginal.length === 0) {
    throw new Error("json-comb-core/getKeysetSync(): [THROW_ID_23] Input array is empty!");
  }
  if (existy(originalOpts) && !isObj(originalOpts)) {
    throw new TypeError("json-comb-core/getKeysetSync(): [THROW_ID_24] Options object must be a plain object! Currently it's: ".concat(_typeof(originalOpts), ", equal to: ").concat(JSON.stringify(originalOpts, null, 4)));
  }
  var schemaObj = {};
  var arr = clone__default['default'](arrOriginal);
  var defaults = {
    placeholder: false
  };
  var opts = _objectSpread2(_objectSpread2({}, defaults), originalOpts);
  var fOpts = {
    flattenArraysContainingStringsToBeEmpty: true
  };
  arr.forEach(function (obj, i) {
    if (!isObj(obj)) {
      throw new TypeError("json-comb-core/getKeysetSync(): [THROW_ID_25] Non-object (".concat(_typeof(obj), ") detected within an array! It's the ").concat(i, "th element: ").concat(JSON.stringify(obj, null, 4)));
    }
    schemaObj = mergeAdvanced__default['default'](flattenAllArrays__default['default'](schemaObj, fOpts), flattenAllArrays__default['default'](obj, fOpts), {
      mergeArraysContainingStringsToBeEmpty: true
    });
  });
  schemaObj = sortAllObjectsSync(setAllValuesTo__default['default'](schemaObj, opts.placeholder));
  return schemaObj;
}
function enforceKeyset(obj, schemaKeyset, originalOpts) {
  if (arguments.length === 0) {
    throw new Error("json-comb-core/enforceKeyset(): [THROW_ID_31] Inputs missing!");
  }
  if (arguments.length === 1) {
    throw new Error("json-comb-core/enforceKeyset(): [THROW_ID_32] Second arg missing!");
  }
  var defaults = {
    doNotFillThesePathsIfTheyContainPlaceholders: [],
    placeholder: false,
    useNullAsExplicitFalse: true
  };
  var opts = _objectSpread2(_objectSpread2({}, defaults), originalOpts);
  if (opts.doNotFillThesePathsIfTheyContainPlaceholders.length > 0 && !opts.doNotFillThesePathsIfTheyContainPlaceholders.every(function (val) {
    return isStr(val);
  })) {
    throw new Error("json-comb-core/enforceKeyset(): [THROW_ID_33] Array opts.doNotFillThesePathsIfTheyContainPlaceholders contains non-string values:\n".concat(JSON.stringify(opts.doNotFillThesePathsIfTheyContainPlaceholders, null, 4)));
  }
  return new Promise(function (resolve, reject) {
    Promise.all([obj, schemaKeyset]).then(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          objResolved = _ref2[0],
          schemaKeysetResolved = _ref2[1];
      if (!isObj(obj)) {
        return reject(Error("json-comb-core/enforceKeyset(): [THROW_ID_34] Input must resolve to a plain object! Currently it's: ".concat(_typeof(obj), ", equal to: ").concat(JSON.stringify(obj, null, 4))));
      }
      if (!isObj(schemaKeyset)) {
        return reject(Error("json-comb-core/enforceKeyset(): [THROW_ID_35] Schema, 2nd arg, must resolve to a plain object! Currently it's resolving to: ".concat(_typeof(schemaKeyset), ", equal to: ").concat(JSON.stringify(schemaKeyset, null, 4))));
      }
      return resolve(sortAllObjectsSync(clone__default['default'](fillMissingKeys__default['default'](clone__default['default'](objResolved), clone__default['default'](schemaKeysetResolved), opts))));
    });
  });
}
function enforceKeysetSync(obj, schemaKeyset, originalOpts) {
  if (arguments.length === 0) {
    throw new Error("json-comb-core/enforceKeysetSync(): [THROW_ID_41] Inputs missing!");
  }
  if (arguments.length === 1) {
    throw new Error("json-comb-core/enforceKeysetSync(): [THROW_ID_42] Second arg missing!");
  }
  if (!isObj(obj)) {
    throw new Error("json-comb-core/enforceKeysetSync(): [THROW_ID_43] Input must be a plain object! Currently it's: ".concat(_typeof(obj), ", equal to: ").concat(JSON.stringify(obj, null, 4)));
  }
  if (!isObj(schemaKeyset)) {
    throw new Error("json-comb-core/enforceKeysetSync(): [THROW_ID_44] Schema object must be a plain object! Currently it's: ".concat(_typeof(schemaKeyset), ", equal to: ").concat(JSON.stringify(schemaKeyset, null, 4)));
  }
  var defaults = {
    doNotFillThesePathsIfTheyContainPlaceholders: [],
    placeholder: false,
    useNullAsExplicitFalse: true
  };
  var opts = _objectSpread2(_objectSpread2({}, defaults), originalOpts);
  if (opts.doNotFillThesePathsIfTheyContainPlaceholders.length > 0 && !opts.doNotFillThesePathsIfTheyContainPlaceholders.every(function (val) {
    return isStr(val);
  })) {
    throw new Error("json-comb-core/enforceKeyset(): [THROW_ID_45] Array opts.doNotFillThesePathsIfTheyContainPlaceholders contains non-string values:\n".concat(JSON.stringify(opts.doNotFillThesePathsIfTheyContainPlaceholders, null, 4)));
  }
  return sortAllObjectsSync(fillMissingKeys__default['default'](clone__default['default'](obj), schemaKeyset, opts));
}
function noNewKeysSync(obj, schemaKeyset) {
  if (arguments.length === 0) {
    throw new Error("json-comb-core/noNewKeysSync(): [THROW_ID_51] All inputs missing!");
  }
  if (arguments.length === 1) {
    throw new Error("json-comb-core/noNewKeysSync(): [THROW_ID_52] Schema object is missing!");
  }
  if (!isObj(obj)) {
    throw new Error("json-comb-core/noNewKeysSync(): [THROW_ID_53] Main input (1st arg.) must be a plain object! Currently it's: ".concat(_typeof(obj), ", equal to: ").concat(JSON.stringify(obj, null, 4)));
  }
  if (!isObj(schemaKeyset)) {
    throw new Error("json-comb-core/noNewKeysSync(): [THROW_ID_54] Schema input (2nd arg.) must be a plain object! Currently it's: ".concat(_typeof(schemaKeyset), ", equal to: ").concat(JSON.stringify(schemaKeyset, null, 4)));
  }
  return nnk__default['default'](obj, schemaKeyset);
}
function findUnusedSync(arrOriginal, originalOpts) {
  if (isArr(arrOriginal)) {
    if (arrOriginal.length === 0) {
      return [];
    }
  } else {
    throw new TypeError("json-comb-core/findUnusedSync(): [THROW_ID_61] The first argument should be an array. Currently it's: ".concat(_typeof(arrOriginal)));
  }
  if (arguments.length > 1 && !isObj(originalOpts)) {
    throw new TypeError("json-comb-core/findUnusedSync(): [THROW_ID_62] The second argument, options object, must be a plain object, not ".concat(_typeof(originalOpts)));
  }
  var defaults = {
    placeholder: false,
    comments: "__comment__"
  };
  var opts = _objectSpread2(_objectSpread2({}, defaults), originalOpts);
  if (opts.comments === 1 || opts.comments === "1") {
    throw new TypeError("json-comb-core/findUnusedSync(): [THROW_ID_63] opts.comments was set to Number 1, but it does not make sense. Either it's string or falsey. Please fix.");
  }
  if (opts.comments === true || opts.comments === "true") {
    throw new TypeError('json-comb-core/findUnusedSync(): [THROW_ID_63] opts.comments was set to Boolean "true", but it does not make sense. Either it\'s string or falsey. Please fix.');
  }
  if (!truthy(opts.comments) || opts.comments === 0) {
    opts.comments = false;
  }
  if (opts.comments === "") {
    opts.comments = false;
  }
  var arr = clone__default['default'](arrOriginal);
  function removeLeadingDot(something) {
    return something.map(function (finding) {
      return finding.charAt(0) === "." ? finding.slice(1) : finding;
    });
  }
  function findUnusedSyncInner(arr1, opts1) {
    var res = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    var path = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "";
    if (isArr(arr1) && arr1.length === 0) {
      return res;
    }
    var keySet;
    if (arr1.every(function (el) {
      return isObj(el);
    })) {
      var _ref3;
      keySet = getKeysetSync(arr1);
      if (arr1.length > 1) {
        var unusedKeys = Object.keys(keySet).filter(function (key) {
          return arr1.every(function (obj) {
            return (obj[key] === opts1.placeholder || obj[key] === undefined) && (!opts1.comments || !includes__default['default'](key, opts1.comments));
          });
        });
        res = res.concat(unusedKeys.map(function (el) {
          return "".concat(path, ".").concat(el);
        }));
      }
      var keys = (_ref3 = []).concat.apply(_ref3, _toConsumableArray(Object.keys(keySet).filter(function (key) {
        return isObj(keySet[key]) || isArr(keySet[key]);
      })));
      var keysContents = keys.map(function (key) {
        return typ__default['default'](keySet[key]);
      });
      var extras = keys.map(function (el) {
        var _ref4;
        return (_ref4 = []).concat.apply(_ref4, _toConsumableArray(arr1.reduce(function (res1, obj) {
          if (existy(obj[el]) && obj[el] !== opts1.placeholder) {
            if (!opts1.comments || !includes__default['default'](obj[el], opts1.comments)) {
              res1.push(obj[el]);
            }
          }
          return res1;
        }, [])));
      });
      var appendix = "";
      var innerDot = "";
      if (extras.length > 0) {
        extras.forEach(function (singleExtra, i) {
          if (keysContents[i] === "Array") {
            appendix = "[".concat(i, "]");
          }
          innerDot = ".";
          res = findUnusedSyncInner(singleExtra, opts1, res, path + innerDot + keys[i] + appendix);
        });
      }
    } else if (arr1.every(function (el) {
      return isArr(el);
    })) {
      arr1.forEach(function (singleArray, i) {
        res = findUnusedSyncInner(singleArray, opts1, res, "".concat(path, "[").concat(i, "]"));
      });
    }
    return removeLeadingDot(res);
  }
  return findUnusedSyncInner(arr, opts);
}

exports.enforceKeyset = enforceKeyset;
exports.enforceKeysetSync = enforceKeysetSync;
exports.findUnusedSync = findUnusedSync;
exports.getKeyset = getKeyset;
exports.getKeysetSync = getKeysetSync;
exports.noNewKeysSync = noNewKeysSync;
exports.sortAllObjectsSync = sortAllObjectsSync;
