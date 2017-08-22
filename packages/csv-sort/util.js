'use strict'
var currencies = require('currency-symbol-map/map.js')
var isNumeric = require('is-numeric')

function findtype (something) {
  if (typeof something !== 'string') {
    throw new Error('csv-sort/util/findtype(): input must be string! Currently it\'s: ' + typeof something)
  }
  if (isNumeric(something)) {
    return 'numeric'
  } else if (Object.keys(currencies).some(currencyMarking => {
    // We remove all known currency symbols one by one from this input string.
    // If at least one passes as numeric after the currency symbol-removing, it's numeric.
    return isNumeric(something.replace(currencies[currencyMarking], '').replace(/[,.]/g, ''))
  })) {
    return 'numeric'
  } else if (something.trim().length === 0) {
    return 'empty'
  } else {
    return 'text'
  }
}

module.exports = { findtype }
