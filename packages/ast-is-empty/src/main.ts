import { isPlainObject as isObj } from "codsen-utils";

import { version as v } from "../package.json";

const version: string = v;

export interface CompletionStats {
  /** Number of links to already-completed containers that were skipped. */
  readonly aliasesSkipped: number;
  /** Number of array indices inspected, including a sparse hole that determines the result. */
  readonly arrayElementsVisited: number;
  /** Deepest value or array slot inspected, where the root has depth zero. */
  readonly maxDepth: number;
  /** Number of own enumerable string-keyed object properties inspected. */
  readonly objectPropertiesVisited: number;
  /** Best-effort elapsed time for user-facing completion feedback. */
  readonly timeTakenInMilliseconds: number;
  /** Number of distinct arrays and plain objects entered. */
  readonly uniqueContainersVisited: number;
}

export interface Opts {
  reportCompletionFunc: null | ((stats: Readonly<CompletionStats>) => void);
  reportProgressFunc: null | ((percentageDone: number) => void);
  reportProgressFuncFrom: number;
  reportProgressFuncTo: number;
}

export interface InputOpts {
  reportCompletionFunc?: Opts["reportCompletionFunc"] | undefined;
  reportProgressFunc?: Opts["reportProgressFunc"] | undefined;
  reportProgressFuncFrom?: number | undefined;
  reportProgressFuncTo?: number | undefined;
}

const defaults: Readonly<Opts> = Object.freeze({
  reportCompletionFunc: null,
  reportProgressFunc: null,
  reportProgressFuncFrom: 0,
  reportProgressFuncTo: 100,
});
const hasOwn = Object.prototype.hasOwnProperty;
const knownOptionKeys = new Set([
  "reportCompletionFunc",
  "reportProgressFunc",
  "reportProgressFuncFrom",
  "reportProgressFuncTo",
]);

interface BaseFrame {
  depth: number;
  index: number;
}

interface ArrayFrame extends BaseFrame {
  kind: "array";
  length: number;
  value: unknown[];
}

interface ObjectFrame extends BaseFrame {
  keys: string[];
  kind: "object";
  value: Record<string, unknown>;
}

type Frame = ArrayFrame | ObjectFrame;
interface FastArrayFrame {
  index: number;
  kind: "array";
  length: number;
  value: unknown[];
}

interface FastObjectFrame {
  index: number;
  keys: string[];
  kind: "object";
  value: Record<string, unknown>;
}

type FastContext = (boolean | number | object)[];
type FastFrame = FastArrayFrame | FastObjectFrame;
type EntryResult = -1 | 0 | 1 | 2;
type Result = boolean | null;

const FAST_LINEAR_CONTAINER_LIMIT = 32;

interface ResolvedOpts {
  reportCompletionFunc: Opts["reportCompletionFunc"];
  reportProgressFunc: Opts["reportProgressFunc"];
  reportProgressFuncFrom: number;
  reportProgressFuncTo: number;
}

function upgradeFastStates(context: FastContext): WeakMap<object, 1 | 2> {
  const states = new WeakMap<object, 1 | 2>();
  for (let index = 1; index < context.length; index += 2) {
    states.set(context[index] as object, context[index + 1] as 1 | 2);
  }
  context.push(states);
  return states;
}

function enterFastIterative(
  value: unknown,
  context: FastContext,
  states: WeakMap<object, 1 | 2>,
  stack: FastFrame[],
): -1 | 1 | 2 {
  if (typeof value === "string") {
    if (value.length !== 0) context[0] = true;
    return 1;
  }
  if (!Array.isArray(value) && !isObj(value)) return -1;

  const state = states.get(value);
  if (state === 1) {
    for (let index = 1; index < context.length - 1; index += 2) {
      if (context[index] === value) {
        if (context[index + 1] === 2) {
          states.set(value, 2);
          return 1;
        }
        break;
      }
    }
    return -1;
  }
  if (state === 2) return 1;

  states.set(value, 1);
  if (Array.isArray(value)) {
    stack.push({
      index: 0,
      kind: "array",
      length: value.length,
      value,
    });
  } else {
    stack.push({
      index: 0,
      keys: Object.keys(value),
      kind: "object",
      value,
    });
  }
  return 2;
}

function visitFastIterative(
  input: unknown,
  context: FastContext,
  states: WeakMap<object, 1 | 2>,
): boolean {
  const stack: FastFrame[] = [];
  const initial = enterFastIterative(input, context, states, stack);
  if (initial === -1) return false;
  if (initial === 1) return true;

  while (stack.length) {
    const frame = stack[stack.length - 1];
    if (frame.kind === "array") {
      if (frame.index === frame.length) {
        states.set(frame.value, 2);
        stack.pop();
        continue;
      }

      const index = frame.index++;
      if (!hasOwn.call(frame.value, index)) return false;
      if (
        enterFastIterative(frame.value[index], context, states, stack) === -1
      ) {
        return false;
      }
    } else {
      if (frame.index === frame.keys.length) {
        states.set(frame.value, 2);
        stack.pop();
        continue;
      }

      const key = frame.keys[frame.index++];
      if (enterFastIterative(frame.value[key], context, states, stack) === -1) {
        return false;
      }
    }
  }

  return true;
}

