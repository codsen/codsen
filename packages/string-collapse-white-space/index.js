const checkTypes = require('check-types-mini/es5')
const isObj = require('lodash.isplainobject')
const replaceSlicesArr = require('string-replace-slices-array/es5')
const Slices = require('string-slices-array-push/es5')

function collapse(str, originalOpts) {
  if (typeof str !== 'string') {
    throw new Error(`string-collapse-white-space/collapse(): [THROW_ID_01] The input is not string but ${typeof str}, equal to: ${JSON.stringify(str, null, 4)}`)
  }
  if ((originalOpts !== undefined) && (originalOpts !== null) && (!isObj(originalOpts))) {
    throw new Error(`string-collapse-white-space/collapse(): [THROW_ID_02] The opts is not a plain object but ${typeof originalOpts}, equal to:\n${JSON.stringify(originalOpts, null, 4)}`)
  }
  if (str.length === 0) {
    return ''
  }

  let finalIndexesToDelete = new Slices()

  // declare defaults, so we can enforce types later:
  const defaults = {
    trimStart: true, // otherwise, leading whitespace will be collapsed to a single space
    trimEnd: true, // otherwise, trailing whitespace will be collapsed to a single space
    trimLines: false, // activates trim per-line basis
    trimnbsp: false, // non-breaking spaces are trimmed too
  }

  // fill any settings with defaults if missing:
  const opts = Object.assign({}, defaults, originalOpts)

  // the check:
  checkTypes(opts, defaults, { msg: 'string-collapse-white-space/collapse(): [THROW_ID_03*]' })

  // -----------------------------------------------------------------------------

  let res
  let spacesEndAt = null
  let whiteSpaceEndsAt = null
  let lineWhiteSpaceEndsAt = null
  let endingOfTheLine = false

  // looping backwards for better efficiency
  for (let i = str.length; i--;) {
    // space clauses
    if (str[i] === ' ') { // it's a space character
      if (spacesEndAt === null) {
        spacesEndAt = i
      }
    } else if (spacesEndAt !== null) {
      // it's not a space character
      // if we have a sequence of spaces, this character terminates that sequence
      if ((i + 1) !== spacesEndAt) {
        finalIndexesToDelete.add(i + 1, spacesEndAt)
      }
      spacesEndAt = null
    }

    // white space clauses
    if (
      (str[i].trim() === '') &&
      (
        (!opts.trimnbsp && (str[i] !== '\xa0')) ||
        opts.trimnbsp
      )
    ) { // it's some sort of white space character, but not a non-breaking space
      if (whiteSpaceEndsAt === null) {
        whiteSpaceEndsAt = i
      }
      // line trimming:
      if ((str[i] !== '\n') && (str[i] !== '\r') && (lineWhiteSpaceEndsAt === null)) {
        lineWhiteSpaceEndsAt = i + 1
      }
      if ((str[i] === '\n') || (str[i] === '\r')) {
        if (lineWhiteSpaceEndsAt !== null) {
          if (opts.trimLines) {
            finalIndexesToDelete.add(i + 1, lineWhiteSpaceEndsAt)
          }
          lineWhiteSpaceEndsAt = null
        }
        if ((str[i - 1] !== '\n') && (str[i - 1] !== '\r')) {
          lineWhiteSpaceEndsAt = i
          endingOfTheLine = true
        }
      }
    } else { // it's not white space character
      if (whiteSpaceEndsAt !== null) {
        if (
          ((i + 1) !== whiteSpaceEndsAt + 1) &&
          (
            ((whiteSpaceEndsAt === (str.length - 1)) && opts.trimEnd)
          )
        ) {
          finalIndexesToDelete.add(i + 1, whiteSpaceEndsAt + 1)
        }
        whiteSpaceEndsAt = null
      }

      // encountered letter resets line trim counters:
      if (lineWhiteSpaceEndsAt !== null) {
        if (endingOfTheLine && opts.trimLines) {
          endingOfTheLine = false // apply either way
          finalIndexesToDelete.add(i + 1, lineWhiteSpaceEndsAt)
        }
        lineWhiteSpaceEndsAt = null
      }
    }

    // this chunk could be ported to the (str[i].trim() === '') clause for example,
    // but it depends on the flags that it's else is setting, (whiteSpaceEndsAt !== null)
    // therefore it's less code if we put zero index clauses here.
    if (i === 0) {
      if ((whiteSpaceEndsAt !== null) && opts.trimStart) {
        finalIndexesToDelete.add(0, whiteSpaceEndsAt + 1)
      } else if (spacesEndAt !== null) {
        finalIndexesToDelete.add(i + 1, spacesEndAt + 1)
      }
    }
  }

  // apply the ranges
  if (finalIndexesToDelete.current()) {
    res = replaceSlicesArr(str, finalIndexesToDelete.current())
    finalIndexesToDelete.wipe()
    finalIndexesToDelete = undefined // putting up our class for garbage collector
    return res
  }
  return str
}

module.exports = collapse
