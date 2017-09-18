/* eslint consistent-return: 0 */

const { isArray } = Array
const isPlainObject = require('lodash.isplainobject')

const isString = something => typeof something === 'string'

function nonEmpty(input) {
  if (arguments.length === 0 || input === undefined) {
    return
  } else if (isArray(input) || isString(input)) {
    return input.length > 0
  } else if (isPlainObject(input)) {
    return Object.keys(input).length > 0
  }
  return false
}

module.exports = nonEmpty
