/* eslint @typescript-eslint/explicit-module-boundary-types: 0 */

import clone from "lodash.clonedeep";
import isObj from "lodash.isplainobject";

import { version as v } from "../package.json";

const version: string = v;

interface Obj {
  [key: string]: any;
}

type NextToken = [
  key: "string",
  value: any,
  innerObj: {
    depth: number;
    path: string;
    parent: any;
    parentType: string;
  }
];

interface InnerObj {
  depth: number;
  path: string;
  topmostKey?: string;
  parent?: any;
  parentType?: string;
  next?: NextToken[];
}

type Callback = (
  key: string | Obj,
  val: any,
  innerObj: InnerObj,
  stop: { now: boolean }
) => any;

function traverse(tree1: any, cb1: Callback, lookahead = 0): void {
  function trimFirstDot(str: string): string {
    if (typeof str === "string" && str[0] === ".") {
      return str.slice(1);
    }
    return str;
  }
  console.log(
    `049 ${`\u001b[${33}m${`lookahead`}\u001b[${39}m`} = ${JSON.stringify(
      lookahead,
      null,
      4
    )}`
  );
  let stop1 = { now: false };

  // that's where we stash the arguments that the callback function tries
  // to ping; we keep them until enough of them is gathered to set them as
  // "future" values:
  let stash: any[] = [];
  // ^ LIFO STACK

  //
  // traverseInner() needs a wrapper to shield the internal arguments and simplify external API.
  //
  function traverseInner(
    tree: any,
    callback: Callback,
    innerObj: InnerObj,
    stop: { now: boolean }
  ): void {
    console.log(`072 ======= traverseInner() =======`);
    console.log(
      `074 ${`\u001b[${32}m${`INCOMING`}\u001b[${39}m`} ${`\u001b[${33}m${`tree`}\u001b[${39}m`} = ${JSON.stringify(
        tree,
        null,
        4
      )}`
    );

    innerObj = { ...innerObj };
    innerObj.depth += 1;

    if (Array.isArray(tree)) {
      console.log(`085 tree is array!`);
      for (let i = 0, len = tree.length; i < len; i++) {
        console.log(
          `088: ${`\u001b[${36}m${`--------------------------------------------`}\u001b[${39}m`} key: ${JSON.stringify(
            tree[i],
            null,
            0
          )}`
        );
        if (stop.now) {
          console.log(`095 ${`\u001b[${31}m${`BREAK`}\u001b[${39}m`}`);
          break;
        }
        let path = `${innerObj.path}.${i}`;
        console.log(
          `100 ${`\u001b[${33}m${`path`}\u001b[${39}m`} = ${JSON.stringify(
            path,
            null,
            4
          )}`
        );
        innerObj.parent = clone(tree);
        innerObj.parentType = "array";
        // innerObj.path = `${innerObj.path}[${i}]`

        callback(
          tree[i],
          undefined,
          { ...innerObj, path: trimFirstDot(path) },
          stop
        );

        traverseInner(
          tree[i],
          callback,
          { ...innerObj, path: trimFirstDot(path) },
          stop
        );
      }
    } else if (isObj(tree)) {
      console.log(`125 tree is object`);
      // eslint-disable-next-line
      for (const key in tree) {
        console.log(
          `129: ${`\u001b[${36}m${`--------------------------------------------`}\u001b[${39}m`} key: ${key}`
        );
        if (stop.now && key != null) {
          console.log(`132 ${`\u001b[${31}m${`BREAK`}\u001b[${39}m`}`);
          break;
        }
        let path = `${innerObj.path}.${key}`;
        console.log(
          `137 ${`\u001b[${33}m${`path`}\u001b[${39}m`} = ${JSON.stringify(
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

        callback(
          key,
          tree[key],
          { ...innerObj, path: trimFirstDot(path) },
          stop
        );

        traverseInner(
          tree[key],
          callback,
          { ...innerObj, path: trimFirstDot(path) },
          stop
        );
      }
    }
    console.log(`164 just returning tree, ${JSON.stringify(tree, null, 4)}`);
    return tree;
  }

  // for DRY purposes, we extract the function which reports the first element
  // from the stash and removes that element.
  function reportFirstFromStash(): void {
    console.log(
      `172 ${`\u001b[${35}m${`reportFirstFromStash()`}\u001b[${39}m`}: ██ ${`\u001b[${33}m${`START`}\u001b[${39}m`}`
    );
    // start to assemble node we're report to the callback cb1()
    let currentElem: any = stash.shift();
    // ^ shift removes it from stash
    // now we need the "future" nodes, as many as "lookahead" of them

    // that's the container where they'll sit:
    currentElem[2].next = [];

    for (let i = 0; i < lookahead; i++) {
      console.log(`i = ${i}`);
      // we want as many as "lookahead" from stash but there might be not enough
      if (stash[i]) {
        currentElem[2].next.push(
          clone([stash[i][0], stash[i][1], stash[i][2]])
        );
        console.log(
          `190 ${`\u001b[${35}m${`reportFirstFromStash()`}\u001b[${39}m`}: ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} currentElem[2].next now = ${JSON.stringify(
            currentElem[2].next,
            null,
            4
          )}`
        );
      } else {
        console.log(
          `198 ${`\u001b[${35}m${`reportFirstFromStash()`}\u001b[${39}m`}: ${`\u001b[${31}m${`STOP`}\u001b[${39}m`} - there are not enough elements in stash`
        );
        break;
      }
    }

    // finally, ping the callback with assembled element:
    console.log(
      `206 ${`\u001b[${35}m${`reportFirstFromStash()`}\u001b[${39}m`}: ${`\u001b[${32}m${`PING CB`}\u001b[${39}m`} with ${JSON.stringify(
        [...[currentElem[0], currentElem[1], currentElem[2]]],
        null,
        4
      )}`
    );
    (cb1 as any)(...currentElem);
  }

  // used to buffer "lookahead"-amount of results and report them as "future"
  // nodes
  function intermediary(...incoming: any): void {
    console.log(
      `219 ${`\u001b[${36}m${`intermediary()`}\u001b[${39}m`}: INCOMING ${JSON.stringify(
        incoming,
        null,
        4
      )}`
    );

    // 1. put the incoming things into stash.
    // We need to delete the "now" element, the last-one in here,
    // because it's for internal use

    stash.push([...incoming]);
    console.log(
      `232 ${`\u001b[${90}m${`██ stash`}\u001b[${39}m`} = ${JSON.stringify(
        stash,
        null,
        4
      )}`
    );

    // 2. if there are enough things gathered in stash, report the first one
    // from the stash:
    console.log(
      `242 ${
        stash.length > lookahead
          ? `${`\u001b[${36}m${`intermediary()`}\u001b[${39}m`}: ${`\u001b[${32}m${`ENOUGH VALUES IN STASH`}\u001b[${39}m`}`
          : `${`\u001b[${36}m${`intermediary()`}\u001b[${39}m`}: ${`\u001b[${31}m${`NOT ENOUGH VALUES IN STASH, MOVE ON`}\u001b[${39}m`}`
      }`
    );
    if (stash.length > lookahead) {
      console.log(
        `250 ${`\u001b[${36}m${`intermediary()`}\u001b[${39}m`}: stash.length=${
          stash.length
        } >= lookahead=${lookahead} - ${`\u001b[${32}m${`CALL`}\u001b[${39}m`} ${`\u001b[${35}m${`reportFirstFromStash()`}\u001b[${39}m`}`
      );
      // the following function has "stash" in its scope and it will mutate
      // the stash:
      reportFirstFromStash();
      console.log(
        `258 ${`\u001b[${90}m${`██ stash`}\u001b[${39}m`} = ${JSON.stringify(
          stash,
          null,
          4
        )}`
      );
    }
  }

  traverseInner(
    tree1,
    intermediary,
    {
      depth: -1,
      path: "",
    },
    stop1
  );

  console.log(`277 ███████████████████████████████████████`);
  console.log(`278 ███████████████████████████████████████`);
  console.log(`279 ███████████████████████████████████████`);
  console.log(`280 ███████████████████████████████████████`);

  // once the end is reached, clean up the stash - that's the remaining elements
  // that will have less "future" reported in them, compared to what was
  // requested by "lookahead"
  if (stash.length) {
    console.log(`286 REMAINING STASH`);
    for (let i = 0, len = stash.length; i < len; i++) {
      console.log(`288 report ${i + 1}/${stash.length} stash element`);
      reportFirstFromStash();
      console.log(
        `291 ${`\u001b[${90}m${`██ stash`}\u001b[${39}m`} = ${JSON.stringify(
          stash,
          null,
          4
        )}`
      );
    }
  }
}

// -----------------------------------------------------------------------------

export { traverse, version };
