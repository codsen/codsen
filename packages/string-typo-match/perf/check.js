import path from "node:path";
import { runPerf } from "../../../ops/scripts/perf.js";
import { createMatcher } from "../dist/string-typo-match.esm.js";

// Preparation is outside the measured lookup. Explanations are included;
// progress callbacks are absent. Each invocation performs all six lookups.
const matcher = createMatcher(
  [
    "screen",
    "print",
    "speech",
    "projection",
    "handheld",
    "embossed",
    "Levenstein",
    "Einstein",
    "constructor",
    "prototype",
    "parameter",
  ],
  { maxEvents: 2 },
);
const inputs = ["screen", "scren", "prnit", "Lenstein", "scrrenx", "unknown"];
const testme = () => inputs.map((input) => matcher.match(input));

runPerf(testme, path.resolve("."));
