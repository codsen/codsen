// deps
import path from "node:path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { collapse } from "../dist/string-collapse-white-space.esm.js";

const callerDir = path.resolve(".");

const testme = () =>
  collapse(" a \n \n b ", {
    trimLines: false,
    trimnbsp: true,
    removeEmptyLines: false,
  });

// action
runPerf(testme, callerDir);
