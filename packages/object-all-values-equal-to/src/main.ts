/* eslint @typescript-eslint/explicit-module-boundary-types: 0 */

import isObj from "lodash.isplainobject";
import isEq from "lodash.isequal";

import { version as v } from "../package.json";

const version: string = v;

interface Opts {
  arraysMustNotContainPlaceholders: boolean;
}
const defaults: Opts = {
  arraysMustNotContainPlaceholders: true,
};

// T H E   M A I N   F U N C T I O N   T H A T   D O E S   T H E   J O B
// -----------------------------------------------------------------------------
function allValuesEqualTo(input: any, value: any, opts: Opts): boolean {
  if (Array.isArray(input)) {
    if (input.length === 0) {
      return true;
    }
    if (
      opts.arraysMustNotContainPlaceholders &&
      input.length > 0 &&
      input.some((el) => isEq(el, value))
    ) {
      return false;
    }
    // so at this point
    // backwards traversal for increased performance:
    for (let i = input.length; i--; ) {
      if (!allValuesEqualTo(input[i], value, opts)) {
        return false;
      }
    }
    return true;
  }
  if (isObj(input)) {
    let keys = Object.keys(input);
    if (keys.length === 0) {
      return true;
    }
    for (let i = keys.length; i--; ) {
      if (!allValuesEqualTo(input[keys[i]], value, opts)) {
        return false;
      }
    }
    return true;
  }
  return isEq(input, value);
}

// T H E   E X P O S E D   W R A P P E R   F U N C T I O N
// -----------------------------------------------------------------------------
// we use this wrapper function because there will be recursive calls and it would
// be a waste of resources to perform the input checks each time within recursion

function allEq(
  inputOriginal: any,
  valueOriginal: any,
  originalOpts?: Partial<Opts>
): boolean {
  // precautions:
  if (inputOriginal === undefined) {
    throw new Error(
      "object-all-values-equal-to: [THROW_ID_01] The first input is undefined! Please provide the first argument."
    );
  }
  if (valueOriginal === undefined) {
    throw new Error(
      "object-all-values-equal-to: [THROW_ID_02] The second input is undefined! Please provide the second argument."
    );
  }
  if (originalOpts && !isObj(originalOpts)) {
    throw new Error(
      `object-all-values-equal-to: [THROW_ID_03] The third argument, options object, was given not as a plain object but as a ${typeof originalOpts}, equal to:\n${JSON.stringify(
        originalOpts,
        null,
        4
      )}`
    );
  }

  // prep opts
  let opts: Opts = { ...defaults, ...originalOpts };

  // and finally,
  return allValuesEqualTo(inputOriginal, valueOriginal, opts);
}

export { allEq, defaults, version };
