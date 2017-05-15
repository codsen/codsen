'use strict'

const type = require('type-detect')
const objectAssign = require('object-assign')
const clone = require('lodash.clonedeep')
const isArr = Array.isArray
const includes = require('lodash.includes')

function checkTypes (obj, ref, msg, optsVarName, opts) {
  function existy (x) { return x != null }

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
    ignoreKeys: []
  }
  opts = objectAssign(clone(defaults), opts)
  if (typeof opts.ignoreKeys === 'string') {
    if (opts.ignoreKeys.length > 0) {
      opts.ignoreKeys = [opts.ignoreKeys]
    } else {
      opts.ignoreKeys = []
    }
  }
  if (!isArr(opts.ignoreKeys)) {
    throw new TypeError('check-types-mini/checkTypes(): [THROW_ID_03] opts.ignoreKeys should be an array, currently it\'s: ' + type(opts.ignoreKeys))
  }

  Object.keys(obj).forEach(function (key) {
    if (existy(ref[key]) && (type(obj[key]) !== type(ref[key])) && !includes(opts.ignoreKeys, key)) {
      throw new TypeError(`${msg}${optsVarName}${key} was customised to ${JSON.stringify(obj[key], null, 4)} which is not ${type(ref[key])} but ${type(obj[key])}`)
    }
  })
}

module.exports = checkTypes
