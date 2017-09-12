const type = require('type-detect')
const includes = require('lodash.includes')
const pullAll = require('lodash.pullall')
const intersection = require('lodash.intersection')
const arrayiffyIfString = require('arrayiffy-if-string')

function checkTypes(obj, originalRef, originalOptions) {
  function existy(something) { return something != null }
  function isBool(something) { return type(something) === 'boolean' }
  function isStr(something) { return type(something) === 'string' }
  function isObj(something) { return type(something) === 'Object' }
  const NAMESFORANYTYPE = ['any', 'anything', 'every', 'everything', 'all', 'whatever', 'whatevs']
  const isArr = Array.isArray

  if (arguments.length === 0) {
    throw new Error('check-types-mini/checkTypes(): Missing all arguments!')
  }
  if (arguments.length === 1) {
    throw new Error('check-types-mini/checkTypes(): Missing second argument!')
  }

  const ref = isObj(originalRef) ? originalRef : {}

  const defaults = {
    ignoreKeys: [],
    acceptArrays: false,
    acceptArraysIgnore: [],
    enforceStrictKeyset: true,
    schema: {},
    msg: 'check-types-mini/checkTypes()',
    optsVarName: 'opts',
  }
  let opts
  if (existy(originalOptions) && isObj(originalOptions)) {
    opts = Object.assign({}, defaults, originalOptions)
  } else {
    opts = Object.assign({}, defaults)
  }
  if (!isStr(opts.msg)) {
    throw new Error(`check-types-mini/checkTypes(): opts.msg must be string! Currently it's: ${type(opts.msg)}, equal to ${JSON.stringify(opts.msg, null, 4)}`)
  }
  opts.msg = opts.msg.trim()
  if (opts.msg[opts.msg.length - 1] === ':') {
    opts.msg = opts.msg.slice(0, opts.msg.length - 1)
  }
  if (!isStr(opts.optsVarName)) {
    throw new Error(`check-types-mini/checkTypes(): opts.optsVarName must be string! Currently it's: ${type(opts.optsVarName)}, equal to ${JSON.stringify(opts.optsVarName, null, 4)}`)
  }

  opts.ignoreKeys = arrayiffyIfString(opts.ignoreKeys)
  opts.acceptArraysIgnore = arrayiffyIfString(opts.acceptArraysIgnore)
  // make every schema object key's value to be an array:

  if (!isArr(opts.ignoreKeys)) {
    throw new TypeError(`check-types-mini/checkTypes(): opts.ignoreKeys should be an array, currently it's: ${type(opts.ignoreKeys)}`)
  }
  if (!isBool(opts.acceptArrays)) {
    throw new TypeError(`check-types-mini/checkTypes(): opts.acceptArrays should be a Boolean, currently it's: ${type(opts.acceptArrays)}`)
  }
  if (!isArr(opts.acceptArraysIgnore)) {
    throw new TypeError(`check-types-mini/checkTypes(): opts.acceptArraysIgnore should be an array, currently it's: ${type(opts.acceptArraysIgnore)}`)
  }
  if (!isBool(opts.enforceStrictKeyset)) {
    throw new TypeError(`check-types-mini/checkTypes(): opts.enforceStrictKeyset should be a Boolean, currently it's: ${type(opts.enforceStrictKeyset)}`)
  }
  Object.keys(opts.schema).forEach((oneKey) => {
    if (!isArr(opts.schema[oneKey])) {
      opts.schema[oneKey] = [opts.schema[oneKey]]
    }
    // then turn all keys into strings and trim and lowercase them:
    opts.schema[oneKey] = opts.schema[oneKey]
      .map(String)
      .map(el => el.toLowerCase())
      .map(el => el.trim())
  })

  if (opts.enforceStrictKeyset) {
    if (existy(opts.schema) && (Object.keys(opts.schema).length > 0)) {
      if (pullAll(
        Object.keys(obj),
        Object.keys(ref).concat(Object.keys(opts.schema)),
      ).length !== 0) {
        throw new TypeError(`${opts.msg}: ${opts.optsVarName}.enforceStrictKeyset is on and the following keys are not covered by schema and/or reference objects: ${JSON.stringify(pullAll(Object.keys(obj), Object.keys(ref).concat(Object.keys(opts.schema))), null, 4)}`)
      }
    } else if (existy(ref) && Object.keys(ref).length > 0) {
      if (pullAll(
        Object.keys(obj),
        Object.keys(ref),
      ).length !== 0) {
        throw new TypeError(`${opts.msg}: The input object has keys that are not covered by reference object: ${JSON.stringify(pullAll(Object.keys(obj), Object.keys(ref)), null, 4)}`)
      } else if (pullAll(Object.keys(ref), Object.keys(obj)).length !== 0) {
        throw new TypeError(`${opts.msg}: The reference object has keys that are not present in the input object: ${JSON.stringify(pullAll(Object.keys(ref), Object.keys(obj)), null, 4)}`)
      }
    } else {
      // it's an error because both schema and reference don't exist
      throw new TypeError(`${opts.msg}: Both ${opts.optsVarName}.schema and reference objects are missing! We don't have anything to match the keys as you requested via opts.enforceStrictKeyset!`)
    }
  }

  Object.keys(obj).forEach((key) => {
    if (existy(opts.schema) && Object.prototype.hasOwnProperty.call(opts.schema, key)) {
      // stage 1. check schema, if present
      opts.schema[key] = arrayiffyIfString(opts.schema[key])
        .map(String)
        .map(el => el.toLowerCase())
      // first check does our schema contain any blanket names, "any", "whatever" etc.
      if (!intersection(opts.schema[key], NAMESFORANYTYPE).length) {
        // because, if not, it means we need to do some work, check types:
        if (!includes(
          opts.schema[key],
          type(obj[key]).toLowerCase(),
        )
        ) {
          // new in v.2.2
          // Check if key's value is array. Then, if it is, check if opts.acceptArrays is on.
          // If it is, then iterate through the array, checking does each value conform to the
          // types listed in that key's schema entry.
          if (
            isArr(obj[key]) && opts.acceptArrays
          ) {
            // check each key:
            for (let i = 0, len = obj[key].length; i < len; i++) {
              if (!includes(
                opts.schema[key],
                type(obj[key][i]).toLowerCase(),
              )
              ) {
                throw new TypeError(`${opts.msg}: ${opts.optsVarName}.${key} is of type ${type(obj[key][i]).toLowerCase()}, but only the following are allowed in ${opts.optsVarName}.schema: ${opts.schema[key]}`)
              }
            }
          } else {
            // only then, throw
            throw new TypeError(`${opts.msg}: ${opts.optsVarName}.${key} was customised to ${JSON.stringify(obj[key], null, 4)} which is not among the allowed types in schema (${opts.schema[key]}) but ${type(obj[key])}`)
          }
        }
      }
    } else if (
      existy(ref) &&
      Object.prototype.hasOwnProperty.call(ref, key) &&
      (type(obj[key]) !== type(ref[key])) &&
      !includes(opts.ignoreKeys, key)
    ) {
      if (opts.acceptArrays && isArr(obj[key]) && !includes(opts.acceptArraysIgnore, key)) {
        const allMatch = obj[key].every(el => type(el) === type(ref[key]))
        if (!allMatch) {
          throw new TypeError(`${opts.msg}: ${opts.optsVarName}.${key} was customised to be array, but not all of its elements are ${type(ref[key])}-type`)
        }
      } else {
        throw new TypeError(`${opts.msg}: ${opts.optsVarName}.${key} was customised to ${JSON.stringify(obj[key], null, 4)} which is not ${type(ref[key])} but ${type(obj[key])}`)
      }
    }
  })
}

module.exports = checkTypes
