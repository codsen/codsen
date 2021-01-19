/**
 * object-merge-advanced
 * Recursive, deep merge of anything (objects, arrays, strings or nested thereof), which weighs contents by type hierarchy to ensure the maximum content is retained
 * Version: 10.12.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/object-merge-advanced/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var clone = require('lodash.clonedeep');
var lodashIncludes = require('lodash.includes');
var uniq = require('lodash.uniq');
var isObj = require('lodash.isplainobject');
var arrayIncludesWithGlob = require('array-includes-with-glob');
var utilNonempty = require('util-nonempty');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _objectSpread__default = /*#__PURE__*/_interopDefaultLegacy(_objectSpread);
var clone__default = /*#__PURE__*/_interopDefaultLegacy(clone);
var lodashIncludes__default = /*#__PURE__*/_interopDefaultLegacy(lodashIncludes);
var uniq__default = /*#__PURE__*/_interopDefaultLegacy(uniq);
var isObj__default = /*#__PURE__*/_interopDefaultLegacy(isObj);

var version = "10.12.1";

var version$1 = version;
// F U N C T I O N S

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
  if (isObj__default['default'](something)) {
    return "object";
  }

  if (isArr(something)) {
    return "array";
  }

  return typeof something;
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
  // DEFAULTS
  // ---------------------------------------------------------------------------
  var opts = _objectSpread__default['default'](_objectSpread__default['default']({}, defaults), originalOpts);

  if (typeof opts.ignoreKeys === "string") {
    opts.ignoreKeys = [opts.ignoreKeys];
  }

  if (typeof opts.hardMergeKeys === "string") {
    opts.hardMergeKeys = [opts.hardMergeKeys];
  } // hardMergeKeys: '*' <===> hardMergeEverything === true
  // also hardMergeKeys: ['whatnotKeyName', ... '*' ... ] - just one occurence is enough


  if (opts.hardMergeKeys.includes("*")) {
    opts.hardMergeEverything = true;
  } // ignoreKeys: '*' <===> ignoreEverything === true
  // also ignoreKeys: ['whatnotKeyName', ... '*' ... ] - just one occurence is enough


  if (opts.ignoreKeys.includes("*")) {
    opts.ignoreEverything = true;
  } // this variable takes "path" coming from input and appends the key
  // name following object-path notation.
  // https://github.com/mariocasciaro/object-path
  // Basically, arrays are marked with dot, same like object keys, only the
  // key is the index number of the element.
  //
  // For example: key1.key2.0.key3.
  // That zero means first element of the array. It also means that key "key1"
  // had value of a plain object-type, which had a key "key2" which value was
  // an array. That's array's first element (at zero'th index) was a plain object.
  // That object had key "key3", which we reference here by "key1.key2.0.key3".


  var currPath; // ACTION
  // ---------------------------------------------------------------------------
  // when null is used as explicit false, it overrides everything and anything:

  if (opts.useNullAsExplicitFalse && (input1orig === null || input2orig === null)) {
    if (typeof opts.cb === "function") {
      return opts.cb(input1orig, input2orig, null, {
        path: infoObj.path,
        key: infoObj.key,
        type: infoObj.type
      });
    }

    return null;
  } // clone the values to prevent accidental mutations, but only if it makes sense -
  // it applies to arrays and plain objects only (as far as we're concerned here)


  var i1 = isArr(input1orig) || isObj__default['default'](input1orig) ? clone__default['default'](input1orig) : input1orig;
  var i2 = isArr(input2orig) || isObj__default['default'](input2orig) ? clone__default['default'](input2orig) : input2orig;
  var uniRes;

  if (opts.ignoreEverything) {
    uniRes = i1;
  } else if (opts.hardMergeEverything) {
    uniRes = i2;
  } // short name to mark unidirectional state


  var uni = opts.hardMergeEverything || opts.ignoreEverything; // console.log(`168 uniRes = ${JSON.stringify(uniRes, null, 4)}`);
  // console.log(`169 uni = ${JSON.stringify(uni, null, 4)}`); // Now the complex part. By this point we know there's a value clash and we need
  // to judge case-by-case. Principle is to aim to retain as much data as possible
  // after merging.

  if (isArr(i1)) {
    // cases 1-20
    if (utilNonempty.nonEmpty(i1)) {
      // cases 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
      if (isArr(i2) && utilNonempty.nonEmpty(i2)) {
        // case 1
        // two array merge
        if (opts.mergeArraysContainingStringsToBeEmpty && (arrayContainsStr(i1) || arrayContainsStr(i2))) {
          var _currentResult = uni ? uniRes : [];

          if (typeof opts.cb === "function") {
            return opts.cb(i1, i2, _currentResult, {
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
            return opts.cb(i1, i2, _currentResult2, {
              path: currPath,
              key: infoObj.key,
              type: infoObj.type
            });
          }

          return _currentResult2;
        }

        var temp = [];

        for (var index = 0, len = Math.max(i1.length, i2.length); index < len; index++) {
          // calculate current path
          currPath = infoObj.path && infoObj.path.length ? infoObj.path + "." + index : "" + index; // calculate the merge outcome:

          if (isObj__default['default'](i1[index]) && isObj__default['default'](i2[index]) && (opts.mergeObjectsOnlyWhenKeysetMatches && equalOrSubsetKeys(i1[index], i2[index]) || !opts.mergeObjectsOnlyWhenKeysetMatches)) {
            temp.push(mergeAdvanced({
              path: currPath,
              key: infoObj.key,
              type: [getType(i1), getType(i2)]
            }, i1[index], i2[index], opts));
          } else if (opts.oneToManyArrayObjectMerge && (i1.length === 1 || i2.length === 1) // either of arrays has one elem.
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
            // case1 - concatenation no matter what contents
            if (index < i1.length) {
              temp.push(i1[index]);
            }

            if (index < i2.length) {
              temp.push(i2[index]);
            }
          } else {
            // case2 - merging, evaluating contents
            // push each element of i1 into temp
            if (index < i1.length) {
              temp.push(i1[index]);
            }

            if (index < i2.length && !lodashIncludes__default['default'](i1, i2[index])) {
              temp.push(i2[index]);
            }
          }
        } // optionally dedupe:


        if (opts.dedupeStringsInArrayValues && temp.every(function (el) {
          return isStr(el);
        })) {
          temp = uniq__default['default'](temp).sort();
        }

        i1 = clone__default['default'](temp);
      } else {
        // cases 2, 3, 4, 5, 6, 7, 8, 9, 10
        var _currentResult3 = uni ? uniRes : i1;

        if (typeof opts.cb === "function") {
          return opts.cb(i1, i2, _currentResult3, {
            path: currPath,
            key: infoObj.key,
            type: infoObj.type
          });
        }

        return _currentResult3;
      }
    } else {
      // cases 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
      if (utilNonempty.nonEmpty(i2)) {
        // cases 11, 13, 15, 17
        var _currentResult5 = uni ? uniRes : i2;

        if (typeof opts.cb === "function") {
          return opts.cb(i1, i2, _currentResult5, {
            path: currPath,
            key: infoObj.key,
            type: infoObj.type
          });
        }

        return _currentResult5;
      } // cases 12, 14, 16, 18, 19, 20


      var _currentResult4 = uni ? uniRes : i1;

      if (typeof opts.cb === "function") {
        return opts.cb(i1, i2, _currentResult4, {
          path: currPath,
          key: infoObj.key,
          type: infoObj.type
        });
      }

      return _currentResult4;
    }
  } else if (isObj__default['default'](i1)) {
    // cases 21-40
    if (utilNonempty.nonEmpty(i1)) {
      // cases 21-30
      if (isArr(i2)) {
        // cases 21, 22
        if (utilNonempty.nonEmpty(i2)) {
          // case 21
          var _currentResult9 = uni ? uniRes : i2;

          if (typeof opts.cb === "function") {
            return opts.cb(i1, i2, _currentResult9, {
              path: currPath,
              key: infoObj.key,
              type: infoObj.type
            });
          }

          return _currentResult9;
        } // case 22


        var _currentResult8 = uni ? uniRes : i1;

        if (typeof opts.cb === "function") {
          return opts.cb(i1, i2, _currentResult8, {
            path: currPath,
            key: infoObj.key,
            type: infoObj.type
          });
        }

        return _currentResult8;
      }

      if (isObj__default['default'](i2)) {
        // case 23
        // two object merge - we'll consider opts.ignoreEverything & opts.hardMergeEverything too.
        Object.keys(i2).forEach(function (key) {
          // calculate current path:
          currPath = infoObj.path && infoObj.path.length ? infoObj.path + "." + key : "" + key; // calculate the merge outcome:

          if (i1.hasOwnProperty(key)) { // key clash

            if (arrayIncludesWithGlob.includesWithGlob(key, opts.ignoreKeys)) {
              // set the ignoreEverything for all deeper recursive traversals,
              // otherwise, it will get lost, yet, ignores apply to all children
              // console.log('455. - ignoreEverything')
              i1[key] = mergeAdvanced({
                path: currPath,
                key: key,
                type: [getType(i1), getType(i2)]
              }, i1[key], i2[key], _objectSpread__default['default'](_objectSpread__default['default']({}, opts), {}, {
                ignoreEverything: true
              }));
            } else if (arrayIncludesWithGlob.includesWithGlob(key, opts.hardMergeKeys)) {
              // set the hardMergeEverything for all deeper recursive traversals.
              // The user requested this key to be hard-merged, but in deeper branches
              // without this switch (opts.hardMergeEverything) we'd lose the visibility
              // of the name of the key; we can't "bubble up" to check all parents' key names,
              // are any of them positive for "hard merge"...
              // console.log('473. - hardMergeEverything')
              i1[key] = mergeAdvanced({
                path: currPath,
                key: key,
                type: [getType(i1), getType(i2)]
              }, i1[key], i2[key], _objectSpread__default['default'](_objectSpread__default['default']({}, opts), {}, {
                hardMergeEverything: true
              }));
            } else if (arrayIncludesWithGlob.includesWithGlob(key, opts.hardArrayConcatKeys)) {
              // set the hardArrayConcat option to true for all deeper values.
              // It will force a concat of both values, as long as they are both arrays
              // No merge will happen.
              // console.log('489. - hardArrayConcat')
              i1[key] = mergeAdvanced({
                path: currPath,
                key: key,
                type: [getType(i1), getType(i2)]
              }, i1[key], i2[key], _objectSpread__default['default'](_objectSpread__default['default']({}, opts), {}, {
                hardArrayConcat: true
              }));
            } else {
              // regular merge
              // console.log('503.')
              i1[key] = mergeAdvanced({
                path: currPath,
                key: key,
                type: [getType(i1), getType(i2)]
              }, i1[key], i2[key], opts);
            }
          } else {
            i1[key] = i2[key]; // key does not exist, so creates it
          }
        });
        return i1;
      } // cases 24, 25, 26, 27, 28, 29, 30


      var _currentResult7 = uni ? uniRes : i1;

      if (typeof opts.cb === "function") {
        return opts.cb(i1, i2, _currentResult7, {
          path: infoObj.path,
          key: infoObj.key,
          type: infoObj.type
        });
      }

      return _currentResult7;
    } // i1 is empty obj
    // cases 31-40


    if (isArr(i2) || isObj__default['default'](i2) || utilNonempty.nonEmpty(i2)) {
      // cases 31, 32, 33, 34, 35, 37
      var _currentResult10 = uni ? uniRes : i2;

      if (typeof opts.cb === "function") {
        return opts.cb(i1, i2, _currentResult10, {
          path: infoObj.path,
          key: infoObj.key,
          type: infoObj.type
        });
      }

      return _currentResult10;
    } // 36, 38, 39, 40


    var _currentResult6 = uni ? uniRes : i1;

    if (typeof opts.cb === "function") {
      return opts.cb(i1, i2, _currentResult6, {
        path: infoObj.path,
        key: infoObj.key,
        type: infoObj.type
      });
    }

    return _currentResult6;
  } else if (isStr(i1)) {
    if (utilNonempty.nonEmpty(i1)) {
      // cases 41-50
      if ((isArr(i2) || isObj__default['default'](i2) || isStr(i2)) && utilNonempty.nonEmpty(i2)) {
        // cases 41, 43, 45
        // take care of hard merge setting cases, opts.hardMergeKeys
        var _currentResult13 = uni ? uniRes : i2;

        if (typeof opts.cb === "function") {
          return opts.cb(i1, i2, _currentResult13, {
            path: infoObj.path,
            key: infoObj.key,
            type: infoObj.type
          });
        }

        return _currentResult13;
      } // cases 42, 44, 46, 47, 48, 49, 50


      var _currentResult12 = uni ? uniRes : i1;

      if (typeof opts.cb === "function") {
        return opts.cb(i1, i2, _currentResult12, {
          path: infoObj.path,
          key: infoObj.key,
          type: infoObj.type
        });
      }

      return _currentResult12;
    } // i1 is empty string
    // cases 51-60


    if (i2 != null && !isBool(i2)) {
      // cases 51, 52, 53, 54, 55, 56, 57
      var _currentResult14 = uni ? uniRes : i2;

      if (typeof opts.cb === "function") {
        return opts.cb(i1, i2, _currentResult14, {
          path: infoObj.path,
          key: infoObj.key,
          type: infoObj.type
        });
      }

      return _currentResult14;
    } // 58, 59, 60


    var _currentResult11 = uni ? uniRes : i1;

    if (typeof opts.cb === "function") {
      return opts.cb(i1, i2, _currentResult11, {
        path: infoObj.path,
        key: infoObj.key,
        type: infoObj.type
      });
    }

    return _currentResult11;
  } else if (isNum(i1)) {
    // cases 61-70
    if (utilNonempty.nonEmpty(i2)) {
      // cases 61, 63, 65, 67
      var _currentResult16 = uni ? uniRes : i2;

      if (typeof opts.cb === "function") {
        return opts.cb(i1, i2, _currentResult16, {
          path: infoObj.path,
          key: infoObj.key,
          type: infoObj.type
        });
      }

      return _currentResult16;
    } // cases 62, 64, 66, 68, 69, 70


    var _currentResult15 = uni ? uniRes : i1;

    if (typeof opts.cb === "function") {
      return opts.cb(i1, i2, _currentResult15, {
        path: infoObj.path,
        key: infoObj.key,
        type: infoObj.type
      });
    }

    return _currentResult15;
  } else if (isBool(i1)) {
    // cases 71-80
    if (isBool(i2)) {
      // case 78 - two Booleans
      if (opts.mergeBoolsUsingOrNotAnd) {
        var _currentResult19 = uni ? uniRes : i1 || i2; // default - OR


        if (typeof opts.cb === "function") {
          return opts.cb(i1, i2, _currentResult19, {
            path: infoObj.path,
            key: infoObj.key,
            type: infoObj.type
          });
        }

        return _currentResult19;
      }

      var _currentResult18 = uni ? uniRes : i1 && i2; // alternative merge using AND


      if (typeof opts.cb === "function") {
        return opts.cb(i1, i2, _currentResult18, {
          path: infoObj.path,
          key: infoObj.key,
          type: infoObj.type
        });
      }

      return _currentResult18;
    }

    if (i2 != null) {
      // DELIBERATE LOOSE EQUAL - existy()
      // cases 71, 72, 73, 74, 75, 76, 77
      var _currentResult20 = uni ? uniRes : i2;

      if (typeof opts.cb === "function") {
        return opts.cb(i1, i2, _currentResult20, {
          path: infoObj.path,
          key: infoObj.key,
          type: infoObj.type
        });
      }

      return _currentResult20;
    } // i2 is null or undefined
    // cases 79*, 80


    var _currentResult17 = uni ? uniRes : i1;

    if (typeof opts.cb === "function") {
      return opts.cb(i1, i2, _currentResult17, {
        path: infoObj.path,
        key: infoObj.key,
        type: infoObj.type
      });
    }

    return _currentResult17;
  } else if (i1 === null) {
    // cases 81-90
    if (i2 != null) {
      // DELIBERATE LOOSE EQUAL - existy()
      // case 81, 82, 83, 84, 85, 86, 87, 88*
      var _currentResult22 = uni ? uniRes : i2;

      if (typeof opts.cb === "function") {
        return opts.cb(i1, i2, _currentResult22, {
          path: infoObj.path,
          key: infoObj.key,
          type: infoObj.type
        });
      }

      return _currentResult22;
    } // cases 89, 90


    var _currentResult21 = uni ? uniRes : i1;

    if (typeof opts.cb === "function") {
      return opts.cb(i1, i2, _currentResult21, {
        path: infoObj.path,
        key: infoObj.key,
        type: infoObj.type
      });
    }

    return _currentResult21;
  } else {
    // cases 91-100
    var _currentResult23 = uni ? uniRes : i2;

    if (typeof opts.cb === "function") {
      return opts.cb(i1, i2, _currentResult23, {
        path: infoObj.path,
        key: infoObj.key,
        type: infoObj.type
      });
    }

    return _currentResult23;
  } // return i1

  var currentResult = uni ? uniRes : i1;

  if (typeof opts.cb === "function") {
    return opts.cb(i1, i2, currentResult, {
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
  } // notice we have first argument tracking the current path, which is not
  // exposed to the external API.


  return mergeAdvanced({
    key: null,
    path: "",
    type: [getType(input1orig), getType(input2orig)]
  }, input1orig, input2orig, originalOpts);
}

exports.defaults = defaults;
exports.mergeAdvanced = externalApi;
exports.version = version$1;
