'use strict'
var isString = require('lodash.isstring')
var isArray = Array.isArray
var isPlainObject = require('lodash.isplainobject')

/**
 * nonEmpty - tells, is input empty thing or not
 *
 * @param  {Array||PlainObject||String}  input
 * @return {Boolean}                     is it empty or not
 */
function nonEmpty (input) {
  if (arguments.length === 0 || input === undefined) {
    return
  }
  if (isArray(input) || isString(input)) {
    return input.length > 0
  } else if (isPlainObject(input)) {
    return Object.keys(input).length > 0
  } else {
    return false
  }
}

module.exports = nonEmpty
