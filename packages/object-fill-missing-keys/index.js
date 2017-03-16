'use strict'

// ===================================
// V A R S

var clone = require('lodash.clonedeep')
var type = require('type-detect')

// ===================================
// F U N C T I O N S

function isObj (something) { return type(something) === 'Object' }
function isArr (something) { return Array.isArray(something) }
function isStr (something) { return type(something) === 'string' }

/**
 * sortObject - sorts object's keys
 *
 * @param  {Object} obj input object
 * @return {Object}     sorted object
 */
function sortObject (obj) {
  return Object.keys(obj).sort().reduce(function (result, key) {
    result[key] = obj[key]
    return result
  }, {})
}

/**
 * fillMissingKeys - Like "_.merge" except it treats different-type values correctly.
 * its aim is to retain as much data after merge and work with AST's from parsed JSON
 *
 * @param  {object} incompleteObj     input object
 * @param  {object} schemaObj         schema object which contains desired keys set
 * @return {object} normalised object
 */
function fillMissingKeys (originalIncompleteObj, originalSchemaObj) {
  if (arguments.length === 0) {
    return
  }
  if (!isObj(originalIncompleteObj) || !isObj(originalSchemaObj)) {
    return
  }
  var incompleteObj = clone(originalIncompleteObj)
  var schemaObj = clone(originalSchemaObj)

  Object.keys(schemaObj).forEach(function (key) {
    if (!incompleteObj.hasOwnProperty(key)) {
      incompleteObj[key] = schemaObj[key]
    } else {
      if (Array.isArray(schemaObj[key])) {
        if (!isArr(incompleteObj[key])) {
          incompleteObj[key] = schemaObj[key]
        } else {
          // both arrays
          incompleteObj[key].forEach(function (e, i) {
            incompleteObj[key][i] = sortObject(fillMissingKeys(incompleteObj[key][i], schemaObj[key][0]))
          })
        }
      } else if (isObj(schemaObj[key]) && isStr(incompleteObj[key])) {
        incompleteObj[key] = schemaObj[key]
      }
    }
  })
  return sortObject(incompleteObj)
}

module.exports = fillMissingKeys
