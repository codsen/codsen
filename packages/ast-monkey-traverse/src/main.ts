/* eslint @typescript-eslint/explicit-module-boundary-types:0 */

import { deepClone as clone, isPlainObject as isObj } from "codsen-utils";

import { version as v } from "../package.json";

const version: string = v;

declare let DEV: boolean;

export interface Stop {
  now: boolean;
}

export type TreePrimitive = string | number | boolean | null | undefined;
export type TreeValue = TreePrimitive | TreeArray | TreeObject;
export interface TreeArray extends Array<TreeValue> {}
export interface TreeObject {
  [key: string]: TreeValue;
}
export type ReadonlyTreeValue =
  | TreePrimitive
  | ReadonlyTreeArray
  | ReadonlyTreeObject;
export interface ReadonlyTreeArray extends ReadonlyArray<ReadonlyTreeValue> {}
export interface ReadonlyTreeObject {
  readonly [key: string]: ReadonlyTreeValue;
}
export type ReadonlyTreeContainer = ReadonlyTreeArray | ReadonlyTreeObject;

export interface InnerObj {
  depth: number;
  path: string;
  pathSegments: readonly string[];
  topmostKey?: string;
  parent: ReadonlyTreeContainer;
  parentType: "array" | "object";
  parentKey: string | null;
}

export type Callback = (
  key: string | Exclude<TreeValue, undefined>,
  val: TreeValue | undefined,
  innerObj: InnerObj,
  stop: Stop,
) => TreeValue;

function invalidTree(reason: string): never {
  throw new TypeError(
    `ast-monkey-traverse/traverse(): [THROW_ID_02] The first argument must be an acyclic, unaliased tree of arrays, plain objects, and supported primitive values; ${reason}.`,
  );
}

function isArrayIndex(key: string, length: number): boolean {
  let index = Number(key);
  return (
    Number.isInteger(index) &&
    index >= 0 &&
    index < length &&
    `${index}` === key
  );
}

function validateTree(value: unknown): asserts value is TreeValue {
  let pending = [value];
  let seen = new WeakSet<object>();

  while (pending.length) {
    let current = pending.pop();
    if (
      current === null ||
      current === undefined ||
      typeof current === "string" ||
      typeof current === "number" ||
      typeof current === "boolean"
    ) {
      continue;
    }
    if (typeof current !== "object") {
      invalidTree(`encountered an unsupported ${typeof current} value`);
    }
    if (seen.has(current)) {
      invalidTree("encountered a cycle or repeated object reference");
    }
    seen.add(current);

    if (Array.isArray(current)) {
      if (Object.getPrototypeOf(current) !== Array.prototype) {
        invalidTree("encountered an array with a custom prototype");
      }
      for (let key of Reflect.ownKeys(current)) {
        if (key === "length") {
          continue;
        }
        if (typeof key !== "string") {
          invalidTree("encountered a symbol-keyed array property");
        }
        if (!isArrayIndex(key, current.length)) {
          invalidTree(
            `encountered the non-index array property ${JSON.stringify(key)}`,
          );
        }
        let descriptor = Object.getOwnPropertyDescriptor(current, key);
        if (!descriptor?.enumerable || !("value" in descriptor)) {
          invalidTree(
            `encountered an accessor or non-enumerable array index ${key}`,
          );
        }
        pending.push(descriptor.value);
      }
      continue;
    }

    if (Object.getPrototypeOf(current) !== Object.prototype) {
      invalidTree("encountered a non-plain or custom-prototype object");
    }
    for (let key of Reflect.ownKeys(current)) {
      if (typeof key !== "string") {
        invalidTree("encountered a symbol-keyed object property");
      }
      let descriptor = Object.getOwnPropertyDescriptor(current, key);
      if (!descriptor?.enumerable || !("value" in descriptor)) {
        invalidTree(
          `encountered an accessor or non-enumerable property ${JSON.stringify(key)}`,
        );
      }
      pending.push(descriptor.value);
    }
  }
}

// Detaches one just-visited child for storing in a `parent` snapshot.
// Primitives can hold no references, so only the rest is worth a clone.
function snapshotChild(value: any): any {
  return typeof value === "object" && value !== null ? clone(value) : value;
}

