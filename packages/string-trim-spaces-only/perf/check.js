// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { trimSpaces } from "../dist/string-trim-spaces-only.esm.js";

const callerDir = path.resolve(".");

const testme = () => trimSpaces("   \n  a a  \n   ");

// action
runPerf(testme, callerDir);
