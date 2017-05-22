'use strict'

const type = require('type-detect')
const objectAssign = require('object-assign')
const clone = require('lodash.clonedeep')
const isArr = Array.isArray
const includes = require('lodash.includes')
const arrayiffyIfString = require('arrayiffy-if-string')

function checkTypes (obj, ref, msg, optsVarName, opts) {
  function existy (x) { return x != null }
  function isBool (something) { return type(something) === 'boolean' }

  if (arguments.length === 0) {
    throw new Error('check-types-mini/checkTypes(): [THROW_ID_01] missing first two arguments!')
  }
  if (arguments.length === 1) {
    throw new Error('check-types-mini/checkTypes(): [THROW_ID_02] missing second argument!')
  }
  if (!existy(optsVarName)) {
    optsVarName = 'opts'
  }
  if ((typeof msg === 'string') && (msg.length > 0)) {
    msg = msg.trim() + ' '
  } else {
    msg = ''
  }
  if ((typeof optsVarName === 'string') && (optsVarName.length > 0)) {
    optsVarName = optsVarName.trim() + '.'
  } else {
    optsVarName = ''
  }

  var defaults = {
    ignoreKeys: [],
    acceptArrays: false,
    acceptArraysIgnore: []
  }
  opts = objectAssign(clone(defaults), opts)
  opts.ignoreKeys = arrayiffyIfString(opts.ignoreKeys)
  opts.acceptArraysIgnore = arrayiffyIfString(opts.acceptArraysIgnore)

  if (!isArr(opts.ignoreKeys)) {
    throw new TypeError('check-types-mini/checkTypes(): [THROW_ID_03] opts.ignoreKeys should be an array, currently it\'s: ' + type(opts.ignoreKeys))
  }
  if (!isBool(opts.acceptArrays)) {
    throw new TypeError('check-types-mini/checkTypes(): [THROW_ID_04] opts.acceptArrays should be a Boolean, currently it\'s: ' + type(opts.acceptArrays))
  }
  if (!isArr(opts.acceptArraysIgnore)) {
    throw new TypeError('check-types-mini/checkTypes(): [THROW_ID_03] opts.acceptArraysIgnore should be an array, currently it\'s: ' + type(opts.acceptArraysIgnore))
  }

  Object.keys(obj).forEach(function (key) {
    if (
      existy(ref[key]) &&
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
  })
}

module.exports = checkTypes
