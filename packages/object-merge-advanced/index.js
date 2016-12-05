'use strict'

// ===================================
// V A R S

var isArr = Array.isArray
var isObj = require('lodash.isplainobject')
var isStr = require('lodash.isstring')

// ===================================
// F U N C T I O N S

function existy (x) { return x != null }

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

/**
 * mergeAdvanced - Like "_.merge" except it treats different-type values correctly.
 * its aim is to retain as much data after merge and work with AST's from parsed JSON
 *
 * @param  {object} o2 input object
 * @param  {object} o1 input object
 * @return {object}    merged object
 */
function mergeAdvanced (o1, o2) {
  if (!isObj(o1) || !isObj(o2)) {
    return
  }
  Object.keys(o2).forEach(function (key) {
    if (existy(o1[key])) {
      // value clash
      if (isArr(o1[key]) && isArr(o2[key])) {
        o1[key] = o1[key].concat(o2[key])
      } else if (isObj(o1[key]) && isArr(o2[key])) {
        if ((o2[key].length > 0) || (Object.keys(o1[key]).length === 0)) {
          o1[key] = o2[key]
        } else {
        }
      } else if (isArr(o1[key]) && isObj(o2[key])) {
        if ((o1[key].length === 0) && (Object.keys(o2[key]).length > 0)) {
          o1[key] = o2[key]
        } else {
        }
      } else if (isObj(o2[key]) && isObj(o1[key])) {
        o1[key] = mergeAdvanced(o2[key], o1[key])
      } else if (isStr(o1[key]) && isArr(o2[key]) && (o2[key].length > 0)) {
        o1[key] = o2[key]
      } else if (isStr(o1[key]) && isObj(o2[key]) && (Object.keys(o2[key]).length > 0)) {
        o1[key] = o2[key]
      } else if (isObj(o1[key]) && isStr(o2[key]) && (Object.keys(o1[key]).length > 0)) {
      } else if (isStr(o2[key]) && isArr(o1[key]) && (o1[key].length > 0)) {
      } else if (isArr(o2[key]) && o2[key].length === 0) {
      } else {
        o1[key] = o2[key]
      }
    } else {
      // no value clash. easy.
      o1[key] = o2[key]
    }
  })
  return sortObject(o1)
}

module.exports = mergeAdvanced
