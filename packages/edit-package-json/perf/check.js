#!/usr/bin/env node

// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { set } from "../dist/edit-package-json.esm.js";

const callerDir = path.resolve(".");

const testme = () => set('{ "a": "b", "c": { "d": ["e"] } }', "c.d", 1);

// action
runPerf(testme, callerDir);
