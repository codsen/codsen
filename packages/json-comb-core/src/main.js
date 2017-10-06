import setAllValuesTo from 'object-set-all-values-to'
import flattenAllArrays from 'object-flatten-all-arrays'
import mergeAdvanced from 'object-merge-advanced'
import fillMissingKeys from 'object-fill-missing-keys'
import nnk from 'object-no-new-keys'
import clone from 'lodash.clonedeep'
import includes from 'lodash.includes'
import type from 'type-detect'
import checkTypes from 'check-types-mini'

// -----------------------------------------------------------------------------

function existy(x) { return x != null }
function truthy(x) { return (x !== false) && existy(x) }
function isObj(something) { return type(something) === 'Object' }
function isArr(something) { return Array.isArray(something) }

function sortIfObject(obj) {
  if (isObj(obj)) {
    return Object.keys(obj).sort().reduce((result, key) => {
      result[key] = obj[key]
      return result
    }, {})
  }
  return obj
}

// -----------------------------------------------------------------------------

function getKeyset(arrOriginal, opts) {
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

  let schemaObj = {}
  const arr = clone(arrOriginal)
  const defaults = {
    placeholder: false,
  }
  opts = Object.assign(clone(defaults), opts)
  checkTypes(opts, defaults, {
    msg: 'json-comb-core/getKeyset(): [THROW_ID_10*]',
    schema: {
      placeholder: ['null', 'number', 'string', 'boolean', 'object'],
    },
  })

  const fOpts = {
    flattenArraysContainingStringsToBeEmpty: true,
  }

  arr.forEach((obj, i) => {
    if (!isObj(obj)) {
      throw new TypeError(`json-comb-core/getKeyset(): [THROW_ID_15] Non-object (${type(obj)}) detected within an array! It's the ${i}th element: ${JSON.stringify(obj, null, 4)}`)
    }
    schemaObj = mergeAdvanced(
      flattenAllArrays(schemaObj, fOpts),
      flattenAllArrays(obj, fOpts),
      { mergeArraysContainingStringsToBeEmpty: true },
    )
  })
  schemaObj = sortIfObject(setAllValuesTo(schemaObj, opts.placeholder))
  return schemaObj
}

// -----------------------------------------------------------------------------

function enforceKeyset(obj, schemaKeyset) {
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
function noNewKeys(obj, schemaKeyset) {
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

function findUnused(arrOriginal, opts) {
  //
  // PREPARATIONS AND TYPE CHECKS
  // ============================

  if (isArr(arrOriginal)) {
    if ((arrOriginal.length === 0)) {
      return []
    }
  } else {
    throw new TypeError(`json-comb-core/findUnused(): [THROW_ID_41] The first argument should be an array. Currently it's: ${type(arrOriginal)}`)
  }
  if ((arguments.length > 1) && !isObj(opts)) {
    throw new TypeError(`json-comb-core/findUnused(): [THROW_ID_42] The second argument, options object, must be a plain object, not ${type(opts)}`)
  }
  const defaults = {
    placeholder: false,
    comments: '__comment__',
  }
  opts = Object.assign({}, defaults, opts)
  if (opts.comments === 1 || opts.comments === '1') {
    throw new TypeError('json-comb-core/findUnused(): [THROW_ID_43] opts.comments was set to Number 1, but it does not make sense. Either it\'s string or falsey. Please fix.')
  }
  if (opts.comments === true || opts.comments === 'true') {
    throw new TypeError('json-comb-core/findUnused(): [THROW_ID_43] opts.comments was set to Boolean "true", but it does not make sense. Either it\'s string or falsey. Please fix.')
  }
  if (!truthy(opts.comments) || (opts.comments === 0)) {
    opts.comments = false
  }
  checkTypes(
    opts,
    defaults,
    {
      msg: 'json-comb-core/findUnused(): [THROW_ID_40]',
      schema: {
        placeholder: ['null', 'number', 'string', 'boolean'],
        comments: ['string', 'boolean'],
      },
    },
  )
  if (opts.comments === '') {
    opts.comments = false
  }
  const arr = clone(arrOriginal)

  // ---------------------------------------------------------------------------

  function removeLeadingDot(something) {
    return something.map(finding => (finding.charAt(0) === '.' ? finding.slice(1) : finding))
  }

  function findUnusedInner(arr1, opts1, res, path) {
    if (isArr(arr1) && (arr1.length === 0)) {
      return res
    }
    if (res === undefined) {
      res = []
    }
    if (path === undefined) {
      path = ''
    }
    let keySet
    if (arr1.every(el => type(el) === 'Object')) {
      keySet = getKeyset(arr1)
      //
      // ------ PART 1 ------
      // iterate all objects within given arr1ay, find unused keys
      //
      if (arr1.length > 1) {
        const unusedKeys = Object.keys(keySet).filter(key => arr1.every(obj =>
          (
            (obj[key] === opts1.placeholder) ||
                (obj[key] === undefined)
          ) && (
            !opts1.comments ||
                !includes(key, opts1.comments)
          )))
        // console.log(`unusedKeys = ${JSON.stringify(unusedKeys, null, 4)}`)
        res = res.concat(unusedKeys.map(el => `${path}.${el}`))
        // console.log(`res = ${JSON.stringify(res, null, 4)}`)
      }
      // ------ PART 2 ------
      // no matter how many objects are there within our arr1ay, if any values
      // contain objects or arr1ays, traverse them recursively
      //
      const keys = [].concat(...Object.keys(keySet)
        .filter(key => (isObj(keySet[key]) || isArr(keySet[key]))))
      const keysContents = keys.map(key => type(keySet[key]))

      // can't use map() because we want to prevent nulls being written.
      // hence the reduce() contraption
      const extras = keys.map(el => [].concat(...arr1.reduce((res1, obj) => {
        if (existy(obj[el]) && (obj[el] !== opts1.placeholder)) {
          if (!opts1.comments || !includes(obj[el], opts1.comments)) {
            res1.push(obj[el])
          }
        }
        return res1
      }, [])))
      let appendix = ''
      let innerDot = ''

      if (extras.length > 0) {
        extras.forEach((singleExtra, i) => {
          if (keysContents[i] === 'Array') {
            appendix = `[${i}]`
          }
          innerDot = '.'
          res = findUnusedInner(singleExtra, opts1, res, path + innerDot + keys[i] + appendix)
        })
      }
    } else if (arr1.every(el => type(el) === 'Array')) {
      arr1.forEach((singleArray, i) => {
        res = findUnusedInner(singleArray, opts1, res, `${path}[${i}]`)
      })
    } // else if (arr1.every(el => type(el) === 'string')) {
    // }

    return removeLeadingDot(res)
  }

  return findUnusedInner(arr, opts)
}

// -----------------------------------------------------------------------------

export default {
  getKeyset,
  enforceKeyset,
  sortIfObject,
  noNewKeys,
  findUnused,
}
