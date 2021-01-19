/**
 * ast-deep-contains
 * Like t.same assert on array of objects, where element order doesn't matter.
 * Version: 2.0.1
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

var version = "2.0.1";

var version$1 = version;

function goUp(pathStr) {
  // console.log(`014 goUp(): INCOMING pathStr = "${pathStr}"`);
  if (pathStr.includes(".")) {
    for (var i = pathStr.length; i--;) {
      if (pathStr[i] === ".") {
        // console.log(`017 goUp(): RETURN "${pathStr.slice(0, i)}"`);
        return pathStr.slice(0, i);
      }
    }
  } // console.log(`021 RETURN pathStr = "${pathStr}"`);


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
    // release AST monkey to traverse tree2, check each node's presence in tree1
    astMonkeyTraverse.traverse(tree2, function (key, val, innerObj, stop) {
      var current = val !== undefined ? val : key;
      var path = innerObj.path; // retrieve the path of the current node from the monkey // console.log(
      //   `061 ${`\u001b[${33}m${`innerObj`}\u001b[${39}m`} = ${JSON.stringify(
      //     innerObj,
      //     null,
      //     4
      //   )}; typeof current = "${typeof current}"`
      // );

      if (objectPath__default['default'].has(tree1, path)) {

        if (!opts.arrayStrictComparison && is__default['default'].plainObject(current) && innerObj.parentType === "array" && innerObj.parent.length > 1) {
          (function () { // stop the monkey, we'll go further recursively

            stop.now = true;
            var arr1 = Array.from(innerObj.path.includes(".") ? objectPath__default['default'].get(tree1, goUp(path)) : tree1);

            if (arr1.length < innerObj.parent.length) {
              // source array from tree1 has less elements than array from tree2!
              // It will not be possible to match them all!
              errCb("the first array: " + JSON.stringify(arr1, null, 4) + "\nhas less objects than array we're matching against, " + JSON.stringify(innerObj.parent, null, 4));
            } else {
              (function () {
                var arr2 = innerObj.parent; // we extract just indexes:

                var tree1RefSource = arr1.map(function (_v, i) {
                  return i;
                });
                var tree2RefSource = arr2.map(function (_v, i) {
                  return i;
                }); // [0, 1, 2] for example.
                // We'll use them to calculate combinations, as in 1st object in tree2
                // array against 2nd object in tree1 array... // Challenge: Array of objects is compared to another array of objects.
                // Order is mixed, the intended object is actually slightly off,
                // it's wrong, test runners will flag it, but we still need to pinpoint which
                // object did user intend to match against.
                // Outcome: we can't use strict comparison or even assume that anything
                // will be matching. The real world bar is the following: we need to
                // calculate which object is the most resembling which.
                //
                //
                // Plan: let's generate the table combinations of each table vs. each
                // table. Think about 3 vs. 2 compares:
                // deepContains(
                //   [
                //       { key1: "a", key2: "b" },
                //       { key1: "k", key2: "l" }, <---- we'd ignore this
                //       { key1: "x", key2: "y" }
                //   ],
                //   [
                //       { key1: "x", key2: "y" }, <---- notice, the order
                //       { key1: "a", key2: "b" }  <---- is wrong
                //   ]
                //
                //  Once we have table of all combinations, we'll calculate the
                // likeness score of each combination, and whichever is the highest
                // we'll ping those objects to user-supplied (likely AVA's t.equal()) callback.
                //
                // We want to achieve something like this (using example above):
                // [[0, 0], [1, 1]]
                // [[0, 0], [1, 2]]
                //
                // [[0, 1], [1, 0]]
                // [[0, 1], [1, 2]]
                //
                // [[0, 2], [1, 0]]
                // [[0, 2], [1, 1]]
                // where [[0, 0], [1, 1]] means:
                // [
                //   [ index 0 from tree2, index 0 from tree1 ]
                //   [ index 1 from tree2, index 1 from tree1 ]
                // ]
                // We'll compose the combinations array from two parts:
                // The first digits are following "tree2RefSource", the tree2 indexes.
                // The second digits are from iterating tree1, picking one and
                // iterating what's left for the second variation.
                // TODO:

                var secondDigits = []; // const secondDigits = [];

                var _loop = function _loop(i, len) {
                  var currArr = [];
                  var pickedVal = tree1RefSource[i];
                  var disposableArr1 = dropIth(tree1RefSource, i);
                  currArr.push(pickedVal); // iterate what's left

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
                }); // now, use the "finalCombined" as a guidance which objects to match against which, and array-push the comparison score as third element into each. Whichever comparison gathers highest score, gets pinged to the callback.
                var maxScore = 0;

                for (var _i = 0, _len = finalCombined.length; _i < _len; _i++) {
                  var score = 0; // finalCombined[i] === something like [[0,0],[1,1]]
                  // tree1 array: arr1
                  // tree2 array: arr2

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

                  finalCombined[_i].push(score); // finally, push the score as 3rd arg. into mapping array

                  if (score > maxScore) {
                    maxScore = score;
                  }
                } // FINALLY, ping callbacks with the max score objects

                var _loop2 = function _loop2(_i2, _len2) {
                  if (finalCombined[_i2][2] === maxScore) {

                    finalCombined[_i2].forEach(function (matchPairObj, y) {
                      // beware score is the last element.
                      if (y < finalCombined[_i2].length - 1) {
                        // console.log(
                        //   `${`\u001b[${33}m${`matchPairObj`}\u001b[${39}m`} = ${JSON.stringify(
                        //     matchPairObj,
                        //     null,
                        //     4
                        //   )}`
                        // ); // ping object pairs recursively:

                        deepContains(arr1[matchPairObj[1]], arr2[matchPairObj[0]], cb, errCb, opts);
                      }
                    });

                    return "break";
                  }
                };

                for (var _i2 = 0, _len2 = finalCombined.length; _i2 < _len2; _i2++) {
                  var _ret = _loop2(_i2);

                  if (_ret === "break") break;
                } //

              })();
            }
          })();
        } else { // if tree1 has that path on tree2, call the callback

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
} // -----------------------------------------------------------------------------

exports.deepContains = deepContains;
exports.defaults = defaults;
exports.version = version$1;
