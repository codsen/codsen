declare const version: string;
interface TypoCosts {
  missingCharacter: number;
  omissionOpen: number;
  omissionExtend: number;
  extraCharacter: number;
  repeatedCharacter: number;
  adjacentSwap: number;
  keyboardSubstitution: number;
  substitution: number;
}
type Keyboard = null | "qwerty" | Readonly<Record<string, readonly string[]>>;
interface MatchOptions {
  maxEvents: 1 | 2;
  maxCost: number;
  minCostGap: number;
  minInputLength: number;
  maxOmissionLength: number;
  maxOmissionRatio: number;
  keyboard: Keyboard;
  costs: Partial<TypoCosts>;
}
interface CallOptions {
  progressFn?: ((percentage: number) => void) | null;
}
interface PreparationLog {
  candidateCount: number;
  uniqueCandidateCount: number;
  timeTakenInMilliseconds: number;
}
interface MatchLog {
  uniqueCandidateCount: number;
  evaluatedCandidateCount: number;
  prunedCandidateCount: number;
  eligibleCandidateCount: number;
  timeTakenInMilliseconds: number;
}
type TypoKind =
  | "missing-character"
  | "omitted-block"
  | "repeated-character"
  | "extra-character"
  | "adjacent-swap"
  | "keyboard-substitution"
  | "substitution";
interface TypoOperation {
  kind: TypoKind;
  candidateFrom: number;
  candidateTo: number;
  inputFrom: number;
  inputTo: number;
  cost: number;
}
interface CandidateMatch {
  candidate: string;
  candidateIndex: number;
  cost: number;
  eventCount: number;
  operations: TypoOperation[];
}
interface MatchResult {
  status: "exact" | "matched" | "ambiguous" | "no-match";
  bestMatch: string | null;
  matches: CandidateMatch[];
  log: MatchLog;
}
interface Matcher {
  match(input: string, options?: CallOptions): MatchResult;
  readonly log: Readonly<PreparationLog>;
}
declare const defaults: Readonly<{
  maxEvents: 1 | 2;
  maxCost: 200;
  minCostGap: 25;
  minInputLength: 3;
  maxOmissionLength: 4;
  maxOmissionRatio: 0.5;
  keyboard: null;
  costs: Readonly<{
    missingCharacter: 100;
    omissionOpen: 100;
    omissionExtend: 20;
    extraCharacter: 100;
    repeatedCharacter: 75;
    adjacentSwap: 100;
    keyboardSubstitution: 75;
    substitution: 150;
  }>;
}>;
declare function createMatcher(
  candidates: readonly string[],
  options?: Partial<MatchOptions> & CallOptions,
): Matcher;
declare function matchTypos(
  input: string,
  candidates: readonly string[],
  options?: Partial<MatchOptions> & CallOptions,
): MatchResult;

export { createMatcher, defaults, matchTypos, version };
export type {
  CallOptions,
  CandidateMatch,
  Keyboard,
  MatchLog,
  MatchOptions,
  MatchResult,
  Matcher,
  PreparationLog,
  TypoCosts,
  TypoKind,
  TypoOperation,
};
