// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { nonEmpty } from "../dist/util-nonempty.esm.js";

const callerDir = path.resolve(".");

const testme = () => nonEmpty([[[[[[[[[[[[[[[[[[[[]]]]]]]]]]]]]]]]]]]]);

// action
runPerf(testme, callerDir);
