/**
 * @name array-of-arrays-into-ast
 * @fileoverview Turns an array of arrays of data into a nested tree of plain objects
 * @version 2.1.0
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/array-of-arrays-into-ast/}
 */

import { mergeAdvanced } from 'object-merge-advanced';

var version$1 = "2.1.0";

const version = version$1;
const defaults = {
  dedupe: true
};
function sortObject(obj) {
  return Object.keys(obj).sort().reduce((result, key) => {
    result[key] = obj[key];
    return result;
  }, {});
}
function generateAst(input, originalOpts) {
  if (!Array.isArray(input)) {
    throw new Error(`array-of-arrays-into-ast: [THROW_ID_01] input must be array. Currently it's of a type ${typeof input} equal to:\n${JSON.stringify(input, null, 4)}`);
  } else if (input.length === 0) {
    return {};
  }
  const opts = { ...defaults,
    ...originalOpts
  };
  let res = {};
  input.forEach(arr => {
    let temp = null;
    for (let i = arr.length; i--;) {
      temp = {
        [arr[i]]: [temp]
      };
    }
    res = mergeAdvanced(res, temp, {
      concatInsteadOfMerging: !opts.dedupe
    });
  });
  return sortObject(res);
}

export { defaults, generateAst, version };
