'use strict'

const toArray = require('lodash.toarray')
const without = require('lodash.without')
// const isNumber = require('lodash.isnumber')
const checkTypes = require('check-types-mini')

// ===========================

/**
 * astralAwareSearch - searches for strings and returns the findings in an array
 *
 * @param  {String} whereToLook    string upon which to perform the search
 * @param  {String} whatToLookFor  string depicting what we are looking for
 * @return {Array}                 findings array, indexes of each first "letter" found
 */
function astralAwareSearch (whereToLook, whatToLookFor, opts) {
  function existy (x) { return x != null }
  if (
    (typeof whereToLook !== 'string') || (whereToLook.length === 0) ||
    (typeof whatToLookFor !== 'string') || (whatToLookFor.length === 0)
  ) {
    return []
  }
  let foundIndexArray = []
  let arrWhereToLook = toArray(whereToLook)
  let arrWhatToLookFor = toArray(whatToLookFor)
  let found

  for (let i = 0; i < arrWhereToLook.length; i++) {
  // check if current source character matches the first char of what we're looking for
    if (opts.i) {
      if (arrWhereToLook[i].toLowerCase() === arrWhatToLookFor[0].toLowerCase()) {
        found = true
        // this means first character matches
        // match the rest:
        for (let i2 = 0; i2 < arrWhatToLookFor.length; i2++) {
          if (
            !existy(arrWhereToLook[i + i2]) ||
            !existy(arrWhatToLookFor[i2]) ||
            (arrWhereToLook[i + i2].toLowerCase() !== arrWhatToLookFor[i2].toLowerCase())
          ) {
            found = false
            break
          }
        }
        if (found) {
          foundIndexArray.push(i)
        }
      }
    } else {
      if (arrWhereToLook[i] === arrWhatToLookFor[0]) {
        found = true
        // this means first character matches
        // match the rest:
        for (let i2 = 0; i2 < arrWhatToLookFor.length; i2++) {
          if (arrWhereToLook[i + i2] !== arrWhatToLookFor[i2]) {
            found = false
            break
          }
        }
        if (found) {
          foundIndexArray.push(i)
        }
      }
    }
  }

  return foundIndexArray
}

// ===========================

/**
 * stringise/arrayiffy - Turns null/undefined into ''. If array, turns each elem into String.
 * all other cases, runs through String()
 *
 * @param  {whatever} incoming     can be anything
 * @return {String/Array}          string or array of strings
 */
function stringise (incoming) {
  if ((incoming === undefined) || (incoming === null) || (typeof incoming === 'boolean')) {
    return ['']
  } else if (Array.isArray(incoming)) {
    incoming.forEach(function (elem, i) {
      if (elem === undefined || elem === null || typeof elem === 'boolean') {
        incoming[i] = ''
      } else {
        incoming[i] = String(incoming[i])
      }
    })
    // check if not incoming !== [''] already
    if ((incoming.length !== 1) && (incoming[0] !== '')) {
      incoming = without(incoming, '')
    }
  } else {
    let tempArr = []
    tempArr.push(String(incoming))
    incoming = tempArr
  }
  return incoming
}

// ===========================

function iterateLeft (elem, arrSource, foundBeginningIndex, i) {
  let matched = true
  let charsArray = toArray(elem)
  for (let i2 = 0, len = charsArray.length; i2 < len; i2++) {
    // iterate each character of particular Outside:
    if (i) {
      if (charsArray[i2].toLowerCase() !== arrSource[foundBeginningIndex - toArray(elem).length + i2].toLowerCase()) {
        matched = false
        break
      }
    } else {
      if (charsArray[i2] !== arrSource[foundBeginningIndex - toArray(elem).length + i2]) {
        matched = false
        break
      }
    }
  }
  return matched
}

function iterateRight (elem, arrSource, foundEndingIndex, i) {
  let matched = true
  let charsArray = toArray(elem)
  for (let i2 = 0, len = charsArray.length; i2 < len; i2++) {
    // iterate each character of particular Outside:
    if (i) {
      if (charsArray[i2].toLowerCase() !== arrSource[foundEndingIndex + i2].toLowerCase()) {
        matched = false
        break
      }
    } else {
      if (charsArray[i2] !== arrSource[foundEndingIndex + i2]) {
        matched = false
        break
      }
    }
  }
  return matched
}

