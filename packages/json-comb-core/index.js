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

function sortIfObject (obj) {
  if (isObj(obj)) {
    return Object.keys(obj).sort().reduce(function (result, key) {
      result[key] = obj[key]
      return result
    }, {})
  } else {
    return obj
  }
}

// -----------------------------------------------------------------------------

function getKeyset (arrOriginal, opts) {
  if (arguments.length === 0) {
    throw new Error('json-comb-core/getKeyset(): [THROW_ID_11] Inputs missing!')
  }
  if (!isArr(arrOriginal)) {
    throw new Error(`json-comb-core/getKeyset(): [THROW_ID_12] Input must be array! Currently it's: ${type(arrOriginal)}`)
  }
  if (arrOriginal.length === 0) {
    throw new Error('json-comb-core/getKeyset(): [THROW_ID_13] Input array is empty!')
  }
  if (existy(opts) && !isObj(opts)) {
    throw new TypeError(`json-comb-core/getKeyset(): [THROW_ID_14] Options object must be a plain object! Currently it's: ${type(opts)}, equal to: ${JSON.stringify(opts, null, 4)}`)
  }

  var schemaObj = {}
  var arr = clone(arrOriginal)
  var defaults = {
    placeholder: false
  }
  opts = objectAssign(clone(defaults), opts)
  checkTypes(opts, defaults, 'json-comb-core/getKeyset(): [THROW_ID_10]', 'opts', {ignoreKeys: 'placeholder'})

  var fOpts = {
    flattenArraysContainingStringsToBeEmpty: true
  }

  arr.forEach(function (obj, i) {
    if (!isObj(obj)) {
      throw new TypeError(`json-comb-core/getKeyset(): [THROW_ID_15] Non-object (${type(obj)}) detected within an array! It's the ${i}th element: ${JSON.stringify(obj, null, 4)}`)
    }
    schemaObj = mergeAdvanced(flattenAllArrays(schemaObj, fOpts), flattenAllArrays(obj, fOpts), { mergeArraysContainingStringsToBeEmpty: true })
  })
  schemaObj = sortIfObject(setAllValuesTo(schemaObj, opts.placeholder))
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
    throw new Error(`json-comb-core/enforceKeyset(): [THROW_ID_23] Input must be a plain object! Currently it's: ${type(obj)}, equal to: ${JSON.stringify(obj, null, 4)}`)
  }
  if (!isObj(schemaKeyset)) {
    throw new Error(`json-comb-core/enforceKeyset(): [THROW_ID_24] Schema object must be a plain object! Currently it's: ${type(schemaKeyset)}, equal to: ${JSON.stringify(schemaKeyset, null, 4)}`)
  }
  return sortIfObject(fillMissingKeys(clone(obj), schemaKeyset))
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
    throw new Error(`json-comb-core/noNewKeys(): [THROW_ID_33] Main input (1st arg.) must be a plain object! Currently it's: ${type(obj)}, equal to: ${JSON.stringify(obj, null, 4)}`)
  }
  if (!isObj(schemaKeyset)) {
    throw new Error(`json-comb-core/noNewKeys(): [THROW_ID_34] Schema input (2nd arg.) must be a plain object! Currently it's: ${type(schemaKeyset)}, equal to: ${JSON.stringify(schemaKeyset, null, 4)}`)
  }
  return nnk(obj, schemaKeyset)
}

// -----------------------------------------------------------------------------

function findUnused (arrOriginal, opts) {
  //
  // PREPARATIONS AND TYPE CHECKS
  // ============================

  if (isArr(arrOriginal)) {
    if ((arrOriginal.length === 0)) {
      return []
    }
  } else {
    throw new TypeError('json-comb-core/findUnused(): [THROW_ID_41] The first argument should be an array. Currently it\'s: ' + type(arrOriginal))
  }
  if ((arguments.length > 1) && !isObj(opts)) {
    throw new TypeError('json-comb-core/findUnused(): [THROW_ID_42] The second argument, options object, must be a plain object, not ' + type(opts))
  }
  var defaults = {
    placeholder: false
  }
  opts = objectAssign(clone(defaults), opts)
  checkTypes(opts, defaults, 'json-comb-core/findUnused(): [THROW_ID_40]', 'opts')
  var arr = clone(arrOriginal)

  // ---------------------------------------------------------------------------

  function removeLeadingDot (something) {
    return something.map(
      finding => finding.charAt(0) === '.' ? finding.slice(1) : finding
    )
  }

  function findUnusedInner (arr, opts, res, path) {
    if (isArr(arr) && (arr.length === 0)) {
      return res
    }
    if (res === undefined) {
      res = []
    }
    if (path === undefined) {
      path = ''
    }
    var keySet
    if (arr.every(el => type(el) === 'Object')) {
      keySet = getKeyset(arr)
      //
      // ------ PART 1 ------
      // iterate all objects within given array, find unused keys
      //
      if (arr.length > 1) {
        var unusedKeys = Object.keys(keySet).filter(
          key => arr.every(
            obj => {
              return (obj[key] === opts.placeholder) || (obj[key] === undefined)
            }
          )
        )
        res = res.concat(unusedKeys.map(
            el => path + '.' + el
          ))
      }
      // ------ PART 2 ------
      // no matter how many objects are there within our array, if any values
      // contain objects or arrays, traverse them recursively
      //
      var keys = [].concat.apply([], Object.keys(keySet).filter(
        key => {
          return (isObj(keySet[key]) || isArr(keySet[key]))
        }
      ))
      var keysContents = keys.map(
        key => type(keySet[key])
      )

      // can't use map() because we want to prevent nulls being written.
      // hence the reduce() contraption
      var extras = keys.map(
        el => [].concat.apply([], arr.reduce(
          (res, obj) => {
            if (existy(obj[el]) && (obj[el] !== opts.placeholder)) {
              res.push(obj[el])
            }
            return res
          }, []
        ))
      )
      var appendix = ''
      var innerDot = ''

      if (extras.length > 0) {
        extras.forEach((singleExtra, i) => {
          if (keysContents[i] === 'Array') {
            appendix = '[' + i + ']'
          }
          innerDot = '.'
          res = findUnusedInner(singleExtra, opts, res, path + innerDot + keys[i] + appendix)
        })
      }
    } else if (arr.every(el => type(el) === 'Array')) {
      arr.forEach(function (singleArray, i) {
        res = findUnusedInner(singleArray, opts, res, path + '[' + i + ']')
      })
    } else if (arr.every(el => type(el) === 'string')) {
    }

    return removeLeadingDot(res)
  }

  return findUnusedInner(arr, opts)
}

// -----------------------------------------------------------------------------

module.exports = {
  getKeyset: getKeyset,
  enforceKeyset: enforceKeyset,
  sortIfObject: sortIfObject,
  noNewKeys: noNewKeys,
  findUnused: findUnused
}
