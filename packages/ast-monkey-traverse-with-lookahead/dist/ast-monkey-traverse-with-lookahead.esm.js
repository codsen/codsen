/**
 * ast-monkey-traverse-with-lookahead
 * Utility library to traverse AST, reports upcoming values
 * Version: 1.2.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ast-monkey-traverse-with-lookahead/
 */

import clone from 'lodash.clonedeep';

function trimFirstDot(str) {
  if (typeof str === "string" && str[0] === ".") {
    return str.slice(1);
  }
  return str;
}
function isObj(something) {
  return (
    something && typeof something === "object" && !Array.isArray(something)
  );
}
function astMonkeyTraverseWithLookahead(tree1, cb1, lookahead = 0) {
  const stop1 = { now: false };
  const stash = [];
  function traverseInner(tree, callback, innerObj, stop) {
    innerObj = { depth: -1, path: "", ...innerObj };
    innerObj.depth += 1;
    if (Array.isArray(tree)) {
      for (let i = 0, len = tree.length; i < len; i++) {
        if (stop.now) {
          break;
        }
        const path = `${innerObj.path}.${i}`;
        innerObj.parent = clone(tree);
        innerObj.parentType = "array";
        callback(
          tree[i],
          undefined,
          { ...innerObj, path: trimFirstDot(path) },
          stop
        );
        traverseInner(
          tree[i],
          callback,
          { ...innerObj, path: trimFirstDot(path) },
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
          { ...innerObj, path: trimFirstDot(path) },
          stop
        );
        traverseInner(
          tree[key],
          callback,
          { ...innerObj, path: trimFirstDot(path) },
          stop
        );
      }
    }
    return tree;
  }
  function reportFirstFromStash() {
    const currentElem = stash.shift();
    currentElem[2].next = [];
    for (let i = 0; i < lookahead; i++) {
      if (stash[i]) {
        currentElem[2].next.push(
          clone([stash[i][0], stash[i][1], stash[i][2]])
        );
      } else {
        break;
      }
    }
    cb1(...currentElem);
  }
  function intermediary(...incoming) {
    stash.push([...incoming]);
    if (stash.length > lookahead) {
      reportFirstFromStash();
    }
  }
  traverseInner(tree1, intermediary, {}, stop1);
  if (stash.length) {
    for (let i = 0, len = stash.length; i < len; i++) {
      reportFirstFromStash();
    }
  }
}

export default astMonkeyTraverseWithLookahead;
