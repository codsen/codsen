'use strict'
const checkTypes = require('check-types-mini')
const isObj = require('lodash.isplainobject')

function within (str, opts) {
  if (typeof str !== 'string') {
    throw new Error('email-all-chars-within-ascii/within(): [THROW_ID_01] The input is not string but ' + typeof str + ', equal to: ' + JSON.stringify(str, null, 4))
  }
  if ((opts !== undefined) && (opts !== null) && (!isObj(opts))) {
    throw new Error('email-all-chars-within-ascii/within(): [THROW_ID_02] The opts is not a plain object but ' + typeof str + ', equal to:\n' + JSON.stringify(str, null, 4))
  }

  // declare defaults, so we can enforce types later:
  let defaults = {
    messageOnly: false
  }

  // fill any settings with defaults if missing:
  opts = Object.assign({}, defaults, opts)

  // the check:
  checkTypes(opts, defaults, {msg: 'email-all-chars-within-ascii/within(): [THROW_ID_03*]'})

// -----------------------------------------------------------------------------

  // allowed control characters:
  //
  // #9  - HT, horizontal tab
  // #10 - LF, new line
  // #13 - CR, carriage return
  //
  // the rest, below decimal point #32 are not allowed
  // Naturally, above #126 is not allowed. This concerns #127, DEL too!
  // Often #127, DEL, is overlooked, yet it is not good in email.

  for (let i = 0, len = str.length; i < len; i++) {
    if (
      (str[i].codePointAt(0) > 126) ||
      (str[i].codePointAt(0) < 9) ||
      (str[i].codePointAt(0) === 11) ||
      (str[i].codePointAt(0) === 12) ||
      ((str[i].codePointAt(0) > 13) && (str[i].codePointAt(0) < 32))
    ) {
      throw new Error(`${opts.messageOnly ? '' : 'email-all-chars-within-ascii: '}Non ascii character found at index ${i}, equal to: ${str[i]}, its decimal code point is ${str[i].codePointAt(0)}.`)
    }
  }
}

module.exports = within
