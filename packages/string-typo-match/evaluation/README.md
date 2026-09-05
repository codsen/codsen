# Evaluation and reproduction

The runtime policy and QWERTY table were frozen at the initial specification's
defaults before evaluating the held-out set. No weights were tuned on those
cases. `corpus-v1.json` contains 35 observed repository typo pairs, their exact
controls, and 14 ambiguity, omission, and negative controls. Intended candidates
are disjoint between development and held-out sets.

The observed inputs come from the maintainer's
`logs/cspell-flagged-words-20260905-161938.txt` inventory, whose SHA-256 and line
references are recorded in the corpus. Intended corrections are inferred from
the words and available context. Some inputs were deliberate test fixtures.
Other inventory flags are valid names or identifiers, and were not reclassified
as typing mistakes. The corpus is a selected engineering check, not a random
sample or an estimate of population spelling accuracy. No source typos were
corrected for this work.

After building the package, run from the monorepo root:

```sh
node packages/string-typo-match/evaluation/run.js
```

`results-v1.json` records 18/18 development and 17/17 held-out unique repairs,
all 35 identity controls preserved, and all 14 regression outcomes satisfied.
There are no incorrect unique choices in this corpus. The report also groups
results by event family, input length, omission length, vocabulary size, and
provenance. The observed pairs share a 41-word evaluation vocabulary; success
does not imply the same decisions in an unrestricted dictionary.

The paired `pwned` experiment independently compares ordinary substitution,
binary adjacency, graded key distance, and binary adjacency plus an initial
position discount. The latter two favour `owned`. That helps when `owned` is
intended and hurts when `paned` is intended. Device and actual layout data are
unavailable. The runtime API therefore retains explicit binary adjacency and
does not expose a positional modifier or graded-distance policy.

## Compare runtime work

The optional benchmark requires pinned comparison libraries in a separate
temporary installation. They are not workspace or production dependencies.
Install them with lifecycle scripts disabled:

```sh
npm install --prefix /tmp/string-typo-match-comparators --ignore-scripts \
  --no-audit --no-fund cspell-trie-lib@10.2.1 @nlptools/distance@0.0.8
```

The second argument is a directory holding the **previous** consumer builds as
`entity-fixer.mjs` and `media-descriptor.mjs`, plus an unpacked `leven@4.1.0`
package at `leven/index.js`. Capture those before replacing the dependency.
Those saved ESM files must resolve their original imports. In the baseline
directory, provide `node_modules/leven` pointing to its saved package and links
for the unchanged `all-named-html-entities`, `codsen-utils`, `string-left-right`,
and `string-process-comma-separated` workspace packages. This keeps the old
dependency local to the comparison directory.
Then run:

```sh
node --expose-gc packages/string-typo-match/evaluation/benchmark.js \
  /tmp/string-typo-match-comparators /tmp/string-typo-match-baseline
```

Append `--check` to run comparator assertions and quality without timing, or
`--consumers` for longer sampling of just the consumer before/after workloads.
`compare-consumers.js` reproduces the full migration corpus with
`--baseline-entity`, `--baseline-media`, and `--output` arguments. Its optional
`--default-policy-results` argument adds the saved initial-policy trial; the
final before/after comparison does not depend on that trial file.

Each run measures `perf-ref` and reports normalized scores as
`targetRate * opsPerSec / referenceRate`, together with sampling error. Every
matrix lookup includes all probes for that vocabulary. Candidate preparation,
one-shot lookup, and repeated prepared lookup are separate workloads. Prepared
lookup includes explanations and result ordering; preparation is outside it.
Progress callbacks are absent. The full HTML entity inventory's version and
hash are recorded. Identifier vocabularies, increasing dictionary sizes, long
omissions, distant misses, ambiguity, swaps, two events, and repetitive strings
provide additional workloads.

The comparison scorers have different semantics:

- The capped unit-distance baseline has no weighted events or block omissions.
  Its saturation cap is above the acceptance threshold.
