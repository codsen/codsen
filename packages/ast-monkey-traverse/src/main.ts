/* eslint @typescript-eslint/explicit-module-boundary-types:0 */

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

interface CloneFrame {
  source: TreeArray | TreeObject;
  target: TreeArray | TreeObject;
}

function createContainer(
  source: TreeArray | TreeObject,
): TreeArray | TreeObject {
  return Array.isArray(source) ? new Array(source.length) : {};
}

function setOwnValue(
  target: TreeArray | TreeObject,
  key: string,
  value: TreeValue,
): void {
  Object.defineProperty(target, key, {
    configurable: true,
    enumerable: true,
    value,
    writable: true,
  });
}

// Clones a validated tree without borrowing the JavaScript call stack. When a
// callback edited a container, enumerable accessors are read once and become
// ordinary data properties, matching the historical clone-before-descent
// behaviour. Everything else is checked by validateTree() afterwards.
function cloneTree(value: TreeValue, normalizeAccessors = false): TreeValue {
  if (typeof value !== "object" || value === null) {
    return value;
  }

  let root = createContainer(value);
  let pending: CloneFrame[] = [{ source: value, target: root }];
  let seen = new WeakSet<object>([value]);

  while (pending.length) {
    let frame = pending.pop() as CloneFrame;
    let { source, target } = frame;
    if (normalizeAccessors) {
      if (Array.isArray(source)) {
        if (Object.getPrototypeOf(source) !== Array.prototype) {
          invalidTree("encountered an array with a custom prototype");
        }
        for (let key of Reflect.ownKeys(source)) {
          if (key === "length") {
            continue;
          }
          if (typeof key !== "string") {
            invalidTree("encountered a symbol-keyed array property");
          }
          if (!isArrayIndex(key, source.length)) {
            invalidTree(
              `encountered the non-index array property ${JSON.stringify(key)}`,
            );
          }
          if (!Object.getOwnPropertyDescriptor(source, key)?.enumerable) {
            invalidTree(`encountered a non-enumerable array index ${key}`);
          }
        }
      } else {
        if (Object.getPrototypeOf(source) !== Object.prototype) {
          invalidTree("encountered a non-plain or custom-prototype object");
        }
        for (let key of Reflect.ownKeys(source)) {
          if (typeof key !== "string") {
            invalidTree("encountered a symbol-keyed object property");
          }
          if (!Object.getOwnPropertyDescriptor(source, key)?.enumerable) {
            invalidTree(
              `encountered a non-enumerable property ${JSON.stringify(key)}`,
            );
          }
        }
      }
    }
    for (let key of Object.keys(source)) {
      let descriptor = Object.getOwnPropertyDescriptor(
        source,
        key,
      ) as PropertyDescriptor;
      let child =
        "value" in descriptor ? descriptor.value : (source as TreeObject)[key];
      if (typeof child === "object" && child !== null) {
        if (seen.has(child)) {
          invalidTree("encountered a cycle or repeated object reference");
        }
        seen.add(child);
        let childTarget = createContainer(child as TreeArray | TreeObject);
        setOwnValue(target, key, childTarget);
        pending.push({
          source: child as TreeArray | TreeObject,
          target: childTarget,
        });
      } else {
        setOwnValue(target, key, child as TreeValue);
      }
    }
  }

  return root;
}

const deletedSnapshot = Symbol("deleted snapshot entry");
type SnapshotValue = TreePrimitive | SnapshotNode;
type SnapshotEntry = SnapshotValue | typeof deletedSnapshot;

interface SnapshotChange {
  version: number;
  value: SnapshotEntry;
}

interface SnapshotNode {
  array: boolean;
  entries: Map<string, SnapshotChange[]>;
  lengths?: Array<{ version: number; value: number }>;
}

