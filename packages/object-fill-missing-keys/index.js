'use strict'

// ===================================
// V A R S

var isObj = require('lodash.isplainobject')
var clone = require('lodash.clonedeep')

// ===================================
// F U N C T I O N S

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
  if (!isObj(originalIncompleteObj) || !isObj(originalSchemaObj)) {
    return
  }
  var incompleteObj = clone(originalIncompleteObj)
  var schemaObj = clone(originalSchemaObj)
  Object.keys(schemaObj).forEach(function (key) {
    if ((incompleteObj[key] === undefined) || (incompleteObj[key] === false)) {
      incompleteObj[key] = schemaObj[key]
    }
    if (Array.isArray(schemaObj[key]) && Array.isArray(incompleteObj[key])) {
      incompleteObj[key].forEach(function (e, i) {
        incompleteObj[key][i] = sortObject(fillMissingKeys(incompleteObj[key][i], schemaObj[key][0]))
      })
    }
  })
  return sortObject(incompleteObj)
}

module.exports = fillMissingKeys
