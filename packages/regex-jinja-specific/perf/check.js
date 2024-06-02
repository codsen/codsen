// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { isJinjaSpecific } from "../dist/regex-jinja-specific.esm.js";

const callerDir = path.resolve(".");

const testme = () => isJinjaSpecific();

// action
runPerf(testme, callerDir);
