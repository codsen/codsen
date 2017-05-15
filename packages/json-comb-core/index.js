'use strict'

const setAllValuesTo = require('object-set-all-values-to')
const flattenAllArrays = require('object-flatten-all-arrays')
const mergeAdvanced = require('object-merge-advanced')
const fillMissingKeys = require('object-fill-missing-keys')
const nnk = require('object-no-new-keys')
const objectAssign = require('object-assign')
const clone = require('lodash.clonedeep')
const type = require('type-detect')
const checkTypes = require('check-types-mini')

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
    throw new Error('json-comb-core/getKeyset(): [THROW_ID_11] Inputs missing!')
  }
  if (!isArr(arrOriginal)) {
    throw new Error('json-comb-core/getKeyset(): [THROW_ID_12] Input must be array! Currently it\'s ' + typeof arrOriginal)
  }
  if (arrOriginal.length === 0) {
    throw new Error('json-comb-core/getKeyset(): [THROW_ID_13] Input array is empty!')
  }
  if (existy(opts) && !isObj(opts)) {
    throw new TypeError('json-comb-core/getKeyset(): [THROW_ID_14] Options object must be a plain object!')
  }

  var schemaObj = {}
  var arr = clone(arrOriginal)
  var defaults = {
    placeholder: false
  }
  opts = objectAssign(clone(defaults), opts)
  checkTypes(opts, defaults, 'json-variables/jsonVariables():', 'opts', {ignoreKeys: 'placeholder'})

  var fOpts = {
    flattenArraysContainingStringsToBeEmpty: true
  }

  arr.forEach(function (obj) {
    if (!isObj(obj)) {
      throw new TypeError('json-comb-core/getKeyset(): [THROW_ID_15] Non-object detected within an array!')
    }
    schemaObj = mergeAdvanced(flattenAllArrays(schemaObj, fOpts), flattenAllArrays(obj, fOpts), { mergeArraysContainingStringsToBeEmpty: true })
  })
  schemaObj = sortObject(setAllValuesTo(schemaObj, opts.placeholder))
  return schemaObj
}

// -----------------------------------------------------------------------------

function enforceKeyset (obj, schemaKeyset) {
  if (arguments.length === 0) {
    throw new Error('json-comb-core/enforceKeyset(): [THROW_ID_21] Inputs missing!')
  }
  if (arguments.length === 1) {
    throw new Error('json-comb-core/enforceKeyset(): [THROW_ID_22] Second arg missing!')
  }
  if (!isObj(obj)) {
    throw new Error('json-comb-core/enforceKeyset(): [THROW_ID_23] Input must be a plain object! Currently it\'s ' + typeof obj)
  }
  if (!isObj(schemaKeyset)) {
    throw new Error('json-comb-core/enforceKeyset(): [THROW_ID_24] Schema object must be a plain object! Currently it\'s ' + typeof schemaKeyset)
  }
  return sortObject(fillMissingKeys(obj, schemaKeyset))
}

// -----------------------------------------------------------------------------

// no news is good news - when keyset is ok, empty array is returned
// when there are rogue keys, array of paths is returned
function noNewKeys (obj, schemaKeyset) {
  if (arguments.length === 0) {
    throw new Error('json-comb-core/noNewKeys(): [THROW_ID_31] All inputs missing!')
  }
  if (arguments.length === 1) {
    throw new Error('json-comb-core/noNewKeys(): [THROW_ID_32] Schema object is missing!')
  }
  if (!isObj(obj)) {
    throw new Error('json-comb-core/noNewKeys(): [THROW_ID_33] Main input (1st arg.) must be a plain object! Currently it\'s ' + type(obj))
  }
  if (!isObj(schemaKeyset)) {
    throw new Error('json-comb-core/noNewKeys(): [THROW_ID_34] Schema input (2nd arg.) must be a plain object! Currently it\'s ' + type(schemaKeyset))
  }
  return nnk(obj, schemaKeyset)
}

// -----------------------------------------------------------------------------

// function findUnused (arrOriginal, opts) {
//   var defaults = {
//     placeholder: false
//   }
//   opts = objectAssign(clone(defaults), opts)
//   checkTypes(opts, defaults, 'json-variables/jsonVariables():', 'opts')
// }

// -----------------------------------------------------------------------------

module.exports = {
  getKeyset: getKeyset,
  enforceKeyset: enforceKeyset,
  sortObject: sortObject,
  noNewKeys: noNewKeys
}
