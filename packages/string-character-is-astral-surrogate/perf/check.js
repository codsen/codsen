// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { isHighSurrogate } from "../dist/string-character-is-astral-surrogate.esm.js";

const callerDir = path.resolve(".");

const testme = () => isHighSurrogate("\uD83E");

// action
runPerf(testme, callerDir);
