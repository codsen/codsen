/**
 * object-boolean-combinations
 * Consumes a defaults object with booleans, generates all possible variations of it
 * Version: 2.12.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/object-boolean-combinations/
 */

import intersection from 'lodash.intersection';
import pull from 'lodash.pull';
import isObject from 'lodash.isplainobject';
import clone from 'lodash.clonedeep';

function objectBooleanCombinations(
  originalIncomingObject,
  originalOverrideObject
) {
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
  function existy(x) {
    return x != null;
  }
  if (!existy(originalIncomingObject)) {
    throw new Error("[THROW_ID_01] missing input object");
  }
  if (!isObject(originalIncomingObject)) {
    throw new Error(
      "[THROW_ID_02] the first input object must be a true object"
    );
  }
  if (existy(originalOverrideObject) && !isObject(originalOverrideObject)) {
    throw new Error(
      "[THROW_ID_03] the second override object must be a true object"
    );
  }
  const incomingObject = clone(originalIncomingObject);
  const overrideObject = clone(originalOverrideObject);
  const propertiesToMix = Object.keys(incomingObject);
  const outcomingObjectsArray = [];
  let propertiesToBeOverridden;
  let override = false;
  if (existy(overrideObject) && Object.keys(overrideObject).length !== 0) {
    override = true;
  }
  if (override) {
    propertiesToBeOverridden = intersection(
      Object.keys(overrideObject),
      Object.keys(incomingObject)
    );
    propertiesToBeOverridden.forEach((elem) => pull(propertiesToMix, elem));
  }
  const boolCombinations = combinations(Object.keys(propertiesToMix).length);
  let tempObject = {};
  boolCombinations.forEach((elem1, index1) => {
    tempObject = {};
    propertiesToMix.forEach((elem2, index2) => {
      tempObject[elem2] = boolCombinations[index1][index2] === 1 ? 1 : 0;
    });
    outcomingObjectsArray.push(tempObject);
  });
  if (override) {
    outcomingObjectsArray.forEach((elem3) =>
      propertiesToBeOverridden.forEach((elem4) => {
        elem3[elem4] = overrideObject[elem4];
      })
    );
  }
  return outcomingObjectsArray;
}

export default objectBooleanCombinations;
