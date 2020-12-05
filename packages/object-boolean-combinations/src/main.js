/* eslint no-bitwise:0 */

import intersection from "lodash.intersection";
import pull from "lodash.pull";
import isObject from "lodash.isplainobject";
import clone from "lodash.clonedeep";

/**
 * Checks if input is a true Object (checking against null and Array)
 * @param {Object} a reference object to use the properties from. Values don't
 * matter. For example, {a:true, b:true, c:false}
 * @param [Object] an optional override object. For example, you want all
 * properties 'a' to be true - pass {a:true}
 * @returns {Array} of objects with all possible combinations optionally including
 * override. In our examle, an array of 2^(3-1) objects, each containing a:true.
 * Without override we would have got 2^3 objects array
 */
function objectBooleanCombinations(
  originalIncomingObject,
  originalOverrideObject
) {
  //
  // FUNCTIONS
  // =========

  /**
   * Creates an n-length array with all possible combinations of true/false
   * @param {number} input integer
   * @returns {Array} Array of arrays each containing one possible combination of true/false
   */
  function combinations(n) {
    const r = [];
    for (let i = 0; i < 1 << n; i++) {
      const c = [];
      for (let j = 0; j < n; j++) {
        c.push(i & (1 << j) ? 1 : 0);
      }
      r.push(c);
    }
    return r;
  }

  // VARIABLES
  // =========

  // CHECKS
  // ======

  if (!originalIncomingObject) {
    throw new Error("[THROW_ID_01] missing input object");
  }
  if (!isObject(originalIncomingObject)) {
    throw new Error(
      "[THROW_ID_02] the first input object must be a true object"
    );
  }
  if (originalOverrideObject && !isObject(originalOverrideObject)) {
    throw new Error(
      "[THROW_ID_03] the second override object must be a true object"
    );
  }

  const incomingObject = clone(originalIncomingObject);
  const overrideObject = clone(originalOverrideObject);

  // START
  // =====

  const propertiesToMix = Object.keys(incomingObject);
  const outcomingObjectsArray = [];
  let propertiesToBeOverridden;

  // if there's override, prepare an alternative (a subset) array propertiesToMix
  // ----------------------------------------------------------------------------

  let override = false;
  if (overrideObject && Object.keys(overrideObject).length !== 0) {
    override = true;
  }

  if (override) {
    // find legitimate properties from the overrideObject:
    // enforce that override object had just a subset of incomingObject properties, nothing else
    propertiesToBeOverridden = intersection(
      Object.keys(overrideObject),
      Object.keys(incomingObject)
    );
    // propertiesToMix = all incoming object's properties MINUS properties to override
    propertiesToBeOverridden.forEach((elem) => pull(propertiesToMix, elem));
  }

  // mix up whatever propertiesToMix has came to this point
  // ------------------------------------------------------

  const boolCombinations = combinations(Object.keys(propertiesToMix).length);
  let tempObject = {};
  boolCombinations.forEach((elem1, index1) => {
    tempObject = {};
    propertiesToMix.forEach((elem2, index2) => {
      tempObject[elem2] = boolCombinations[index1][index2] === 1;
    });
    outcomingObjectsArray.push(tempObject);
  });

  // if there's override, append the static override values on each property of the
  // propertiesToMix array:
  // ------------------------------------------------------------------------------
  if (override) {
    outcomingObjectsArray.forEach((elem3) =>
      propertiesToBeOverridden.forEach((elem4) => {
        // eslint-disable-next-line no-param-reassign
        elem3[elem4] = overrideObject[elem4];
      })
    );
  }

  // RETURN
  // ======

  return outcomingObjectsArray;
}

export default objectBooleanCombinations;
