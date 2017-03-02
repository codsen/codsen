'use strict'

// ===================================
// R E Q U I R E' S

var isPlainObject = require('lodash.isplainobject')
var merge = require('lodash.merge')
var clone = require('lodash.clonedeep')

// ===================================
// F U N C T I O N S

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
 * flattenAllArrays - merges and flattens arrays within object key values
 *
 * @param  {Object} originalIncommingObj  input object
 * @return {Object}                       flattened-array object
 */
function flattenAllArrays (originalIncommingObj) {
  var tempObj
  var incommingObj = clone(originalIncommingObj)
  if (isPlainObject(incommingObj)) {
    Object.keys(incommingObj).forEach(function (key) {
      if (Array.isArray(incommingObj[key])) {
        //
        tempObj = {}
        // rest[] - array of items which are not plain objects thus can't be merged, so
        // need to be put back into the generated array
        var rest = []
        incommingObj[key].forEach(function (el) {
          if (isPlainObject(el)) {
            tempObj = merge(tempObj, el)
          } else {
            rest.push(el)
          }
        })
        incommingObj[key] = []
        incommingObj[key][0] = sortObject(tempObj)
        //
        incommingObj[key].forEach(function (key) {
          flattenAllArrays(key)
        })
        rest.forEach(function (val) {
          incommingObj[key].push(val)
        })
      }
    })
  } else if (Array.isArray(incommingObj)) {
    incommingObj.forEach(function (el, i) {
      if (isPlainObject(incommingObj[i]) || Array.isArray(incommingObj[i])) {
        incommingObj[i] = flattenAllArrays(incommingObj[i])
      }
    })
  }
  return incommingObj
}

module.exports = flattenAllArrays
