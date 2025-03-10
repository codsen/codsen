/* eslint @typescript-eslint/explicit-module-boundary-types:0 */

import rfdc from "rfdc";
import { isPlainObject as isObj } from "codsen-utils";
import { parent as parent2 } from "ast-monkey-util";

import { version as v } from "../package.json";

const clone = rfdc();
const version: string = v;

declare let DEV: boolean;

export interface Stop {
  now: boolean;
}

export interface InnerObj {
  depth: number;
  path: string;
  topmostKey: string;
  parent: any;
  parentType: string;
  parentKey: string | null;
}

export type Callback = (
  key: string,
  val: any,
  innerObj: InnerObj,
  stop: Stop,
) => any;

/**
 * Utility library to traverse AST
 */
function traverse<T>(tree1: T, cb1: Callback): T {
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
    DEV && console.log(`048 ======= traverseInner() =======`);
    let tree: any = clone(treeOriginal);

    let res;
    let innerObj = { depth: -1, path: "", ...originalInnerObj };
    innerObj.depth += 1;
    if (Array.isArray(tree)) {
      DEV && console.log(`055 tree is array!`);
      for (let i = 0, len = tree.length; i < len; i++) {
        DEV &&
          console.log(
            `059 a ${`\u001b[${36}m${`--------------------------------------------`}\u001b[${39}m`}`,
          );
        if (stop.now) {
          DEV && console.log(`062 ${`\u001b[${31}m${`BREAK`}\u001b[${39}m`}`);
          break;
        }
        let path = innerObj.path ? `${innerObj.path}.${i}` : `${i}`;
        DEV &&
          console.log(
            `068 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`path`}\u001b[${39}m`} = ${JSON.stringify(
              path,
              null,
              4,
            )}`,
          );
        if (tree[i] !== undefined) {
          innerObj.parent = clone(tree);
          innerObj.parentType = "array";
          innerObj.parentKey = parent2(path);
          DEV &&
            console.log(
              `080 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`innerObj.parentKey`}\u001b[${39}m`} = ${JSON.stringify(
                innerObj.parentKey,
                null,
                4,
              )}`,
            );
          // innerObj.path = `${innerObj.path}[${i}]`
          res = traverseInner(
            callback(
              tree[i],
              undefined,
              { ...innerObj, path } as InnerObj,
              stop,
            ),
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
      DEV && console.log(`109 tree is object`);

      for (let key in tree) {
        DEV &&
          console.log(
            `114 ${`\u001b[${36}m${`--------------------------------------------`}\u001b[${39}m`}`,
          );
        if (stop.now && key != null) {
          DEV && console.log(`117 ${`\u001b[${31}m${`BREAK`}\u001b[${39}m`}`);
          break;
        }
        DEV &&
          console.log(
            `122 FIY, ${`\u001b[${33}m${`innerObj.path`}\u001b[${39}m`} = ${JSON.stringify(
              innerObj.path,
              null,
              4,
            )}`,
          );
        let path = innerObj.path ? `${innerObj.path}.${key}` : key;
        DEV &&
          console.log(
            `131 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`path`}\u001b[${39}m`} = ${JSON.stringify(
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
        innerObj.parentKey = parent2(path);
        DEV &&
          console.log(
            `145 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`innerObj.parentKey`}\u001b[${39}m`} = ${JSON.stringify(
              innerObj.parentKey,
              null,
              4,
            )}`,
          );
        res = traverseInner(
          callback(key, tree[key], { ...innerObj, path } as InnerObj, stop),
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
      console.log(`165 just returning tree, ${JSON.stringify(tree, null, 4)}`);
    return tree;
  }
  return traverseInner(tree1, cb1, {}, stop2);
}

// -----------------------------------------------------------------------------

export { traverse, version };
