import { version as v } from "../package.json";

const version: string = v;

declare let DEV: boolean;

export interface CompletionStats {
  /** Number of links to already-completed containers that were skipped. */
  readonly aliasesSkipped: number;
  /** Number of indexed array slots inspected, including a failing sparse hole. */
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

const canonicalDefaults: Opts = {
  reportCompletionFunc: null,
  reportProgressFunc: null,
  reportProgressFuncFrom: 0,
  reportProgressFuncTo: 100,
};

const defaults: Readonly<Opts> = Object.freeze({ ...canonicalDefaults });
const hasOwn = Object.prototype.hasOwnProperty;
const knownOptionKeys = new Set([
  "reportCompletionFunc",
  "reportProgressFunc",
  "reportProgressFuncFrom",
  "reportProgressFuncTo",
]);

interface ArrayFrame {
  depth: number;
  index: number;
  kind: "array";
  length: number;
  value: unknown[];
}

interface ObjectFrame {
  depth: number;
  index: number;
  keys: string[];
  kind: "object";
  value: Record<string, unknown>;
}

type Frame = ArrayFrame | ObjectFrame;

interface ResolvedOpts {
  reportCompletionFunc: Opts["reportCompletionFunc"];
  reportProgressFunc: Opts["reportProgressFunc"];
  reportProgressFuncFrom: number;
  reportProgressFuncTo: number;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value == null || typeof value !== "object") {
    return false;
  }
  const proto = Object.getPrototypeOf(value);
  return (
    proto === null ||
    proto === Object.prototype ||
    Object.getPrototypeOf(proto) === null
  );
}

function isWhitespace(value: string): boolean {
  return !value.trim();
}

function enterContainer(
  value: unknown,
  depth: number,
  states: WeakMap<object, 1 | 2>,
  stack: Frame[],
): 0 | 1 | 2 {
  if (typeof value === "string") {
    return isWhitespace(value) ? 1 : 0;
  }
  if (!Array.isArray(value) && !isPlainObject(value)) {
    return 0;
  }

  const state = states.get(value);
  if (state === 1) return 0;
  if (state === 2) return 2;

  states.set(value, 1);
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
  return 1;
}

function containsOnlyWhitespaceFast(input: unknown): boolean {
  if (typeof input === "string") return isWhitespace(input);

  const states = new WeakMap<object, 1 | 2>();
  const stack: Frame[] = [];
  if (enterContainer(input, 0, states, stack) === 0) return false;

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
        enterContainer(frame.value[index], frame.depth + 1, states, stack) === 0
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
      if (
        enterContainer(frame.value[key], frame.depth + 1, states, stack) === 0
      ) {
        return false;
      }
    }
  }

  return true;
}

