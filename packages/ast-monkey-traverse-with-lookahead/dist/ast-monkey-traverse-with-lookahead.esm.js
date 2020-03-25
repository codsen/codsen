/**
 * ast-monkey-traverse-with-lookahead
 * Utility library to traverse parsed HTML (AST's) or anything nested (plain objects within arrays within plain objects)
 * Version: 1.0.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ast-monkey-traverse-with-lookahead
 */

import clone from 'lodash.clonedeep';

function trimFirstDot(str) {
  if (typeof str === "string" && str.length && str[0] === ".") {
    return str.slice(1);
  }
  return str;
}
function isObj(something) {
  return (
    something && typeof something === "object" && !Array.isArray(something)
  );
}
function astMonkeyTraverse(tree1, cb1) {
  const stop = { now: false };
  function traverseInner(treeOriginal, callback, innerObj, stop) {
    const tree = clone(treeOriginal);
    let i;
    let len;
    innerObj = Object.assign({ depth: -1, path: "" }, innerObj);
    innerObj.depth += 1;
    if (Array.isArray(tree)) {
      for (i = 0, len = tree.length; i < len; i++) {
        if (stop.now) {
          break;
        }
        const path = `${innerObj.path}.${i}`;
        innerObj.parent = clone(tree);
        innerObj.parentType = "array";
        callback(
          tree[i],
          undefined,
          Object.assign({}, innerObj, { path: trimFirstDot(path) }),
          stop
        );
        traverseInner(
          tree[i],
          callback,
          Object.assign({}, innerObj, { path: trimFirstDot(path) }),
          stop
        );
      }
    } else if (isObj(tree)) {
      for (const key in tree) {
        if (stop.now && key != null) {
          break;
        }
        const path = `${innerObj.path}.${key}`;
        if (innerObj.depth === 0 && key != null) {
          innerObj.topmostKey = key;
        }
        innerObj.parent = clone(tree);
        innerObj.parentType = "object";
        callback(
          key,
          tree[key],
          Object.assign({}, innerObj, { path: trimFirstDot(path) }),
          stop
        );
        traverseInner(
          tree[key],
          callback,
          Object.assign({}, innerObj, { path: trimFirstDot(path) }),
          stop
        );
      }
    }
    return tree;
  }
  return traverseInner(tree1, cb1, {}, stop);
}

export default astMonkeyTraverse;
