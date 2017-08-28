const replace = require('lodash.replace')
const without = require('lodash.without')
const flattenDeep = require('lodash.flattendeep')

/**
 * stringExtractClassNames - extracts CSS classes/id names (like `.class-name`) from things like:
 * div.class-name:active a
 * or from:
 * tag .class-name::after
 *
 * @param  {String} input                input string
 * @return {Array}                       each detected class/id put into an array
 */

function stringExtractClassNames (input) {
  if (input === undefined) {
    throw new Error()
  }
  var temp = ''
  function chopBeginning (str) {
    // everything up to the first full stop or hash
    return replace(str, /[^.#]*/m, '')
  }
  function chopEnding (str) {
    // ~!@$%^&*()+=,./';:"?><[]\{}|`# ++++ space char
    return replace(str, /[ ~\\!@$%^&*()+=,/';:"?><[\]\\{}|`].*/g, '')
  }
  function existy (x) { return x != null }
  input = input.replace(/[\0'"\\\n\r\v\t\b\f]/g, ' ')
  temp = input.split(/([.#])/)
  // now each full stop or hash are put as a separate element.
  // let's join them back to the next element that follows them
  temp.forEach(function (el, i) {
    if (el === '.' || el === '#') {
      if (existy(temp[i + 1])) {
        temp[i + 1] = el + temp[i + 1]
      }
      temp[i] = ''
    }
  })
  temp.forEach(function (el, i) {
    temp[i] = without(chopEnding(chopBeginning(temp[i])).split(/([.#][^.#]*)/), '')
  })
  temp = flattenDeep(temp)
  // finally, remove all class names that are not according to spec (1 char length etc)
  temp = without(temp, '.', '#')
  return temp
}

module.exports = stringExtractClassNames
