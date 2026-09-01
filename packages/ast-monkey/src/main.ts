import { compare } from "ast-compare";
import { DELETE, traverse } from "ast-monkey-traverse";
import { checkTypesMini } from "check-types-mini";
import {
  formatDiagnosticValue,
  isPlainObject as isObj,
  match,
} from "codsen-utils";
import { arrObjOrBoth } from "util-array-object-or-both";

import { version as v } from "../package.json";

const version: string = v;
const hasOwn = Object.prototype.hasOwnProperty;

declare let DEV: boolean;

/* eslint no-use-before-define: 0 */
// From "type-fest" by Sindre Sorhus, with added undefined
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | undefined // non-JSON but added too
  | JsonObject
  | JsonArray;
export type JsonObject = { [Key in string]?: JsonValue };
export type JsonArray = JsonValue[];

export type Only =
  | undefined
  | null
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

/** Numeric traversal index, or its unsigned decimal string spelling. */
export type TraversalIndex = number | string;

export type FindCriteria =
  | { kind: "key"; key: unknown }
  | { kind: "value"; value: unknown }
  | { kind: "entry"; key: unknown; value: unknown };

interface OnlyOpts {
  only?: Only;
}

type LegacyFindOpts =
  | { criteria?: never; key: string; val?: unknown }
  | { criteria?: never; key?: null; val: unknown };

export type FindOpts = OnlyOpts &
  (LegacyFindOpts | { criteria: FindCriteria; key?: never; val?: never });

export interface GetOpts extends OnlyOpts {
  index: TraversalIndex;
}

type LegacySetOpts =
  | { key: string; val?: JsonValue }
  | { key?: null; val: JsonValue };

export type SetOpts = { index: TraversalIndex } & LegacySetOpts;

export interface DropOpts {
  index: TraversalIndex;
}

export type DelOpts = FindOpts;

export interface Finding {
  index: number;
  key: JsonValue;
  val: JsonValue | undefined;
  path: number[];
}

// -----------------------------------------------------------------------------

type NormalizedOnly = "any" | "array" | "object";

type Selector =
  | { kind: "key"; key: unknown }
  | { kind: "legacyValue"; value: unknown }
  | { kind: "value"; value: unknown }
  | { kind: "entry"; key: unknown; value: unknown };

interface InternalOpts {
  index?: number;
  mode: "find" | "get" | "set" | "drop" | "del" | "arrayFirstOnly";
  only: NormalizedOnly;
  replacement?: JsonValue;
  selector?: Selector;
}

function validationReason(error: unknown): string {
  if (
    error !== null &&
    typeof error === "object" &&
    typeof (error as { reason?: unknown }).reason === "string"
  ) {
    return (error as { reason: string }).reason;
  }
  return error instanceof Error
    ? error.message
    : formatDiagnosticValue(error, 4);
}

const matchOptions = Object.freeze({ caseSensitiveMatch: true });

