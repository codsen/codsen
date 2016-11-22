'use strict'
var replace = require('lodash.replace')
var remove = require('lodash.remove')

/**
 * pullAllWithGlob - like _.pullAll but pulling stronger
 * Accepts * glob.
 * For example, "module-*" would pull all: "module-1", "module-zzz"...
 *
 * @param  {Array} incomingArray   array of strings
 * @param  {Array} whitelistArray  array of strings (might contain asterisk)
 * @return {Array}                 pulled array
 */
function pullAllWithGlob (incomingArray, whitelistArray) {
  function aContainsB (a, b) {
    return a.indexOf(b) >= 0
  }
  function aStartsWithB (a, b) {
    return a.indexOf(b) === 0
  }
  // console.log('incomingArray = ' + JSON.stringify(incomingArray, null, 4))
  if (!Array.isArray(whitelistArray) || !Array.isArray(incomingArray)) {
    return incomingArray
  }
  whitelistArray.forEach(function (whitelistArrayElem, whitelistArrayIndex) {
    remove(incomingArray, function (n) {
      if (aContainsB(whitelistArrayElem, '*')) {
        return aStartsWithB(n, replace(whitelistArrayElem, /[*].*/g, ''))
      } else {
        return n === whitelistArrayElem
      }
    })
  })
  // console.log('incomingArray = ' + JSON.stringify(incomingArray, null, 4))
  return incomingArray
}

module.exports = pullAllWithGlob
