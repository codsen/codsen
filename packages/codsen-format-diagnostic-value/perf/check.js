// deps
import path from "node:path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { formatDiagnosticValue } from "../dist/codsen-format-diagnostic-value.esm.js";

const callerDir = path.resolve(".");

const testme = () => formatDiagnosticValue({ input: ["value", 1, true, null] });

// action
runPerf(testme, callerDir);
