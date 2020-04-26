import clone from "lodash.clonedeep";

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
  const stop2 = { now: false };
  //
  // traverseInner() needs a wrapper to shield the internal last argument and simplify external API.
  //
  function traverseInner(treeOriginal, callback, originalInnerObj, stop) {
    console.log(`020 ======= traverseInner() =======`);
    const tree = clone(treeOriginal);

    let i;
    let len;
    let res;
    const innerObj = { depth: -1, path: "", ...originalInnerObj };
    innerObj.depth += 1;
    if (Array.isArray(tree)) {
      console.log(`029 tree is array!`);
      for (i = 0, len = tree.length; i < len; i++) {
        console.log(
          `032 a ${`\u001b[${36}m${`--------------------------------------------`}\u001b[${39}m`}`
        );
        if (stop.now) {
          console.log(`035 ${`\u001b[${31}m${`BREAK`}\u001b[${39}m`}`);
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
              { ...innerObj, path: trimFirstDot(path) },
              stop
            ),
            callback,
            { ...innerObj, path: trimFirstDot(path) },
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
      console.log(`065 tree is object`);
      // eslint-disable-next-line guard-for-in, no-restricted-syntax
      for (const key in tree) {
        console.log(
          `069 ${`\u001b[${36}m${`--------------------------------------------`}\u001b[${39}m`}`
        );
        if (stop.now && key != null) {
          console.log(`072 ${`\u001b[${31}m${`BREAK`}\u001b[${39}m`}`);
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
            { ...innerObj, path: trimFirstDot(path) },
            stop
          ),
          callback,
          { ...innerObj, path: trimFirstDot(path) },
          stop
        );
        if (Number.isNaN(res)) {
          delete tree[key];
        } else {
          tree[key] = res;
        }
      }
    }
    console.log(`099 just returning tree, ${JSON.stringify(tree, null, 4)}`);
    return tree;
  }
  return traverseInner(tree1, cb1, {}, stop2);
}

// -----------------------------------------------------------------------------

export default astMonkeyTraverse;
