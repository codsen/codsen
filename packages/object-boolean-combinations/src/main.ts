import {
  deepClone as clone,
  isPlainObject as isObj,
} from "codsen-utils";
import { version as v } from "../package.json";

const version: string = v;

export interface UnknownValueObject {
  [key: string]: unknown;
}

/** A combination row when no values are pinned through an override. */
export type BoolObj = Record<string, boolean>;

export type BooleanCombination<Input extends UnknownValueObject> = {
  -readonly [Key in keyof Input as Key extends string | number
    ? Key
    : never]: boolean;
};

export type Combination<
  Input extends UnknownValueObject,
  Override extends UnknownValueObject | undefined,
> = Override extends UnknownValueObject
  ? {
      -readonly [Key in keyof Input as Key extends string | number
        ? Key
        : never]: Key extends keyof Override
        ? Record<never, never> extends Pick<Override, Key>
          ? boolean | Override[Key]
          : Override[Key]
        : boolean;
    }
  : BooleanCombination<Input>;

const maxEagerCombinations = 16_384;

function defineEnumerableDataProperty(
  target: UnknownValueObject,
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

/**
 * Generates every supported boolean combination of the input object's own
 * enumerable string keys.
 *
 * Override values are cloned once per call. Cloneable nested objects are
 * detached from the caller, while functions retain their identity. The rows
 * share the resulting fixed values with one another.
 */
function combinations<
  Input extends UnknownValueObject,
  Override extends UnknownValueObject | undefined = undefined,
>(input: Input, Override?: Override): Combination<Input, Override>[];
function combinations(
  input: UnknownValueObject,
  Override: undefined | UnknownValueObject = {},
): UnknownValueObject[] {
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
  if (!isObj(Override)) {
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
  // Clone the selected values as one graph. The array keeps repeated-reference
  // and cycle relationships intact without reading unrelated override keys.
  const overrideValues = propertiesToBeOverridden.length
    ? clone(propertiesToBeOverridden.map((key) => Override[key]))
    : null;

  // Build each output directly instead of first allocating an equally large
  // matrix of zeroes and ones.
  const combinationsCount = 2 ** propertiesToMix.length;
  if (combinationsCount > maxEagerCombinations) {
    const requestedRows = Number.isSafeInteger(combinationsCount)
      ? `${combinationsCount} rows (2^${propertiesToMix.length})`
      : `2^${propertiesToMix.length} rows`;
    throw new Error(
      `object-boolean-combinations/combinations(): [THROW_ID_04] ${propertiesToMix.length} unpinned keys would create ${requestedRows}, above the supported maximum of ${maxEagerCombinations}. Pin more keys through the override object.`,
    );
  }
  const outgoingObjectsArray: UnknownValueObject[] = new Array(
    combinationsCount,
  );
  if (!inputKeySet.has("__proto__")) {
    // Preserve the branch-free common path: this loop is the package's hot
    // work and normally assigns hundreds of ordinary keys per call.
    for (
      let combinationIndex = 0;
      combinationIndex < combinationsCount;
      combinationIndex++
    ) {
      const result: UnknownValueObject = {};
      for (let keyIndex = 0; keyIndex < propertiesToMix.length; keyIndex++) {
        result[propertiesToMix[keyIndex]] =
          (combinationIndex & (1 << keyIndex)) !== 0;
      }
      if (overrideValues) {
        for (let keyIndex = 0; keyIndex < propertiesToBeOverridden.length; keyIndex++) {
          result[propertiesToBeOverridden[keyIndex]] = overrideValues[keyIndex];
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
      const result: UnknownValueObject = {};
      for (let keyIndex = 0; keyIndex < propertiesToMix.length; keyIndex++) {
        const key = propertiesToMix[keyIndex];
        const value = (combinationIndex & (1 << keyIndex)) !== 0;
        if (key === "__proto__") {
          defineEnumerableDataProperty(result, key, value);
        } else {
          result[key] = value;
        }
      }
      if (overrideValues) {
        for (let keyIndex = 0; keyIndex < propertiesToBeOverridden.length; keyIndex++) {
          const key = propertiesToBeOverridden[keyIndex];
          if (key === "__proto__") {
            defineEnumerableDataProperty(result, key, overrideValues[keyIndex]);
          } else {
            result[key] = overrideValues[keyIndex];
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