//                      ____
//       bug hammer    |    |
//   O=================|    |
//     bugs into ham   |____|
//
//                     .=O=.

// ===========================
// M O D U L E . E X P O R T S
// ===========================

module.exports = function (source, options, replacement) {
  let defaults = {
    i: {
      leftOutsideNot: false,
      leftOutside: false,
      leftMaybe: false,
      searchFor: false,
      rightMaybe: false,
      rightOutside: false,
      rightOutsideNot: false
    }
  }
  let o = Object.assign({}, defaults, options)
  checkTypes(o, defaults, {
    schema: {
      leftOutsideNot: ['string', 'number', 'null', 'undefined'],
      leftOutside: ['string', 'number', 'null', 'undefined'],
      leftMaybe: ['string', 'number', 'null', 'undefined'],
      searchFor: ['string', 'number'],
      rightMaybe: ['string', 'number', 'null', 'undefined'],
      rightOutside: ['string', 'number', 'null', 'undefined'],
      rightOutsideNot: ['string', 'number', 'null', 'undefined']
    },
    msg: 'easy-replace/module.exports():',
    optsVarName: 'options',
    acceptArrays: true,
    acceptArraysIgnore: ['i']
  })

  // enforce the peace and order:
  source = stringise(source)
  o.leftOutsideNot = stringise(o.leftOutsideNot)
  o.leftOutside = stringise(o.leftOutside)
  o.leftMaybe = stringise(o.leftMaybe)
  o.searchFor = String(o.searchFor)
  o.rightMaybe = stringise(o.rightMaybe)
  o.rightOutside = stringise(o.rightOutside)
  o.rightOutsideNot = stringise(o.rightOutsideNot)
  replacement = stringise(replacement)

  let arrSource = toArray(source[0])
  let foundBeginningIndex
  let foundEndingIndex
  let matched
  let found
  let replacementRecipe = []
  let result = ''

  //  T H E   L O O P

  for (let oneOfFoundIndexes of astralAwareSearch(source[0], o.searchFor, {i: o.i.searchFor})) {
    // oneOfFoundIndexes is the index of starting index of found
    // the principle of replacement is after finding the searchFor string, the boundaries optionally expand. That's left/right Maybe's from the options object. When done, the outsides are checked, first positive (leftOutside, rightOutside), then negative (leftOutsideNot, rightOutsideNot).
    // that's the plan.
    //
    foundBeginningIndex = oneOfFoundIndexes
    foundEndingIndex = oneOfFoundIndexes + toArray(o.searchFor).length
    //
    // ===================== leftMaybe =====================
    // commence with maybe's
    // they're not hungry, i.e. the whole Maybe must be of the left of searchFor exactly
    //
    if (o.leftMaybe.length > 0) {
      for (let i = 0, len = o.leftMaybe.length; i < len; i++) {
        // iterate each of the maybe's in the array:
        matched = true
        let splitLeftMaybe = toArray(o.leftMaybe[i])
        for (let i2 = 0, len = splitLeftMaybe.length; i2 < len; i2++) {
          // iterate each character of particular Maybe:
          if (o.i.leftMaybe) {
            if (splitLeftMaybe[i2].toLowerCase() !== arrSource[oneOfFoundIndexes - splitLeftMaybe.length + i2].toLowerCase()) {
              matched = false
              break
            }
          } else {
            if (splitLeftMaybe[i2] !== arrSource[oneOfFoundIndexes - splitLeftMaybe.length + i2]) {
              matched = false
              break
            }
          }
        }
        if (matched && (oneOfFoundIndexes - splitLeftMaybe.length) < foundBeginningIndex) {
          foundBeginningIndex = oneOfFoundIndexes - splitLeftMaybe.length
        }
      }
    }
    // ===================== rightMaybe =====================
    if (o.rightMaybe.length > 0) {
      for (let i = 0, len = o.rightMaybe.length; i < len; i++) {
        // iterate each of the Maybe's in the array:
        matched = true
        let splitRightMaybe = toArray(o.rightMaybe[i])
        for (let i2 = 0, len = splitRightMaybe.length; i2 < len; i2++) {
          // iterate each character of particular Maybe:
          if (o.i.rightMaybe) {
            if (splitRightMaybe[i2].toLowerCase() !== arrSource[oneOfFoundIndexes + toArray(o.searchFor).length + i2].toLowerCase()) {
              matched = false
              break
            }
          } else {
            if (splitRightMaybe[i2] !== arrSource[oneOfFoundIndexes + toArray(o.searchFor).length + i2]) {
              matched = false
              break
            }
          }
        }
        if (matched && (oneOfFoundIndexes + toArray(o.searchFor).length + splitRightMaybe.length) > foundEndingIndex) {
          foundEndingIndex = oneOfFoundIndexes + toArray(o.searchFor).length + splitRightMaybe.length
        }
      }
    }
    // ===================== leftOutside =====================
    if (o.leftOutside[0] !== '') {
      found = false
      for (let i = 0, len = o.leftOutside.length; i < len; i++) {
        // iterate each of the outsides in the array:
        matched = iterateLeft(o.leftOutside[i], arrSource, foundBeginningIndex, o.i.leftOutside)
        if (matched) {
          found = true
        }
      }
      if (!found) {
        continue
      }
    }
    // ===================== rightOutside =====================
    if (o.rightOutside[0] !== '') {
      found = false
      for (let i = 0, len = o.rightOutside.length; i < len; i++) {
        // iterate each of the outsides in the array:
        matched = iterateRight(o.rightOutside[i], arrSource, foundEndingIndex, o.i.rightOutside)
        if (matched) {
          found = true
        }
      }
      if (!found) {
        continue
      }
    }
    // ===================== leftOutsideNot =====================
    if (o.leftOutsideNot[0] !== '') {
      for (let i = 0, len = o.leftOutsideNot.length; i < len; i++) {
        // iterate each of the outsides in the array:
        matched = iterateLeft(o.leftOutsideNot[i], arrSource, foundBeginningIndex, o.i.leftOutsideNot)
        if (matched) {
          foundBeginningIndex = -1
          foundEndingIndex = -1
          break
        }
      }
      if (foundBeginningIndex === -1) {
        continue
      }
    }
    // ===================== rightOutsideNot =====================
    if (o.rightOutsideNot[0] !== '') {
      for (let i = 0, len = o.rightOutsideNot.length; i < len; i++) {
        // iterate each of the outsides in the array:
        matched = iterateRight(o.rightOutsideNot[i], arrSource, foundEndingIndex, o.i.rightOutsideNot)
        if (matched) {
          foundBeginningIndex = -1
          foundEndingIndex = -1
          break
        }
      }
      if (foundBeginningIndex === -1) {
        continue
      }
    }
    // ===================== the rest =====================
    replacementRecipe.push([foundBeginningIndex, foundEndingIndex])
    // TODO - set the array-slices here
  }
  // =====
  // first we need to remove any overlaps in the recipe, cases like:
  // [ [0,10], [2,12] ] => [ [0,10], [10,12] ]
  if (replacementRecipe.length > 0) {
    replacementRecipe.forEach(function (elem, i) {
      // iterate through all replacement-recipe-array's elements:
      if ((replacementRecipe[i + 1] !== undefined) && (replacementRecipe[i][1] > replacementRecipe[i + 1][0])) {
        replacementRecipe[i + 1][0] = replacementRecipe[i][1]
      }
    })
    // iterate the recipe array again, cleaning up elements like [12,12]
    replacementRecipe.forEach(function (elem, i) {
      if (elem[0] === elem[1]) {
        replacementRecipe.splice(i, 1)
      }
    })
  } else {
    // there were no findings, so return source
    return source.join('')
  }
  //
  // iterate the recipe array and perform the replacement:
  // first, if replacements don't start with 0, attach this part onto result let:
  if ((replacementRecipe.length > 0) && (replacementRecipe[0][0] !== 0)) {
    result = result + arrSource.slice(0, replacementRecipe[0][0]).join('')
  }
  replacementRecipe.forEach(function (elem, i) {
    // first position is replacement string:
    result += replacement.join('')
    if (replacementRecipe[i + 1] !== undefined) {
      // if next element exists, add content between current and next finding
      result += arrSource.slice(replacementRecipe[i][1], replacementRecipe[i + 1][0]).join('')
    } else {
      // if this is the last element in the replacement recipe array, add remainder of the string after last replacement and the end:
      result += arrSource.slice(replacementRecipe[i][1]).join('')
    }
  })
  return result
}
