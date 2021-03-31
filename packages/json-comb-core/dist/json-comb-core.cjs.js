/**
 * json-comb-core
 * The inner core of json-comb
 * Version: 6.8.12
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/json-comb-core/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var objectFlattenAllArrays = require('object-flatten-all-arrays');
var objectFillMissingKeys = require('object-fill-missing-keys');
var objectSetAllValuesTo = require('object-set-all-values-to');
var objectMergeAdvanced = require('object-merge-advanced');
var compareVersions = require('compare-versions');
var includes = require('lodash.includes');
var objectNoNewKeys = require('object-no-new-keys');
var clone = require('lodash.clonedeep');
var sortKeys = require('sort-keys');
var pReduce = require('p-reduce');
var typ = require('type-detect');
var pOne = require('p-one');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _objectSpread__default = /*#__PURE__*/_interopDefaultLegacy(_objectSpread);
var compareVersions__default = /*#__PURE__*/_interopDefaultLegacy(compareVersions);
var includes__default = /*#__PURE__*/_interopDefaultLegacy(includes);
var clone__default = /*#__PURE__*/_interopDefaultLegacy(clone);
var sortKeys__default = /*#__PURE__*/_interopDefaultLegacy(sortKeys);
var pReduce__default = /*#__PURE__*/_interopDefaultLegacy(pReduce);
var typ__default = /*#__PURE__*/_interopDefaultLegacy(typ);
var pOne__default = /*#__PURE__*/_interopDefaultLegacy(pOne);

var version$1 = "6.8.12";

