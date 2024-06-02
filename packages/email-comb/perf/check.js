// deps
import path from "path";
import fs from "fs";

import { runPerf } from "../../../ops/scripts/perf.js";
import { comb } from "../dist/email-comb.esm.js";

const callerDir = path.resolve(".");

const source = fs.readFileSync(path.resolve("./perf/dummy_file.html"), "utf8");
const testme = () =>
  comb(source, {
    uglify: true,
  });

// action
runPerf(testme, callerDir);
