'use strict'

const toArr = require('lodash.toarray')
const isInt = require('is-natural-number')
const isNumStr = require('is-natural-number-string')

function existy (x) { return x != null }
function isStr (something) { return typeof something === 'string' }

function indexes (str, searchValue, fromIndex) {
  if (arguments.length === 0) {
    throw new Error('str-indexes-of-plus/indexes(): inputs missing!')
  }
  if (!isStr(str)) {
    throw new TypeError('str-indexes-of-plus/indexes(): first input argument must be a string! Currently it\'s: ' + typeof str)
  }
  if (!isStr(searchValue)) {
    throw new TypeError('str-indexes-of-plus/indexes(): second input argument must be a string! Currently it\'s: ' + typeof searchValue)
  }
  if ((arguments.length >= 3) && (
    !isInt(fromIndex, {includeZero: true}) && (!isNumStr(fromIndex, {includeZero: true}))
  )) {
    throw new TypeError('str-indexes-of-plus/indexes(): third input argument must be a natural number! Currently it\'s: ' + fromIndex)
  }
  if (isNumStr(fromIndex, {includeZero: true})) {
    fromIndex = Number(fromIndex)
  }
  var strArr = toArr(str)
  var searchValueArr = toArr(searchValue)
  if (strArr.length === 0 ||
    searchValueArr.length === 0 ||
    (existy(fromIndex) && fromIndex >= strArr.length)
  ) {
    return []
  }
  if (!existy(fromIndex)) {
    fromIndex = 0
  }

  var res = []
  var matchMode = false
  var potentialFinding

  for (var i = fromIndex, len = strArr.length; i < len; i++) {
    if (matchMode) {
      if (strArr[i] === searchValueArr[i - potentialFinding]) {
        if ((i - potentialFinding + 1) === searchValueArr.length) {
          res.push(potentialFinding)
        }
      } else {
        potentialFinding = null
        matchMode = false
      }
    }

    if (!matchMode) {
      if (strArr[i] === searchValueArr[0]) {
        if (searchValueArr.length === 1) {
          res.push(i)
        } else {
          matchMode = true
          potentialFinding = i
        }
      }
    }
  }

  return res
}

module.exports = indexes
