'use strict'

var setAllValuesTo = require('object-set-all-values-to')
var flattenAllArrays = require('object-flatten-all-arrays')
var mergeAdvanced = require('object-merge-advanced')
var fillMissingKeys = require('object-fill-missing-keys')
var objectAssign = require('object-assign')
var clone = require('lodash.clonedeep')
var type = require('type-detect')

// -----------------------------------------------------------------------------

function existy (x) { return x != null }
function isObj (something) { return type(something) === 'Object' }
function isArr (something) { return Array.isArray(something) }

function sortObject (obj) {
  return Object.keys(obj).sort().reduce(function (result, key) {
    result[key] = obj[key]
    return result
  }, {})
}

// -----------------------------------------------------------------------------

function getKeyset (arrOriginal, opts) {
  if (arguments.length === 0) {
    throw new Error('json-comb-core/getKeyset(): Inputs missing!')
  }
  if (!isArr(arrOriginal)) {
    throw new Error('json-comb-core/getKeyset(): Input must be array! Currently it\'s ' + typeof arrOriginal)
  }
  if (arrOriginal.length === 0) {
    throw new Error('json-comb-core/getKeyset(): Input array is empty!')
  }
  if (existy(opts) && !isObj(opts)) {
    throw new TypeError('json-comb-core/getKeyset(): Options object must be a plain object!')
  }

  var schemaObj = {}
  var arr = clone(arrOriginal)
  opts = objectAssign({ placeholder: false }, opts)

  arr.forEach(function (obj) {
    if (!isObj(obj)) {
      throw new TypeError('json-comb-core/getKeyset(): Non-object detected within an array!')
    }
    schemaObj = mergeAdvanced(flattenAllArrays(schemaObj), flattenAllArrays(obj))
  })
  schemaObj = sortObject(setAllValuesTo(schemaObj, opts.placeholder))
  return schemaObj
}

// -----------------------------------------------------------------------------

function enforceKeyset (obj, schemaKeyset) {
  if (arguments.length === 0) {
    throw new Error('json-comb-core/enforceKeyset(): Inputs missing!')
  }
  if (arguments.length === 1) {
    throw new Error('json-comb-core/enforceKeyset(): Second arg missing!')
  }
  if (!isObj(obj)) {
    throw new Error('json-comb-core/enforceKeyset(): Input must be a plain object! Currently it\'s ' + typeof obj)
  }
  if (!isObj(schemaKeyset)) {
    throw new Error('json-comb-core/enforceKeyset(): Schema object must be a plain object! Currently it\'s ' + typeof schemaKeyset)
  }
  return fillMissingKeys(obj, schemaKeyset)
}

// -----------------------------------------------------------------------------

module.exports = {
  getKeyset: getKeyset,
  enforceKeyset: enforceKeyset
}
