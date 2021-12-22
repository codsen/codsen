/* eslint no-bitwise:0, @typescript-eslint/explicit-module-boundary-types:0, @typescript-eslint/ban-types:0 */

import intersection from "lodash.intersection";
import pull from "lodash.pull";
import isObj from "lodash.isplainobject";
import clone from "lodash.clonedeep";

import { version as v } from "../package.json";

const version: string = v;

interface BoolValueObj {
  [key: string]: boolean;
}
interface UnknownValueObj {
  [key: string]: any;
}

function combinations(
  originalIncomingObject: UnknownValueObj,
  originalOverrideObject: undefined | UnknownValueObj = {}
): BoolValueObj[] {
  //
  // FUNCTIONS
  // =========

  // Creates an n-length array with all possible combinations of true/false
  type Combi = number[][];

  function combi(n: number): Combi {
    let r = [];
    for (let i = 0; i < 1 << n; i++) {
      let c = [];
      for (let j = 0; j < n; j++) {
        c.push(i & (1 << j) ? 1 : 0);
      }
      r.push(c);
    }
    return r;
  }

  // CHECKS
  // ======

  if (!originalIncomingObject) {
    throw new Error("[THROW_ID_01] missing input object");
  }
  if (!isObj(originalIncomingObject)) {
    throw new Error(
      "[THROW_ID_02] the first input object must be a true object"
    );
  }
  if (originalOverrideObject && !isObj(originalOverrideObject)) {
    throw new Error(
      "[THROW_ID_03] the second override object must be a true object"
    );
  }

  let incomingObject = clone(originalIncomingObject);
  let overrideObject = clone(originalOverrideObject);

  // START
  // =====

  let propertiesToMix = Object.keys(incomingObject);
  let outcomingObjectsArray: BoolValueObj[] = [];
  let propertiesToBeOverridden: string[] = [];

  // if there's override, prepare an alternative (a subset) array propertiesToMix
  // ----------------------------------------------------------------------------

  if (isObj(overrideObject) && Object.keys(overrideObject).length) {
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

  let boolCombinations = combi(Object.keys(propertiesToMix).length);

  let tempObject: BoolValueObj;
  boolCombinations.forEach((_elem1, index1) => {
    tempObject = {};
    propertiesToMix.forEach((elem2, index2) => {
      tempObject[elem2] = boolCombinations[index1][index2] === 1;
    });
    outcomingObjectsArray.push(tempObject);
  });

  // if there's override, append the static override values on each property of the
  // propertiesToMix array:
  // ------------------------------------------------------------------------------
  if (isObj(overrideObject) && Object.keys(overrideObject).length) {
    outcomingObjectsArray.forEach((elem3) => {
      propertiesToBeOverridden.forEach((elem4) => {
        // eslint-disable-next-line no-param-reassign
        elem3[elem4] = overrideObject[elem4];
      });
    });
  }

  // RETURN
  // ======

  return outcomingObjectsArray;
}

export { combinations, version };
