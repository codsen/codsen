// deps
import { strict as assert } from "node:assert";
import path from "node:path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { isMediaD } from "../dist/is-media-descriptor.esm.js";

const callerDir = path.resolve(".");

// Balanced queries reach descriptor parsing after the preliminary checks.
const testme = () => isMediaD("screen and (color), projection and (color)");

assert.deepEqual(testme(), []);

// action
runPerf(testme, callerDir);
