import { version as packageVersion } from "../package.json";
import qwerty from "./qwerty";

export const version: string = packageVersion;

export interface TypoCosts {
  missingCharacter: number;
  omissionOpen: number;
  omissionExtend: number;
  extraCharacter: number;
  repeatedCharacter: number;
  adjacentSwap: number;
  keyboardSubstitution: number;
  substitution: number;
}

export type Keyboard =
  | null
  | "qwerty"
  | Readonly<Record<string, readonly string[]>>;

export interface MatchOptions {
  maxEvents: 1 | 2;
  maxCost: number;
  minCostGap: number;
  minInputLength: number;
  maxOmissionLength: number;
  maxOmissionRatio: number;
  keyboard: Keyboard;
  costs: Partial<TypoCosts>;
}

export interface CallOptions {
  progressFn?: ((percentage: number) => void) | null;
}

export interface PreparationLog {
  candidateCount: number;
  uniqueCandidateCount: number;
  timeTakenInMilliseconds: number;
}

export interface MatchLog {
  uniqueCandidateCount: number;
  evaluatedCandidateCount: number;
  prunedCandidateCount: number;
  eligibleCandidateCount: number;
  timeTakenInMilliseconds: number;
}

export type TypoKind =
  | "missing-character"
  | "omitted-block"
  | "repeated-character"
  | "extra-character"
  | "adjacent-swap"
  | "keyboard-substitution"
  | "substitution";

export interface TypoOperation {
  kind: TypoKind;
  candidateFrom: number;
  candidateTo: number;
  inputFrom: number;
  inputTo: number;
  cost: number;
}

export interface CandidateMatch {
  candidate: string;
  candidateIndex: number;
  cost: number;
  eventCount: number;
  operations: TypoOperation[];
}

export interface MatchResult {
  status: "exact" | "matched" | "ambiguous" | "no-match";
  bestMatch: string | null;
  matches: CandidateMatch[];
  log: MatchLog;
}

export interface Matcher {
  match(input: string, options?: CallOptions): MatchResult;
  readonly log: Readonly<PreparationLog>;
}

export const defaults = Object.freeze({
  maxEvents: 1 as 1 | 2,
  maxCost: 200,
  minCostGap: 25,
  minInputLength: 3,
  maxOmissionLength: 4,
  maxOmissionRatio: 0.5,
  keyboard: null,
  costs: Object.freeze({
    missingCharacter: 100,
    omissionOpen: 100,
    omissionExtend: 20,
    extraCharacter: 100,
    repeatedCharacter: 75,
    adjacentSwap: 100,
    keyboardSubstitution: 75,
    substitution: 150,
  }),
});

interface Policy extends Omit<MatchOptions, "keyboard" | "costs"> {
  keyboard: Map<string, Set<string>> | null;
  costs: TypoCosts;
}

interface Characters {
  points: string[];
  offsets: number[];
}

interface Candidate extends Characters {
  value: string;
  index: number;
}

interface Prepared {
  candidates: Candidate[];
  exact: Map<string, Candidate>;
  policy: Policy;
  log: Readonly<PreparationLog>;
}

type FunctionName = "matchTypos" | "createMatcher" | "match";