- CSpell uses configurable insertion/deletion and swap costs of 100, general
  substitution cost 150, and no keyboard, repetition, or arbitrary block rule.
- The affine-gap scorer uses mismatch cost 150, gap opening 100, and extension
  20. It allows insertions and omissions as gaps, without this library's event,
  ratio, or block-length limits, and has no swap specialization.

Comparison wrappers scan the same candidates, preserve exact matches, sort
eligible results, and use the same default cost gap. The full quality corpus
is also run through them, with differences listed. They do not construct
operation explanations or implement every policy override. Their throughput
is therefore not an equivalent-result speed-up claim.

Retained heap is estimated from 30 simultaneously retained matchers with
explicit garbage collection; it is approximate and excludes temporary lookup
allocations. Raw, gzip, and Brotli browser-bundle sizes are recorded. The normal
package `perf/check.js` establishes its own stable history: six prepared
identifier lookups per invocation, explanations included, no callbacks.

The full repeated run, using `maxEvents: 2`, is recorded in
`benchmark-results-v1.json`. Preparing
2,125 HTML names averaged 0.31 ms and retained approximately 751 KiB; preparing
41 identifier words averaged 0.0061 ms and retained approximately 15.4 KiB.
The browser bundle is 12,257 bytes, 4,364 gzip bytes, or 3,942 Brotli bytes.

| Workload | Normalized score |
| --- | ---: |
| HTML preparation | 1,192 |
| HTML one-shot, seven queries | 96.4 |
| HTML prepared, seven queries | 279 |
| HTML capped distance, seven queries | 391 |
| HTML CSpell weighted, seven queries | 0.243 |
| HTML affine gap, seven queries | 22.8 |
| Identifier preparation | 60,670 |
| Identifier one-shot, six queries | 4,520 |
| Identifier prepared, six queries | 8,387 |

The prepared weighted matcher does more work than capped unit distance and
scores lower on that scalar comparison. It adds the bounded event model,
complete explanations, and weighted ambiguity. The complete scan is retained
because preparation is small, memory is bounded by vocabulary content, and the
consumer typo workloads improve; a more elaborate index has no measured need
yet. Scores for 100, 1,000, and 10,000 identifier candidates were approximately
37,301, 3,717, and 365 respectively, consistent with a complete linear scan.
Sampling error is recorded per workload; some fast workloads remain noisy.

The longer consumer repeat is in `benchmark-consumers-v1.json`. Existing entity
and media perf fixtures changed by +0.4% and -0.7%, within the repository's 2%
noise band. The explicit entity-typo batch scored 295 before and 547 after
(+85%). The media-typo batch scored 49,986 before and 57,364 after (+15%), with
9.8% sampling error on the latter; the broader repeat measured +40%. Treat the
media improvement's size as uncertain. These compare the applications' final
behaviour, including conservative abstentions, rather than identical outputs.

## Focused comparison with leven

`benchmark-leven-use-cases.js` compares the default one-event policy separately
from optional two-event matching. It uses all 2,125 HTML names, all 11 media
names, and all 35 observed repository typos against their 41-word vocabulary.
The saved pre-migration consumers and local `leven@4.1.0` package described
above are its only external baseline requirements:

```sh
node packages/string-typo-match/evaluation/benchmark-leven-use-cases.js \
  /tmp/string-typo-match-baseline
```

Append `--check` for deterministic viability checks or `--focus` for the longer
repeat of selected comparisons. JSON is written to standard output and progress
to standard error. Source hashes, exact samples, decisions, runtime versions,
sample counts, and relative margins of error are retained in each report.

`benchmark-leven-use-cases-v1.json` records two rounds with reversed workload
order. `benchmark-leven-use-cases-focused-v1.json` records a longer repeat after
several comparisons had large error bars in the first round. Each round measures
`perf-ref` afresh. The following generic lookup scores use the focused repeat;
the consumer typo scores use the cleaner second full round.

