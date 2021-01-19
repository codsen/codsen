/**
 * object-all-values-equal-to
 * Does the AST/nested-plain-object/array/whatever contain only one kind of value?
 * Version: 1.9.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/object-all-values-equal-to/
 */

import isObj from 'lodash.isplainobject';
import isEq from 'lodash.isequal';

var version = "1.9.1";

/* eslint @typescript-eslint/explicit-module-boundary-types: 0 */
const version$1 = version; // T H E   M A I N   F U N C T I O N   T H A T   D O E S   T H E   J O B
// -----------------------------------------------------------------------------

function allValuesEqualTo(input, value, opts) {
  if (Array.isArray(input)) {
    if (input.length === 0) {
      return true;
    }

    if (opts.arraysMustNotContainPlaceholders && input.length > 0 && input.some(el => isEq(el, value))) {
      return false;
    } // so at this point
    // backwards traversal for increased performance:


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
} // T H E   E X P O S E D   W R A P P E R   F U N C T I O N
// -----------------------------------------------------------------------------
// we use this wrapper function because there will be recursive calls and it would
// be a waste of resources to perform the input checks each time within recursion


function allEq(inputOriginal, valueOriginal, originalOpts) {
  // precautions:
  if (inputOriginal === undefined) {
    throw new Error("object-all-values-equal-to: [THROW_ID_01] The first input is undefined! Please provide the first argument.");
  }

  if (valueOriginal === undefined) {
    throw new Error("object-all-values-equal-to: [THROW_ID_02] The second input is undefined! Please provide the second argument.");
  }

  if (originalOpts && !isObj(originalOpts)) {
    throw new Error(`object-all-values-equal-to: [THROW_ID_03] The third argument, options object, was given not as a plain object but as a ${typeof originalOpts}, equal to:\n${JSON.stringify(originalOpts, null, 4)}`);
  } // prep opts


  const defaults = {
    arraysMustNotContainPlaceholders: true
  };
  const opts = { ...defaults,
    ...originalOpts
  }; // and finally,

  return allValuesEqualTo(inputOriginal, valueOriginal, opts);
}

export { allEq, version$1 as version };
