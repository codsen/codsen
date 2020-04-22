/**
 * util-array-object-or-both
 * Validate and normalise user choice: array, object or both?
 * Version: 2.7.57
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/util-array-object-or-both
 */

import includes from 'lodash.includes';
import isObj from 'lodash.isplainobject';

function arrObjOrBoth(str, originalOpts) {
  function existy(x) {
    return x != null;
  }
  if (!existy(str)) {
    throw new Error(
      `util-array-object-or-both/validate(): [THROW_ID_01] Please provide a string to work on. Currently it's equal to ${JSON.stringify(
        str,
        null,
        4
      )}`
    );
  }
  if (typeof str !== "string") {
    throw new Error(
      `util-array-object-or-both/validate(): [THROW_ID_02] Input must be string! Currently it's ${typeof str}, equal to: ${JSON.stringify(
        str,
        null,
        4
      )}`
    );
  }
  if (existy(originalOpts) && !isObj(originalOpts)) {
    throw new Error(
      `util-array-object-or-both/validate(): [THROW_ID_03] Second argument, options object, must be, well, object! Currenlty it's: ${typeof originalOpts}, equal to: ${JSON.stringify(
        originalOpts,
        null,
        4
      )}`
    );
  }
  const onlyObjectValues = ["object", "objects", "obj", "ob", "o"];
  const onlyArrayValues = ["array", "arrays", "arr", "aray", "arr", "a"];
  const onlyAnyValues = [
    "any",
    "all",
    "everything",
    "both",
    "either",
    "each",
    "whatever",
    "whatevs",
    "e",
  ];
  const defaults = {
    msg: "",
    optsVarName: "given variable",
  };
  const opts = { ...defaults, ...originalOpts };
  if (existy(opts.msg) && opts.msg.length > 0) {
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
  throw new TypeError(
    `${opts.msg}The ${opts.optsVarName} was customised to an unrecognised value: ${str}. Please check it against the API documentation.`
  );
}

export default arrObjOrBoth;
