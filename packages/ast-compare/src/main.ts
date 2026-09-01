import {
  createMatcher,
  formatDiagnosticValue,
  hasOwnProp,
  isPlainObject,
  match,
} from "codsen-utils";

import { version as v } from "../package.json";

const version: string = v;

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonObject
  | JsonArray;
export type JsonObject = {
  readonly [Key in string]?: JsonValue | undefined;
};
export type JsonArray = readonly (JsonValue | undefined)[];
export type ComparableValue = JsonValue | undefined;

export interface AnyObject {
  readonly [key: string]: unknown;
}

export interface CompletionStats {
  candidateComparisons: number;
  comparisons: number;
  matchingEdges: number;
  timeTakenInMilliseconds: number;
}

export interface Opts {
  arrayOrder: "ordered" | "any";
  hungryForWhitespace: boolean;
  matchStrictly: boolean;
  reportCompletionFunc: null | ((stats: CompletionStats) => void);
  reportProgressFunc: null | ((percentageDone: number) => void);
  reportProgressFuncFrom: number;
  reportProgressFuncTo: number;
  verboseWhenMismatches: boolean;
  useWildcards: boolean;
}

export type BooleanOpts = Partial<Opts> & {
  verboseWhenMismatches?: false | undefined;
};
export type VerboseOpts = Partial<Opts> & {
  verboseWhenMismatches: true;
};

interface ResolvedOpts extends Opts {}

interface Mismatch {
  first: unknown;
  path: string;
  reason: string;
  second: unknown;
}

interface Outcome {
  matched: boolean;
  mismatch?: Mismatch;
}

interface PairFrame {
  first: unknown;
  kind: "pair";
  path: string;
  second: unknown;
}

interface ReleasePairFrame {
  first: object;
  kind: "release-pair";
  second: object;
}

interface OrderedArrayFrame {
  first: readonly unknown[];
  firstIndex: number;
  kind: "ordered-array";
  path: string;
  second: readonly unknown[];
  secondIndex: number;
}

interface OrderedArrayAfterFrame extends Omit<OrderedArrayFrame, "kind"> {
  kind: "ordered-array-after";
}

interface ExactObjectFrame {
  exactKeys: readonly string[];
  first: Record<string, unknown>;
  index: number;
  kind: "exact-object";
  path: string;
  second: Record<string, unknown>;
  wildcardFirstKeys: readonly string[];
  wildcardKeys: readonly string[];
}

interface ExactObjectAfterFrame extends Omit<ExactObjectFrame, "kind"> {
  kind: "exact-object-after";
}

interface ArrayCandidatesFrame {
  adjacency: CandidateRow[];
  first: readonly unknown[];
  firstIndex: number;
  kind: "array-candidates";
  path: string;
  second: readonly unknown[];
  secondIndex: number;
}

interface ArrayCandidatesAfterFrame extends Omit<ArrayCandidatesFrame, "kind"> {
  kind: "array-candidates-after";
}

interface ObjectCandidatesFrame {
  adjacency: CandidateRow[];
  first: Record<string, unknown>;
  firstIndex: number;
  firstKeys: readonly string[];
  keyMatchers: readonly ((input: string) => boolean)[];
  kind: "object-candidates";
  path: string;
  second: Record<string, unknown>;
  secondIndex: number;
  wildcardKeys: readonly string[];
}

interface ObjectCandidatesAfterFrame
  extends Omit<ObjectCandidatesFrame, "kind"> {
  kind: "object-candidates-after";
}

type Frame =
  | PairFrame
  | ReleasePairFrame
  | OrderedArrayFrame
  | OrderedArrayAfterFrame
  | ExactObjectFrame
  | ExactObjectAfterFrame
  | ArrayCandidatesFrame
  | ArrayCandidatesAfterFrame
  | ObjectCandidatesFrame
  | ObjectCandidatesAfterFrame;

interface EmptyFrame {
  allEmpty: boolean;
  children: unknown[];
  index: number;
  value: object;
}

type CandidateRow = number[] | Uint32Array;

interface ComparisonContext {
  activePairs: WeakMap<object, WeakSet<object>>;
  candidateComparisons: number;
  comparisons: number;
  emptyCache: WeakMap<object, boolean>;
  lastProgress: number | undefined;
  matchingEdges: number;
  opts: ResolvedOpts;
}

