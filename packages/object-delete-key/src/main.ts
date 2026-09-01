import { compare } from "ast-compare";
import { formatDiagnosticValue, match } from "codsen-utils";

import { version as v } from "../package.json";

const version: string = v;
const hasOwn = Object.prototype.hasOwnProperty;
const functionToString = Function.prototype.toString;
const matchOptions = Object.freeze({ caseSensitiveMatch: true });
const ERROR_PREFIX = "object-delete-key/deleteKey():";
const ARRAY_CONSTRUCTOR_SOURCE = functionToString.call(Array);
const OBJECT_CONSTRUCTOR_SOURCE = functionToString.call(Object);

export type TreePrimitive = string | number | boolean | null | undefined;

export interface ReadonlyTreeObject {
  readonly [key: string]: ReadonlyTreeValue;
}

export interface ReadonlyTreeArray extends ReadonlyArray<ReadonlyTreeValue> {}

export type ReadonlyTreeValue =
  | TreePrimitive
  | ReadonlyTreeObject
  | ReadonlyTreeArray;

export interface TreeObject {
  [key: string]: TreeValue;
}

/** @deprecated Use TreeObject. */
export type Obj = TreeObject;

export interface TreeArray extends Array<TreeValue> {}

export type TreeValue = TreePrimitive | TreeObject | TreeArray;

export type Only =
  | "any"
  | "all"
  | "everything"
  | "both"
  | "either"
  | "each"
  | "whatever"
  | "whatevs"
  | "e"
  | "array"
  | "arrays"
  | "arr"
  | "aray"
  | "a"
  | "object"
  | "objects"
  | "obj"
  | "ob"
  | "o";

export interface InputOpts {
  cleanup?: boolean | undefined;
  only?: Only | undefined;
  reportCompletionFunc?:
    | null
    | undefined
    | ((stats: Readonly<CompletionStats>) => void);
  reportProgressFunc?: null | undefined | ((percentageDone: number) => void);
  reportProgressFuncFrom?: number | undefined;
  reportProgressFuncTo?: number | undefined;
}

export type SelectorOpts<Value = ReadonlyTreeValue> =
  | { key: string; val?: Value | undefined }
  | { key?: null; val: Value };

export type Opts<Value = ReadonlyTreeValue> = InputOpts & SelectorOpts<Value>;

export interface CompletionStats {
  /** Number of entries removed because they matched the selector directly. */
  readonly directDeletions: number;
  /** Number of affected empty containers removed during cleanup. */
  readonly cleanupPrunedContainers: number;
  /** Deepest validated entry, where the root value has depth zero. */
  readonly maxDepth: number;
  /** Number of validated object properties and array slots, including holes. */
  readonly totalEntries: number;
  /** Number of object properties and array slots visited during transformation. */
  readonly visitedEntries: number;
  /** Best-effort elapsed time from input cloning and validation through completion. */
  readonly timeTakenInMilliseconds: number;
}

export interface Defaults {
  readonly cleanup: true;
  readonly key: null;
  readonly only: "any";
  readonly reportCompletionFunc: null;
  readonly reportProgressFunc: null;
  readonly reportProgressFuncFrom: 0;
  readonly reportProgressFuncTo: 100;
  readonly val: undefined;
}

type IsAny<T> = 0 extends 1 & T ? true : false;

type TreeCheck<T, Seen = never> =
  IsAny<T> extends true
    ? false
    : T extends unknown
      ? TreeCheckMember<T, Seen>
      : never;

type TreeCheckMember<T, Seen> = [T] extends [Seen]
  ? true
  : T extends TreePrimitive
    ? true
    : T extends (...args: never[]) => unknown
      ? false
      : T extends ReadonlyArray<infer Item>
        ? false extends TreeCheck<Item, Seen | T>
          ? false
          : true
        : T extends object
          ? Extract<keyof T, symbol> extends never
            ? false extends {
                [Key in keyof T]-?: TreeCheck<T[Key], Seen | T>;
              }[keyof T]
              ? false
              : true
            : false
          : false;

export type TreeConstraint<T> = false extends TreeCheck<T> ? never : unknown;

export type MutableTree<T> = T extends TreePrimitive
  ? T
  : T extends ReadonlyArray<infer Item>
    ? Array<MutableTree<Item>>
    : T extends object
      ? { -readonly [Key in keyof T]: MutableTree<T[Key]> }
      : never;