function callSafely<T>(callback: null | ((value: T) => void), value: T): void {
  if (!callback) return;
  try {
    callback(value);
  } catch {
    // Reporting is observational and must not change the Boolean result.
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

function containsOnlyWhitespaceObserved(
  input: unknown,
  opts: ResolvedOpts,
): boolean {
  const startedAt = opts.reportCompletionFunc ? safeNow() : null;
  const states = new WeakMap<object, 1 | 2>();
  const stack: Frame[] = [];
  let aliasesSkipped = 0;
  let arrayElementsVisited = 0;
  let maxDepth = 0;
  let objectPropertiesVisited = 0;
  let uniqueContainersVisited = 0;
  let work = 0;
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

  function finish(result: boolean): boolean {
    reportProgress(true);
    if (opts.reportCompletionFunc) {
      const endedAt = safeNow();
      const timeTakenInMilliseconds =
        startedAt === null || endedAt === null
          ? 0
          : Math.max(0, endedAt - startedAt);
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

  function enterObserved(value: unknown, depth: number): boolean {
    if (depth > maxDepth) maxDepth = depth;
    if (typeof value === "string") return isWhitespace(value);
    if (!Array.isArray(value) && !isPlainObject(value)) return false;

    const state = states.get(value);
    if (state === 1) return false;
    if (state === 2) {
      aliasesSkipped++;
      recordWork();
      return true;
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
    return true;
  }

  reportProgress();
  if (!enterObserved(input, 0)) return finish(false);

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
        return finish(false);
      }
      if (!enterObserved(frame.value[index], frame.depth + 1)) {
        return finish(false);
      }
    } else {
      if (frame.index === frame.keys.length) {
        states.set(frame.value, 2);
        stack.pop();
        continue;
      }

      const key = frame.keys[frame.index++];
      objectPropertiesVisited++;
      recordWork();
      if (!enterObserved(frame.value[key], frame.depth + 1)) {
        return finish(false);
      }
    }
  }

  return finish(true);
}

function resolveOptions(opts: InputOpts | null | undefined): ResolvedOpts {
  if (opts != null && !isPlainObject(opts)) {
    throw new TypeError(
      "ast-contains-only-empty-space/empty(): [THROW_ID_01] The second argument must be a plain options object, null, or undefined.",
    );
  }

  const input = (opts ?? {}) as Record<string, unknown>;
  const unknownKey = Object.keys(input).find(
    (key) => !knownOptionKeys.has(key),
  );
  if (unknownKey !== undefined) {
    throw new TypeError(
      `ast-contains-only-empty-space/empty(): [THROW_ID_02] Unknown option ${JSON.stringify(unknownKey)}.`,
    );
  }

  const optionValue = <Key extends keyof Opts>(key: Key): Opts[Key] =>
    (hasOwn.call(input, key) && input[key] !== undefined
      ? input[key]
      : canonicalDefaults[key]) as Opts[Key];

  const reportCompletionFunc = optionValue("reportCompletionFunc");
  if (
    reportCompletionFunc !== null &&
    typeof reportCompletionFunc !== "function"
  ) {
    throw new TypeError(
      "ast-contains-only-empty-space/empty(): [THROW_ID_03] opts.reportCompletionFunc must be a function, null, or undefined.",
    );
  }

  const reportProgressFunc = optionValue("reportProgressFunc");
  if (reportProgressFunc !== null && typeof reportProgressFunc !== "function") {
    throw new TypeError(
      "ast-contains-only-empty-space/empty(): [THROW_ID_04] opts.reportProgressFunc must be a function, null, or undefined.",
    );
  }

  const reportProgressFuncFrom = optionValue("reportProgressFuncFrom");
  if (!Number.isFinite(reportProgressFuncFrom)) {
    throw new TypeError(
      "ast-contains-only-empty-space/empty(): [THROW_ID_05] opts.reportProgressFuncFrom must be a finite number or undefined.",
    );
  }

  const reportProgressFuncTo = optionValue("reportProgressFuncTo");
  if (!Number.isFinite(reportProgressFuncTo)) {
    throw new TypeError(
      "ast-contains-only-empty-space/empty(): [THROW_ID_06] opts.reportProgressFuncTo must be a finite number or undefined.",
    );
  }

  if (reportProgressFuncFrom > reportProgressFuncTo) {
    throw new RangeError(
      `ast-contains-only-empty-space/empty(): [THROW_ID_07] opts.reportProgressFuncFrom cannot exceed opts.reportProgressFuncTo; received ${reportProgressFuncFrom} and ${reportProgressFuncTo}.`,
    );
  }
  if (!Number.isFinite(reportProgressFuncTo - reportProgressFuncFrom)) {
    throw new RangeError(
      `ast-contains-only-empty-space/empty(): [THROW_ID_08] opts.reportProgressFuncFrom and opts.reportProgressFuncTo must define a finite span; received ${reportProgressFuncFrom} and ${reportProgressFuncTo}.`,
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
 * Check whether a value is a whitespace string or an array/plain object whose
 * recursively inspected contents satisfy the same condition.
 *
 * Arrays are read through their own indexed slots without invoking an
 * iterator. A sparse hole is non-empty. Extra array properties are ignored.
 * Plain objects contribute their own enumerable string-keyed properties;
 * symbol and non-enumerable properties are ignored. Every other value,
 * including `null`, numbers, Booleans, boxed primitives, and class instances,
 * is non-empty. Cycles are non-empty, while completed shared subtrees are
 * inspected only once.
 *
 * Reporting callbacks are observational: their errors are ignored and cannot
 * change the Boolean result. Progress is finite and monotonic within the
 * configured range, and completion statistics are frozen.
 */
function empty(input: unknown, opts?: InputOpts | null): boolean {
  if (opts === undefined) {
    const result = containsOnlyWhitespaceFast(input);
    DEV && console.log(`return ${result}`);
    return result;
  }

  const resolvedOpts = resolveOptions(opts);
  const observing = Boolean(
    resolvedOpts.reportCompletionFunc || resolvedOpts.reportProgressFunc,
  );
  const result = observing
    ? containsOnlyWhitespaceObserved(input, resolvedOpts)
    : containsOnlyWhitespaceFast(input);
  DEV && console.log(`return ${result}`);
  return result;
}

export { defaults, empty, version };
