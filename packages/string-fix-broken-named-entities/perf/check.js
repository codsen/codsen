// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { fixEnt } from "../dist/string-fix-broken-named-entities.esm.js";

const callerDir = path.resolve(".");

const testme = () => fixEnt("&&NbSpzzz&&NbSpzzz\ny &isindot; z\n&nsp;\n&pound");

// action
runPerf(testme, callerDir);
