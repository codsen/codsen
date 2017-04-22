'use strict'
var clone = require('lodash.clonedeep')
var wildstring = require('wildstring')

function includesWithGlob (originalInput, stringToFind) {
  //
  // internal f()'s
  function existy (x) { return x != null }
  function isArr (something) { return Array.isArray(something) }
  function isStr (something) { return typeof something === 'string' }

  // insurance
  if (arguments.length === 0) {
    throw new Error('array-includes-with-glob/includesWithGlob(): [THROW_ID_01] all inputs missing!')
  }
  if (arguments.length === 1) {
    throw new Error('array-includes-with-glob/includesWithGlob(): [THROW_ID_02] second argument missing!')
  }
  if (!isArr(originalInput)) {
    if (isStr(originalInput)) {
      originalInput = [originalInput]
    } else {
      throw new Error('array-includes-with-glob/includesWithGlob(): [THROW_ID_03] first argument must be an array! It was given as ' + typeof originalInput)
    }
  }
  if (!isStr(stringToFind)) {
    throw new Error('array-includes-with-glob/includesWithGlob(): [THROW_ID_04] second argument must be a string! It was given as ' + typeof stringToFind)
  }

  // maybe we can end prematurely:
  if (originalInput.length === 0) {
    return false // because nothing can be found in it
  }

  // prevent any mutation + filter out undefined and null elements:
  var input = clone(originalInput).filter(function (elem) {
    return existy(elem)
  })

  // if array contained only null/undefined values, do a Dutch leave:
  if (input.length === 0) {
    return false
  }

  return input.some(function (val) {
    return wildstring.match(stringToFind, val)
  })
}

module.exports = includesWithGlob
