import clone from "lodash.clonedeep";
import { parent } from "ast-monkey-util";

function isObj(something) {
  return (
    something && typeof something === "object" && !Array.isArray(something)
  );
}
function astMonkeyTraverse(tree1, cb1) {
  const stop2 = { now: false };
  //
  // traverseInner() needs a wrapper to shield the internal last argument and simplify external API.
  //
  function traverseInner(treeOriginal, callback, originalInnerObj, stop) {
    console.log(`015 ======= traverseInner() =======`);
    const tree = clone(treeOriginal);

    let i;
    let len;
    let res;
    const innerObj = { depth: -1, path: "", ...originalInnerObj };
    innerObj.depth += 1;
    if (Array.isArray(tree)) {
      console.log(`024 tree is array!`);
      for (i = 0, len = tree.length; i < len; i++) {
        console.log(
          `027 a ${`\u001b[${36}m${`--------------------------------------------`}\u001b[${39}m`}`
        );
        if (stop.now) {
          console.log(`030 ${`\u001b[${31}m${`BREAK`}\u001b[${39}m`}`);
          break;
        }
        const path = innerObj.path ? `${innerObj.path}.${i}` : `${i}`;
        console.log(
          `035 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`path`}\u001b[${39}m`} = ${JSON.stringify(
            path,
            null,
            4
          )}`
        );
        if (tree[i] !== undefined) {
          innerObj.parent = clone(tree);
          innerObj.parentType = "array";
          innerObj.parentKey = parent(path);
          console.log(
            `046 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`innerObj.parentKey`}\u001b[${39}m`} = ${JSON.stringify(
              innerObj.parentKey,
              null,
              4
            )}`
          );
          // innerObj.path = `${innerObj.path}[${i}]`
          res = traverseInner(
            callback(tree[i], undefined, { ...innerObj, path }, stop),
            callback,
            { ...innerObj, path },
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
      console.log(`070 tree is object`);
      // eslint-disable-next-line guard-for-in, no-restricted-syntax
      for (const key in tree) {
        console.log(
          `074 ${`\u001b[${36}m${`--------------------------------------------`}\u001b[${39}m`}`
        );
        if (stop.now && key != null) {
          console.log(`077 ${`\u001b[${31}m${`BREAK`}\u001b[${39}m`}`);
          break;
        }
        console.log(
          `081 FIY, ${`\u001b[${33}m${`innerObj.path`}\u001b[${39}m`} = ${JSON.stringify(
            innerObj.path,
            null,
            4
          )}`
        );
        const path = innerObj.path ? `${innerObj.path}.${key}` : key;
        console.log(
          `089 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`path`}\u001b[${39}m`} = ${JSON.stringify(
            path,
            null,
            4
          )}`
        );
        if (innerObj.depth === 0 && key != null) {
          innerObj.topmostKey = key;
        }
        innerObj.parent = clone(tree);
        innerObj.parentType = "object";
        innerObj.parentKey = parent(path);
        console.log(
          `102 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`innerObj.parentKey`}\u001b[${39}m`} = ${JSON.stringify(
            innerObj.parentKey,
            null,
            4
          )}`
        );
        res = traverseInner(
          callback(key, tree[key], { ...innerObj, path }, stop),
          callback,
          { ...innerObj, path },
          stop
        );
        if (Number.isNaN(res)) {
          delete tree[key];
        } else {
          tree[key] = res;
        }
      }
    }
    console.log(`121 just returning tree, ${JSON.stringify(tree, null, 4)}`);
    return tree;
  }
  return traverseInner(tree1, cb1, {}, stop2);
}

// -----------------------------------------------------------------------------

export default astMonkeyTraverse;
