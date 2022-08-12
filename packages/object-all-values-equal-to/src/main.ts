/* eslint @typescript-eslint/explicit-module-boundary-types: 0 */

import isObj from "lodash.isplainobject";
import isEq from "lodash.isequal";

import { version as v } from "../package.json";

const version: string = v;

export interface Opts {
  arraysMustNotContainPlaceholders: boolean;
}
const defaults: Opts = {
  arraysMustNotContainPlaceholders: true,
};

// T H E   M A I N   F U N C T I O N   T H A T   D O E S   T H E   J O B
// -----------------------------------------------------------------------------
function allValuesEqualTo(input: any, value: any, resolvedOpts: Opts): boolean {
  if (Array.isArray(input)) {
    if (input.length === 0) {
      return true;
    }
    if (
      resolvedOpts.arraysMustNotContainPlaceholders &&
      input.length &&
      input.some((el) => isEq(el, value))
    ) {
      return false;
    }
    // so at this point
    // backwards traversal for increased performance:
    for (let i = input.length; i--; ) {
      if (!allValuesEqualTo(input[i], value, resolvedOpts)) {
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
      if (!allValuesEqualTo(input[keys[i]], value, resolvedOpts)) {
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

function allEq(input: any, value: any, opts?: Partial<Opts>): boolean {
  // precautions:
  if (input === undefined) {
    throw new Error(
      "object-all-values-equal-to: [THROW_ID_01] The first input is undefined! Please provide the first argument."
    );
  }
  if (value === undefined) {
    throw new Error(
      "object-all-values-equal-to: [THROW_ID_02] The second input is undefined! Please provide the second argument."
    );
  }
  if (opts && !isObj(opts)) {
    throw new Error(
      `object-all-values-equal-to: [THROW_ID_03] The third argument, options object, was given not as a plain object but as a ${typeof opts}, equal to:\n${JSON.stringify(
        opts,
        null,
        4
      )}`
    );
  }

  // prep resolvedOpts
  let resolvedOpts: Opts = { ...defaults, ...opts };

  // and finally,
  return allValuesEqualTo(input, value, resolvedOpts);
}

export { allEq, defaults, version };
