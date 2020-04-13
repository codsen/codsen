/**
 * ast-deep-contains
 * an alternative assertion for Ava's t.deepEqual and Tap's t.same
 * Version: 1.1.9
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ast-deep-contains
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var objectPath = _interopDefault(require('object-path'));
var traverse = _interopDefault(require('ast-monkey-traverse'));

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

var isArr = Array.isArray;
function typeDetect(something) {
  if (something === null) {
    return "null";
  }
  return _typeof(something);
}
function isObj(something) {
  return typeDetect(something) === "object";
}
function goUp(pathStr) {
  for (var i = pathStr.length; i--;) {
    if (pathStr[i] === ".") {
      return pathStr.slice(0, i);
    }
  }
  return pathStr;
}
function dropIth(arr, badIdx) {
  return Array.from(arr).filter(function (el, i) {
    return i !== badIdx;
  });
}
function deepContains(tree1, tree2, cb, errCb, originalOpts) {
  var defaults = {
    skipContainers: true,
    arrayStrictComparison: false
  };
  var opts = Object.assign({}, defaults, originalOpts);
  if (typeDetect(tree1) !== typeDetect(tree2)) {
    errCb("the first input arg is of a type ".concat(typeDetect(tree1).toLowerCase(), " but the second is ").concat(typeDetect(tree2).toLowerCase(), ". Values are - 1st:\n").concat(JSON.stringify(tree1, null, 4), "\n2nd:\n").concat(JSON.stringify(tree2, null, 4)));
  } else {
    traverse(tree2, function (key, val, innerObj, stop) {
      var current = val !== undefined ? val : key;
      var path = innerObj.path;
      if (objectPath.has(tree1, path)) {
        if (!opts.arrayStrictComparison && isObj(current) && innerObj.parentType === "array" && innerObj.parent.length > 1) {
          (function () {
            stop.now = true;
            var arr1 = Array.from(innerObj.path.includes(".") ? objectPath.get(tree1, goUp(path)) : tree1);
            if (arr1.length < innerObj.parent.length) {
              errCb("the first array: ".concat(JSON.stringify(arr1, null, 4), "\nhas less objects than array we're matching against, ").concat(JSON.stringify(innerObj.parent, null, 4)));
            } else {
              (function () {
                var arr2 = innerObj.parent;
                var tree1RefSource = arr1.map(function (v, i) {
                  return i;
                });
                var tree2RefSource = arr2.map(function (v, i) {
                  return i;
                });
                var secondDigits = [];
                var _loop = function _loop(i, len) {
                  var currArr = [];
                  var pickedVal = tree1RefSource[i];
                  var disposableArr1 = dropIth(tree1RefSource, i);
                  currArr.push(pickedVal);
                  disposableArr1.forEach(function (key) {
                    secondDigits.push(Array.from(currArr).concat(key));
                  });
                };
                for (var i = 0, len = tree1RefSource.length; i < len; i++) {
                  _loop(i);
                }
                var finalCombined = secondDigits.map(function (arr) {
                  return arr.map(function (val, i) {
                    return [i, val];
                  });
                });
                var maxScore = 0;
                for (var _i = 0, _len = finalCombined.length; _i < _len; _i++) {
                  var score = 0;
                  finalCombined[_i].forEach(function (mapping) {
                    if (isObj(arr2[mapping[0]]) && isObj(arr1[mapping[1]])) {
                      Object.keys(arr2[mapping[0]]).forEach(function (key) {
                        if (Object.keys(arr1[mapping[1]]).includes(key)) {
                          score += 1;
                          if (arr1[mapping[1]][key] === arr2[mapping[0]][key]) {
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
          var retrieved = objectPath.get(tree1, path);
          if (!opts.skipContainers || !isObj(retrieved) && !isArr(retrieved)) {
            cb(retrieved, current, path);
          }
        }
      } else {
        errCb("the first input: ".concat(JSON.stringify(tree1, null, 4), "\ndoes not have the path \"").concat(path, "\", we were looking, would it contain a value ").concat(JSON.stringify(current, null, 0), "."));
      }
      return current;
    });
  }
}

module.exports = deepContains;
