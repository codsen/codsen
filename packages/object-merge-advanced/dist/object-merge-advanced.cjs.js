'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var includesAll = _interopDefault(require('array-includes-all'));
var typeDetect = _interopDefault(require('type-detect'));
var clone = _interopDefault(require('lodash.clonedeep'));
var includes = _interopDefault(require('array-includes-with-glob'));
var checkTypes = _interopDefault(require('check-types-mini'));
var lodashIncludes = _interopDefault(require('lodash.includes'));
var uniq = _interopDefault(require('lodash.uniq'));
var arrayiffyString = _interopDefault(require('arrayiffy-if-string'));
var nonEmpty = _interopDefault(require('util-nonempty'));

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

/* eslint max-len:0, no-prototype-builtins:0 */

// ===================================
// V A R S

// ===================================
// F U N C T I O N S

function isObj$1(something) {
  return typeDetect(something) === 'Object';
}
function isArr$1(something) {
  return Array.isArray(something);
}
function isStr(something) {
  return typeDetect(something) === 'string';
}
function isNum(something) {
  return typeDetect(something) === 'number';
}

function mergeAdvanced(input1orig, input2orig, originalOpts) {
  //
  // VARS AND PRECAUTIONS
  // ---------------------------------------------------------------------------

  if (arguments.length === 0) {
    throw new TypeError('object-merge-advanced/mergeAdvanced(): [THROW_ID_01] Both inputs are missing');
  }
  if (existy(originalOpts) && !isObj$1(originalOpts)) {
    throw new TypeError('object-merge-advanced/mergeAdvanced(): [THROW_ID_02] Options object, the third argument, must be a plain object');
  }
  var DEBUG = 1;

  // DEFAULTS
  // ---------------------------------------------------------------------------

  var defaults = {
    cb: null, // cb(input1, input2, result)
    mergeObjectsOnlyWhenKeysetMatches: true, // otherwise, concatenation will be preferred
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
  var opts = Object.assign(clone(defaults), originalOpts);
  opts.ignoreKeys = arrayiffyString(opts.ignoreKeys);
  opts.hardMergeKeys = arrayiffyString(opts.hardMergeKeys);

  checkTypes(opts, defaults, {
    msg: 'object-merge-advanced/mergeAdvanced(): [THROW_ID_06*]',
    schema: {
      cb: ['null', 'undefined', 'false', 'function']
    }
  });

  // hardMergeKeys: '*' <===> hardMergeEverything === true
  // also hardMergeKeys: ['whatnotKeyName', ... '*' ... ] - just one occurence is enough
  if (opts.hardMergeKeys.includes('*')) {
    opts.hardMergeEverything = true;
  }

  // ignoreKeys: '*' <===> ignoreEverything === true
  // also ignoreKeys: ['whatnotKeyName', ... '*' ... ] - just one occurence is enough
  if (opts.ignoreKeys.includes('*')) {
    opts.ignoreEverything = true;
  }

  // ACTION
  // ---------------------------------------------------------------------------

  // when null is used as explicit false, it overrides everything and anything:
  if (opts.useNullAsExplicitFalse && (input1orig === null || input2orig === null)) {
    if (DEBUG) {
      console.log('\x1B[' + 33 + 'm' + ('85 RET: ' + (opts.cb ? opts.cb(input1orig, input2orig, false) : false)) + '\x1B[' + 39 + 'm');
    }
    return opts.cb ? opts.cb(input1orig, input2orig, false) : false;
  }

  // clone the values to prevent accidental mutations, but only if it makes sense -
  // it applies to arrays and plain objects only (as far as we're concerned here)
  var i1 = isArr$1(input1orig) || isObj$1(input1orig) ? clone(input1orig) : input1orig;
  var i2 = isArr$1(input2orig) || isObj$1(input2orig) ? clone(input2orig) : input2orig;

  // // if the unidirectional merging is set, that's a quick ending because the values
  // // don't matter
  // if (opts.ignoreEverything) {
  //   return opts.cb ? opts.cb(i1, i2, i1) : i1
  // } else if (opts.hardMergeEverything) {
  //   return opts.cb ? opts.cb(i1, i2, i2) : i2
  // }
  var uniRes = void 0;
  if (opts.ignoreEverything) {
    uniRes = i1;
  } else if (opts.hardMergeEverything) {
    uniRes = i2;
  }

  // short name to mark unidirectional state
  var uni = opts.hardMergeEverything || opts.ignoreEverything;

  if (DEBUG) {
    console.log('\x1B[' + 32 + 'm' + '========================================================' + '\x1B[' + 39 + 'm');
  }
  if (DEBUG) {
    console.log('\x1B[' + 36 + 'm' + ('i1 = ' + JSON.stringify(i1, null, 0)) + '\x1B[' + 39 + 'm');
  }
  if (DEBUG) {
    console.log('\x1B[' + 36 + 'm' + ('i2 = ' + JSON.stringify(i2, null, 0)) + '\x1B[' + 39 + 'm');
  }
  if (DEBUG) {
    console.log('uniRes = ' + JSON.stringify(uniRes, null, 4));
  }
  if (DEBUG) {
    console.log('uni = ' + JSON.stringify(uni, null, 4));
  }

  // Now the complex part. By this point we know there's a value clash and we need
  // to judge case-by-case. Principle is to aim to retain as much data as possible
  // after merging.
  if (isArr$1(i1)) {
    // cases 1-20
    if (nonEmpty(i1)) {
      // cases 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
      if (isArr$1(i2) && nonEmpty(i2)) {
        // case 1
        // two array merge
        if (opts.mergeArraysContainingStringsToBeEmpty && (arrayContainsStr(i1) || arrayContainsStr(i2))) {
          var _currentResult = uni ? uniRes : [];
          if (DEBUG) {
            console.log('\x1B[' + 33 + 'm' + ('129 RET: ' + (opts.cb ? opts.cb(i1, i2, _currentResult) : _currentResult)) + '\x1B[' + 39 + 'm');
          }
          return opts.cb ? opts.cb(i1, i2, _currentResult) : _currentResult;
        }
        if (opts.hardArrayConcat) {
          var _currentResult2 = uni ? uniRes : i1.concat(i2);
          if (DEBUG) {
            console.log('\x1B[' + 33 + 'm' + ('134 RET: ' + (opts.cb ? opts.cb(i1, i2, _currentResult2) : _currentResult2)) + '\x1B[' + 39 + 'm');
          }
          return opts.cb ? opts.cb(i1, i2, _currentResult2) : _currentResult2;
        }
        var temp = [];
        for (var index = 0, len = Math.max(i1.length, i2.length); index < len; index++) {
          if (isObj$1(i1[index]) && isObj$1(i2[index]) && (opts.mergeObjectsOnlyWhenKeysetMatches && equalOrSubsetKeys(i1[index], i2[index]) || !opts.mergeObjectsOnlyWhenKeysetMatches)) {
            temp.push(mergeAdvanced(i1[index], i2[index], opts));
          } else if (opts.oneToManyArrayObjectMerge && (i1.length === 1 || i2.length === 1 // either of arrays has one elem.
          )) {
            temp.push(i1.length === 1 ? mergeAdvanced(i1[0], i2[index], opts) : mergeAdvanced(i1[index], i2[0], opts));
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
            if (index < i2.length && !lodashIncludes(i1, i2[index])) {
              temp.push(i2[index]);
            }
          }
        }
        // optionally dedupe:
        if (opts.dedupeStringsInArrayValues && temp.every(function (el) {
          return isStr(el);
        })) {
          temp = uniq(temp).sort();
        }
        i1 = clone(temp);
      } else {
        // cases 2, 3, 4, 5, 6, 7, 8, 9, 10
        var _currentResult3 = uni ? uniRes : i1;
        if (DEBUG) {
          console.log('\x1B[' + 33 + 'm' + ('183 RET: ' + (opts.cb ? opts.cb(i1, i2, _currentResult3) : _currentResult3)) + '\x1B[' + 39 + 'm');
        }
        return opts.cb ? opts.cb(i1, i2, _currentResult3) : _currentResult3;
      }
    } else {
      // cases 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
      if (nonEmpty(i2)) {
        // cases 11, 13, 15, 17
        var _currentResult5 = uni ? uniRes : i2;
        if (DEBUG) {
          console.log('\x1B[' + 33 + 'm' + ('191 RET: ' + (opts.cb ? opts.cb(i1, i2, _currentResult5) : _currentResult5)) + '\x1B[' + 39 + 'm');
        }
        return opts.cb ? opts.cb(i1, i2, _currentResult5) : _currentResult5;
      }
      // cases 12, 14, 16, 18, 19, 20
      var _currentResult4 = uni ? uniRes : i1;
      if (DEBUG) {
        console.log('\x1B[' + 33 + 'm' + ('196 RET: ' + (opts.cb ? opts.cb(i1, i2, _currentResult4) : _currentResult4)) + '\x1B[' + 39 + 'm');
      }
      return opts.cb ? opts.cb(i1, i2, _currentResult4) : _currentResult4;
    }
  } else if (isObj$1(i1)) {
    // cases 21-40
    if (nonEmpty(i1)) {
      // cases 21-30
      if (isArr$1(i2)) {
        // cases 21, 22
        if (nonEmpty(i2)) {
          // case 21
          var _currentResult7 = uni ? uniRes : i2;
          if (DEBUG) {
            console.log('\x1B[' + 33 + 'm' + ('208 RET: ' + (opts.cb ? opts.cb(i1, i2, _currentResult7) : _currentResult7)) + '\x1B[' + 39 + 'm');
          }
          return opts.cb ? opts.cb(i1, i2, _currentResult7) : _currentResult7;
        }
        // case 22
        var _currentResult6 = uni ? uniRes : i1;
        if (DEBUG) {
          console.log('\x1B[' + 33 + 'm' + ('213 RET: ' + (opts.cb ? opts.cb(i1, i2, _currentResult6) : _currentResult6)) + '\x1B[' + 39 + 'm');
        }
        return opts.cb ? opts.cb(i1, i2, _currentResult6) : _currentResult6;
      } else if (isObj$1(i2)) {
        // case 23
        // two object merge - we'll consider opts.ignoreEverything & opts.hardMergeEverything too.
        Object.keys(i2).forEach(function (key) {
          if (i1.hasOwnProperty(key)) {
            if (DEBUG) {
              console.log('219 working on i1 and i2 objects\' keys "' + key + '"');
            }
            // key clash
            if (includes(key, opts.ignoreKeys)) {
              // set the ignoreEverything for all deeper recursive traversals,
              // otherwise, it will get lost, yet, ignores apply to all children
              // console.log('1. - ignoreEverything')
              if (DEBUG) {
                console.log('1st Recursion @225, key=' + key);
              }
              i1[key] = mergeAdvanced(i1[key], i2[key], Object.assign({}, opts, { ignoreEverything: true }));
            } else if (includes(key, opts.hardMergeKeys)) {
              // set the hardMergeEverything for all deeper recursive traversals.
              // The user requested this key to be hard-merged, but in deeper branches
              // without this switch (opts.hardMergeEverything) we'd lose the visibility
              // of the name of the key; we can't "bubble up" to check all parents' key names,
              // are any of them positive for "hard merge"...
              // console.log('2. - hardMergeEverything')
              if (DEBUG) {
                console.log('2nd Recursion @234, key=' + key);
              }
              i1[key] = mergeAdvanced(i1[key], i2[key], Object.assign({}, opts, { hardMergeEverything: true }));
            } else if (includes(key, opts.hardArrayConcatKeys)) {
              // set the hardArrayConcat option to true for all deeper values.
              // It will force a concat of both values, as long as they are both arrays
              // No merge will happen.
              // console.log('3. - hardArrayConcat')
              if (DEBUG) {
                console.log('3rd Recursion @241, key=' + key);
              }
              i1[key] = mergeAdvanced(i1[key], i2[key], Object.assign({}, opts, { hardArrayConcat: true }));
            } else {
              // regular merge
              // console.log('4.')
              if (DEBUG) {
                console.log('246 4th Recursion');
              }
              if (DEBUG) {
                console.log('247 i1[' + key + '] = ' + JSON.stringify(i1[key], null, 4));
              }
              i1[key] = mergeAdvanced(i1[key], i2[key], opts);
              if (DEBUG) {
                console.log('249 AFTER RECURSION i1[' + key + '] = ' + JSON.stringify(i1[key], null, 4));
              }
            }
          } else {
            i1[key] = i2[key]; // key does not exist, so creates it
          }
        });
      } else {
        // cases 24, 25, 26, 27, 28, 29, 30
        var _currentResult8 = uni ? uniRes : i1;
        if (DEBUG) {
          console.log('\x1B[' + 33 + 'm' + ('252 RET: ' + (opts.cb ? opts.cb(i1, i2, _currentResult8) : _currentResult8)) + '\x1B[' + 39 + 'm');
        }
        return opts.cb ? opts.cb(i1, i2, _currentResult8) : _currentResult8;
      }
    } else {
      // i1 is empty obj
      // cases 31-40
      if (isArr$1(i2) || isObj$1(i2) || nonEmpty(i2)) {
        // cases 31, 32, 33, 34, 35, 37
        var _currentResult10 = uni ? uniRes : i2;
        if (DEBUG) {
          console.log('\x1B[' + 33 + 'm' + ('261 RET: ' + (opts.cb ? opts.cb(i1, i2, _currentResult10) : _currentResult10)) + '\x1B[' + 39 + 'm');
        }
        return opts.cb ? opts.cb(i1, i2, _currentResult10) : _currentResult10;
      }
      // 36, 38, 39, 40
      var _currentResult9 = uni ? uniRes : i1;
      if (DEBUG) {
        console.log('\x1B[' + 33 + 'm' + ('266 RET: ' + (opts.cb ? opts.cb(i1, i2, _currentResult9) : _currentResult9)) + '\x1B[' + 39 + 'm');
      }
      return opts.cb ? opts.cb(i1, i2, _currentResult9) : _currentResult9;
    }
  } else if (isStr(i1)) {
    if (nonEmpty(i1)) {
      // cases 41-50
      if ((isArr$1(i2) || isObj$1(i2) || isStr(i2)) && nonEmpty(i2)) {
        // cases 41, 43, 45
        // take care of hard merge setting cases, opts.hardMergeKeys
        var _currentResult13 = uni ? uniRes : i2;
        if (DEBUG) {
          console.log('\x1B[' + 33 + 'm' + ('276 RET: ' + (opts.cb ? opts.cb(i1, i2, _currentResult13) : _currentResult13)) + '\x1B[' + 39 + 'm');
        }
        return opts.cb ? opts.cb(i1, i2, _currentResult13) : _currentResult13;
      }
      // cases 42, 44, 46, 47, 48, 49, 50
      var _currentResult12 = uni ? uniRes : i1;
      if (DEBUG) {
        console.log('\x1B[' + 33 + 'm' + ('281 RET: ' + (opts.cb ? opts.cb(i1, i2, _currentResult12) : _currentResult12)) + '\x1B[' + 39 + 'm');
      }
      return opts.cb ? opts.cb(i1, i2, _currentResult12) : _currentResult12;
    }
    // i1 is empty string
    // cases 51-60
    if (i2 != null && !isBool(i2)) {
      // cases 51, 52, 53, 54, 55, 56, 57
      var _currentResult14 = uni ? uniRes : i2;
      if (DEBUG) {
        console.log('\x1B[' + 33 + 'm' + ('289 RET: ' + (opts.cb ? opts.cb(i1, i2, _currentResult14) : _currentResult14)) + '\x1B[' + 39 + 'm');
      }
      return opts.cb ? opts.cb(i1, i2, _currentResult14) : _currentResult14;
    }
    // 58, 59, 60
    var _currentResult11 = uni ? uniRes : i1;
    if (DEBUG) {
      console.log('\x1B[' + 33 + 'm' + ('294 RET: ' + (opts.cb ? opts.cb(i1, i2, _currentResult11) : _currentResult11)) + '\x1B[' + 39 + 'm');
    }
    return opts.cb ? opts.cb(i1, i2, _currentResult11) : _currentResult11;
  } else if (isNum(i1)) {
    // cases 61-70
    if (nonEmpty(i2)) {
      // cases 61, 63, 65, 67
      var _currentResult16 = uni ? uniRes : i2;
      if (DEBUG) {
        console.log('\x1B[' + 33 + 'm' + ('301 RET: ' + (opts.cb ? opts.cb(i1, i2, _currentResult16) : _currentResult16)) + '\x1B[' + 39 + 'm');
      }
      return opts.cb ? opts.cb(i1, i2, _currentResult16) : _currentResult16;
    }
    // cases 62, 64, 66, 68, 69, 70
    var _currentResult15 = uni ? uniRes : i1;
    if (DEBUG) {
      console.log('\x1B[' + 33 + 'm' + ('306 RET: ' + (opts.cb ? opts.cb(i1, i2, _currentResult15) : _currentResult15)) + '\x1B[' + 39 + 'm');
    }
    return opts.cb ? opts.cb(i1, i2, _currentResult15) : _currentResult15;
  } else if (isBool(i1)) {
    // cases 71-80
    if (isBool(i2)) {
      // case 78 - two Booleans
      if (opts.mergeBoolsUsingOrNotAnd) {
        var _currentResult19 = uni ? uniRes : i1 || i2; // default - OR
        if (DEBUG) {
          console.log('\x1B[' + 33 + 'm' + ('314 RET: ' + (opts.cb ? opts.cb(i1, i2, _currentResult19) : _currentResult19)) + '\x1B[' + 39 + 'm');
        }
        return opts.cb ? opts.cb(i1, i2, _currentResult19) : _currentResult19;
      }
      var _currentResult18 = uni ? uniRes : i1 && i2; // alternative merge using AND
      if (DEBUG) {
        console.log('\x1B[' + 33 + 'm' + ('318 RET: ' + (opts.cb ? opts.cb(i1, i2, _currentResult18) : _currentResult18)) + '\x1B[' + 39 + 'm');
      }
      return opts.cb ? opts.cb(i1, i2, _currentResult18) : _currentResult18;
    } else if (i2 != null) {
      // DELIBERATE LOOSE EQUAL - existy()
      // cases 71, 72, 73, 74, 75, 76, 77
      var _currentResult20 = uni ? uniRes : i2;
      if (DEBUG) {
        console.log('\x1B[' + 33 + 'm' + ('323 RET: ' + (opts.cb ? opts.cb(i1, i2, _currentResult20) : _currentResult20)) + '\x1B[' + 39 + 'm');
      }
      return opts.cb ? opts.cb(i1, i2, _currentResult20) : _currentResult20;
    }
    // i2 is null or undefined
    // cases 79*, 80
    var _currentResult17 = uni ? uniRes : i1;
    if (DEBUG) {
      console.log('\x1B[' + 33 + 'm' + ('329 RET: ' + (opts.cb ? opts.cb(i1, i2, _currentResult17) : _currentResult17)) + '\x1B[' + 39 + 'm');
    }
    return opts.cb ? opts.cb(i1, i2, _currentResult17) : _currentResult17;
  } else if (i1 === null) {
    // cases 81-90
    if (i2 != null) {
      // DELIBERATE LOOSE EQUAL - existy()
      // case 81, 82, 83, 84, 85, 86, 87, 88*
      var _currentResult22 = uni ? uniRes : i2;
      if (DEBUG) {
        console.log('\x1B[' + 33 + 'm' + ('336 RET: ' + (opts.cb ? opts.cb(i1, i2, _currentResult22) : _currentResult22)) + '\x1B[' + 39 + 'm');
      }
      return opts.cb ? opts.cb(i1, i2, _currentResult22) : _currentResult22;
    }
    // cases 89, 90
    var _currentResult21 = uni ? uniRes : i1;
    if (DEBUG) {
      console.log('\x1B[' + 33 + 'm' + ('341 RET: ' + (opts.cb ? opts.cb(i1, i2, _currentResult21) : _currentResult21)) + '\x1B[' + 39 + 'm');
    }
    return opts.cb ? opts.cb(i1, i2, _currentResult21) : _currentResult21;
  } else {
    // cases 91-100
    var _currentResult23 = uni ? uniRes : i2;
    if (DEBUG) {
      console.log('\x1B[' + 33 + 'm' + ('346 RET: ' + (opts.cb ? opts.cb(i1, i2, _currentResult23) : _currentResult23)) + '\x1B[' + 39 + 'm');
    }
    return opts.cb ? opts.cb(i1, i2, _currentResult23) : _currentResult23;
  }
  if (DEBUG) {
    console.log('\n\n\nFINAL ROW 356 - i1=' + JSON.stringify(i1, null, 4));
  }
  if (DEBUG) {
    console.log('FINAL ROW 357 - i2=' + JSON.stringify(i2, null, 4));
  }

  // return i1


  var currentResult = uni ? uniRes : i1;
  if (DEBUG) {
    console.log('FINAL ROW - currentResult = ' + JSON.stringify(currentResult, null, 4));
  }
  if (DEBUG) {
    console.log('FINAL ROW - uni = ' + JSON.stringify(uni, null, 4));
  }
  if (DEBUG) {
    console.log('FINAL ROW - uniRes = ' + JSON.stringify(uniRes, null, 4) + '\n\n\n');
  }

  if (DEBUG) {
    console.log('\x1B[' + 33 + 'm' + ('358 RET: ' + JSON.stringify(opts.cb ? opts.cb(i1, i2, currentResult) : currentResult, null, 4)) + '\x1B[' + 39 + 'm');
  }
  return opts.cb ? opts.cb(i1, i2, currentResult) : currentResult;
}

module.exports = mergeAdvanced;
