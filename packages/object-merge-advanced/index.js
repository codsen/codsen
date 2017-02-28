'use strict'

// ===================================
// V A R S

var isArr = Array.isArray
var isObj = require('lodash.isplainobject')
var isStr = require('lodash.isstring')
var clone = require('lodash.clonedeep')

// ===================================
// F U N C T I O N S

function mergeAdvanced (obj1orig, obj2orig) {
// FUNCTIONS
// -----------------------------------------------------------------------------
  function existy (x) { return x != null }

  function isBool (bool) {
    return typeof bool === 'boolean'
  }

  /**
   * sortObject - sorts object's keys
   *
   * @param  {Object} obj input object
   * @return {Object}     sorted object
   */
  function sortObject (obj) {
    return Object.keys(obj).sort().reduce(function (result, key) {
      result[key] = obj[key]
      return result
    }, {})
  }

  function nonEmpty (something) {
    if (Array.isArray(something) || (typeof something === 'string')) {
      return something.length > 0
    } else if (isObj(something)) {
      return Object.keys(something).length > 0
    }
  }

// VARS AND PRECAUTIONS
// -----------------------------------------------------------------------------

  if (!isObj(obj1orig) || !isObj(obj2orig)) {
    return
  }
  var o1 = clone(obj1orig)
  var o2 = clone(obj2orig)

// ACTION
// -----------------------------------------------------------------------------

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
            // concat two non-empty arrays
            o1[key] = o1[key].concat(o2[key])
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
