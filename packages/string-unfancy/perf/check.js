#!/usr/bin/env node

// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { unfancy } from "../dist/string-unfancy.esm.js";

const callerDir = path.resolve(".");

const testme = () => unfancy("zzz&amp;amp;rsquo;zzz\n“zzz”");

// action
runPerf(testme, callerDir);
