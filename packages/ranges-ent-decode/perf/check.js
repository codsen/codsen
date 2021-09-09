#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.js";

// setup
import { rEntDecode } from "../dist/ranges-ent-decode.esm.js";

const testme = () => rEntDecode("foo&#x1D306qux");

// action
runPerf(testme, callerDir);
