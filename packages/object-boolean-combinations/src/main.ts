import {
  deepClone as clone,
  isPlainObject as isObj,
  type Obj,
} from "codsen-utils";
import { version as v } from "../package.json";

const version: string = v;

export interface BoolObj {
  [key: string]: boolean;
}

function defineEnumerableDataProperty(
  target: Obj,
  key: string,
  value: unknown,
): void {
  Object.defineProperty(target, key, {
    configurable: true,
    enumerable: true,
    value,
    writable: true,
  });
}

function combinations(input: Obj, Override: undefined | Obj = {}): Obj[] {
  // CHECKS
  // ======

  if (!input) {
    throw new Error(
      "object-boolean-combinations/combinations(): [THROW_ID_01] missing input object",
    );
  }
  if (!isObj(input)) {
    throw new Error(
      "object-boolean-combinations/combinations(): [THROW_ID_02] the first input object must be a plain object",
    );
  }
  if (Override && !isObj(Override)) {
    throw new Error(
      "object-boolean-combinations/combinations(): [THROW_ID_03] the second override object must be a plain object",
    );
  }

  // START
  // =====

  const inputKeys = Object.keys(input);
  const inputKeySet = new Set(inputKeys);
  const propertiesToBeOverridden = Object.keys(Override).filter((key) =>
    inputKeySet.has(key),
  );
  const overriddenKeySet = new Set(propertiesToBeOverridden);
  const propertiesToMix = inputKeys.filter((key) => !overriddenKeySet.has(key));
  // Clone only the part of the input that is ever returned. The input object's
  // values are intentionally ignored; only its keys define the combinations.
  const overrideObject = propertiesToBeOverridden.length
    ? clone(Override)
    : null;

  // Build each output directly instead of first allocating an equally large
  // matrix of zeroes and ones.
  const combinationsCount = 2 ** propertiesToMix.length;
  const outgoingObjectsArray: Obj[] = new Array(combinationsCount);
  if (!inputKeySet.has("__proto__")) {
    // Preserve the branch-free common path: this loop is the package's hot
    // work and normally assigns hundreds of ordinary keys per call.
    for (
      let combinationIndex = 0;
      combinationIndex < combinationsCount;
      combinationIndex++
    ) {
      const result: Obj = {};
      for (let keyIndex = 0; keyIndex < propertiesToMix.length; keyIndex++) {
        result[propertiesToMix[keyIndex]] =
          (combinationIndex & (1 << keyIndex)) !== 0;
      }
      if (overrideObject) {
        for (const key of propertiesToBeOverridden) {
          result[key] = overrideObject[key];
        }
      }
      outgoingObjectsArray[combinationIndex] = result;
    }
  } else {
    for (
      let combinationIndex = 0;
      combinationIndex < combinationsCount;
      combinationIndex++
    ) {
      const result: Obj = {};
      for (let keyIndex = 0; keyIndex < propertiesToMix.length; keyIndex++) {
        const key = propertiesToMix[keyIndex];
        const value = (combinationIndex & (1 << keyIndex)) !== 0;
        if (key === "__proto__") {
          defineEnumerableDataProperty(result, key, value);
        } else {
          result[key] = value;
        }
      }
      if (overrideObject) {
        for (const key of propertiesToBeOverridden) {
          if (key === "__proto__") {
            defineEnumerableDataProperty(result, key, overrideObject[key]);
          } else {
            result[key] = overrideObject[key];
          }
        }
      }
      outgoingObjectsArray[combinationIndex] = result;
    }
  }

  // RETURN
  // ======

  return outgoingObjectsArray;
}

export { combinations, version };
