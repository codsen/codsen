'use strict'
var intersection = require('lodash.intersection')
var pull = require('lodash.pull')
var isObject = require('lodash.isplainobject')
var clone = require('lodash.clonedeep')

/**
 * Creates an n-length array with all possible combinations of true/false
 * @param {number} input integer
 * @returns {Array} Array of arrays each containing one possible combination of true/false
 * @private modified http://stackoverflow.com/a/26610870
 */
function combinations (n) {
  var r = []
  for (var i = 0; i < (1 << n); i++) {
    var c = []
    for (var j = 0; j < n; j++) {
      c.push(i & (1 << j) ? 'true' : 'false')
    }
    r.push(c)
  }
  return r
}
// ===================================

function existy (x) { return x != null }

/**
 * Checks if input is a true Object (checking against null and Array)
 * @param {Object} a reference object to use the properties from. Values don't matter. For example, {a:true, b:true, c:false}
 * @param [Object] an optional override object. For example, you want all properties "a" to be true – pass {a:true}
 * @returns {Array} of objects with all possible combinations optionally including override. In our examle, an array of 2^(3-1) objects, each containing a:true. Without override we would have got 2^3 objects array
 */
function objectBooleanCombinations (originalIncomingObject, originalOverrideObject) {
  var incomingObject = clone(originalIncomingObject)
  var overrideObject = clone(originalOverrideObject)
  var outcomingObjectsArray = []
  // ===================================
  // checks

  if (!existy(incomingObject)) {
    throw new Error('missing input object')
  }
  if (!isObject(incomingObject)) {
    throw new Error('the first input object must be a true object')
  }
  if (existy(overrideObject) && !isObject(overrideObject)) {
    throw new Error('the second override object must be a true object')
  }
  var propertiesToMix = Object.keys(incomingObject)

  // ===================================
  // if there's override, prepare an alternative (a subset) array propertiesToMix

  if (existy(overrideObject) && isObject(overrideObject)) {
    // check overrideObject's contents - must be Boolean:
    Object.keys(overrideObject).forEach(function (elem5) {
      if (typeof overrideObject[elem5] !== 'boolean') {
        throw new Error('override object must contain only Boolean values')
      }
    })
  }

  var override = false
  if (existy(overrideObject) && (Object.keys(overrideObject).length !== 0)) {
    override = true
  }

  if (override) {
    // find legitimate properties from the overrideObject:
    // enforce that override object had just a subset of incomingObject properties, nothing else
    var propertiesToBeOverridden = intersection(Object.keys(overrideObject), Object.keys(incomingObject))
    // propertiesToMix = all incoming object's properties MINUS properties to override
    propertiesToBeOverridden.forEach(function (elem) {
      pull(propertiesToMix, elem)
    })
  }

  // ===================================
  // mix up whatever propertiesToMix has came to this point

  var boolCombinations = combinations(Object.keys(propertiesToMix).length)
  var tempObject = {}
  boolCombinations.forEach(function (elem1, index1) {
    tempObject = {}
    propertiesToMix.forEach(function (elem2, index2) {
      tempObject[elem2] = (boolCombinations[index1][index2] === 'true')
    })
    outcomingObjectsArray.push(tempObject)
  })

  // ===================================
  // if there's override, append the static override values on each property of the propertiesToMix array:
  if (override) {
    outcomingObjectsArray.forEach(function (elem3) {
      propertiesToBeOverridden.forEach(function (elem4) {
        elem3[elem4] = overrideObject[elem4]
      })
    })
  }

  return outcomingObjectsArray
}

module.exports = objectBooleanCombinations
