/**
 * ast-monkey-traverse
 * Utility library to traverse parsed HTML (AST's) or anything nested (plain objects within arrays within plain objects)
 * Version: 1.12.7
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ast-monkey-traverse
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
    let res;
    innerObj = Object.assign({ depth: -1, path: "" }, innerObj);
    innerObj.depth += 1;
    if (Array.isArray(tree)) {
      for (i = 0, len = tree.length; i < len; i++) {
        if (stop.now) {
          break;
        }
        const path = `${innerObj.path}.${i}`;
        if (tree[i] !== undefined) {
          innerObj.parent = clone(tree);
          innerObj.parentType = "array";
          res = traverseInner(
            callback(
              tree[i],
              undefined,
              Object.assign({}, innerObj, { path: trimFirstDot(path) }),
              stop
            ),
            callback,
            Object.assign({}, innerObj, { path: trimFirstDot(path) }),
            stop
          );
          if (Number.isNaN(res) && i < tree.length) {
            tree.splice(i, 1);
            i -= 1;
          } else {
            tree[i] = res;
          }
        } else {
          tree.splice(i, 1);
        }
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
        res = traverseInner(
          callback(
            key,
            tree[key],
            Object.assign({}, innerObj, { path: trimFirstDot(path) }),
            stop
          ),
          callback,
          Object.assign({}, innerObj, { path: trimFirstDot(path) }),
          stop
        );
        if (Number.isNaN(res)) {
          delete tree[key];
        } else {
          tree[key] = res;
        }
      }
    }
    return tree;
  }
  return traverseInner(tree1, cb1, {}, stop);
}

export default astMonkeyTraverse;
