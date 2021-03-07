/**
 * ast-deep-contains
 * Like t.same assert on array of objects, where element order doesn't matter.
 * Version: 3.0.7
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ast-deep-contains/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var objectPath = require('object-path');
var astMonkeyTraverse = require('ast-monkey-traverse');
var is = require('@sindresorhus/is');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _objectSpread__default = /*#__PURE__*/_interopDefaultLegacy(_objectSpread);
var objectPath__default = /*#__PURE__*/_interopDefaultLegacy(objectPath);
var is__default = /*#__PURE__*/_interopDefaultLegacy(is);

var version$1 = "3.0.7";

var version = version$1;
function goUp(pathStr) {
  if (pathStr.includes(".")) {
    for (var i = pathStr.length; i--;) {
      if (pathStr[i] === ".") {
        return pathStr.slice(0, i);
      }
    }
  }
  return pathStr;
}
function dropIth(arr, badIdx) {
  return Array.from(arr).filter(function (_el, i) {
    return i !== badIdx;
  });
}
var defaults = {
  skipContainers: true,
  arrayStrictComparison: false
};
function deepContains(tree1, tree2, cb, errCb, originalOpts) {
  var opts = _objectSpread__default['default'](_objectSpread__default['default']({}, defaults), originalOpts);
  if (is__default['default'](tree1) !== is__default['default'](tree2)) {
    errCb("the first input arg is of a type " + is__default['default'](tree1).toLowerCase() + " but the second is " + is__default['default'](tree2).toLowerCase() + ". Values are - 1st:\n" + JSON.stringify(tree1, null, 4) + "\n2nd:\n" + JSON.stringify(tree2, null, 4));
  } else {
    astMonkeyTraverse.traverse(tree2, function (key, val, innerObj, stop) {
      var current = val !== undefined ? val : key;
      var path = innerObj.path;
      if (objectPath__default['default'].has(tree1, path)) {
        if (!opts.arrayStrictComparison && is__default['default'].plainObject(current) && innerObj.parentType === "array" && innerObj.parent.length > 1) {
          (function () {
            stop.now = true;
            var arr1 = Array.from(innerObj.path.includes(".") ? objectPath__default['default'].get(tree1, goUp(path)) : tree1);
            if (arr1.length < innerObj.parent.length) {
              errCb("the first array: " + JSON.stringify(arr1, null, 4) + "\nhas less objects than array we're matching against, " + JSON.stringify(innerObj.parent, null, 4));
            } else {
              (function () {
                var arr2 = innerObj.parent;
                var tree1RefSource = arr1.map(function (_v, i) {
                  return i;
                });
                arr2.map(function (_v, i) {
                  return i;
                });
                var secondDigits = [];
                var _loop = function _loop(i, len) {
                  var currArr = [];
                  var pickedVal = tree1RefSource[i];
                  var disposableArr1 = dropIth(tree1RefSource, i);
                  currArr.push(pickedVal);
                  disposableArr1.forEach(function (key1) {
                    secondDigits.push(Array.from(currArr).concat(key1));
                  });
                };
                for (var i = 0, len = tree1RefSource.length; i < len; i++) {
                  _loop(i);
                }
                var finalCombined = secondDigits.map(function (arr) {
                  return arr.map(function (val2, i) {
                    return [i, val2];
                  });
                });
                var maxScore = 0;
                for (var _i = 0, _len = finalCombined.length; _i < _len; _i++) {
                  var score = 0;
                  finalCombined[_i].forEach(function (mapping) {
                    if (is__default['default'].plainObject(arr2[mapping[0]]) && is__default['default'].plainObject(arr1[mapping[1]])) {
                      Object.keys(arr2[mapping[0]]).forEach(function (key2) {
                        if (Object.keys(arr1[mapping[1]]).includes(key2)) {
                          score += 1;
                          if (arr1[mapping[1]][key2] === arr2[mapping[0]][key2]) {
                            score += 5;
                          }
                        }
                      });
                    }
                  });
                  finalCombined[_i].push(score);
                  if (score > maxScore) {
                    maxScore = score;
                  }
                }
                var _loop2 = function _loop2(_i2, _len2) {
                  if (finalCombined[_i2][2] === maxScore) {
                    finalCombined[_i2].forEach(function (matchPairObj, y) {
                      if (y < finalCombined[_i2].length - 1) {
                        deepContains(arr1[matchPairObj[1]], arr2[matchPairObj[0]], cb, errCb, opts);
                      }
                    });
                    return "break";
                  }
                };
                for (var _i2 = 0, _len2 = finalCombined.length; _i2 < _len2; _i2++) {
                  var _ret = _loop2(_i2);
                  if (_ret === "break") break;
                }
              })();
            }
          })();
        } else {
          var retrieved = objectPath__default['default'].get(tree1, path);
          if (!opts.skipContainers || !is__default['default'].plainObject(retrieved) && !Array.isArray(retrieved)) {
            cb(retrieved, current, path);
          }
        }
      } else {
        errCb("the first input: " + JSON.stringify(tree1, null, 4) + "\ndoes not have the path \"" + path + "\", we were looking, would it contain a value " + JSON.stringify(current, null, 0) + ".");
      }
      return current;
    });
  }
}

exports.deepContains = deepContains;
exports.defaults = defaults;
exports.version = version;
