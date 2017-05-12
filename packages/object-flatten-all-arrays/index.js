'use strict'

var isObj = require('lodash.isplainobject')
var isArr = Array.isArray
var merge = require('lodash.merge')
var clone = require('lodash.clonedeep')
var objectAssign = require('object-assign')
var checkTypes = require('./util').checkTypes
var arrayContainsStr = require('./util').arrayContainsStr

function flattenAllArrays (originalIncommingObj, opts) {
  var defaults = {
    flattenArraysContainingStringsToBeEmpty: false
  }
  opts = objectAssign(clone(defaults), opts)
  checkTypes(opts, defaults, 'object-flatten-all-arrays/flattenAllArrays(): [THROW_ID_01] ', 'opts')

  var incommingObj = clone(originalIncommingObj)
  var isFirstObj, combinedObj, firstObjIndex
  // 1. check current
  if (isArr(incommingObj)) {
    if (opts.flattenArraysContainingStringsToBeEmpty && arrayContainsStr(incommingObj)) {
      return []
    } else {
      isFirstObj = null
      combinedObj = {}
      firstObjIndex = 0
      for (var i = 0, len = incommingObj.length; i < len; i++) {
        if (isObj(incommingObj[i])) {
          combinedObj = merge(combinedObj, incommingObj[i])
          if (isFirstObj === null) {
            isFirstObj = true
            firstObjIndex = i
          } else {
            incommingObj.splice(i, 1)
            i--
          }
        }
      }
      if (isFirstObj !== null) {
        incommingObj[firstObjIndex] = clone(combinedObj)
      }
    }
  }
  // 2. traverse deeper
  if (isObj(incommingObj)) {
    Object.keys(incommingObj).forEach(function (key) {
      if (isObj(incommingObj[key]) || isArr(incommingObj[key])) {
        incommingObj[key] = flattenAllArrays(incommingObj[key], opts)
      }
    })
  } else if (isArr(incommingObj)) {
    incommingObj.forEach(function (el, i) {
      if (isObj(incommingObj[i]) || isArr(incommingObj[i])) {
        incommingObj[i] = flattenAllArrays(incommingObj[i], opts)
      }
    })
  }
  return incommingObj
}

module.exports = flattenAllArrays
