var replace = require('lodash.replace')
var without = require('lodash.without')

/**
 * stringExtractClassNames - extracts CSS classes/id names (like `.class-name`) from things like:
 * div.class-name:active a
 * or from:
 * tag .class-name::after
 *
 * @param  {String} input                input string
 * @return {Array}                       each detected class/id within array
 */
function stringExtractClassNames (input) {
  if (input === undefined) {
    throw new Error()
  }

  function chopBeginning (str) {
    // everything up to the first full stop of hash
    return replace(str, /[^.#]*/m, '')
  }

  function chopEnding (str) {
    // ~!@$%^&*()+=,./';:"?><[]\{}|`# ++++ space char
    return replace(str, /[ \~\\!@$%^&\*\(\)\+\=,/';\:"?><[\]\\{}|`].*/g, '')
  }

  return without(chopEnding(chopBeginning(input)).split(/([.#][^.#]*)/), '')
}

module.exports = stringExtractClassNames
