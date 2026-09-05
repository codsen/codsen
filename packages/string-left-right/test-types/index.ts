import {
  chompLeft,
  chompRight,
  leftSeq,
  leftStopAtNewLines,
  leftStopAtRawNbsp,
  rightSeq,
  rightStopAtNewLines,
  rightStopAtRawNbsp,
} from "string-left-right";

rightStopAtNewLines("ab");
rightStopAtNewLines("ab", 0);
rightStopAtNewLines("ab", null);
rightStopAtNewLines("ab", undefined);

rightStopAtRawNbsp("ab");
rightStopAtRawNbsp("ab", 0);
rightStopAtRawNbsp("ab", null);
rightStopAtRawNbsp("ab", undefined);

leftStopAtNewLines("ab");
leftStopAtNewLines("ab", 1);
leftStopAtNewLines("ab", null);
leftStopAtNewLines("ab", undefined);

leftStopAtRawNbsp("ab");
leftStopAtRawNbsp("ab", 1);
leftStopAtRawNbsp("ab", null);
leftStopAtRawNbsp("ab", undefined);

leftSeq("abc", 3, "a", "b", "c");
leftSeq("abc", 3, { i: true }, "A", "B", "C");
rightSeq("abc", -1, "a", "b", "c");
rightSeq("abc", -1, { i: true }, "A", "B", "C");

chompLeft("abc", 3, "a", "b", "c");
chompLeft("abc", 3, null, "a", "b", "c");
chompLeft("abc", 3, undefined, "a", "b", "c");
chompLeft("abc", 3, { mode: 0 }, "a", "b", "c");
chompLeft("abc", 3, { mode: "1" }, "a", "b", "c");
chompLeft("abc", 3, { mode: "" }, "a", "b", "c");
chompLeft("abc", 3, { mode: null }, "a", "b", "c");
chompRight("abc", -1, "a", "b", "c");
chompRight("abc", -1, null, "a", "b", "c");
chompRight("abc", -1, undefined, "a", "b", "c");
chompRight("abc", -1, { mode: 2 }, "a", "b", "c");
chompRight("abc", -1, { mode: "3" }, "a", "b", "c");
chompRight("abc", -1, { mode: undefined }, "a", "b", "c");

// @ts-expect-error -- sequence values are required.
leftSeq("abc", 3);
// @ts-expect-error -- sequence options must be followed by a value.
rightSeq("abc", -1, { i: true });
// @ts-expect-error -- sequence options reject unknown keys.
leftSeq("abc", 3, { caseInsensitive: true }, "a");
// @ts-expect-error -- sequence option values retain their declared types.
rightSeq("abc", -1, { i: "yes" }, "a");
// @ts-expect-error -- sequence match values must be strings.
leftSeq("abc", 3, 1);

// @ts-expect-error -- chomp values are required.
chompLeft("abc", 3);
// @ts-expect-error -- chomp options must be followed by a value.
chompRight("abc", -1, { mode: 0 });
// @ts-expect-error -- chomp options reject unknown keys.
chompLeft("abc", 3, { unknown: true }, "a");
// @ts-expect-error -- unsupported modes are rejected.
chompRight("abc", -1, { mode: 4 }, "a");
// @ts-expect-error -- non-string match values are rejected.
chompLeft("abc", 3, null, 1);
// @ts-expect-error -- null is only supported as the options placeholder.
chompRight("abc", -1, "a", null);

// Named option and result types remain available to strict consumers.
const sequenceOptions: import("string-left-right").Opts = { i: true };
const chompOptions: import("string-left-right").ChompOpts = { mode: "2" };
const sequence: import("string-left-right").SeqOutput | null = rightSeq(
  "ab",
  0,
  sequenceOptions,
  "b",
);
const boundary: number | null = chompLeft("ba", 1, chompOptions, "b");
void sequence;
void boundary;

// @ts-expect-error -- regular expressions are not string matchers.
rightSeq("ab", 0, /b/, "b");
// @ts-expect-error -- booleans cannot select a chomp mode.
chompLeft("ba", 1, { mode: false }, "b");
// @ts-expect-error -- bigint modes are unsupported.
chompRight("ab", 0, { mode: 0n }, "b");
