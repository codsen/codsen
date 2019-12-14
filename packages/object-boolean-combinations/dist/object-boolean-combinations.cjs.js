/**
 * object-boolean-combinations
 * Generate an array full of object copies, each containing a unique Boolean value combination. Includes overrides.
 * Version: 2.11.51
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/object-boolean-combinations
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var intersection = _interopDefault(require('lodash.intersection'));
var pull = _interopDefault(require('lodash.pull'));
var isObject = _interopDefault(require('lodash.isplainobject'));
var clone = _interopDefault(require('lodash.clonedeep'));

function objectBooleanCombinations(originalIncomingObject, originalOverrideObject) {
  function combinations(n) {
    var r = [];
    for (var i = 0; i < 1 << n; i++) {
      var c = [];
      for (var j = 0; j < n; j++) {
        c.push(i & 1 << j ? 1 : 0);
      }
      r.push(c);
    }
    return r;
  }
  function existy(x) {
    return x != null;
  }
  if (!existy(originalIncomingObject)) {
    throw new Error("[THROW_ID_01] missing input object");
  }
  if (!isObject(originalIncomingObject)) {
    throw new Error("[THROW_ID_02] the first input object must be a true object");
  }
  if (existy(originalOverrideObject) && !isObject(originalOverrideObject)) {
    throw new Error("[THROW_ID_03] the second override object must be a true object");
  }
  var incomingObject = clone(originalIncomingObject);
  var overrideObject = clone(originalOverrideObject);
  var propertiesToMix = Object.keys(incomingObject);
  var outcomingObjectsArray = [];
  var propertiesToBeOverridden;
  var override = false;
  if (existy(overrideObject) && Object.keys(overrideObject).length !== 0) {
    override = true;
  }
  if (override) {
    propertiesToBeOverridden = intersection(Object.keys(overrideObject), Object.keys(incomingObject));
    propertiesToBeOverridden.forEach(function (elem) {
      return pull(propertiesToMix, elem);
    });
  }
  var boolCombinations = combinations(Object.keys(propertiesToMix).length);
  var tempObject = {};
  boolCombinations.forEach(function (elem1, index1) {
    tempObject = {};
    propertiesToMix.forEach(function (elem2, index2) {
      tempObject[elem2] = boolCombinations[index1][index2] === 1 ? 1 : 0;
    });
    outcomingObjectsArray.push(tempObject);
  });
  if (override) {
    outcomingObjectsArray.forEach(function (elem3) {
      return propertiesToBeOverridden.forEach(function (elem4) {
        elem3[elem4] = overrideObject[elem4];
      });
    });
  }
  return outcomingObjectsArray;
}

module.exports = objectBooleanCombinations;