function isRecord(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function characters(value: string): Characters {
  const points = Array.from(value);
  const offsets = new Array<number>(points.length + 1);
  let offset = 0;
  for (let index = 0; index < points.length; index += 1) {
    offsets[index] = offset;
    offset += points[index].length;
  }
  offsets[points.length] = offset;
  return { points, offsets };
}

function validateInput(input: string, name: FunctionName): void {
  if (typeof input !== "string") {
    throw new TypeError(
      `string-typo-match/${name}(): [THROW_ID_01] input must be a string.`,
    );
  }
}

function snapshotCandidates(
  candidates: readonly string[],
  name: FunctionName,
): string[] {
  if (!Array.isArray(candidates)) {
    throw new TypeError(
      `string-typo-match/${name}(): [THROW_ID_02] candidates must be an array.`,
    );
  }
  const copy = candidates.slice();
  for (let index = 0; index < copy.length; index += 1) {
    if (typeof copy[index] !== "string" || !copy[index].length) {
      throw new TypeError(
        `string-typo-match/${name}(): [THROW_ID_03] candidate at index ${index} must be a nonempty string.`,
      );
    }
  }
  return copy;
}

function validateOptions(
  options: (Partial<MatchOptions> & CallOptions) | undefined,
  name: FunctionName,
  existingPolicy?: Policy,
): { policy: Policy; progressFn: CallOptions["progressFn"] } {
  if (options !== undefined && !isRecord(options)) {
    throw new TypeError(
      `string-typo-match/${name}(): [THROW_ID_04] options must be a plain object.`,
    );
  }
  const supplied = options || {};
  const optionNames = existingPolicy
    ? ["progressFn"]
    : [...Object.keys(defaults), "progressFn"];
  if (
    Reflect.ownKeys(supplied).some(
      (key) => typeof key !== "string" || !optionNames.includes(key),
    )
  ) {
    throw new TypeError(
      `string-typo-match/${name}(): [THROW_ID_05] options contain an unknown key.`,
    );
  }
  const progressFn = supplied.progressFn as CallOptions["progressFn"];
  if (
    progressFn !== undefined &&
    progressFn !== null &&
    typeof progressFn !== "function"
  ) {
    throw new TypeError(
      `string-typo-match/${name}(): [THROW_ID_06] progressFn must be a function or null.`,
    );
  }
  if (existingPolicy) {
    return { policy: existingPolicy, progressFn };
  }
  const merged = { ...defaults, ...supplied };
  if (merged.maxEvents !== 1 && merged.maxEvents !== 2) {
    throw new TypeError(
      `string-typo-match/${name}(): [THROW_ID_07] maxEvents must be 1 or 2.`,
    );
  }
  for (const key of [
    "maxCost",
    "minCostGap",
    "minInputLength",
    "maxOmissionLength",
  ] as const) {
    const minimum = key === "maxCost" || key === "minCostGap" ? 0 : 1;
    if (!Number.isSafeInteger(merged[key]) || merged[key] < minimum) {
      throw new TypeError(
        `string-typo-match/${name}(): [THROW_ID_08] ${key} must be a safe integer of at least ${minimum}.`,
      );
    }
  }
  if (
    !Number.isFinite(merged.maxOmissionRatio) ||
    merged.maxOmissionRatio < 0 ||
    merged.maxOmissionRatio > 1
  ) {
    throw new TypeError(
      `string-typo-match/${name}(): [THROW_ID_09] maxOmissionRatio must be a finite number between 0 and 1.`,
    );
  }
  if (supplied.costs !== undefined && !isRecord(supplied.costs)) {
    throw new TypeError(
      `string-typo-match/${name}(): [THROW_ID_10] costs must be a plain object.`,
    );
  }
  if (
    supplied.costs &&
    Reflect.ownKeys(supplied.costs).some(
      (key) =>
        typeof key !== "string" || !Object.keys(defaults.costs).includes(key),
    )
  ) {
    throw new TypeError(
      `string-typo-match/${name}(): [THROW_ID_11] costs contain an unknown key.`,
    );
  }
  const costs: TypoCosts = { ...defaults.costs, ...supplied.costs };
  for (const key of Object.keys(costs) as (keyof TypoCosts)[]) {
    if (
      !Number.isSafeInteger(costs[key]) ||
      costs[key] < (key === "omissionExtend" ? 0 : 1)
    ) {
      throw new TypeError(
        `string-typo-match/${name}(): [THROW_ID_12] ${key} must be a ${key === "omissionExtend" ? "nonnegative" : "positive"} safe integer.`,
      );
    }
  }
  if (
    costs.omissionExtend > Number.MAX_SAFE_INTEGER - costs.omissionOpen ||
    costs.omissionOpen + costs.omissionExtend < costs.missingCharacter ||
    (costs.omissionExtend > 0 &&
      merged.maxOmissionLength - 1 >
        Math.floor(
          (Number.MAX_SAFE_INTEGER - costs.omissionOpen) / costs.omissionExtend,
        ))
  ) {
    throw new TypeError(
      `string-typo-match/${name}(): [THROW_ID_13] block costs must remain safe integers and cannot cost less than one missing character.`,
    );
  }
  if (
    merged.keyboard !== null &&
    merged.keyboard !== "qwerty" &&
    !isRecord(merged.keyboard)
  ) {
    throw new TypeError(
      `string-typo-match/${name}(): [THROW_ID_14] keyboard must be null, "qwerty", or an adjacency record.`,
    );
  }
  let keyboard: Policy["keyboard"] = null;
  if (merged.keyboard !== null) {
    keyboard = new Map();
    const map = merged.keyboard === "qwerty" ? qwerty : merged.keyboard;
    for (const key of Reflect.ownKeys(map)) {
      if (typeof key !== "string" || Array.from(key).length !== 1) {
        throw new TypeError(
          `string-typo-match/${name}(): [THROW_ID_15] each keyboard key must contain exactly one code point.`,
        );
      }
      const neighbors = map[key];
      if (!Array.isArray(neighbors)) {
        throw new TypeError(
          `string-typo-match/${name}(): [THROW_ID_16] keyboard neighbors must be arrays.`,
        );
      }
      const copy = new Set<string>();
      for (const neighbor of neighbors) {
        if (typeof neighbor !== "string" || Array.from(neighbor).length !== 1) {
          throw new TypeError(
            `string-typo-match/${name}(): [THROW_ID_17] each keyboard neighbor must contain exactly one code point.`,
          );
        }
        copy.add(neighbor);
      }
      keyboard.set(key, copy);
    }
  }
  return {
    policy: {
      maxEvents: merged.maxEvents,
      maxCost: merged.maxCost,
      minCostGap: merged.minCostGap,
      minInputLength: merged.minInputLength,
      maxOmissionLength: merged.maxOmissionLength,
      maxOmissionRatio: merged.maxOmissionRatio,
      keyboard,
      costs,
    },
    progressFn,
  };
}

function progress(
  callback: CallOptions["progressFn"],
): (value: number) => void {
  let previous = -1;
  return (value) => {
    if (callback && value > previous) {
      previous = value;
      callback(value);
    }
  };
}

function elapsed(start: number): number {
  const duration = Date.now() - start;
  return Number.isFinite(duration) && duration > 0 ? duration : 0;
}

const kindOrder: Record<TypoKind, number> = {
  "missing-character": 0,
  "omitted-block": 1,
  "repeated-character": 2,
  "extra-character": 3,
  "adjacent-swap": 4,
  "keyboard-substitution": 5,
  substitution: 6,
};

function earlier(left: TypoOperation[], right: TypoOperation[]): boolean {
  for (let index = 0; index < left.length; index += 1) {
    const a = left[index];
    const b = right[index];
    const difference =
      a.candidateFrom - b.candidateFrom ||
      a.inputFrom - b.inputFrom ||
      a.candidateTo - b.candidateTo ||
      a.inputTo - b.inputTo ||
      kindOrder[a.kind] - kindOrder[b.kind];
    if (difference) {
      return difference < 0;
    }
  }
  return false;
}

// Each branch chooses the first event along an unchanged prefix. The final
// event is solved directly using the common suffix, so no edit-distance matrix
// or enumeration of ineligible candidate pairs is needed.
function score(
  candidate: Candidate,
  input: Characters,
  policy: Policy,
): CandidateMatch | null {
  const a = candidate.points;
  const b = input.points;
  const n = a.length;
  const m = b.length;
  const delta = n - m;
  const costs = policy.costs;
  let suffix = 0;
  while (suffix < n && suffix < m && a[n - suffix - 1] === b[m - suffix - 1]) {
    suffix += 1;
  }
  let best: CandidateMatch | null = null;
  let bestCost = policy.maxCost;

  // Small vocabularies use direct comparisons. Repeated long-string queries
  // on the same diagonal share an exact-match run table, bounding rescans.
  const queried = new Set<number>();
  const diagonals = new Map<number, Uint32Array>();
  function prefix(from: number, observed: number, end = n): number {
    const diagonal = from - observed;
    let table = diagonals.get(diagonal);
    if (!table && n >= 128 && queried.has(diagonal)) {
      table = new Uint32Array(n + 1);
      for (let at = n - 1; at >= 0; at -= 1) {
        const other = at - diagonal;
        if (other >= 0 && other < m && a[at] === b[other]) {
          table[at] = table[at + 1] + 1;
        }
      }
      diagonals.set(diagonal, table);
    }
    queried.add(diagonal);
    if (table) {
      return Math.min(end - from, table[from]);
    }
    let length = 0;
    while (
      from + length < end &&
      observed + length < m &&
      a[from + length] === b[observed + length]
    ) {
      length += 1;
    }
    return length;
  }

  function operation(
    kind: TypoKind,
    from: number,
    to: number,
    observed: number,
    observedTo: number,
    cost: number,
  ): TypoOperation {
    return {
      kind,
      candidateFrom: candidate.offsets[from],
      candidateTo: candidate.offsets[to],
      inputFrom: input.offsets[observed],
      inputTo: input.offsets[observedTo],
      cost,
    };
  }

  function accept(
    first: TypoOperation | null,
    last: TypoOperation | null,
  ): void {
    const total = (first?.cost || 0) + (last?.cost || 0);
    const operations = first
      ? last
        ? [first, last]
        : [first]
      : last
        ? [last]
        : [];
    if (
      !best ||
      total < best.cost ||
      (total === best.cost &&
        (operations.length < best.eventCount ||
          (operations.length === best.eventCount &&
            earlier(operations, best.operations))))
    ) {
      best = {
        candidate: candidate.value,
        candidateIndex: candidate.index,
        cost: total,
        eventCount: operations.length,
        operations,
      };
      bestCost = total;
    }
  }

  function lastEvent(
    from: number,
    observed: number,
    first: TypoOperation | null,
    omitted: number,
    previousOmission: boolean,
    previousMatched: boolean,
  ): void {
    const used = first?.cost || 0;
    const budget = bestCost - used;
    if (budget < 0) {
      return;
    }
    const difference = n - from - (m - observed);
    if (!difference && n - from <= suffix) {
      accept(first, null);
      return;
    }
    if (difference > 0) {
      if (
        difference > policy.maxOmissionLength ||
        (omitted + difference) / n > policy.maxOmissionRatio
      ) {
        return;
      }
      const cost =
        difference === 1
          ? costs.missingCharacter
          : costs.omissionOpen + (difference - 1) * costs.omissionExtend;
      if (cost > budget) {
        return;
      }
      let at = Math.max(from, n - suffix - difference);
      // Adjacent omission events would split one contiguous run.
      if (previousOmission && at === from) {
        at += 1;
      }
      const other = observed + at - from;
      if (
        at + difference <= n &&
        other <= m &&
        prefix(from, observed, at) === at - from
      ) {
        accept(
          first,
          operation(
            difference === 1 ? "missing-character" : "omitted-block",
            at,
            at + difference,
            other,
            other,
            cost,
          ),
        );
      }
      return;
    }
    if (difference === -1) {
      const at = Math.max(from, n - suffix);
      const other = observed + at - from;
      if (at > n || other >= m || prefix(from, observed, at) !== at - from) {
        return;
      }
      const repeated =
        ((at > from || previousMatched) && a[at - 1] === b[other]) ||
        (at < n && a[at] === b[other]);
      const specialized =
        repeated && costs.repeatedCharacter <= costs.extraCharacter;
      const cost = specialized ? costs.repeatedCharacter : costs.extraCharacter;
      if (cost <= budget) {
        accept(
          first,
          operation(
            specialized ? "repeated-character" : "extra-character",
            at,
            at,
            other,
            other + 1,
            cost,
          ),
        );
      }
      return;
    }
    if (difference !== 0) {
      return;
    }
    const retained = prefix(from, observed);
    const at = from + retained;
    const other = observed + retained;
    if (n - at - 1 <= suffix) {
      const keyboard =
        policy.keyboard?.get(a[at])?.has(b[other]) &&
        costs.keyboardSubstitution <= costs.substitution;
      const cost = keyboard ? costs.keyboardSubstitution : costs.substitution;
      if (cost <= budget) {
        accept(
          first,
          operation(
            keyboard ? "keyboard-substitution" : "substitution",
            at,
            at + 1,
            other,
            other + 1,
            cost,
          ),
        );
      }
    }
    if (
      at + 1 < n &&
      n - at - 2 <= suffix &&
      a[at] === b[other + 1] &&
      a[at + 1] === b[other] &&
      costs.adjacentSwap <= budget
    ) {
      accept(
        first,
        operation(
          "adjacent-swap",
          at,
          at + 2,
          other,
          other + 2,
          costs.adjacentSwap,
        ),
      );
    }
  }

  lastEvent(0, 0, null, 0, false, false);
  if (policy.maxEvents === 1) {
    return best;
  }

  const initialPrefix = prefix(0, 0, Math.min(n, m));
  for (let at = 0; at <= initialPrefix; at += 1) {
    const budget = bestCost;
    const maximum = Math.min(policy.maxOmissionLength, n - at, delta + 1);
    const minimum = Math.max(1, delta - policy.maxOmissionLength);
    for (let length = minimum; length <= maximum; length += 1) {
      const cost =
        length === 1
          ? costs.missingCharacter
          : costs.omissionOpen + (length - 1) * costs.omissionExtend;
      if (length / n <= policy.maxOmissionRatio && cost < budget) {
        lastEvent(
          at + length,
          at,
          operation(
            length === 1 ? "missing-character" : "omitted-block",
            at,
            at + length,
            at,
            at,
            cost,
          ),
          length,
          true,
          false,
        );
      }
    }
    if (at < m && delta >= -2 && delta < policy.maxOmissionLength) {
      const leftRepeated = at > 0 && a[at - 1] === b[at];
      const specialized =
        leftRepeated && costs.repeatedCharacter <= costs.extraCharacter;
      const cost = specialized ? costs.repeatedCharacter : costs.extraCharacter;
      if (cost < budget) {
        lastEvent(
          at,
          at + 1,
          operation(
            specialized ? "repeated-character" : "extra-character",
            at,
            at,
            at,
            at + 1,
            cost,
          ),
          0,
          false,
          false,
        );
      }
      // The right neighbor qualifies only when the alignment actually retains
      // it. Consume that unchanged match before considering another event.
      if (
        !leftRepeated &&
        at < n &&
        a[at] === b[at] &&
        a[at] === b[at + 1] &&
        costs.repeatedCharacter <= costs.extraCharacter &&
        costs.repeatedCharacter < budget
      ) {
        lastEvent(
          at + 1,
          at + 2,
          operation(
            "repeated-character",
            at,
            at,
            at,
            at + 1,
            costs.repeatedCharacter,
          ),
          0,
          false,
          true,
        );
      }
    }
    if (at < n && at < m && a[at] !== b[at]) {
      const keyboard =
        policy.keyboard?.get(a[at])?.has(b[at]) &&
        costs.keyboardSubstitution <= costs.substitution;
      const cost = keyboard ? costs.keyboardSubstitution : costs.substitution;
      if (cost < budget) {
        lastEvent(
          at + 1,
          at + 1,
          operation(
            keyboard ? "keyboard-substitution" : "substitution",
            at,
            at + 1,
            at,
            at + 1,
            cost,
          ),
          0,
          false,
          false,
        );
      }
      if (
        at + 1 < n &&
        at + 1 < m &&
        a[at] === b[at + 1] &&
        a[at + 1] === b[at] &&
        costs.adjacentSwap < budget
      ) {
        lastEvent(
          at + 2,
          at + 2,
          operation(
            "adjacent-swap",
            at,
            at + 2,
            at,
            at + 2,
            costs.adjacentSwap,
          ),
          0,
          false,
          false,
        );
      }
    }
  }
  return best;
}

function prepare(
  supplied: string[],
  policy: Policy,
  report: (value: number) => void,
  start: number,
): Prepared {
  report(0);
  const candidates: Candidate[] = [];
  const exact = new Map<string, Candidate>();
  for (let index = 0; index < supplied.length; index += 1) {
    const value = supplied[index];
    if (!exact.has(value)) {
      const candidate = { value, index, ...characters(value) };
      candidates.push(candidate);
      exact.set(value, candidate);
    }
    report(Math.floor(((index + 1) * 95) / supplied.length));
  }
  const prepared = {
    candidates,
    exact,
    policy,
    log: Object.freeze({
      candidateCount: supplied.length,
      uniqueCandidateCount: candidates.length,
      timeTakenInMilliseconds: elapsed(start),
    }),
  };
  report(100);
  return prepared;
}

function lookup(
  value: string,
  prepared: Prepared,
  report: (value: number) => void,
  start: number,
): MatchResult {
  report(0);
  const { candidates, policy, exact } = prepared;
  const result: MatchResult = {
    status: "no-match",
    bestMatch: null,
    matches: [],
    log: {
      uniqueCandidateCount: candidates.length,
      evaluatedCandidateCount: 0,
      prunedCandidateCount: 0,
      eligibleCandidateCount: 0,
      timeTakenInMilliseconds: 0,
    },
  };
  const identity = exact.get(value);
  if (identity) {
    result.status = "exact";
    result.bestMatch = value;
    result.matches.push({
      candidate: value,
      candidateIndex: identity.index,
      cost: 0,
      eventCount: 0,
      operations: [],
    });
  } else {
    const input = characters(value);
    const length = input.points.length;
    if (length && length >= policy.minInputLength) {
      for (let index = 0; index < candidates.length; index += 1) {
        const candidate = candidates[index];
        const difference = candidate.points.length - length;
        if (
          !policy.maxCost ||
          difference < -policy.maxEvents ||
          (difference > 0 &&
            (Math.ceil(difference / policy.maxOmissionLength) >
              policy.maxEvents ||
              difference / candidate.points.length > policy.maxOmissionRatio))
        ) {
          result.log.prunedCandidateCount += 1;
        } else {
          result.log.evaluatedCandidateCount += 1;
          const match = score(candidate, input, policy);
          if (match) {
            result.matches.push(match);
          }
        }
        report(Math.floor(((index + 1) * 90) / candidates.length));
      }
      result.matches.sort(
        (left, right) =>
          left.cost - right.cost ||
          (left.candidate < right.candidate
            ? -1
            : left.candidate > right.candidate
              ? 1
              : 0) ||
          left.candidateIndex - right.candidateIndex,
      );
      if (result.matches.length) {
        const [first, second] = result.matches;
        if (
          !second ||
          (first.cost < second.cost &&
            second.cost - first.cost >= policy.minCostGap)
        ) {
          result.status = "matched";
          result.bestMatch = first.candidate;
        } else {
          result.status = "ambiguous";
        }
      }
    }
  }
  result.log.eligibleCandidateCount = result.matches.length;
  result.log.timeTakenInMilliseconds = elapsed(start);
  report(100);
  return result;
}

export function createMatcher(
  candidates: readonly string[],
  options?: Partial<MatchOptions> & CallOptions,
): Matcher {
  const start = Date.now();
  const snapshot = snapshotCandidates(candidates, "createMatcher");
  const { policy, progressFn } = validateOptions(options, "createMatcher");
  const prepared = prepare(snapshot, policy, progress(progressFn), start);
  return {
    log: prepared.log,
    match(input, callOptions) {
      const lookupStart = Date.now();
      validateInput(input, "match");
      const call = validateOptions(callOptions, "match", prepared.policy);
      return lookup(input, prepared, progress(call.progressFn), lookupStart);
    },
  };
}

export function matchTypos(
  input: string,
  candidates: readonly string[],
  options?: Partial<MatchOptions> & CallOptions,
): MatchResult {
  const start = Date.now();
  validateInput(input, "matchTypos");
  const snapshot = snapshotCandidates(candidates, "matchTypos");
  const { policy, progressFn } = validateOptions(options, "matchTypos");
  const report = progress(progressFn);
  const prepared = prepare(
    snapshot,
    policy,
    (value) => report(Math.floor(value / 4)),
    start,
  );
  return lookup(
    input,
    prepared,
    (value) => report(25 + Math.floor((value * 3) / 4)),
    start,
  );
}
