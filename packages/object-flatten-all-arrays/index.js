'use strict'

var isObj = require('lodash.isplainobject')
var isArr = Array.isArray
var merge = require('lodash.merge')
var clone = require('lodash.clonedeep')

function flattenAllArrays (originalIncommingObj) {
  var incommingObj = clone(originalIncommingObj)
  var isFirstObj, combinedObj, firstObjIndex
  // 1. check current
  if (isArr(incommingObj)) {
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
  // 2. traverse deeper
  if (isObj(incommingObj)) {
    Object.keys(incommingObj).forEach(function (key) {
      if (isObj(incommingObj[key]) || isArr(incommingObj[key])) {
        incommingObj[key] = flattenAllArrays(incommingObj[key])
      }
    })
  } else if (isArr(incommingObj)) {
    incommingObj.forEach(function (el, i) {
      if (isObj(incommingObj[i]) || isArr(incommingObj[i])) {
        incommingObj[i] = flattenAllArrays(incommingObj[i])
      }
    })
  }
  return incommingObj
}

module.exports = flattenAllArrays