// Resolve the common exact-key, ordered-container comparison without paying
// ast-compare's general wildcard-key graph-matching setup cost. Returning
// undefined means the shape needs the full comparator.
function compareSimpleTrees(a: any, b: any): boolean | undefined {
  const firstStack: any[] = [a];
  const secondStack: any[] = [b];
  const seenFirst: object[] = [];
  const seenSecond: object[] = [];
  let comparisons = 0;

  while (firstStack.length) {
    if (comparisons++ === 64) {
      return undefined;
    }
    const first = firstStack.pop();
    const second = secondStack.pop();

    if (first === second) {
      continue;
    }
    if (typeof first !== typeof second) {
      return false;
    }
    if (typeof first === "number" && Number.isNaN(first)) {
      return false;
    }
    if (typeof first === "string") {
      if (match(first, second, matchOptions)) {
        continue;
      }
      return false;
    }
    if (first === null || second === null || typeof first !== "object") {
      return false;
    }

    const firstArray = Array.isArray(first);
    const secondArray = Array.isArray(second);
    const firstObject = isObj(first);
    const secondObject = isObj(second);
    if ((!firstArray || !secondArray) && (!firstObject || !secondObject)) {
      return false;
    }

    if (seenFirst.includes(first) || seenSecond.includes(second)) {
      return undefined;
    }
    seenFirst.push(first);
    seenSecond.push(second);

    if (firstArray && secondArray) {
      if (first.length !== second.length) {
        return false;
      }
      if (
        Object.keys(first).length !== first.length ||
        Object.keys(second).length !== second.length
      ) {
        return undefined;
      }
      for (let index = first.length; index--; ) {
        firstStack.push(first[index]);
        secondStack.push(second[index]);
      }
      continue;
    }

    const firstRecord = first as Record<string, unknown>;
    const secondRecord = second as Record<string, unknown>;
    const firstKeys = Object.keys(firstRecord);
    const secondKeys = Object.keys(secondRecord);
    if (firstKeys.length !== secondKeys.length) {
      return false;
    }
    for (let index = secondKeys.length; index--; ) {
      const key = secondKeys[index];
      if (!hasOwn.call(firstRecord, key)) {
        // The pattern key can itself be a wildcard, which requires ast-compare's
        // one-to-one candidate assignment.
        if (
          firstKeys.some((candidateKey) =>
            match(candidateKey, key, matchOptions),
          )
        ) {
          return undefined;
        }
        return false;
      }
      firstStack.push(firstRecord[key]);
      secondStack.push(secondRecord[key]);
    }
  }

  return true;
}

function compareIsEqual(a: any, b: any): boolean {
  // ast-compare does not consider NaN equal to itself. Preserve that
  // container-comparison contract, but let callers select a NaN leaf
  // explicitly now that traversal deletion uses DELETE instead of NaN.
  if (
    typeof a === "number" &&
    typeof b === "number" &&
    Number.isNaN(a) &&
    Number.isNaN(b)
  ) {
    return true;
  }
  const simpleResult = compareSimpleTrees(a, b);
  return simpleResult === undefined
    ? !!compare(a, b, { matchStrictly: true, useWildcards: true })
    : simpleResult;
}

function normalizeOnly(value: unknown): NormalizedOnly {
  if (value === undefined || value === null || value === "") {
    return "any";
  }
  if (typeof value !== "string") {
    throw new TypeError(
      `The "only" option must be a string, null, or undefined; received ${formatDiagnosticValue(value, 4)}.`,
    );
  }
  return arrObjOrBoth(value, { optsVarName: "opts.only", msg: "" });
}

function resolveIndex(value: unknown): number {
  let normalized = value;
  if (typeof normalized === "string" && /^\d+$/.test(normalized)) {
    normalized = Number(normalized);
  }
  if (
    typeof normalized !== "number" ||
    !Number.isSafeInteger(normalized) ||
    normalized < 0
  ) {
    throw new TypeError(
      `The index must be a non-negative safe integer or an unsigned decimal string; received ${formatDiagnosticValue(value, 4)} (type ${typeof value}).`,
    );
  }
  return normalized;
}

function resolveCriteria(value: unknown): Selector {
  if (!isObj(value)) {
    throw new TypeError(
      'The "criteria" option must be an object whose kind is "key", "value", or "entry".',
    );
  }
  const criterion = { ...value } as Record<string, unknown>;
  if (!hasOwn.call(criterion, "kind") || typeof criterion.kind !== "string") {
    throw new TypeError(
      'The "criteria" option must contain an own kind of "key", "value", or "entry".',
    );
  }
  if (criterion.kind === "key") {
    if (!hasOwn.call(criterion, "key")) {
      throw new TypeError('Key criteria must contain an own "key" property.');
    }
    return { key: criterion.key, kind: "key" };
  }
  if (criterion.kind === "value") {
    if (!hasOwn.call(criterion, "value")) {
      throw new TypeError(
        'Value criteria must contain an own "value" property.',
      );
    }
    return { kind: "value", value: criterion.value };
  }
  if (criterion.kind === "entry") {
    if (!hasOwn.call(criterion, "key") || !hasOwn.call(criterion, "value")) {
      throw new TypeError(
        'Entry criteria must contain own "key" and "value" properties.',
      );
    }
    return {
      key: criterion.key,
      kind: "entry",
      value: criterion.value,
    };
  }
  throw new TypeError(
    `The "criteria" kind must be "key", "value", or "entry"; received ${formatDiagnosticValue(criterion.kind, 4)}.`,
  );
}