const canonicalDefaults: Readonly<Opts> = Object.freeze({
  arrayOrder: "ordered",
  hungryForWhitespace: false,
  matchStrictly: false,
  reportCompletionFunc: null,
  reportProgressFunc: null,
  reportProgressFuncFrom: 0,
  reportProgressFuncTo: 100,
  verboseWhenMismatches: false,
  useWildcards: false,
});

const defaults: Readonly<Opts> = Object.freeze({ ...canonicalDefaults });
const MATCH_OPTIONS = Object.freeze({ caseSensitiveMatch: true });
const MATCHED: Outcome = Object.freeze({ matched: true });

function mismatch(
  path: string,
  reason: string,
  first: unknown,
  second: unknown,
): Outcome {
  return { matched: false, mismatch: { first, path, reason, second } };
}

function propertyPath(path: string, key: string): string {
  return `${path}[${JSON.stringify(key)}]`;
}

function valueType(value: unknown): string {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  if (isPlainObject(value)) return "plain object";
  return typeof value;
}

function formatMismatch(value: Mismatch): string {
  return `Mismatch at ${value.path}: ${value.reason} First value is ${formatDiagnosticValue(
    value.first,
    4,
  )}; second pattern is ${formatDiagnosticValue(value.second, 4)}.`;
}

function hasActivePair(
  activePairs: WeakMap<object, WeakSet<object>>,
  first: object,
  second: object,
): boolean {
  return activePairs.get(first)?.has(second) === true;
}

function addActivePair(
  activePairs: WeakMap<object, WeakSet<object>>,
  first: object,
  second: object,
): void {
  let seconds = activePairs.get(first);
  if (!seconds) {
    seconds = new WeakSet<object>();
    activePairs.set(first, seconds);
  }
  seconds.add(second);
}

function removeActivePair(
  activePairs: WeakMap<object, WeakSet<object>>,
  first: object,
  second: object,
): void {
  activePairs.get(first)?.delete(second);
}

function emptyPrimitive(value: unknown): boolean {
  return typeof value === "string" && value.trim().length === 0;
}

function emptyChildren(value: object): unknown[] {
  if (Array.isArray(value)) {
    const children = new Array<unknown>(value.length);
    for (let index = 0; index < value.length; index++) {
      children[index] = value[index];
    }
    return children;
  }
  return Object.keys(value).map(
    (key) => (value as Record<string, unknown>)[key],
  );
}

/**
 * Resolve semantic whitespace emptiness without recursion. A cycle, sparse
 * hole, explicit undefined, null, number, or Boolean is meaningful data and is
 * therefore non-empty.
 */
function isWhitespaceEmpty(
  value: unknown,
  cache: WeakMap<object, boolean>,
): boolean {
  if (!Array.isArray(value) && !isPlainObject(value)) {
    return emptyPrimitive(value);
  }

  const cached = cache.get(value);
  if (cached !== undefined) return cached;

  const active = new WeakSet<object>();
  const stack: EmptyFrame[] = [
    { allEmpty: true, children: emptyChildren(value), index: 0, value },
  ];
  active.add(value);
  let result = false;

  while (stack.length) {
    const frame = stack[stack.length - 1];
    if (!frame.allEmpty || frame.index === frame.children.length) {
      result = frame.allEmpty;
      cache.set(frame.value, result);
      active.delete(frame.value);
      stack.pop();
      if (stack.length && !result) stack[stack.length - 1].allEmpty = false;
      continue;
    }

    const child = frame.children[frame.index++];
    if (!Array.isArray(child) && !isPlainObject(child)) {
      if (!emptyPrimitive(child)) frame.allEmpty = false;
      continue;
    }

    const childCached = cache.get(child);
    if (childCached !== undefined) {
      if (!childCached) frame.allEmpty = false;
    } else if (active.has(child)) {
      frame.allEmpty = false;
    } else {
      active.add(child);
      stack.push({
        allEmpty: true,
        children: emptyChildren(child),
        index: 0,
        value: child,
      });
    }
  }

  return result;
}

