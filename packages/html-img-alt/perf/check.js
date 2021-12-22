#!/usr/bin/env node

// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { alts } from "../dist/html-img-alt.esm.js";

const callerDir = path.resolve(".");

const testme = () => alts("zzz<img           /    >zzz");

// action
runPerf(testme, callerDir);