var version = version$1;
function existy(x) {
  return x != null;
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
  if (typeof obj === "symbol") {
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
    throw new TypeError("json-comb-core/getKeysetSync(): [THROW_ID_12] Options object must be a plain object! Currently it's: " + typeof originalOpts + ", equal to: " + JSON.stringify(originalOpts, null, 4));
  }
  var defaults = {
    placeholder: false
  };
  var opts = _objectSpread__default['default'](_objectSpread__default['default']({}, defaults), originalOpts);
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
        return reject(Error("json-comb-core/getKeyset(): [THROW_ID_13] Oops! " + culpritIndex + "th element resolved not to a plain object but to a " + typeof culpritVal + "\n" + JSON.stringify(culpritVal, null, 4)));
      }
      return pReduce__default['default'](arrOfPromises,
      function (previousValue, currentValue) {
        return objectMergeAdvanced.mergeAdvanced(objectFlattenAllArrays.flattenAllArrays(previousValue, {
          flattenArraysContainingStringsToBeEmpty: true
        }), objectFlattenAllArrays.flattenAllArrays(currentValue, {
          flattenArraysContainingStringsToBeEmpty: true
        }), {
          mergeArraysContainingStringsToBeEmpty: true
        });
      },
      {}
      ).then(function (res2) {
        resolve(objectSetAllValuesTo.setAllValuesTo(res2, opts.placeholder));
      });
    });
  });
}
function getKeysetSync(arrOriginal, originalOpts) {
  if (arguments.length === 0) {
    throw new Error("json-comb-core/getKeysetSync(): [THROW_ID_21] Inputs missing!");
  }
  if (!isArr(arrOriginal)) {
    throw new Error("json-comb-core/getKeysetSync(): [THROW_ID_22] Input must be array! Currently it's: " + typeof arrOriginal);
  }
  if (arrOriginal.length === 0) {
    throw new Error("json-comb-core/getKeysetSync(): [THROW_ID_23] Input array is empty!");
  }
  if (existy(originalOpts) && !isObj(originalOpts)) {
    throw new TypeError("json-comb-core/getKeysetSync(): [THROW_ID_24] Options object must be a plain object! Currently it's: " + typeof originalOpts + ", equal to: " + JSON.stringify(originalOpts, null, 4));
  }
  var schemaObj = {};
  var arr = clone__default['default'](arrOriginal);
  var defaults = {
    placeholder: false
  };
  var opts = _objectSpread__default['default'](_objectSpread__default['default']({}, defaults), originalOpts);
  var fOpts = {
    flattenArraysContainingStringsToBeEmpty: true
  };
  arr.forEach(function (obj, i) {
    if (!isObj(obj)) {
      throw new TypeError("json-comb-core/getKeysetSync(): [THROW_ID_25] Non-object (" + typeof obj + ") detected within an array! It's the " + i + "th element: " + JSON.stringify(obj, null, 4));
    }
    schemaObj = objectMergeAdvanced.mergeAdvanced(objectFlattenAllArrays.flattenAllArrays(schemaObj, fOpts), objectFlattenAllArrays.flattenAllArrays(obj, fOpts), {
      mergeArraysContainingStringsToBeEmpty: true
    });
  });
  schemaObj = sortAllObjectsSync(objectSetAllValuesTo.setAllValuesTo(schemaObj, opts.placeholder));
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
  var opts = _objectSpread__default['default'](_objectSpread__default['default']({}, defaults), originalOpts);
  if (opts.doNotFillThesePathsIfTheyContainPlaceholders.length > 0 && !opts.doNotFillThesePathsIfTheyContainPlaceholders.every(function (val) {
    return isStr(val);
  })) {
    throw new Error("json-comb-core/enforceKeyset(): [THROW_ID_33] Array opts.doNotFillThesePathsIfTheyContainPlaceholders contains non-string values:\n" + JSON.stringify(opts.doNotFillThesePathsIfTheyContainPlaceholders, null, 4));
  }
  return new Promise(function (resolve, reject) {
    Promise.all([obj, schemaKeyset]).then(function (_ref) {
      var objResolved = _ref[0],
          schemaKeysetResolved = _ref[1];
      if (!isObj(obj)) {
        return reject(Error("json-comb-core/enforceKeyset(): [THROW_ID_34] Input must resolve to a plain object! Currently it's: " + typeof obj + ", equal to: " + JSON.stringify(obj, null, 4)));
      }
      if (!isObj(schemaKeyset)) {
        return reject(Error("json-comb-core/enforceKeyset(): [THROW_ID_35] Schema, 2nd arg, must resolve to a plain object! Currently it's resolving to: " + typeof schemaKeyset + ", equal to: " + JSON.stringify(schemaKeyset, null, 4)));
      }
      return resolve(sortAllObjectsSync(clone__default['default'](objectFillMissingKeys.fillMissing(clone__default['default'](objResolved), clone__default['default'](schemaKeysetResolved), opts))));
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
    throw new Error("json-comb-core/enforceKeysetSync(): [THROW_ID_43] Input must be a plain object! Currently it's: " + typeof obj + ", equal to: " + JSON.stringify(obj, null, 4));
  }
  if (!isObj(schemaKeyset)) {
    throw new Error("json-comb-core/enforceKeysetSync(): [THROW_ID_44] Schema object must be a plain object! Currently it's: " + typeof schemaKeyset + ", equal to: " + JSON.stringify(schemaKeyset, null, 4));
  }
  var defaults = {
    doNotFillThesePathsIfTheyContainPlaceholders: [],
    placeholder: false,
    useNullAsExplicitFalse: true
  };
  var opts = _objectSpread__default['default'](_objectSpread__default['default']({}, defaults), originalOpts);
  if (opts.doNotFillThesePathsIfTheyContainPlaceholders.length > 0 && !opts.doNotFillThesePathsIfTheyContainPlaceholders.every(function (val) {
    return isStr(val);
  })) {
    throw new Error("json-comb-core/enforceKeyset(): [THROW_ID_45] Array opts.doNotFillThesePathsIfTheyContainPlaceholders contains non-string values:\n" + JSON.stringify(opts.doNotFillThesePathsIfTheyContainPlaceholders, null, 4));
  }
  return sortAllObjectsSync(objectFillMissingKeys.fillMissing(clone__default['default'](obj), schemaKeyset, opts));
}
function noNewKeysSync(obj, schemaKeyset) {
  if (arguments.length === 0) {
    throw new Error("json-comb-core/noNewKeysSync(): [THROW_ID_51] All inputs missing!");
  }
  if (arguments.length === 1) {
    throw new Error("json-comb-core/noNewKeysSync(): [THROW_ID_52] Schema object is missing!");
  }
  if (!isObj(obj)) {
    throw new Error("json-comb-core/noNewKeysSync(): [THROW_ID_53] Main input (1st arg.) must be a plain object! Currently it's: " + typeof obj + ", equal to: " + JSON.stringify(obj, null, 4));
  }
  if (!isObj(schemaKeyset)) {
    throw new Error("json-comb-core/noNewKeysSync(): [THROW_ID_54] Schema input (2nd arg.) must be a plain object! Currently it's: " + typeof schemaKeyset + ", equal to: " + JSON.stringify(schemaKeyset, null, 4));
  }
  return objectNoNewKeys.noNewKeys(obj, schemaKeyset);
}
function findUnusedSync(arrOriginal, originalOpts) {
  if (isArr(arrOriginal)) {
    if (arrOriginal.length === 0) {
      return [];
    }
  } else {
    throw new TypeError("json-comb-core/findUnusedSync(): [THROW_ID_61] The first argument should be an array. Currently it's: " + typeof arrOriginal);
  }
  if (arguments.length > 1 && !isObj(originalOpts)) {
    throw new TypeError("json-comb-core/findUnusedSync(): [THROW_ID_62] The second argument, options object, must be a plain object, not " + typeof originalOpts);
  }
  var defaults = {
    placeholder: false,
    comments: "__comment__"
  };
  var opts = _objectSpread__default['default'](_objectSpread__default['default']({}, defaults), originalOpts);
  if (!opts.comments) {
    opts.comments = "";
  }
  var arr = clone__default['default'](arrOriginal);
  function removeLeadingDot(something) {
    return something.map(function (finding) {
      return finding.charAt(0) === "." ? finding.slice(1) : finding;
    });
  }
  function findUnusedSyncInner(arr1, opts1, res, path) {
    if (res === void 0) {
      res = [];
    }
    if (path === void 0) {
      path = "";
    }
    if (isArr(arr1) && arr1.length === 0) {
      return res;
    }
    var keySet;
    if (arr1.every(function (el) {
      return isObj(el);
    })) {
      var _ref2;
      keySet = getKeysetSync(arr1);
      if (arr1.length > 1) {
        var unusedKeys = Object.keys(keySet).filter(function (key) {
          return arr1.every(function (obj) {
            return (opts1 && obj[key] === opts1.placeholder || obj[key] === undefined) && (!opts1 || !opts1.comments || !includes__default['default'](key, opts1.comments));
          });
        });
        res = res.concat(unusedKeys.map(function (el) {
          return path + "." + el;
        }));
      }
      var keys = (_ref2 = []).concat.apply(_ref2, Object.keys(keySet).filter(function (key) {
        return isObj(keySet[key]) || isArr(keySet[key]);
      }));
      var keysContents = keys.map(function (key) {
        return typ__default['default'](keySet[key]);
      });
      var extras = keys.map(function (el) {
        var _ref3;
        return (_ref3 = []).concat.apply(_ref3, arr1.reduce(function (res1, obj) {
          if (obj && existy(obj[el]) && (!opts1 || obj[el] !== opts1.placeholder)) {
            if (!opts1 || !opts1.comments || !includes__default['default'](obj[el], opts1.comments)) {
              res1.push(obj[el]);
            }
          }
          return res1;
        }, []));
      });
      var appendix = "";
      var innerDot = "";
      if (extras.length > 0) {
        extras.forEach(function (singleExtra, i) {
          if (keysContents[i] === "Array") {
            appendix = "[" + i + "]";
          }
          innerDot = ".";
          res = findUnusedSyncInner(singleExtra, opts1, res, path + innerDot + keys[i] + appendix);
        });
      }
    } else if (arr1.every(function (el) {
      return isArr(el);
    })) {
      arr1.forEach(function (singleArray, i) {
        res = findUnusedSyncInner(singleArray, opts1, res, path + "[" + i + "]");
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
exports.version = version;
