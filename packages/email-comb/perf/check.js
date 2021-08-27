#!/usr/bin/env node

// deps
import path from "path";
import fs from "fs";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.mjs";

// setup
import { comb } from "../dist/email-comb.esm.js";

const source = fs.readFileSync(path.resolve("./perf/dummy_file.html"), "utf8");
const testme = () =>
  comb(source, {
    uglify: true,
  });

// action
runPerf(testme, callerDir);
