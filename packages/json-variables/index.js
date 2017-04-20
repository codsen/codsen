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
function existy (x) { return x != null }

function jsonVariables (inputOriginal, opts) {

  if (arguments.length === 0) {
    throw new Error('json-variables/jsonVariables(): [THROW_ID_01] inputs missing!')
  }
  if (!isObj(inputOriginal)) {
    throw new TypeError('json-variables/jsonVariables(): [THROW_ID_02] input must be a plain object! Currently it\'s: ' + type(inputOriginal))
  }
  var replacement

  var input = clone(inputOriginal)
  var defaults = {
    heads: '%%_',
    tails: '_%%',
    lookForDataContainers: true,
    dataContainerIdentifierTails: '_data',
    wrapHeads: '',
    wrapTails: '',
    dontWrapVarsStartingWith: [],
    dontWrapVarsEndingWith: [],
    preventDoubleWrapping: true,
    wrapGlobalFlipSwitch: true, // global flip switch for variable wrapping after resolving
    noSingleMarkers: false // if value has only and exactly heads or tails, don't throw mismatched marker error.
  }
  opts = objectAssign(clone(defaults), opts)

  opts.dontWrapVarsStartingWith = util.arrayiffyString(opts.dontWrapVarsStartingWith)
  opts.dontWrapVarsEndingWith = util.arrayiffyString(opts.dontWrapVarsEndingWith)

  util.checkTypes(opts, defaults, 'json-variables/jsonVariables():', 'opts')

  if (opts.heads === '') {
    throw new Error('json-variables/jsonVariables(): [THROW_ID_03] opts.heads are empty!')
  }
  if (opts.tails === '') {
    throw new Error('json-variables/jsonVariables(): [THROW_ID_04] opts.tails are empty!')
  }
  if (opts.lookForDataContainers && opts.dataContainerIdentifierTails === '') {
    throw new Error('json-variables/jsonVariables(): [THROW_ID_05] opts.dataContainerIdentifierTails is empty!')
  }
  if (opts.heads === opts.tails) {
    throw new Error('json-variables/jsonVariables(): [THROW_ID_06] opts.heads and opts.tails can\'t be equal!')
  }

  var foundHeads, foundTails
  var current, currentObjKey
  var wrap = opts.wrapGlobalFlipSwitch

  input = monkey.traverse(input, function (key, val, innerObj) {
    if (existy(val) && (aContainsB(key, opts.heads) || aContainsB(key, opts.tails))) {
      throw new Error('json-variables/jsonVariables(): [THROW_ID_07] Object keys can\'t contain variables!\nPlease check following key: ' + key)
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

    // ((current !== opts.heads) && (current !== opts.tails)) ||
    if (
      (search(current, opts.heads).length !== search(current, opts.tails).length) &&
      (
        (opts.noSingleMarkers) ||
        (!opts.noSingleMarkers && (current !== opts.heads) && (current !== opts.tails))
      )
    ) {
      throw new Error('json-variables/jsonVariables(): [THROW_ID_08] Mismatching opening and closing markers!\nPlease check following key: "' + key + '", we have ' + search(current, opts.heads).length + ' head markers and ' + search(current, opts.tails).length + ' tail markers.')
    }

    var innerVar // first extracted variable, without heads and tails
    var patience = false // when it reaches zero recursion error is thrown. When off, it's falsey.
    var recursionLoopSize // how many indexes are between the element to-be-added to innerPath[] and the index of the last occurence of the same value in innerPath[].
    // For example, on "abcda", the recursionLoopSize = 4 - 0 = 4.
    var innerPath = [] // recording path to identify recursions
    var loopKillSwitch = true

    if (!opts.noSingleMarkers && ((current === opts.heads) || (current === opts.tails))) {
      loopKillSwitch = false
    }

    // loop will be skipped completely with the help of "loopKillSwitch" if opts.noSingleMarkers=false and "current" has the value of "opts.heads" or "opts.tails"
    if ((!opts.noSingleMarkers && loopKillSwitch) || opts.noSingleMarkers) {
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
              throw new Error('json-variables/jsonVariables(): [THROW_ID_09] Recursion detected!\nPlease check following key: ' + current)
            }
          }
        } else {
          patience = false
        }
        innerPath.push(innerVar)

        if (innerVar === currentObjKey) {
          throw new Error('json-variables/jsonVariables(): [THROW_ID_10] Recursion detected!\nPlease check the following key: ' + currentObjKey || current)
        }
        var case1, case2, case3
        if (input.hasOwnProperty(innerVar)) {
          case1 = true
          replacement = input[innerVar]

          if (!isStr(replacement)) {
            if (isArr(replacement)) {
              replacement = replacement.join('')
            } else {
              throw new Error('json-variables/jsonVariables(): [THROW_ID_11] The value for our variable was given not a string but ' + type(replacement))
            }
          }
          // from here consider "current" to be of string format
          if (includes(util.extractVarsFromString(replacement), currentObjKey)) {
            throw new Error('json-variables/jsonVariables(): [THROW_ID_12] Recursion detected! ' + JSON.stringify(replacement, null, 4) + ' contains ' + currentObjKey)
          } else if (includes(util.extractVarsFromString(replacement), innerVar)) {
            throw new Error('json-variables/jsonVariables(): [THROW_ID_13] Recursion detected! ' + JSON.stringify(replacement, null, 4) + ' contains ' + innerVar)
          }
        } else if (opts.lookForDataContainers) {
          if (
            input.hasOwnProperty(key + opts.dataContainerIdentifierTails) &&
            isObj(input[key + opts.dataContainerIdentifierTails])
          ) {
            case2 = true
            replacement = input[key + opts.dataContainerIdentifierTails][innerVar]
          } else if (
            input.hasOwnProperty(innerObj.topmostKey + opts.dataContainerIdentifierTails) &&
            isObj(input[innerObj.topmostKey + opts.dataContainerIdentifierTails])
          ) {
            case3 = true
            if (existy(input[innerObj.topmostKey + opts.dataContainerIdentifierTails][innerVar])) {
              replacement = input[innerObj.topmostKey + opts.dataContainerIdentifierTails][innerVar]
            } else {
              // A rare case when variable from data store is referencing another variable that also comes from data store.
              // Now essentially the original reference to the correct data store is lost, and now the new data store doesn't contain the variable we're looking for.
              // The solution (not ideal) is to traverse all keys at root level that can be identified as data stores and look for the missing key we need there.

              replacement = undefined
              Object.keys(input).forEach(function (key2) {
                if (
                  !replacement &&
                  (opts.lookForDataContainers) && // data key container lookup is left turned on
                  (opts.dataContainerIdentifierTails !== '') && // data key name append is not set to blank
                  key2.endsWith(opts.dataContainerIdentifierTails) && // it's data container
                  isObj(input[key2]) && // key's value is object
                  input[key2].hasOwnProperty(innerVar) // has the key we want
                ) {
                  replacement = input[key2][innerVar]
                }
              })
              if (!replacement) {
                throw new Error('json-variables/jsonVariables(): [THROW_ID_14] Neither key ' + innerVar + ' nor data key ' + innerVar + opts.dataContainerIdentifierTails + ' exist in your input')
              }
            }
          } else {
            throw new Error('json-variables/jsonVariables(): [THROW_ID_16] Neither key ' + innerVar + ' nor data key ' + innerVar + opts.dataContainerIdentifierTails + ' exist in your input')
          }
        } else {
          throw new Error('json-variables/jsonVariables(): [THROW_ID_17] Required key ' + innerVar + ' is missing and you turned off the feature to search for key containing data (opts.lookForDataContainers=false). Now the value is missing and we\'re in trouble.')
        }

        if (case1 || case2 || case3) {
          if (opts.wrapGlobalFlipSwitch) {
            wrap = true // reset it for the new key.
          }

          if (opts.wrapGlobalFlipSwitch && opts.dontWrapVarsEndingWith.length > 0) {
            wrap = wrap && !opts.dontWrapVarsEndingWith.some(function (elem) {
              return innerVar.endsWith(elem)
            })
          }
          if (opts.wrapGlobalFlipSwitch && opts.dontWrapVarsStartingWith.length > 0) {
            wrap = wrap && !opts.dontWrapVarsStartingWith.some(function (elem) {
              return innerVar.startsWith(elem)
            })
          }

          if (
            opts.wrapGlobalFlipSwitch &&
            wrap &&
            (!opts.preventDoubleWrapping ||
              (
                (opts.wrapHeads === '' || search(replacement, opts.wrapHeads).length === 0) &&
                (opts.wrapTails === '' || search(replacement, opts.wrapTails).length === 0) &&
                (search(replacement, opts.heads).length === 0) &&
                (search(replacement, opts.tails).length === 0)
              )
            )
          ) {
            replacement = opts.wrapHeads + replacement + opts.wrapTails
          }
          current = spliceStr(
            current,
            foundHeads[0],
            foundTails[0] - foundHeads[0] + strLen(opts.tails),
            replacement
          )
        }
      }
    }

    return current
  })
  return input
}

module.exports = jsonVariables
