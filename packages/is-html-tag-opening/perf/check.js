// deps
import path from "node:path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { isOpening } from "../dist/is-html-tag-opening.esm.js";

const callerDir = path.resolve(".");

const testme = () => isOpening("zzz<img           /    >zzz", 3);

// action
runPerf(testme, callerDir);