function resolveSelector(opts: Record<string, any>): Selector {
  if (hasOwn.call(opts, "criteria")) {
    return resolveCriteria(opts.criteria);
  }

  if (typeof opts.key === "string") {
    return opts.val === undefined
      ? { key: opts.key, kind: "key" }
      : { key: opts.key, kind: "entry", value: opts.val };
  }
  if (hasOwn.call(opts, "val")) {
    return opts.val === undefined
      ? { kind: "value", value: undefined }
      : { kind: "legacyValue", value: opts.val };
  }
  throw new TypeError(
    'Provide legacy "key" or "val" options, or the unambiguous "criteria" option.',
  );
}

function resolveReplacement(opts: Record<string, any>): JsonValue {
  if (opts.val !== undefined || typeof opts.key !== "string") {
    return opts.val as JsonValue;
  }
  return opts.key;
}

function legacySelectorOptionsPassFast(opts: Record<string, any>): boolean {
  for (const key of Reflect.ownKeys(opts)) {
    if (
      typeof key !== "string" ||
      (key !== "key" && key !== "val" && key !== "only")
    ) {
      return false;
    }
  }
  if (
    hasOwn.call(opts, "key") &&
    opts.key !== null &&
    typeof opts.key !== "string"
  ) {
    return false;
  }
  return (
    !hasOwn.call(opts, "only") ||
    opts.only === undefined ||
    opts.only === null ||
    typeof opts.only === "string"
  );
}

type JsonContainer = JsonArray | JsonObject;

interface CloneFrame {
  source: JsonContainer;
  target: JsonContainer;
}

interface MonkeyFrame {
  container: JsonContainer;
  depth: number;
  index: number;
  keys: string[];
}

function invalidTree(reason: string): never {
  throw new TypeError(
    `The input must be an acyclic, unaliased tree of arrays, plain objects, and supported primitive values; ${reason}.`,
  );
}

function isJsonPrimitive(
  value: unknown,
): value is Exclude<JsonValue, JsonArray | JsonObject> {
  return (
    value === null ||
    value === undefined ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  );
}

function isArrayIndex(key: string, length: number): boolean {
  const index = Number(key);
  return (
    Number.isInteger(index) &&
    index >= 0 &&
    index < length &&
    `${index}` === key
  );
}

function createContainer(source: JsonContainer): JsonContainer {
  return Array.isArray(source) ? new Array(source.length) : {};
}

function setOwnValue(
  target: JsonContainer,
  key: string,
  value: JsonValue,
): void {
  if (key === "__proto__") {
    Object.defineProperty(target, key, {
      configurable: true,
      enumerable: true,
      value,
      writable: true,
    });
  } else {
    (target as JsonObject)[key] = value;
  }
}

