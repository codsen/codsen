#!/usr/bin/env node

// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { isMediaD } from "../dist/is-media-descriptor.esm.js";

const callerDir = path.resolve(".");

const testme = () => isMediaD("screen and (color), projection and ((color)");

// action
runPerf(testme, callerDir);
