'use strict'

function within (str) {
  if (typeof str !== 'string') {
    throw new Error('email-all-chars-within-ascii/within(): [THROW_ID_01] The input is not string but ' + typeof str + ', equal to: ' + JSON.stringify(str, null, 4))
  }
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
      throw new Error(`email-all-chars-within-ascii: Non ascii character found at index ${i}, equal to: ${str[i]}, its decimal code point is ${str[i].codePointAt(0)}.`)
    }
  }
}

module.exports = within
