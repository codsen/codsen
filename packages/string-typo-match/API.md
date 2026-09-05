# Match typing errors against a vocabulary

`matchTypos(input, candidates, options?)` returns every eligible candidate and
an explanation of its typing errors. `createMatcher(candidates, options?)`
prepares a vocabulary for repeated `matcher.match(input, callOptions?)` calls.
Both functions are synchronous. The library has no runtime dependencies.

```js
import { createMatcher } from "string-typo-match";

const matcher = createMatcher(["screen", "print", "speech"]);
const result = matcher.match("scren");
// result.status === "matched"
// result.bestMatch === "screen"
```

Node.js support starts at `18.20.8`. The ESM build exports `matchTypos`,
`createMatcher`, `defaults`, and `version`, plus generated TypeScript types.
The direct-browser `dist/string-typo-match.umd.js` script exposes the same API
as `stringTypoMatch` and targets the repository's Chromium 58 contract.

## Choose a result

`status` is one of four strings:

- `exact`: The literal input exists in the vocabulary. Only that candidate is
  returned, at cost zero. Exact matching works at every nonempty length.
- `matched`: The minimum-cost candidate is unique and leads the next eligible
  candidate by at least `minCostGap`. `bestMatch` contains that candidate.
- `ambiguous`: Candidates tie for minimum cost, or their cost gap is too small.
  `bestMatch` is `null`; the complete suggestions remain available.
- `no-match`: No candidate is eligible. `bestMatch` is `null`, and `matches`
  is empty. Empty input never triggers fuzzy inference.

Costs are engineering weights, not probabilities or confidence percentages.
The library recommends candidates; the caller decides whether to replace text.
An exact cost tie stays ambiguous even with `minCostGap: 0`.

`matches` is ordered by cost, then case-sensitive JavaScript string ordering,
then original index. Every item contains `candidate`, `candidateIndex`, `cost`,
`eventCount`, and `operations`. Exact duplicates are deduplicated and retain the
first original index. Candidate order cannot turn a tie into a unique result.

## Configure the policy

Pass any subset of these options. Nested `costs` overrides merge with defaults.
Exported `defaults` and its nested costs are frozen at runtime and read-only in
TypeScript. Prepared matchers snapshot the supplied candidates and configuration.
Later changes to caller-owned arrays or maps do not affect them.

| Option | Default | Allowed values |
| --- | --- | --- |
| `maxEvents` | `1` | `1` or `2` |
| `maxCost` | `200` | Nonnegative safe integer |
| `minCostGap` | `25` | Nonnegative safe integer |
| `minInputLength` | `3` | Positive safe integer, measured in code points |
| `maxOmissionLength` | `4` | Positive safe integer, per omission run |
| `maxOmissionRatio` | `0.5` | Finite number from `0` to `1`, inclusive |
| `keyboard` | `null` | `null`, `"qwerty"`, or a directed adjacency record |
| `progressFn` | Omitted | Function or `null` |

| Cost key | Default | Event |
| --- | --- | --- |
| `missingCharacter` | `100` | One omitted code point |
| `omissionOpen` | `100` | Initial component of a block omission |
| `omissionExtend` | `20` | Each further omitted code point |
| `extraCharacter` | `100` | One extra input code point |
| `repeatedCharacter` | `75` | Extra copy beside an unchanged retained neighbor |
| `adjacentSwap` | `100` | Two adjacent distinct code points exchange positions |
| `keyboardSubstitution` | `75` | A declared keyboard-neighbor substitution |
| `substitution` | `150` | A general single-character substitution |

Event costs must be positive safe integers, except `omissionExtend`, which may
be zero. A block of length `k >= 2` costs
`omissionOpen + (k - 1) * omissionExtend`. Configuration is rejected if a block
could cost less than a single omission or its configured cost could overflow.
Both the total cost and event count must pass their respective limits.

The omission ratio counts **all** omitted candidate code points divided by the
candidate's code-point length. Two separated omissions cannot each consume the
full ratio allowance. `maxOmissionLength: 1` permits single omissions only;
`maxOmissionRatio: 0` disables omissions. Adjacent omissions are one run and
cannot be split to evade the limits. Whole-candidate omission is never inferred.

