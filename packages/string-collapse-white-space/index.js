'use strict'
const checkTypes = require('check-types-mini/es5')
const isObj = require('lodash.isplainobject')
const replaceSlicesArr = require('string-replace-slices-array/es5')
const Slices = require('string-slices-array-push/es5')

function collapse (str, opts) {
  if (typeof str !== 'string') {
    throw new Error('string-collapse-white-space/collapse(): [THROW_ID_01] The input is not string but ' + typeof str + ', equal to: ' + JSON.stringify(str, null, 4))
  }
  if ((opts !== undefined) && (opts !== null) && (!isObj(opts))) {
    throw new Error('string-collapse-white-space/collapse(): [THROW_ID_02] The opts is not a plain object but ' + typeof str + ', equal to:\n' + JSON.stringify(str, null, 4))
  }
  if (str.length === 0) {
    return ''
  }

  var finalIndexesToDelete = new Slices()

  // declare defaults, so we can enforce types later:
  const defaults = {
    trimStart: true, // otherwise, leading whitespace will be collapsed to a single space
    trimEnd: true, // otherwise, trailing whitespace will be collapsed to a single space
    dontTouchLeadingWhiteSpace: false, // if true, leading whitespace won't be touched. Overrides trimStart.
    dontTouchTrailingWhiteSpace: false // if true, trailing whitespace won't be touched. Overrides trimEnd.
  }

  // fill any settings with defaults if missing:
  opts = Object.assign({}, defaults, opts)

  // the check:
  checkTypes(opts, defaults, {msg: 'string-collapse-white-space/collapse(): [THROW_ID_03*]'})

// -----------------------------------------------------------------------------

  var res
  var endingIndex = null

  // looping backwards for better efficiency
  for (var i = str.length; i--;) {
    // catch empty space
    if (str[i].trim() === '') {
      if (endingIndex === null) {
        // take a note of the index
        endingIndex = i
      }
    }
    // catch non-empty space
    if (str[i].trim() !== '') {
      if (endingIndex !== null) { // this means character before whitespace has been reached
        // put it up for deletion later
        //
        // now the beginning and ending potentiallly needs a different treatments:
        if (endingIndex === (str.length - 1)) {
          if (!opts.dontTouchTrailingWhiteSpace) {
            finalIndexesToDelete.add(i + 1, endingIndex + (opts.trimEnd ? 1 : 0))
          }
        } else {
          // if more than one whitespace character was traversed
          if ((endingIndex - i) > 1) {
            finalIndexesToDelete.add(i + 1, endingIndex)
          }
        }
        // reset the flag
        endingIndex = null
      }
    }
    // catch the beginning of the string, last character in our iteration:
    if ((i === 0) && (endingIndex !== null)) {
      if (!opts.dontTouchLeadingWhiteSpace) {
        finalIndexesToDelete.add(0, endingIndex + (opts.trimStart ? 1 : 0))
      }
      endingIndex = null
    }
  }

  if (finalIndexesToDelete.current()) {
    res = replaceSlicesArr(str, finalIndexesToDelete.current())
    finalIndexesToDelete.wipe()
    return res
  } else {
    return str
  }
}

module.exports = collapse