function callSafely(callback: null | ((value: any) => void), value: any): void {
  if (!callback) return;
  try {
    callback(value);
  } catch {
    // Observability callbacks must not change comparison semantics.
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

function reportProgress(context: ComparisonContext, complete = false): void {
  const { opts } = context;
  if (!opts.reportProgressFunc) return;

  const span = opts.reportProgressFuncTo - opts.reportProgressFuncFrom;
  const work = context.comparisons + context.candidateComparisons;
  const percentage = complete
    ? opts.reportProgressFuncTo
    : opts.reportProgressFuncFrom + span * Math.min(0.99, work / (work + 1000));
  if (percentage !== context.lastProgress) {
    context.lastProgress = percentage;
    callSafely(opts.reportProgressFunc, percentage);
  }
}

function recordComparison(context: ComparisonContext): void {
  context.comparisons += 1;
  if (context.comparisons % 1000 === 0) reportProgress(context);
}

function recordCandidate(context: ComparisonContext): void {
  context.candidateComparisons += 1;
  if (context.candidateComparisons % 1000 === 0) reportProgress(context);
}

function compactCandidateRow(row: number[]): Uint32Array {
  const result = new Uint32Array(row.length);
  for (let index = 0; index < row.length; index++) result[index] = row[index];
  return result;
}

/**
 * Test whether a bipartite graph contains a matching for every left vertex.
 * Hopcroft-Karp layers the graph, while the augmenting traversal uses explicit
 * stacks so ambiguous inputs cannot overflow the native call stack.
 */
function hasCompleteMatching(
  adjacency: readonly CandidateRow[],
  rightCount: number,
): boolean {
  const leftCount = adjacency.length;
  if (leftCount === 0) return true;

  const leftPair = new Int32Array(leftCount);
  const rightPair = new Int32Array(rightCount);
  const distance = new Int32Array(leftCount);
  leftPair.fill(-1);
  rightPair.fill(-1);
  let matchingSize = 0;

  while (true) {
    const queue = new Int32Array(leftCount);
    let queueStart = 0;
    let queueEnd = 0;
    let foundFreeRight = false;

    for (let left = 0; left < leftCount; left++) {
      if (leftPair[left] === -1) {
        distance[left] = 0;
        queue[queueEnd++] = left;
      } else {
        distance[left] = -1;
      }
    }

    while (queueStart < queueEnd) {
      const left = queue[queueStart++];
      for (const right of adjacency[left]) {
        const pairedLeft = rightPair[right];
        if (pairedLeft === -1) {
          foundFreeRight = true;
        } else if (distance[pairedLeft] === -1) {
          distance[pairedLeft] = distance[left] + 1;
          queue[queueEnd++] = pairedLeft;
        }
      }
    }

    if (!foundFreeRight) return matchingSize === leftCount;

    const edgeCursor = new Int32Array(leftCount);
    for (let start = 0; start < leftCount; start++) {
      if (leftPair[start] !== -1) continue;

      const leftStack: number[] = [start];
      const chosenRights: number[] = [];
      let augmented = false;

      while (leftStack.length && !augmented) {
        const depth = leftStack.length - 1;
        const left = leftStack[depth];
        const edges = adjacency[left];
        let advanced = false;

        while (edgeCursor[left] < edges.length) {
          const right = edges[edgeCursor[left]++];
          const pairedLeft = rightPair[right];
          if (pairedLeft === -1) {
            leftPair[left] = right;
            rightPair[right] = left;
            for (let index = depth - 1; index >= 0; index--) {
              const parentLeft = leftStack[index];
              const parentRight = chosenRights[index];
              leftPair[parentLeft] = parentRight;
              rightPair[parentRight] = parentLeft;
            }
            augmented = true;
            break;
          }
          if (distance[pairedLeft] === distance[left] + 1) {
            chosenRights[depth] = right;
            leftStack.push(pairedLeft);
            advanced = true;
            break;
          }
        }

        if (!advanced && !augmented) {
          distance[left] = -1;
          leftStack.pop();
          chosenRights.length = Math.max(0, leftStack.length - 1);
        }
      }

      if (augmented) {
        matchingSize += 1;
      }
    }

    if (matchingSize === leftCount) return true;
  }
}

function evaluate(
  first: unknown,
  second: unknown,
  context: ComparisonContext,
): Outcome {
  const { opts } = context;
  const stack: Frame[] = [{ first, kind: "pair", path: "$", second }];
  let outcome: Outcome = MATCHED;

  while (stack.length) {
    const frame = stack.pop() as Frame;

    if (frame.kind === "release-pair") {
      removeActivePair(context.activePairs, frame.first, frame.second);
      continue;
    }

    if (frame.kind === "ordered-array-after") {
      if (outcome.matched) {
        stack.push({
          ...frame,
          firstIndex: frame.firstIndex + 1,
          kind: "ordered-array",
          secondIndex: frame.secondIndex + 1,
        });
      } else {
        outcome = MATCHED;
        stack.push({
          ...frame,
          firstIndex: frame.firstIndex + 1,
          kind: "ordered-array",
        });
      }
      continue;
    }

    if (frame.kind === "ordered-array") {
      if (frame.secondIndex === frame.second.length) {
        outcome = MATCHED;
      } else if (frame.firstIndex === frame.first.length) {
        outcome = mismatch(
          frame.path,
          "the second array is not an ordered subset of the first array.",
          frame.first,
          frame.second,
        );
      } else {
        stack.push({ ...frame, kind: "ordered-array-after" });
        stack.push({
          first: frame.first[frame.firstIndex],
          kind: "pair",
          path: `${frame.path}[${frame.firstIndex}]`,
          second: frame.second[frame.secondIndex],
        });
      }
      continue;
    }

    if (frame.kind === "exact-object-after") {
      if (outcome.matched) {
        stack.push({
          ...frame,
          index: frame.index + 1,
          kind: "exact-object",
        });
      }
      continue;
    }

    if (frame.kind === "exact-object") {
      if (frame.index < frame.exactKeys.length) {
        const key = frame.exactKeys[frame.index];
        stack.push({ ...frame, kind: "exact-object-after" });
        stack.push({
          first: frame.first[key],
          kind: "pair",
          path: propertyPath(frame.path, key),
          second: frame.second[key],
        });
      } else if (frame.wildcardKeys.length) {
        stack.push({
          adjacency: Array.from(
            { length: frame.wildcardKeys.length },
            () => [],
          ),
          first: frame.first,
          firstIndex: 0,
          firstKeys: frame.wildcardFirstKeys,
          keyMatchers: frame.wildcardKeys.map((key) =>
            createMatcher(key, MATCH_OPTIONS),
          ),
          kind: "object-candidates",
          path: frame.path,
          second: frame.second,
          secondIndex: 0,
          wildcardKeys: frame.wildcardKeys,
        });
      } else {
        outcome = MATCHED;
      }
      continue;
    }

    if (frame.kind === "array-candidates-after") {
      if (outcome.matched) {
        (frame.adjacency[frame.secondIndex] as number[]).push(frame.firstIndex);
        context.matchingEdges += 1;
      }
      outcome = MATCHED;
      stack.push({
        ...frame,
        firstIndex: frame.firstIndex + 1,
        kind: "array-candidates",
      });
      continue;
    }

    if (frame.kind === "array-candidates") {
      if (frame.secondIndex === frame.second.length) {
        outcome = hasCompleteMatching(frame.adjacency, frame.first.length)
          ? MATCHED
          : mismatch(
              frame.path,
              "the second array has no injective unordered match in the first array.",
              frame.first,
              frame.second,
            );
      } else if (frame.firstIndex === frame.first.length) {
        frame.adjacency[frame.secondIndex] = compactCandidateRow(
          frame.adjacency[frame.secondIndex] as number[],
        );
        stack.push({
          ...frame,
          firstIndex: 0,
          kind: "array-candidates",
          secondIndex: frame.secondIndex + 1,
        });
      } else {
        recordCandidate(context);
        stack.push({ ...frame, kind: "array-candidates-after" });
        stack.push({
          first: frame.first[frame.firstIndex],
          kind: "pair",
          path: `${frame.path}[${frame.firstIndex}]`,
          second: frame.second[frame.secondIndex],
        });
      }
      continue;
    }

    if (frame.kind === "object-candidates-after") {
      if (outcome.matched) {
        (frame.adjacency[frame.secondIndex] as number[]).push(frame.firstIndex);
        context.matchingEdges += 1;
      }
      outcome = MATCHED;
      stack.push({
        ...frame,
        firstIndex: frame.firstIndex + 1,
        kind: "object-candidates",
      });
      continue;
    }

    if (frame.kind === "object-candidates") {
      if (frame.secondIndex === frame.wildcardKeys.length) {
        outcome = hasCompleteMatching(frame.adjacency, frame.firstKeys.length)
          ? MATCHED
          : mismatch(
              frame.path,
              "the wildcard properties in the second object have no injective key-and-value match in the first object.",
              frame.first,
              frame.second,
            );
      } else if (frame.firstIndex === frame.firstKeys.length) {
        frame.adjacency[frame.secondIndex] = compactCandidateRow(
          frame.adjacency[frame.secondIndex] as number[],
        );
        stack.push({
          ...frame,
          firstIndex: 0,
          kind: "object-candidates",
          secondIndex: frame.secondIndex + 1,
        });
      } else {
        recordCandidate(context);
        const firstKey = frame.firstKeys[frame.firstIndex];
        if (frame.keyMatchers[frame.secondIndex](firstKey)) {
          const secondKey = frame.wildcardKeys[frame.secondIndex];
          stack.push({ ...frame, kind: "object-candidates-after" });
          stack.push({
            first: frame.first[firstKey],
            kind: "pair",
            path: propertyPath(frame.path, firstKey),
            second: frame.second[secondKey],
          });
        } else {
          stack.push({
            ...frame,
            firstIndex: frame.firstIndex + 1,
            kind: "object-candidates",
          });
        }
      }
      continue;
    }

    recordComparison(context);
    if (frame.first === frame.second) {
      outcome = MATCHED;
      continue;
    }

    if (
      opts.hungryForWhitespace &&
      isWhitespaceEmpty(frame.first, context.emptyCache) &&
      isWhitespaceEmpty(frame.second, context.emptyCache)
    ) {
      outcome = MATCHED;
      continue;
    }

    if (typeof frame.first === "string" && typeof frame.second === "string") {
      const stringsMatch = opts.useWildcards
        ? match(frame.first, frame.second, MATCH_OPTIONS)
        : false;
      outcome = stringsMatch
        ? MATCHED
        : mismatch(
            frame.path,
            "the strings do not match.",
            frame.first,
            frame.second,
          );
      continue;
    }

    const bothArrays =
      Array.isArray(frame.first) && Array.isArray(frame.second);
    const bothObjects =
      isPlainObject(frame.first) && isPlainObject(frame.second);

    if (!bothArrays && !bothObjects) {
      const reason =
        valueType(frame.first) === valueType(frame.second)
          ? "the values are not equal."
          : `the value types differ (${valueType(frame.first)} versus ${valueType(
              frame.second,
            )}).`;
      outcome = mismatch(frame.path, reason, frame.first, frame.second);
      continue;
    }

    const firstContainer = frame.first as object;
    const secondContainer = frame.second as object;
    if (hasActivePair(context.activePairs, firstContainer, secondContainer)) {
      outcome = MATCHED;
      continue;
    }

    if (bothArrays) {
      const firstArray = frame.first as readonly unknown[];
      const secondArray = frame.second as readonly unknown[];
      if (
        (opts.matchStrictly && firstArray.length !== secondArray.length) ||
        secondArray.length > firstArray.length ||
        (secondArray.length === 0 && firstArray.length !== 0)
      ) {
        outcome = mismatch(
          frame.path,
          opts.matchStrictly
            ? "strict array matching requires equal lengths."
            : "the second array cannot be an empty or larger subset of the first array.",
          frame.first,
          frame.second,
        );
        continue;
      }

      addActivePair(context.activePairs, firstContainer, secondContainer);
      stack.push({
        first: firstContainer,
        kind: "release-pair",
        second: secondContainer,
      });
      if (opts.arrayOrder === "any") {
        stack.push({
          adjacency: Array.from({ length: secondArray.length }, () => []),
          first: firstArray,
          firstIndex: 0,
          kind: "array-candidates",
          path: frame.path,
          second: secondArray,
          secondIndex: 0,
        });
      } else {
        stack.push({
          first: firstArray,
          firstIndex: 0,
          kind: "ordered-array",
          path: frame.path,
          second: secondArray,
          secondIndex: 0,
        });
      }
      continue;
    }

    const firstObject = frame.first as Record<string, unknown>;
    const secondObject = frame.second as Record<string, unknown>;
    const firstKeys = Object.keys(firstObject);
    const secondKeys = Object.keys(secondObject);
    if (
      (opts.matchStrictly && firstKeys.length !== secondKeys.length) ||
      secondKeys.length > firstKeys.length ||
      (secondKeys.length === 0 && firstKeys.length !== 0)
    ) {
      outcome = mismatch(
        frame.path,
        opts.matchStrictly
          ? "strict object matching requires equal key counts."
          : "the second object cannot be an empty or larger subset of the first object.",
        frame.first,
        frame.second,
      );
      continue;
    }

    const exactKeys: string[] = [];
    const wildcardKeys: string[] = [];
    const reservedFirstKeys = new Set<string>();
    let missingKey: string | undefined;
    for (const key of secondKeys) {
      if (hasOwnProp(firstObject, key)) {
        exactKeys.push(key);
        reservedFirstKeys.add(key);
      } else if (opts.useWildcards) {
        wildcardKeys.push(key);
      } else {
        missingKey = key;
        break;
      }
    }

    if (missingKey !== undefined) {
      outcome = mismatch(
        propertyPath(frame.path, missingKey),
        `the first object does not have the second object's key ${JSON.stringify(
          missingKey,
        )}.`,
        undefined,
        secondObject[missingKey],
      );
      continue;
    }

    addActivePair(context.activePairs, firstContainer, secondContainer);
    stack.push({
      first: firstContainer,
      kind: "release-pair",
      second: secondContainer,
    });
    stack.push({
      exactKeys,
      first: firstObject,
      index: 0,
      kind: "exact-object",
      path: frame.path,
      second: secondObject,
      wildcardFirstKeys: firstKeys.filter((key) => !reservedFirstKeys.has(key)),
      wildcardKeys,
    });
  }

  return outcome;
}

function resolveOptions(opts: Partial<Opts> | null | undefined): ResolvedOpts {
  if (opts !== undefined && opts !== null && !isPlainObject(opts)) {
    throw new TypeError(
      `ast-compare/compare(): [THROW_ID_03] The third argument must be a plain object, null, or undefined; received ${formatDiagnosticValue(opts, 4)}.`,
    );
  }

  const input = (opts ?? {}) as Record<string, unknown>;
  const allowedKeys = new Set(Object.keys(canonicalDefaults));
  const unknownKey = Object.keys(input).find((key) => !allowedKeys.has(key));
  if (unknownKey !== undefined) {
    throw new TypeError(
      `ast-compare/compare(): [THROW_ID_04] Unknown option ${JSON.stringify(unknownKey)}.`,
    );
  }

  const ownValue = <Key extends keyof Opts>(key: Key): Opts[Key] =>
    (hasOwnProp(input, key) ? input[key] : canonicalDefaults[key]) as Opts[Key];
  const arrayOrder = ownValue("arrayOrder");
  if (arrayOrder !== "ordered" && arrayOrder !== "any") {
    throw new TypeError(
      `ast-compare/compare(): [THROW_ID_05] opts.arrayOrder must be "ordered" or "any"; received ${formatDiagnosticValue(arrayOrder, 4)}.`,
    );
  }

  const hungryForWhitespace = ownValue("hungryForWhitespace");
  if (typeof hungryForWhitespace !== "boolean") {
    throw new TypeError(
      `ast-compare/compare(): [THROW_ID_06] opts.hungryForWhitespace must be a Boolean; received ${formatDiagnosticValue(hungryForWhitespace, 4)}.`,
    );
  }
  const matchStrictly = ownValue("matchStrictly");
  if (typeof matchStrictly !== "boolean") {
    throw new TypeError(
      `ast-compare/compare(): [THROW_ID_07] opts.matchStrictly must be a Boolean; received ${formatDiagnosticValue(matchStrictly, 4)}.`,
    );
  }
  const verboseWhenMismatches = ownValue("verboseWhenMismatches");
  if (typeof verboseWhenMismatches !== "boolean") {
    throw new TypeError(
      `ast-compare/compare(): [THROW_ID_08] opts.verboseWhenMismatches must be a Boolean; received ${formatDiagnosticValue(verboseWhenMismatches, 4)}.`,
    );
  }
  const useWildcards = ownValue("useWildcards");
  if (typeof useWildcards !== "boolean") {
    throw new TypeError(
      `ast-compare/compare(): [THROW_ID_09] opts.useWildcards must be a Boolean; received ${formatDiagnosticValue(useWildcards, 4)}.`,
    );
  }

  const reportCompletionFunc = ownValue("reportCompletionFunc");
  if (
    reportCompletionFunc !== null &&
    typeof reportCompletionFunc !== "function"
  ) {
    throw new TypeError(
      `ast-compare/compare(): [THROW_ID_10] opts.reportCompletionFunc must be a function or null; received ${formatDiagnosticValue(reportCompletionFunc, 4)}.`,
    );
  }

  const reportProgressFunc = ownValue("reportProgressFunc");
  if (reportProgressFunc !== null && typeof reportProgressFunc !== "function") {
    throw new TypeError(
      `ast-compare/compare(): [THROW_ID_11] opts.reportProgressFunc must be a function or null; received ${formatDiagnosticValue(reportProgressFunc, 4)}.`,
    );
  }

  const reportProgressFuncFrom = ownValue("reportProgressFuncFrom");
  if (!Number.isFinite(reportProgressFuncFrom)) {
    throw new TypeError(
      `ast-compare/compare(): [THROW_ID_12] opts.reportProgressFuncFrom must be a finite number; received ${formatDiagnosticValue(reportProgressFuncFrom, 4)}.`,
    );
  }

  const reportProgressFuncTo = ownValue("reportProgressFuncTo");
  if (!Number.isFinite(reportProgressFuncTo)) {
    throw new TypeError(
      `ast-compare/compare(): [THROW_ID_13] opts.reportProgressFuncTo must be a finite number; received ${formatDiagnosticValue(reportProgressFuncTo, 4)}.`,
    );
  }
  if (reportProgressFuncFrom > reportProgressFuncTo) {
    throw new RangeError(
      `ast-compare/compare(): [THROW_ID_14] opts.reportProgressFuncFrom cannot exceed opts.reportProgressFuncTo; received ${reportProgressFuncFrom} and ${reportProgressFuncTo}.`,
    );
  }

  return {
    arrayOrder,
    hungryForWhitespace,
    matchStrictly,
    reportCompletionFunc,
    reportProgressFunc,
    reportProgressFuncFrom,
    reportProgressFuncTo,
    verboseWhenMismatches,
    useWildcards,
  };
}

/**
 * Check whether the second value is equal to, or a subset of, the first value.
 */
function compare(
  b: ComparableValue,
  s: ComparableValue,
  opts: VerboseOpts,
): true | string;
function compare(
  b: ComparableValue,
  s: ComparableValue,
  opts?: BooleanOpts | null,
): boolean;
function compare(
  b: ComparableValue,
  s: ComparableValue,
  opts?: Partial<Opts> | null,
): boolean | string;
function compare(
  ...args: [
    b?: ComparableValue,
    s?: ComparableValue,
    opts?: Partial<Opts> | null,
  ]
): boolean | string {
  if (args.length < 1) {
    throw new TypeError(
      "ast-compare/compare(): [THROW_ID_01] The first value is missing.",
    );
  }
  if (args.length < 2) {
    throw new TypeError(
      "ast-compare/compare(): [THROW_ID_02] The second pattern is missing.",
    );
  }

  const [b, s, opts] = args;
  const resolvedOpts = resolveOptions(opts);
  const startedAt = resolvedOpts.reportCompletionFunc ? safeNow() : null;
  const context: ComparisonContext = {
    activePairs: new WeakMap<object, WeakSet<object>>(),
    candidateComparisons: 0,
    comparisons: 0,
    emptyCache: new WeakMap<object, boolean>(),
    lastProgress: undefined,
    matchingEdges: 0,
    opts: resolvedOpts,
  };
  callSafely(
    resolvedOpts.reportProgressFunc,
    resolvedOpts.reportProgressFuncFrom,
  );
  context.lastProgress = resolvedOpts.reportProgressFuncFrom;

  const outcome = evaluate(b, s, context);
  reportProgress(context, true);
  if (resolvedOpts.reportCompletionFunc) {
    const finishedAt = safeNow();
    const difference =
      startedAt === null || finishedAt === null ? 0 : finishedAt - startedAt;
    callSafely(
      resolvedOpts.reportCompletionFunc,
      Object.freeze({
        candidateComparisons: context.candidateComparisons,
        comparisons: context.comparisons,
        matchingEdges: context.matchingEdges,
        timeTakenInMilliseconds: Number.isFinite(difference)
          ? Math.max(0, difference)
          : 0,
      }),
    );
  }

  if (outcome.matched) return true;
  return resolvedOpts.verboseWhenMismatches
    ? formatMismatch(outcome.mismatch as Mismatch)
    : false;
}

export { compare, defaults, version };
