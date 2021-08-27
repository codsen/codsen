#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.mjs";

// setup
import { isOpening } from "../dist/is-html-tag-opening.esm.js";

const testme = () => isOpening("zzz<img           /    >zzz");

// action
runPerf(testme, callerDir);
