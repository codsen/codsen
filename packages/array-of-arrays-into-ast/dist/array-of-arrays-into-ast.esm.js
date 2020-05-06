/**
 * array-of-arrays-into-ast
 * turns an array of arrays of data into a nested tree of plain objects
 * Version: 1.9.37
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/array-of-arrays-into-ast
 */

import checkTypes from 'check-types-mini';
import mergeAdvanced from 'object-merge-advanced';

const isArr = Array.isArray;
function sortObject(obj) {
  return Object.keys(obj)
    .sort()
    .reduce((result, key) => {
      result[key] = obj[key];
      return result;
    }, {});
}
function generateAst(input, originalOpts) {
  if (!isArr(input)) {
    throw new Error(
      `array-of-arrays-into-ast: [THROW_ID_01] input must be array. Currently it's of a type ${typeof input} equal to:\n${JSON.stringify(
        input,
        null,
        4
      )}`
    );
  } else if (input.length === 0) {
    return {};
  }
  const defaults = {
    dedupe: true,
  };
  const opts = { ...defaults, ...originalOpts };
  checkTypes(opts, defaults, {
    msg: "array-of-arrays-into-ast: [THROW_ID_02*]",
    optsVarName: "opts",
  });
  let res = {};
  input.forEach((arr) => {
    let temp = null;
    for (let i = arr.length; i--; ) {
      temp = { [arr[i]]: [temp] };
    }
    res = mergeAdvanced(res, temp, { concatInsteadOfMerging: !opts.dedupe });
  });
  return sortObject(res);
}

export default generateAst;
