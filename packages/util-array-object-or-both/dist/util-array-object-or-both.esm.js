/**
 * util-array-object-or-both
 * Validate and normalise user choice: array, object or both?
 * Version: 3.0.11
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/util-array-object-or-both/
 */

import includes from 'lodash.includes';

function arrObjOrBoth(str, originalOpts) {
  const onlyObjectValues = ["object", "objects", "obj", "ob", "o"];
  const onlyArrayValues = ["array", "arrays", "arr", "aray", "arr", "a"];
  const onlyAnyValues = ["any", "all", "everything", "both", "either", "each", "whatever", "whatevs", "e"];
  const defaults = {
    msg: "",
    optsVarName: "given variable"
  };
  const opts = { ...defaults,
    ...originalOpts
  };
  if (opts && opts.msg && opts.msg.length > 0) {
    opts.msg = `${opts.msg.trim()} `;
  }
  if (opts.optsVarName !== "given variable") {
    opts.optsVarName = `variable "${opts.optsVarName}"`;
  }
  if (includes(onlyObjectValues, str.toLowerCase().trim())) {
    return "object";
  }
  if (includes(onlyArrayValues, str.toLowerCase().trim())) {
    return "array";
  }
  if (includes(onlyAnyValues, str.toLowerCase().trim())) {
    return "any";
  }
  throw new TypeError(`${opts.msg}The ${opts.optsVarName} was customised to an unrecognised value: ${str}. Please check it against the API documentation.`);
}

export { arrObjOrBoth };
