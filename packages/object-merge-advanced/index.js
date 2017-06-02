'use strict'

// ===================================
// V A R S

var objectAssign = require('object-assign')
var type = require('type-detect')
var clone = require('lodash.clonedeep')
var includes = require('array-includes-with-glob')
var checkTypes = require('check-types-mini')

var existy = require('./util').existy
var isBool = require('./util').isBool
var nonEmpty = require('./util').nonEmpty
var equalOrSubsetKeys = require('./util').equalOrSubsetKeys
var arrayiffyString = require('./util').arrayiffyString
var arrayContainsStr = require('./util').arrayContainsStr

// ===================================
// F U N C T I O N S

function isObj (something) { return type(something) === 'Object' }
function isArr (something) { return Array.isArray(something) }
function isStr (something) { return type(something) === 'string' }
function isNum (something) { return type(something) === 'number' }

function mergeAdvanced (input1orig, input2orig, opts) {
  //
  // VARS AND PRECAUTIONS
  // ---------------------------------------------------------------------------

  if (arguments.length === 0) {
    throw new TypeError('object-merge-advanced/mergeAdvanced(): [THROW_ID_01] Both inputs are missing')
  }
  if (existy(opts) && !isObj(opts)) {
    throw new TypeError('object-merge-advanced/mergeAdvanced(): [THROW_ID_02] Options object, the third argument, must be a plain object')
  }
  var i1 = (isArr(input1orig) || isObj(input1orig)) ? clone(input1orig) : input1orig
  var i2 = (isArr(input2orig) || isObj(input2orig)) ? clone(input2orig) : input2orig

  // DEFAULTS
  // ---------------------------------------------------------------------------

  var defaults = {
    mergeObjectsOnlyWhenKeysetMatches: true, // otherwise, concatenation will be preferred
    ignoreKeys: [],
    hardMergeKeys: [],
    mergeArraysContainingStringsToBeEmpty: false
  }
  opts = objectAssign(clone(defaults), opts)
  opts.ignoreKeys = arrayiffyString(opts.ignoreKeys)
  opts.hardMergeKeys = arrayiffyString(opts.hardMergeKeys)

  checkTypes(opts, defaults, 'object-merge-advanced/mergeAdvanced(): [THROW_ID_06x] ')

  // ACTION
  // ---------------------------------------------------------------------------

  if (isArr(i1)) {
    // cases 1-20
    if (nonEmpty(i1)) {
      // cases 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
      if (isArr(i2) && nonEmpty(i2)) {
        // case 1
        // two array merge
        if (opts.mergeArraysContainingStringsToBeEmpty && (arrayContainsStr(i1) || arrayContainsStr(i2))) {
          return []
        } else {
          var temp = []
          for (var index = 0, len = Math.max(i1.length, i2.length); index < len; index++) {
            if (
              isObj(i1[index]) &&
              isObj(i2[index]) &&
              ((opts.mergeObjectsOnlyWhenKeysetMatches &&
                equalOrSubsetKeys(i1[index], i2[index])) || !opts.mergeObjectsOnlyWhenKeysetMatches)
            ) {
              temp.push(mergeAdvanced(i1[index], i2[index], opts))
            } else {
              if (index < i1.length) {
                temp.push(i1[index])
              }
              if (index < i2.length) {
                temp.push(i2[index])
              }
            }
          }
          i1 = clone(temp)
        }
      } else {
        // cases 2, 3, 4, 5, 6, 7, 8, 9, 10
        return i1
      }
    } else {
      // cases 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
      if (nonEmpty(i2)) {
        // cases 11, 13, 15, 17
        return i2
      } else {
        // cases 12, 14, 16, 18, 19, 20
        return i1
      }
    }
  } else if (isObj(i1)) {
    // cases 21-40
    if (nonEmpty(i1)) {
      // cases 21-30
      if (isArr(i2)) {
        // cases 21, 22
        if (nonEmpty(i2)) {
          // case 21
          return i2
        } else {
          // case 22
          return i1
        }
      } else if (isObj(i2)) {
        // case 23
        // two object merge

        Object.keys(i2).forEach(function (key) {
          if (i1.hasOwnProperty(key)) {
            // value clash
            if ((opts.hardMergeKeys.length > 0) && includes(key, opts.hardMergeKeys)) {
              i1[key] = i2[key] // hard overwrite
            } else if (!((opts.ignoreKeys.length > 0) && includes(key, opts.ignoreKeys))) {
              i1[key] = mergeAdvanced(i1[key], i2[key], opts) // if not being ignored
            } // else case is omitted as nothing happens there, i1[key] stays as it is
          } else {
            i1[key] = i2[key] // key does not exist, so creates it
          }
        })
      } else {
        // cases 24, 25, 26, 27, 28, 29, 30
        return i1
      }
    } else {
      // i1 is empty obj
      // cases 31-40
      if (isArr(i2) || isObj(i2) || nonEmpty(i2)) {
        // cases 31, 32, 33, 34, 35, 37
        return i2
      } else {
        // 36, 38, 39, 40
        return i1
      }
    }
  } else if (isStr(i1)) {
    if (nonEmpty(i1)) {
      // cases 41-50
      if ((isArr(i2) || isObj(i2) || isStr(i2)) && nonEmpty(i2)) {
        // cases 41, 43
        return i2
      } else {
        // cases 42, 44, 45, 46, 47, 48, 49, 50
        return i1
      }
    } else {
      // i1 is empty string
      // cases 51-60
      if ((i2 != null) && !isBool(i2)) {
        // cases 51, 52, 53, 54, 55, 56, 57
        return i2
      } else {
        // 58, 59, 60
        return i1
      }
    }
  } else if (isNum(i1)) {
    // cases 61-70
    if (nonEmpty(i2)) {
      // cases 61, 63, 65, 67
      return i2
    } else {
      // cases 62, 64, 66, 68, 69, 70
      return i1
    }
  } else if (isBool(i1)) {
    // cases 71-80
    if (isBool(i2)) {
      // case 78
      return i1 || i2
    } else if (i2 != null) { // DELIBERATE LOOSE EQUAL - existy()
      // cases 71, 72, 73, 74, 75, 76, 77
      return i2
    } else {
      // i2 is null or undefined
      // cases 79, 80
      return i1
    }
  } else if (i1 === null) {
    // cases 81-90
    if (i2 != null) { // DELIBERATE LOOSE EQUAL - existy()
      // case 81, 82, 83, 84, 85, 86, 87, 88
      return i2
    } else {
      // cases 89, 90
      return i1
    }
  } else {
    // cases 91-100
    return i2
  }
  return i1
}

module.exports = mergeAdvanced