const canonicalDefaults: Defaults = {
  key: null,
  val: undefined,
  cleanup: true,
  only: "any",
  reportCompletionFunc: null,
  reportProgressFunc: null,
  reportProgressFuncFrom: 0,
  reportProgressFuncTo: 100,
};

const defaults: Readonly<Defaults> = Object.freeze({ ...canonicalDefaults });

type NormalizedOnly = "any" | "array" | "object";

interface ResolvedOpts {
  cleanup: boolean;
  hasKey: boolean;
  hasVal: boolean;
  key: string | null;
  only: NormalizedOnly;
  reportCompletionFunc: InputOpts["reportCompletionFunc"];
  reportProgressFunc: InputOpts["reportProgressFunc"];
  reportProgressFuncFrom: number;
  reportProgressFuncTo: number;
  val: ReadonlyTreeValue;
}

interface CloneFrame {
  depth: number;
  index: number;
  keys: string[];
  source: ReadonlyTreeArray | ReadonlyTreeObject;
  target: TreeArray | TreeObject;
}

interface Observation {
  cleanupPrunedContainers: number;
  directDeletions: number;
  lastProgress: number | undefined;
  maxDepth: number;
  reportCompletionFunc: NonNullable<
    ResolvedOpts["reportCompletionFunc"]
  > | null;
  reportProgressFunc: NonNullable<ResolvedOpts["reportProgressFunc"]> | null;
  reportProgressFuncFrom: number;
  reportProgressFuncTo: number;
  startedAt: number | null;
  totalEntries: number;
  visitedEntries: number;
}

interface TransformFrame {
  affected: boolean;
  container: TreeArray | TreeObject;
  empty: boolean;
  index: number;
  keys: string[];
  parent?: TransformFrame;
  parentReadIndex?: number;
  parentSlot?: string;
  writeIndex: number;
}

function safeDescribe(value: unknown): string {
  return formatDiagnosticValue(value, 4);
}

function assertInputPresent(argumentCount: number): void {
  if (argumentCount === 0) {
    throw new Error(
      `${ERROR_PREFIX} [THROW_ID_01] Please provide the first argument, including explicit null or undefined when that is the intended root value.`,
    );
  }
}

function assertOptionsObject(opts: unknown): asserts opts is object {
  let prototype: object | null;
  let prototypeWasRead = true;
  try {
    prototype =
      opts !== null && typeof opts === "object"
        ? Object.getPrototypeOf(opts)
        : null;
  } catch {
    prototype = null;
    prototypeWasRead = false;
  }
  if (
    !prototypeWasRead ||
    opts === null ||
    typeof opts !== "object" ||
    Array.isArray(opts) ||
    (prototype !== null &&
      !hasIntrinsicPrototype(prototype, OBJECT_CONSTRUCTOR_SOURCE))
  ) {
    throw new TypeError(
      `${ERROR_PREFIX} [THROW_ID_02] The second argument must be a plain options object; received ${safeDescribe(opts)} (type ${typeof opts}).`,
    );
  }
}

function ownOptionKeys(value: object): (string | symbol)[] {
  try {
    return Reflect.ownKeys(value);
  } catch (error) {
    throw new TypeError(
      `${ERROR_PREFIX} [THROW_ID_03] The options object could not be inspected safely: ${safeDescribe(error)}.`,
    );
  }
}

