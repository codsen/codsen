'use strict'
var replace = require('lodash.replace')
var remove = require('lodash.remove')
var clone = require('lodash.clonedeep')

/**
 * pullAllWithGlob - like _.pullAll but pulling stronger
 * Accepts * glob.
 * For example, "module-*" would pull all: "module-1", "module-zzz"...
 *
 * @param  {Array} input           array of strings
 * @param  {Array} toBeRemovedArr  array of strings (might contain asterisk)
 * @return {Array}                 pulled array
 */
function pullAllWithGlob (originalInput, originalToBeRemoved) {
  //
  // internal f()'s
  function existy (x) { return x != null }
  function aContainsB (a, b) {
    return a.indexOf(b) >= 0
  }
  function aStartsWithB (a, b) {
    return a.indexOf(b) === 0
  }

  // insurance
  if (!existy(originalInput)) {
    throw new Error('array-pull-all-with-glob/pullAllWithGlob(): missing input!')
  } else if (!existy(originalToBeRemoved)) {
    return originalInput
  }
  if (!Array.isArray(originalInput) || !Array.isArray(originalToBeRemoved) || (Array.isArray(originalToBeRemoved) && originalToBeRemoved.length === 0)) {
    return originalInput
  }

  // vars
  var input = clone(originalInput).filter(function (elem) {
    return existy(elem)
  })
  var toBeRemovedArr = clone(originalToBeRemoved).filter(function (elem) {
    return existy(elem)
  })

  // action
  toBeRemovedArr.forEach(function (toBeRemovedArrElem, toBeRemovedArrIndex) {
    remove(input, function (n) {
      if (aContainsB(toBeRemovedArrElem, '*')) {
        return aStartsWithB(n, replace(toBeRemovedArrElem, /[*].*/g, ''))
      } else {
        return n === toBeRemovedArrElem
      }
    })
  })

  return input
}

module.exports = pullAllWithGlob
