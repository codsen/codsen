/* eslint @typescript-eslint/explicit-module-boundary-types:0 */

import clone from "lodash.clonedeep";
import isObj from "lodash.isplainobject";
import { parent } from "ast-monkey-util";

import { version as v } from "../package.json";

const version: string = v;

interface Stop {
  now: boolean;
}

interface InnerObj {
  depth: number;
  path: string;
  topmostKey: string;
  parent: any;
  parentType: string;
  parentKey: string | null;
}

type Callback = (key: string, val: any, innerObj: InnerObj, stop: Stop) => any;

/**
 * Utility library to traverse AST
 */
function traverse(tree1: any, cb1: Callback): any {
  let stop2: Stop = { now: false };
  //
  // traverseInner() needs a wrapper to shield the last two input args from the outside
  //
  function traverseInner(
    treeOriginal: any,
    callback: Callback,
    originalInnerObj: Partial<InnerObj>,
    stop: Stop
  ): any {
    console.log(`040 ======= traverseInner() =======`);
    let tree: any = clone(treeOriginal);

    let res;
    let innerObj = { depth: -1, path: "", ...originalInnerObj };
    innerObj.depth += 1;
    if (Array.isArray(tree)) {
      console.log(`047 tree is array!`);
      for (let i = 0, len = tree.length; i < len; i++) {
        console.log(
          `050 a ${`\u001b[${36}m${`--------------------------------------------`}\u001b[${39}m`}`
        );
        if (stop.now) {
          console.log(`053 ${`\u001b[${31}m${`BREAK`}\u001b[${39}m`}`);
          break;
        }
        let path = innerObj.path ? `${innerObj.path}.${i}` : `${i}`;
        console.log(
          `058 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`path`}\u001b[${39}m`} = ${JSON.stringify(
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
            `069 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`innerObj.parentKey`}\u001b[${39}m`} = ${JSON.stringify(
              innerObj.parentKey,
              null,
              4
            )}`
          );
          // innerObj.path = `${innerObj.path}[${i}]`
          res = traverseInner(
            callback(
              tree[i],
              undefined,
              { ...innerObj, path } as InnerObj,
              stop
            ),
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
      console.log(`098 tree is object`);
      // eslint-disable-next-line guard-for-in, no-restricted-syntax
      for (let key in tree) {
        console.log(
          `102 ${`\u001b[${36}m${`--------------------------------------------`}\u001b[${39}m`}`
        );
        if (stop.now && key != null) {
          console.log(`105 ${`\u001b[${31}m${`BREAK`}\u001b[${39}m`}`);
          break;
        }
        console.log(
          `109 FIY, ${`\u001b[${33}m${`innerObj.path`}\u001b[${39}m`} = ${JSON.stringify(
            innerObj.path,
            null,
            4
          )}`
        );
        let path = innerObj.path ? `${innerObj.path}.${key}` : key;
        console.log(
          `117 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`path`}\u001b[${39}m`} = ${JSON.stringify(
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
          `130 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`innerObj.parentKey`}\u001b[${39}m`} = ${JSON.stringify(
            innerObj.parentKey,
            null,
            4
          )}`
        );
        res = traverseInner(
          callback(key, tree[key], { ...innerObj, path } as InnerObj, stop),
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
    console.log(`149 just returning tree, ${JSON.stringify(tree, null, 4)}`);
    return tree;
  }
  return traverseInner(tree1, cb1, {}, stop2);
}

// -----------------------------------------------------------------------------

export { traverse, version };
