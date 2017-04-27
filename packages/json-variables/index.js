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
const slice = require('string-slice')
const util = require('./util')
const aContainsB = util.aContainsB
const isArr = Array.isArray
const matcher = require('matcher')
const numSort = require('num-sort')

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
    headsNoWrap: '%%-',
    tailsNoWrap: '-%%',
    lookForDataContainers: true,
    dataContainerIdentifierTails: '_data',
    wrapHeadsWith: '',
    wrapTailsWith: '',
    dontWrapVars: [],
    preventDoubleWrapping: true,
    wrapGlobalFlipSwitch: true, // is wrap function on?
    noSingleMarkers: false // if value has only and exactly heads or tails, don't throw mismatched marker error.
  }
  opts = objectAssign(clone(defaults), opts)

  opts.dontWrapVars = util.arrayiffyString(opts.dontWrapVars)

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
  if (opts.heads === opts.headsNoWrap) {
    throw new Error('json-variables/jsonVariables(): [THROW_ID_07] opts.heads and opts.headsNoWrap can\'t be equal!')
  }
  if (opts.tails === opts.tailsNoWrap) {
    throw new Error('json-variables/jsonVariables(): [THROW_ID_08] opts.tails and opts.tailsNoWrap can\'t be equal!')
  }
  if (opts.headsNoWrap === '') {
    throw new Error('json-variables/jsonVariables(): [THROW_ID_09] opts.headsNoWrap is empty!')
  }
  if (opts.tailsNoWrap === '') {
    throw new Error('json-variables/jsonVariables(): [THROW_ID_10] opts.tailsNoWrap is empty!')
  }
  if (opts.headsNoWrap === opts.tailsNoWrap) {
    throw new Error('json-variables/jsonVariables(): [THROW_ID_11] opts.headsNoWrap and opts.tailsNoWrap can\'t be equal!')
  }

  var foundHeads, foundTails
  var current, currentObjKey, wrapLeft, wrapRight, offset
  var wrap = opts.wrapGlobalFlipSwitch

  input = monkey.traverse(input, function (key, val, innerObj) {
    if (
      existy(val) && (
        aContainsB(key, opts.heads) ||
        aContainsB(key, opts.tails) ||
        aContainsB(key, opts.headsNoWrap) ||
        aContainsB(key, opts.tailsNoWrap)
      )
    ) {
      throw new Error('json-variables/jsonVariables(): [THROW_ID_12] Object keys can\'t contain variables!\nPlease check following key: ' + key)
    }
    // If it's an array, val will not exist, only key.
    // On objects, we'll use val instead:
    current = existy(val) ? val : key
    currentObjKey = existy(val) ? key : null

    // if current branch's piece that monkey has just brought, "current" contains no variable
    // placeholders, instantly return it back, skipping all the action.

    if (
      !isStr(current) ||
      (
        (search(current, opts.heads).length === 0) &&
        (search(current, opts.headsNoWrap).length === 0)
      )
    ) {
      return current
    }

    if (
      (
        (search(current, opts.heads).length + search(current, opts.headsNoWrap).length) !==
        (search(current, opts.tails).length + search(current, opts.tailsNoWrap).length)
      ) &&
      (
        (opts.noSingleMarkers) ||
        (
          !opts.noSingleMarkers &&
          (current !== opts.heads) &&
          (current !== opts.tails) &&
          (current !== opts.headsNoWrap) &&
          (current !== opts.tailsNoWrap)
        )
      )
    ) {
      throw new Error('json-variables/jsonVariables(): [THROW_ID_13] Mismatching opening and closing markers!\nPlease check following key: "' + key + '", we have ' + search(current, opts.heads).length + ' head markers (' + opts.heads + ') and ' + search(current, opts.tails).length + ' tail markers (' + opts.tails + ').')
    }

    var innerVar // first extracted variable's key, without heads and tails
    var patience = false // when it reaches zero recursion error is thrown. When off, it's falsey.
    var recursionLoopSize // how many indexes are between the element to-be-added to innerPath[] and the index of the last occurence of the same value in innerPath[].
    // For example, on "abcda", the recursionLoopSize = 4 - 0 = 4.
    var innerPath = [] // recording path to identify recursions
    var loopKillSwitch = true

    if (!opts.noSingleMarkers && (
      (current === opts.heads) ||
      (current === opts.tails) ||
      (current === opts.headsNoWrap) ||
      (current === opts.tailsNoWrap)
    )) {
      loopKillSwitch = false
    }

    var dontWrapTheseVarsStartingWithIndexes = []

    // loop will be skipped completely with the help of "loopKillSwitch" if opts.noSingleMarkers=false and "current" has the value of "opts.heads" or "opts.tails"
    // its purpose is that when we allow heads or tails to be present in the content, among values, they can throw off the whole system because they will be unmatched!
    // we are not talking about cases like: "some text %%_variableName_%% some text", but only where the whole object's value is equal to heads or tails: "%%_" or "_%%".
    // The above is relevant in cases when all preferences are kept in the same JSON and heads/tails are set from the same file they will later process.
    if ((!opts.noSingleMarkers && loopKillSwitch) || opts.noSingleMarkers) {
      while ((search(current, opts.heads).length !== 0) || (search(current, opts.headsNoWrap).length !== 0)) {
        foundHeads = search(current, opts.heads).concat(search(current, opts.headsNoWrap)).sort(numSort.asc)
        foundTails = search(current, opts.tails).concat(search(current, opts.tailsNoWrap)).sort(numSort.asc)
        innerVar = util.extractVarsFromString(current, [opts.heads, opts.headsNoWrap], [opts.tails, opts.tailsNoWrap])[0]

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
              throw new Error('json-variables/jsonVariables(): [THROW_ID_14] Recursion detected!\nPlease check following key: ' + current)
            }
          }
        } else {
          patience = false
        }
        innerPath.push(innerVar)

        if (innerVar === currentObjKey) {
          throw new Error('json-variables/jsonVariables(): [THROW_ID_15] Recursion detected!\nPlease check the following key: ' + currentObjKey || current)
        }
        var case1, case2, case3
        if (input.hasOwnProperty(innerVar)) {
          case1 = true
          replacement = input[innerVar]

          if (!isStr(replacement)) {
            if (isArr(replacement)) {
              replacement = replacement.join('')
            } else {
              throw new Error('json-variables/jsonVariables(): [THROW_ID_16] The value for our variable was given not a string but ' + type(replacement))
            }
          }
          // from here consider "current" to be of string format
          if (includes(util.extractVarsFromString(replacement, opts.heads, opts.tails), currentObjKey)) {
            throw new Error('json-variables/jsonVariables(): [THROW_ID_17] Recursion detected! ' + JSON.stringify(replacement, null, 4) + ' contains ' + currentObjKey)
          } else if (includes(util.extractVarsFromString(replacement, opts.heads, opts.tails), innerVar)) {
            throw new Error('json-variables/jsonVariables(): [THROW_ID_18] Recursion detected! ' + JSON.stringify(replacement, null, 4) + ' contains ' + innerVar)
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
                throw new Error('json-variables/jsonVariables(): [THROW_ID_19] Neither key ' + innerVar + ' nor data key ' + innerVar + opts.dataContainerIdentifierTails + ' exist in your input')
              }
            }
          } else {
            throw new Error('json-variables/jsonVariables(): [THROW_ID_20] Neither key ' + innerVar + ' nor data key ' + innerVar + opts.dataContainerIdentifierTails + ' exist in your input. We wanted to resolve: ' + current + (existy(key) ? (' coming from key: ' + key) : ''))
          }
        } else {
          throw new Error('json-variables/jsonVariables(): [THROW_ID_21] Required key ' + innerVar + ' is missing and you turned off the feature to search for key containing data (opts.lookForDataContainers=false). Now the value is missing and we\'re in trouble.')
        }

        if (case1 || case2 || case3) {
          if (opts.wrapGlobalFlipSwitch) {
            wrap = true // reset it for the new key.
          }
          // more resets:
          wrapLeft = true
          wrapRight = true

          if (opts.wrapGlobalFlipSwitch && opts.dontWrapVars.length > 0) {
            wrap = wrap && !opts.dontWrapVars.some(function (elem) {
              return matcher.isMatch(innerVar, elem)
            })
          }

          // check if current variable's marker is opts.headsNoWrap (default is "%%-"). If so, don't wrap it.
          if (util.aStartsWithB(spliceStr(current, 0, foundHeads[0]), opts.headsNoWrap)) {
            wrapLeft = false
          }

          // check if current variable's marker is opts.headsNoWrap (default is "%%-"). If so, don't wrap it.
          if (util.aStartsWithB(slice(current, foundTails[0]), opts.tailsNoWrap)) {
            wrapRight = false
          }

          if (!wrapLeft && !wrapRight) {
            dontWrapTheseVarsStartingWithIndexes.push([foundHeads[0], foundTails[0]])
          } else if (!wrapLeft && wrapRight) {
            dontWrapTheseVarsStartingWithIndexes.push([foundHeads[0], null])
          } else if (wrapLeft && !wrapRight) {
            dontWrapTheseVarsStartingWithIndexes.push([null, foundTails[0]])
          }

          if (dontWrapTheseVarsStartingWithIndexes.length > 0) {
            dontWrapTheseVarsStartingWithIndexes.forEach(function (el) {
              if (el[0] === foundHeads[0]) {
                wrapLeft = false
              }
              if (el[1] === foundTails[0]) {
                wrapRight = false
              }
            })
          }

          // calculating what to replace the variable with (is it wrapped or not)
          if (
            opts.wrapGlobalFlipSwitch &&
            wrap &&
            (!opts.preventDoubleWrapping ||
              (
                (opts.wrapHeadsWith === '' || search(replacement, opts.wrapHeadsWith).length === 0) &&
                (opts.wrapTailsWith === '' || search(replacement, opts.wrapTailsWith).length === 0) &&
                (search(replacement, opts.heads).length === 0) &&
                (search(replacement, opts.tails).length === 0)
              )
            )
          ) {
            replacement = (wrapLeft ? opts.wrapHeadsWith : '') + replacement + (wrapRight ? opts.wrapTailsWith : '')
          }

          // offset fixes
          var extr = util.extractVarsFromString(replacement, opts.heads, opts.tails)[0] || replacement
          offset = extr.length - innerVar.length
          dontWrapTheseVarsStartingWithIndexes = util.fixOffset(dontWrapTheseVarsStartingWithIndexes, foundHeads[0], offset)

          // replacing variable with the value
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