function visitFast(value: unknown, context: FastContext): boolean {
  if (typeof value === "string") {
    if (value.length !== 0) context[0] = true;
    return true;
  }
  if (!Array.isArray(value) && !isObj(value)) return false;

  if (context.length > FAST_LINEAR_CONTAINER_LIMIT * 2) {
    const states =
      (context.length & 1) === 0
        ? (context[context.length - 1] as WeakMap<object, 1 | 2>)
        : upgradeFastStates(context);
    return visitFastIterative(value, context, states);
  }

  for (let index = 1; index < context.length; index += 2) {
    if (context[index] === value) return context[index + 1] === 2;
  }

  const stateIndex = context.length + 1;
  context.push(value, 1);
  if (Array.isArray(value)) {
    const length = value.length;
    for (let index = 0; index < length; index++) {
      if (!hasOwn.call(value, index) || !visitFast(value[index], context)) {
        return false;
      }
    }
  } else {
    const keys = Object.keys(value);
    for (let index = 0; index < keys.length; index++) {
      if (!visitFast(value[keys[index]], context)) return false;
    }
  }

  context[stateIndex] = 2;
  return true;
}

function callSafely<T>(callback: null | ((value: T) => void), value: T): void {
  if (!callback) return;
  try {
    callback(value);
  } catch {
    // Reporting is observational and must not change the tri-state result.
  }
}

function safeNow(): number | null {
  try {
    const value = Date.now();
    return Number.isFinite(value) ? value : null;
  } catch {
    return null;
  }
}

function isEmptyObserved(input: unknown, opts: ResolvedOpts): Result {
  const startedAt = opts.reportCompletionFunc ? safeNow() : null;
  const states = new WeakMap<object, 1 | 2>();
  const stack: Frame[] = [];
  let aliasesSkipped = 0;
  let arrayElementsVisited = 0;
  let maxDepth = 0;
  let objectPropertiesVisited = 0;
  let uniqueContainersVisited = 0;
  let work = 0;
  let hasContent = false;
  let lastProgress: number | undefined;

  function reportProgress(complete = false): void {
    if (!opts.reportProgressFunc) return;
    const span = opts.reportProgressFuncTo - opts.reportProgressFuncFrom;
    const percentage = complete
      ? opts.reportProgressFuncTo
      : opts.reportProgressFuncFrom +
        span * Math.min(0.99, work / (work + 1000));
    if (percentage !== lastProgress) {
      lastProgress = percentage;
      callSafely(opts.reportProgressFunc, percentage);
    }
  }

  function recordWork(): void {
    work++;
    if (work % 1000 === 0) reportProgress();
  }

  function finish(result: Result): Result {
    reportProgress(true);
    if (opts.reportCompletionFunc) {
      const endedAt = safeNow();
      const elapsed =
        startedAt === null || endedAt === null ? null : endedAt - startedAt;
      const timeTakenInMilliseconds =
        elapsed === null || !Number.isFinite(elapsed)
          ? 0
          : Math.max(0, elapsed);
      callSafely(
        opts.reportCompletionFunc,
        Object.freeze({
          aliasesSkipped,
          arrayElementsVisited,
          maxDepth,
          objectPropertiesVisited,
          timeTakenInMilliseconds,
          uniqueContainersVisited,
        }),
      );
    }
    return result;
  }

  function enterObserved(value: unknown, depth: number): EntryResult {
    if (depth > maxDepth) maxDepth = depth;
    if (typeof value === "string") return value.length === 0 ? 1 : 0;
    if (!Array.isArray(value) && !isObj(value)) return -1;

    const state = states.get(value);
    if (state === 1) return -1;
    if (state === 2) {
      aliasesSkipped++;
      recordWork();
      return 1;
    }
    states.set(value, 1);
    uniqueContainersVisited++;
    recordWork();
    if (Array.isArray(value)) {
      stack.push({
        depth,
        index: 0,
        kind: "array",
        length: value.length,
        value,
      });
    } else {
      stack.push({
        depth,
        index: 0,
        keys: Object.keys(value),
        kind: "object",
        value,
      });
    }
    return 2;
  }

  reportProgress();
  const initial = enterObserved(input, 0);
  if (initial === -1) return finish(null);
  if (initial !== 2) return finish(initial === 1);

  while (stack.length) {
    const frame = stack[stack.length - 1];
    if (frame.kind === "array") {
      if (frame.index === frame.length) {
        states.set(frame.value, 2);
        stack.pop();
        continue;
      }

      const index = frame.index++;
      arrayElementsVisited++;
      recordWork();
      if (!hasOwn.call(frame.value, index)) {
        if (frame.depth + 1 > maxDepth) maxDepth = frame.depth + 1;
        return finish(null);
      }
      const result = enterObserved(frame.value[index], frame.depth + 1);
      if (result === -1) return finish(null);
      if (result === 0) hasContent = true;
    } else {
      if (frame.index === frame.keys.length) {
        states.set(frame.value, 2);
        stack.pop();
        continue;
      }

      const key = frame.keys[frame.index++];
      objectPropertiesVisited++;
      recordWork();
      const result = enterObserved(frame.value[key], frame.depth + 1);
      if (result === -1) return finish(null);
      if (result === 0) hasContent = true;
    }
  }

  return finish(!hasContent);
}

