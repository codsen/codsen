/**
 * object-boolean-combinations
 * Consumes a defaults object with booleans, generates all possible variations of it
 * Version: 4.0.6
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/object-boolean-combinations/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var intersection = require('lodash.intersection');
var pull = require('lodash.pull');
var isObj = require('lodash.isplainobject');
var clone = require('lodash.clonedeep');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var intersection__default = /*#__PURE__*/_interopDefaultLegacy(intersection);
var pull__default = /*#__PURE__*/_interopDefaultLegacy(pull);
var isObj__default = /*#__PURE__*/_interopDefaultLegacy(isObj);
var clone__default = /*#__PURE__*/_interopDefaultLegacy(clone);

var version$1 = "4.0.6";

/* eslint no-bitwise:0, @typescript-eslint/explicit-module-boundary-types:0, @typescript-eslint/ban-types:0 */
var version = version$1;

function combinations(originalIncomingObject, originalOverrideObject) {
  if (originalOverrideObject === void 0) {
    originalOverrideObject = {};
  }

  //
  // FUNCTIONS
  // =========
  function combi(n) {
    var r = [];

    for (var i = 0; i < 1 << n; i++) {
      var c = [];

      for (var j = 0; j < n; j++) {
        c.push(i & 1 << j ? 1 : 0);
      }

      r.push(c);
    }

    return r;
  } // CHECKS
  // ======


  if (!originalIncomingObject) {
    throw new Error("[THROW_ID_01] missing input object");
  }

  if (!isObj__default['default'](originalIncomingObject)) {
    throw new Error("[THROW_ID_02] the first input object must be a true object");
  }

  if (originalOverrideObject && !isObj__default['default'](originalOverrideObject)) {
    throw new Error("[THROW_ID_03] the second override object must be a true object");
  }

  var incomingObject = clone__default['default'](originalIncomingObject);
  var overrideObject = clone__default['default'](originalOverrideObject); // START
  // =====

  var propertiesToMix = Object.keys(incomingObject);
  var outcomingObjectsArray = [];
  var propertiesToBeOverridden = []; // if there's override, prepare an alternative (a subset) array propertiesToMix
  // ----------------------------------------------------------------------------

  if (isObj__default['default'](overrideObject) && Object.keys(overrideObject).length) {
    // find legitimate properties from the overrideObject:
    // enforce that override object had just a subset of incomingObject properties, nothing else
    propertiesToBeOverridden = intersection__default['default'](Object.keys(overrideObject), Object.keys(incomingObject)); // propertiesToMix = all incoming object's properties MINUS properties to override

    propertiesToBeOverridden.forEach(function (elem) {
      return pull__default['default'](propertiesToMix, elem);
    });
  } // mix up whatever propertiesToMix has came to this point
  // ------------------------------------------------------


  var boolCombinations = combi(Object.keys(propertiesToMix).length);
  var tempObject;
  boolCombinations.forEach(function (_elem1, index1) {
    tempObject = {};
    propertiesToMix.forEach(function (elem2, index2) {
      tempObject[elem2] = boolCombinations[index1][index2] === 1;
    });
    outcomingObjectsArray.push(tempObject);
  }); // if there's override, append the static override values on each property of the
  // propertiesToMix array:
  // ------------------------------------------------------------------------------

  if (isObj__default['default'](overrideObject) && Object.keys(overrideObject).length) {
    outcomingObjectsArray.forEach(function (elem3) {
      return propertiesToBeOverridden.forEach(function (elem4) {
        // eslint-disable-next-line no-param-reassign
        elem3[elem4] = overrideObject[elem4];
      });
    });
  } // RETURN
  // ======


  return outcomingObjectsArray;
}

exports.combinations = combinations;
exports.version = version;
