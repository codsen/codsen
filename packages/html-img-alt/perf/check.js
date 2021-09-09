#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.js";

// setup
import { alts } from "../dist/html-img-alt.esm.js";

const testme = () => alts("zzz<img           /    >zzz");

// action
runPerf(testme, callerDir);
