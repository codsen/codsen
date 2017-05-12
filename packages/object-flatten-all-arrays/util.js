'use strict'

// ===================================
// V A R S

const type = require('type-detect')
const isArr = Array.isArray

// ===================================
// F U N C T I O N S

function existy (x) { return x != null }

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
  checkTypes: checkTypes,
  arrayContainsStr: arrayContainsStr
}
