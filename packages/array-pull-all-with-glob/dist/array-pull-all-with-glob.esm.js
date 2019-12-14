/**
 * array-pull-all-with-glob
 * pullAllWithGlob - like _.pullAll but pulling stronger, with globs
 * Version: 4.12.56
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/array-pull-all-with-glob
 */

import matcher from 'matcher';
import checkTypes from 'check-types-mini';
import isObj from 'lodash.isplainobject';

const isArr = Array.isArray;
function pullAllWithGlob(
  originalInput,
  originalToBeRemoved,
  originalOpts = {}
) {
  function existy(x) {
    return x != null;
  }
  function isStr(something) {
    return typeof something === "string";
  }
  if (!existy(originalInput)) {
    throw new Error(
      "array-pull-all-with-glob: [THROW_ID_01] first argument is missing!"
    );
  }
  if (!existy(originalToBeRemoved)) {
    throw new Error(
      "array-pull-all-with-glob: [THROW_ID_02] second argument is missing!"
    );
  }
  if (!isArr(originalInput)) {
    throw new Error(
      `array-pull-all-with-glob: [THROW_ID_03] first argument must be an array! Currently it's ${typeof originalInput}, equal to: ${JSON.stringify(
        originalInput,
        null,
        4
      )}`
    );
  }
  let toBeRemoved;
  if (typeof originalToBeRemoved === "string") {
    if (originalToBeRemoved.length === 0) {
      return originalInput;
    }
    toBeRemoved = [originalToBeRemoved];
  } else if (isArr(originalToBeRemoved)) {
    if (originalToBeRemoved.length === 0) {
      return originalInput;
    }
    toBeRemoved = Array.from(originalToBeRemoved);
  } else if (!isArr(originalToBeRemoved)) {
    throw new Error(
      `array-pull-all-with-glob: [THROW_ID_04] first argument must be an array! Currently it's ${typeof originalToBeRemoved}, equal to: ${JSON.stringify(
        originalToBeRemoved,
        null,
        4
      )}`
    );
  }
  if (originalInput.length === 0 || originalToBeRemoved.length === 0) {
    return originalInput;
  }
  if (!originalInput.every(el => isStr(el))) {
    throw new Error(
      `array-pull-all-with-glob: [THROW_ID_05] first argument array contains non-string elements: ${JSON.stringify(
        originalInput,
        null,
        4
      )}`
    );
  }
  if (!toBeRemoved.every(el => isStr(el))) {
    throw new Error(
      `array-pull-all-with-glob: [THROW_ID_06] first argument array contains non-string elements: ${JSON.stringify(
        toBeRemoved,
        null,
        4
      )}`
    );
  }
  if (existy(originalOpts) && !isObj(originalOpts)) {
    throw new Error(
      `array-pull-all-with-glob: [THROW_ID_07] third argument, options object is not a plain object but ${
        Array.isArray(originalOpts) ? "array" : typeof originalOpts
      }`
    );
  }
  let opts;
  const defaults = {
    caseSensitive: true
  };
  if (originalOpts === null) {
    opts = Object.assign({}, defaults);
  } else {
    opts = Object.assign({}, defaults, originalOpts);
  }
  checkTypes(opts, defaults, {
    msg: "newLibrary/yourFunction(): [THROW_ID_08]",
    optsVarName: "opts"
  });
  return Array.from(originalInput).filter(
    originalVal =>
      !toBeRemoved.some(remVal =>
        matcher.isMatch(originalVal, remVal, {
          caseSensitive: opts.caseSensitive
        })
      )
  );
}

export default pullAllWithGlob;
