/**
 * @name ast-monkey-traverse
 * @fileoverview Utility library to traverse AST
 * @version 3.0.2
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/ast-monkey-traverse/}
 */

import clone from 'lodash.clonedeep';
import isObj from 'lodash.isplainobject';
import { parent } from 'ast-monkey-util';

var version$1 = "3.0.2";

const version = version$1;
function traverse(tree1, cb1) {
  const stop2 = {
    now: false
  };
  function traverseInner(treeOriginal, callback, originalInnerObj, stop) {
    const tree = clone(treeOriginal);
    let res;
    const innerObj = {
      depth: -1,
      path: "",
      ...originalInnerObj
    };
    innerObj.depth += 1;
    if (Array.isArray(tree)) {
      for (let i = 0, len = tree.length; i < len; i++) {
        if (stop.now) {
          break;
        }
        const path = innerObj.path ? `${innerObj.path}.${i}` : `${i}`;
        if (tree[i] !== undefined) {
          innerObj.parent = clone(tree);
          innerObj.parentType = "array";
          innerObj.parentKey = parent(path);
          res = traverseInner(callback(tree[i], undefined, { ...innerObj,
            path
          }, stop), callback, { ...innerObj,
            path
          }, stop);
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
        const path = innerObj.path ? `${innerObj.path}.${key}` : key;
        if (innerObj.depth === 0 && key != null) {
          innerObj.topmostKey = key;
        }
        innerObj.parent = clone(tree);
        innerObj.parentType = "object";
        innerObj.parentKey = parent(path);
        res = traverseInner(callback(key, tree[key], { ...innerObj,
          path
        }, stop), callback, { ...innerObj,
          path
        }, stop);
        if (Number.isNaN(res)) {
          delete tree[key];
        } else {
          tree[key] = res;
        }
      }
    }
    return tree;
  }
  return traverseInner(tree1, cb1, {}, stop2);
}

export { traverse, version };
