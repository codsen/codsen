'use strict';
var _ = require('lodash');
/*jslint bitwise: true */

/**
 * Creates an n-length array with all possible combinations of true/false
 * @param {number} input integer
 * @returns {Array} Array of arrays each containing one possible combination of true/false
 * @private modified http://stackoverflow.com/a/26610870
 */
function combinations(n) {
  var r = [];
  for (var i = 0; i < (1 << n); i++) {
    var c = [];
    for (var j = 0; j < n; j++) {
      c.push(i & (1 << j) ? 'true' : 'false');
    }
    r.push(c);
  }
  return r;
}
// ===================================

/**
 * Checks if input is a true Object (checking against null and Array)
 * @param {Object} or not object ;)
 * @returns {Boolean} explaining is it Object or not
 */
function isObject(item) {
  return (typeof item === 'object' && !Array.isArray(item) && item !== null);
}

/**
 * Checks if input is a true Object (checking against null and Array)
 * @param {Object} a reference object to use the properties from. Values don't matter. For example, {a:true, b:true, c:false}
 * @param [Object] an optional override object. For example, you want all properties "a" to be true – pass {a:true}
 * @returns {Array} of objects with all possible combinations optionally including override. In our examle, an array of 2^(3-1) objects, each containing a:true. Without override we would have got 2^3 objects array
 */
function objectBooleanCombinations(incomingObject, overrideObject) {
  var outcomingObjectsArray = [];
  if (incomingObject === void 0) {
    throw 'missing input object';
  }
  if (!isObject(incomingObject)) {
    throw 'input must be a true object';
  }
  var propertiesToMix = _.keys(incomingObject);

  // ===================================
  // if there's override, prepare an alternative (a subset) array propertiesToMix

  if ((overrideObject !== void 0) && !isObject(overrideObject)) {
    throw 'override object must be a true object and nothing else';
  }
  if ((overrideObject !== void 0) && isObject(overrideObject)) {
    // check overrideObject's contents - must be Boolean:
    Object.keys(overrideObject).forEach(function(elem5){
      if (typeof overrideObject[elem5] !== 'boolean'){
        throw 'override object must contain only Boolean values';
      }
    });
  }

  var override = false;
  if ((overrideObject !== void 0) && (Object.keys(overrideObject).length !== 0)) {
    override = true;
  }

  if (override) {
    // find legitimate properties from the overrideObject:
    // enforce that override object had just a subset of incomingObject properties, nothing else
    var propertiesToBeOverridden = _.intersection(Object.keys(overrideObject), Object.keys(incomingObject));
    // propertiesToMix = all incoming object's properties MINUS properties to override
    propertiesToBeOverridden.forEach(function (elem) {
      _.pull(propertiesToMix, elem);
    });

  }

  // ===================================
  // mix up whatever propertiesToMix has came to this point

  var boolCombinations = combinations(Object.keys(propertiesToMix).length);
  var tempObject = {};
  boolCombinations.forEach(function (elem1, index1) {
    tempObject = {};
    propertiesToMix.forEach(function (elem2, index2) {
      tempObject[elem2] = (boolCombinations[index1][index2] === 'true');
    });
    outcomingObjectsArray.push(tempObject);
  });

  // ===================================
  // if there's override, append the static override values on each property of the propertiesToMix array:
  if (override) {
    outcomingObjectsArray.forEach(function (elem3) {
      propertiesToBeOverridden.forEach(function (elem4) {
        elem3[elem4] = overrideObject[elem4];
      });
    });
  }

  return outcomingObjectsArray;
}

module.exports = objectBooleanCombinations;
