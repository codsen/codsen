// ===================================
// V A R S

import includesAll from 'array-includes-all'
import typeDetect from 'type-detect'

// ===================================
// F U N C T I O N S

function existy(x) { return x != null }

function isObj(something) { return typeDetect(something) === 'Object' }
function isArr(something) { return Array.isArray(something) }
function isBool(bool) {
  return typeof bool === 'boolean'
}

function equalOrSubsetKeys(obj1, obj2) {
  if (!isObj(obj1)) {
    throw new TypeError(`object-merge-advanced/util.js/equalOrSubsetKeys(): [THROW_ID_03] First input is not an object, it's ${typeof obj1}`)
  }
  if (!isObj(obj2)) {
    throw new TypeError(`object-merge-advanced/util.js/equalOrSubsetKeys(): [THROW_ID_04] Second input is not an object, it's ${typeof obj2}`)
  }
  if ((Object.keys(obj1).length === 0) || (Object.keys(obj2).length === 0)) {
    return true
  }
  return includesAll(Object.keys(obj1), Object.keys(obj2)) ||
    includesAll(Object.keys(obj2), Object.keys(obj1))
}

function arrayContainsStr(arr) {
  if (arguments.length === 0) {
    return false
  }
  if (!isArr(arr)) {
    throw new TypeError('object-merge-advanced/util.js/arrayContainsStr(): [THROW_ID_05] input must be array')
  }
  return arr.some(val => typeof val === 'string')
}

export {
  existy,
  isBool,
  equalOrSubsetKeys,
  arrayContainsStr,
}
