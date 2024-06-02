// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { pathNext } from "../dist/ast-monkey-util.esm.js";

const callerDir = path.resolve(".");

const testme = () => pathNext("9.children.3");

// action
runPerf(testme, callerDir);
