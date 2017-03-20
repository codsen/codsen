'use strict'

// ===================================
// V A R S

var clone = require('lodash.clonedeep')
var type = require('type-detect')
var merge = require('object-merge-advanced')

// ===================================
// F U N C T I O N S

function isObj (something) { return type(something) === 'Object' }
function isArr (something) { return Array.isArray(something) }
function isStr (something) { return type(something) === 'string' }

/**
 * sort - sorts object's keys
 *
 * @param  {Object} obj input object
 * @return {Object}     sorted object
 */
function sort (obj) {
  if (isObj(obj)) {
    return Object.keys(obj).sort().reduce(function (result, key) {
      result[key] = obj[key]
      return result
    }, {})
  } else {
    return obj
  }
}

function fillMissingKeys (originalIncomplete, originalSchema) {
  if (arguments.length === 0) {
    return
  }
  if (type(originalIncomplete) !== type(originalSchema)) {
    return
  }
  var incomplete = clone(originalIncomplete)
  var schema = clone(originalSchema)

  if (isObj(incomplete) && isObj(schema)) {
    // both are objects
    Object.keys(schema).forEach(function (key) {
      if (!incomplete.hasOwnProperty(key)) {
        // if key is missing, simply add it:
        incomplete[key] = schema[key]
      } else {
        // obj key clash
        // console.log('\n=======\n')
        // console.log('incomplete[key] = ' + JSON.stringify(incomplete[key], null, 4))
        // console.log('schema[key] = ' + JSON.stringify(schema[key], null, 4))

        if (isStr(incomplete[key]) && isStr(schema[key])) {
          // nothing
        } else if (!isArr(incomplete[key]) || (isArr(incomplete[key]) && incomplete[key].length === 0)) {
          incomplete[key] = merge(incomplete[key], schema[key])
        } else {
          // console.log('zzzz')
          incomplete[key] = fillMissingKeys(incomplete[key], schema[key])
        }
        // console.log('incomplete[key] = ' + JSON.stringify(incomplete[key], null, 4))
      }
    })
  } else if (isArr(incomplete) && isArr(schema)) {
    // both are arrays
    incomplete.forEach(function (el, i) {
      incomplete[i] = sort(fillMissingKeys(incomplete[i], schema[0]))
    })
  }// else {
    // both are probably strings
  //   incomplete = schema
  // }

  return sort(incomplete)
}

module.exports = fillMissingKeys
