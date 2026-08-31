// deps
import path from "node:path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { includesWithGlob } from "../dist/array-includes-with-glob.esm.js";

const callerDir = path.resolve(".");

const source = Object.freeze(
  Array.from({ length: 64 }, (_value, index) => {
    if (index === 47) return "release-main.js";
    if (index === 63) return "theme-default.css";
    return `asset-${index}.txt`;
  }),
);
const patterns = Object.freeze(["release-*.js", "theme-*.css", "!*.test.js"]);
const options = Object.freeze({ arrayVsArrayAllMustBeFound: "all" });

const testme = () => includesWithGlob(source, patterns, options);

if (testme() !== true) {
  throw new Error("The performance workload must exercise a successful match.");
}

// action
runPerf(testme, callerDir);
