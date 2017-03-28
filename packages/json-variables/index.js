'use strict'
/* eslint padded-blocks: 0 */

const type = require('type-detect')
const objectAssign = require('object-assign')
const clone = require('lodash.clonedeep')
const includes = require('lodash.includes')
const monkey = require('ast-monkey')
const search = require('str-indexes-of-plus')
const strLen = require('string-length')
const spliceStr = require('splice-string')
const util = require('./util')
const aContainsB = util.aContainsB
const isArr = Array.isArray

function isStr (something) { return type(something) === 'string' }
function isObj (something) { return type(something) === 'Object' }
function isBool (something) { return type(something) === 'boolean' }
function existy (x) { return x != null }

function jsonVariables (inputOriginal, opts) {

  if (arguments.length === 0) {
    throw new Error('json-variables/jsonVariables(): inputs missing!')
  }
  if (!isObj(inputOriginal)) {
    throw new TypeError('json-variables/jsonVariables(): input must be a plain object! Currently it\'s: ' + type(inputOriginal))
  }
  var replacement

  var input = clone(inputOriginal)
  opts = objectAssign({
    heads: '%%_',
    tails: '_%%',
    lookForDataContainers: true,
    dataContainerIdentifierTails: '_data',
    wrapHeads: '',
    wrapTails: '',
    preventDoubleWrapping: true
  }, opts)
  if (opts.heads === '') {
    throw new Error('json-variables/jsonVariables(): opts.heads are empty!')
  }
  if (opts.tails === '') {
    throw new Error('json-variables/jsonVariables(): opts.tails are empty!')
  }
  if (!isStr(opts.heads)) {
    throw new Error('json-variables/jsonVariables(): opts.heads must be a string. It was given as: ' + typeof opts.heads)
  }
  if (!isStr(opts.tails)) {
    throw new Error('json-variables/jsonVariables(): opts.tails must be a string. It was given as: ' + typeof opts.tails)
  }
  if (!isBool(opts.lookForDataContainers)) {
    throw new Error('json-variables/jsonVariables(): opts.lookForDataContainers must be a boolean. It was given as: ' + typeof opts.lookForDataContainers)
  }
  if (!isBool(opts.preventDoubleWrapping)) {
    throw new Error('json-variables/jsonVariables(): opts.preventDoubleWrapping must be a boolean. It was given as: ' + typeof opts.preventDoubleWrapping)
  }
  if (opts.lookForDataContainers && !isStr(opts.dataContainerIdentifierTails)) {
    throw new Error('json-variables/jsonVariables(): opts.dataContainerIdentifierTails must be a string. It was given as: ' + typeof opts.heads)
  }
  if (opts.lookForDataContainers && opts.dataContainerIdentifierTails === '') {
    throw new Error('json-variables/jsonVariables(): opts.dataContainerIdentifierTails is empty!')
  }
  if (opts.heads === opts.tails) {
    throw new Error('json-variables/jsonVariables(): opts.heads and opts.tails can\'t be equal!')
  }
  if (!isStr(opts.wrapHeads)) {
    throw new Error('json-variables/jsonVariables(): opts.wrapHeads must be a string. It was given as: ' + typeof opts.wrapHeads)
  }
  if (!isStr(opts.wrapTails)) {
    throw new Error('json-variables/jsonVariables(): opts.wrapTails must be a string. It was given as: ' + typeof opts.wrapTails)
  }

  var foundHeads, foundTails
  var current, currentObjKey

  input = monkey.traverse(input, function (key, val, innerObj) {
    if (existy(val) && (aContainsB(key, opts.heads) || aContainsB(key, opts.tails))) {
      throw new Error('json-variables/jsonVariables(): Object keys can\'t contain variables!\nPlease check following key: ' + key)
    }
    // If it's an array, val will not exist, only key.
    // On objects, we'll use val instead:
    current = existy(val) ? val : key
    currentObjKey = existy(val) ? key : null

    // if current branch piece that monkey has just brought, "current" contains no variable
    // placeholders, instantly return it back, skipping all the action.

    if (!isStr(current) || (search(current, opts.heads).length === 0)) {
      return current
    }

    if (search(current, opts.heads).length !== search(current, opts.tails).length) {
      throw new Error('json-variables/jsonVariables(): Mismatching opening and closing markers!\nPlease check following key: ' + key + ', we have ' + search(current, opts.heads).length + ' head markers and ' + search(current, opts.tails).length + ' markers.')
    }

    var innerVar // first extracted variable, without heads and tails
    var patience = false // when it reaches zero recursion error is thrown. When off, it's falsey.
    var recursionLoopSize // how many indexes are between the element to-be-added to innerPath[] and the index of the last occurence of the same value in innerPath[].
    // For example, on "abcda", the recursionLoopSize = 4 - 0 = 4.
    var innerPath = [] // recording path to identify recursions

    while (search(current, opts.heads).length !== 0) {
      foundHeads = search(current, opts.heads)
      foundTails = search(current, opts.tails)
      innerVar = util.extractVarsFromString(current, opts.heads, opts.tails)[0]

      // catch recursion after one full cycle
      if (includes(innerPath, innerVar)) {
        if (!patience) {
          // means recursion is about to start, patience is not active yet
          recursionLoopSize = innerPath.length - util.findLastInArray(innerPath, innerVar)
          patience = recursionLoopSize > 1 ? recursionLoopSize : false
        } else {
          // means second recursion cycle is potentially going on, patience is active
          if (innerPath[innerPath.length - recursionLoopSize] === innerVar) {
            patience--
          }
          if (patience < 1) {
            throw new Error('json-variables/jsonVariables(): Recursion detected!\nPlease check following key: ' + current)
          }
        }
      } else {
        patience = false
      }
      innerPath.push(innerVar)

      if (innerVar === currentObjKey) {
        throw new Error('json-variables/jsonVariables(): Recursion detected!\nPlease check the following key: ' + currentObjKey || current)
      }

      if (input.hasOwnProperty(innerVar)) {

        replacement = input[innerVar]

        if (!isStr(replacement)) {
          if (isArr(replacement)) {
            replacement = replacement.join('')
          } else {
            throw new Error('json-variables/jsonVariables(): The value for our variable was given not a string but ' + type(replacement))
          }
        }

        // from here consider "current" to be of string format

        if (
            includes(util.extractVarsFromString(replacement), currentObjKey) ||
            includes(util.extractVarsFromString(replacement), innerVar)
          ) {
          throw new Error('')
        }

        if (!opts.preventDoubleWrapping || (
          (opts.wrapHeads === '' || search(replacement, opts.wrapHeads).length === 0) &&
          (opts.wrapTails === '' || search(replacement, opts.wrapTails).length === 0) &&
          (search(replacement, opts.heads).length === 0) &&
          (search(replacement, opts.tails).length === 0)
        )) {
          replacement = opts.wrapHeads + replacement + opts.wrapTails
        }

        current = spliceStr(
          current,
          foundHeads[0],
          foundTails[0] - foundHeads[0] + strLen(opts.tails),
          replacement
        )
      } else {
        // object does not have referenced key!
        // last chance, it might sit in "<innerVar>_data" key nearby!
        if (opts.lookForDataContainers) {
          if (input.hasOwnProperty(key + opts.dataContainerIdentifierTails) && isObj(input[key + opts.dataContainerIdentifierTails])) {

            replacement = input[key + opts.dataContainerIdentifierTails][innerVar]

            if (!opts.preventDoubleWrapping || (
              (opts.wrapHeads === '' || search(replacement, opts.wrapHeads).length === 0) &&
              (opts.wrapTails === '' || search(replacement, opts.wrapTails).length === 0) &&
              (search(replacement, opts.heads).length === 0) &&
              (search(replacement, opts.tails).length === 0)
            )) {
              replacement = opts.wrapHeads + replacement + opts.wrapTails
            }

            current = spliceStr(
              current,
              foundHeads[0],
              foundTails[0] - foundHeads[0] + strLen(opts.tails),
              replacement
            )
          } else {
            throw new Error('json-variables/jsonVariables(): Neither key ' + innerVar + ' nor data key ' + innerVar + opts.dataContainerIdentifierTails + ' exist in your input')
          }
        } else {
          throw new Error('json-variables/jsonVariables(): Required key ' + innerVar + ' is missing and you turned off the feature to search for key containing data (opts.lookForDataContainers=false). Now the value is missing and we\'re in trouble.')
        }
      }
    }

    return current
  })

  // }

  return input
}

module.exports = jsonVariables
