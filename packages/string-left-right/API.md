# API contract

`left()` and `right()` find the nearest non-whitespace UTF-16 code unit on
one side of an exclusive index boundary. The code unit at `idx` is excluded.
All returned indexes and half-open ranges use UTF-16 code-unit offsets.

## Indexes

The six basic and stop helpers accept an optional `number | null` index.
Omitting it, or passing `null` or `undefined`, uses `0`. Sequence and chomp
calls require a numeric index in TypeScript.

All ten functions return `null` for fractional or non-finite indexes.
Unsupported JavaScript index types also return `null`. Leftward functions
accept non-negative integers and clamp values above `str.length` to the end.
Rightward functions accept integers starting at `-1`; that boundary includes
index `0`. Rightward indexes at or beyond the end return `null`.

The basic helpers skip code units whose one-code-unit string trims to empty.
The `StopAtNewLines` helpers also stop at CR or LF. The `StopAtRawNbsp`
helpers also stop at raw U+00A0. An absent result is `null`, including when the
input is empty or is not a string.

## Sequences

```ts
leftSeq(str, idx, value, ...values);
rightSeq(str, idx, { i: true }, value, ...values);
```

Both functions accept either call shape. Supply matchers in source order,
including for leftward matching. `Opts.i` enables case-insensitive comparison
using JavaScript's `toLowerCase()`.

Each matcher represents one UTF-16 code unit, optionally followed by `?`
(zero or one), `*` (one or more, greedy), or `?*` / `*?` (zero or more,
greedy). A bare `?` or `*` matches that literal code unit. Greedy matching
does not backtrack: a later required matcher must match a separate code unit.
Whitespace between matches is ignored.

An empty-string matcher is skipped for compatibility. Any non-string matcher
invalidates the whole sequence and returns `null`; it is never silently
removed. Comparison reads one input code unit at a time. Case-insensitive comparison
can expand a code unit when lowercasing it, as with `İ`. A
sequence that consumes no code units returns `null`. Omitting every matcher
throws a tagged input-validation error; passing only an options object
returns `null`. TypeScript requires at least one string matcher.

A successful `SeqOutput` contains inclusive `leftmostChar` and `rightmostChar`
indexes plus `gaps`: skipped whitespace spans, including any span between
`idx` and the nearest match. Each gap is `[start, end)` and gaps are returned
in ascending source order.

## Chomp boundaries

```ts
chompLeft(str, idx, value, ...values);
chompRight(str, idx, { mode: 2 }, value, ...values);
```

Both chomp functions accept either call shape. They repeatedly match complete
sequences, then return an outer range boundary: the inclusive left boundary
for `chompLeft()`, or the exclusive right boundary for `chompRight()`.
An incomplete repetition does not extend the matched range. No complete
match returns `null`.

Match values follow the sequence rules. Chomp has no case-insensitive option.
Its options placeholder can be a `ChompOpts` object, `null`, or `undefined`.
A non-string value elsewhere invalidates the match. Calls without values
return `null` at runtime and are rejected by TypeScript.

| Mode | Whitespace outside the final complete match |
| --- | --- |
| `0` | Keep one whitespace code unit before the next solid code unit when possible; stop before CR or LF |
| `1` | Preserve all whitespace |
| `2` | Consume whitespace up to CR, LF, a solid code unit, or the string boundary |
| `3` | Consume all whitespace up to a solid code unit or the string boundary |

Use numeric modes. Numeric strings `"0"` through `"3"` remain accepted.
An omitted mode, `undefined`, `null`, or `""` selects mode `0`. Other values,
including booleans, `NaN`, bigints, symbols, fractions, and out-of-range
numbers, throw a tagged validation error.

## Unicode examples

An astral symbol such as `😀` occupies two code units. Match its surrogate
halves separately (`"\ud83d"`, `"\ude00"`) when needed. Basic traversal can
return the index of either half. Combining marks also occupy their own
indexes: `"e\u0301"` takes two matchers and is not normalized to `"é"`.
Lone surrogates are matched as individual code units. Matching does not
segment graphemes or normalize Unicode.

`Opts`, `ChompOpts`, and `SeqOutput` are exported TypeScript types. See the
runnable files in `examples/` for complete imports and results.
