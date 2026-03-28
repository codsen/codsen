// deps

import fs from "node:fs";
import path from "node:path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { crush } from "../dist/html-crush.esm.js";

const callerDir = path.resolve(".");

const dummyHTML = fs.readFileSync(
  path.resolve("./perf/dummy_file.html"),
  "utf8",
);

const testme = () =>
  crush(dummyHTML, {
    removeLineBreaks: true,
  });

// action
runPerf(testme, callerDir);
