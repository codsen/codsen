#!/usr/bin/env node

// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { rEntDecode } from "../dist/ranges-ent-decode.esm.js";

const callerDir = path.resolve(".");

const testme = () => rEntDecode("foo&#x1D306qux");

// action
runPerf(testme, callerDir);
