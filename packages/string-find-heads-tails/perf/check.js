// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { strFindHeadsTails } from "../dist/string-find-heads-tails.esm.js";

const callerDir = path.resolve(".");

const testme = () => strFindHeadsTails("abc%%_def_%%ghi", "%%_", "_%%");

// action
runPerf(testme, callerDir);
