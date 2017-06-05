'use strict'
var isArray = Array.isArray
var isPlainObject = require('lodash.isplainobject')
var isString = something => typeof something === 'string'

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
