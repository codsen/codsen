/* eslint @typescript-eslint/explicit-module-boundary-types:0 */

import { deepClone as clone, isPlainObject as isObj } from "codsen-utils";

import { version as v } from "../package.json";

const version: string = v;

declare let DEV: boolean;

export interface Stop {
  now: boolean;
}

export interface InnerObj {
  depth: number;
  path: string;
  topmostKey?: string;
  parent: any;
  parentType: string;
  parentKey: string | null;
}

export type Callback = (
  key: any,
  val: any,
  innerObj: InnerObj,
  stop: Stop,
) => any;

/**
 * Utility library to traverse AST
 */
function traverse<T>(tree1: T, cb1: Callback): T {
  if (typeof cb1 !== "function") {
    throw new TypeError(
      `ast-monkey-traverse/traverse(): [THROW_ID_01] The second argument must be a callback function. It was ${typeof cb1}.`,
    );
  }
  let stop2: Stop = { now: false };
  //
  // traverseInner() needs a wrapper to shield the last two input args from the outside
  //
  function traverseInner<U>(
    treeOriginal: U,
    callback: Callback,
    originalInnerObj: Partial<InnerObj>,
    stop: Stop,
  ): U {
    DEV && console.log(`050 ======= traverseInner() =======`);
    let tree: any = treeOriginal;

    let res;
    let innerObj = { depth: -1, path: "", ...originalInnerObj };
    innerObj.depth += 1;
    if (Array.isArray(tree)) {
      DEV && console.log(`057 tree is array!`);
      for (let i = 0, len = tree.length; i < len; i++) {
        DEV &&
          console.log(
            `061 a ${`\u001b[${36}m${`--------------------------------------------`}\u001b[${39}m`}`,
          );
        if (stop.now) {
          DEV && console.log(`064 ${`\u001b[${31}m${`BREAK`}\u001b[${39}m`}`);
          break;
        }
        let path = innerObj.path ? `${innerObj.path}.${i}` : `${i}`;
        DEV &&
          console.log(
            `070 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`path`}\u001b[${39}m`} = ${JSON.stringify(
              path,
              null,
              4,
            )}`,
          );
        if (tree[i] !== undefined) {
          innerObj.parent = clone(tree);
          innerObj.parentType = "array";
          innerObj.parentKey = innerObj.path
            ? innerObj.path.slice(innerObj.path.lastIndexOf(".") + 1)
            : null;
          DEV &&
            console.log(
              `084 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`innerObj.parentKey`}\u001b[${39}m`} = ${JSON.stringify(
                innerObj.parentKey,
                null,
                4,
              )}`,
            );
          // innerObj.path = `${innerObj.path}[${i}]`
          let currentValue = tree[i];
          let callbackResult = callback(
            currentValue,
            undefined,
            { ...innerObj, path } as InnerObj,
            stop,
          );
          res = traverseInner(
            callbackResult === currentValue
              ? callbackResult
              : clone(callbackResult),
            callback,
            { ...innerObj, path },
            stop,
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
      DEV && console.log(`117 tree is object`);

      for (let key in tree) {
        DEV &&
          console.log(
            `122 ${`\u001b[${36}m${`--------------------------------------------`}\u001b[${39}m`}`,
          );
        if (stop.now && key != null) {
          DEV && console.log(`125 ${`\u001b[${31}m${`BREAK`}\u001b[${39}m`}`);
          break;
        }
        DEV &&
          console.log(
            `130 FIY, ${`\u001b[${33}m${`innerObj.path`}\u001b[${39}m`} = ${JSON.stringify(
              innerObj.path,
              null,
              4,
            )}`,
          );
        let path = innerObj.path ? `${innerObj.path}.${key}` : key;
        DEV &&
          console.log(
            `139 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`path`}\u001b[${39}m`} = ${JSON.stringify(
              path,
              null,
              4,
            )}`,
          );
        if (innerObj.depth === 0 && key != null) {
          innerObj.topmostKey = key;
        }
        innerObj.parent = clone(tree);
        innerObj.parentType = "object";
        innerObj.parentKey = innerObj.path
          ? innerObj.path.slice(innerObj.path.lastIndexOf(".") + 1)
          : null;
        DEV &&
          console.log(
            `155 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`innerObj.parentKey`}\u001b[${39}m`} = ${JSON.stringify(
              innerObj.parentKey,
              null,
              4,
            )}`,
          );
        let currentValue = tree[key];
        let callbackResult = callback(
          key,
          currentValue,
          { ...innerObj, path } as InnerObj,
          stop,
        );
        res = traverseInner(
          callbackResult === currentValue
            ? callbackResult
            : clone(callbackResult),
          callback,
          { ...innerObj, path },
          stop,
        );
        if (Number.isNaN(res)) {
          delete tree[key];
        } else {
          tree[key] = res;
        }
      }
    }
    DEV &&
      console.log(`184 just returning tree, ${JSON.stringify(tree, null, 4)}`);
    return tree;
  }
  return traverseInner(clone(tree1), cb1, {}, stop2);
}

// -----------------------------------------------------------------------------

export { traverse, version };
