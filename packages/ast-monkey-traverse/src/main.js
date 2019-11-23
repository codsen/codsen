/* eslint no-param-reassign:0 */

import clone from "lodash.clonedeep";
import isObj from "lodash.isplainobject";

const isArr = Array.isArray;
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
  const stop = { now: false };
  //
  // traverseInner() needs a wrapper to shield the internal last argument and simplify external API.
  //
  function traverseInner(treeOriginal, callback, innerObj, stop) {
    console.log(`022 ======= traverseInner() =======`);
    const tree = clone(treeOriginal);

    let i;
    let len;
    let res;
    let allKeys;
    let key;
    innerObj = Object.assign({ depth: -1, path: "" }, innerObj);
    innerObj.depth += 1;
    if (isArr(tree)) {
      console.log(`033 tree is array!`);
      for (i = 0, len = tree.length; i < len; i++) {
        console.log(
          `036 a ${`\u001b[${36}m${`--------------------------------------------`}\u001b[${39}m`}`
        );
        if (stop.now) {
          console.log(`039 ${`\u001b[${31}m${`BREAK`}\u001b[${39}m`}`);
          break;
        }
        const path = `${innerObj.path}.${i}`;
        if (tree[i] !== undefined) {
          innerObj.parent = clone(tree);
          innerObj.parentType = "array";
          // innerObj.path = `${innerObj.path}[${i}]`
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
      console.log(`069 tree is object`);
      allKeys = Object.keys(tree);
      for (i = 0, len = allKeys.length; i < len; i++) {
        console.log(
          `073 o ${`\u001b[${36}m${`--------------------------------------------`}\u001b[${39}m`}`
        );
        if (stop.now) {
          console.log(`076 ${`\u001b[${31}m${`BREAK`}\u001b[${39}m`}`);
          break;
        }
        key = allKeys[i];
        const path = `${innerObj.path}.${key}`;
        if (innerObj.depth === 0 && existy(key)) {
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
    console.log(`104 just returning tree, ${JSON.stringify(tree, null, 4)}`);
    return tree;
  }
  return traverseInner(tree1, cb1, {}, stop);
}

// -----------------------------------------------------------------------------

export default astMonkeyTraverse;