function resolveOptions(opts: InputOpts | null | undefined): ResolvedOpts {
  if (opts != null && !isObj(opts)) {
    throw new TypeError(
      "ast-is-empty/isEmpty(): [THROW_ID_01] The second argument must be a plain options object, null, or undefined.",
    );
  }

  const input = (opts ?? {}) as Record<string, unknown>;
  const unknownKey = Object.keys(input).find(
    (key) => !knownOptionKeys.has(key),
  );
  if (unknownKey !== undefined) {
    throw new TypeError(
      `ast-is-empty/isEmpty(): [THROW_ID_02] Unknown option ${JSON.stringify(unknownKey)}.`,
    );
  }

  const optionValue = <Key extends keyof Opts>(key: Key): Opts[Key] =>
    (hasOwn.call(input, key) && input[key] !== undefined
      ? input[key]
      : defaults[key]) as Opts[Key];

  const reportCompletionFunc = optionValue("reportCompletionFunc");
  if (
    reportCompletionFunc !== null &&
    typeof reportCompletionFunc !== "function"
  ) {
    throw new TypeError(
      "ast-is-empty/isEmpty(): [THROW_ID_03] opts.reportCompletionFunc must be a function, null, or undefined.",
    );
  }

  const reportProgressFunc = optionValue("reportProgressFunc");
  if (reportProgressFunc !== null && typeof reportProgressFunc !== "function") {
    throw new TypeError(
      "ast-is-empty/isEmpty(): [THROW_ID_04] opts.reportProgressFunc must be a function, null, or undefined.",
    );
  }

  const reportProgressFuncFrom = optionValue("reportProgressFuncFrom");
  if (!Number.isFinite(reportProgressFuncFrom)) {
    throw new TypeError(
      "ast-is-empty/isEmpty(): [THROW_ID_05] opts.reportProgressFuncFrom must be a finite number or undefined.",
    );
  }

  const reportProgressFuncTo = optionValue("reportProgressFuncTo");
  if (!Number.isFinite(reportProgressFuncTo)) {
    throw new TypeError(
      "ast-is-empty/isEmpty(): [THROW_ID_06] opts.reportProgressFuncTo must be a finite number or undefined.",
    );
  }

  if (reportProgressFuncFrom > reportProgressFuncTo) {
    throw new RangeError(
      `ast-is-empty/isEmpty(): [THROW_ID_07] opts.reportProgressFuncFrom cannot exceed opts.reportProgressFuncTo; received ${reportProgressFuncFrom} and ${reportProgressFuncTo}.`,
    );
  }
  if (!Number.isFinite(reportProgressFuncTo - reportProgressFuncFrom)) {
    throw new RangeError(
      `ast-is-empty/isEmpty(): [THROW_ID_08] opts.reportProgressFuncFrom and opts.reportProgressFuncTo must define a finite span; received ${reportProgressFuncFrom} and ${reportProgressFuncTo}.`,
    );
  }

  return {
    reportCompletionFunc,
    reportProgressFunc,
    reportProgressFuncFrom,
    reportProgressFuncTo,
  };
}

/**
 * Check whether a string or recursively nested array/plain-object tree is
 * strictly empty.
 *
 * `true` means every inspected string has zero code units and every inspected
 * container is empty or contains only empty supported values. Whitespace is
 * content and therefore produces `false`. `null` means the tree contains an
 * unsupported value, a sparse array hole, or a cycle; `null` takes precedence
 * over known content regardless of traversal order.
 *
 * Arrays are read through their own indexed slots without invoking an
 * iterator, and extra array properties are ignored. Plain objects contribute
 * their own enumerable string-keyed properties; symbol and non-enumerable
 * properties are ignored. Completed shared subtrees are inspected only once.
 *
 * Reporting callbacks are observational: their errors are ignored and cannot
 * change the tri-state result. Progress is finite and monotonic within the
 * configured range, and completion statistics are frozen.
 */
function isEmpty(input: unknown, opts?: InputOpts | null): Result {
  if (opts === undefined) {
    const context: FastContext = [false];
    return visitFast(input, context) ? context[0] !== true : null;
  }

  const resolvedOpts = resolveOptions(opts);
  if (resolvedOpts.reportCompletionFunc || resolvedOpts.reportProgressFunc) {
    return isEmptyObserved(input, resolvedOpts);
  }
  const context: FastContext = [false];
  return visitFast(input, context) ? context[0] !== true : null;
}

export { defaults, isEmpty, version };
