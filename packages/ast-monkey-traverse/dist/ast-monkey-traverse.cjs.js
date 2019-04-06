/**
 * ast-monkey-traverse
 * Utility library to traverse parsed HTML (AST's) or anything nested (plain objects within arrays within plain objects)
 * Version: 1.11.16
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ast-monkey-traverse
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var clone = _interopDefault(require('lodash.clonedeep'));
var isObj = _interopDefault(require('lodash.isplainobject'));

var isArr = Array.isArray;
function trimFirstDot(str) {
  if (typeof str === "string" && str.length > 0 && str[0] === ".") {
    return str.slice(1);
  }
  return str;
}
function existy(x) {
  return x != null;
}
function astMonkeyTraverse(tree1, cb1) {
  function traverseInner(treeOriginal, callback, innerObj) {
    var tree = clone(treeOriginal);
    var i;
    var len;
    var res;
    var allKeys;
    var key;
    innerObj = Object.assign({
      depth: -1,
      path: ""
    }, innerObj);
    innerObj.depth += 1;
    if (isArr(tree)) {
      for (i = 0, len = tree.length; i < len; i++) {
        var path = "".concat(innerObj.path, ".").concat(i);
        if (tree[i] !== undefined) {
          innerObj.parent = clone(tree);
          innerObj.parentType = "array";
          res = traverseInner(callback(tree[i], undefined, Object.assign({}, innerObj, {
            path: trimFirstDot(path)
          })), callback, Object.assign({}, innerObj, {
            path: trimFirstDot(path)
          }));
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
      allKeys = Object.keys(tree);
      for (i = 0, len = allKeys.length; i < len; i++) {
        key = allKeys[i];
        var _path = "".concat(innerObj.path, ".").concat(key);
        if (innerObj.depth === 0 && existy(key)) {
          innerObj.topmostKey = key;
        }
        innerObj.parent = clone(tree);
        innerObj.parentType = "object";
        res = traverseInner(callback(key, tree[key], Object.assign({}, innerObj, {
          path: trimFirstDot(_path)
        })), callback, Object.assign({}, innerObj, {
          path: trimFirstDot(_path)
        }));
        if (Number.isNaN(res)) {
          delete tree[key];
        } else {
          tree[key] = res;
        }
      }
    }
    return tree;
  }
  return traverseInner(tree1, cb1, {});
}

module.exports = astMonkeyTraverse;
