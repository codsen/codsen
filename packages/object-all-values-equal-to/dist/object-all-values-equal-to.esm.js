/**
 * object-all-values-equal-to
 * Does the AST/nested-plain-object/array/whatever contain only one kind of value?
 * Version: 2.0.9
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/object-all-values-equal-to/
 */

import isObj from 'lodash.isplainobject';
import isEq from 'lodash.isequal';

var version$1 = "2.0.9";

const version = version$1;
function allValuesEqualTo(input, value, opts) {
  if (Array.isArray(input)) {
    if (input.length === 0) {
      return true;
    }
    if (opts.arraysMustNotContainPlaceholders && input.length > 0 && input.some(el => isEq(el, value))) {
      return false;
    }
    for (let i = input.length; i--;) {
      if (!allValuesEqualTo(input[i], value, opts)) {
        return false;
      }
    }
    return true;
  }
  if (isObj(input)) {
    const keys = Object.keys(input);
    if (keys.length === 0) {
      return true;
    }
    for (let i = keys.length; i--;) {
      if (!allValuesEqualTo(input[keys[i]], value, opts)) {
        return false;
      }
    }
    return true;
  }
  return isEq(input, value);
}
function allEq(inputOriginal, valueOriginal, originalOpts) {
  if (inputOriginal === undefined) {
    throw new Error("object-all-values-equal-to: [THROW_ID_01] The first input is undefined! Please provide the first argument.");
  }
  if (valueOriginal === undefined) {
    throw new Error("object-all-values-equal-to: [THROW_ID_02] The second input is undefined! Please provide the second argument.");
  }
  if (originalOpts && !isObj(originalOpts)) {
    throw new Error(`object-all-values-equal-to: [THROW_ID_03] The third argument, options object, was given not as a plain object but as a ${typeof originalOpts}, equal to:\n${JSON.stringify(originalOpts, null, 4)}`);
  }
  const defaults = {
    arraysMustNotContainPlaceholders: true
  };
  const opts = { ...defaults,
    ...originalOpts
  };
  return allValuesEqualTo(inputOriginal, valueOriginal, opts);
}

export { allEq, version };
