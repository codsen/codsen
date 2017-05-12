'use strict'

// ===================================
// V A R S

const includesAll = require('array-includes-all')
const type = require('type-detect')

// ===================================
// F U N C T I O N S

function existy (x) { return x != null }

function isObj (something) { return type(something) === 'Object' }
function isArr (something) { return Array.isArray(something) }
function isStr (something) { return type(something) === 'string' }
function isNum (something) { return type(something) === 'number' }
function isBool (bool) {
  return typeof bool === 'boolean'
}

function nonEmpty (something) {
  if (isArr(something) || isStr(something)) {
    return something.length > 0
  } else if (isObj(something)) {
    return Object.keys(something).length > 0
  } else if (isNum(something)) {
    return true
  }
}

function equalOrSubsetKeys (obj1, obj2) {
  if (!isObj(obj1)) {
    throw new TypeError('object-merge-advanced/util.js/equalOrSubsetKeys(): [THROW_ID_03] First input is not an object, it\'s ' + typeof obj1)
  }
  if (!isObj(obj2)) {
    throw new TypeError('object-merge-advanced/util.js/equalOrSubsetKeys(): [THROW_ID_04] Second input is not an object, it\'s ' + typeof obj2)
  }
  if ((Object.keys(obj1).length === 0) || (Object.keys(obj2).length === 0)) {
    return true
  }
  return includesAll(Object.keys(obj1), Object.keys(obj2)) || includesAll(Object.keys(obj2), Object.keys(obj1))
}

function checkTypes (obj, ref, msg, variable) {
  if (arguments.length === 0) {
    throw new Error('object-merge-advanced/util.js/checkTypes(): [THROW_ID_05] missing inputs!')
  }
  Object.keys(obj).forEach(function (key) {
    if (existy(ref[key]) && (type(obj[key]) !== type(ref[key]))) {
      throw new TypeError(msg + ' ' + variable + '.' + key + ' was customised to ' + JSON.stringify(obj[key], null, 4) + ' which is not ' + type(ref[key]) + ' but ' + type(obj[key]))
    }
  })
}

function arrayiffyString (something) {
  if (type(something) === 'string') {
    if (something.length > 0) {
      return [something]
    } else {
      return []
    }
  }
  return something
}

function arrayContainsStr (arr) {
  if (arguments.length === 0) {
    return false
  }
  if (!isArr(arr)) {
    throw new TypeError('object-merge-advanced/util.js/arrayContainsStr(): [THROW_ID_07] input must be array')
  }
  return arr.some(function (val) {
    return typeof val === 'string'
  })
}

module.exports = {
  existy: existy,
  isBool: isBool,
  nonEmpty: nonEmpty,
  equalOrSubsetKeys: equalOrSubsetKeys,
  checkTypes: checkTypes,
  arrayiffyString: arrayiffyString,
  arrayContainsStr: arrayContainsStr
}