| Workload | Current score | Leven score | Throughput ratio |
| --- | ---: | ---: | ---: |
| HTML names, seven queries, prepared/default | 734 | 600 | 1.22× |
| Media names, seven queries, prepared/default | 88,601 | 94,495 | 0.94× |
| Repository typos, 35 queries, prepared/default | 3,712 | 2,094 | 1.77× |
| Repository typos, 35 queries, one-shot/default | 1,213 | 2,094 | 0.58× |
| Repository typos, 35 queries, prepared/two events | 1,619 | 2,094 | 0.77× |
| Repository typos, 35 queries, one-shot/two events | 926 | 2,094 | 0.44× |
| Entity-typo consumer batch | 539 | 295 | 1.83× |
| Media-typo consumer batch | 69,955 | 48,413 | 1.45× |

These are normalized scores, with higher scores meaning greater throughput.
Only compare values within a row. The focused run's reference had 9.1% relative
margin of error, so its absolute normalized scores are less stable than the
within-run ratios, which share and cancel that reference. Individual target
errors remain relevant: they were approximately 0.2–4.3% for generic lookups
in this repeat. The previous cleaner round corroborated the direction and
approximate size of these differences.

The entity-typo consumer ratio was 1.83× in both full rounds; the media ratio
was 1.36–1.45×. Existing parser fixtures varied between runs. In the focused
repeat, the entity fixture was approximately 6% slower and the media fixture
approximately 10% slower; do not advertise improvements or guaranteed parity
for those paths. Package benchmark histories were not changed by this experiment.

All three observed-typo methods (default, two events, and capped leven) uniquely
repaired all 35 selected words in the restricted vocabulary. This subset proves
viability but does not establish accuracy superiority. Other decisions differ:
for example, `nbps` uniquely selects `nbsp` with the default matcher but is
ambiguous under the capped scalar scorer over the full HTML inventory.

There is no general faster-than-leven claim. Prepared default lookups and the
actual typo-repair consumers improve on some selected workloads; one-shot calls,
two-event scoring, and small vocabularies can cost more. The new matcher also
constructs explanations and completion statistics and applies different event
limits, so the measurements do not compare equivalent results.

## Consumer migration

Both consumers use prepared matchers and accept only a sole eligible suggestion.
The media descriptor explicitly permits fuzzy inputs from two code points, so
its existing `al → all` behaviour remains supported. Competing suggestions are
reported as unrecognised with `fix: null`.

The entity fixer considers omission competitors up to the configured block
length even when they omit more than half the candidate. They can veto a guess,
but cannot become an accepted correction: the chosen candidate must still
preserve at least half its code points. This conservative check removes new
false unique repairs caused by a competing intended candidate falling just
outside the acceptance ratio. The established `rsqo → rsquo` correction remains
an explicit entity-specific exception.

Exact/case handling, curated broken names, parsing, decoding, document offsets,
diagnostic names, and callback behaviour stay in the entity fixer. An ambiguous
or unmatched entity retains its existing unrecognised diagnostic and deletion
range convention. The general matcher never instructs a caller to delete text.

The migration audit covers all 2,125 entity names and 13,412 deterministic
mutations, plus 292 media cases. All 288 original unit tests pass; eight new
consumer tests protect the migration. The entity audit records 625 newly correct
repairs, 1,632 newly declined guesses, and zero new different-intention repairs.
Total correct repairs decrease from 7,883 to 7,844; repairs to a different entity
decrease from 1,131 to 48. Those remaining 48 come from pre-existing case handling
or curated mappings, rather than the new typo stage. Synthetic intentions are
known only because the audit generated them; real input alone cannot prove intent.

The sibling website has no playground or worker directly calling these two
consumers. Its new `app/routes/os/string-typo-match.mdx` page documents the API,
examples, costs, ambiguity, Unicode offsets, progress, and measured performance
limitations. The entity-fixer page now links the new dependency and describes
the one-event policy. No new website playground is included.
