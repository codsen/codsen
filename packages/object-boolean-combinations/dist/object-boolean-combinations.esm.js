/**
 * object-boolean-combinations
 * Consumes a defaults object with booleans, generates all possible variations of it
 * Version: 4.0.6
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/object-boolean-combinations/
 */

import intersection from 'lodash.intersection';
import pull from 'lodash.pull';
import isObj from 'lodash.isplainobject';
import clone from 'lodash.clonedeep';

var version$1 = "4.0.6";

/* eslint no-bitwise:0, @typescript-eslint/explicit-module-boundary-types:0, @typescript-eslint/ban-types:0 */
const version = version$1;

function combinations(originalIncomingObject, originalOverrideObject = {}) {
  //
  // FUNCTIONS
  // =========
  function combi(n) {
    const r = [];

    for (let i = 0; i < 1 << n; i++) {
      const c = [];

      for (let j = 0; j < n; j++) {
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

  if (!isObj(originalIncomingObject)) {
    throw new Error("[THROW_ID_02] the first input object must be a true object");
  }

  if (originalOverrideObject && !isObj(originalOverrideObject)) {
    throw new Error("[THROW_ID_03] the second override object must be a true object");
  }

  const incomingObject = clone(originalIncomingObject);
  const overrideObject = clone(originalOverrideObject); // START
  // =====

  const propertiesToMix = Object.keys(incomingObject);
  const outcomingObjectsArray = [];
  let propertiesToBeOverridden = []; // if there's override, prepare an alternative (a subset) array propertiesToMix
  // ----------------------------------------------------------------------------

  if (isObj(overrideObject) && Object.keys(overrideObject).length) {
    // find legitimate properties from the overrideObject:
    // enforce that override object had just a subset of incomingObject properties, nothing else
    propertiesToBeOverridden = intersection(Object.keys(overrideObject), Object.keys(incomingObject)); // propertiesToMix = all incoming object's properties MINUS properties to override

    propertiesToBeOverridden.forEach(elem => pull(propertiesToMix, elem));
  } // mix up whatever propertiesToMix has came to this point
  // ------------------------------------------------------


  const boolCombinations = combi(Object.keys(propertiesToMix).length);
  let tempObject;
  boolCombinations.forEach((_elem1, index1) => {
    tempObject = {};
    propertiesToMix.forEach((elem2, index2) => {
      tempObject[elem2] = boolCombinations[index1][index2] === 1;
    });
    outcomingObjectsArray.push(tempObject);
  }); // if there's override, append the static override values on each property of the
  // propertiesToMix array:
  // ------------------------------------------------------------------------------

  if (isObj(overrideObject) && Object.keys(overrideObject).length) {
    outcomingObjectsArray.forEach(elem3 => propertiesToBeOverridden.forEach(elem4 => {
      // eslint-disable-next-line no-param-reassign
      elem3[elem4] = overrideObject[elem4];
    }));
  } // RETURN
  // ======


  return outcomingObjectsArray;
}

export { combinations, version };
