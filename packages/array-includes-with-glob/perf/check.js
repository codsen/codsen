// deps
import path from "node:path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { includesWithGlob } from "../dist/array-includes-with-glob.esm.js";

const callerDir = path.resolve(".");

const testme = () =>
  includesWithGlob(["something", "anything", "everything"], ["some*", "zzz"], {
    arrayVsArrayAllMustBeFound: "any",
  });

// action
runPerf(testme, callerDir);
