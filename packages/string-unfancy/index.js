'use strict'

const he = require('he')
function existy (x) { return x != null }

function unfancy (str) {
  const CHARS = {
    '\u00B4': `'`,
    '\u02BB': `'`,
    '\u02BC': `'`,
    '\u02BD': `'`,
    '\u02C8': `'`,
    '\u02B9': `'`,
    '\u0312': `'`,
    '\u0313': `'`,
    '\u0314': `'`,
    '\u0315': `'`,
    '\u02BA': `"`,
    '\u201C': `"`,
    '\u201D': `"`,
    '\u2012': `-`,
    '\u2013': `-`,
    '\u2014': `-`,
    '\u2018': `'`,
    '\u2019': `'`,
    '\u2026': `...`,
    '\u2212': `-`,
    '\uFE49': `-`,
    '\u00A0': ' '
  }
  if (!existy(str) || typeof str !== 'string') {
    return
  }
  // decode anticipating multiple encoding
  while (he.decode(str) !== str) {
    str = he.decode(str)
  }
  let arr = Array.from(str)

  for (let i = 0, len = arr.length; i < len; i++) {
    if (CHARS.hasOwnProperty(arr[i])) {
      arr[i] = CHARS[arr[i]]
    }
  }
  return arr.join('')
}

module.exports = unfancy
