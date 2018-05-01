'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var clone = _interopDefault(require('lodash.clonedeep'));
var isObj = _interopDefault(require('lodash.isplainobject'));

/* eslint no-param-reassign:0 */

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
  //
  // traverseInner() needs a wrapper to shield the internal last argument and simplify external API.
  //
  function traverseInner(treeOriginal, callback, innerObj) {
    var tree = clone(treeOriginal);

    var i = void 0;
    var len = void 0;
    var res = void 0;
    var allKeys = void 0;
    var key = void 0;
    innerObj = Object.assign({ depth: -1, path: "" }, innerObj);
    innerObj.depth += 1;
    if (isArr(tree)) {
      for (i = 0, len = tree.length; i < len; i++) {
        var path = innerObj.path + "." + i;
        if (tree[i] !== undefined) {
          innerObj.parent = clone(tree);
          // innerObj.path = `${innerObj.path}[${i}]`
          res = traverseInner(callback(tree[i], undefined, Object.assign({}, innerObj, { path: trimFirstDot(path) })), callback, Object.assign({}, innerObj, { path: trimFirstDot(path) }));
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
        var _path = innerObj.path + "." + key;
        if (innerObj.depth === 0 && existy(key)) {
          innerObj.topmostKey = key;
        }
        innerObj.parent = clone(tree);
        res = traverseInner(callback(key, tree[key], Object.assign({}, innerObj, { path: trimFirstDot(_path) })), callback, Object.assign({}, innerObj, { path: trimFirstDot(_path) }));
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