// Gives callbacks a deeply read-only view over detached snapshot storage.
// Nested objects are wrapped only when read, and the caller caches each root
// view until its snapshot changes.
function readonlySnapshot(value: any): any {
  let proxies: WeakMap<object, object> | undefined;
  let handler: ProxyHandler<object> = {
    defineProperty: () => true,
    deleteProperty: () => true,
    get: (target, property, receiver) =>
      wrap(Reflect.get(target, property, receiver)),
    set: () => true,
    setPrototypeOf: () => true,
  };

  function wrap(target: any): any {
    if (typeof target !== "object" || target === null) {
      return target;
    }
    proxies ||= new WeakMap<object, object>();
    let existing = proxies.get(target);
    if (existing) {
      return existing;
    }
    let proxy = new Proxy(target, handler);
    proxies.set(target, proxy);
    return proxy;
  }

  return new Proxy(value, handler);
}

/**
 * Utility library to traverse AST
 */
function traverse(tree1: TreeValue, cb1: Callback): TreeValue {
  if (typeof cb1 !== "function") {
    throw new TypeError(
      `ast-monkey-traverse/traverse(): [THROW_ID_01] The second argument must be a callback function. It was ${typeof cb1}.`,
    );
  }
  validateTree(tree1);
  let stop2: Stop = { now: false };

  // Every node written, deleted or spliced anywhere in the tree bumps this.
  // Each frame records the value its `parent` snapshot was taken at and
  // re-clones only once the counter has moved on - siblings whose parent did
  // not change share one snapshot instead of deep-cloning it once each. The
  // counter being shared through this closure is what makes an edit deep
  // inside a child subtree invalidate every ancestor's snapshot as well.
  let mutations = 0;

  //
  // traverseInner() needs a wrapper to shield the last args from the outside
  //
  function traverseInner(
    treeOriginal: TreeValue,
    callback: Callback,
    depth: number,
    path: string,
    pathSegments: string[],
    parentKey: string | null,
    topmostKey: string | undefined,
    stop: Stop,
  ): TreeValue {
    DEV && console.log(`======= traverseInner() =======`);
    let tree: any = treeOriginal;

    DEV &&
      console.log(
        `${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`parentKey`}\u001b[${39}m`} = ${JSON.stringify(
          parentKey,
          null,
          4,
        )}`,
      );
    // The snapshot handed to callbacks as `innerObj.parent`. It is deep-cloned
    // in full only once per frame; afterwards each sibling gets a shallow copy
    // with the one changed slot restated, so consecutive snapshots share the
    // parts neither of them touched. All of them stay detached from the live
    // tree, which is what the no-mutation guarantee rests on.
    let parent: any;
    let parentView: any;
    let parentSnappedAt = -1;
    // Which single slot the previous iteration changed, applied only once a
    // later sibling actually asks for a snapshot. A container's last child
    // never has one asked for, so it never pays for one.
    let pendingSlot: any;
    let pendingRemoved = false;

    if (Array.isArray(tree)) {
      DEV && console.log(`tree is array!`);
      // the length is read live: the splices below only ever shorten the
      // array, so a stale upper bound would merely spin through out-of-range
      // indices, splicing nothing
      for (let i = 0; i < tree.length; i++) {
        DEV &&
          console.log(
            `a ${`\u001b[${36}m${`--------------------------------------------`}\u001b[${39}m`}`,
          );
        if (stop.now) {
          DEV && console.log(`${`\u001b[${31}m${`BREAK`}\u001b[${39}m`}`);
          break;
        }
        let currentValue = tree[i];
        if (currentValue === undefined) {
          tree.splice(i, 1);
          mutations += 1;
          // a splice shifts every later index, so no single-slot patch
          // describes it - the next snapshot has to be cloned outright
          pendingSlot = undefined;
          i -= 1;
          continue;
        }
        let currentPath = path ? `${path}.${i}` : `${i}`;
        let currentPathSegments = [...pathSegments, `${i}`];
        DEV &&
          console.log(
            `${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`currentPath`}\u001b[${39}m`} = ${JSON.stringify(
              currentPath,
              null,
              4,
            )}`,
          );
        if (parentSnappedAt !== mutations) {
          if (pendingSlot === undefined) {
            parent = clone(tree);
          } else {
            parent = parent.slice();
            if (pendingRemoved) {
              parent.splice(pendingSlot, 1);
            } else {
              parent[pendingSlot] = snapshotChild(tree[pendingSlot]);
            }
          }
          parentView = readonlySnapshot(parent);
          parentSnappedAt = mutations;
        }
        pendingSlot = undefined;
        let innerObj: InnerObj = {
          depth,
          path: currentPath,
          pathSegments: currentPathSegments,
          parent: parentView,
          parentType: "array",
          parentKey,
        };
        if (topmostKey !== undefined) {
          innerObj.topmostKey = topmostKey;
        }
        let res = callback(currentValue, undefined, innerObj, stop);
        // A callback receives the live cloned container and can edit any level
        // of it synchronously. Conservatively invalidate ancestor snapshots;
        // proving that no deep edit happened would cost a scan or a proxy on
        // every container callback.
        if (typeof currentValue === "object" && currentValue !== null) {
          mutations += 1;
        }
        // primitives - the bulk of any AST - can hold no references and have
        // nothing to descend into, so they skip both calls below outright
        if (typeof res === "object" && res !== null) {
          if (res !== currentValue) {
            res = clone(res);
          }
          res = traverseInner(
            res,
            callback,
            depth + 1,
            currentPath,
            currentPathSegments,
            `${i}`,
            topmostKey,
            stop,
          );
        }
        let spliced = false;
        if (Number.isNaN(res) && i < tree.length) {
          tree.splice(i, 1);
          mutations += 1;
          spliced = true;
        } else if (res !== currentValue) {
          tree[i] = res;
          mutations += 1;
        }
        // Depth-first order means index `i` is the only slot that can have
        // moved since the snapshot above, so record it and let the next
        // sibling, if there is one, fold it into that snapshot
        if (parentSnappedAt !== mutations) {
          pendingSlot = i;
          pendingRemoved = spliced;
        }
        if (spliced) {
          i -= 1;
        }
      }
    } else if (isObj(tree)) {
      DEV && console.log(`tree is object`);

      for (let key of Object.keys(tree)) {
        DEV &&
          console.log(
            `${`\u001b[${36}m${`--------------------------------------------`}\u001b[${39}m`}`,
          );
        if (stop.now) {
          DEV && console.log(`${`\u001b[${31}m${`BREAK`}\u001b[${39}m`}`);
          break;
        }
        DEV &&
          console.log(
            `FIY, ${`\u001b[${33}m${`path`}\u001b[${39}m`} = ${JSON.stringify(
              path,
              null,
              4,
            )}`,
          );
        let currentPath = path ? `${path}.${key}` : key;
        let currentPathSegments = [...pathSegments, key];
        DEV &&
          console.log(
            `${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`currentPath`}\u001b[${39}m`} = ${JSON.stringify(
              currentPath,
              null,
              4,
            )}`,
          );
        if (depth === 0) {
          topmostKey = key;
        }
        if (parentSnappedAt !== mutations) {
          if (pendingSlot === undefined) {
            parent = clone(tree);
          } else {
            parent = { ...parent };
            if (pendingRemoved) {
              delete parent[pendingSlot];
            } else {
              parent[pendingSlot] = snapshotChild(tree[pendingSlot]);
            }
          }
          parentView = readonlySnapshot(parent);
          parentSnappedAt = mutations;
        }
        pendingSlot = undefined;
        let currentValue = tree[key];
        let innerObj: InnerObj = {
          depth,
          path: currentPath,
          pathSegments: currentPathSegments,
          parent: parentView,
          parentType: "object",
          parentKey,
        };
        if (topmostKey !== undefined) {
          innerObj.topmostKey = topmostKey;
        }
        let res = callback(key, currentValue, innerObj, stop);
        if (typeof currentValue === "object" && currentValue !== null) {
          mutations += 1;
        }
        if (typeof res === "object" && res !== null) {
          if (res !== currentValue) {
            res = clone(res);
          }
          res = traverseInner(
            res,
            callback,
            depth + 1,
            currentPath,
            currentPathSegments,
            key,
            topmostKey,
            stop,
          );
        }
        let removed = false;
        if (Number.isNaN(res)) {
          delete tree[key];
          mutations += 1;
          removed = true;
        } else if (res !== currentValue) {
          (tree as TreeObject)[key] = res;
          mutations += 1;
        }
        if (parentSnappedAt !== mutations) {
          pendingSlot = key;
          pendingRemoved = removed;
        }
      }
    }
    DEV && console.log(`just returning tree, ${JSON.stringify(tree, null, 4)}`);
    return tree;
  }
  return traverseInner(clone(tree1), cb1, 0, "", [], null, undefined, stop2);
}

// -----------------------------------------------------------------------------

export { traverse, version };
