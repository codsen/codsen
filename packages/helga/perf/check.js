// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { helga } from "../dist/helga.esm.js";

const callerDir = path.resolve(".");

const testme = () => helga("abc\ndef", { targetJSON: true });

// action
runPerf(testme, callerDir);
