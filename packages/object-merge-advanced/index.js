'use strict'

// ===================================
// V A R S

var isArr = Array.isArray
var objectAssign = require('object-assign')
var isObj = require('lodash.isplainobject')
var isStr = require('lodash.isstring')
var clone = require('lodash.clonedeep')
// var pullAllWith = require('lodash.pullallwith')
// var compare = require('posthtml-ast-compare')

var existy = require('./util').existy
var isBool = require('./util').isBool
var sortObject = require('./util').sortObject
var nonEmpty = require('./util').nonEmpty
var equalOrSubsetKeys = require('./util').equalOrSubsetKeys

var temp

// ===================================
// F U N C T I O N S

function mergeAdvanced (obj1orig, obj2orig, opts) {
  //
  // VARS AND PRECAUTIONS
  // ---------------------------------------------------------------------------

  if (!existy(obj1orig) && existy(obj2orig)) {
    return obj2orig
  }
  if (existy(obj1orig) && !existy(obj2orig)) {
    return obj1orig
  }
  if (!isObj(obj1orig) || !isObj(obj2orig)) {
    return
  }
  if (existy(opts) && !isObj(opts)) {
    throw new TypeError('object-merge-advanced/mergeAdvanced(): Options object, third argument must be a plain object')
  }
  var o1 = clone(obj1orig)
  var o2 = clone(obj2orig)

  // DEFAULTS
  // ---------------------------------------------------------------------------

  opts = objectAssign({
    mergeObjectsOnlyWhenKeysetMatches: true // otherwise, concatenation will be preferred
  }, opts)

  // ACTION
  // ---------------------------------------------------------------------------

  Object.keys(o2).forEach(function (key) {
    if (existy(o1[key])) {
      // value clash

      // action
      if (isObj(o1[key]) && isObj(o2[key])) {
        // case 01
        o1[key] = mergeAdvanced(o1[key], o2[key])
      } else if (isObj(o1[key])) {
        // cases 01-18
        if (nonEmpty(o1[key])) {
          // cases 01-09
          if (isArr(o2[key]) && nonEmpty(o2[key])) {
            // case 03
            o1[key] = o2[key]
          } else {
            // cases 01,02,04-09
            // nothing, o1[key] stays
          }
        } else {
          // cases 10-18
          // o1[key] is empty object
          if (isArr(o2[key]) || isObj(o2[key]) || (isStr(o2[key]) && nonEmpty(o2[key]))) {
            // cases 10-14
            o1[key] = o2[key]
          } else {
            // cases 15-18
            // nothing, o1[key] stays
          }
        }
      } else if (isArr(o1[key])) {
        // cases 19-36
        if (nonEmpty(o1[key])) {
          // cases 19-27
          if (isArr(o2[key]) && nonEmpty(o2[key])) {
            // case 21
            // two objects within an array.
            // interesting case.
            // two outcomes:
            // 1. key sets are same or one has key set which is a subset of another object's key set.
            // 2. two objects with key sets which are not equal or subset (both contains unique keys, for example)
            //
            // decision: case #1 — recursion with intent to merge keys
            //           case #2 — array concat, putting second argument's stuff at the end of a resulting "mergeable".

            temp = []
            for (var i = 0, len = Math.max(o1[key].length, o2[key].length); i < len; i++) {
//
              if (existy(o1[key][i]) && existy(o2[key][i])) {
                // console.log('o1[key][i] = ' + JSON.stringify(o1[key][i], null, 4))
                // console.log('o2[key][i] = ' + JSON.stringify(o2[key][i], null, 4))
                // console.log('1. temp = ' + JSON.stringify(temp, null, 4))

                if (opts.mergeObjectsOnlyWhenKeysetMatches) {
                  // custom merge of the objects.
                  // if both are at the same position and their key sets are equal or subset of one/another,
                  // then merge them.
                  // if both have unique keys, don't merge, concat both into resulting array as separate array elements.
                  // this is when different objects meaning separte different things are being merged.
                  if (isObj(o1[key][i]) && isObj(o2[key][i]) && equalOrSubsetKeys(o1[key][i], o2[key][i])) {
                    temp.push(mergeAdvanced(o1[key][i], o2[key][i]))
                  } else {
                    temp.push(o1[key][i])
                    temp.push(o2[key][i])
                  }
                } else {
                  temp.push(mergeAdvanced(o1[key][i], o2[key][i]))
                }

                // console.log('2. temp = ' + JSON.stringify(temp, null, 4))
              } else {
                // console.log('3. temp = ' + JSON.stringify(temp, null, 4))
                temp.push(existy(o1[key][i]) ? o1[key][i] : o2[key][i])
                // console.log('4. temp = ' + JSON.stringify(temp, null, 4))
              }
//
            }
            o1[key] = clone(temp)
          } else {
            // cases 19,20,22-27
            // nothing, o1[key] stays
          }
        } else {
          // cases 28-36
          if ((isObj(o2[key]) && nonEmpty(o2[key])) || isArr(o2[key]) || (isStr(o2[key]) && nonEmpty(o2[key]))) {
            // cases 28,30,31,32
            o1[key] = o2[key]
          } else {
            // cases 29,33-36
            // nothing, o1[key] stays
          }
        }
      } else if (isStr(o1[key])) {
        // cases 37-54
        if (nonEmpty(o1[key])) {
          // cases 37-45
          if ((isObj(o2[key]) && nonEmpty(o2[key])) || ((isArr(o2[key])) && (nonEmpty(o2[key]))) || ((isStr(o2[key])) && (nonEmpty(o2[key])))) {
            // cases 37,39,41
            o1[key] = o2[key]
          } else {
            // cases 38,40,42-45
            // nothing, o1[key] stays
          }
        } else {
          // cases 46-54
          if (isArr(o2[key]) || isObj(o2[key]) || isStr(o2[key])) {
            // cases 46-51
            o1[key] = o2[key]
          } else {
            // cases 52-54
            // nothing, o1[key] stays
          }
        }
      } else if (isBool(o1[key])) {
        // cases 55-63
        if (isArr(o2[key]) || isObj(o2[key]) || isStr(o2[key])) {
          // cases 55-60
          o1[key] = o2[key]
        } else if (isBool(o2[key])) {
          // cases 61
          if (o2[key]) {
            o1[key] = o2[key]
          }
        } else {
          // cases 62-63
        }
      }
    } else if (o1[key] === undefined) {
      // cases 64-72
      o1[key] = o2[key]
    } else if (o1[key] === null) {
      // cases 73-81
      if (o2[key] !== undefined) {
        // if not, case 80
        o1[key] = o2[key]
      }
    }
  })
  return sortObject(o1)
}

module.exports = mergeAdvanced
