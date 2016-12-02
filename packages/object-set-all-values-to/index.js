'use strict'

// ===================================
// R E Q U I R E' S

var isPlainObject = require('lodash.isplainobject')

// ===================================
// F U N C T I O N S

/**
 * setAllValuesTo - sets all keys of all plain objects (no matter how deep-nested) to a certain value
 *
 * @param  {Whatever} obj incoming object, array or whatever
 * @return {Object}       returned object
 */
function setAllValuesTo (input, value) {
  if (value !== null) {
    value = value || false
  }
  if (Array.isArray(input)) {
    input.forEach(function (el, i) {
      if (isPlainObject(input[i]) || Array.isArray(input[i])) {
        input[i] = setAllValuesTo(input[i], value)
      }
    })
  } else if (isPlainObject(input)) {
    Object.keys(input).forEach(function (key) {
      if (Array.isArray(input[key]) || isPlainObject(input[key])) {
        input[key] = setAllValuesTo(input[key], value)
      } else {
        input[key] = value
      }
    })
  }
  return input
}

module.exports = setAllValuesTo