## Read an explanation

Operations describe **intended candidate → observed input**. Their kinds are
`missing-character`, `omitted-block`, `repeated-character`, `extra-character`,
`adjacent-swap`, `keyboard-substitution`, and `substitution`.

Each operation has `candidateFrom`, `candidateTo`, `inputFrom`, `inputTo`, and
`cost`. Spans are half-open UTF-16 offsets into the original strings, suitable
for `slice(from, to)`. Matching itself uses Unicode code points. Astral symbols
are not split; lone surrogates remain literal units. Grapheme clusters, Unicode
normalization, case folding, trimming, and HTML syntax are outside the API.

A missing segment has an empty input span. An extra segment has an empty
candidate span. Traverse the operations in order, retaining unchanged spans and
substituting each operation's input span, to reproduce the observed input.
Operation costs sum to `cost`, and their count equals `eventCount`.

This is a local, non-overlapping event model. A swap cannot edit material used
by another event. `CA → ABC`, for example, is excluded even at two events.
A character used in a swap or substitution cannot qualify as the unchanged
neighbor for repetition weighting. A more expensive keyboard or repetition
specialization loses to its cheaper general rule.

For equal-cost explanations of one candidate, prefer fewer events, then compare
operations lexicographically by `(candidateFrom, inputFrom, candidateTo,
inputTo, kind)`. The kind order is the order listed in this section. Thus
`Levenstein → Lenstein` canonically omits `ev` at candidate `[1,3)` and input
`[1,1)`, cost `120`. Omitting `ve` at `[2,4)` produces the same input but is a
later alignment. Multiple explanations of one candidate do not cause ambiguity.

## Make keyboard assumptions explicit

The default `keyboard: null` applies no keyboard weighting. A map such as
`{ t: ["r"] }` permits the intended `t` to be observed as `r`. It does not infer
the reverse edge. Each key and neighbor must be exactly one code point.

The `"qwerty"` preset is a fixed US-QWERTY **letter** adjacency table. Letter
rows use x offsets `0`, `0.25`, and `0.75`, with y coordinates `0`, `1`, and
`2`. Distances of at most `1.3` key spacings are neighbors. Uppercase letters
have the same adjacency within uppercase; cross-case edges, digits, punctuation,
and other layouts are excluded and receive general substitution costs.
The exact table is checked in at [src/qwerty.ts](src/qwerty.ts).

Binary adjacency does not distinguish distances among neighbors. With
`{ o: ["p"], a: ["w"] }`, observed `pwned` ties between `owned` and `paned`.
There is no hidden frequency dictionary, initial-letter preference, graded
distance option, or positional modifier in this API.

## Observe work

`createMatcher` reports preparation progress. `matcher.match` accepts only
`{ progressFn }` per call. To change scoring policy, create another matcher.
`matchTypos` reports combined preparation and lookup progress.

Each successful callback sequence starts at `0`, ends at `100`, increases
monotonically, and reports each integer percentage at most once. The final
callback follows scoring, explanation construction, and ordering. Synchronous
callbacks do not yield to browser painting. Callback exceptions propagate; they
do not corrupt a prepared matcher for its next call.

`matcher.log` contains `candidateCount`, `uniqueCandidateCount`, and
`timeTakenInMilliseconds`. Result `log` contains `uniqueCandidateCount`,
`evaluatedCandidateCount`, `prunedCandidateCount`, `eligibleCandidateCount`, and
`timeTakenInMilliseconds`. Evaluated candidates entered approximate scoring;
pruned candidates failed a sound bound. Deduplication and exact-lookup bypasses
count as neither evaluated nor pruned. Timing is nonnegative best-effort elapsed
milliseconds and never affects matching decisions.

Results contain plain JSON-compatible data and can cross `postMessage()`.
A prepared matcher contains a function and is not a transferable result.
Invalid input types, unknown option keys, invalid weights, and invalid keyboard
entries throw numbered `string-typo-match/<function>(): [THROW_ID_XX]` errors.
