#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.js";

// setup
import { isMediaD } from "../dist/is-media-descriptor.esm.js";

const testme = () => isMediaD("screen and (color), projection and ((color)");

// action
runPerf(testme, callerDir);
