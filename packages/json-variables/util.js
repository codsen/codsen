'use strict'
/* eslint padded-blocks: 0 */

const type = require('type-detect')
const search = require('str-indexes-of-plus')
const slice = require('string-slice')
const strLen = require('string-length')
const trim = require('lodash.trim')

function existy (x) { return x != null }

function aContainsB (a, b) {
  if (arguments.length < 2) {
    return false
  }
  return String(a).indexOf(String(b)) >= 0
}

function findLastInArray (array, val) {
  var res = null
  if (!existy(val)) {
    return res
  }
  array.forEach(function (el, i) {
    if (array[i] === val) {
      res = i
    }
  })
  return res
}

function extractVarsFromString (str, heads, tails) {
  heads = heads || '%%_'
  tails = tails || '_%%'
  if (arguments.length === 0) {
    throw new Error('json-variables/util.js/extractVarsFromString(): inputs missing!')
  }
  if (typeof str !== 'string') {
    throw new Error('json-variables/util.js/extractVarsFromString(): first arg must be string-type. Currently it\'s: ' + type(str))
  }
  if (typeof heads !== 'string') {
    throw new Error('json-variables/util.js/extractVarsFromString(): second arg must be string-type. Currently it\'s: ' + type(heads))
  }
  if (typeof tails !== 'string') {
    throw new Error('json-variables/util.js/extractVarsFromString(): third arg must be string-type. Currently it\'s: ' + type(tails))
  }
  var res = []
  if (str.length === 0) {
    return res
  }

  var foundHeads = search(str, heads)
  var foundTails = search(str, tails)
  if (foundHeads.length !== foundTails.length) {
    throw new Error('json-variables/util.js/extractVarsFromString(): Mismatching heads and tails in the input:' + str)
  }

  var to, from
  for (var i = 0, len = foundHeads.length; i < len; i++) {
    from = foundHeads[i] + strLen(heads)
    to = foundTails[i]
    res.push(trim(slice(str, from, to)))
  }
  return res
}

module.exports = {
  aContainsB: aContainsB,
  extractVarsFromString: extractVarsFromString,
  findLastInArray: findLastInArray
}
