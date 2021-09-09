/**
 * @name object-boolean-combinations
 * @fileoverview Consumes a defaults object with booleans, generates all possible variations of it
 * @version 5.0.0
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/object-boolean-combinations/}
 */

import intersection from 'lodash.intersection';
import pull from 'lodash.pull';
import isObj from 'lodash.isplainobject';
import clone from 'lodash.clonedeep';

var version$1 = "5.0.0";

const version = version$1;
function combinations(originalIncomingObject, originalOverrideObject = {}) {
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
  }
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
  const overrideObject = clone(originalOverrideObject);
  const propertiesToMix = Object.keys(incomingObject);
  const outcomingObjectsArray = [];
  let propertiesToBeOverridden = [];
  if (isObj(overrideObject) && Object.keys(overrideObject).length) {
    propertiesToBeOverridden = intersection(Object.keys(overrideObject), Object.keys(incomingObject));
    propertiesToBeOverridden.forEach(elem => pull(propertiesToMix, elem));
  }
  const boolCombinations = combi(Object.keys(propertiesToMix).length);
  let tempObject;
  boolCombinations.forEach((_elem1, index1) => {
    tempObject = {};
    propertiesToMix.forEach((elem2, index2) => {
      tempObject[elem2] = boolCombinations[index1][index2] === 1;
    });
    outcomingObjectsArray.push(tempObject);
  });
  if (isObj(overrideObject) && Object.keys(overrideObject).length) {
    outcomingObjectsArray.forEach(elem3 => propertiesToBeOverridden.forEach(elem4 => {
      elem3[elem4] = overrideObject[elem4];
    }));
  }
  return outcomingObjectsArray;
}

export { combinations, version };
