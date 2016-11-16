'use strict'

var toArray = require('lodash.toarray')
var without = require('lodash.without')
var isNumber = require('lodash.isnumber')

// ===========================

/**
 * astralAwareSearch - searches for strings and returns the findings in an array
 *
 * @param  {String} whereToLook    string upon which to perform the search
 * @param  {String} whatToLookFor  string depicting what we are looking for
 * @return {Array}                 findings array, indexes of each first "letter" found
 */
function astralAwareSearch (whereToLook, whatToLookFor) {
  var foundIndexArray = []
  var arrWhereToLook = toArray(whereToLook)
  var arrWhatToLookFor = toArray(whatToLookFor)
  var found

  for (var i = 0; i < arrWhereToLook.length; i++) {
  // check if current source character matches the first char of what we're looking for
    if (arrWhereToLook[i] === arrWhatToLookFor[0]) {
      found = true
      // this means first character matches
      // match the rest:
      for (var i2 = 0; i2 < arrWhatToLookFor.length; i2++) {
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

  return foundIndexArray
}

// ===========================

/**
 * stringise - Turns null/undefined into ''. If array, turns each elem into String.
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
    var tempArr = []
    tempArr.push(String(incoming))
    incoming = tempArr
  }
  return incoming
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
  var o = options || {}

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

  var arrSource = toArray(source[0])
  var foundBeginningIndex
  var foundEndingIndex
  var matched
  var found
  var replacementRecipe = []
  var result = ''

  //  T H E   L O O P

  astralAwareSearch(source[0], o.searchFor).forEach(function (oneOfFoundIndexes) {
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
      o.leftMaybe.forEach(function (elem, i) {
        // iterate each of the maybe's in the array:
        matched = true
        toArray(elem).forEach(function (elem2, i2) {
          // iterate each character of particular Maybe:
          if (elem2 !== arrSource[oneOfFoundIndexes - toArray(elem).length + i2]) {
            matched = false
          }
        })
        if (matched && (oneOfFoundIndexes - toArray(elem).length) < foundBeginningIndex) {
          foundBeginningIndex = oneOfFoundIndexes - toArray(elem).length
        }
      })
    }
    // ===================== rightMaybe =====================
    if (o.rightMaybe.length > 0) {
      o.rightMaybe.forEach(function (elem, i) {
        // iterate each of the Maybe's in the array:
        matched = true
        toArray(elem).forEach(function (elem2, i2) {
          // iterate each character of particular Maybe:
          if (elem2 !== arrSource[oneOfFoundIndexes + toArray(o.searchFor).length + i2]) {
            matched = false
          }
        })
        if (matched && (oneOfFoundIndexes + toArray(o.searchFor).length + toArray(elem).length) > foundEndingIndex) {
          foundEndingIndex = oneOfFoundIndexes + toArray(o.searchFor).length + toArray(elem).length
        }
      })
    }
    // ===================== leftOutside =====================
    if (o.leftOutside[0] !== '') {
      found = false
      o.leftOutside.forEach(function (elem, i) {
        // iterate each of the outsides in the array:
        matched = true
        toArray(elem).forEach(function (elem2, i2) {
          // iterate each character of particular Outside:
          if (elem2 !== arrSource[foundBeginningIndex - toArray(elem).length + i2]) {
            matched = false
          }
        })
        if (matched) {
          found = true
        }
      })
      if (!found) {
        foundBeginningIndex = -1
        foundEndingIndex = -1
      }
    }
    // ===================== rightOutside =====================
    if (o.rightOutside[0] !== '') {
      found = false
      o.rightOutside.forEach(function (elem, i) {
        // iterate each of the outsides in the array:
        matched = true
        toArray(elem).forEach(function (elem2, i2) {
          // iterate each character of particular Outside:
          if (elem2 !== arrSource[foundEndingIndex + i2]) {
            matched = false
          }
        })
        if (matched) {
          found = true
        }
      })
      if (!found) {
        foundBeginningIndex = -1
        foundEndingIndex = -1
      }
    }
    // ===================== leftOutsideNot =====================
    if (o.leftOutsideNot[0] !== '') {
      found = false
      o.leftOutsideNot.forEach(function (elem, i) {
        // iterate each of the outsides in the array:
        matched = true
        toArray(elem).forEach(function (elem2, i2) {
          // iterate each character of particular Outside:
          if (elem2 !== arrSource[foundBeginningIndex - toArray(elem).length + i2]) {
            matched = false
          }
        })
        if (matched) {
          foundBeginningIndex = -1
          foundEndingIndex = -1
        }
      })
    }
    // ===================== rightOutsideNot =====================
    if (o.rightOutsideNot[0] !== '') {
      found = false
      o.rightOutsideNot.forEach(function (elem, i) {
        // iterate each of the outsides in the array:
        matched = true
        toArray(elem).forEach(function (elem2, i2) {
          // iterate each character of particular Outside:
          if (elem2 !== arrSource[foundEndingIndex + i2]) {
            matched = false
          }
        })
        if (matched) {
          foundBeginningIndex = -1
          foundEndingIndex = -1
        }
      })
    }
    // ===================== the rest =====================
    if (isNumber(foundBeginningIndex) && (foundBeginningIndex !== -1)) {
      replacementRecipe.push([foundBeginningIndex, foundEndingIndex])
    }
  })
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
  // first, if replacements don't start with 0, attach this part onto result var:
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
