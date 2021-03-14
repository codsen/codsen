/**
 * object-boolean-combinations
 * Consumes a defaults object with booleans, generates all possible variations of it
 * Version: 4.0.8
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

var version$1 = "4.0.8";

var version = version$1;
function combinations(originalIncomingObject, originalOverrideObject) {
  if (originalOverrideObject === void 0) {
    originalOverrideObject = {};
  }
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
  }
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
  var overrideObject = clone__default['default'](originalOverrideObject);
  var propertiesToMix = Object.keys(incomingObject);
  var outcomingObjectsArray = [];
  var propertiesToBeOverridden = [];
  if (isObj__default['default'](overrideObject) && Object.keys(overrideObject).length) {
    propertiesToBeOverridden = intersection__default['default'](Object.keys(overrideObject), Object.keys(incomingObject));
    propertiesToBeOverridden.forEach(function (elem) {
      return pull__default['default'](propertiesToMix, elem);
    });
  }
  var boolCombinations = combi(Object.keys(propertiesToMix).length);
  var tempObject;
  boolCombinations.forEach(function (_elem1, index1) {
    tempObject = {};
    propertiesToMix.forEach(function (elem2, index2) {
      tempObject[elem2] = boolCombinations[index1][index2] === 1;
    });
    outcomingObjectsArray.push(tempObject);
  });
  if (isObj__default['default'](overrideObject) && Object.keys(overrideObject).length) {
    outcomingObjectsArray.forEach(function (elem3) {
      return propertiesToBeOverridden.forEach(function (elem4) {
        elem3[elem4] = overrideObject[elem4];
      });
    });
  }
  return outcomingObjectsArray;
}

exports.combinations = combinations;
exports.version = version;
