var replace = require('lodash.replace')
var isString = require('lodash.isstring')

/**
 * stringExtractClassNames - extracts CSS classes/id names (like `.class-name`) from things like:
 * div.class-name:active a
 * or from:
 * tag .class-name::after
 *
 * @param  {String} str                  input string
 * @param  {String} chopUpToNotIncluding dot or hash
 * @return {String}                      output string
 */
function stringExtractClassNames (str, chopUpToNotIncluding) {
  function chopOffTheRest (str) {
    // CSS class stops where any of the following starts:
    // ~!@$%^&*()+=,./';:"?><[]\{}|`# ++++ space char
    return replace(str, /[ \~\\!@$%^&\*\(\)\+\=,\./';\:"?><[\]\\{}|`#].*/g, '')
  }

  function aContainsB (a, b) {
    return a.indexOf(b) >= 0
  }

  chopUpToNotIncluding = chopUpToNotIncluding || '.'
  if (!isString(chopUpToNotIncluding) || !isString(str)) {
    throw new TypeError('First input must be string, second (string) is optional.')
  }
  if (aContainsB(str, chopUpToNotIncluding)) {
    str = str.slice(str.indexOf(chopUpToNotIncluding) + 1)
    str = chopUpToNotIncluding + chopOffTheRest(str)
  }
  return str
}

module.exports = stringExtractClassNames
