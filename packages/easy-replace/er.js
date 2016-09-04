'use strict'

var toarray = require('lodash.toarray')

function astralAwareSearch (whereToLook, whatToLookFor) {
  var foundIndex = -1
  var arrWhereToLook = toarray(whereToLook)
  var arrWhatToLookFor = toarray(whatToLookFor)
  var found

  loop1: for (var i = 0; i < arrWhereToLook.length; i++) {
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
        foundIndex = i
        break loop1
      }
    }
  }

  return foundIndex
}

module.exports = function (incomingSource, options, incomingReplacement) {
  var o = options || {}
  // setting defaults
  if (o.leftOutsideNot === undefined) { o.leftOutsideNot = '' }
  if (o.leftOutside === undefined) { o.leftOutside = '' }
  if (o.leftMaybe === undefined) { o.leftMaybe = '' }
  if (o.searchFor === undefined) { o.searchFor = '' }
  if (o.rightMaybe === undefined) { o.rightMaybe = '' }
  if (o.rightOutside === undefined) { o.rightOutside = '' }
  if (o.rightOutsideNot === undefined) { o.rightOutsideNot = '' }

  // turning into strings
  o.leftOutsideNot = String(o.leftOutsideNot)
  o.leftOutside = String(o.leftOutside)
  o.leftMaybe = String(o.leftMaybe)
  o.searchFor = String(o.searchFor)
  o.rightMaybe = String(o.rightMaybe)
  o.rightOutside = String(o.rightOutside)
  o.rightOutsideNot = String(o.rightOutsideNot)

  var source
  if ((typeof incomingSource === 'string') || (typeof incomingSource === 'number')) {
    source = String(incomingSource)
  } else {
    source = ''
  }

  var result = source
  var arrSource = toarray(source)

  var replacement
  if ((typeof incomingReplacement === 'string') || (typeof incomingReplacement === 'number')) {
    replacement = String(incomingReplacement)
  } else {
    replacement = ''
  }

  // indexes of starting and ending index of the finding in the string
  var foundBeginningIndex = -1
  var foundEndingIndex = -1
  if ((Object.keys(o).length === 0) || (o.searchFor === 'undefined') || (o.searchFor === '')) {
    return source
  }

  // This is the starting index, from which we commence the search. After each find, it's increased so loop can run through all occurencies of the searched string. It allows seemingly infinite loop replace cases.
  var index = 0

  //  T H E   L O O P

  while (index < arrSource.length) {
    arrSource = toarray(result)

    // it's astralAwareSearch() plus index, because astralAwareSearch() will return index starting from what it received, and it actually received string that's index is offset by value of "index" variable!
    // search can return also false
    if (
      astralAwareSearch(arrSource.slice(index).join(''), o.searchFor) !== false &&
      astralAwareSearch(arrSource.slice(index).join(''), o.searchFor) >= 0
    ) {
      foundBeginningIndex = astralAwareSearch(arrSource.slice(index).join(''), o.searchFor) + index
    } else {
      // didn't find anymore, so block further actions:
      foundBeginningIndex = -1
    }
    if (foundBeginningIndex >= 0) {
      foundEndingIndex = foundBeginningIndex + toarray(o.searchFor).length
      index = foundEndingIndex
    } else {
      index = arrSource.length
      // return result
    }
    var matched
    // =====================================
    // check the leftMaybe:
    if ((o.leftMaybe !== undefined) && (o.leftMaybe !== '')) {
      // commence the leftMaybe check
      matched = true
      toarray(o.leftMaybe).forEach(function (elem, i) {
        if (elem !== arrSource[foundBeginningIndex - toarray(o.leftMaybe).length + i]) {
          matched = false
        }
      })
      if (matched) {
        foundBeginningIndex -= toarray(o.leftMaybe).length
      }
    }
    // =====================================
    // check the rightMaybe:
    if ((o.rightMaybe !== undefined) && (o.rightMaybe !== '')) {
      // commence the rightMaybe check
      matched = true
      toarray(o.rightMaybe).forEach(function (elem, i) {
        if (elem !== arrSource[foundEndingIndex + i]) {
          matched = false
        }
      })
      if (matched) {
        foundEndingIndex += toarray(o.rightMaybe).length
      }
    }
    // =====================================
    // check the leftOutside:
    if ((o.leftOutside !== undefined) && (o.leftOutside !== '')) {
      // commence the leftOutside check
      toarray(o.leftOutside).forEach(function (elem, i) {
        if (elem !== arrSource[foundBeginningIndex - toarray(o.leftOutside).length + i]) {
          foundBeginningIndex = -1
          foundEndingIndex = -1
        }
      })
    }
    // =====================================
    // check the rightOutside:
    if ((o.rightOutside !== undefined) && (o.rightOutside !== '')) {
      // commence the rightOutside check
      toarray(o.rightOutside).forEach(function (elem, i) {
        if (elem !== arrSource[foundEndingIndex + i]) {
          foundBeginningIndex = -1
          foundEndingIndex = -1
        }
      })
    }
    // =====================================
    // check the leftOutsideNot:
    if ((o.leftOutsideNot !== undefined) && (o.leftOutsideNot !== '')) {
      // commence the leftOutsideNot check
      toarray(o.leftOutsideNot).forEach(function (elem, i) {
        if (elem === arrSource[foundBeginningIndex - toarray(o.leftOutsideNot).length + i]) {
          foundBeginningIndex = -1
          foundEndingIndex = -1
        }
      })
    }
    // =====================================
    // check the rightOutsideNot:
    if ((o.rightOutsideNot !== undefined) && (o.rightOutsideNot !== '')) {
      // commence the rightOutsideNot check
      toarray(o.rightOutsideNot).forEach(function (elem, i) {
        if (elem === arrSource[foundEndingIndex + i]) {
          foundBeginningIndex = -1
          foundEndingIndex = -1
        }
      })
    }
    // =====================================
    // replace

    if ((foundBeginningIndex !== -1) && (foundEndingIndex !== -1) && (arrSource.slice(foundBeginningIndex, foundEndingIndex).join('') !== replacement)) {
      result = arrSource.slice(0, foundBeginningIndex).join('') + replacement + arrSource.slice(foundEndingIndex).join('')
      index = arrSource.slice(0, foundBeginningIndex).join('').length + toarray(replacement).length
      if (index > 1) {
        index--
      }
    }
  }
  return result
}