function snapshotTree(value: TreeArray | TreeObject): SnapshotNode {
  let root: SnapshotNode = {
    array: Array.isArray(value),
    entries: new Map(),
    ...(Array.isArray(value)
      ? { lengths: [{ value: value.length, version: 0 }] }
      : {}),
  };
  let pending: Array<{ source: TreeArray | TreeObject; target: SnapshotNode }> =
    [{ source: value, target: root }];

  while (pending.length) {
    let frame = pending.pop() as {
      source: TreeArray | TreeObject;
      target: SnapshotNode;
    };
    let { source, target } = frame;
    for (let key of Object.keys(source)) {
      let child = (source as TreeObject)[key];
      if (typeof child === "object" && child !== null) {
        let childTarget: SnapshotNode = {
          array: Array.isArray(child),
          entries: new Map(),
          ...(Array.isArray(child)
            ? { lengths: [{ value: child.length, version: 0 }] }
            : {}),
        };
        target.entries.set(key, [{ value: childTarget, version: 0 }]);
        pending.push({ source: child, target: childTarget });
      } else {
        target.entries.set(key, [{ value: child, version: 0 }]);
      }
    }
  }

  return root;
}

function atVersion<T extends { version: number }>(
  history: T[],
  version: number,
): T {
  let low = 0;
  let high = history.length - 1;
  while (low < high) {
    let middle = Math.ceil((low + high) / 2);
    if (history[middle].version <= version) {
      low = middle;
    } else {
      high = middle - 1;
    }
  }
  return history[low];
}

function readSnapshot(
  node: SnapshotNode,
  key: string,
  version: number,
): SnapshotEntry {
  let history = node.entries.get(key);
  return history ? atVersion(history, version).value : deletedSnapshot;
}

function snapshotLength(node: SnapshotNode, version: number): number {
  return atVersion(
    node.lengths as Array<{ version: number; value: number }>,
    version,
  ).value;
}

function writeSnapshot(
  node: SnapshotNode,
  key: string,
  value: SnapshotEntry,
  version: number,
): void {
  let history = node.entries.get(key);
  if (history) {
    history.push({ value, version });
  } else {
    node.entries.set(key, [{ value, version }]);
  }
}

function spliceSnapshot(
  node: SnapshotNode,
  index: number,
  version: number,
): void {
  let previousVersion = version - 1;
  let oldLength = snapshotLength(node, previousVersion);
  for (let current = index; current < oldLength - 1; current += 1) {
    writeSnapshot(
      node,
      `${current}`,
      readSnapshot(node, `${current + 1}`, previousVersion),
      version,
    );
  }
  if (oldLength) {
    writeSnapshot(node, `${oldLength - 1}`, deletedSnapshot, version);
  }
  (node.lengths as Array<{ version: number; value: number }>).push({
    value: Math.max(0, oldLength - 1),
    version,
  });
}

// Each callback receives a fresh proxy identity, but every proxy reads a
// particular immutable version of compact snapshot storage. Historical views
// therefore remain stable without cloning the remaining subtree per node.
function readonlySnapshot(node: SnapshotNode, version: number): any {
  let proxies = new WeakMap<SnapshotNode, object>();

  function wrap(current: SnapshotNode): any {
    let existing = proxies.get(current);
    if (existing) {
      return existing;
    }
    let target: any = current.array
      ? new Array(snapshotLength(current, version))
      : {};
    let handler: ProxyHandler<object> = {
      defineProperty: () => true,
      deleteProperty: () => true,
      get: (unusedTarget, property, receiver) => {
        if (current.array && property === "length") {
          return snapshotLength(current, version);
        }
        if (typeof property === "string") {
          let entry = readSnapshot(current, property, version);
          if (entry !== deletedSnapshot) {
            return typeof entry === "object" && entry !== null
              ? wrap(entry)
              : entry;
          }
        }
        return Reflect.get(unusedTarget, property, receiver);
      },
      getOwnPropertyDescriptor: (unusedTarget, property) => {
        if (current.array && property === "length") {
          return Reflect.getOwnPropertyDescriptor(unusedTarget, property);
        }
        if (typeof property === "string") {
          let entry = readSnapshot(current, property, version);
          if (entry === deletedSnapshot) {
            return undefined;
          }
          return {
            configurable: true,
            enumerable: true,
            value:
              typeof entry === "object" && entry !== null ? wrap(entry) : entry,
            writable: true,
          };
        }
        return undefined;
      },
      has: (unusedTarget, property) =>
        (typeof property === "string" &&
          readSnapshot(current, property, version) !== deletedSnapshot) ||
        Reflect.has(unusedTarget, property),
      ownKeys: () => {
        let keys = [...current.entries]
          .filter(
            ([key]) => readSnapshot(current, key, version) !== deletedSnapshot,
          )
          .map(([key]) => key);
        return current.array ? [...keys, "length"] : keys;
      },
      set: () => true,
      setPrototypeOf: () => true,
    };
    let proxy = new Proxy(target, handler);
    proxies.set(current, proxy);
    return proxy;
  }

  return wrap(node);
}