// Validate and clone once without borrowing the JavaScript call stack. The
// high-level helpers need only depth and parent kind, so this avoids paying for
// the general traversal package's path and parent-snapshot metadata.
function cloneTree(value: unknown): JsonValue {
  if (isJsonPrimitive(value)) {
    return value;
  }
  if (typeof value !== "object") {
    invalidTree(`encountered an unsupported ${typeof value} value`);
  }

  const sourceRoot = value as JsonContainer;
  const root = createContainer(sourceRoot);
  const pending: CloneFrame[] = [{ source: sourceRoot, target: root }];
  const seen = new WeakSet<object>([sourceRoot]);

  while (pending.length) {
    const frame = pending.pop() as CloneFrame;
    const { source, target } = frame;
    const arraySource = Array.isArray(source);
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

    for (const key of Reflect.ownKeys(source)) {
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
      if (arraySource && !isArrayIndex(key, source.length)) {
        invalidTree(
          `encountered the non-index array property ${JSON.stringify(key)}`,
        );
      }
      const descriptor = Object.getOwnPropertyDescriptor(
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
      if (!("value" in descriptor)) {
        invalidTree(
          arraySource
            ? `encountered an accessor array index ${key}`
            : `encountered an accessor property ${JSON.stringify(key)}`,
        );
      }

      const child = descriptor.value;
      if (isJsonPrimitive(child)) {
        setOwnValue(target, key, child);
      } else if (typeof child === "object") {
        if (seen.has(child)) {
          invalidTree("encountered a cycle or repeated object reference");
        }
        seen.add(child);
        const childTarget = createContainer(child as JsonContainer);
        setOwnValue(target, key, childTarget);
        pending.push({ source: child as JsonContainer, target: childTarget });
      } else {
        invalidTree(`encountered an unsupported ${typeof child} value`);
      }
    }
  }

  return root;
}

// -----------------------------------------------------------------------------

function monkey(
  originalInput: JsonValue,
  opts: InternalOpts,
): JsonValue | Finding[] {
  DEV && console.log("monkey() called");
  const resolvedOpts = opts;
  DEV &&
    console.log(
      `\u001b[${32}mFINAL\u001b[${39}m \u001b[${33}mresolvedOpts\u001b[${39}m =`,
      resolvedOpts,
    );

  interface Data {
    count: number;
    finding: JsonValue;
    gatherPath: number[];
  }
  const data: Data = { count: 0, finding: null, gatherPath: [] };
  const findings: Finding[] = [];

  DEV && console.log("\u001b[32mCALL\u001b[39m internal traversal");
  const input = cloneTree(originalInput);
  if (resolvedOpts.mode === "arrayFirstOnly" && Array.isArray(input)) {
    if (input.length > 1) {
      input.length = 1;
    }
  }
  if (typeof input !== "object" || input === null) {
    if (resolvedOpts.mode === "get") {
      return data.finding;
    }
    if (resolvedOpts.mode === "find") {
      return findings;
    }
    return input;
  }

  const stack: MonkeyFrame[] = [
    {
      container: input,
      depth: 0,
      index: 0,
      keys: Array.isArray(input) ? [] : Object.keys(input),
    },
  ];

  while (stack.length) {
    const frame = stack[stack.length - 1];
    const arrayContainer = Array.isArray(frame.container)
      ? frame.container
      : undefined;
    const parentType = arrayContainer ? "array" : "object";
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

    const current = (frame.container as JsonObject)[slot];
    const key = parentType === "array" ? current : slot;
    const val = parentType === "object" ? current : undefined;
    DEV && console.log("\u001b[35m---------------\u001b[39m");
    DEV &&
      console.log(
        "\u001b[32mSET\u001b[39m \u001b[33mkey\u001b[39m =",
        key,
        "; \u001b[33mval\u001b[39m =",
        val,
        "; \u001b[33mdepth\u001b[39m =",
        frame.depth,
        "; \u001b[33mparentType\u001b[39m =",
        parentType,
      );

    data.count += 1;
    data.gatherPath.length = frame.depth;
    data.gatherPath.push(data.count);
    let removed = false;
    let adopted = current;

    if (resolvedOpts.mode === "get") {
      if (
        data.count === resolvedOpts.index &&
        (resolvedOpts.only === "any" || resolvedOpts.only === parentType)
      ) {
        if (parentType === "object") {
          const finding: JsonObject = {};
          setOwnValue(finding, slot, val);
          data.finding = finding;
        } else {
          data.finding = key;
        }
      }
    } else if (resolvedOpts.mode === "find" || resolvedOpts.mode === "del") {
      const selector = resolvedOpts.selector as Selector;
      let matches = false;
      if (resolvedOpts.only === "any" || resolvedOpts.only === parentType) {
        if (selector.kind === "key") {
          matches = compareIsEqual(key, selector.key);
        } else if (selector.kind === "legacyValue") {
          matches = compareIsEqual(val, selector.value);
        } else if (selector.kind === "value") {
          matches = compareIsEqual(current, selector.value);
        } else {
          matches =
            compareIsEqual(key, selector.key) &&
            compareIsEqual(val, selector.value);
        }
      }
      if (matches) {
        if (resolvedOpts.mode === "find") {
          findings.push({
            index: data.count,
            key,
            val,
            path: [...data.gatherPath],
          });
        } else {
          removed = true;
        }
      }
    } else if (
      resolvedOpts.mode === "set" &&
      data.count === resolvedOpts.index
    ) {
      adopted = resolvedOpts.replacement;
    } else if (
      resolvedOpts.mode === "drop" &&
      data.count === resolvedOpts.index
    ) {
      removed = true;
    } else if (resolvedOpts.mode === "arrayFirstOnly") {
      if (Array.isArray(current) && current.length > 1) {
        current.length = 1;
      }
    }

    if (removed) {
      if (arrayContainer) {
        arrayContainer.splice(frame.index, 1);
      } else {
        delete (frame.container as JsonObject)[slot];
        frame.index += 1;
      }
      continue;
    }

    if (!Object.is(adopted, current)) {
      setOwnValue(frame.container, slot, adopted);
    }
    frame.index += 1;
    if (typeof adopted === "object" && adopted !== null) {
      stack.push({
        container: adopted,
        depth: frame.depth + 1,
        index: 0,
        keys: Array.isArray(adopted) ? [] : Object.keys(adopted),
      });
    }
  }
  DEV && console.log("\u001b[35m--------------- fin.\u001b[39m");

  if (resolvedOpts.mode === "get") {
    return data.finding;
  }
  if (resolvedOpts.mode === "find") {
    return findings;
  }
  return input;
}

// -----------------------------------------------------------------------------
// Validate and prepare all public options here.

function find(input: JsonValue, opts: FindOpts): Finding[] {
  // biome-ignore lint/complexity/noArguments: distinguishes omission from explicit undefined
  if (arguments.length === 0) {
    throw new Error(
      "ast-monkey/find(): [THROW_ID_01] Please provide the input argument",
    );
  }
  const optsArePlain = isObj(opts);
  const ownOptionKeys = optsArePlain ? Object.keys(opts) : [];
  if (
    !optsArePlain ||
    (!ownOptionKeys.includes("criteria") &&
      !ownOptionKeys.includes("key") &&
      !ownOptionKeys.includes("val"))
  ) {
    throw new Error(
      "ast-monkey/find(): [THROW_ID_02] Please provide an options object containing opts.key, opts.val, or opts.criteria",
    );
  }
  let selector: Selector;
  let resolvedOpts = {} as FindOpts;
  try {
    resolvedOpts = { ...opts };
    if (
      hasOwn.call(resolvedOpts, "criteria") ||
      !legacySelectorOptionsPassFast(resolvedOpts)
    ) {
      checkTypesMini(
        resolvedOpts,
        null,
        hasOwn.call(resolvedOpts, "criteria")
          ? {
              schema: {
                criteria: "any",
                only: ["undefined", "null", "string"],
              },
            }
          : {
              schema: {
                key: ["null", "string"],
                val: "any",
                only: ["undefined", "null", "string"],
              },
            },
      );
    }
    selector = resolveSelector(resolvedOpts);
  } catch (error) {
    throw new TypeError(
      `ast-monkey/find(): [THROW_ID_03] ${validationReason(error)}`,
    );
  }
  let only: NormalizedOnly;
  try {
    only = normalizeOnly(resolvedOpts.only);
  } catch (error) {
    throw new TypeError(
      `ast-monkey/find(): [THROW_ID_04] ${validationReason(error)}`,
    );
  }
  try {
    return monkey(input, { mode: "find", only, selector }) as Finding[];
  } catch (error) {
    throw new TypeError(
      `ast-monkey/find(): [THROW_ID_05] ${validationReason(error)}`,
    );
  }
}

function get(input: JsonValue, opts: GetOpts): JsonValue {
  // biome-ignore lint/complexity/noArguments: distinguishes omission from explicit undefined
  if (arguments.length === 0) {
    throw new Error(
      "ast-monkey/get(): [THROW_ID_06] Please provide the input argument",
    );
  }
  if (!isObj(opts)) {
    throw new Error(
      "ast-monkey/get(): [THROW_ID_07] Please provide the options object",
    );
  }
  const ownOptionKeys = Object.keys(opts);
  let resolvedOpts = {} as GetOpts;
  let snapshotFailure: { error: unknown } | undefined;
  try {
    resolvedOpts = { ...opts };
  } catch (error) {
    snapshotFailure = { error };
  }
  if (
    !ownOptionKeys.includes("index") ||
    (!snapshotFailure && resolvedOpts.index === undefined)
  ) {
    throw new Error(
      "ast-monkey/get(): [THROW_ID_08] Please provide opts.index",
    );
  }
  let index: number;
  try {
    if (snapshotFailure) {
      throw snapshotFailure.error;
    }
    index = resolveIndex(resolvedOpts.index);
  } catch (error) {
    throw new TypeError(
      `ast-monkey/get(): [THROW_ID_09] ${validationReason(error)}`,
    );
  }
  let only: NormalizedOnly;
  try {
    only = normalizeOnly(resolvedOpts.only);
  } catch (error) {
    throw new TypeError(
      `ast-monkey/get(): [THROW_ID_10] ${validationReason(error)}`,
    );
  }
  try {
    return monkey(input, { index, mode: "get", only }) as JsonValue;
  } catch (error) {
    throw new TypeError(
      `ast-monkey/get(): [THROW_ID_11] ${validationReason(error)}`,
    );
  }
}

function set(input: JsonValue, opts: SetOpts): JsonValue {
  // biome-ignore lint/complexity/noArguments: distinguishes omission from explicit undefined
  if (arguments.length === 0) {
    throw new Error(
      "ast-monkey/set(): [THROW_ID_12] Please provide the input argument",
    );
  }
  if (!isObj(opts)) {
    throw new Error(
      "ast-monkey/set(): [THROW_ID_13] Please provide the options object",
    );
  }
  const ownOptionKeys = Object.keys(opts);
  let resolvedOpts = {} as SetOpts;
  let snapshotFailure: { error: unknown } | undefined;
  try {
    resolvedOpts = { ...opts };
  } catch (error) {
    snapshotFailure = { error };
  }
  if (
    !ownOptionKeys.includes("val") &&
    (!ownOptionKeys.includes("key") ||
      (!snapshotFailure && resolvedOpts.key == null))
  ) {
    throw new Error(
      "ast-monkey/set(): [THROW_ID_14] Please provide opts.key or opts.val",
    );
  }
  if (
    !ownOptionKeys.includes("index") ||
    (!snapshotFailure && resolvedOpts.index === undefined)
  ) {
    throw new Error(
      "ast-monkey/set(): [THROW_ID_15] Please provide opts.index",
    );
  }
  let index: number;
  try {
    if (snapshotFailure) {
      throw snapshotFailure.error;
    }
    index = resolveIndex(resolvedOpts.index);
  } catch (error) {
    throw new TypeError(
      `ast-monkey/set(): [THROW_ID_16] ${validationReason(error)}`,
    );
  }
  let replacement: JsonValue;
  try {
    checkTypesMini({ ...resolvedOpts, index }, null, {
      schema: {
        index: "number",
        key: ["null", "string"],
        val: "any",
      },
    });
    replacement = resolveReplacement(resolvedOpts);
  } catch (error) {
    throw new TypeError(
      `ast-monkey/set(): [THROW_ID_17] ${validationReason(error)}`,
    );
  }
  try {
    return monkey(input, {
      index,
      mode: "set",
      only: "any",
      replacement: cloneTree(replacement),
    }) as JsonValue;
  } catch (error) {
    throw new TypeError(
      `ast-monkey/set(): [THROW_ID_18] ${validationReason(error)}`,
    );
  }
}

function drop(input: JsonValue, opts: DropOpts): JsonValue {
  // biome-ignore lint/complexity/noArguments: distinguishes omission from explicit undefined
  if (arguments.length === 0) {
    throw new Error(
      "ast-monkey/drop(): [THROW_ID_19] Please provide the input argument",
    );
  }
  if (!isObj(opts)) {
    throw new Error(
      "ast-monkey/drop(): [THROW_ID_20] Please provide the options object",
    );
  }
  const ownOptionKeys = Object.keys(opts);
  let resolvedOpts = {} as DropOpts;
  let snapshotFailure: { error: unknown } | undefined;
  try {
    resolvedOpts = { ...opts };
  } catch (error) {
    snapshotFailure = { error };
  }
  if (
    !ownOptionKeys.includes("index") ||
    (!snapshotFailure && resolvedOpts.index === undefined)
  ) {
    throw new Error(
      "ast-monkey/drop(): [THROW_ID_21] Please provide opts.index",
    );
  }
  let index: number;
  try {
    if (snapshotFailure) {
      throw snapshotFailure.error;
    }
    index = resolveIndex(resolvedOpts.index);
  } catch (error) {
    throw new TypeError(
      `ast-monkey/drop(): [THROW_ID_22] ${validationReason(error)}`,
    );
  }
  try {
    return monkey(input, { index, mode: "drop", only: "any" }) as JsonValue;
  } catch (error) {
    throw new TypeError(
      `ast-monkey/drop(): [THROW_ID_23] ${validationReason(error)}`,
    );
  }
}

function del(input: JsonValue, opts: DelOpts): JsonValue {
  // biome-ignore lint/complexity/noArguments: distinguishes omission from explicit undefined
  if (arguments.length === 0) {
    throw new Error(
      "ast-monkey/del(): [THROW_ID_24] Please provide the input argument",
    );
  }
  const optsArePlain = isObj(opts);
  const ownOptionKeys = optsArePlain ? Object.keys(opts) : [];
  if (!optsArePlain) {
    throw new Error(
      "ast-monkey/del(): [THROW_ID_25] Please provide the options object",
    );
  }
  if (
    !ownOptionKeys.includes("criteria") &&
    !ownOptionKeys.includes("key") &&
    !ownOptionKeys.includes("val")
  ) {
    throw new Error(
      "ast-monkey/del(): [THROW_ID_26] Please provide opts.key, opts.val, or opts.criteria",
    );
  }
  let selector: Selector;
  let resolvedOpts = {} as DelOpts;
  try {
    resolvedOpts = { ...opts };
    if (
      hasOwn.call(resolvedOpts, "criteria") ||
      !legacySelectorOptionsPassFast(resolvedOpts)
    ) {
      checkTypesMini(
        resolvedOpts,
        null,
        hasOwn.call(resolvedOpts, "criteria")
          ? {
              schema: {
                criteria: "any",
                only: ["undefined", "null", "string"],
              },
            }
          : {
              schema: {
                key: ["null", "string"],
                val: "any",
                only: ["undefined", "null", "string"],
              },
            },
      );
    }
    selector = resolveSelector(resolvedOpts);
  } catch (error) {
    throw new TypeError(
      `ast-monkey/del(): [THROW_ID_27] ${validationReason(error)}`,
    );
  }
  let only: NormalizedOnly;
  try {
    only = normalizeOnly(resolvedOpts.only);
  } catch (error) {
    throw new TypeError(
      `ast-monkey/del(): [THROW_ID_28] ${validationReason(error)}`,
    );
  }
  try {
    return monkey(input, { mode: "del", only, selector }) as JsonValue;
  } catch (error) {
    throw new TypeError(
      `ast-monkey/del(): [THROW_ID_29] ${validationReason(error)}`,
    );
  }
}

function arrayFirstOnly(input: JsonValue): JsonValue {
  // biome-ignore lint/complexity/noArguments: distinguishes omission from explicit undefined
  if (arguments.length === 0) {
    throw new Error(
      "ast-monkey/arrayFirstOnly(): [THROW_ID_30] Please provide the input argument",
    );
  }
  try {
    return monkey(input, {
      mode: "arrayFirstOnly",
      only: "any",
    }) as JsonValue;
  } catch (error) {
    throw new TypeError(
      `ast-monkey/arrayFirstOnly(): [THROW_ID_31] ${validationReason(error)}`,
    );
  }
}

// -----------------------------------------------------------------------------

export { arrayFirstOnly, DELETE, del, drop, find, get, set, traverse, version };
