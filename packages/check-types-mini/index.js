'use strict'

const type = require('type-detect')
const objectAssign = require('object-assign')
const clone = require('lodash.clonedeep')
const includes = require('lodash.includes')
const pullAll = require('lodash.pullall')
const intersection = require('lodash.intersection')
const arrayiffyIfString = require('arrayiffy-if-string')

function checkTypes (obj, ref, msg, optsVarName, opts) {
  const NAMESFORANYTYPE = ['everything', 'all', 'any', 'whatever']

  function existy (x) { return x != null }
  function isBool (something) { return type(something) === 'boolean' }
  const isArr = Array.isArray

  if (arguments.length === 0) {
    throw new Error('check-types-mini/checkTypes(): [THROW_ID_01] missing first two arguments!')
  }
  if (arguments.length === 1) {
    throw new Error('check-types-mini/checkTypes(): [THROW_ID_02] missing second argument!')
  }
  if (existy(msg) && (type(msg) !== 'string')) {
    throw new Error(`check-types-mini/checkTypes(): [THROW_ID_03] third argument, msg must be string! Currently it's: ${type(msg)}, equal to ${JSON.stringify(msg, null, 4)}`)
  }
  if (existy(optsVarName) && (type(optsVarName) !== 'string')) {
    throw new Error(`check-types-mini/checkTypes(): [THROW_ID_04] fourth argument, optsVarName must be string! Currently it's: ${type(optsVarName)}, equal to ${JSON.stringify(optsVarName, null, 4)}`)
  }
  if ((typeof msg === 'string') && (msg.length > 0)) {
    msg = msg.trim() + ' '
  } else {
    msg = ''
  }
  if ((optsVarName === undefined) || (optsVarName === null)) {
    optsVarName = 'opts'
  }
  optsVarName = optsVarName.trim() + '.'

  var defaults = {
    ignoreKeys: [],
    acceptArrays: false,
    acceptArraysIgnore: [],
    enforceStrictKeyset: true,
    schema: {}
  }
  opts = objectAssign(clone(defaults), opts)
  opts.ignoreKeys = arrayiffyIfString(opts.ignoreKeys)
  opts.acceptArraysIgnore = arrayiffyIfString(opts.acceptArraysIgnore)
  // make every schema object key's value to be an array:
  Object.keys(opts.schema).forEach(function (oneKey) {
    if (!isArr(opts.schema[oneKey])) {
      opts.schema[oneKey] = [opts.schema[oneKey]]
    }
    // then turn all keys into strings and trim and lowercase them:
    opts.schema[oneKey] = opts.schema[oneKey].map(String).map(el => el.toLowerCase()).map(el => el.trim())
  })

  if (!isArr(opts.ignoreKeys)) {
    throw new TypeError(`check-types-mini/checkTypes(): [THROW_ID_05] opts.ignoreKeys should be an array, currently it's: ${type(opts.ignoreKeys)}`)
  }
  if (!isBool(opts.acceptArrays)) {
    throw new TypeError(`check-types-mini/checkTypes(): [THROW_ID_06] opts.acceptArrays should be a Boolean, currently it's: ${type(opts.acceptArrays)}`)
  }
  if (!isArr(opts.acceptArraysIgnore)) {
    throw new TypeError(`check-types-mini/checkTypes(): [THROW_ID_07] opts.acceptArraysIgnore should be an array, currently it's: ${type(opts.acceptArraysIgnore)}`)
  }
  if (!isBool(opts.enforceStrictKeyset)) {
    throw new TypeError(`check-types-mini/checkTypes(): [THROW_ID_08] opts.enforceStrictKeyset should be a Boolean, currently it's: ${type(opts.enforceStrictKeyset)}`)
  }

  if (!existy(ref)) {
    ref = {}
  }

  if (opts.enforceStrictKeyset) {
    if (existy(opts.schema) && (Object.keys(opts.schema).length > 0)) {
      if (pullAll(Object.keys(obj), clone(Object.keys(ref)).concat(Object.keys(opts.schema))).length !== 0) {
        throw new TypeError(`check-types-mini/checkTypes(): [THROW_ID_09] opts.enforceStrictKeyset is on and the following keys are not covered by schema and/or reference objects: ${JSON.stringify(pullAll(Object.keys(obj), clone(Object.keys(ref)).concat(Object.keys(opts.schema))), null, 4)}`)
      }
    } else {
      if (existy(ref) && (Object.keys(ref).length > 0)) {
        if (pullAll(Object.keys(obj), Object.keys(ref)).length !== 0) {
          throw new TypeError(`check-types-mini/checkTypes(): [THROW_ID_10] The input object has keys that are not covered by reference object: ${JSON.stringify(pullAll(Object.keys(obj), Object.keys(ref)), null, 4)}`)
        } else if (pullAll(Object.keys(ref), Object.keys(obj)).length !== 0) {
          throw new TypeError(`check-types-mini/checkTypes(): [THROW_ID_11] The reference object has keys that are not present in the input object: ${JSON.stringify(pullAll(Object.keys(ref), Object.keys(obj)), null, 4)}`)
        }
      } else {
        // it's an error because both schema and reference don't exist
        throw new TypeError(`check-types-mini/checkTypes(): [THROW_ID_12] Both opts.schema and reference objects are missing! We don't have anything to match the keys as you requested via opts.enforceStrictKeyset!`)
      }
    }
  }

  Object.keys(obj).forEach(function (key) {
    if (opts.schema.hasOwnProperty(key)) {
      // stage 1. check schema, if present
      opts.schema[key] = arrayiffyIfString(opts.schema[key])
        .map(String)
        .map(el => el.toLowerCase())
      // first check does our schema contain any blanket names, "any", "whatever" etc.
      if (!intersection(opts.schema[key], NAMESFORANYTYPE).length) {
        // because, if not, it means we need to do some work, check types:
        if (!includes(opts.schema[key], type(obj[key]).toLowerCase())) {
          throw new TypeError(`${msg}${optsVarName}${key} was customised to ${JSON.stringify(obj[key], null, 4)} which is not among the allowed types in schema (${opts.schema[key]}) but ${type(obj[key])}`)
        }
      }
    } else {
      // stage 2. check reference object.
      if (
        ref.hasOwnProperty(key) &&
        (type(obj[key]) !== type(ref[key])) &&
        !includes(opts.ignoreKeys, key)
      ) {
        if (opts.acceptArrays && isArr(obj[key]) && !includes(opts.acceptArraysIgnore, key)) {
          var allMatch = obj[key].every(function (el, i) {
            return type(el) === type(ref[key])
          })
          if (!allMatch) {
            throw new TypeError(`${msg}${optsVarName}${key} was customised to be array, but not all of its elements are ${type(ref[key])}-type`)
          }
        } else {
          throw new TypeError(`${msg}${optsVarName}${key} was customised to ${JSON.stringify(obj[key], null, 4)} which is not ${type(ref[key])} but ${type(obj[key])}`)
        }
      }
    }
  })
}

module.exports = checkTypes
