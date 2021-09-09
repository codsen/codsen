#!/usr/bin/env node

// deps
import path from "path";
import fs from "fs";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.js";

const dummyHTML = fs.readFileSync(
  path.resolve("./perf/dummy_file.html"),
  "utf8"
);

// setup
import { crush } from "../dist/html-crush.esm.js";

const testme = () =>
  crush(dummyHTML, {
    removeLineBreaks: true,
  });

// action
runPerf(testme, callerDir);
