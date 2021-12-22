#!/usr/bin/env node

// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { isProduction4a } from "../dist/charcode-is-valid-xml-name-character.esm.js";

const callerDir = path.resolve(".");

const testme = () => isProduction4a("\uD800\uDC00");

// action
runPerf(testme, callerDir);
