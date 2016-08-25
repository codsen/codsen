'use strict'

var from = require('array-from')
var DEBUG = false

function astralAwareSearch (whereToLook, whatToLookFor) {
  var i = false
  if (Array.isArray(whereToLook)) {
    whereToLook = whereToLook.join('')
  }
  whereToLook = from(whereToLook)

  if (Array.isArray(whatToLookFor)) {
    whatToLookFor = whatToLookFor.join('')
  }
  whatToLookFor = from(whatToLookFor)

  var foundOne = false // to ensure process stops after first find
  var foundAll = false // to identify full string match
  whereToLook.forEach(function (val1, i1) {
    if (!foundOne) {
      if (whereToLook[i1] === whatToLookFor[0]) {
        whatToLookFor.forEach(function (val2, i2) {
          if (whereToLook[i1 + i2] === whatToLookFor[i2]) {
            foundAll = true
          } else {
            foundAll = false
          }
        })
        if (foundAll === true) {
          i = i1
          foundOne = true
        }
      }
    }
  })
  return i
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
  var arrSource = from(source)

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
    arrSource = from(result)
    if (DEBUG) {
      console.log('\n\n NEW LOOP:')
      console.log('1. starting index = ' + JSON.stringify(index, null, 4))
      console.log('2. starting arrSource.length = ' + JSON.stringify(arrSource.length, null, 4))
      console.log('=========')
      console.log('* we\'ll calculate the foundBeginningIndex now.')
      console.log('3. index = ' + JSON.stringify(index, null, 4))
      console.log('4. arrSource.slice(index) = ' + JSON.stringify(arrSource.slice(index), null, 4))
      console.log('5. astralAwareSearch(arrSource.slice(index).join(\'\'), o.searchFor) = ' + JSON.stringify(astralAwareSearch(arrSource.slice(index).join(''), o.searchFor), null, 4))
    }
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
    if (DEBUG) {
      console.log('6. after searching, foundBeginningIndex = ' + JSON.stringify(foundBeginningIndex, null, 4))
      console.log('=========')
    }
    if (foundBeginningIndex >= 0) {
      if (DEBUG) {
        console.log('if foundBeginningIndex >= 0 <<< IF CLAUSE')
        console.log('7. foundEndingIndex was equal to: ' + JSON.stringify(foundEndingIndex, null, 4))
        console.log('8. NEW foundEndingIndex = foundBeginningIndex + from(o.searchFor).length = ' + JSON.stringify(foundBeginningIndex + from(o.searchFor).length, null, 4))
      }
      foundEndingIndex = foundBeginningIndex + from(o.searchFor).length
      index = foundEndingIndex
    } else {
      if (DEBUG) {
        console.log('9. if foundBeginningIndex >= 0 <<< ELSE CLAUSE')
        console.log('index = ' + JSON.stringify(index, null, 4))
        console.log('index = arrSource.length = ' + JSON.stringify(arrSource.length, null, 4))
      }
      index = arrSource.length
      // return result
    }
    var matched
    // =====================================
    // check the leftMaybe:
    if (DEBUG) {
      console.log('=========')
      console.log('leftMaybe:')
    }
    if ((o.leftMaybe !== undefined) && (o.leftMaybe !== '')) {
      // commence the leftMaybe check
      if (DEBUG) {
        console.log('commencing')
      }
      matched = true
      if (DEBUG) {
        console.log('forEach loop:')
      }
      from(o.leftMaybe).forEach(function (elem, i) {
        if (DEBUG) {
          console.log('elem = ' + JSON.stringify(elem, null, 4))
          console.log('i = ' + JSON.stringify(i, null, 4))
        }
        if (elem !== arrSource[foundBeginningIndex - from(o.leftMaybe).length + i]) {
          matched = false
          if (DEBUG) {
            console.log('matched = false')
          }
        } else {
          if (DEBUG) {
            console.log('matched stays true')
          }
        }
      })
      if (matched) {
        if (DEBUG) {
          console.log('if (matched):')
          console.log('old foundBeginningIndex: ' + foundBeginningIndex)
        }
        foundBeginningIndex -= from(o.leftMaybe).length
        if (DEBUG) {
          console.log('foundBeginningIndex -= from(o.leftMaybe).length >>>> ' + foundBeginningIndex)
        }
      } else {
        if (DEBUG) {
          console.log('>>> foundBeginningIndex stays the same: ' + foundBeginningIndex)
        }
      }
    }
    // =====================================
    // check the rightMaybe:
    if (DEBUG) {
      console.log('=========')
      console.log('rightMaybe:')
    }
    if ((o.rightMaybe !== undefined) && (o.rightMaybe !== '')) {
      // commence the rightMaybe check
      if (DEBUG) {
        console.log('commencing')
      }
      matched = true
      if (DEBUG) {
        console.log('forEach loop:')
      }
      from(o.rightMaybe).forEach(function (elem, i) {
        if (DEBUG) {
          console.log('elem = ' + JSON.stringify(elem, null, 4))
          console.log('i = ' + JSON.stringify(i, null, 4))
        }
        if (elem !== arrSource[foundEndingIndex + i]) {
          matched = false
          if (DEBUG) {
            console.log('matched = false')
          }
        } else {
          if (DEBUG) {
            console.log('matched stays true')
          }
        }
      })
      if (matched) {
        if (DEBUG) {
          console.log('if (matched):')
          console.log('old foundEndingIndex: ' + foundEndingIndex)
        }
        foundEndingIndex += from(o.rightMaybe).length
        if (DEBUG) {
          console.log('foundEndingIndex += from(o.rightMaybe).length >>>> ' + foundEndingIndex)
        }
      } else {
        if (DEBUG) {
          console.log('>>> foundEndingIndex stays the same: ' + foundEndingIndex)
        }
      }
    }
    // =====================================
    // check the leftOutside:
    if (DEBUG) {
      console.log('=========')
      console.log('leftOutside:')
    }
    if ((o.leftOutside !== undefined) && (o.leftOutside !== '')) {
      // commence the leftOutside check
      if (DEBUG) {
        console.log('commencing')
        console.log('forEach loop:')
      }
      from(o.leftOutside).forEach(function (elem, i) {
        if (DEBUG) {
          console.log('elem = ' + JSON.stringify(elem, null, 4))
          console.log('i = ' + JSON.stringify(i, null, 4))
        }
        if (elem !== arrSource[foundBeginningIndex - from(o.leftOutside).length + i]) {
          foundBeginningIndex = -1
          foundEndingIndex = -1
        }
      })
    }
    // =====================================
    // check the rightOutside:
    if (DEBUG) {
      console.log('=========')
      console.log('rightOutside:')
    }
    if ((o.rightOutside !== undefined) && (o.rightOutside !== '')) {
      // commence the rightOutside check
      if (DEBUG) {
        console.log('commencing')
        console.log('forEach loop:')
      }
      from(o.rightOutside).forEach(function (elem, i) {
        if (DEBUG) {
          console.log('elem = ' + JSON.stringify(elem, null, 4))
          console.log('i = ' + JSON.stringify(i, null, 4))
        }
        if (elem !== arrSource[foundEndingIndex + i]) {
          foundBeginningIndex = -1
          foundEndingIndex = -1
        }
      })
    }
    // =====================================
    // check the leftOutsideNot:
    if (DEBUG) {
      console.log('=========')
      console.log('leftOutsideNot:')
    }
    if ((o.leftOutsideNot !== undefined) && (o.leftOutsideNot !== '')) {
      // commence the leftOutsideNot check
      if (DEBUG) {
        console.log('commencing')
        console.log('forEach loop:')
      }
      from(o.leftOutsideNot).forEach(function (elem, i) {
        if (DEBUG) {
          console.log('elem = ' + JSON.stringify(elem, null, 4))
          console.log('i = ' + JSON.stringify(i, null, 4))
        }
        if (elem === arrSource[foundBeginningIndex - from(o.leftOutsideNot).length + i]) {
          foundBeginningIndex = -1
          foundEndingIndex = -1
        }
      })
    }
    // =====================================
    // check the rightOutsideNot:
    if (DEBUG) {
      console.log('=========')
      console.log('rightOutsideNot:')
    }
    if ((o.rightOutsideNot !== undefined) && (o.rightOutsideNot !== '')) {
      // commence the rightOutsideNot check
      if (DEBUG) {
        console.log('commencing')
        console.log('forEach loop:')
      }
      from(o.rightOutsideNot).forEach(function (elem, i) {
        if (DEBUG) {
          console.log('elem = ' + JSON.stringify(elem, null, 4))
          console.log('i = ' + JSON.stringify(i, null, 4))
        }
        if (elem === arrSource[foundEndingIndex + i]) {
          foundBeginningIndex = -1
          foundEndingIndex = -1
        }
      })
    }
    // =====================================
    // replace
    if (DEBUG) {
      console.log('=========')
      console.log('replace part:')
      console.log('IF will compare if neither != -1 now:')
      console.log('foundBeginningIndex = ' + JSON.stringify(foundBeginningIndex, null, 4))
      console.log('foundEndingIndex = ' + JSON.stringify(foundEndingIndex, null, 4))
    }

    if ((foundBeginningIndex !== -1) && (foundEndingIndex !== -1)) {
      if (DEBUG) {
        console.log('* it\'s true, so we recalculate the result')
        console.log('result = "' + arrSource.slice(0, foundBeginningIndex).join('') + '" + "' + replacement + '" + "' + arrSource.slice(foundEndingIndex).join('') + '" = ' + arrSource.slice(0, foundBeginningIndex).join('') + replacement + arrSource.slice(foundEndingIndex).join(''))
      }

      result = arrSource.slice(0, foundBeginningIndex).join('') + replacement + arrSource.slice(foundEndingIndex).join('')
      index = arrSource.slice(0, foundBeginningIndex).join('').length + from(replacement).length
      if (DEBUG) {
        console.log('FOUND. New result = ' + JSON.stringify(result, null, 4) + '; new index = ' + index)
      }
    }
  }
  if (DEBUG) {
    console.log('=========')
    console.log('VERY FINAL result = ' + JSON.stringify(result, null, 4))
  }
  return result
}
