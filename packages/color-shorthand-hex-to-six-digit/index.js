var r = require('hex-color-regex')
var isPlainObject = require('lodash.isplainobject')
var isString = require('lodash.isstring')
var isArray = Array.isArray

function convert (input) {
  // f's
  function toFullHex (hex) {
    // console.log('received: ' + JSON.stringify(hex, null, 4))
    if ((hex.length === 4) && (hex.charAt(0) === '#')) {
      hex = '#' + hex.charAt(1) + hex.charAt(1) + hex.charAt(2) + hex.charAt(2) + hex.charAt(3) + hex.charAt(3)
    }
    return hex
  }
  function toLowerCase (match) {
    return match.toLowerCase()
  }
  // action
  if (isString(input)) {
    input = input.replace(r(), toFullHex)
    input = input.replace(r(), toLowerCase)
  } else if (isArray(input)) {
    for (var i = 0, len = input.length; i < len; i++) {
      input[i] = convert(input[i])
    }
  } else if (isPlainObject(input)) {
    Object.keys(input).forEach(function (key) {
      input[key] = convert(input[key])
    })
  }
  return input
}

module.exports = convert