function resolveOptions(opts: unknown): ResolvedOpts {
  assertOptionsObject(opts);

  const snapshot = Object.create(null) as Record<string, unknown>;
  const keys = ownOptionKeys(opts);
  for (const key of keys) {
    if (
      typeof key !== "string" ||
      (key !== "key" &&
        key !== "val" &&
        key !== "cleanup" &&
        key !== "only" &&
        key !== "reportCompletionFunc" &&
        key !== "reportProgressFunc" &&
        key !== "reportProgressFuncFrom" &&
        key !== "reportProgressFuncTo")
    ) {
      throw new TypeError(
        `${ERROR_PREFIX} [THROW_ID_04] The options object contains an unknown field: ${safeDescribe(key)}.`,
      );
    }
    try {
      snapshot[key] = Reflect.get(opts, key);
    } catch (error) {
      throw new TypeError(
        `${ERROR_PREFIX} [THROW_ID_05] The options object could not be read safely: ${safeDescribe(error)}.`,
      );
    }
  }

  const hasKeyOption = hasOwn.call(snapshot, "key");
  const hasVal = hasOwn.call(snapshot, "val");
  let hasKey = false;
  let key: string | null = null;
  if (hasKeyOption) {
    if (snapshot.key === null) {
      key = null;
    } else if (typeof snapshot.key === "string") {
      hasKey = true;
      key = snapshot.key;
    } else {
      throw new TypeError(
        `${ERROR_PREFIX} [THROW_ID_06] The "key" option must be a string or the legacy null marker; received ${safeDescribe(snapshot.key)} (type ${typeof snapshot.key}).`,
      );
    }
  }
  if (!hasKey && !hasVal) {
    throw new Error(
      `${ERROR_PREFIX} [THROW_ID_07] Please provide at least an own "key" or "val" selector.`,
    );
  }

  const cleanup = snapshot.cleanup === undefined ? true : snapshot.cleanup;
  if (typeof cleanup !== "boolean") {
    throw new TypeError(
      `${ERROR_PREFIX} [THROW_ID_08] The "cleanup" option must be a boolean or undefined; received ${safeDescribe(snapshot.cleanup)} (type ${typeof snapshot.cleanup}).`,
    );
  }

  return {
    cleanup,
    hasKey,
    hasVal,
    key,
    only: normalizeOnly(snapshot.only),
    ...resolveReporting(snapshot),
    val: snapshot.val as ReadonlyTreeValue,
  };
}

function normalizeOnly(value: unknown): NormalizedOnly {
  if (value === undefined) {
    return "any";
  }
  if (typeof value !== "string") {
    throw new TypeError(
      `${ERROR_PREFIX} [THROW_ID_09] The "only" option must be a string or undefined; received ${safeDescribe(value)} (type ${typeof value}).`,
    );
  }
  switch (value.trim().toLowerCase()) {
    case "object":
    case "objects":
    case "obj":
    case "ob":
    case "o":
      return "object";
    case "array":
    case "arrays":
    case "arr":
    case "aray":
    case "a":
      return "array";
    case "any":
    case "all":
    case "everything":
    case "both":
    case "either":
    case "each":
    case "whatever":
    case "whatevs":
    case "e":
      return "any";
    default:
      throw new TypeError(
        `${ERROR_PREFIX} [THROW_ID_10] The "only" option was set to an unrecognised value: ${safeDescribe(value)}.`,
      );
  }
}

function resolveReporting(
  snapshot: Record<string, unknown>,
): Pick<
  ResolvedOpts,
  | "reportCompletionFunc"
  | "reportProgressFunc"
  | "reportProgressFuncFrom"
  | "reportProgressFuncTo"
