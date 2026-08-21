/* eslint @typescript-eslint/explicit-module-boundary-types: 0 */

import {
  formatDiagnosticValue,
  isDate,
  isPlainObject as isObj,
  isRegExp,
} from "codsen-utils";

import { version as v } from "../package.json";

const version: string = v;

export interface Opts {
  arraysMustNotContainPlaceholders: boolean;
}
const defaults: Opts = {
  arraysMustNotContainPlaceholders: true,
};

const hasOwn = Object.prototype.hasOwnProperty;
const dateGetTime = Date.prototype.getTime;
const regexpSourceGetter = Object.getOwnPropertyDescriptor(
  RegExp.prototype,
  "source",
)?.get as (this: RegExp) => string;
const regexpFlagsGetter = Object.getOwnPropertyDescriptor(
  RegExp.prototype,
  "flags",
)?.get as (this: RegExp) => string;

function isEqual(left: any, right: any): boolean {
  if (left === right) {
    return true;
  }
  if (
    left === null ||
    right === null ||
    typeof left !== "object" ||
    typeof right !== "object"
  ) {
    return Number.isNaN(left) && Number.isNaN(right);
  }
  if (isDate(left) || isDate(right)) {
    if (!isDate(left) || !isDate(right)) {
      return false;
    }
    const leftTime = dateGetTime.call(left);
    const rightTime = dateGetTime.call(right);
    return (
      leftTime === rightTime ||
      (Number.isNaN(leftTime) && Number.isNaN(rightTime))
    );
  }
  if (isRegExp(left) || isRegExp(right)) {
    return (
      isRegExp(left) &&
      isRegExp(right) &&
      regexpSourceGetter.call(left) === regexpSourceGetter.call(right) &&
      regexpFlagsGetter.call(left) === regexpFlagsGetter.call(right)
    );
  }
  if (Array.isArray(left) || Array.isArray(right)) {
    if (
      !Array.isArray(left) ||
      !Array.isArray(right) ||
      left.length !== right.length
    ) {
      return false;
    }
    for (let i = left.length; i--; ) {
      if (!isEqual(left[i], right[i])) {
        return false;
      }
    }
    return true;
  }
  if (!isObj(left) || !isObj(right)) {
    return false;
  }

  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);
  if (leftKeys.length !== rightKeys.length) {
    return false;
  }
  for (let i = leftKeys.length; i--; ) {
    const key = leftKeys[i];
    if (!hasOwn.call(right, key) || !isEqual(left[key], right[key])) {
      return false;
    }
  }
  return true;
}

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
      input.some((el) => isEqual(el, value))
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
  return isEqual(input, value);
}

// T H E   E X P O S E D   W R A P P E R   F U N C T I O N
// -----------------------------------------------------------------------------
// we use this wrapper function because there will be recursive calls and it would
// be a waste of resources to perform the input checks each time within recursion

function allEq(input: any, value: any, opts?: Partial<Opts>): boolean {
  // precautions:
  if (input === undefined) {
    throw new Error(
      "object-all-values-equal-to/allEq(): [THROW_ID_01] The first input is undefined! Please provide the first argument.",
    );
  }
  if (value === undefined) {
    throw new Error(
      "object-all-values-equal-to/allEq(): [THROW_ID_02] The second input is undefined! Please provide the second argument.",
    );
  }
  if (opts && !isObj(opts)) {
    throw new Error(
      `object-all-values-equal-to/allEq(): [THROW_ID_03] The third argument, options object, was given not as a plain object but as a ${typeof opts}, equal to:\n${formatDiagnosticValue(opts, 4)}`,
    );
  }

  // prep resolvedOpts
  let resolvedOpts: Opts = { ...defaults, ...opts };

  // and finally,
  return allValuesEqualTo(input, value, resolvedOpts);
}

export { allEq, defaults, version };
