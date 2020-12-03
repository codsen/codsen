/**
 * object-merge-advanced
 * Recursive, deep merge of anything (objects, arrays, strings or nested thereof), which weighs contents by type hierarchy to ensure the maximum content is retained
 * Version: 10.12.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/object-merge-advanced/
 */

'use strict';

var clone = require('lodash.clonedeep');
var includes = require('array-includes-with-glob');
var lodashIncludes = require('lodash.includes');
var uniq = require('lodash.uniq');
var arrayiffyString = require('arrayiffy-if-string');
var nonEmpty = require('util-nonempty');
var includesAll = require('array-includes-all');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var clone__default = /*#__PURE__*/_interopDefaultLegacy(clone);
var includes__default = /*#__PURE__*/_interopDefaultLegacy(includes);
var lodashIncludes__default = /*#__PURE__*/_interopDefaultLegacy(lodashIncludes);
var uniq__default = /*#__PURE__*/_interopDefaultLegacy(uniq);
var arrayiffyString__default = /*#__PURE__*/_interopDefaultLegacy(arrayiffyString);
var nonEmpty__default = /*#__PURE__*/_interopDefaultLegacy(nonEmpty);
var includesAll__default = /*#__PURE__*/_interopDefaultLegacy(includesAll);

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

function isStr(something) {
  return typeof something === "string";
}
function isNum(something) {
  return typeof something === "number";
}
function isBool(something) {
  return typeof something === "boolean";
}
function isFun(something) {
  return typeof something === "function";
}
function isObj(something) {
  return something && _typeof(something) === "object" && !Array.isArray(something);
}
var isArr = Array.isArray;
function arrayContainsStr(arr) {
  return !!arr && arr.some(function (val) {
    return typeof val === "string";
  });
}
function equalOrSubsetKeys(obj1, obj2) {
  return Object.keys(obj1).length === 0 || Object.keys(obj2).length === 0 || includesAll__default['default'](Object.keys(obj1), Object.keys(obj2)) || includesAll__default['default'](Object.keys(obj2), Object.keys(obj1));
}
function getType(something) {
  if (isObj(something)) {
    return "object";
  }
  if (isArr(something)) {
    return "array";
  }
  return _typeof(something);
}
function mergeAdvanced(infoObj, input1orig, input2orig) {
  var originalOpts = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  if (!isObj(originalOpts)) {
    throw new TypeError("object-merge-advanced/mergeAdvanced(): [THROW_ID_02] Options object, the third argument, must be a plain object");
  }
  var defaults = {
    cb: null,
    mergeObjectsOnlyWhenKeysetMatches: true,
    ignoreKeys: [],
    hardMergeKeys: [],
    hardArrayConcatKeys: [],
    mergeArraysContainingStringsToBeEmpty: false,
    oneToManyArrayObjectMerge: false,
    hardMergeEverything: false,
    hardArrayConcat: false,
    ignoreEverything: false,
    concatInsteadOfMerging: true,
    dedupeStringsInArrayValues: false,
    mergeBoolsUsingOrNotAnd: true,
    useNullAsExplicitFalse: false
  };
  var opts = Object.assign(clone__default['default'](defaults), originalOpts);
  opts.ignoreKeys = arrayiffyString__default['default'](opts.ignoreKeys);
  opts.hardMergeKeys = arrayiffyString__default['default'](opts.hardMergeKeys);
  if (opts.hardMergeKeys.includes("*")) {
    opts.hardMergeEverything = true;
  }
  if (opts.ignoreKeys.includes("*")) {
    opts.ignoreEverything = true;
  }
  var currPath;
  if (opts.useNullAsExplicitFalse && (input1orig === null || input2orig === null)) {
    return isFun(opts.cb) ? opts.cb(input1orig, input2orig, null, {
      path: infoObj.path,
      key: infoObj.key,
      type: infoObj.type
    }) : null;
  }
  var i1 = isArr(input1orig) || isObj(input1orig) ? clone__default['default'](input1orig) : input1orig;
  var i2 = isArr(input2orig) || isObj(input2orig) ? clone__default['default'](input2orig) : input2orig;
  var uniRes;
  if (opts.ignoreEverything) {
    uniRes = i1;
  } else if (opts.hardMergeEverything) {
    uniRes = i2;
  }
  var uni = opts.hardMergeEverything || opts.ignoreEverything;
  if (isArr(i1)) {
    if (nonEmpty__default['default'](i1)) {
      if (isArr(i2) && nonEmpty__default['default'](i2)) {
        if (opts.mergeArraysContainingStringsToBeEmpty && (arrayContainsStr(i1) || arrayContainsStr(i2))) {
          var _currentResult = uni ? uniRes : [];
          return isFun(opts.cb) ? opts.cb(i1, i2, _currentResult, {
            path: currPath,
            key: infoObj.key,
            type: infoObj.type
          }) : _currentResult;
        }
        if (opts.hardArrayConcat) {
          var _currentResult2 = uni ? uniRes : i1.concat(i2);
          return isFun(opts.cb) ? opts.cb(i1, i2, _currentResult2, {
            path: currPath,
            key: infoObj.key,
            type: infoObj.type
          }) : _currentResult2;
        }
        var temp = [];
        for (var index = 0, len = Math.max(i1.length, i2.length); index < len; index++) {
          currPath = infoObj.path.length ? "".concat(infoObj.path, ".").concat(index) : "".concat(index);
          if (isObj(i1[index]) && isObj(i2[index]) && (opts.mergeObjectsOnlyWhenKeysetMatches && equalOrSubsetKeys(i1[index], i2[index]) || !opts.mergeObjectsOnlyWhenKeysetMatches)) {
            temp.push(mergeAdvanced({
              path: currPath,
              key: infoObj.key,
              type: [getType(i1), getType(i2)]
            }, i1[index], i2[index], opts));
          } else if (opts.oneToManyArrayObjectMerge && (i1.length === 1 || i2.length === 1)
          ) {
              temp.push(i1.length === 1 ? mergeAdvanced({
                path: currPath,
                key: infoObj.key,
                type: [getType(i1), getType(i2)]
              }, i1[0], i2[index], opts) : mergeAdvanced({
                path: currPath,
                key: infoObj.key,
                type: [getType(i1), getType(i2)]
              }, i1[index], i2[0], opts));
            } else if (opts.concatInsteadOfMerging) {
            if (index < i1.length) {
              temp.push(i1[index]);
            }
            if (index < i2.length) {
              temp.push(i2[index]);
            }
          } else {
            if (index < i1.length) {
              temp.push(i1[index]);
            }
            if (index < i2.length && !lodashIncludes__default['default'](i1, i2[index])) {
              temp.push(i2[index]);
            }
          }
        }
        if (opts.dedupeStringsInArrayValues && temp.every(function (el) {
          return isStr(el);
        })) {
          temp = uniq__default['default'](temp).sort();
        }
        i1 = clone__default['default'](temp);
      } else {
        var _currentResult3 = uni ? uniRes : i1;
        return isFun(opts.cb) ? opts.cb(i1, i2, _currentResult3, {
          path: currPath,
          key: infoObj.key,
          type: infoObj.type
        }) : _currentResult3;
      }
    } else {
      if (nonEmpty__default['default'](i2)) {
        var _currentResult5 = uni ? uniRes : i2;
        return isFun(opts.cb) ? opts.cb(i1, i2, _currentResult5, {
          path: currPath,
          key: infoObj.key,
          type: infoObj.type
        }) : _currentResult5;
      }
      var _currentResult4 = uni ? uniRes : i1;
      return isFun(opts.cb) ? opts.cb(i1, i2, _currentResult4, {
        path: currPath,
        key: infoObj.key,
        type: infoObj.type
      }) : _currentResult4;
    }
  } else if (isObj(i1)) {
    if (nonEmpty__default['default'](i1)) {
      if (isArr(i2)) {
        if (nonEmpty__default['default'](i2)) {
          var _currentResult9 = uni ? uniRes : i2;
          return isFun(opts.cb) ? opts.cb(i1, i2, _currentResult9, {
            path: currPath,
            key: infoObj.key,
            type: infoObj.type
          }) : _currentResult9;
        }
        var _currentResult8 = uni ? uniRes : i1;
        return isFun(opts.cb) ? opts.cb(i1, i2, _currentResult8, {
          path: currPath,
          key: infoObj.key,
          type: infoObj.type
        }) : _currentResult8;
      }
      if (isObj(i2)) {
        Object.keys(i2).forEach(function (key) {
          currPath = infoObj.path && infoObj.path.length ? "".concat(infoObj.path, ".").concat(key) : "".concat(key);
          if (i1.hasOwnProperty(key)) {
            if (includes__default['default'](key, opts.ignoreKeys)) {
              i1[key] = mergeAdvanced({
                path: currPath,
                key: key,
                type: [getType(i1), getType(i2)]
              }, i1[key], i2[key], _objectSpread2(_objectSpread2({}, opts), {}, {
                ignoreEverything: true
              }));
            } else if (includes__default['default'](key, opts.hardMergeKeys)) {
              i1[key] = mergeAdvanced({
                path: currPath,
                key: key,
                type: [getType(i1), getType(i2)]
              }, i1[key], i2[key], _objectSpread2(_objectSpread2({}, opts), {}, {
                hardMergeEverything: true
              }));
            } else if (includes__default['default'](key, opts.hardArrayConcatKeys)) {
              i1[key] = mergeAdvanced({
                path: currPath,
                key: key,
                type: [getType(i1), getType(i2)]
              }, i1[key], i2[key], _objectSpread2(_objectSpread2({}, opts), {}, {
                hardArrayConcat: true
              }));
            } else {
              i1[key] = mergeAdvanced({
                path: currPath,
                key: key,
                type: [getType(i1), getType(i2)]
              }, i1[key], i2[key], opts);
            }
          } else {
            i1[key] = i2[key];
          }
        });
        return i1;
      }
      var _currentResult7 = uni ? uniRes : i1;
      return isFun(opts.cb) ? opts.cb(i1, i2, _currentResult7, {
        path: infoObj.path,
        key: infoObj.key,
        type: infoObj.type
      }) : _currentResult7;
    }
    if (isArr(i2) || isObj(i2) || nonEmpty__default['default'](i2)) {
      var _currentResult10 = uni ? uniRes : i2;
      return isFun(opts.cb) ? opts.cb(i1, i2, _currentResult10, {
        path: infoObj.path,
        key: infoObj.key,
        type: infoObj.type
      }) : _currentResult10;
    }
    var _currentResult6 = uni ? uniRes : i1;
    return isFun(opts.cb) ? opts.cb(i1, i2, _currentResult6, {
      path: infoObj.path,
      key: infoObj.key,
      type: infoObj.type
    }) : _currentResult6;
  } else if (isStr(i1)) {
    if (nonEmpty__default['default'](i1)) {
      if ((isArr(i2) || isObj(i2) || isStr(i2)) && nonEmpty__default['default'](i2)) {
        var _currentResult13 = uni ? uniRes : i2;
        return isFun(opts.cb) ? opts.cb(i1, i2, _currentResult13, {
          path: infoObj.path,
          key: infoObj.key,
          type: infoObj.type
        }) : _currentResult13;
      }
      var _currentResult12 = uni ? uniRes : i1;
      return isFun(opts.cb) ? opts.cb(i1, i2, _currentResult12, {
        path: infoObj.path,
        key: infoObj.key,
        type: infoObj.type
      }) : _currentResult12;
    }
    if (i2 != null && !isBool(i2)) {
      var _currentResult14 = uni ? uniRes : i2;
      return isFun(opts.cb) ? opts.cb(i1, i2, _currentResult14, {
        path: infoObj.path,
        key: infoObj.key,
        type: infoObj.type
      }) : _currentResult14;
    }
    var _currentResult11 = uni ? uniRes : i1;
    return isFun(opts.cb) ? opts.cb(i1, i2, _currentResult11, {
      path: infoObj.path,
      key: infoObj.key,
      type: infoObj.type
    }) : _currentResult11;
  } else if (isNum(i1)) {
    if (nonEmpty__default['default'](i2)) {
      var _currentResult16 = uni ? uniRes : i2;
      return isFun(opts.cb) ? opts.cb(i1, i2, _currentResult16, {
        path: infoObj.path,
        key: infoObj.key,
        type: infoObj.type
      }) : _currentResult16;
    }
    var _currentResult15 = uni ? uniRes : i1;
    return isFun(opts.cb) ? opts.cb(i1, i2, _currentResult15, {
      path: infoObj.path,
      key: infoObj.key,
      type: infoObj.type
    }) : _currentResult15;
  } else if (isBool(i1)) {
    if (isBool(i2)) {
      if (opts.mergeBoolsUsingOrNotAnd) {
        var _currentResult19 = uni ? uniRes : i1 || i2;
        return isFun(opts.cb) ? opts.cb(i1, i2, _currentResult19, {
          path: infoObj.path,
          key: infoObj.key,
          type: infoObj.type
        }) : _currentResult19;
      }
      var _currentResult18 = uni ? uniRes : i1 && i2;
      return isFun(opts.cb) ? opts.cb(i1, i2, _currentResult18, {
        path: infoObj.path,
        key: infoObj.key,
        type: infoObj.type
      }) : _currentResult18;
    }
    if (i2 != null) {
      var _currentResult20 = uni ? uniRes : i2;
      return isFun(opts.cb) ? opts.cb(i1, i2, _currentResult20, {
        path: infoObj.path,
        key: infoObj.key,
        type: infoObj.type
      }) : _currentResult20;
    }
    var _currentResult17 = uni ? uniRes : i1;
    return isFun(opts.cb) ? opts.cb(i1, i2, _currentResult17, {
      path: infoObj.path,
      key: infoObj.key,
      type: infoObj.type
    }) : _currentResult17;
  } else if (i1 === null) {
    if (i2 != null) {
      var _currentResult22 = uni ? uniRes : i2;
      return isFun(opts.cb) ? opts.cb(i1, i2, _currentResult22, {
        path: infoObj.path,
        key: infoObj.key,
        type: infoObj.type
      }) : _currentResult22;
    }
    var _currentResult21 = uni ? uniRes : i1;
    return isFun(opts.cb) ? opts.cb(i1, i2, _currentResult21, {
      path: infoObj.path,
      key: infoObj.key,
      type: infoObj.type
    }) : _currentResult21;
  } else {
    var _currentResult23 = uni ? uniRes : i2;
    return isFun(opts.cb) ? opts.cb(i1, i2, _currentResult23, {
      path: infoObj.path,
      key: infoObj.key,
      type: infoObj.type
    }) : _currentResult23;
  }
  var currentResult = uni ? uniRes : i1;
  return isFun(opts.cb) ? opts.cb(i1, i2, currentResult, {
    path: infoObj.path,
    key: infoObj.key,
    type: infoObj.type
  }) : currentResult;
}
function externalApi(input1orig, input2orig, originalOpts) {
  if (arguments.length === 0) {
    throw new TypeError("object-merge-advanced/mergeAdvanced(): [THROW_ID_01] Both inputs are missing");
  }
  return mergeAdvanced({
    key: null,
    path: "",
    type: [getType(input1orig), getType(input2orig)]
  }, input1orig, input2orig, originalOpts);
}

module.exports = externalApi;
