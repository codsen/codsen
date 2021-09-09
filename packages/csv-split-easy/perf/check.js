#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.js";

// setup
import { splitEasy } from "../dist/csv-split-easy.esm.js";

const testme = () => splitEasy("a,b,c\n\r,,\n\r,,\n,,\n,,\r,,\n,,\n,d,");

// action
runPerf(testme, callerDir);
