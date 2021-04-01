/**
 * object-merge-advanced
 * Recursively, deeply merge of anything (objects, arrays, strings or nested thereof), which weighs contents by type hierarchy to ensure the maximum content is retained
 * Version: 12.0.9
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/object-merge-advanced/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var _typeof = require('@babel/runtime/helpers/typeof');
var clone = require('lodash.clonedeep');
var lodashIncludes = require('lodash.includes');
var uniq = require('lodash.uniq');
var isObj = require('lodash.isplainobject');
var isDate = require('lodash.isdate');
var arrayIncludesWithGlob = require('array-includes-with-glob');
var utilNonempty = require('util-nonempty');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _objectSpread__default = /*#__PURE__*/_interopDefaultLegacy(_objectSpread);
var _typeof__default = /*#__PURE__*/_interopDefaultLegacy(_typeof);
var clone__default = /*#__PURE__*/_interopDefaultLegacy(clone);
var lodashIncludes__default = /*#__PURE__*/_interopDefaultLegacy(lodashIncludes);
var uniq__default = /*#__PURE__*/_interopDefaultLegacy(uniq);
var isObj__default = /*#__PURE__*/_interopDefaultLegacy(isObj);
var isDate__default = /*#__PURE__*/_interopDefaultLegacy(isDate);

var version$1 = "12.0.9";

