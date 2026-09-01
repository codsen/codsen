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

/** Return this value from a traversal callback to delete the current node. */
const DELETE: unique symbol = Symbol.for("ast-monkey-traverse.delete");
const hasOwn = Object.prototype.hasOwnProperty;

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
  key: string | TreeValue,
  val: TreeValue | undefined,
  innerObj: InnerObj,
  stop: Stop,
) => TreeValue | typeof DELETE;

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
  if (key === "__proto__") {
    Object.defineProperty(target, key, {
      configurable: true,
      enumerable: true,
      value,
      writable: true,
    });
  } else {
    (target as TreeObject)[key] = value;
  }
}

function isTreePrimitive(value: unknown): value is TreePrimitive {
  return (
    value === null ||
    value === undefined ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  );
}

// Validates and clones without borrowing the JavaScript call stack. When a
// callback edited a container, enumerable accessors are read once and become
// ordinary data properties, matching the historical clone-before-descent
// behaviour.
function cloneTree(value: unknown, normalizeAccessors = false): TreeValue {
  if (isTreePrimitive(value)) {
    return value;
  }
  if (typeof value !== "object") {
    invalidTree(`encountered an unsupported ${typeof value} value`);
  }

  let sourceRoot = value as TreeArray | TreeObject;
  let root = createContainer(sourceRoot);
  let pending: CloneFrame[] = [{ source: sourceRoot, target: root }];
  let seen = new WeakSet<object>([sourceRoot]);

  while (pending.length) {
    let frame = pending.pop() as CloneFrame;
    let { source, target } = frame;
    let arraySource = Array.isArray(source);
    if (
      Object.getPrototypeOf(source) !==
      (arraySource ? Array.prototype : Object.prototype)
    ) {
      invalidTree(
        arraySource
          ? "encountered an array with a custom prototype"
          : "encountered a non-plain or custom-prototype object",
      );
    }

    for (let key of Reflect.ownKeys(source)) {
      if (arraySource && key === "length") {
        continue;
      }
      if (typeof key !== "string") {
        invalidTree(
          arraySource
            ? "encountered a symbol-keyed array property"
            : "encountered a symbol-keyed object property",
        );
      }
      if (arraySource && !isArrayIndex(key, (source as TreeArray).length)) {
        invalidTree(
          `encountered the non-index array property ${JSON.stringify(key)}`,
        );
      }
      let descriptor = Object.getOwnPropertyDescriptor(
        source,
        key,
      ) as PropertyDescriptor;
      if (!descriptor.enumerable) {
        invalidTree(
          arraySource
            ? `encountered a non-enumerable array index ${key}`
            : `encountered a non-enumerable property ${JSON.stringify(key)}`,
        );
      }
      if (!("value" in descriptor) && !normalizeAccessors) {
        invalidTree(
          arraySource
            ? `encountered an accessor array index ${key}`
            : `encountered an accessor property ${JSON.stringify(key)}`,
        );
      }
      let child =
        "value" in descriptor ? descriptor.value : (source as TreeObject)[key];
      if (isTreePrimitive(child)) {
        setOwnValue(target, key, child);
      } else if (typeof child === "object") {
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
        invalidTree(`encountered an unsupported ${typeof child} value`);
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
    node.entries.set(key, [
      { value: deletedSnapshot, version: version - 1 },
      { value, version },
    ]);
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

interface TraverseFrame {
  container: TreeArray | TreeObject;
  depth: number;
  index: number;
  keys: string[];
  parentKey: string | null;
  path?: string;
  pathNode?: PathNode;
  pathSegments?: string[];
  snapshot?: SnapshotNode;
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
  let tree = cloneTree(tree1);
  if (typeof tree !== "object" || tree === null) {
    return tree;
  }
  let version = 0;
  let stop: Stop = { now: false };
  let stack: TraverseFrame[] = [
    {
      container: tree,
      depth: 0,
      index: 0,
      keys: Array.isArray(tree) ? [] : Object.keys(tree),
      parentKey: null,
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
      if (!hasOwn.call(arrayContainer, frame.index)) {
        frame.index += 1;
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
    let topmostKey =
      frame.depth === 0 && !arrayParent ? slot : frame.topmostKey;
    let parentView: ReadonlyTreeContainer | undefined;
    let callbackVersion = version;
    let currentPath: string | undefined;
    let currentPathSegments: string[] | undefined;
    let innerObj: InnerObj;

    if (frame.depth < 100) {
      currentPath = frame.path ? `${frame.path}.${slot}` : slot;
      currentPathSegments = frame.pathSegments
        ? [...frame.pathSegments, slot]
        : [slot];
      innerObj = {
        depth: frame.depth,
        path: currentPath,
        pathSegments: currentPathSegments,
        get parent(): ReadonlyTreeContainer {
          frame.snapshot ||= snapshotTree(frame.container);
          parentView ||= readonlySnapshot(frame.snapshot, callbackVersion);
          return parentView as ReadonlyTreeContainer;
        },
        parentType: arrayParent ? "array" : "object",
        parentKey: frame.parentKey,
        ...(topmostKey === undefined ? {} : { topmostKey }),
      };
    } else {
      let cachedSegments: string[] | undefined;
      let cachedPath: string | undefined;
      innerObj = {
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
        get parent(): ReadonlyTreeContainer {
          frame.snapshot ||= snapshotTree(frame.container);
          parentView ||= readonlySnapshot(frame.snapshot, callbackVersion);
          return parentView as ReadonlyTreeContainer;
        },
        parentType: arrayParent ? "array" : "object",
        parentKey: frame.parentKey,
        ...(topmostKey === undefined ? {} : { topmostKey }),
      };
    }

    let result = cb1(
      arrayParent ? currentValue : slot,
      arrayParent ? undefined : currentValue,
      innerObj,
      stop,
    );

    let removed = result === DELETE;
    let resultIsContainer = typeof result === "object" && result !== null;
    let currentIsContainer =
      typeof currentValue === "object" && currentValue !== null;
    let changedContainer =
      resultIsContainer &&
      currentIsContainer &&
      result === currentValue &&
      Boolean(frame.snapshot);
    let adopted: TreeValue = result === DELETE ? currentValue : result;
    let snapshotValue: SnapshotNode | undefined;

    if (!removed && !resultIsContainer && !isTreePrimitive(result)) {
      invalidTree(`encountered an unsupported ${typeof result} value`);
    }

    if (!removed && resultIsContainer) {
      if (result !== currentValue || changedContainer) {
        adopted = cloneTree(result, true);
        if (frame.snapshot) {
          snapshotValue = snapshotTree(adopted as TreeArray | TreeObject);
        }
      }
    }

    if (removed) {
      if (arrayContainer) {
        arrayContainer.splice(frame.index, 1);
        version += 1;
        if (frame.snapshot) {
          spliceSnapshot(frame.snapshot, frame.index, version);
        }
      } else {
        delete (frame.container as TreeObject)[slot];
        version += 1;
        if (frame.snapshot) {
          writeSnapshot(frame.snapshot, slot, deletedSnapshot, version);
        }
        frame.index += 1;
      }
    } else {
      if (!Object.is(adopted, currentValue) || changedContainer) {
        setOwnValue(frame.container, slot, adopted);
        version += 1;
        if (frame.snapshot) {
          writeSnapshot(
            frame.snapshot,
            slot,
            snapshotValue === undefined
              ? (adopted as TreePrimitive)
              : snapshotValue,
            version,
          );
        }
      }
      frame.index += 1;

      if (!stop.now && typeof adopted === "object" && adopted !== null) {
        stack.push({
          container: adopted,
          depth: frame.depth + 1,
          index: 0,
          keys: Array.isArray(adopted) ? [] : Object.keys(adopted),
          parentKey: slot,
          ...(currentPath === undefined ? {} : { path: currentPath }),
          pathNode,
          ...(currentPathSegments === undefined
            ? {}
            : { pathSegments: currentPathSegments }),
          ...(snapshotValue ? { snapshot: snapshotValue } : {}),
          ...(topmostKey === undefined ? {} : { topmostKey }),
        });
      }
    }
  }

  DEV && stop.now && console.log(`[31mBREAK[39m`);
  DEV && console.log("just returning tree", tree);
  return tree;
}

// -----------------------------------------------------------------------------

export { DELETE, traverse, version };
