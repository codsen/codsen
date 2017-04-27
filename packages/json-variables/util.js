'use strict'
/* eslint padded-blocks: 0 */

const type = require('type-detect')
const search = require('str-indexes-of-plus')
const slice = require('string-slice')
const strLen = require('string-length')
const trim = require('lodash.trim')
const includes = require('lodash.includes')
const clone = require('lodash.clonedeep')
const numSort = require('num-sort')
const monkey = require('ast-monkey')

function existy (x) { return x != null }
function truthy (x) { return (x !== false) && existy(x) }

function aContainsB (a, b) {
  if (arguments.length < 2) {
    return false
  }
  return String(a).indexOf(String(b)) >= 0
}

function aStartsWithB (a, b) {
  if (!truthy(a) || !truthy(b)) {
    return false
  }
  return a.indexOf(b) === 0
}

function checkTypes (obj, ref, msg, variable) {
  if (arguments.length === 0) {
    throw new Error('object-flatten-referencing/util.js/checkTypes(): missing inputs!')
  }
  Object.keys(obj).forEach(function (key) {
    if (existy(ref[key]) && type(obj[key]) !== type(ref[key])) {
      throw new TypeError(msg + ' ' + variable + '.' + key + ' was customised to ' + JSON.stringify(obj[key], null, 4) + ' which is not ' + type(ref[key]) + ' but ' + type(obj[key]))
    }
  })
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

// since v.1.1 str can be equal to heads or tails - there won't be any results though (result will be empty array)
function extractVarsFromString (str, heads, tails) {
  if (arguments.length === 0) {
    throw new Error('json-variables/util.js/extractVarsFromString(): inputs missing!')
  }
  if (type(str) !== 'string') {
    throw new Error('json-variables/util.js/extractVarsFromString(): first arg must be string-type. Currently it\'s: ' + type(str))
  }
  if (heads === undefined) {
    heads = ['%%_']
  }
  if (tails === undefined) {
    tails = ['_%%']
  }
  if (type(heads) !== 'string' && type(heads) !== 'Array') {
    throw new Error('json-variables/util.js/extractVarsFromString(): second arg must be a string or an array of strings. Currently it\'s: ' + type(heads))
  }
  if (type(tails) !== 'string' && type(tails) !== 'Array') {
    throw new Error('json-variables/util.js/extractVarsFromString(): third arg must be a string or an array of strings. Currently it\'s: ' + type(tails))
  }
  heads = arrayiffyString(clone(heads))
  tails = arrayiffyString(clone(tails))
  if (includes(heads, str) || includes(tails, str)) {
    return []
  }
  var res = []
  if (str.length === 0) {
    return res
  }
  // var foundHeads = search(str, heads)
  // var foundTails = search(str, tails)
  var foundHeads = heads.reduce(function (acc, val) {
    return acc.concat(search(str, val))
  }, []).sort(numSort.asc)

  var foundTails = tails.reduce(function (acc, val) {
    return acc.concat(search(str, val))
  }, []).sort(numSort.asc)

  if ((foundHeads.length !== foundTails.length) && !includes(heads, str) && !includes(tails, str)) {
    throw new Error('json-variables/util.js/extractVarsFromString(): Mismatching heads and tails in the input:' + str)
  }

  var to, from, currentHeadLength
  for (var i = 0, len = foundHeads.length; i < len; i++) {
    heads.forEach(function (el) {
      if (aStartsWithB(slice(str, foundHeads[i]), el)) {
        currentHeadLength = strLen(el)
      }
    })
    from = foundHeads[i] + currentHeadLength
    to = foundTails[i]
    res.push(trim(slice(str, from, to)))
  }
  return res
}

// If a string is given, put it into an array. Bypass everything else.
function arrayiffyString (something) {
  if (type(something) === 'string') {
    if (something.length > 0) {
      return [something]
    } else {
      return []
    }
  }
  return something
}

// accepts array, where elements are arrays, containing integers or null.
// for example:
// [ [1, 3], [5, null], [null, 16] ]
//
// it's for internal use, so there is no input type validation
function fixOffset (whatever, position, amount) {
  whatever = monkey.traverse(whatever, function (key, val, innerObj) {
    var current = monkey.existy(val) ? val : key
    if ((val === null) && (typeof key === 'number')) {
      // console.log('key=' + key)
      if (existy(amount) && (amount !== 0) && key > position) {
        return key + amount
      }
    }
    return current
  })
  return whatever
}

module.exports = {
  aContainsB: aContainsB,
  aStartsWithB: aStartsWithB,
  extractVarsFromString: extractVarsFromString,
  findLastInArray: findLastInArray,
  checkTypes: checkTypes,
  arrayiffyString: arrayiffyString,
  fixOffset: fixOffset
}