var version = version$1;
function isStr(something) {
  return typeof something === "string";
}
function isNum(something) {
  return typeof something === "number";
}
function isBool(something) {
  return typeof something === "boolean";
}
var isArr = Array.isArray;
function arrayContainsStr(arr) {
  return !!arr && arr.some(function (val) {
    return typeof val === "string";
  });
}
function equalOrSubsetKeys(obj1, obj2) {
  return Object.keys(obj1).length === 0 || Object.keys(obj2).length === 0 || Object.keys(obj1).every(function (val) {
    return Object.keys(obj2).includes(val);
  }) || Object.keys(obj2).every(function (val) {
    return Object.keys(obj1).includes(val);
  });
}
function getType(something) {
  if (something === null) {
    return "null";
  }
  if (isDate__default['default'](something)) {
    return "date";
  }
  if (isObj__default['default'](something)) {
    return "object";
  }
  if (isArr(something)) {
    return "array";
  }
  return _typeof__default['default'](something);
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
function mergeAdvanced(infoObj, input1orig, input2orig, originalOpts) {
  var opts = _objectSpread__default['default'](_objectSpread__default['default']({}, defaults), originalOpts);
  if (typeof opts.ignoreKeys === "string") {
    opts.ignoreKeys = [opts.ignoreKeys];
  }
  if (typeof opts.hardMergeKeys === "string") {
    opts.hardMergeKeys = [opts.hardMergeKeys];
  }
  if (opts.hardMergeKeys.includes("*")) {
    opts.hardMergeEverything = true;
  }
  if (opts.ignoreKeys.includes("*")) {
    opts.ignoreEverything = true;
  }
  var currPath;
  if (opts.useNullAsExplicitFalse && (input1orig === null || input2orig === null)) {
    if (typeof opts.cb === "function") {
      return opts.cb(input1orig, input2orig, null, {
        path: infoObj.path,
        key: infoObj.key,
        type: infoObj.type
      });
    }
    return null;
  }
  var i1 = isArr(input1orig) || isObj__default['default'](input1orig) ? clone__default['default'](input1orig) : input1orig;
  var i2 = isArr(input2orig) || isObj__default['default'](input2orig) ? clone__default['default'](input2orig) : input2orig;
  var uniRes;
  if (opts.ignoreEverything) {
    uniRes = i1;
  } else if (opts.hardMergeEverything) {
    uniRes = i2;
  }
  var uni = opts.hardMergeEverything || opts.ignoreEverything;
  if (isArr(i1)) {
    if (utilNonempty.nonEmpty(i1)) {
      if (isArr(i2) && utilNonempty.nonEmpty(i2)) {
        if (opts.mergeArraysContainingStringsToBeEmpty && (arrayContainsStr(i1) || arrayContainsStr(i2))) {
          var _currentResult = uni ? uniRes : [];
          if (typeof opts.cb === "function") {
            return opts.cb(clone__default['default'](input1orig), clone__default['default'](input2orig), _currentResult, {
              path: currPath,
              key: infoObj.key,
              type: infoObj.type
            });
          }
          return _currentResult;
        }
        if (opts.hardArrayConcat) {
          var _currentResult2 = uni ? uniRes : i1.concat(i2);
          if (typeof opts.cb === "function") {
            return opts.cb(clone__default['default'](input1orig), clone__default['default'](input2orig), _currentResult2, {
              path: currPath,
              key: infoObj.key,
              type: infoObj.type
            });
          }
          return _currentResult2;
        }
        var temp = [];
        for (var index = 0, len = Math.max(i1.length, i2.length); index < len; index++) {
          currPath = infoObj.path && infoObj.path.length ? "".concat(infoObj.path, ".").concat(index) : "".concat(index);
          if (isObj__default['default'](i1[index]) && isObj__default['default'](i2[index]) && (opts.mergeObjectsOnlyWhenKeysetMatches && equalOrSubsetKeys(i1[index], i2[index]) || !opts.mergeObjectsOnlyWhenKeysetMatches)) {
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
        if (typeof opts.cb === "function") {
          return opts.cb(clone__default['default'](input1orig), clone__default['default'](input2orig), _currentResult3, {
            path: currPath,
            key: infoObj.key,
            type: infoObj.type
          });
        }
        return _currentResult3;
      }
    } else {
      if (utilNonempty.nonEmpty(i2)) {
        var _currentResult5 = uni ? uniRes : i2;
        if (typeof opts.cb === "function") {
          return opts.cb(clone__default['default'](input1orig), clone__default['default'](input2orig), _currentResult5, {
            path: currPath,
            key: infoObj.key,
            type: infoObj.type
          });
        }
        return _currentResult5;
      }
      var _currentResult4 = uni ? uniRes : i1;
      if (typeof opts.cb === "function") {
        return opts.cb(clone__default['default'](input1orig), clone__default['default'](input2orig), _currentResult4, {
          path: currPath,
          key: infoObj.key,
          type: infoObj.type
        });
      }
      return _currentResult4;
    }
  } else if (isObj__default['default'](i1)) {
    if (utilNonempty.nonEmpty(i1)) {
      if (isArr(i2)) {
        if (utilNonempty.nonEmpty(i2)) {
          var _currentResult9 = uni ? uniRes : i2;
          if (typeof opts.cb === "function") {
            return opts.cb(clone__default['default'](input1orig), clone__default['default'](input2orig), _currentResult9, {
              path: currPath,
              key: infoObj.key,
              type: infoObj.type
            });
          }
          return _currentResult9;
        }
        var _currentResult8 = uni ? uniRes : i1;
        if (typeof opts.cb === "function") {
          return opts.cb(clone__default['default'](input1orig), clone__default['default'](input2orig), _currentResult8, {
            path: currPath,
            key: infoObj.key,
            type: infoObj.type
          });
        }
        return _currentResult8;
      }
      if (isObj__default['default'](i2)) {
        Object.keys(i2).forEach(function (key) {
          currPath = infoObj.path && infoObj.path.length ? "".concat(infoObj.path, ".").concat(key) : "".concat(key);
          if (i1.hasOwnProperty(key)) {
            if (arrayIncludesWithGlob.includesWithGlob(key, opts.ignoreKeys)) {
              i1[key] = mergeAdvanced({
                path: currPath,
                key: key,
                type: [getType(i1), getType(i2)]
              }, i1[key], i2[key], _objectSpread__default['default'](_objectSpread__default['default']({}, opts), {}, {
                ignoreEverything: true
              }));
            } else if (arrayIncludesWithGlob.includesWithGlob(key, opts.hardMergeKeys)) {
              i1[key] = mergeAdvanced({
                path: currPath,
                key: key,
                type: [getType(i1), getType(i2)]
              }, i1[key], i2[key], _objectSpread__default['default'](_objectSpread__default['default']({}, opts), {}, {
                hardMergeEverything: true
              }));
            } else if (arrayIncludesWithGlob.includesWithGlob(key, opts.hardArrayConcatKeys)) {
              i1[key] = mergeAdvanced({
                path: currPath,
                key: key,
                type: [getType(i1), getType(i2)]
              }, i1[key], i2[key], _objectSpread__default['default'](_objectSpread__default['default']({}, opts), {}, {
                hardArrayConcat: true
              }));
            } else {
              i1[key] = mergeAdvanced({
                path: currPath,
                key: key,
                type: [getType(i1[key]), getType(i2[key])]
              }, i1[key], i2[key], opts);
            }
          } else {
            i1[key] = i2[key];
          }
        });
        var _currentResult10 = uni ? uniRes : i1;
        if (typeof opts.cb === "function") {
          return opts.cb(clone__default['default'](input1orig), clone__default['default'](input2orig), _currentResult10, {
            path: infoObj.path,
            key: infoObj.key,
            type: infoObj.type
          });
        }
        return i1;
      }
      var _currentResult7 = uni ? uniRes : i1;
      if (typeof opts.cb === "function") {
        return opts.cb(clone__default['default'](input1orig), clone__default['default'](input2orig), _currentResult7, {
          path: infoObj.path,
          key: infoObj.key,
          type: infoObj.type
        });
      }
      return _currentResult7;
    }
    if (isArr(i2) || isObj__default['default'](i2) || utilNonempty.nonEmpty(i2)) {
      var _currentResult11 = uni ? uniRes : i2;
      if (typeof opts.cb === "function") {
        return opts.cb(clone__default['default'](input1orig), clone__default['default'](input2orig), _currentResult11, {
          path: infoObj.path,
          key: infoObj.key,
          type: infoObj.type
        });
      }
      return _currentResult11;
    }
    var _currentResult6 = uni ? uniRes : i1;
    if (typeof opts.cb === "function") {
      return opts.cb(clone__default['default'](input1orig), clone__default['default'](input2orig), _currentResult6, {
        path: infoObj.path,
        key: infoObj.key,
        type: infoObj.type
      });
    }
    return _currentResult6;
  } else if (isDate__default['default'](i1)) {
    if (isFinite(i1)) {
      if (isDate__default['default'](i2)) {
        if (isFinite(i2)) {
          var _currentResult15 = uni ? uniRes : i1 > i2 ? i1 : i2;
          if (typeof opts.cb === "function") {
            return opts.cb(clone__default['default'](input1orig), clone__default['default'](input2orig), _currentResult15, {
              path: infoObj.path,
              key: infoObj.key,
              type: infoObj.type
            });
          }
          return _currentResult15;
        }
        var _currentResult14 = uni ? uniRes : i1;
        if (typeof opts.cb === "function") {
          return opts.cb(clone__default['default'](input1orig), clone__default['default'](input2orig), _currentResult14, {
            path: infoObj.path,
            key: infoObj.key,
            type: infoObj.type
          });
        }
        return _currentResult14;
      }
      var _currentResult13 = uni ? uniRes : i2 ? i2 : i1;
      if (typeof opts.cb === "function") {
        return opts.cb(clone__default['default'](input1orig), clone__default['default'](input2orig), _currentResult13, {
          path: infoObj.path,
          key: infoObj.key,
          type: infoObj.type
        });
      }
      return _currentResult13;
    }
    if (isDate__default['default'](i2)) {
      var _currentResult16 = uni ? uniRes : i2;
      if (typeof opts.cb === "function") {
        return opts.cb(clone__default['default'](input1orig), clone__default['default'](input2orig), _currentResult16, {
          path: infoObj.path,
          key: infoObj.key,
          type: infoObj.type
        });
      }
      return _currentResult16;
    }
    var _currentResult12 = uni ? uniRes : i2;
    if (typeof opts.cb === "function") {
      return opts.cb(clone__default['default'](input1orig), clone__default['default'](input2orig), _currentResult12, {
        path: infoObj.path,
        key: infoObj.key,
        type: infoObj.type
      });
    }
    return _currentResult12;
  } else if (isStr(i1)) {
    if (utilNonempty.nonEmpty(i1)) {
      if ((isArr(i2) || isObj__default['default'](i2) || isStr(i2)) && utilNonempty.nonEmpty(i2)) {
        var _currentResult19 = uni ? uniRes : i2;
        if (typeof opts.cb === "function") {
          return opts.cb(clone__default['default'](input1orig), clone__default['default'](input2orig), _currentResult19, {
            path: infoObj.path,
            key: infoObj.key,
            type: infoObj.type
          });
        }
        return _currentResult19;
      }
      var _currentResult18 = uni ? uniRes : i1;
      if (typeof opts.cb === "function") {
        return opts.cb(clone__default['default'](input1orig), clone__default['default'](input2orig), _currentResult18, {
          path: infoObj.path,
          key: infoObj.key,
          type: infoObj.type
        });
      }
      return _currentResult18;
    }
    if (i2 != null && !isBool(i2)) {
      var _currentResult20 = uni ? uniRes : i2;
      if (typeof opts.cb === "function") {
        return opts.cb(clone__default['default'](input1orig), clone__default['default'](input2orig), _currentResult20, {
          path: infoObj.path,
          key: infoObj.key,
          type: infoObj.type
        });
      }
      return _currentResult20;
    }
    var _currentResult17 = uni ? uniRes : i1;
    if (typeof opts.cb === "function") {
      return opts.cb(clone__default['default'](input1orig), clone__default['default'](input2orig), _currentResult17, {
        path: infoObj.path,
        key: infoObj.key,
        type: infoObj.type
      });
    }
    return _currentResult17;
  } else if (isNum(i1)) {
    if (utilNonempty.nonEmpty(i2)) {
      var _currentResult22 = uni ? uniRes : i2;
      if (typeof opts.cb === "function") {
        return opts.cb(clone__default['default'](input1orig), clone__default['default'](input2orig), _currentResult22, {
          path: infoObj.path,
          key: infoObj.key,
          type: infoObj.type
        });
      }
      return _currentResult22;
    }
    var _currentResult21 = uni ? uniRes : i1;
    if (typeof opts.cb === "function") {
      return opts.cb(clone__default['default'](input1orig), clone__default['default'](input2orig), _currentResult21, {
        path: infoObj.path,
        key: infoObj.key,
        type: infoObj.type
      });
    }
    return _currentResult21;
  } else if (isBool(i1)) {
    if (isBool(i2)) {
      if (opts.mergeBoolsUsingOrNotAnd) {
        var _currentResult25 = uni ? uniRes : i1 || i2;
        if (typeof opts.cb === "function") {
          return opts.cb(clone__default['default'](input1orig), clone__default['default'](input2orig), _currentResult25, {
            path: infoObj.path,
            key: infoObj.key,
            type: infoObj.type
          });
        }
        return _currentResult25;
      }
      var _currentResult24 = uni ? uniRes : i1 && i2;
      if (typeof opts.cb === "function") {
        return opts.cb(clone__default['default'](input1orig), clone__default['default'](input2orig), _currentResult24, {
          path: infoObj.path,
          key: infoObj.key,
          type: infoObj.type
        });
      }
      return _currentResult24;
    }
    if (i2 != null) {
      var _currentResult26 = uni ? uniRes : i2;
      if (typeof opts.cb === "function") {
        return opts.cb(clone__default['default'](input1orig), clone__default['default'](input2orig), _currentResult26, {
          path: infoObj.path,
          key: infoObj.key,
          type: infoObj.type
        });
      }
      return _currentResult26;
    }
    var _currentResult23 = uni ? uniRes : i1;
    if (typeof opts.cb === "function") {
      return opts.cb(clone__default['default'](input1orig), clone__default['default'](input2orig), _currentResult23, {
        path: infoObj.path,
        key: infoObj.key,
        type: infoObj.type
      });
    }
    return _currentResult23;
  } else if (i1 === null) {
    if (i2 != null) {
      var _currentResult28 = uni ? uniRes : i2;
      if (typeof opts.cb === "function") {
        return opts.cb(clone__default['default'](input1orig), clone__default['default'](input2orig), _currentResult28, {
          path: infoObj.path,
          key: infoObj.key,
          type: infoObj.type
        });
      }
      return _currentResult28;
    }
    var _currentResult27 = uni ? uniRes : i1;
    if (typeof opts.cb === "function") {
      return opts.cb(clone__default['default'](input1orig), clone__default['default'](input2orig), _currentResult27, {
        path: infoObj.path,
        key: infoObj.key,
        type: infoObj.type
      });
    }
    return _currentResult27;
  } else {
    var _currentResult29 = uni ? uniRes : i2;
    if (typeof opts.cb === "function") {
      return opts.cb(clone__default['default'](input1orig), clone__default['default'](input2orig), _currentResult29, {
        path: infoObj.path,
        key: infoObj.key,
        type: infoObj.type
      });
    }
    return _currentResult29;
  }
  var currentResult = uni ? uniRes : i1;
  if (typeof opts.cb === "function") {
    return opts.cb(clone__default['default'](input1orig), clone__default['default'](input2orig), currentResult, {
      path: infoObj.path,
      key: infoObj.key,
      type: infoObj.type
    });
  }
  return currentResult;
}
function externalApi(input1orig, input2orig, originalOpts) {
  if (!arguments.length) {
    throw new TypeError("object-merge-advanced/mergeAdvanced(): [THROW_ID_01] Both inputs are missing");
  }
  return mergeAdvanced({
    key: null,
    path: "",
    type: [getType(input1orig), getType(input2orig)]
  }, input1orig, input2orig, originalOpts);
}

exports.defaults = defaults;
exports.mergeAdvanced = externalApi;
exports.version = version;
