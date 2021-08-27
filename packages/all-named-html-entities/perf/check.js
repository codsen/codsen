#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.mjs";

// setup
import { decode } from "../dist/all-named-html-entities.esm.js";

const testme = () => decode("&aleph;");

// action
runPerf(testme, callerDir);
