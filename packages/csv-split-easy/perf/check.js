// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { splitEasy } from "../dist/csv-split-easy.esm.js";

const callerDir = path.resolve(".");

const testme = () => splitEasy("a,b,c\n\r,,\n\r,,\n,,\n,,\r,,\n,,\n,d,");

// action
runPerf(testme, callerDir);
