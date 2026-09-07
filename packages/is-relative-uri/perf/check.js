// deps
import { strict as assert } from "node:assert";
import path from "node:path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { isRel } from "../dist/is-relative-uri.esm.js";

const callerDir = path.resolve(".");

// A valid network-path reference reaches URI classification after validation.
const testme = () => isRel("//example.com/path/resource.txt");

assert.deepEqual(testme(), { res: true, message: null });

// action
runPerf(testme, callerDir);