interface MutableView {
  changed: () => boolean;
  proxy: TreeArray | TreeObject;
  unwrap: (value: TreeValue) => TreeValue;
}

function mutableView(value: TreeArray | TreeObject): MutableView {
  let changed = false;
  let targets = new WeakMap<object, object>();
  let proxies = new WeakMap<object, object>();
  let handler: ProxyHandler<object> = {
    defineProperty: (target, property, descriptor) => {
      changed = true;
      return Reflect.defineProperty(target, property, descriptor);
    },
    deleteProperty: (target, property) => {
      changed = true;
      return Reflect.deleteProperty(target, property);
    },
    get: (target, property, receiver) =>
      wrap(Reflect.get(target, property, receiver)),
    set: (target, property, child, receiver) => {
      changed = true;
      return Reflect.set(target, property, unwrap(child), receiver);
    },
    setPrototypeOf: (target, prototype) => {
      changed = true;
      return Reflect.setPrototypeOf(target, prototype);
    },
  };

  function wrap(target: any): any {
    if (typeof target !== "object" || target === null) {
      return target;
    }
    let existing = proxies.get(target);
    if (existing) {
      return existing;
    }
    let proxy = new Proxy(target, handler);
    proxies.set(target, proxy);
    targets.set(proxy, target);
    return proxy;
  }

  function unwrap(child: any): any {
    return targets.get(child) || child;
  }

  return {
    changed: () => changed,
    proxy: wrap(value),
    unwrap,
  };
}

interface PathNode {
  parent?: PathNode;
  segment: string;
}

function materializePath(node: PathNode): string[] {
  let result: string[] = [];
  let current: PathNode | undefined = node;
  while (current) {
    result.push(current.segment);
    current = current.parent;
  }
  return result.reverse();
}

function legacyPath(segments: string[]): string {
  let result = "";
  for (let segment of segments) {
    result = result ? `${result}.${segment}` : segment;
  }
  return result;
}

/**
 * Utility library to traverse AST
 */
interface TraverseFrame {
  container: TreeArray | TreeObject;
  depth: number;
  index: number;
  keys: string[];
  parentKey: string | null;
  pathNode?: PathNode;
  snapshot: SnapshotNode;
  topmostKey?: string;
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

  let tree = cloneTree(tree1);
  if (typeof tree !== "object" || tree === null) {
    return tree;
  }
  let rootSnapshot = snapshotTree(tree) as SnapshotNode;
  let version = 0;
  let stop: Stop = { now: false };
  let stack: TraverseFrame[] = [
    {
      container: tree,
      depth: 0,
      index: 0,
      keys: Array.isArray(tree) ? [] : Object.keys(tree),
      parentKey: null,
      snapshot: rootSnapshot,
    },
  ];

  DEV && console.log(`======= traverse() =======`);

