/**
 * ast-deep-contains
 * the t.deepEqual alternative for AVA
 * Version: 1.0.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ast-deep-contains
 */

import typeDetect from 'type-detect';
import objectPath from 'object-path';
import traverse from 'ast-monkey-traverse';

const isArr = Array.isArray;
function isObj(something) {
  return typeDetect(something) === "Object";
}
function deepContains(tree1, tree2, cb, errCb, originalOpts) {
  const defaults = {
    skipContainers: true
  };
  const opts = Object.assign({}, defaults, originalOpts);
  if (typeDetect(tree1) !== typeDetect(tree2)) {
    errCb(
      `1st input arg is of a type ${typeDetect(
        tree1
      ).toLowerCase()} but second is ${typeDetect(tree2).toLowerCase()}`
    );
  } else {
    traverse(tree2, (key, val, innerObj) => {
      const current = val !== undefined ? val : key;
      const { path } = innerObj;
      if (objectPath.has(tree1, path)) {
        const retrieved = objectPath.get(tree1, path);
        if ((!isObj(retrieved) && !isArr(retrieved)) || !opts.skipContainers) {
          cb(objectPath.get(tree1, path), current, path);
        }
      } else {
        errCb(`first input does not have the path "${path}"`);
      }
      return current;
    });
  }
}

export default deepContains;
