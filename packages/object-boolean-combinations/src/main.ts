/* eslint no-bitwise:0, @typescript-eslint/explicit-module-boundary-types:0, @typescript-eslint/ban-types:0 */

import { isPlainObject as isObj, Obj, intersection } from "codsen-utils";
import rfdc from "rfdc";
import { version as v } from "../package.json";

const clone = rfdc();
const version: string = v;

export interface BoolObj {
  [key: string]: boolean;
}

function combinations(input: Obj, Override: undefined | Obj = {}): Obj[] {
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

  if (!input) {
    throw new Error("[THROW_ID_01] missing input object");
  }
  if (!isObj(input)) {
    throw new Error(
      "[THROW_ID_02] the first input object must be a plain object",
    );
  }
  if (Override && !isObj(Override)) {
    throw new Error(
      "[THROW_ID_03] the second override object must be a plain object",
    );
  }

  let incomingObject = clone(input);
  let overrideObject = clone(Override);

  // START
  // =====

  let propertiesToMix = Object.keys(incomingObject);
  let outgoingObjectsArray: Obj[] = [];
  let propertiesToBeOverridden: string[] = [];

  // if there's override, prepare an alternative (a subset) array propertiesToMix
  // ----------------------------------------------------------------------------

  if (isObj(overrideObject) && Object.keys(overrideObject).length) {
    // find legitimate properties from the overrideObject:
    // enforce that override object had just a subset of incomingObject properties, nothing else
    propertiesToBeOverridden = intersection(
      Object.keys(overrideObject),
      Object.keys(incomingObject),
    );
    // propertiesToMix = all incoming object's properties MINUS properties to override
    propertiesToMix = propertiesToMix.filter(
      (val) => !propertiesToBeOverridden.includes(val),
    );
  }

  // mix up whatever propertiesToMix has came to this point
  // ------------------------------------------------------

  let boolCombinations = combi(Object.keys(propertiesToMix).length);

  let tempObject: BoolObj;
  boolCombinations.forEach((_el1, index1) => {
    tempObject = {};
    propertiesToMix.forEach((el2, index2) => {
      tempObject[el2] = boolCombinations[index1][index2] === 1;
    });
    outgoingObjectsArray.push(tempObject);
  });

  // if there's override, append the static override values on each property of the
  // propertiesToMix array:
  // ------------------------------------------------------------------------------
  if (isObj(overrideObject) && Object.keys(overrideObject).length) {
    outgoingObjectsArray.forEach((el3) => {
      propertiesToBeOverridden.forEach((el4) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        el3[el4] = overrideObject[el4];
      });
    });
  }

  // RETURN
  // ======

  return outgoingObjectsArray;
}

export { combinations, version };
