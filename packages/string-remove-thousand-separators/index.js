'use strict'

const repl = require('string-replace-slices-array')
const Slices = require('string-slices-array-push')
const isObj = require('lodash.isplainobject')
const checkTypes = require('check-types-mini')
const isNum = require('is-numeric')
const trimChars = require('lodash.trim')

function remSep (str, opts) {
  // vars
  var allOK = true // used to bail somewhere down the line. It's a killswitch.
  const knownSeparatorsArray = ['.', ',', '\'', ' ']
  var firstSeparator

  // validation
  if (typeof str !== 'string') {
    throw new TypeError(`string-remove-thousand-separators/remSep(): [THROW_ID_01] Input must be string! Currently it's: ${typeof str}, equal to:\n${JSON.stringify(str, null, 4)}`)
  }
  if ((opts !== undefined) && (opts !== null) && !isObj(opts)) {
    throw new TypeError(`string-remove-thousand-separators/remSep(): [THROW_ID_02] Options object must be a plain object! Currently it's: ${typeof opts}, equal to:\n${JSON.stringify(opts, null, 4)}`)
  }

  // prep opts
  var defaults = {
    padSingleDecimalPlaceNumbers: true,
    forceUKStyle: false
  }
  opts = Object.assign({}, defaults, opts)
  checkTypes(opts, defaults, {msg: 'string-remove-thousand-separators/remSep(): [THROW_ID_03*]'})

  // trim whitespace and wrapping double quotes:
  str = trimChars(str.trim(), '"')

  // end sooner if it's an empty string:
  if (str === '') {
    return str
  }

  // we'll manage the TO-DELETE string slice ranges using this:
  var rangesToDelete = new Slices()

  // traverse the string indexes
  for (let i = 0, len = str.length; i < len; i++) {
    // -------------------------------------------------------------------------
    // catch empty space for Russian-style thousand separators (spaces):
    if (str[i].trim() === '') {
      rangesToDelete.add(i, i + 1)
    }
    // -------------------------------------------------------------------------
    // catch single quotes for Swiss-style thousand separators:
    // (safe to delete instantly because they're not commas or dots)
    if (str[i] === '\'') {
      rangesToDelete.add(i, i + 1)
    }
    // -------------------------------------------------------------------------
    // catch thousand separators
    if (knownSeparatorsArray.includes(str[i])) {
      // check three characters to the right
      if (
        (str[i + 1] !== undefined) &&
        isNum(str[i + 1])
      ) {
        if (str[i + 2] !== undefined) {
          if (isNum(str[i + 2])) {
            //
            // thousands separator followed by two digits...
            if (str[i + 3] !== undefined) {
              if (isNum(str[i + 3])) {
                if ((str[i + 4] !== undefined) && (isNum(str[i + 4]))) {
                  // four digits after thousands separator
                  // bail!
                  allOK = false
                  break
                } else {
                  //
                  // thousands separator followed by three digits...
                  // =============
                  // 1. submit for deletion
                  rangesToDelete.add(i, i + 1)

                  // 2. enforce the thousands separator consistency:
                  if (!firstSeparator) {
                    // It's the first encountered thousand separator. Make a record of it.
                    firstSeparator = str[i]
                  } else {
                    // Check against the previous separator. These have to be consistent,
                    // of we'll bail.
                    if (str[i] !== firstSeparator) {
                      // bail!
                      allOK = false
                      break
                    }
                  }
                  //
                  //
                }
              } else {
                // bail!
                allOK = false
                break
              }
            } else {
              //
              // Stuff like "100,01" (Russian notation) or "100.01" (UK notation).
              // A Separator followed by two digits and string ends.
              //
              // If Russian notation:
              if (opts.forceUKStyle && (str[i] === ',')) {
                rangesToDelete.add(i, i + 1, '.')
              }
            }
          } else {
            // stuff like "1,0a" - bail
            allOK = false
            break
          }
        } else {
          // Stuff like "10.1" (UK notation) or "10,1" (Russian notation).
          // Thousands separator followed by only one digit and then string ends.
          // =============
          // Convert Russian notation if requested:
          if (opts.forceUKStyle && (str[i] === ',')) {
            rangesToDelete.add(i, i + 1, '.')
          }
          // Pad it with zero if requested:
          if (opts.padSingleDecimalPlaceNumbers) {
            rangesToDelete.add(i + 2, i + 2, '0')
          }
        }
      }
      // when we have one decimal place, like "100.2", we pad it to two places, like "100.20"
    // -------------------------------------------------------------------------
    } else if (!isNum(str[i])) {
      // catch unrecognised characters,
      // then turn off the killswitch and break the loop
      allOK = false
      break
    }
  }

  if (allOK && rangesToDelete.current()) {
    return repl(str, rangesToDelete.current())
  } else {
    return str
  }
}

module.exports = remSep
