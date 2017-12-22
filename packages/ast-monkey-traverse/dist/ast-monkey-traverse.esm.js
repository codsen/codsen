import clone from 'lodash.clonedeep';
import isObj from 'lodash.isplainobject';

/* eslint no-param-reassign:0 */

var isArr = Array.isArray;

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
    innerObj = Object.assign({ depth: -1 }, innerObj);
    innerObj.depth += 1;
    if (isArr(tree)) {
      for (i = 0, len = tree.length; i < len; i++) {
        if (tree[i] !== undefined) {
          innerObj.parent = clone(tree);
          res = traverseInner(callback(tree[i], undefined, innerObj), callback, innerObj);
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
        if (innerObj.depth === 0 && existy(key)) {
          innerObj.topmostKey = key;
        }
        innerObj.parent = clone(tree);
        res = traverseInner(callback(key, tree[key], innerObj), callback, innerObj);
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

export default astMonkeyTraverse;
