// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { decode } from "../dist/all-named-html-entities.esm.js";

const callerDir = path.resolve(".");

const testme = () => decode("&aleph;");

// action
runPerf(testme, callerDir);
