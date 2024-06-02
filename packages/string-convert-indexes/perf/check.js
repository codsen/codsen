// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { unicodeToNative } from "../dist/string-convert-indexes.esm.js";

const callerDir = path.resolve(".");

const testme = () => unicodeToNative("\uD834\uDF06aa", [1, 0, 2]);

// action
runPerf(testme, callerDir);