  while (stack.length && !stop.now) {
    let frame = stack[stack.length - 1];
    let arrayContainer = Array.isArray(frame.container)
      ? frame.container
      : undefined;
    let arrayParent = Boolean(arrayContainer);
    let slot: string;

    if (arrayContainer) {
      if (frame.index >= arrayContainer.length) {
        stack.pop();
        continue;
      }
      if (arrayContainer[frame.index] === undefined) {
        arrayContainer.splice(frame.index, 1);
        version += 1;
        spliceSnapshot(frame.snapshot, frame.index, version);
        continue;
      }
      slot = `${frame.index}`;
    } else {
      if (frame.index >= frame.keys.length) {
        stack.pop();
        continue;
      }
      slot = frame.keys[frame.index];
    }

    DEV && console.log(`[36m--------------------------------------------[39m`);

    let currentValue = (frame.container as TreeObject)[slot];
    let pathNode: PathNode = { parent: frame.pathNode, segment: slot };
    let cachedSegments: string[] | undefined;
    let cachedPath: string | undefined;
    let topmostKey =
      frame.depth === 0 && !arrayParent ? slot : frame.topmostKey;
    let parentView = readonlySnapshot(frame.snapshot, version);
    let innerObj = {
      depth: frame.depth,
      get path() {
        cachedSegments ||= materializePath(pathNode);
        cachedPath ??= legacyPath(cachedSegments);
        return cachedPath;
      },
      get pathSegments() {
        cachedSegments ||= materializePath(pathNode);
        return cachedSegments;
      },
      parent: parentView,
      parentType: arrayParent ? ("array" as const) : ("object" as const),
      parentKey: frame.parentKey,
      ...(topmostKey === undefined ? {} : { topmostKey }),
    } satisfies InnerObj;

    let mutable =
      typeof currentValue === "object" && currentValue !== null
        ? mutableView(currentValue)
        : undefined;
    let callbackValue = mutable ? mutable.proxy : currentValue;
    let result = cb1(
      arrayParent ? (callbackValue as Exclude<TreeValue, undefined>) : slot,
      arrayParent ? undefined : callbackValue,
      innerObj,
      stop,
    );
    result = mutable ? mutable.unwrap(result) : result;

    let removed = Number.isNaN(result);
    let resultIsContainer = typeof result === "object" && result !== null;
    let currentIsContainer =
      typeof currentValue === "object" && currentValue !== null;
    let changedContainer =
      resultIsContainer &&
      currentIsContainer &&
      result === currentValue &&
      Boolean(mutable?.changed());
    let adopted = result;
    let snapshotValue: SnapshotValue | undefined;

    if (!removed && resultIsContainer) {
      if (result !== currentValue || changedContainer) {
        adopted = cloneTree(result, true);
        validateTree(adopted);
        snapshotValue = snapshotTree(adopted as TreeArray | TreeObject);
      } else {
        snapshotValue = readSnapshot(
          frame.snapshot,
          slot,
          version,
        ) as SnapshotNode;
      }
    }

    if (removed) {
      if (arrayContainer) {
        arrayContainer.splice(frame.index, 1);
        version += 1;
        spliceSnapshot(frame.snapshot, frame.index, version);
      } else {
        delete (frame.container as TreeObject)[slot];
        version += 1;
        writeSnapshot(frame.snapshot, slot, deletedSnapshot, version);
        frame.index += 1;
      }
    } else {
      if (adopted !== currentValue || changedContainer) {
        setOwnValue(frame.container, slot, adopted);
        version += 1;
        writeSnapshot(
          frame.snapshot,
          slot,
          snapshotValue === undefined
            ? (adopted as TreePrimitive)
            : snapshotValue,
          version,
        );
      }
      frame.index += 1;

      if (!stop.now && typeof adopted === "object" && adopted !== null) {
        stack.push({
          container: adopted,
          depth: frame.depth + 1,
          index: 0,
          keys: Array.isArray(adopted) ? [] : Object.keys(adopted),
          parentKey: slot,
          pathNode,
          snapshot: snapshotValue as SnapshotNode,
          ...(topmostKey === undefined ? {} : { topmostKey }),
        });
      }
    }
  }

  DEV && stop.now && console.log(`[31mBREAK[39m`);
  DEV && console.log("just returning tree", tree);
  validateTree(tree);
  return tree;
}

// -----------------------------------------------------------------------------

export { traverse, version };
