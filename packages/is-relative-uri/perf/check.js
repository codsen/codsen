// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { isRel } from "../dist/is-relative-uri.esm.js";

const callerDir = path.resolve(".");

const testme = () => isRel("//example.com/path///resource.txt");

// action
runPerf(testme, callerDir);