> {
  const reportCompletionFunc =
    snapshot.reportCompletionFunc === undefined
      ? canonicalDefaults.reportCompletionFunc
      : snapshot.reportCompletionFunc;
  if (
    reportCompletionFunc !== null &&
    typeof reportCompletionFunc !== "function"
  ) {
    throw new TypeError(
      `${ERROR_PREFIX} [THROW_ID_11] The "reportCompletionFunc" option must be a function, null, or undefined; received ${safeDescribe(reportCompletionFunc)}.`,
    );
  }

  const reportProgressFunc =
    snapshot.reportProgressFunc === undefined
      ? canonicalDefaults.reportProgressFunc
      : snapshot.reportProgressFunc;
  if (reportProgressFunc !== null && typeof reportProgressFunc !== "function") {
    throw new TypeError(
      `${ERROR_PREFIX} [THROW_ID_12] The "reportProgressFunc" option must be a function, null, or undefined; received ${safeDescribe(reportProgressFunc)}.`,
    );
  }

  const reportProgressFuncFrom =
    snapshot.reportProgressFuncFrom === undefined
      ? canonicalDefaults.reportProgressFuncFrom
      : snapshot.reportProgressFuncFrom;
  if (!Number.isFinite(reportProgressFuncFrom)) {
    throw new TypeError(
      `${ERROR_PREFIX} [THROW_ID_13] The "reportProgressFuncFrom" option must be a finite number or undefined; received ${safeDescribe(reportProgressFuncFrom)}.`,
    );
  }

  const reportProgressFuncTo =
    snapshot.reportProgressFuncTo === undefined
      ? canonicalDefaults.reportProgressFuncTo
      : snapshot.reportProgressFuncTo;
  if (!Number.isFinite(reportProgressFuncTo)) {
    throw new TypeError(
      `${ERROR_PREFIX} [THROW_ID_14] The "reportProgressFuncTo" option must be a finite number or undefined; received ${safeDescribe(reportProgressFuncTo)}.`,
    );
  }
  if ((reportProgressFuncFrom as number) > (reportProgressFuncTo as number)) {
    throw new RangeError(
      `${ERROR_PREFIX} [THROW_ID_15] "reportProgressFuncFrom" cannot exceed "reportProgressFuncTo"; received ${reportProgressFuncFrom} and ${reportProgressFuncTo}.`,
    );
  }
  if (
    !Number.isFinite(
      (reportProgressFuncTo as number) - (reportProgressFuncFrom as number),
    )
  ) {
    throw new RangeError(
      `${ERROR_PREFIX} [THROW_ID_16] The progress range must have a finite span; received ${reportProgressFuncFrom} and ${reportProgressFuncTo}.`,
    );
  }

  return {
    reportCompletionFunc:
      reportCompletionFunc as ResolvedOpts["reportCompletionFunc"],
    reportProgressFunc:
      reportProgressFunc as ResolvedOpts["reportProgressFunc"],
    reportProgressFuncFrom: reportProgressFuncFrom as number,
    reportProgressFuncTo: reportProgressFuncTo as number,
  };
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

function makeContainer(
  source: ReadonlyTreeArray | ReadonlyTreeObject,
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

type InspectResult =
  | { keys: string[]; ok: true }
  | { ok: false; reason: string };

type CloneResult =
  | {
      maxDepth: number;
      ok: true;
      totalEntries: number;
      value: TreeValue;
    }
  | { ok: false; reason: string };

function hasIntrinsicPrototype(
  prototype: object | null,
  constructorSource: string,
): boolean {
  if (prototype === null) {
    return false;
  }
  try {
    const descriptor = Object.getOwnPropertyDescriptor(
      prototype,
      "constructor",
    );
    const constructorMatches =
      !!descriptor &&
      "value" in descriptor &&
      typeof descriptor.value === "function" &&
      functionToString.call(descriptor.value) === constructorSource &&
      descriptor.value.prototype === prototype;
    if (!constructorMatches) {
      return false;
    }
    const parentPrototype = Object.getPrototypeOf(prototype);
    if (constructorSource === OBJECT_CONSTRUCTOR_SOURCE) {
      return parentPrototype === null;
    }
    return hasIntrinsicPrototype(parentPrototype, OBJECT_CONSTRUCTOR_SOURCE);
  } catch {
    return false;
  }
}

function inspectContainer(value: object, seen: WeakSet<object>): InspectResult {
  try {
    const array = Array.isArray(value);
    const prototype = Object.getPrototypeOf(value);
    if (
      (!array &&
        !hasIntrinsicPrototype(prototype, OBJECT_CONSTRUCTOR_SOURCE)) ||
      (array &&
        (!Array.isArray(prototype) ||
          !hasIntrinsicPrototype(prototype, ARRAY_CONSTRUCTOR_SOURCE)))
    ) {
      return {
        ok: false,
        reason: "custom container prototypes are not supported",
      };
    }
    if (seen.has(value)) {
      return {
        ok: false,
        reason: "cycles and repeated container references are not supported",
      };
    }
    seen.add(value);

    const keys = Reflect.ownKeys(value);
    for (const key of keys) {
      if (array && key === "length") {
        continue;
      }
      if (typeof key !== "string") {
        return {
          ok: false,
          reason: "symbol-keyed tree fields are not supported",
        };
      }
      if (
        array &&
        (!/^(?:0|[1-9]\d*)$/.test(key) || Number(key) >= value.length)
      ) {
        return {
          ok: false,
          reason: "named or out-of-range array properties are not supported",
        };
      }
      const descriptor = Object.getOwnPropertyDescriptor(value, key);
      if (!descriptor?.enumerable || !("value" in descriptor)) {
        return {
          ok: false,
          reason: "tree fields must be enumerable own data properties",
        };
      }
    }
    return { keys: keys as string[], ok: true };
  } catch (error) {
    return {
      ok: false,
      reason: `container inspection failed: ${safeDescribe(error)}`,
    };
  }
}

function cloneTreeUnchecked(input: unknown): CloneResult {
  if (isTreePrimitive(input)) {
    return { maxDepth: 0, ok: true, totalEntries: 0, value: input };
  }
  if (typeof input !== "object") {
    return {
      ok: false,
      reason: `unsupported ${typeof input} tree value`,
    };
  }

  const seen = new WeakSet<object>();
  const rootInspection = inspectContainer(input, seen);
  if (!rootInspection.ok) {
    return rootInspection;
  }
  const root = input as ReadonlyTreeArray | ReadonlyTreeObject;
  let totalEntries = Array.isArray(root)
    ? root.length
    : rootInspection.keys.length;
  let maxDepth = totalEntries ? 1 : 0;
  const result = makeContainer(root);
  const stack: CloneFrame[] = [
    {
      depth: 0,
      index: 0,
      keys: rootInspection.keys,
      source: root,
      target: result,
    },
  ];

  try {
    while (stack.length) {
      const frame = stack[stack.length - 1];
      if (frame.index >= frame.keys.length) {
        stack.pop();
        continue;
      }
      const key = frame.keys[frame.index++];
      if (Array.isArray(frame.source) && key === "length") {
        continue;
      }
      const descriptor = Object.getOwnPropertyDescriptor(frame.source, key);
      if (!descriptor?.enumerable || !("value" in descriptor)) {
        return {
          ok: false,
          reason: "tree field inspection changed during traversal",
        };
      }
      const current = descriptor.value as unknown;
      if (isTreePrimitive(current)) {
        setOwnValue(frame.target, key, current);
        continue;
      }
      if (typeof current !== "object") {
        return {
          ok: false,
          reason: `unsupported ${typeof current} tree value at field ${safeDescribe(key)}`,
        };
      }
      const childSource = current as ReadonlyTreeArray | ReadonlyTreeObject;
      const childInspection = inspectContainer(childSource, seen);
      if (!childInspection.ok) {
        return childInspection;
      }
      const childDepth = frame.depth + 1;
      const childEntries = Array.isArray(childSource)
        ? childSource.length
        : childInspection.keys.length;
      totalEntries += childEntries;
      if (childEntries && childDepth + 1 > maxDepth) {
        maxDepth = childDepth + 1;
      }
      const child = makeContainer(childSource);
      setOwnValue(frame.target, key, child);
      stack.push({
        depth: childDepth,
        index: 0,
        keys: childInspection.keys,
        source: childSource,
        target: child,
      });
    }
  } catch (error) {
    return {
      ok: false,
      reason: `tree inspection failed: ${safeDescribe(error)}`,
    };
  }
  return { maxDepth, ok: true, totalEntries, value: result };
}

function cloneTreeSafely(input: unknown): CloneResult {
  try {
    return cloneTreeUnchecked(input);
  } catch (error) {
    return {
      ok: false,
      reason: `tree inspection failed: ${safeDescribe(error)}`,
    };
  }
}

function prepareSelectorPattern(value: ReadonlyTreeValue): TreeValue {
  const outcome = cloneTreeSafely(value);
  if (!outcome.ok) {
    throw new TypeError(
      `${ERROR_PREFIX} [THROW_ID_17] The "val" selector must be an acyclic, unaliased tree value: ${outcome.reason}.`,
    );
  }
  return outcome.value;
}

function cloneTree(input: unknown): Extract<CloneResult, { ok: true }> {
  const outcome = cloneTreeSafely(input);
  if (!outcome.ok) {
    throw new TypeError(
      `${ERROR_PREFIX} [THROW_ID_18] The first argument must be an acyclic, unaliased tree of ordinary arrays, plain objects, and supported primitives: ${outcome.reason}.`,
    );
  }
  return outcome;
}

function valuesMatch(candidate: unknown, pattern: unknown): boolean {
  if (
    typeof candidate === "number" &&
    typeof pattern === "number" &&
    Number.isNaN(candidate) &&
    Number.isNaN(pattern)
  ) {
    return true;
  }
  if (typeof candidate === "string" && typeof pattern === "string") {
    return match(candidate, pattern, matchOptions);
  }
  if (
    candidate === pattern ||
    typeof candidate !== typeof pattern ||
    candidate === null ||
    pattern === null ||
    typeof candidate !== "object"
  ) {
    return candidate === pattern;
  }
  return !!compare(candidate as any, pattern as any, {
    matchStrictly: true,
    useWildcards: true,
  });
}

function shouldDelete(
  parentIsArray: boolean,
  key: string,
  value: TreeValue,
  opts: ResolvedOpts,
): boolean {
  if (
    (opts.only === "array" && !parentIsArray) ||
    (opts.only === "object" && parentIsArray)
  ) {
    return false;
  }
  if (parentIsArray) {
    // Legacy semantics call an array element its "key". Array slots have no
    // separate value selector, so value-only and key-plus-value selectors are
    // intentionally object-property-only.
    return opts.hasKey && !opts.hasVal && valuesMatch(value, opts.key);
  }
  const keyMatches = !opts.hasKey || valuesMatch(key, opts.key);
  const valueMatches = !opts.hasVal || valuesMatch(value, opts.val);
  return keyMatches && valueMatches;
}

function pushFrame(
  stack: TransformFrame[],
  container: TreeArray | TreeObject,
  parent?: TransformFrame,
  parentSlot?: string,
  parentReadIndex?: number,
): void {
  stack.push({
    affected: false,
    container,
    empty: true,
    index: 0,
    keys: Array.isArray(container) ? [] : Object.keys(container),
    parent,
    parentReadIndex,
    parentSlot,
    writeIndex: 0,
  });
}

function keepArraySlot(
  frame: TransformFrame,
  readIndex: number,
  value: TreeValue,
): void {
  if (frame.writeIndex !== readIndex) {
    setOwnValue(frame.container, `${frame.writeIndex}`, value);
  }
  frame.writeIndex += 1;
}

function safeNow(): number | null {
  try {
    const value = Date.now();
    return Number.isFinite(value) ? value : null;
  } catch {
    return null;
  }
}

function callProgressSafely(
  callback: Observation["reportProgressFunc"],
  value: number,
): void {
  if (callback) {
    try {
      callback(value);
    } catch {
      // Reporting is observational and cannot change the transformation.
    }
  }
}

function callCompletionSafely(
  callback: Observation["reportCompletionFunc"],
  stats: Readonly<CompletionStats>,
): void {
  if (callback) {
    try {
      callback(stats);
    } catch {
      // Reporting is observational and cannot change the transformation.
    }
  }
}

function createObservation(
  opts: ResolvedOpts,
  cloned: Extract<CloneResult, { ok: true }>,
  startedAt: number | null,
): Observation | undefined {
  const reportCompletionFunc = opts.reportCompletionFunc ?? null;
  const reportProgressFunc = opts.reportProgressFunc ?? null;
  if (!reportCompletionFunc && !reportProgressFunc) {
    return undefined;
  }
  const observation: Observation = {
    cleanupPrunedContainers: 0,
    directDeletions: 0,
    lastProgress: undefined,
    maxDepth: cloned.maxDepth,
    reportCompletionFunc,
    reportProgressFunc,
    reportProgressFuncFrom: opts.reportProgressFuncFrom,
    reportProgressFuncTo: opts.reportProgressFuncTo,
    startedAt,
    totalEntries: cloned.totalEntries,
    visitedEntries: 0,
  };
  if (reportProgressFunc) {
    callProgressSafely(reportProgressFunc, observation.reportProgressFuncFrom);
    observation.lastProgress = observation.reportProgressFuncFrom;
  }
  return observation;
}

function observeEntry(observation: Observation | undefined): void {
  if (!observation) {
    return;
  }
  observation.visitedEntries += 1;
  if (!observation.reportProgressFunc || observation.totalEntries === 0) {
    return;
  }
  const ratio = Math.min(
    1,
    observation.visitedEntries / observation.totalEntries,
  );
  const bucket = Math.floor(ratio * 100);
  const value =
    observation.reportProgressFuncFrom +
    (observation.reportProgressFuncTo - observation.reportProgressFuncFrom) *
      (bucket / 100);
  if (value !== observation.lastProgress) {
    callProgressSafely(observation.reportProgressFunc, value);
    observation.lastProgress = value;
  }
}

function finishObservation(observation: Observation | undefined): void {
  if (!observation) {
    return;
  }
  if (observation.lastProgress !== observation.reportProgressFuncTo) {
    callProgressSafely(
      observation.reportProgressFunc,
      observation.reportProgressFuncTo,
    );
    observation.lastProgress = observation.reportProgressFuncTo;
  }
  if (observation.reportCompletionFunc) {
    const finishedAt = safeNow();
    const difference =
      observation.startedAt === null || finishedAt === null
        ? 0
        : finishedAt - observation.startedAt;
    const elapsed = Number.isFinite(difference) ? Math.max(0, difference) : 0;
    const stats: Readonly<CompletionStats> = Object.freeze({
      cleanupPrunedContainers: observation.cleanupPrunedContainers,
      directDeletions: observation.directDeletions,
      maxDepth: observation.maxDepth,
      timeTakenInMilliseconds: elapsed,
      totalEntries: observation.totalEntries,
      visitedEntries: observation.visitedEntries,
    });
    callCompletionSafely(observation.reportCompletionFunc, stats);
  }
}

function transformTree(
  input: TreeValue,
  opts: ResolvedOpts,
  observation?: Observation,
): TreeValue {
  if (isTreePrimitive(input)) {
    return input;
  }

  const stack: TransformFrame[] = [];
  pushFrame(stack, input);
  while (stack.length) {
    const frame = stack[stack.length - 1];
    const arrayContainer = Array.isArray(frame.container)
      ? frame.container
      : undefined;
    const exhausted = arrayContainer
      ? frame.index >= arrayContainer.length
      : frame.index >= frame.keys.length;

    if (exhausted) {
      if (arrayContainer) {
        arrayContainer.length = frame.writeIndex;
      }
      stack.pop();
      if (!frame.parent) {
        continue;
      }

      const parent = frame.parent;
      parent.affected = parent.affected || frame.affected;
      const prune = opts.cleanup && frame.affected && frame.empty;
      if (prune) {
        if (observation) {
          observation.cleanupPrunedContainers += 1;
        }
        parent.affected = true;
        if (!Array.isArray(parent.container)) {
          delete parent.container[frame.parentSlot as string];
        }
      } else {
        if (Array.isArray(parent.container)) {
          keepArraySlot(
            parent,
            frame.parentReadIndex as number,
            frame.container,
          );
        }
        if (!frame.empty) {
          parent.empty = false;
        }
      }
      continue;
    }

    if (arrayContainer) {
      const readIndex = frame.index++;
      observeEntry(observation);
      if (!hasOwn.call(arrayContainer, readIndex)) {
        if (frame.writeIndex !== readIndex) {
          delete arrayContainer[frame.writeIndex];
        }
        frame.writeIndex += 1;
        frame.empty = false;
        continue;
      }
      const value = arrayContainer[readIndex] as TreeValue;
      if (shouldDelete(true, `${readIndex}`, value, opts)) {
        if (observation) {
          observation.directDeletions += 1;
        }
        frame.affected = true;
        continue;
      }
      if (value !== null && typeof value === "object") {
        pushFrame(stack, value, frame, `${readIndex}`, readIndex);
      } else {
        keepArraySlot(frame, readIndex, value);
        if (value !== "") {
          frame.empty = false;
        }
      }
      continue;
    }

    const objectContainer = frame.container as TreeObject;
    const key = frame.keys[frame.index++];
    observeEntry(observation);
    const value = objectContainer[key] as TreeValue;
    if (shouldDelete(false, key, value, opts)) {
      if (observation) {
        observation.directDeletions += 1;
      }
      delete objectContainer[key];
      frame.affected = true;
      continue;
    }
    if (value !== null && typeof value === "object") {
      pushFrame(stack, value, frame, key);
    } else if (value !== "") {
      frame.empty = false;
    }
  }
  return input;
}

function deleteKey<T, Value = never>(
  input: T,
  opts: Opts<Value>,
  ...invalid: false extends TreeCheck<T> | TreeCheck<Value> ? [never] : []
): MutableTree<T>;
function deleteKey(input: unknown, opts: unknown): unknown {
  // biome-ignore lint/complexity/noArguments: distinguishes omission from explicit undefined
  assertInputPresent(arguments.length);
  const resolvedOpts = resolveOptions(opts);
  if (resolvedOpts.hasVal) {
    resolvedOpts.val = prepareSelectorPattern(resolvedOpts.val);
  }
  const startedAt = resolvedOpts.reportCompletionFunc ? safeNow() : null;
  const cloned = cloneTree(input);
  const observation = createObservation(resolvedOpts, cloned, startedAt);
  const result = transformTree(cloned.value, resolvedOpts, observation);
  finishObservation(observation);
  return result;
}

export { defaults, deleteKey, version };
